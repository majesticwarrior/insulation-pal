import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Debugging lead notification system...')

    // Check recent leads
    const { data: recentLeads, error: leadsError } = await (supabase as any)
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (leadsError) {
      console.error('❌ Error fetching recent leads:', leadsError)
      return NextResponse.json({ error: 'Failed to fetch leads', details: leadsError }, { status: 500 })
    }

    console.log('📊 Recent leads:', recentLeads?.length || 0)

    // Check lead assignments for the most recent lead
    if (recentLeads && recentLeads.length > 0) {
      const latestLead = recentLeads[0]
      console.log('🔍 Checking assignments for latest lead:', latestLead.id)

      const { data: assignments, error: assignmentsError } = await (supabase as any)
        .from('lead_assignments')
        .select(`
          id,
          lead_id,
          contractor_id,
          status,
          created_at,
          responded_at,
          contractors(
            id,
            business_name,
            contact_email,
            contact_phone,
            lead_delivery_preference
          )
        `)
        .eq('lead_id', (latestLead as any).id)

      if (assignmentsError) {
        console.error('❌ Error fetching assignments:', assignmentsError)
        return NextResponse.json({ 
          error: 'Failed to fetch assignments', 
          details: assignmentsError,
          lead: latestLead 
        }, { status: 500 })
      }

      console.log('📊 Assignments for latest lead:', assignments?.length || 0)

      // Check contractors with credits in Phoenix
      const { data: contractors, error: contractorsError } = await (supabase as any)
        .from('contractors')
        .select(`
          id,
          business_name,
          credits,
          contact_email,
          contact_phone,
          lead_delivery_preference,
          status,
          contractor_service_areas(city, state)
        `)
        .eq('status', 'approved')
        .gt('credits', 0)

      if (contractorsError) {
        console.error('❌ Error fetching contractors:', contractorsError)
        return NextResponse.json({ 
          error: 'Failed to fetch contractors', 
          details: contractorsError,
          lead: latestLead,
          assignments: assignments 
        }, { status: 500 })
      }

      // Filter contractors for Phoenix
      const phoenixContractors = contractors?.filter((contractor: any) => 
        contractor.contractor_service_areas?.some((area: any) => 
          area.city === 'Phoenix' && area.state === 'AZ'
        )
      ) || []

      console.log('📊 Total contractors with credits:', contractors?.length || 0)
      console.log('📊 Phoenix contractors with credits:', phoenixContractors.length)

      return NextResponse.json({
        success: true,
        data: {
          recentLeads: recentLeads?.length || 0,
          latestLead,
          assignments: assignments?.length || 0,
          assignmentDetails: assignments,
          totalContractors: contractors?.length || 0,
          phoenixContractors: phoenixContractors.length,
          phoenixContractorDetails: phoenixContractors,
          allContractors: contractors
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        recentLeads: 0,
        message: 'No recent leads found'
      }
    })

  } catch (error: any) {
    console.error('❌ Debug error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
