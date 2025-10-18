import { supabase } from './supabase'
import { sendEmail } from './email-service'
import { sendSMS } from './sms-service'

export interface LeadAssignment {
  id: string
  lead_id: string
  contractor_id: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  assigned_at: string
  response_deadline: string
  responded_at?: string
}

export interface Lead {
  id: string
  customer_id: string
  home_size_sqft: number
  areas_needed: string[]
  insulation_types: string[]
  city: string
  state: string
  zip_code?: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  property_address?: string
  project_timeline?: string
  budget_range?: string
}

export interface Contractor {
  id: string
  user_id: string
  business_name: string
  contact_email: string
  contact_phone?: string
  lead_delivery_preference: 'email' | 'phone' | 'both'
  credits: number
}

/**
 * Check for expired lead assignments and reassign them to new contractors
 * This ensures customers always get multiple quotes
 */
export async function checkAndReassignExpiredLeads() {
  try {
    console.log('🕐 Checking for expired lead assignments...')
    
    // Find assignments that are past their response deadline and still pending
    const { data: expiredAssignments, error: expiredError } = await (supabase as any)
      .from('lead_assignments')
      .select(`
        id,
        lead_id,
        contractor_id,
        assigned_at,
        response_deadline,
        leads(
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
          budget_range
        )
      `)
      .eq('status', 'pending')
      .lt('response_deadline', new Date().toISOString())

    if (expiredError) {
      console.error('❌ Error fetching expired assignments:', expiredError)
      return
    }

    if (!expiredAssignments || expiredAssignments.length === 0) {
      console.log('✅ No expired assignments found')
      return
    }

    console.log(`🔄 Found ${expiredAssignments.length} expired assignments`)

    // Process each expired assignment
    for (const assignment of expiredAssignments) {
      await processExpiredAssignment(assignment)
    }

  } catch (error) {
    console.error('❌ Error in checkAndReassignExpiredLeads:', error)
  }
}

/**
 * Process a single expired assignment
 */
async function processExpiredAssignment(assignment: any) {
  try {
    const lead = assignment.leads
    console.log(`🔄 Processing expired assignment for lead ${lead.id}`)

    // 1. Mark the expired assignment as expired
    const { error: updateError } = await (supabase as any)
      .from('lead_assignments')
      .update({ 
        status: 'expired',
        responded_at: new Date().toISOString()
      })
      .eq('id', assignment.id)

    if (updateError) {
      console.error('❌ Error updating expired assignment:', updateError)
      return
    }

    // 2. Check how many active assignments this lead has
    const { data: activeAssignments, error: activeError } = await (supabase as any)
      .from('lead_assignments')
      .select('id, contractor_id, status')
      .eq('lead_id', lead.id)
      .in('status', ['pending', 'accepted'])

    if (activeError) {
      console.error('❌ Error checking active assignments:', activeError)
      return
    }

    const activeCount = activeAssignments?.length || 0
    console.log(`📊 Lead ${lead.id} has ${activeCount} active assignments`)

    // 3. If less than 3 active assignments, find new contractors
    if (activeCount < 3) {
      const neededCount = 3 - activeCount
      console.log(`🎯 Need to assign ${neededCount} more contractors`)
      
      await assignNewContractorsToLead(lead, neededCount, activeAssignments?.map((a: any) => a.contractor_id) || [])
    }

  } catch (error) {
    console.error('❌ Error processing expired assignment:', error)
  }
}

/**
 * Assign new contractors to a lead
 */
async function assignNewContractorsToLead(lead: Lead, count: number, excludeContractorIds: string[] = []) {
  try {
    console.log(`🎯 Assigning ${count} new contractors to lead ${lead.id}`)

    // Find contractors in the customer's city with available credits
    let query = supabase
      .from('contractors')
      .select(`
        id,
        user_id,
        business_name,
        credits,
        contact_email,
        contact_phone,
        lead_delivery_preference,
        contractor_service_areas!inner(city, state)
      `)
      .eq('status', 'approved')
      .eq('contractor_service_areas.city', lead.city)
      .eq('contractor_service_areas.state', lead.state || 'AZ')
      .gte('credits', 1)

    // Exclude contractors already assigned to this lead
    if (excludeContractorIds.length > 0) {
      query = query.not('id', 'in', `(${excludeContractorIds.join(',')})`)
    }

    const { data: contractors, error: contractorError } = await query

    if (contractorError) {
      console.error('❌ Error fetching contractors:', contractorError)
      return
    }

    if (!contractors || contractors.length === 0) {
      console.log('⚠️ No available contractors found for reassignment')
      return
    }

    // Randomly select contractors (up to the needed count)
    const shuffled = contractors.sort(() => 0.5 - Math.random())
    const selectedContractors = shuffled.slice(0, count)

    console.log(`✅ Selected ${selectedContractors.length} contractors for reassignment`)

    // Create new assignments
    for (const contractor of selectedContractors) {
      await createLeadAssignment(lead, contractor)
    }

  } catch (error) {
    console.error('❌ Error assigning new contractors:', error)
  }
}

/**
 * Create a new lead assignment and notify the contractor
 */
async function createLeadAssignment(lead: Lead, contractor: Contractor) {
  try {
    console.log(`📝 Creating assignment for contractor ${contractor.id}`)

    // Create the assignment
    const { data: assignment, error: assignmentError } = await (supabase as any)
      .from('lead_assignments')
      .insert({
        lead_id: lead.id,
        contractor_id: contractor.id,
        status: 'pending',
        cost: 20.00,
        assigned_at: new Date().toISOString(),
        response_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      })
      .select()
      .single()

    if (assignmentError) {
      console.error('❌ Error creating assignment:', assignmentError)
      return
    }

    // Deduct credit from contractor
    const { error: creditError } = await (supabase as any)
      .from('contractors')
      .update({ credits: contractor.credits - 1 })
      .eq('id', contractor.id)

    if (creditError) {
      console.error('❌ Error deducting credit:', creditError)
    }

    // Notify the contractor
    await notifyContractor(lead, contractor, assignment.id)

    console.log(`✅ Assignment created and contractor notified: ${contractor.business_name}`)

  } catch (error) {
    console.error('❌ Error creating lead assignment:', error)
  }
}

/**
 * Notify contractor about the new lead assignment
 */
async function notifyContractor(lead: Lead, contractor: Contractor, assignmentId: string) {
  try {
    console.log(`📧 Notifying contractor ${contractor.business_name}`)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    
    // Determine contact method based on contractor preference
    const contactEmail = contractor.lead_delivery_preference === 'phone' 
      ? contractor.contact_email 
      : contractor.contact_email
    const contactPhone = contractor.lead_delivery_preference === 'email' 
      ? contractor.contact_phone 
      : contractor.contact_phone

    // Send email notification
    if (contactEmail) {
      await sendEmail({
        to: contactEmail,
        subject: 'New Lead Available - InsulationPal',
        template: 'new-lead',
        data: {
          contractorName: contractor.business_name,
          customerName: lead.customer_name,
          projectDetails: {
            homeSize: lead.home_size_sqft,
            areasNeeded: lead.areas_needed.join(', '),
            insulationTypes: lead.insulation_types.join(', '),
            city: lead.city,
            state: lead.state,
            propertyAddress: lead.property_address
          },
          projectTimeline: lead.project_timeline,
          budgetRange: lead.budget_range,
          dashboardLink: `${siteUrl}/contractor-dashboard`,
          responseLink: `${siteUrl}/contractor-dashboard`
        }
      })
    }

    // Send SMS notification if phone is available and preferred
    if (contactPhone && contractor.lead_delivery_preference === 'phone') {
      await sendSMS({
        to: contactPhone,
        message: `New lead available! ${lead.customer_name} in ${lead.city}, ${lead.state} needs insulation for ${lead.home_size_sqft} sq ft. Check your dashboard: ${siteUrl}/contractor-dashboard`,
        type: 'new-lead'
      })
    }

    console.log(`✅ Contractor ${contractor.business_name} notified successfully`)

  } catch (error) {
    console.error('❌ Error notifying contractor:', error)
    // Don't throw - notification failure shouldn't prevent assignment creation
  }
}

/**
 * Get statistics about lead assignments for monitoring
 */
export async function getLeadAssignmentStats() {
  try {
    const { data: stats, error } = await (supabase as any)
      .from('lead_assignments')
      .select(`
        status,
        assigned_at,
        response_deadline,
        responded_at
      `)

    if (error) {
      console.error('❌ Error fetching assignment stats:', error)
      return null
    }

    const now = new Date()
    const expiredCount = stats?.filter((s: any) => 
      s.status === 'pending' && 
      new Date(s.response_deadline) < now
    ).length || 0

    const pendingCount = stats?.filter((s: any) => s.status === 'pending').length || 0
    const acceptedCount = stats?.filter((s: any) => s.status === 'accepted').length || 0

    return {
      total: stats?.length || 0,
      pending: pendingCount,
      accepted: acceptedCount,
      expired: expiredCount
    }

  } catch (error) {
    console.error('❌ Error getting assignment stats:', error)
    return null
  }
}
