import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const zipCode = searchParams.get('zipCode')
    const leadId = searchParams.get('leadId')

    if (!city || !state) {
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
        status
      `)
      .eq('business_state', state)
      .eq('status', 'approved') // Only approved contractors
      .order('business_name')

    // Variables to store excluded contractors
    let excludedContractorIds: string[] = []
    let excludedEmails: string[] = []

    // If we have a leadId, exclude contractors who already have quotes for this lead
    if (leadId) {
      // Get contractor IDs who already have quotes for this lead
      const { data: existingQuotes, error: quotesError } = await supabaseAdmin
        .from('lead_assignments')
        .select('contractor_id')
        .eq('lead_id', leadId)
        .not('status', 'in', ['declined', 'expired'])

      if (quotesError) {
        console.error('Error fetching existing quotes:', quotesError)
      }

      // Also check invited contractor quotes
      const { data: invitedQuotes, error: invitedError } = await supabaseAdmin
        .from('contractor_quotes')
        .select('contractor_email')
        .eq('lead_id', leadId)

      if (invitedError) {
        console.error('Error fetching invited quotes:', invitedError)
      }

      // Store excluded contractors
      excludedContractorIds = existingQuotes?.map(q => q.contractor_id) || []
      excludedEmails = invitedQuotes?.map(q => q.contractor_email) || []

      if (excludedContractorIds.length > 0) {
        query = query.not('id', 'in', `(${excludedContractorIds.join(',')})`)
      }
    }

    const { data: contractors, error } = await query

    if (error) {
      console.error('Contractor search error:', error)
      throw error
    }

    console.log('Raw contractors query result:', { 
      contractorsCount: contractors?.length || 0, 
      contractors: contractors?.map(c => ({ 
        id: c.id, 
        business_name: c.business_name, 
        business_city: c.business_city, 
        business_state: c.business_state,
        status: c.status,
        email: c.email 
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
        business_city: c.business_city
      }))
    })

    return NextResponse.json({
      success: true,
      contractors: contractorsWithReviews,
      total: contractorsWithReviews.length
    })

  } catch (error: any) {
    console.error('Error fetching contractors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contractors', details: error.message },
      { status: 500 }
    )
  }
}
