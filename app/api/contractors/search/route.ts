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

    // Test basic database connection first
    console.log('🔍 Testing database connection...')
    const { data: testData, error: testError } = await supabaseAdmin
      .from('contractors')
      .select('id, business_name')
      .limit(1)

    if (testError) {
      console.error('❌ Database connection test failed:', testError)
      return NextResponse.json(
        { error: 'Database connection failed', details: testError.message },
        { status: 500 }
      )
    }

    console.log('✅ Database connection successful')

    // Simplified query to test basic functionality
    console.log('🔍 Executing simplified contractors query...')
    const { data: contractors, error } = await supabaseAdmin
      .from('contractors')
      .select(`
        id,
        business_name,
        business_city,
        business_state,
        status,
        credits
      `)
      .eq('business_state', state)
      .eq('status', 'approved')
      .gt('credits', 0)
      .order('business_name')
      .limit(20)

    if (error) {
      console.error('❌ Contractor search error:', error)
      console.error('❌ Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return NextResponse.json(
        { error: 'Failed to fetch contractors', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Contractors query successful:', { contractorsCount: contractors?.length || 0 })

    // Filter contractors by city (case-insensitive)
    const cityFilteredContractors = contractors?.filter(contractor => 
      contractor.business_city?.toLowerCase().includes(city.toLowerCase())
    ) || []

    console.log('City filtering result:', { 
      searchCity: city, 
      searchState: state,
      cityFilteredCount: cityFilteredContractors.length
    })

    // Return simplified response for now
    return NextResponse.json({
      success: true,
      contractors: cityFilteredContractors || [],
      total: cityFilteredContractors?.length || 0,
      message: 'Simplified query successful - contractor_quotes table not found, skipping exclusions'
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
