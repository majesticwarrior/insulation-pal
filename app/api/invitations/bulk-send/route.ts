import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendServerEmailDirect } from '@/lib/server-email-direct'

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

    // Get contractor details with user email
    const { data: contractors, error: contractorsError } = await supabaseAdmin
      .from('contractors')
      .select(`
        id, 
        business_name, 
        business_city, 
        business_state,
        credits,
        users!inner(email)
      `)
      .in('id', contractorIds)

    if (contractorsError) {
      throw contractorsError
    }

    const results = []
    const errors = []

    // Send invitations to each contractor
    for (const contractor of contractors) {
      try {
        // Check if contractor has enough credits
        if (contractor.credits < 1) {
          throw new Error('Insufficient credits')
        }

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

        // Create lead assignment for contractor
        const { data: assignment, error: assignmentError } = await supabaseAdmin
          .from('lead_assignments')
          .insert({
            lead_id: leadId,
            contractor_id: contractor.id,
            status: 'pending',
            cost: 1, // 1 credit per invitation
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (assignmentError) {
          console.error('Error creating lead assignment:', assignmentError)
          throw assignmentError
        }

        console.log('✅ Created lead assignment:', {
          assignmentId: assignment.id,
          contractorId: contractor.id,
          contractorName: contractor.business_name,
          leadId
        })

        // Deduct credit from contractor
        const { error: creditError } = await supabaseAdmin
          .from('contractors')
          .update({ 
            credits: contractor.credits - 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', contractor.id)

        if (creditError) {
          console.error('Error deducting credit:', creditError)
          throw creditError
        }

        console.log('💰 Deducted credit:', {
          contractorId: contractor.id,
          contractorName: contractor.business_name,
          previousCredits: contractor.credits,
          newCredits: contractor.credits - 1
        })

        // Send email invitation using the same service as lead notifications
        const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/invite/${inviteToken}`
        
        // Extract email from users relationship (users is an array with one element)
        const contractorEmail = Array.isArray(contractor.users) 
          ? (contractor.users as any)[0]?.email 
          : (contractor.users as any)?.email
        
        console.log('📧 Sending contractor invitation email:', {
          to: contractorEmail,
          contractorName: contractor.business_name,
          customerName: lead.customer_name,
          inviteUrl
        })

        // Use the same email service as lead notifications
        const emailResult = await sendServerEmailDirect({
          to: contractorEmail,
          subject: `New Project Invitation from ${lead.customer_name} - InsulationPal`,
          template: 'contractor-invitation',
          data: {
            contractorName: contractor.business_name,
            customerName: lead.customer_name,
            homeSize: lead.home_size_sqft,
            areas: lead.areas_needed,
            insulationTypes: lead.insulation_types,
            city: lead.city,
            state: lead.state,
            timeline: lead.project_timeline,
            budget: lead.budget_range,
            inviteUrl
          }
        })

        console.log('✅ Email sent successfully:', emailResult)

        results.push({
          contractorId: contractor.id,
          contractorName: contractor.business_name,
          success: true,
          creditsUsed: 1
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
      totalErrors: errors.length,
      totalCreditsUsed: results.reduce((sum, r) => sum + (r.creditsUsed || 0), 0)
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

