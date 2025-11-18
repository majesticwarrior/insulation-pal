import { createClient } from '@supabase/supabase-js'

// Use service role for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface WonBidAssignment {
  id: string
  lead_id: string
  contractor_id: string
  status: string
  updated_at: string
  project_completed_at: string | null
  leads: {
    id: string
    customer_name: string
    customer_email: string
    home_size_sqft: number
    areas_needed: string[]
    insulation_types: string[]
    city: string
    state: string
    property_address?: string
    project_timeline?: string
    budget_range?: string
  }
  contractors: {
    id: string
    business_name: string
    contact_email: string
    contact_phone?: string
    lead_delivery_preference?: string
  }
}

/**
 * Check for contractors who won bids and send follow-up emails
 * Follow-ups are sent at 3 days and 5 days after the bid was won
 */
export async function checkAndSendWonBidFollowups() {
  try {
    console.log('📧 Checking for won bids that need follow-up emails...')
    
    const now = new Date()
    
    // Find assignments where contractor won the bid
    // We'll use updated_at as an approximation for when status changed to 'won'
    // Only check assignments that haven't been completed yet
    const { data: assignments, error: assignmentsError } = await supabaseAdmin
      .from('lead_assignments')
      .select(`
        id,
        lead_id,
        contractor_id,
        status,
        updated_at,
        project_completed_at,
        leads (
          id,
          customer_name,
          customer_email,
          home_size_sqft,
          areas_needed,
          insulation_types,
          city,
          state,
          property_address,
          project_timeline,
          budget_range
        ),
        contractors (
          id,
          business_name,
          contact_email,
          contact_phone,
          lead_delivery_preference
        )
      `)
      .in('status', ['won', 'hired'])
      .is('project_completed_at', null)
      .order('updated_at', { ascending: true })

    if (assignmentsError) {
      console.error('❌ Error fetching won bid assignments:', assignmentsError)
      throw assignmentsError
    }

    if (!assignments || assignments.length === 0) {
      console.log('✅ No won bids need follow-ups')
      return { sent: 0, skipped: 0 }
    }

    console.log(`📋 Found ${assignments.length} won bids without completion`)

    let sentCount = 0
    let skippedCount = 0

    // Process each assignment
    for (const assignment of assignments as WonBidAssignment[]) {
      const wonAt = new Date(assignment.updated_at)
      const daysSinceWon = (now.getTime() - wonAt.getTime()) / (1000 * 60 * 60 * 24)
      
      // Check which follow-ups have already been sent
      const { data: sentFollowups, error: followupsError } = await supabaseAdmin
        .from('won_bid_followup_emails')
        .select('followup_type')
        .eq('lead_assignment_id', assignment.id)

      if (followupsError) {
        console.error(`❌ Error checking sent follow-ups for assignment ${assignment.id}:`, followupsError)
        continue
      }

      const sentFollowupTypes = new Set(sentFollowups?.map(f => f.followup_type) || [])

      // Check each follow-up type individually and send if conditions are met
      const followupThresholds: Array<{ type: '3d' | '5d', days: number }> = [
        { type: '3d', days: 3 },
        { type: '5d', days: 5 }
      ]

      for (const { type, days } of followupThresholds) {
        // Only send if:
        // 1. Enough days have passed (daysSinceWon >= threshold)
        // 2. This follow-up hasn't been sent yet
        if (daysSinceWon >= days && !sentFollowupTypes.has(type)) {
          const sent = await sendWonBidFollowupEmail(assignment, type)
          if (sent) {
            sentCount++
          } else {
            skippedCount++
          }
          // Only send one follow-up per run to avoid spam
          break
        }
      }
    }

    console.log(`✅ Won bid follow-up check completed: ${sentCount} sent, ${skippedCount} skipped`)
    return { sent: sentCount, skipped: skippedCount }

  } catch (error) {
    console.error('❌ Error in checkAndSendWonBidFollowups:', error)
    throw error
  }
}

/**
 * Send a follow-up email to a contractor about a won bid
 */
async function sendWonBidFollowupEmail(assignment: WonBidAssignment, followupType: '3d' | '5d'): Promise<boolean> {
  try {
    const contractor = assignment.contractors
    const lead = assignment.leads

    if (!contractor || !lead) {
      console.error(`❌ Missing contractor or lead data for assignment ${assignment.id}`)
      return false
    }

    const contactEmail = contractor.contact_email
    if (!contactEmail) {
      console.warn(`⚠️ No email address for contractor ${contractor.business_name}`)
      return false
    }

    // Send email via API
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    const dashboardLink = `${siteUrl}/contractor-dashboard?leadAssignmentId=${assignment.id}&tab=won`
    
    const response = await fetch(`${siteUrl}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: contactEmail,
        subject: `Follow-up: Did you complete the job for ${lead.customer_name}?`,
        template: `won-bid-followup-${followupType}`,
        data: {
          contractorName: contractor.business_name,
          customerName: lead.customer_name,
          city: lead.city,
          state: lead.state,
          propertyAddress: lead.property_address,
          homeSize: lead.home_size_sqft,
          areasNeeded: lead.areas_needed.join(', '),
          insulationTypes: lead.insulation_types.join(', '),
          projectTimeline: lead.project_timeline,
          budgetRange: lead.budget_range,
          dashboardLink: dashboardLink,
          daysSinceWon: followupType === '3d' ? 3 : 5,
          followupType: followupType,
          leadAssignmentId: assignment.id
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Failed to send follow-up email: ${errorText}`)
      return false
    }

    // Record that follow-up was sent
    const { error: insertError } = await supabaseAdmin
      .from('won_bid_followup_emails')
      .insert({
        lead_assignment_id: assignment.id,
        contractor_id: assignment.contractor_id,
        lead_id: assignment.lead_id,
        followup_type: followupType,
        sent_at: new Date().toISOString()
      })

    if (insertError) {
      console.error(`❌ Failed to record follow-up email:`, insertError)
      // Don't fail the whole operation if recording fails
    }

    console.log(`✅ Sent ${followupType} follow-up to ${contractor.business_name} for assignment ${assignment.id}`)
    return true

  } catch (error) {
    console.error(`❌ Error sending follow-up email:`, error)
    return false
  }
}

/**
 * Get statistics about won bid follow-up emails
 */
export async function getWonBidFollowupStats() {
  try {
    const { data: stats, error } = await supabaseAdmin
      .from('won_bid_followup_emails')
      .select('followup_type')
    
    if (error) {
      throw error
    }

    const counts = {
      '3d': 0,
      '5d': 0,
      total: stats?.length || 0
    }

    stats?.forEach(followup => {
      if (followup.followup_type in counts) {
        counts[followup.followup_type as '3d' | '5d']++
      }
    })

    return counts
  } catch (error) {
    console.error('❌ Error getting won bid follow-up stats:', error)
    throw error
  }
}

