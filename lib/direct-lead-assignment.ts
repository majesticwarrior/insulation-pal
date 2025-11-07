'use server'

import { supabase } from './supabase'
import { sendServerEmailDirect } from './server-email-direct'
import { sendSMS } from './sms-service'
import type { Lead } from './lead-assignment'

/**
 * Assign a lead directly to a specific contractor
 * Used for "Direct Contractor Quote" from contractor profile pages
 */
export async function assignLeadToSingleContractor(lead: Lead, contractorId: string) {
  try {
    console.log('🎯 Assigning lead directly to contractor:', contractorId)
    console.log('🔍 Lead details:', { 
      id: lead.id, 
      city: lead.city, 
      state: lead.state,
      areas_needed: lead.areas_needed,
      insulation_types: lead.insulation_types
    })

    // 1. Fetch contractor details
    const { data: contractorData, error: contractorError } = await (supabase as any)
      .from('contractors')
      .select(`
        id,
        user_id,
        business_name,
        credits,
        contact_email,
        contact_phone,
        lead_delivery_preference,
        status,
        users(email, phone)
      `)
      .eq('id', contractorId)
      .single()

    if (contractorError) {
      console.error('❌ Contractor fetch error:', contractorError)
      throw new Error(`Failed to fetch contractor: ${contractorError.message}`)
    }

    if (!contractorData) {
      console.error('❌ Contractor not found:', contractorId)
      throw new Error('Contractor not found')
    }

    // Check if contractor is approved
    if (contractorData.status !== 'approved') {
      console.error('❌ Contractor is not approved:', contractorData.status)
      throw new Error('This contractor is not currently accepting leads')
    }

    // Check if contractor has credits
    if (contractorData.credits <= 0) {
      console.error('❌ Contractor has no credits:', contractorData.credits)
      throw new Error('This contractor is currently out of credits')
    }

    console.log(`✅ Found contractor: ${contractorData.business_name}`)

    // 2. Create lead assignment
    console.log('📝 Creating lead assignment...')
    const { data: assignment, error: assignmentError } = await (supabase as any)
      .from('lead_assignments')
      .insert({
        lead_id: lead.id,
        contractor_id: contractorId,
        status: 'pending',
        cost: 20.00
      })
      .select()
      .single()

    if (assignmentError) {
      console.error('❌ Assignment creation error:', assignmentError)
      throw assignmentError
    }

    console.log(`✅ Assignment created: ${assignment.id}`)

    // 3. Deduct credit from contractor
    console.log('💳 Deducting credit from contractor...')
    const { error: creditError } = await (supabase as any)
      .from('contractors')
      .update({ credits: contractorData.credits - 1 })
      .eq('id', contractorId)

    if (creditError) {
      console.error('❌ Credit deduction error:', creditError)
      // Don't throw - assignment was created, we can handle credit deduction later
      console.warn('⚠️ Assignment created but credit deduction failed. Manual review may be needed.')
    } else {
      console.log(`✅ Credit deducted from ${contractorData.business_name} (new balance: ${contractorData.credits - 1})`)
    }

    // 4. Notify contractor
    await notifyContractor(contractorData, lead, assignment.id)

    console.log(`✅ Lead assigned and contractor notified: ${contractorData.business_name}`)

    return {
      success: true,
      assignmentId: assignment.id,
      contractor: contractorData.business_name
    }

  } catch (error: any) {
    console.error('❌ Error assigning lead to contractor:', error)
    console.error('❌ Error details:', {
      message: error?.message || 'No message',
      stack: error?.stack || 'No stack',
      name: error?.name || 'No name',
      lead: lead ? { id: lead.id, city: lead.city, state: lead.state } : 'No lead',
      contractorId
    })
    throw error
  }
}

/**
 * Notify contractor about the new direct lead assignment
 */
async function notifyContractor(contractor: any, lead: Lead, assignmentId: string) {
  try {
    console.log(`📧 Notifying contractor ${contractor.business_name}`)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    const dashboardLink = `${siteUrl}/contractor-dashboard?from=email`
    
    // Determine contact method based on contractor preference
    const contactEmail = contractor.contact_email || contractor.users?.email
    const contactPhone = contractor.contact_phone || contractor.users?.phone
    const deliveryPreference = contractor.lead_delivery_preference || 'email'

    // Send email notification
    if ((deliveryPreference === 'email' || deliveryPreference === 'both') && contactEmail) {
      try {
        console.log(`📧 Sending email to ${contractor.business_name} at ${contactEmail}`)
        
        const projectDetails = [
          `Home Size: ${lead.home_size_sqft} sq ft`,
          `Areas Needed: ${lead.areas_needed?.join(', ') || 'Multiple'}`,
          `Insulation Types: ${lead.insulation_types?.join(', ') || 'Various'}`,
          `Location: ${lead.city}, ${lead.state} ${lead.zip_code || ''}`.trim(),
          `Customer: ${lead.customer_name}`,
          `Email: ${lead.customer_email}`,
          lead.customer_phone ? `Phone: ${lead.customer_phone}` : null
        ].filter(Boolean).join('\n')

        const emailResult = await sendServerEmailDirect({
          to: contactEmail,
          subject: 'New Direct Lead - InsulationPal',
          template: 'new-lead',
          data: {
            contractorName: contractor.business_name,
            customerName: lead.customer_name,
            city: lead.city,
            state: lead.state,
            propertyAddress: lead.property_address || `${lead.city}, ${lead.state}`,
            homeSize: lead.home_size_sqft,
            areasNeeded: lead.areas_needed?.join(', ') || 'Multiple',
            insulationTypes: lead.insulation_types?.join(', ') || 'Various',
            projectTimeline: lead.project_timeline || 'Not specified',
            budgetRange: lead.budget_range || 'Not specified',
            customerEmail: lead.customer_email,
            customerPhone: lead.customer_phone || 'Not provided',
            dashboardLink
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
        
        const smsMessage = `InsulationPal: New direct lead in ${lead.city}, ${lead.state}! ${lead.home_size_sqft} sq ft home. Areas: ${lead.areas_needed?.join(', ') || 'Multiple'}. View details: ${dashboardLink}`
        
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
    }
  } catch (error) {
    console.error('❌ Error in notifyContractor:', error)
    // Don't throw - notification failure shouldn't fail the assignment
  }
}

