import { supabase } from './supabase'
import { sendEmail } from './email-service'
import { sendSMS } from './sms-service'

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
}

export interface Contractor {
  id: string
  user_id: string
  business_name: string
  email: string
  phone?: string
  credits: number
}

export async function assignLeadToContractors(lead: Lead) {
  try {
    console.log('🎯 Assigning lead to contractors in:', lead.city, lead.state)
    
    // 1. Find contractors in the customer's city with available credits
    const { data: contractors, error: contractorError } = await (supabase as any)
      .from('contractors')
      .select(`
        id,
        user_id,
        business_name,
        credits,
        payment_preference,
        users(email, phone),
        contractor_service_areas!inner(city, state)
      `)
      .eq('status', 'approved')
      .eq('contractor_service_areas.city', lead.city)
      .eq('contractor_service_areas.state', lead.state || 'AZ')
      .gt('credits', 0) // Only contractors with available credits

    if (contractorError) throw contractorError

    if (!contractors || contractors.length === 0) {
      console.log(`❌ No contractors available in ${lead.city}, ${lead.state}`)
      return
    }

    console.log(`✅ Found ${contractors.length} contractors in ${lead.city}`)

    // 2. Automatically select up to 3 contractors randomly
    const selectedContractors = contractors
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    
    console.log(`📋 Auto-assigning lead to ${selectedContractors.length} contractors:`, 
      selectedContractors.map(c => c.business_name))

    // 3. Create lead assignments
    const assignments = selectedContractors.map((contractor: any) => ({
      lead_id: (lead as any).id,
      contractor_id: contractor.id,
      cost: 20.00, // Cost per lead
      status: 'sent'
    }))

    const { error: assignmentError } = await (supabase as any)
      .from('lead_assignments')
      .insert(assignments)

    if (assignmentError) throw assignmentError

    // 4. Deduct credits from contractors (only for per_lead payment preference)
    for (const contractor of selectedContractors) {
      if (contractor.payment_preference === 'per_lead' || !contractor.payment_preference) {
        // Only deduct credits for per_lead contractors
        await (supabase as any)
          .from('contractors')
          .update({ credits: (contractor as any).credits - 1 })
          .eq('id', contractor.id)
      }
      // For per_job_completed contractors, no credits are deducted
    }

    // 5. Notify contractors
    await notifyContractors(selectedContractors, lead)

    console.log(`Lead ${lead.id} assigned to ${selectedContractors.length} contractors`)
    
  } catch (error) {
    console.error('Error assigning lead:', error)
    throw error
  }
}

async function notifyContractors(contractors: any[], lead: Lead) {
  for (const contractor of contractors) {
    const user = contractor.users

    // Send email notification
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: 'New Lead Available - InsulationPal',
        template: 'new-lead',
        data: {
          contractorName: contractor.business_name,
          customerName: lead.customer_name,
          city: lead.city,
          state: lead.state,
          homeSize: lead.home_size_sqft,
          areasNeeded: lead.areas_needed.join(', '),
          insulationTypes: lead.insulation_types.join(', '),
          dashboardLink: `${process.env.NEXT_PUBLIC_SITE_URL}/contractor-dashboard`
        }
      })
    }

    // Send SMS notification (if phone available)
    if (user.phone) {
      await sendSMS({
        to: user.phone,
        message: `New lead: ${lead.customer_name} in ${lead.city}, ${lead.state}. View details: ${process.env.NEXT_PUBLIC_SITE_URL}/contractor-dashboard`,
        type: 'new-lead'
      })
    }
  }
}

// Function to handle contractor responses
export async function handleContractorResponse(
  leadAssignmentId: string,
  contractorId: string,
  response: 'accept' | 'decline'
) {
  try {
    const { error } = await (supabase as any)
      .from('lead_assignments')
      .update({
        status: response === 'accept' ? 'accepted' : 'declined',
        responded_at: new Date().toISOString()
      })
      .eq('id', leadAssignmentId)
      .eq('contractor_id', contractorId)

    if (error) throw error

    // If accepted, deduct credit and notify customer
    if (response === 'accept') {
      try {
        console.log('💳 Deducting credit for accepted lead...')
        
        // Get current contractor credits
        const { data: contractor, error: contractorError } = await (supabase as any)
          .from('contractors')
          .select('credits')
          .eq('id', contractorId)
          .single()

        if (contractorError) {
          console.error('❌ Error fetching contractor credits:', contractorError)
          throw contractorError
        }

        const currentCredits = contractor?.credits || 0
        console.log('💰 Current credits:', currentCredits)

        if (currentCredits <= 0) {
          console.warn('⚠️ Contractor has no credits available')
          throw new Error('Insufficient credits to accept this lead')
        }

        // Deduct one credit
        const { error: creditError } = await (supabase as any)
          .from('contractors')
          .update({ credits: currentCredits - 1 })
          .eq('id', contractorId)

        if (creditError) {
          console.error('❌ Error deducting credit:', creditError)
          throw creditError
        }

        console.log('✅ Credit deducted successfully. New balance:', currentCredits - 1)
      } catch (creditError) {
        console.error('❌ Credit deduction failed:', creditError)
        throw creditError
      }

      try {
        console.log('🔍 Getting assignment details for notification...')
        
        // Get lead and contractor details
        const { data: assignment, error: assignmentError } = await (supabase as any)
          .from('lead_assignments')
          .select(`
            leads(customer_name, customer_email),
            contractors(business_name, users(email, phone))
          `)
          .eq('id', leadAssignmentId)
          .single()

        if (assignmentError) {
          console.error('❌ Error fetching assignment details:', assignmentError)
          // Don't throw - email notification is optional
          return
        }

        console.log('✅ Assignment details:', assignment)

        if (assignment?.leads?.customer_email) {
          console.log('📧 Sending email notification...')
          await sendEmail({
            to: assignment.leads.customer_email,
            subject: 'Contractor Interested in Your Project',
            template: 'contractor-response',
            data: {
              customerName: assignment.leads.customer_name,
              contractorName: assignment.contractors.business_name,
              contractorEmail: assignment.contractors.users.email,
              contractorPhone: assignment.contractors.users.phone
            }
          })
          console.log('✅ Email notification sent')
        } else {
          console.log('⚠️ No customer email found, skipping notification')
        }
      } catch (emailError) {
        console.error('❌ Email notification failed:', emailError)
        // Don't throw - email notification is optional, lead acceptance should still work
      }
    }

  } catch (error) {
    console.error('Error handling contractor response:', error);
    throw error;
  }
}
