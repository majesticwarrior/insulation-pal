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

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: Review data route called - v2 with fixed data mapping')
    
    const { searchParams } = new URL(request.url)
    const contractorId = searchParams.get('contractorId')
    const leadId = searchParams.get('leadId')
    
    console.log('🔍 API: Parameters:', { contractorId, leadId })
    
    if (!contractorId || !leadId) {
      console.log('❌ API: Missing parameters')
      return NextResponse.json(
        { success: false, error: 'Missing contractorId or leadId' },
        { status: 400 }
      )
    }

    console.log('🔍 API: Fetching project details:', { contractorId, leadId })

    const supabaseAdmin = getSupabaseAdmin()

    // Fetch assignment data first
    // Note: leadId is actually the lead_id, not the assignment id
    const { data: assignment, error: assignmentError } = await supabaseAdmin
      .from('lead_assignments')
      .select('*')
      .eq('lead_id', leadId)
      .eq('contractor_id', contractorId)
      .single()

    console.log('🔍 API: Assignment data:', assignment)
    console.log('🔍 API: Assignment error:', assignmentError)

    if (assignmentError || !assignment) {
      console.error('❌ API: Error fetching assignment:', assignmentError)
      return NextResponse.json(
        { success: false, error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    // Fetch lead data separately
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', assignment.lead_id)
      .single()

    console.log('🔍 API: Lead data:', lead)
    console.log('🔍 API: Lead error:', leadError)

    if (leadError || !lead) {
      console.error('❌ API: Error fetching lead:', leadError)
      return NextResponse.json(
        { success: false, error: 'Lead data not found' },
        { status: 404 }
      )
    }

    // Fetch contractor data separately
    const { data: contractor, error: contractorError } = await supabaseAdmin
      .from('contractors')
      .select('*')
      .eq('id', contractorId)
      .single()

    console.log('🔍 API: Contractor data:', contractor)
    console.log('🔍 API: Contractor error:', contractorError)

    if (contractorError || !contractor) {
      console.error('❌ API: Error fetching contractor:', contractorError)
      return NextResponse.json(
        { success: false, error: 'Contractor data not found' },
        { status: 404 }
      )
    }

    // Check if project is completed (more lenient - allow 'won' status too)
    if (assignment.status !== 'completed' && assignment.status !== 'won') {
      console.log('❌ API: Project not completed, status:', assignment.status)
      return NextResponse.json(
        { success: false, error: 'This project is not yet completed' },
        { status: 400 }
      )
    }

    console.log('✅ API: Project details fetched successfully:', assignment)

    const response = {
      success: true,
      data: {
        projectDetails: {
          customerName: lead.customer_name,
          customerEmail: lead.customer_email,
          homeSize: lead.home_size_sqft,
          areasNeeded: lead.areas_needed,
          insulationTypes: lead.insulation_types,
          city: lead.city,
          state: lead.state,
          completedAt: assignment.project_completed_at
        },
        contractorDetails: {
          businessName: contractor.business_name,
          licenseNumber: contractor.license_number
        }
      }
    }

    console.log('🔍 API: Final response:', JSON.stringify(response, null, 2))

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('❌ API: Error in review data fetch:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
