import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const inviteToken = searchParams.get('token')

    if (!inviteToken) {
      return NextResponse.json(
        { error: 'Invitation token is required' },
        { status: 400 }
      )
    }

    // Get invitation details with lead information
    const { data: invitation, error: inviteError } = await supabaseAdmin
      .from('lead_invitations')
      .select(`
        *,
        leads (
          id,
          customer_name,
          customer_email,
          customer_phone,
          home_size_sqft,
          areas_needed,
          insulation_types,
          city,
          state,
          zip_code,
          property_address,
          project_timeline,
          budget_range,
          created_at
        )
      `)
      .eq('invite_token', inviteToken)
      .single()

    if (inviteError) {
      if (inviteError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Invitation not found' },
          { status: 404 }
        )
      }
      throw inviteError
    }

    // Check if invitation has expired
    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 410 }
      )
    }

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        leadId: invitation.lead_id,
        expiresAt: invitation.expires_at,
        createdAt: invitation.created_at,
        lead: invitation.leads
      }
    })

  } catch (error: any) {
    console.error('Error fetching invitation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invitation', details: error.message },
      { status: 500 }
    )
  }
}
