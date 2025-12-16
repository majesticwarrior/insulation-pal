import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY)
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Common spam email domains
const SPAM_EMAIL_DOMAINS = [
  'tempmail.com',
  'guerrillamail.com',
  'mailinator.com',
  '10minutemail.com',
  'throwaway.email',
  'temp-mail.org',
  'getnada.com',
  'mohmal.com',
  'fakeinbox.com',
  'trashmail.com',
  'yopmail.com',
  'sharklasers.com',
  'grr.la',
  'maildrop.cc',
  'dispostable.com',
  'mintemail.com',
  'mytrashmail.com',
  'spamgourmet.com',
  'spamhole.com',
  'spamtraps.com'
]

// Suspicious patterns
const SUSPICIOUS_PATTERNS = {
  name: /^(test|admin|spam|fake|bot|user\d+|temp|demo|sample)/i,
  businessName: /^(test|spam|fake|bot|temp|demo|sample|company\d+)/i,
  email: /^(test|admin|spam|fake|bot|user\d+|temp|demo|sample)@/i,
  phone: /^(123|000|111|555|999)/,
  licenseNumber: /^(test|spam|fake|bot|temp|demo|sample|123|000|111)/i
}

// Rate limiting: Check for recent submissions
async function checkRateLimit(email: string, ip: string): Promise<{ allowed: boolean; message?: string }> {
  // Check by email (last 24 hours)
  const { data: recentByEmail } = await supabaseAdmin
    .from('users')
    .select('created_at')
    .eq('email', email)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .limit(1)

  if (recentByEmail && recentByEmail.length > 0) {
    return {
      allowed: false,
      message: 'An account with this email was recently registered. Please wait 24 hours or contact support.'
    }
  }

  // Check by IP (last hour) - store in a separate table or use existing logs
  // For now, we'll check contractors table for same IP pattern
  // Note: You may want to create a separate rate_limit_logs table for better tracking
  
  return { allowed: true }
}

// Validate email domain
function validateEmailDomain(email: string): { valid: boolean; message?: string } {
  const domain = email.split('@')[1]?.toLowerCase()
  
  if (!domain) {
    return { valid: false, message: 'Invalid email format' }
  }

  if (SPAM_EMAIL_DOMAINS.includes(domain)) {
    return { valid: false, message: 'Temporary or disposable email addresses are not allowed' }
  }

  return { valid: true }
}

// Validate for suspicious patterns
function validateSuspiciousPatterns(data: {
  name: string
  email: string
  businessName: string
  phone: string
  licenseNumber: string
}): { valid: boolean; message?: string } {
  if (SUSPICIOUS_PATTERNS.name.test(data.name)) {
    return { valid: false, message: 'Invalid name format' }
  }

  if (SUSPICIOUS_PATTERNS.businessName.test(data.businessName)) {
    return { valid: false, message: 'Invalid business name format' }
  }

  if (SUSPICIOUS_PATTERNS.email.test(data.email)) {
    return { valid: false, message: 'Invalid email format' }
  }

  if (SUSPICIOUS_PATTERNS.phone.test(data.phone.replace(/\D/g, ''))) {
    return { valid: false, message: 'Invalid phone number format' }
  }

  if (SUSPICIOUS_PATTERNS.licenseNumber.test(data.licenseNumber)) {
    return { valid: false, message: 'Invalid license number format' }
  }

  return { valid: true }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      password,
      businessName,
      licenseNumber,
      city,
      honeypot, // Hidden field that bots will fill
      formStartTime // When user started filling the form
    } = body

    // 1. Honeypot check - if filled, it's a bot
    if (honeypot && honeypot.trim() !== '') {
      console.log('🚫 Spam detected: Honeypot field filled')
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 }
      )
    }

    // 2. Time-based validation - form should take at least 10 seconds to fill
    if (formStartTime) {
      const timeSpent = Date.now() - formStartTime
      const minimumTime = 10000 // 10 seconds in milliseconds
      
      if (timeSpent < minimumTime) {
        console.log('🚫 Spam detected: Form filled too quickly', { timeSpent })
        return NextResponse.json(
          { error: 'Please take your time filling out the form' },
          { status: 400 }
        )
      }
    }

    // 3. Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // 4. Rate limiting check
    const rateLimitCheck = await checkRateLimit(email, ip)
    if (!rateLimitCheck.allowed) {
      console.log('🚫 Rate limit exceeded:', { email, ip })
      return NextResponse.json(
        { error: rateLimitCheck.message || 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // 5. Email domain validation
    const emailValidation = validateEmailDomain(email)
    if (!emailValidation.valid) {
      console.log('🚫 Invalid email domain:', email)
      return NextResponse.json(
        { error: emailValidation.message || 'Invalid email address' },
        { status: 400 }
      )
    }

    // 6. Suspicious pattern validation
    const patternValidation = validateSuspiciousPatterns({
      name,
      email,
      businessName,
      phone,
      licenseNumber
    })
    if (!patternValidation.valid) {
      console.log('🚫 Suspicious pattern detected:', patternValidation.message)
      return NextResponse.json(
        { error: patternValidation.message || 'Invalid input detected' },
        { status: 400 }
      )
    }

    // 7. Check if email already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // 8. Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // 9. Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

    // 10. Insert user with verification token
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        name,
        phone,
        user_type: 'contractor',
        email_verified: false,
        verification_token: verificationToken,
        verification_token_expiry: verificationTokenExpiry.toISOString()
      })
      .select()
      .single()

    if (userError) {
      console.error('Error creating user:', userError)
      return NextResponse.json(
        { error: 'Failed to create account', details: userError.message },
        { status: 500 }
      )
    }

    // 11. Insert contractor
    const contractorData = {
      user_id: user.id,
      business_name: businessName,
      license_number: licenseNumber,
      business_city: city,
      status: 'pending'
    }

    // Try with auth fields first
    try {
      const contractorWithAuth = {
        ...contractorData,
        email,
        password_hash: passwordHash,
        contact_phone: phone,
        contact_email: email
      }

      const { data: contractor, error: contractorError } = await supabaseAdmin
        .from('contractors')
        .insert(contractorWithAuth)
        .select()
        .single()

      if (contractorError) throw contractorError
    } catch (authFieldError) {
      // Fallback to basic contractor creation
      console.log('Falling back to basic contractor creation:', authFieldError)
      
      const { data: contractor, error: contractorError } = await supabaseAdmin
        .from('contractors')
        .insert(contractorData)
        .select()
        .single()

      if (contractorError) {
        console.error('Error creating contractor:', contractorError)
        return NextResponse.json(
          { error: 'Failed to create contractor profile', details: contractorError.message },
          { status: 500 }
        )
      }
    }

    // 12. Send verification email only (admin notification will be sent after email verification)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    const verificationLink = `${siteUrl}/verify-email?token=${verificationToken}`
    const logoUrl = `${siteUrl}/insulation-pal-logo-footer.png`
    
    console.log('📧 Preparing to send verification email:', {
      verificationToken: verificationToken.substring(0, 10) + '...',
      verificationLink,
      email,
      siteUrl,
      hasSendGridKey: !!SENDGRID_API_KEY
    })
    
    // Send verification email directly via SendGrid (MUST AWAIT to ensure it's sent before response)
    if (!SENDGRID_API_KEY) {
      console.error('❌ SENDGRID_API_KEY is not configured - cannot send verification email')
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 500 }
      )
    }
    
    // Email template HTML
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - InsulationPal</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a4768; font-family: Arial, sans-serif;">
      
      <!-- Header -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <img src="${logoUrl}" alt="InsulationPal" style="height: 120px; width: auto;">
      </div>
      
      <!-- Main Content Card -->
      <div style="background-color: white; margin: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Verification Header -->
        <div style="background: linear-gradient(135deg, #0a4768, #0d5a7f); padding: 30px; text-align: center;">
          <div style="color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px;">
            ✉️ Verify Your Email Address
          </div>
          <div style="color: white; font-size: 18px;">
            Complete your InsulationPal registration
          </div>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px;">
          <h2 style="color: #0a4768; margin: 0 0 20px 0; font-size: 22px;">
            Hello ${name || 'Valued Contractor'},
          </h2>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for registering with InsulationPal! To complete your registration and start receiving qualified leads, please verify your email address by clicking the button below.
          </p>
          
          <!-- Verification Info -->
          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #0a4768;">
            <h3 style="color: #0a4768; margin: 0 0 15px 0; font-size: 18px;">
              📧 Why Verify Your Email?
            </h3>
            <div style="color: #1e40af; font-size: 14px; line-height: 1.8;">
              <div style="margin-bottom: 10px;">
                <strong>✓ Secure Your Account</strong><br>
                <span style="font-size: 13px;">Email verification helps protect your account and ensures you receive important notifications.</span>
              </div>
              <div style="margin-bottom: 10px;">
                <strong>✓ Start Receiving Leads</strong><br>
                <span style="font-size: 13px;">Once verified, your application will be reviewed and you'll be able to receive qualified leads.</span>
              </div>
              <div>
                <strong>✓ Access Your Dashboard</strong><br>
                <span style="font-size: 13px;">Verified accounts get full access to the contractor dashboard and all features.</span>
              </div>
            </div>
          </div>
          
          <!-- Call to Action -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #F5DD22; color: #0a4768; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              VERIFY EMAIL ADDRESS
            </a>
          </div>
          
          <!-- Alternative Link -->
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
              Button not working? Copy and paste this link into your browser:
            </p>
            <p style="color: #0a4768; font-size: 12px; word-break: break-all; margin: 0;">
              ${verificationLink}
            </p>
          </div>
          
          <!-- Expiration Notice -->
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 25px; border-left: 4px solid #f59e0b;">
            <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
              ⏰ <strong>Important:</strong> This verification link will expire in 24 hours. If you didn't register for InsulationPal, please ignore this email.
            </p>
          </div>
          
          <!-- Contact Information -->
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
              Need help or have questions?
            </p>
            <p style="color: #0a4768; font-size: 14px; margin: 0;">
              Contact us at <a href="mailto:info@majesticwarrior.com" style="color: #0a4768; text-decoration: none;">info@majesticwarrior.com</a>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <p style="color: white; font-size: 14px; margin: 0 0 10px 0;">InsulationPal - Professional Insulation Services</p>
        <p style="color: white; font-size: 12px; margin: 0;">Serving those that serve others</p>
      </div>
      
    </body>
    </html>
    `
    
    // Use dedicated verification email address
    const fromEmail = process.env.SENDGRID_VERIFICATION_EMAIL || 'verify@quote.insulationpal.com'
    const fromName = process.env.SENDGRID_FROM_NAME || 'Insulation Pal'
    
    const msg = {
      to: email,
      from: {
        email: fromEmail,
        name: fromName
      },
      replyTo: process.env.SENDGRID_REPLY_TO || fromEmail,
      subject: 'Verify Your Email - InsulationPal',
      html: emailHtml
    }
    
    // AWAIT the email send - this is critical!
    try {
      console.log('🔍 SendGrid configuration check:', {
        hasApiKey: !!SENDGRID_API_KEY,
        apiKeyLength: SENDGRID_API_KEY?.length,
        fromEmail,
        toEmail: email
      })
      
      const response = await sgMail.send(msg)
      console.log('✅ Verification email sent successfully to:', email)
      console.log('✅ Verification link sent:', verificationLink)
      console.log('✅ SendGrid response:', {
        statusCode: response[0].statusCode,
        messageId: response[0].headers['x-message-id']
      })
    } catch (err: any) {
      console.error('❌ Error sending verification email via SendGrid:', err)
      console.error('❌ Error details:', {
        message: err.message,
        code: err.code,
        response: err.response?.body || err.response,
        responseBody: JSON.stringify(err.response?.body, null, 2),
        stack: err.stack
      })
      console.error('❌ SendGrid message config:', {
        to: msg.to,
        from: msg.from,
        subject: msg.subject
      })
      console.error('❌ Verification link that should have been sent:', verificationLink)
      console.error('❌ Full verification token:', verificationToken)
      
      // Return more detailed error
      const errorMessage = err.response?.body?.errors?.[0]?.message || err.message || 'Unknown error'
      return NextResponse.json(
        { 
          error: 'Account created but failed to send verification email. Please contact support with your email address.',
          details: errorMessage
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Registration submitted successfully! Please check your email to verify your account. We will review your application once your email is verified.',
        userId: user.id,
        emailSent: true
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    )
  }
}
