import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'
import { sendEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if contractor exists
    const { data: contractor, error: contractorError } = await supabase
      .from('contractors')
      .select('id, email, business_name')
      .eq('email', email)
      .single()

    if (contractorError || !contractor) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Store reset token in database
    const { error: updateError } = await supabase
      .from('contractors')
      .update({
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry.toISOString()
      })
      .eq('id', contractor.id)

    if (updateError) {
      console.error('Error storing reset token:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to generate reset token' },
        { status: 500 }
      )
    }

    // Send password reset email
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/contractor-reset-password?token=${resetToken}`
    
    try {
      await sendEmail({
        to: contractor.email,
        subject: 'Password Reset Request - Insulation Pal',
        template: 'password_reset',
        data: {
          contractorName: contractor.business_name,
          resetLink,
          expiryTime: '1 hour'
        }
      })
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError)
      // Still return success to not reveal if email exists
    }

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    })

  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred processing your request' },
      { status: 500 }
    )
  }
}
