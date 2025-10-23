import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const {
      inviteToken,
      contractorName,
      contractorEmail,
      contractorPhone,
      businessName,
      licenseNumber,
      quoteAmount,
      quoteNotes,
      estimatedTimeline
    } = await request.json()

    if (!inviteToken || !contractorName || !contractorEmail || !businessName || !quoteAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify invitation token and get lead details
    const { data: invitation, error: inviteError } = await supabaseAdmin
      .from('lead_invitations')
      .select(`
        *,
        leads (
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
      .eq('invite_token', inviteToken)
      .single()

    if (inviteError) {
      if (inviteError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Invalid invitation token' },
          { status: 404 }
        )
      }
      throw inviteError
    }

    // Check if invitation has expired
    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 410 }
      )
    }

    const lead = invitation.leads

    // Check if contractor already submitted a quote for this lead
    const { data: existingQuote, error: checkError } = await supabaseAdmin
      .from('contractor_quotes')
      .select('id')
      .eq('lead_id', lead.id)
      .eq('contractor_email', contractorEmail)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    if (existingQuote) {
      return NextResponse.json(
        { error: 'You have already submitted a quote for this project' },
        { status: 409 }
      )
    }

    // Create contractor quote record
    const { data: quoteData, error: quoteError } = await supabaseAdmin
      .from('contractor_quotes')
      .insert({
        lead_id: lead.id,
        contractor_name: contractorName,
        contractor_email: contractorEmail,
        contractor_phone: contractorPhone || null,
        business_name: businessName,
        license_number: licenseNumber || null,
        quote_amount: quoteAmount,
        quote_notes: quoteNotes || null,
        estimated_timeline: estimatedTimeline || null,
        status: 'submitted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (quoteError) {
      throw quoteError
    }

    // Send notification email to customer
    try {
      await sendCustomerNotification({
        customerName: lead.customer_name,
        customerEmail: lead.customer_email,
        contractorName,
        businessName,
        quoteAmount,
        quoteNotes,
        leadId: lead.id
      })
    } catch (emailError) {
      console.error('Failed to send customer notification:', emailError)
      // Don't fail the quote submission if email fails
    }

    return NextResponse.json({
      success: true,
      quoteId: quoteData.id,
      message: 'Quote submitted successfully'
    })

  } catch (error: any) {
    console.error('Error submitting quote:', error)
    return NextResponse.json(
      { error: 'Failed to submit quote', details: error.message },
      { status: 500 }
    )
  }
}

async function sendCustomerNotification({
  customerName,
  customerEmail,
  contractorName,
  businessName,
  quoteAmount,
  quoteNotes,
  leadId
}: {
  customerName: string
  customerEmail: string
  contractorName: string
  businessName: string
  quoteAmount: number
  quoteNotes?: string
  leadId: string
}) {
  // In production, this would use SendGrid or similar
  const subject = `New Quote Received from ${businessName}`
  const body = `
Hi ${customerName},

You have received a new quote for your insulation project from ${contractorName} at ${businessName}.

Quote Details:
- Amount: $${quoteAmount.toLocaleString()}
- Business: ${businessName}
- Contractor: ${contractorName}

${quoteNotes ? `Additional Notes: ${quoteNotes}` : ''}

You can view all your quotes at: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/customer-quotes?leadId=${leadId}

Best regards,
The Insulation Pal Team
  `

  console.log('Customer notification email:', {
    to: customerEmail,
    subject,
    body
  })

  // TODO: Implement actual email sending service
  return { success: true }
}
