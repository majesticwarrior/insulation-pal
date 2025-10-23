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

    // Get contractors in the same area (simplified query first)
    let query = supabaseAdmin
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
        credits
      `)
      .eq('business_state', state)
      .eq('status', 'approved') // Only approved contractors
      .gt('credits', 0) // Only contractors with credits available
      .order('business_name')

    // Variables to store excluded contractors
    let excludedContractorIds: string[] = []
    let excludedEmails: string[] = []

    // If we have a leadId, exclude contractors who already have quotes for this lead
    if (leadId) {
      console.log('🔍 Filtering contractors for leadId:', leadId)
      
      // Get contractor IDs who already have quotes for this lead
      // We want to exclude contractors who have ANY assignment for this lead, regardless of status
      // because they've already been given the opportunity to quote
      console.log('🔍 Fetching lead assignments...')
      const { data: existingQuotes, error: quotesError } = await supabaseAdmin
        .from('lead_assignments')
        .select('contractor_id, status')
        .eq('lead_id', leadId)

      if (quotesError) {
        console.error('❌ Error fetching existing quotes:', quotesError)
        console.error('❌ Lead assignments error details:', {
          message: quotesError.message,
          details: quotesError.details,
          hint: quotesError.hint,
          code: quotesError.code
        })
        // Don't throw here, just log and continue without exclusions
      } else {
        console.log('✅ Lead assignments query successful:', { count: existingQuotes?.length || 0 })
      }

      console.log('📋 Existing lead assignments:', existingQuotes)

      // Also check invited contractor quotes
      console.log('🔍 Fetching contractor quotes...')
      const { data: invitedQuotes, error: invitedError } = await supabaseAdmin
        .from('contractor_quotes')
        .select('contractor_email')
        .eq('lead_id', leadId)

      if (invitedError) {
        console.error('❌ Error fetching invited quotes:', invitedError)
        console.error('❌ Contractor quotes error details:', {
          message: invitedError.message,
          details: invitedError.details,
          hint: invitedError.hint,
          code: invitedError.code
        })
        // Don't throw here, just log and continue without exclusions
      } else {
        console.log('✅ Contractor quotes query successful:', { count: invitedQuotes?.length || 0 })
      }

      console.log('📧 Invited contractor quotes:', invitedQuotes)

      // Store excluded contractors
      excludedContractorIds = existingQuotes?.map(q => q.contractor_id) || []
      excludedEmails = invitedQuotes?.map(q => q.contractor_email) || []

      console.log('Excluding contractors:', { 
        existingQuotesCount: existingQuotes?.length || 0,
        invitedQuotesCount: invitedQuotes?.length || 0,
        excludedContractorIds,
        excludedEmails 
      })

      if (excludedContractorIds.length > 0) {
        console.log('🚫 Applying contractor ID filter:', excludedContractorIds)
        query = query.not('id', 'in', excludedContractorIds)
      }
    }

    console.log('🔍 Final query being executed:', {
      leadId,
      excludedContractorIds,
      excludedEmails,
      hasExclusions: excludedContractorIds.length > 0 || excludedEmails.length > 0
    })

    console.log('🔍 Executing main contractors query...')
    const { data: contractors, error } = await query

    if (error) {
      console.error('❌ Contractor search error:', error)
      console.error('❌ Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    console.log('✅ Main contractors query successful:', { contractorsCount: contractors?.length || 0 })

    console.log('Raw contractors query result:', { 
      contractorsCount: contractors?.length || 0, 
      contractors: contractors?.map(c => ({ 
        id: c.id, 
        business_name: c.business_name, 
        business_city: c.business_city, 
        business_state: c.business_state,
        status: c.status,
        credits: c.credits
      })) 
    })

    // Filter contractors by city (case-insensitive)
    const cityFilteredContractors = contractors?.filter(contractor => 
      contractor.business_city?.toLowerCase().includes(city.toLowerCase())
    ) || []

    console.log('City filtering result:', { 
      searchCity: city, 
      searchState: state,
      cityFilteredCount: cityFilteredContractors.length,
      cityFilteredContractors: cityFilteredContractors.map(c => ({ 
        id: c.id, 
        business_name: c.business_name, 
        business_city: c.business_city 
      }))
    })

    // If we have a leadId, also filter out contractors whose emails match invited quotes
    let finalContractors = cityFilteredContractors
    if (leadId && excludedEmails.length > 0) {
      // For now, skip email filtering since we don't have email in the query
      // We'll need to get emails separately if needed
      console.log('Skipping email filtering - email field not available in query')
    }

    // Limit to 20 contractors to avoid overwhelming the UI
    const limitedContractors = finalContractors.slice(0, 20)

    // Get review counts for each contractor
    const contractorsWithReviews = await Promise.all(
      limitedContractors.map(async (contractor) => {
        try {
          const { count, error } = await supabaseAdmin
            .from('reviews')
            .select('*', { count: 'exact', head: true })
            .eq('contractor_id', contractor.id)
          
          if (error) {
            console.error('Error fetching review count for contractor:', contractor.id, error)
            return {
              ...contractor,
              review_count: 0,
              average_rating: 0
            }
          }
          
          // Get average rating
          const { data: reviews, error: ratingError } = await supabaseAdmin
            .from('reviews')
            .select('rating')
            .eq('contractor_id', contractor.id)
          
          let averageRating = 0
          if (!ratingError && reviews && reviews.length > 0) {
            averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
          }
          
          return {
            ...contractor,
            review_count: count || 0,
            average_rating: Math.round(averageRating * 10) / 10
          }
        } catch (error) {
          console.error('Error in review fetch:', error)
          return {
            ...contractor,
            review_count: 0,
            average_rating: 0
          }
        }
      })
    )

    console.log('Final contractors result:', { 
      finalCount: contractorsWithReviews.length,
      contractors: contractorsWithReviews.map(c => ({ 
        id: c.id, 
        business_name: c.business_name, 
        business_city: c.business_city,
        credits: c.credits
      }))
    })

    return NextResponse.json({
      success: true,
      contractors: contractorsWithReviews,
      total: contractorsWithReviews.length,
      excludedCount: excludedContractorIds.length + excludedEmails.length
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
