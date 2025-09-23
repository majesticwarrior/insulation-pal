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
    // 1. Find contractors in the area with credits
    const { data: contractors, error: contractorError } = await supabase
      .from('contractors')
      .select(`
        id,
        user_id,
        business_name,
        credits,
        users(email, phone)
      `)
      .eq('status', 'approved')
      .gt('credits', 0)
      .limit(5) // Limit to top 5 contractors

    if (contractorError) throw contractorError

    if (!contractors || contractors.length === 0) {
      console.log('No contractors available for this lead')
      return
    }

    // 2. Randomly select up to 3 contractors or let customer choose
    const selectedContractors = contractors
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    // 3. Create lead assignments
    const assignments = selectedContractors.map(contractor => ({
      lead_id: lead.id,
      contractor_id: contractor.id,
      cost: 20.00, // Cost per lead
      status: 'pending'
    }))

    const { error: assignmentError } = await supabase
      .from('lead_assignments')
      .insert(assignments)

    if (assignmentError) throw assignmentError

    // 4. Deduct credits from contractors
    for (const contractor of selectedContractors) {
      await supabase
        .from('contractors')
        .update({ credits: contractor.credits - 1 })
        .eq('id', contractor.id)
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
        message: `New lead: ${lead.customer_name} in ${lead.city}, ${lead.state}. View details: ${process.env.NEXT_PUBLIC_SITE_URL}/contractor-dashboard`
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
    const { error } = await supabase
      .from('lead_assignments')
      .update({
        status: response === 'accept' ? 'accepted' : 'declined',
        response_date: new Date().toISOString()
      })
      .eq('id', leadAssignmentId)
      .eq('contractor_id', contractorId)

    if (error) throw error

    // If accepted, notify customer
    if (response === 'accept') {
      // Get lead and contractor details
      const { data: assignment } = await supabase
        .from('lead_assignments')
        .select(`
          leads(customer_name, customer_email),
          contractors(business_name, users(email, phone))
        `)
        .eq('id', leadAssignmentId)
        .single()

      if (assignment?.leads?.customer_email) {
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
      }
    }

  } catch (error) {
    console.error('Error handling contractor response:', error)
    throw error
  }
}
