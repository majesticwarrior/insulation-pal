import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Helper function to create Supabase admin client
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set in environment variables')
  }
  
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables')
  }
  
  return createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

export async function POST(request: NextRequest) {
  try {
    const { quoteId } = await request.json()
    const supabaseAdmin = getSupabaseAdmin()

    if (!quoteId) {
      return NextResponse.json(
        { success: false, error: 'Quote ID is required' },
        { status: 400 }
      )
    }

    console.log('📋 Accepting quote:', quoteId)

    // Get the quote details first
    const { data: quoteData, error: quoteError } = await supabaseAdmin
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
          customer_phone,
          home_size_sqft,
          areas_needed,
          insulation_types,
          city,
          state,
          property_address
        ),
        contractors(
          business_name,
          contact_email,
          contact_phone,
          lead_delivery_preference
        )
      `)
      .eq('id', quoteId)
      .single()

    if (quoteError) {
      console.error('❌ Error fetching quote:', quoteError)
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    if (!quoteData) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Update assignment status to won (customer selected this contractor)
    const { error: updateError } = await supabaseAdmin
      .from('lead_assignments')
      .update({ status: 'won' })
      .eq('id', quoteId)

    if (updateError) {
      console.error('❌ Error updating quote status:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update quote status' },
        { status: 500 }
      )
    }

    console.log('✅ Quote status updated to won')

    // Notify the winning contractor
    try {
      await notifyWinningContractor(quoteData)
      console.log('✅ Winning contractor notified')
    } catch (notifyError) {
      console.error('⚠️ Error notifying contractor (non-fatal):', notifyError)
      // Don't fail the request if notification fails
    }

    return NextResponse.json({
      success: true,
      message: 'Quote accepted successfully'
    })
  } catch (error: any) {
    console.error('❌ Error accepting quote:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

async function notifyWinningContractor(quoteData: any) {
  try {
    const lead = quoteData.leads
    const contractor = quoteData.contractors

    if (!lead || !contractor) {
      console.error('Missing lead or contractor data')
      return
    }

    // Determine contact method based on contractor preference
    const contactEmail = contractor.contact_email

    // Send email notification
    if (contactEmail) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
      
      await fetch(`${siteUrl}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: contactEmail,
          subject: `🎉 Congratulations! You Won the Bid - ${lead.customer_name} - InsulationPal`,
          template: 'quote-accepted',
          data: {
            contractorName: contractor.business_name,
            customerName: lead.customer_name,
            customerEmail: lead.customer_email,
            customerPhone: lead.customer_phone,
            quoteAmount: quoteData.quote_amount,
            quoteNotes: quoteData.quote_notes,
            projectDetails: {
              homeSize: lead.home_size_sqft,
              areasNeeded: lead.areas_needed?.join(', '),
              insulationTypes: lead.insulation_types?.join(', '),
              city: lead.city,
              state: lead.state,
              propertyAddress: lead.property_address
            },
            dashboardLink: `${siteUrl}/contractor-dashboard`
          }
        })
      })
    }

    console.log('✅ Winning contractor notified successfully')
  } catch (error: any) {
    console.error('❌ Error notifying winning contractor:', error)
    throw error
  }
}

