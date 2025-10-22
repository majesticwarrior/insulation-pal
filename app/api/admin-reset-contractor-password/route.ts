import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { sendEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const { contractorId, newPassword, adminId } = await request.json()

    if (!contractorId || !newPassword || !adminId) {
      return NextResponse.json(
        { success: false, error: 'Contractor ID, new password, and admin ID are required' },
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

    // Verify admin authentication (you might want to add more robust admin verification)
    // For now, we'll assume the admin is authenticated if they reach this endpoint

    // Get contractor details
    const { data: contractor, error: contractorError } = await supabase
      .from('contractors')
      .select('id, email, business_name')
      .eq('id', contractorId)
      .single()

    if (contractorError || !contractor) {
      return NextResponse.json(
        { success: false, error: 'Contractor not found' },
        { status: 404 }
      )
    }

    // Hash the new password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update password and clear any existing reset tokens
    const { error: updateError } = await supabase
      .from('contractors')
      .update({
        password_hash: hashedPassword,
        reset_token: null,
        reset_token_expiry: null
      } as any)
      .eq('id', contractorId)

    if (updateError) {
      console.error('Error updating contractor password:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update password' },
        { status: 500 }
      )
    }

    // Send notification email to contractor
    try {
      await sendEmail({
        to: contractor.email,
        subject: 'Your Password Has Been Reset - Insulation Pal',
        template: 'admin_password_reset',
        data: {
          contractorName: contractor.business_name,
          loginLink: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/contractor-login`
        }
      })
    } catch (emailError) {
      console.error('Error sending password reset notification email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: `Password has been successfully reset for ${contractor.business_name}`
    })

  } catch (error) {
    console.error('Admin password reset error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred processing your request' },
      { status: 500 }
    )
  }
}
