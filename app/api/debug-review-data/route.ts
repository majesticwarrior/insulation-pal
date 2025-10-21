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
    console.log('🔍 API: Debug review data route called')
    
    const { searchParams } = new URL(request.url)
    const contractorId = searchParams.get('contractorId')
    const leadId = searchParams.get('leadId')
    
    console.log('🔍 API: Parameters:', { contractorId, leadId })
    
    if (!contractorId || !leadId) {
      return NextResponse.json(
        { success: false, error: 'Missing contractorId or leadId' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // First, let's check the raw assignment data
    const { data: assignment, error: assignmentError } = await supabaseAdmin
      .from('lead_assignments')
      .select('*')
      .eq('id', leadId)
      .eq('contractor_id', contractorId)
      .single()

    console.log('🔍 API: Raw assignment:', assignment)
    console.log('🔍 API: Assignment error:', assignmentError)

    if (assignmentError || !assignment) {
      return NextResponse.json(
        { success: false, error: 'Assignment not found' },
        { status: 404 }
      )
    }

    // Now let's get the lead data separately
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', assignment.lead_id)
      .single()

    console.log('🔍 API: Lead data:', lead)
    console.log('🔍 API: Lead error:', leadError)

    // And contractor data
    const { data: contractor, error: contractorError } = await supabaseAdmin
      .from('contractors')
      .select('*')
      .eq('id', contractorId)
      .single()

    console.log('🔍 API: Contractor data:', contractor)
    console.log('🔍 API: Contractor error:', contractorError)

    return NextResponse.json({
      success: true,
      debug: {
        assignment,
        lead,
        contractor,
        assignmentError,
        leadError,
        contractorError
      }
    })

  } catch (error: any) {
    console.error('❌ API: Error in debug review data:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
