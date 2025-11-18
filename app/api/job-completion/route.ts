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
      leadAssignmentId,
      completed,
      contractorId,
      customerName,
      customerEmail,
      customerPhone,
      leadId,
      projectDetails
    } = await request.json()

    if (!leadAssignmentId || completed === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: leadAssignmentId and completed' },
        { status: 400 }
      )
    }

    // Update the lead assignment with completion status
    const updateData: any = {}
    
    if (completed) {
      // Mark as completed
      updateData.project_completed_at = new Date().toISOString()
      updateData.status = 'completed'
    } else {
      // Mark as not completed (clear completion date if it exists)
      updateData.project_completed_at = null
    }

    const { error: updateError } = await supabaseAdmin
      .from('lead_assignments')
      .update(updateData)
      .eq('id', leadAssignmentId)
      .eq('contractor_id', contractorId)

    if (updateError) {
      console.error('Error updating job completion:', updateError)
      return NextResponse.json(
        { error: 'Failed to update job completion status' },
        { status: 500 }
      )
    }

    // If job is completed, send review request email to customer
    if (completed && customerEmail) {
      try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
        const reviewLink = `${siteUrl}/review/${contractorId}?leadId=${leadId || leadAssignmentId}`

        const emailResponse = await fetch(`${siteUrl}/api/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: customerEmail,
            subject: `How was your insulation project? - ${projectDetails?.city || ''}, ${projectDetails?.state || ''} - InsulationPal`,
            template: 'project-completion-review',
            data: {
              customerName: customerName,
              projectDetails: {
                homeSize: projectDetails?.homeSize,
                areasNeeded: projectDetails?.areasNeeded,
                insulationTypes: projectDetails?.insulationTypes,
                city: projectDetails?.city,
                state: projectDetails?.state
              },
              reviewLink: reviewLink,
              leadAssignmentId: leadAssignmentId
            }
          })
        })

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text()
          console.error('Failed to send review request email:', errorText)
          // Don't fail the whole request if email fails
        } else {
          console.log('✅ Review request email sent successfully')
        }
      } catch (emailError) {
        console.error('Error sending review request email:', emailError)
        // Don't fail the whole request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: completed 
        ? 'Job marked as completed and review request email sent to customer'
        : 'Job marked as not completed'
    })

  } catch (error: any) {
    console.error('Error in job completion API:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

