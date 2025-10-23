import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Contractor search API called')
    
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const zipCode = searchParams.get('zipCode')
    const leadId = searchParams.get('leadId')

    console.log('🔍 Contractor search request:', { city, state, leadId, zipCode })

    if (!city || !state) {
      console.log('❌ Missing required parameters')
      return NextResponse.json(
        { error: 'City and state are required' },
        { status: 400 }
      )
    }

    // Get contractors in the area with credits and email
    console.log('🔍 Fetching contractors with credits...')
    const { data: contractors, error: contractorError } = await supabaseAdmin
      .from('contractors')
      .select(`
        id,
        business_name,
        license_number,
        license_verified,
        insurance_verified,
        business_city,
        business_state,
        business_zip,
        bio,
        founded_year,
        employee_count,
        status,
        credits,
        users!inner(email)
      `)
      .eq('business_city', city)
      .eq('business_state', state)
      .eq('status', 'approved')
      .gt('credits', 0)

    if (contractorError) {
      console.error('❌ Contractor search error:', contractorError)
      return NextResponse.json(
        { error: 'Failed to fetch contractors', details: contractorError.message },
        { status: 500 }
      )
    }

    console.log('✅ Found contractors:', contractors?.length || 0)

    // Transform the data to include email
    const transformedContractors = contractors?.map(c => ({
      id: c.id,
      business_name: c.business_name,
      license_number: c.license_number,
      license_verified: c.license_verified,
      insurance_verified: c.insurance_verified,
      business_city: c.business_city,
      business_state: c.business_state,
      business_zip: c.business_zip,
      bio: c.bio,
      founded_year: c.founded_year,
      employee_count: c.employee_count,
      status: c.status,
      credits: c.credits,
      email: Array.isArray(c.users) ? c.users[0]?.email : c.users?.email
    })) || []

    let excludedCount = 0
    let finalContractors = transformedContractors

    // If we have a leadId, filter out contractors who already have this lead
    if (leadId) {
      console.log('🔍 Filtering out contractors who already have this lead...')
      
      try {
        // Get contractors who already have lead assignments for this lead
        const { data: existingAssignments, error: assignmentError } = await supabaseAdmin
          .from('lead_assignments')
          .select('contractor_id')
          .eq('lead_id', leadId)
        
        if (assignmentError) {
          console.error('❌ Failed to fetch existing assignments:', assignmentError)
        } else {
          console.log('📊 Existing assignments:', existingAssignments?.length || 0)
          
          const excludedContractorIds = existingAssignments?.map(a => a.contractor_id) || []
          excludedCount += excludedContractorIds.length
          
          // Filter out contractors with existing assignments
          finalContractors = transformedContractors.filter(contractor => 
            !excludedContractorIds.includes(contractor.id)
          )
        }
        
        // Get contractors who already submitted quotes for this lead
        const { data: existingQuotes, error: quoteError } = await supabaseAdmin
          .from('contractor_quotes')
          .select('contractor_email')
          .eq('lead_id', leadId)
        
        if (quoteError) {
          console.error('❌ Failed to fetch existing quotes:', quoteError)
        } else {
          console.log('📊 Existing quotes:', existingQuotes?.length || 0)
          
          const excludedEmails = existingQuotes?.map(q => q.contractor_email) || []
          excludedCount += excludedEmails.length
          
          // Filter out contractors with existing quotes
          finalContractors = finalContractors.filter(contractor => 
            !excludedEmails.includes(contractor.email)
          )
        }
        
        console.log('✅ Filtering completed')
        console.log('📊 Final contractors after filtering:', finalContractors.length)
        console.log('📊 Excluded contractors:', excludedCount)
        
      } catch (filterError) {
        console.error('❌ Error during filtering:', filterError)
        // Continue with unfiltered results if filtering fails
      }
    }

    return NextResponse.json({
      contractors: finalContractors,
      total: finalContractors.length,
      excludedCount,
      searchParams: { city, state, zipCode, leadId }
    })

  } catch (error: any) {
    console.error('💥 Unhandled error in contractor search API:', error)
    console.error('💥 Error stack:', error.stack)
    console.error('💥 Error details:', {
      message: error.message,
      name: error.name,
      cause: error.cause
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch contractors', 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}