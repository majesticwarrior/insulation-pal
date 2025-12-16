import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Find user by verification token (include name and phone for admin notification)
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, name, phone, email_verified, verification_token_expiry')
      .eq('verification_token', token)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Check if already verified
    if (user.email_verified) {
      return NextResponse.json(
        { error: 'Email has already been verified' },
        { status: 400 }
      )
    }

    // Check if token has expired
    if (user.verification_token_expiry) {
      const expiryDate = new Date(user.verification_token_expiry)
      if (expiryDate < new Date()) {
        return NextResponse.json(
          { error: 'Verification token has expired. Please request a new verification email.' },
          { status: 400 }
        )
      }
    }

    // Update user to mark email as verified and clear token
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        email_verified: true,
        verification_token: null,
        verification_token_expiry: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating user verification status:', updateError)
      return NextResponse.json(
        { error: 'Failed to verify email. Please try again.' },
        { status: 500 }
      )
    }

    // After successful verification, send admin notification email
    // Only send if this is a contractor (user_type = 'contractor')
    try {
      // Get contractor data for admin notification
      const { data: contractor, error: contractorError } = await supabaseAdmin
        .from('contractors')
        .select('business_name, license_number, business_city')
        .eq('user_id', user.id)
        .single()

      if (!contractorError && contractor) {
        // Get user type to confirm it's a contractor
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('user_type')
          .eq('id', user.id)
          .single()

        if (userData?.user_type === 'contractor') {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
          const adminEmail = 'info@majesticwarrior.com'

          console.log('📧 Sending admin notification after email verification:', {
            contractorEmail: user.email,
            businessName: contractor.business_name,
            adminEmail: adminEmail
          })

          // Send admin notification using API route
          const protocol = request.headers.get('x-forwarded-proto') || 'https'
          const host = request.headers.get('host') || 'insulationpal.com'
          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`

          console.log('🔍 Admin email configuration:', {
            baseUrl,
            protocol,
            host,
            siteUrl,
            fullUrl: `${baseUrl}/api/send-email`
          })

          try {
            const emailResponse = await fetch(`${baseUrl}/api/send-email`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                to: adminEmail,
                subject: 'New Contractor Registration - InsulationPal',
                template: 'new-contractor-registration',
                data: {
                  name: user.name || 'N/A',
                  email: user.email,
                  phone: user.phone || 'N/A',
                  businessName: contractor.business_name,
                  licenseNumber: contractor.license_number || 'N/A',
                  city: contractor.business_city || 'N/A',
                  adminDashboardLink: `${siteUrl}/admin-dashboard`
                }
              })
            })

            const result = await emailResponse.json()
            
            if (emailResponse.ok) {
              console.log('✅ Admin notification email sent successfully!', {
                to: adminEmail,
                statusCode: emailResponse.status,
                result: result
              })
            } else {
              console.error('❌ Failed to send admin notification email!', {
                statusCode: emailResponse.status,
                error: result,
                to: adminEmail
              })
            }
          } catch (fetchError: any) {
            console.error('❌ Error sending admin notification email (fetch failed):', {
              error: fetchError.message,
              stack: fetchError.stack,
              baseUrl,
              adminEmail
            })
          }
        }
      }
    } catch (emailError) {
      // Don't fail verification if admin email fails
      console.error('❌ Error sending admin notification (non-critical):', emailError)
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email verified successfully! Your account is now active and your application will be reviewed.',
        email: user.email
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'An error occurred during email verification. Please try again.' },
      { status: 500 }
    )
  }
}
