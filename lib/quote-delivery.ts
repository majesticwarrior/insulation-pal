// Quote delivery system for sending contractor quotes to customers
import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/email-service'

export interface QuoteData {
  leadAssignmentId: string
  contractorId: string
  quoteAmount: number
  quoteNotes?: string
}

export async function sendQuoteToCustomer(quoteData: QuoteData) {
  try {
    console.log('📧 Starting sendQuoteToCustomer with data:', quoteData)
    
    // Get lead and contractor details
    const { data: assignmentData, error: assignmentError } = await (supabase as any)
      .from('lead_assignments')
      .select(`
        id,
        lead_id,
        contractor_id,
        quote_amount,
        quote_notes,
        leads(
          customer_name,
          customer_email,
          home_size_sqft,
          areas_needed,
          insulation_types,
          city,
          state
        ),
        contractors(
          business_name,
          users(email)
        )
      `)
      .eq('id', quoteData.leadAssignmentId)
      .single()

    if (assignmentError) {
      console.error('Error fetching assignment data:', assignmentError)
      throw new Error(`Failed to fetch assignment data: ${assignmentError.message}`)
    }

    if (!assignmentData) {
      throw new Error('Assignment not found')
    }

    const lead = assignmentData.leads
    const contractor = assignmentData.contractors

    if (!lead || !contractor) {
      throw new Error('Lead or contractor data not found')
    }

    console.log('🔍 Debug quote delivery data:', {
      leadId: assignmentData.lead_id,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      leadData: lead,
      contractorData: contractor
    })

    // Send email to customer
    await sendEmail({
      to: lead.customer_email,
      subject: `New Quote Received - ${contractor.business_name} - InsulationPal`,
      template: 'contractor-quote',
      data: {
        customerName: lead.customer_name,
        contractorName: contractor.business_name,
        quoteAmount: quoteData.quoteAmount,
        quoteNotes: quoteData.quoteNotes || '',
        projectDetails: {
          homeSize: lead.home_size_sqft,
          areasNeeded: lead.areas_needed.join(', '),
          insulationTypes: lead.insulation_types.join(', '),
          city: lead.city,
          state: lead.state,
          propertyAddress: lead.property_address
        },
        contractorEmail: contractor.users?.email || 'Contact through InsulationPal',
        quoteReviewLink: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'}/customer-quotes?leadId=${assignmentData.lead_id}`,
        leadId: assignmentData.lead_id
      }
    })

    // Update status to 'accepted' to indicate quote was sent
    console.log('🔄 Updating status to accepted for assignment:', quoteData.leadAssignmentId)
    const { error: updateError } = await (supabase as any)
      .from('lead_assignments')
      .update({ status: 'accepted' })
      .eq('id', quoteData.leadAssignmentId)

    if (updateError) {
      console.error('❌ Status update error:', updateError)
      console.error('❌ Status update error details:', {
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
        code: updateError.code
      })
    } else {
      console.log('✅ Status updated to accepted, email sent successfully')
    }

    console.log('✅ Quote sent to customer successfully')
    return { success: true }

  } catch (error: any) {
    console.error('Error sending quote to customer:', error)
    throw new Error(`Failed to send quote: ${error.message}`)
  }
}

// Function to handle quote submission and automatically send to customer
export async function submitAndSendQuote(quoteData: QuoteData) {
  try {
    console.log('🚀 Starting submitAndSendQuote with data:', quoteData)
    
    // First, update the assignment with the quote
    // Only update columns that actually exist in the database
    console.log('📝 Attempting database update for assignment:', quoteData.leadAssignmentId)
    
    const { error: updateError } = await (supabase as any)
      .from('lead_assignments')
      .update({
        quote_amount: quoteData.quoteAmount,
        quote_notes: quoteData.quoteNotes,
        responded_at: new Date().toISOString(),
        status: 'accepted'
      })
      .eq('id', quoteData.leadAssignmentId)
      .eq('contractor_id', quoteData.contractorId)

    if (updateError) {
      console.error('❌ Database update error:', updateError)
      console.error('❌ Update error details:', {
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
        code: updateError.code
      })
      console.error('❌ Update data that failed:', {
        quoteAmount: quoteData.quoteAmount,
        quoteNotes: quoteData.quoteNotes,
        assignmentId: quoteData.leadAssignmentId,
        contractorId: quoteData.contractorId
      })
      // Don't throw - continue with email sending even if DB update fails
    } else {
      console.log('✅ Database update successful:', {
        quoteAmount: quoteData.quoteAmount,
        quoteNotes: quoteData.quoteNotes,
        assignmentId: quoteData.leadAssignmentId
      })
    }

    // Then send the quote to the customer
    await sendQuoteToCustomer(quoteData)

    return { success: true }
  } catch (error: any) {
    console.error('Error in submitAndSendQuote:', error)
    throw error
  }
}
