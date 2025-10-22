import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Token and new password are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Find contractor with valid reset token
    const { data: contractor, error: contractorError } = await supabase
      .from('contractors')
      .select('id, reset_token_expiry')
      .eq('reset_token', token)
      .single()

    if (contractorError || !contractor) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Check if token has expired
    const now = new Date()
    const tokenExpiry = new Date(contractor.reset_token_expiry)
    
    if (now > tokenExpiry) {
      return NextResponse.json(
        { success: false, error: 'Reset token has expired' },
        { status: 400 }
      )
    }

    // Hash the new password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update password and clear reset token
    const { error: updateError } = await (supabase as any)
      .from('contractors')
      .update({
        password_hash: hashedPassword,
        reset_token: null,
        reset_token_expiry: null
      })
      .eq('id', contractor.id)

    if (updateError) {
      console.error('Error updating password:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update password' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Password has been successfully reset'
    })

  } catch (error) {
    console.error('Password reset confirmation error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred processing your request' },
      { status: 500 }
    )
  }
}
