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
    const { searchParams } = new URL(request.url)
    const contractorId = searchParams.get('contractorId')
    const leadId = searchParams.get('leadId')
    
    if (!contractorId || !leadId) {
      return NextResponse.json(
        { success: false, error: 'Missing contractorId or leadId' },
        { status: 400 }
      )
    }

    console.log('🔍 API: Fetching project details:', { contractorId, leadId })

    const supabaseAdmin = getSupabaseAdmin()

    // Fetch lead assignment and related data using service role (bypasses RLS)
    const { data: assignment, error: assignmentError } = await supabaseAdmin
      .from('lead_assignments')
      .select(`
        id,
        status,
        project_completed_at,
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
          license_number
        )
      `)
      .eq('lead_id', leadId)
      .eq('contractor_id', contractorId)
      .single()

    if (assignmentError) {
      console.error('❌ API: Error fetching assignment:', assignmentError)
      console.error('❌ API: Assignment error details:', {
        message: assignmentError.message,
        code: assignmentError.code,
        details: assignmentError.details,
        hint: assignmentError.hint
      })
      return NextResponse.json(
        { success: false, error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    if (!assignment || assignment.status !== 'completed') {
      return NextResponse.json(
        { success: false, error: 'This project is not yet completed' },
        { status: 400 }
      )
    }

    console.log('✅ API: Project details fetched successfully:', assignment)

    return NextResponse.json({
      success: true,
      data: {
        projectDetails: {
          customerName: assignment.leads?.[0]?.customer_name,
          customerEmail: assignment.leads?.[0]?.customer_email,
          homeSize: assignment.leads?.[0]?.home_size_sqft,
          areasNeeded: assignment.leads?.[0]?.areas_needed,
          insulationTypes: assignment.leads?.[0]?.insulation_types,
          city: assignment.leads?.[0]?.city,
          state: assignment.leads?.[0]?.state,
          completedAt: assignment.project_completed_at
        },
        contractorDetails: {
          businessName: assignment.contractors?.[0]?.business_name,
          licenseNumber: assignment.contractors?.[0]?.license_number
        }
      }
    })

  } catch (error: any) {
    console.error('❌ API: Error in review data fetch:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
