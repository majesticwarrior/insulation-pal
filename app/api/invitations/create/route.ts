import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Use service role for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { leadId } = await request.json()

    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    // Generate unique invitation token
    const inviteToken = generateInviteToken()

    // Check if invitation already exists for this lead
    const { data: existingInvite, error: checkError } = await supabaseAdmin
      .from('lead_invitations')
      .select('*')
      .eq('lead_id', leadId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    let invitationData

    if (existingInvite) {
      // Update existing invitation
      const { data, error } = await supabaseAdmin
        .from('lead_invitations')
        .update({
          invite_token: inviteToken,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          updated_at: new Date().toISOString()
        })
        .eq('lead_id', leadId)
        .select()
        .single()

      if (error) throw error
      invitationData = data
    } else {
      // Create new invitation
      const { data, error } = await supabaseAdmin
        .from('lead_invitations')
        .insert({
          lead_id: leadId,
          invite_token: inviteToken,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      invitationData = data
    }

    const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/invite/${inviteToken}`

    return NextResponse.json({
      success: true,
      inviteUrl,
      inviteToken,
      expiresAt: invitationData.expires_at
    })

  } catch (error: any) {
    console.error('Error creating invitation:', error)
    return NextResponse.json(
      { error: 'Failed to create invitation', details: error.message },
      { status: 500 }
    )
  }
}

function generateInviteToken(): string {
  // Generate a secure random token
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
