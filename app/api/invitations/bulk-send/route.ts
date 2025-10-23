import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { leadId, contractorIds, customerName, projectDetails } = await request.json()

    if (!leadId || !contractorIds || !Array.isArray(contractorIds) || contractorIds.length === 0) {
      return NextResponse.json(
        { error: 'Lead ID and contractor IDs are required' },
        { status: 400 }
      )
    }

    // Get lead details
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (leadError) {
      throw leadError
    }

    // Get contractor details with user email
    const { data: contractors, error: contractorsError } = await supabaseAdmin
      .from('contractors')
      .select(`
        id, 
        business_name, 
        business_city, 
        business_state,
        credits,
        users!inner(email)
      `)
      .in('id', contractorIds)

    if (contractorsError) {
      throw contractorsError
    }

    const results = []
    const errors = []

    // Send invitations to each contractor
    for (const contractor of contractors) {
      try {
        // Check if contractor has enough credits
        if (contractor.credits < 1) {
          throw new Error('Insufficient credits')
        }

        // Create invitation record
        const inviteToken = generateInviteToken()
        
        const { data: invitation, error: inviteError } = await supabaseAdmin
          .from('lead_invitations')
          .insert({
            lead_id: leadId,
            contractor_id: contractor.id,
            invite_token: inviteToken,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (inviteError) {
          throw inviteError
        }

        // Create lead assignment for contractor
        const { data: assignment, error: assignmentError } = await supabaseAdmin
          .from('lead_assignments')
          .insert({
            lead_id: leadId,
            contractor_id: contractor.id,
            status: 'pending',
            cost: 1, // 1 credit per invitation
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (assignmentError) {
          console.error('Error creating lead assignment:', assignmentError)
          throw assignmentError
        }

        console.log('✅ Created lead assignment:', {
          assignmentId: assignment.id,
          contractorId: contractor.id,
          contractorName: contractor.business_name,
          leadId
        })

        // Deduct credit from contractor
        const { error: creditError } = await supabaseAdmin
          .from('contractors')
          .update({ 
            credits: contractor.credits - 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', contractor.id)

        if (creditError) {
          console.error('Error deducting credit:', creditError)
          throw creditError
        }

        console.log('💰 Deducted credit:', {
          contractorId: contractor.id,
          contractorName: contractor.business_name,
          previousCredits: contractor.credits,
          newCredits: contractor.credits - 1
        })

        // Send email invitation
        const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/invite/${inviteToken}`
        
        // Extract email from users relationship (users is an array with one element)
        const contractorEmail = Array.isArray(contractor.users) ? contractor.users[0]?.email : contractor.users?.email
        
        await sendContractorInvitation({
          contractorName: contractor.business_name,
          contractorEmail: contractorEmail,
          customerName: lead.customer_name,
          projectDetails: {
            homeSize: lead.home_size_sqft,
            areas: lead.areas_needed,
            insulationTypes: lead.insulation_types,
            city: lead.city,
            state: lead.state,
            timeline: lead.project_timeline,
            budget: lead.budget_range
          },
          inviteUrl
        })

        results.push({
          contractorId: contractor.id,
          contractorName: contractor.business_name,
          success: true,
          creditsUsed: 1
        })

      } catch (error: any) {
        console.error(`Error inviting contractor ${contractor.id}:`, error)
        errors.push({
          contractorId: contractor.id,
          contractorName: contractor.business_name,
          error: error.message
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
      errors,
      totalInvited: results.length,
      totalErrors: errors.length,
      totalCreditsUsed: results.reduce((sum, r) => sum + (r.creditsUsed || 0), 0)
    })

  } catch (error: any) {
    console.error('Error sending bulk invitations:', error)
    return NextResponse.json(
      { error: 'Failed to send invitations', details: error.message },
      { status: 500 }
    )
  }
}

function generateInviteToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

async function sendContractorInvitation({
  contractorName,
  contractorEmail,
  customerName,
  projectDetails,
  inviteUrl
}: {
  contractorName: string
  contractorEmail: string
  customerName: string
  projectDetails: any
  inviteUrl: string
}) {
  const subject = `New Project Invitation from ${customerName} - InsulationPal`
  
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Invitation - InsulationPal</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0a4768; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .project-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .cta-button { 
      display: inline-block; 
      background: #0a4768; 
      color: white; 
      padding: 12px 24px; 
      text-decoration: none; 
      border-radius: 5px; 
      margin: 15px 0;
    }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏠 InsulationPal</h1>
      <h2>New Project Invitation</h2>
    </div>
    
    <div class="content">
      <p>Hi <strong>${contractorName}</strong>,</p>
      
      <p>You've been invited to submit a quote for an insulation project by <strong>${customerName}</strong>.</p>
      
      <div class="project-details">
        <h3>📋 Project Details:</h3>
        <ul>
          <li><strong>Home Size:</strong> ${projectDetails.homeSize.toLocaleString()} sq ft</li>
          <li><strong>Location:</strong> ${projectDetails.city}, ${projectDetails.state}</li>
          <li><strong>Areas Needed:</strong> ${projectDetails.areas.join(', ')}</li>
          <li><strong>Insulation Types:</strong> ${projectDetails.insulationTypes.join(', ')}</li>
          ${projectDetails.timeline ? `<li><strong>Timeline:</strong> ${projectDetails.timeline}</li>` : ''}
          ${projectDetails.budget ? `<li><strong>Budget Range:</strong> ${projectDetails.budget}</li>` : ''}
        </ul>
      </div>
      
      <p>Click the button below to view full project details and submit your quote:</p>
      
      <a href="${inviteUrl}" class="cta-button">Submit Quote Now</a>
      
      <p><strong>Important:</strong> This invitation expires in 30 days.</p>
      
      <p>You can also copy and paste this link into your browser:<br>
      <a href="${inviteUrl}">${inviteUrl}</a></p>
    </div>
    
    <div class="footer">
      <p>Best regards,<br>The InsulationPal Team</p>
      <p>This email was sent because you were invited to bid on a project.</p>
    </div>
  </div>
</body>
</html>
  `

  const textBody = `
Hi ${contractorName},

You've been invited to submit a quote for an insulation project by ${customerName}.

Project Details:
- Home Size: ${projectDetails.homeSize.toLocaleString()} sq ft
- Location: ${projectDetails.city}, ${projectDetails.state}
- Areas Needed: ${projectDetails.areas.join(', ')}
- Insulation Types: ${projectDetails.insulationTypes.join(', ')}
${projectDetails.timeline ? `- Timeline: ${projectDetails.timeline}` : ''}
${projectDetails.budget ? `- Budget Range: ${projectDetails.budget}` : ''}

Click the link below to view full project details and submit your quote:
${inviteUrl}

This invitation expires in 30 days.

Best regards,
The InsulationPal Team
  `

  console.log('📧 Sending contractor invitation email:', {
    to: contractorEmail,
    subject,
    contractorName,
    customerName,
    inviteUrl
  })

  // In production, integrate with email service like SendGrid, Resend, or AWS SES
  // For now, we'll simulate successful email sending
  try {
    // Example integration with Resend (uncomment when ready):
    /*
    const { Resend } = require('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    await resend.emails.send({
      from: 'InsulationPal <noreply@insulationpal.com>',
      to: contractorEmail,
      subject,
      html: htmlBody,
      text: textBody
    })
    */
    
    return { success: true }
  } catch (error) {
    console.error('Email sending failed:', error)
    throw new Error('Failed to send email notification')
  }
}
