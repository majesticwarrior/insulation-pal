import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { leadId, contractorIds, customerName, projectDetails } = await request.json()

    if (!leadId || !contractorIds || !Array.isArray(contractorIds) || contractorIds.length === 0) {
      return NextResponse.json(
        { error: 'Lead ID and contractor IDs are required' },
        { status: 400 }
      )
    }

    // Get lead details
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (leadError) {
      throw leadError
    }

    // Get contractor details
    const { data: contractors, error: contractorsError } = await supabaseAdmin
      .from('contractors')
      .select('id, business_name, email, business_city, business_state')
      .in('id', contractorIds)

    if (contractorsError) {
      throw contractorsError
    }

    const results = []
    const errors = []

    // Send invitations to each contractor
    for (const contractor of contractors) {
      try {
        // Create invitation record
        const inviteToken = generateInviteToken()
        
        const { data: invitation, error: inviteError } = await supabaseAdmin
          .from('lead_invitations')
          .insert({
            lead_id: leadId,
            contractor_id: contractor.id,
            invite_token: inviteToken,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (inviteError) {
          throw inviteError
        }

        // Send email invitation
        const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/invite/${inviteToken}`
        
        await sendContractorInvitation({
          contractorName: contractor.business_name,
          contractorEmail: contractor.email,
          customerName: lead.customer_name,
          projectDetails: {
            homeSize: lead.home_size_sqft,
            areas: lead.areas_needed,
            insulationTypes: lead.insulation_types,
            city: lead.city,
            state: lead.state,
            timeline: lead.project_timeline,
            budget: lead.budget_range
          },
          inviteUrl
        })

        results.push({
          contractorId: contractor.id,
          contractorName: contractor.business_name,
          success: true
        })

      } catch (error: any) {
        console.error(`Error inviting contractor ${contractor.id}:`, error)
        errors.push({
          contractorId: contractor.id,
          contractorName: contractor.business_name,
          error: error.message
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
      errors,
      totalInvited: results.length,
      totalErrors: errors.length
    })

  } catch (error: any) {
    console.error('Error sending bulk invitations:', error)
    return NextResponse.json(
      { error: 'Failed to send invitations', details: error.message },
      { status: 500 }
    )
  }
}

function generateInviteToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

async function sendContractorInvitation({
  contractorName,
  contractorEmail,
  customerName,
  projectDetails,
  inviteUrl
}: {
  contractorName: string
  contractorEmail: string
  customerName: string
  projectDetails: any
  inviteUrl: string
}) {
  const subject = `New Project Invitation from ${customerName} - InsulationPal`
  const body = `
Hi ${contractorName},

You've been invited to submit a quote for an insulation project by ${customerName}.

Project Details:
- Home Size: ${projectDetails.homeSize.toLocaleString()} sq ft
- Location: ${projectDetails.city}, ${projectDetails.state}
- Areas Needed: ${projectDetails.areas.join(', ')}
- Insulation Types: ${projectDetails.insulationTypes.join(', ')}
${projectDetails.timeline ? `- Timeline: ${projectDetails.timeline}` : ''}
${projectDetails.budget ? `- Budget Range: ${projectDetails.budget}` : ''}

Click the link below to view full project details and submit your quote:
${inviteUrl}

This invitation expires in 30 days.

Best regards,
The Insulation Pal Team
  `

  console.log('Contractor invitation email:', {
    to: contractorEmail,
    subject,
    body
  })

  // TODO: Implement actual email sending service
  return { success: true }
}
