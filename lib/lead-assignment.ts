'use server'

import { supabase } from './supabase'
import { sendServerEmailDirect } from './server-email-direct'
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
  property_address?: string
  project_timeline?: string
  budget_range?: string
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
    console.log('🔍 Lead details:', { id: lead.id, city: lead.city, state: lead.state })
    
    // 1. Find contractors in the customer's city with available credits
    console.log('🔍 Searching for contractors...')
    const { data: contractors, error: contractorError } = await (supabase as any)
      .from('contractors')
      .select(`
        id,
        user_id,
        business_name,
        credits,
        contact_email,
        contact_phone,
        lead_delivery_preference,
        users(email, phone),
        contractor_service_areas!inner(city, state)
      `)
      .eq('status', 'approved')
      .eq('contractor_service_areas.city', lead.city)
      .eq('contractor_service_areas.state', lead.state || 'AZ')
      .gt('credits', 0) // Only contractors with available credits

    console.log('🔍 Contractor query result:', { contractors, contractorError })

    if (contractorError) {
      console.error('❌ Contractor query error:', contractorError)
      throw contractorError
    }

    if (!contractors || contractors.length === 0) {
      console.log(`❌ No contractors available in ${lead.city}, ${lead.state}`)
      console.log(`❌ This could be due to:`)
      console.log(`   - No contractors registered in this city`)
      console.log(`   - No contractors with available credits`)
      console.log(`   - No contractors with approved status`)
      console.log(`   - No contractors with service areas in this city`)
      return
    }

    console.log(`✅ Found ${contractors.length} contractors in ${lead.city}`)

    // 2. Automatically select up to 3 contractors randomly
    const selectedContractors = contractors
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    
    console.log(`📋 Auto-assigning lead to ${selectedContractors.length} contractors:`, 
      selectedContractors.map((c: any) => c.business_name))

    // 3. Create lead assignments
    console.log('📋 Creating lead assignments...')
    const assignments = selectedContractors.map((contractor: any) => ({
      lead_id: (lead as any).id,
      contractor_id: contractor.id,
      cost: 20.00, // Cost per lead
      status: 'pending',
      assigned_at: new Date().toISOString(),
      response_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    }))

    console.log('📋 Assignment data:', assignments)

    const { error: assignmentError } = await (supabase as any)
      .from('lead_assignments')
      .insert(assignments)

    console.log('📋 Assignment creation result:', { assignmentError })

    if (assignmentError) {
      console.error('❌ Assignment creation error:', assignmentError)
      throw assignmentError
    }

    // 4. Deduct credits from contractors (use atomic SQL to prevent double deduction)
    console.log('💳 Deducting credits from contractors...')
    for (const contractor of selectedContractors) {
      try {
        // Fetch current credits first to use for optimistic locking
        const { data: currentContractor, error: fetchError } = await (supabase as any)
          .from('contractors')
          .select('credits')
          .eq('id', contractor.id)
          .single()
        
        if (fetchError) {
          console.error(`❌ Failed to fetch credits for ${contractor.business_name}:`, fetchError)
          continue
        }
        
        if (!currentContractor || currentContractor.credits <= 0) {
          console.warn(`⚠️ ${contractor.business_name} has no credits available (${currentContractor?.credits || 0})`)
          continue
        }
        
        // Use optimistic locking: only update if credits match what we fetched
        // This prevents double deduction if the function is called multiple times
        const { data: updatedContractor, error: updateError } = await (supabase as any)
          .from('contractors')
          .update({ credits: currentContractor.credits - 1 })
          .eq('id', contractor.id)
          .eq('credits', currentContractor.credits) // Only update if credits haven't changed
          .select('credits')
          .single()
        
        if (updateError) {
          // If update failed due to credits mismatch, it means credits were already deducted
          // This is actually good - it means we prevented a double deduction
          if (updateError.code === 'PGRST116' || updateError.message?.includes('No rows')) {
            console.log(`⚠️ Credits already deducted for ${contractor.business_name} (prevented double deduction)`)
          } else {
            console.error(`❌ Failed to deduct credit from ${contractor.business_name}:`, updateError)
          }
        } else {
          console.log(`✅ Deducted credit from ${contractor.business_name} (new balance: ${updatedContractor?.credits || currentContractor.credits - 1})`)
        }
      } catch (creditError) {
        console.error(`❌ Failed to deduct credit from ${contractor.business_name}:`, creditError)
        // Continue with other contractors even if one fails
      }
    }

    // 5. Notify contractors
    console.log('📧 Starting contractor notifications...')
    try {
      await notifyContractors(selectedContractors, lead)
      console.log(`✅ Notifications sent to ${selectedContractors.length} contractors`)
    } catch (notificationError) {
      console.error('❌ CRITICAL: Error sending notifications:', notificationError)
      console.error('❌ Notification error details:', {
        message: (notificationError as any)?.message,
        stack: (notificationError as any)?.stack,
        leadId: lead.id,
        contractorCount: selectedContractors.length
      })
      // Don't throw here - lead assignment was successful, notifications are secondary
    }

    console.log(`Lead ${lead.id} assigned to ${selectedContractors.length} contractors`)
    
  } catch (error: any) {
    console.error('❌ Error assigning lead:', error)
    console.error('❌ Error details:', {
      message: error?.message || 'No message',
      stack: error?.stack || 'No stack',
      name: error?.name || 'No name',
      lead: lead ? { id: lead.id, city: lead.city, state: lead.state } : 'No lead'
    })
    throw error
  }
}

async function notifyContractors(contractors: any[], lead: Lead) {
  for (const contractor of contractors) {
    try {
      const deliveryPreference = contractor.lead_delivery_preference || 'email'
      // Try to get contact info from contractor fields first, then fall back to user fields
      const contactEmail = contractor.contact_email || contractor.users?.email
      const contactPhone = contractor.contact_phone || contractor.users?.phone
      
      console.log(`📧 Notifying ${contractor.business_name} via ${deliveryPreference}`)
      console.log(`📧 Contact email: ${contactEmail}, Contact phone: ${contactPhone}`)
      
      // Check if contractor has any contact information
      if (!contactEmail && !contactPhone) {
        console.error(`❌ No contact information found for contractor ${contractor.business_name} (ID: ${contractor.id})`)
        console.error(`❌ Contractor data:`, {
          contact_email: contractor.contact_email,
          contact_phone: contractor.contact_phone,
          user_email: contractor.users?.email,
          user_phone: contractor.users?.phone
        })
        continue // Skip this contractor
      }
      
      // Send email notification based on preference
      if ((deliveryPreference === 'email' || deliveryPreference === 'both') && contactEmail) {
        try {
          console.log(`📧 Attempting to send email to ${contractor.business_name} at ${contactEmail}`)
          const emailResult = await sendServerEmailDirect({
            to: contactEmail,
            subject: 'New Lead Available - InsulationPal',
            template: 'new-lead',
            data: {
              contractorName: contractor.business_name,
              city: lead.city,
              state: lead.state,
              propertyAddress: lead.property_address,
              homeSize: lead.home_size_sqft,
              areasNeeded: lead.areas_needed.join(', '),
              insulationTypes: lead.insulation_types.join(', '),
              projectTimeline: lead.project_timeline,
              budgetRange: lead.budget_range,
              dashboardLink: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'}/contractor-dashboard?from=email`
            }
          })
          console.log(`✅ Email notification sent to ${contractor.business_name} at ${contactEmail}`)
          console.log(`📧 Email result:`, emailResult)
        } catch (emailError) {
          console.error(`❌ CRITICAL: Failed to send email to ${contractor.business_name}:`, emailError)
          console.error(`❌ Email error details:`, {
            contractor: contractor.business_name,
            email: contactEmail,
            error: (emailError as any)?.message,
            stack: (emailError as any)?.stack
          })
        }
      } else if (deliveryPreference === 'email' || deliveryPreference === 'both') {
        console.warn(`⚠️ Contractor ${contractor.business_name} prefers email but has no email address`)
      }
      
      // Send SMS notification based on preference
      if ((deliveryPreference === 'text' || deliveryPreference === 'both') && contactPhone) {
        try {
          console.log(`📱 Attempting to send SMS to ${contractor.business_name} at ${contactPhone}`)
          
          const smsMessage = `InsulationPal: New lead in ${lead.city}, ${lead.state}! ${lead.home_size_sqft} sq ft home. Areas: ${lead.areas_needed?.join(', ') || 'Multiple'}. View details: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'}/contractor-dashboard?from=sms`
          
          const smsResult = await sendSMS({
            to: contactPhone,
            message: smsMessage,
            type: 'new-lead'
          })
          
          console.log(`✅ SMS notification sent to ${contractor.business_name} at ${contactPhone}`)
          console.log(`📱 SMS result:`, smsResult)
        } catch (smsError) {
          console.error(`❌ CRITICAL: Failed to send SMS to ${contractor.business_name}:`, smsError)
          console.error(`❌ SMS error details:`, {
            contractor: contractor.business_name,
            phone: contactPhone,
            error: (smsError as any)?.message,
            stack: (smsError as any)?.stack
          })
        }
      } else if (deliveryPreference === 'text' || deliveryPreference === 'both') {
        console.warn(`⚠️ Contractor ${contractor.business_name} prefers SMS but has no phone number`)
      }
    } catch (error) {
      console.error(`❌ Error notifying contractor ${contractor.business_name}:`, error)
      // Continue with other contractors even if one fails
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
        status: response === 'accept' ? 'pending' : 'declined',
        responded_at: new Date().toISOString()
      })
      .eq('id', leadAssignmentId)
      .eq('contractor_id', contractorId)

    if (error) throw error

    // Note: Credits are already deducted when the lead is initially assigned
    // No need to deduct again when accepting since all leads are now considered available

  } catch (error) {
    console.error('Error handling contractor response:', error);
    throw error;
  }
}
