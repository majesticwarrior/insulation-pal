import { createClient } from '@supabase/supabase-js'

// Use service role for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface LeadAssignment {
  id: string
  lead_id: string
  contractor_id: string
  assigned_at: string
  responded_at: string | null
  quote_amount: number | null
  status: string
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
 * Check for contractors who haven't submitted bids and send reminder emails
 * Reminders are sent at 2h, 4h, and 24h after assignment
 */
export async function checkAndSendReminders() {
  try {
    console.log('📧 Checking for contractors who need reminder emails...')
    
    const now = new Date()
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
    const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000)
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    // Find assignments where contractor hasn't submitted a bid
    // A bid is considered submitted if responded_at is not null OR quote_amount is not null
    // Only check assignments with status 'pending' or 'sent' (not 'accepted', 'declined', 'expired')
    const { data: assignments, error: assignmentsError } = await supabaseAdmin
      .from('lead_assignments')
      .select(`
        id,
        lead_id,
        contractor_id,
        assigned_at,
        responded_at,
        quote_amount,
        status,
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
      .is('responded_at', null)
      .is('quote_amount', null)
      .in('status', ['pending', 'sent'])
      .order('assigned_at', { ascending: true })

    if (assignmentsError) {
      console.error('❌ Error fetching assignments:', assignmentsError)
      throw assignmentsError
    }

    if (!assignments || assignments.length === 0) {
      console.log('✅ No assignments need reminders')
      return { sent: 0, skipped: 0 }
    }

    console.log(`📋 Found ${assignments.length} assignments without bids`)

    let sentCount = 0
    let skippedCount = 0

    // Process each assignment
    for (const assignment of assignments as LeadAssignment[]) {
      const assignedAt = new Date(assignment.assigned_at)
      const hoursSinceAssignment = (now.getTime() - assignedAt.getTime()) / (1000 * 60 * 60)
      
      // Check which reminders have already been sent
      const { data: sentReminders, error: remindersError } = await supabaseAdmin
        .from('reminder_emails')
        .select('reminder_type')
        .eq('lead_assignment_id', assignment.id)

      if (remindersError) {
        console.error(`❌ Error checking sent reminders for assignment ${assignment.id}:`, remindersError)
        continue
      }

      const sentReminderTypes = new Set(sentReminders?.map(r => r.reminder_type) || [])

      // Check each reminder type individually and send if conditions are met
      const reminderThresholds: Array<{ type: '2h' | '4h' | '24h', hours: number }> = [
        { type: '2h', hours: 2 },
        { type: '4h', hours: 4 },
        { type: '24h', hours: 24 }
      ]

      for (const { type, hours } of reminderThresholds) {
        // Only send if:
        // 1. Enough time has passed (hoursSinceAssignment >= threshold)
        // 2. This reminder hasn't been sent yet
        if (hoursSinceAssignment >= hours && !sentReminderTypes.has(type)) {
          const sent = await sendReminderEmail(assignment, type)
          if (sent) {
            sentCount++
          } else {
            skippedCount++
          }
          // Only send one reminder per run to avoid spam
          break
        }
      }
    }

    console.log(`✅ Reminder check completed: ${sentCount} sent, ${skippedCount} skipped`)
    return { sent: sentCount, skipped: skippedCount }

  } catch (error) {
    console.error('❌ Error in checkAndSendReminders:', error)
    throw error
  }
}

/**
 * Send a reminder email to a contractor
 */
async function sendReminderEmail(assignment: LeadAssignment, reminderType: '2h' | '4h' | '24h'): Promise<boolean> {
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
    const response = await fetch(`${siteUrl}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: contactEmail,
        subject: `Reminder: Submit Your Quote - ${lead.city}, ${lead.state}`,
        template: `contractor-reminder-${reminderType}`,
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
          dashboardLink: `${siteUrl}/contractor-dashboard?from=reminder`,
          hoursSinceAssignment: reminderType === '2h' ? 2 : reminderType === '4h' ? 4 : 24,
          reminderType: reminderType
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Failed to send reminder email: ${errorText}`)
      return false
    }

    // Record that reminder was sent
    const { error: insertError } = await supabaseAdmin
      .from('reminder_emails')
      .insert({
        lead_assignment_id: assignment.id,
        contractor_id: assignment.contractor_id,
        lead_id: assignment.lead_id,
        reminder_type: reminderType,
        sent_at: new Date().toISOString()
      })

    if (insertError) {
      console.error(`❌ Failed to record reminder email:`, insertError)
      // Don't fail the whole operation if recording fails
    }

    console.log(`✅ Sent ${reminderType} reminder to ${contractor.business_name} for assignment ${assignment.id}`)
    return true

  } catch (error) {
    console.error(`❌ Error sending reminder email:`, error)
    return false
  }
}

/**
 * Get statistics about reminder emails
 */
export async function getReminderStats() {
  try {
    const { data: stats, error } = await supabaseAdmin
      .from('reminder_emails')
      .select('reminder_type')
    
    if (error) {
      throw error
    }

    const counts = {
      '2h': 0,
      '4h': 0,
      '24h': 0,
      total: stats?.length || 0
    }

    stats?.forEach(reminder => {
      if (reminder.reminder_type in counts) {
        counts[reminder.reminder_type as '2h' | '4h' | '24h']++
      }
    })

    return counts
  } catch (error) {
    console.error('❌ Error getting reminder stats:', error)
    throw error
  }
}

