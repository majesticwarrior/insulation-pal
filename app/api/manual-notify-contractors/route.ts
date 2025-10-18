import { NextRequest, NextResponse } from 'next/server'
import { sendServerEmailDirect } from '@/lib/server-email-direct'

export async function POST(req: NextRequest) {
  try {
    console.log('🔔 Manually triggering contractor notifications...')

    // Get the latest lead from the database
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Get the latest lead
    const { data: latestLead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (leadError || !latestLead) {
      return NextResponse.json({
        success: false,
        error: 'No recent lead found',
        details: leadError
      }, { status: 404 })
    }

    // Get pending assignments for this lead
    const { data: assignments, error: assignmentError } = await supabase
      .from('lead_assignments')
      .select(`
        id,
        contractor_id,
        status,
        contractors(
          id,
          business_name,
          contact_email,
          contact_phone,
          lead_delivery_preference
        )
      `)
      .eq('lead_id', latestLead.id)
      .eq('status', 'pending')

    if (assignmentError || !assignments || assignments.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No pending assignments found',
        details: assignmentError
      }, { status: 404 })
    }

    console.log(`📧 Found ${assignments.length} pending assignments to notify`)

    const results = []

    // Send notifications to each contractor
    for (const assignment of assignments) {
      const contractor = assignment.contractors as any
      if (!contractor) continue

      try {
        console.log(`📧 Notifying ${contractor.business_name} at ${contractor.contact_email}`)
        
        const emailResult = await sendServerEmailDirect({
          to: contractor.contact_email,
          subject: 'New Lead Available - InsulationPal',
          template: 'new-lead',
          data: {
            contractorName: contractor.business_name,
            city: latestLead.city,
            state: latestLead.state,
            propertyAddress: latestLead.property_address,
            homeSize: latestLead.home_size_sqft,
            areasNeeded: latestLead.areas_needed.join(', '),
            insulationTypes: latestLead.insulation_types.join(', '),
            projectTimeline: latestLead.project_timeline,
            budgetRange: latestLead.budget_range,
            dashboardLink: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'}/contractor-dashboard?from=email`
          }
        })

        console.log(`✅ Email sent to ${contractor.business_name}:`, emailResult)
        
        results.push({
          contractor: contractor.business_name,
          email: contractor.contact_email,
          success: true,
          result: emailResult
        })

      } catch (error: any) {
        console.error(`❌ Failed to notify ${contractor.business_name}:`, error)
        
        results.push({
          contractor: contractor.business_name,
          email: contractor.contact_email,
          success: false,
          error: error.message
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Manual notification completed for ${results.length} contractors`,
      lead: latestLead,
      results
    })

  } catch (error: any) {
    console.error('❌ Manual notification failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
