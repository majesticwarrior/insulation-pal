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

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API: Update contractor review counts route called')
    
    const supabaseAdmin = getSupabaseAdmin()

    // Get all contractors
    const { data: contractors, error: contractorsError } = await supabaseAdmin
      .from('contractors')
      .select('id, business_name')

    if (contractorsError) {
      console.error('❌ API: Error fetching contractors:', contractorsError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch contractors' },
        { status: 500 }
      )
    }

    console.log(`📊 Found ${contractors?.length || 0} contractors to update`)

    let updatedCount = 0
    const results = []

    // Update each contractor's review count and average rating
    for (const contractor of contractors || []) {
      // Get review count and average rating for this contractor
      const { data: reviewStats, error: reviewError } = await supabaseAdmin
        .from('reviews')
        .select('rating')
        .eq('contractor_id', contractor.id)
        .eq('verified', true)

      if (reviewError) {
        console.error(`❌ API: Error fetching reviews for ${contractor.business_name}:`, reviewError)
        continue
      }

      const reviewCount = reviewStats?.length || 0
      const averageRating = reviewCount > 0 
        ? Math.round((reviewStats.reduce((sum, review) => sum + review.rating, 0) / reviewCount) * 100) / 100
        : 0

      // Update contractor record
      const { error: updateError } = await supabaseAdmin
        .from('contractors')
        .update({
          total_reviews: reviewCount,
          average_rating: averageRating,
          updated_at: new Date().toISOString()
        })
        .eq('id', contractor.id)

      if (updateError) {
        console.error(`❌ API: Error updating ${contractor.business_name}:`, updateError)
        results.push({
          contractor: contractor.business_name,
          success: false,
          error: updateError.message
        })
      } else {
        console.log(`✅ API: Updated ${contractor.business_name} - ${reviewCount} reviews, ${averageRating} avg rating`)
        updatedCount++
        results.push({
          contractor: contractor.business_name,
          success: true,
          reviewCount,
          averageRating
        })
      }
    }

    console.log(`✅ API: Successfully updated ${updatedCount} contractors`)

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} contractors`,
      updatedCount,
      results
    })

  } catch (error: any) {
    console.error('❌ API: Error in update contractor review counts:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
