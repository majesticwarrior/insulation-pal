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
    console.log('🔍 API: Submit review route called')
    
    const body = await request.json()
    console.log('🔍 API: Raw request body:', JSON.stringify(body, null, 2))
    
    const { 
      contractorId, 
      leadAssignmentId, 
      customerName, 
      customerEmail, 
      rating, 
      comments 
    } = body
    
    console.log('🔍 API: Parsed review data:', { 
      contractorId, 
      leadAssignmentId, 
      customerName, 
      customerEmail, 
      rating, 
      comments 
    })
    
    if (!contractorId || !leadAssignmentId || !customerName || !customerEmail || !rating || !comments) {
      console.log('❌ API: Missing required fields')
      console.log('❌ API: Field check:', {
        contractorId: !!contractorId,
        leadAssignmentId: !!leadAssignmentId,
        customerName: !!customerName,
        customerEmail: !!customerEmail,
        rating: !!rating,
        comments: !!comments
      })
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          debug: {
            receivedFields: {
              contractorId,
              leadAssignmentId,
              customerName,
              customerEmail,
              rating,
              comments
            },
            fieldCheck: {
              contractorId: !!contractorId,
              leadAssignmentId: !!leadAssignmentId,
              customerName: !!customerName,
              customerEmail: !!customerEmail,
              rating: !!rating,
              comments: !!comments
            }
          }
        },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // leadAssignmentId is actually the lead_id, need to get the actual assignment ID
    console.log('🔍 API: Looking up assignment for lead_id:', leadAssignmentId)
    const { data: assignment, error: assignmentError } = await supabaseAdmin
      .from('lead_assignments')
      .select('id')
      .eq('lead_id', leadAssignmentId)
      .eq('contractor_id', contractorId)
      .single()

    if (assignmentError || !assignment) {
      console.error('❌ API: Assignment not found:', assignmentError)
      return NextResponse.json(
        { success: false, error: 'Assignment not found for this lead and contractor' },
        { status: 404 }
      )
    }

    console.log('✅ API: Found assignment ID:', assignment.id)

    // Insert review using service role (bypasses RLS)
    const { data: reviewData, error: reviewError } = await supabaseAdmin
      .from('reviews')
      .insert({
        contractor_id: contractorId,
        lead_assignment_id: assignment.id,
        customer_name: customerName,
        customer_email: customerEmail,
        rating: rating,
        comment: comments,
        verified: true // Mark as verified since it's from a completed project
      })
      .select()

    if (reviewError) {
      console.error('❌ API: Error inserting review:', reviewError)
      console.error('❌ API: Review error details:', {
        message: reviewError.message,
        code: reviewError.code,
        details: reviewError.details,
        hint: reviewError.hint
      })
      return NextResponse.json(
        { success: false, error: 'Failed to submit review' },
        { status: 500 }
      )
    }

    console.log('✅ API: Review submitted successfully:', reviewData)

    // Manually update contractor stats (backup in case trigger doesn't work) - count all reviews
    const { data: reviewStats, error: statsError } = await supabaseAdmin
      .from('reviews')
      .select('rating')
      .eq('contractor_id', contractorId)

    if (!statsError && reviewStats) {
      const reviewCount = reviewStats.length
      const averageRating = reviewCount > 0 
        ? Math.round((reviewStats.reduce((sum, review) => sum + review.rating, 0) / reviewCount) * 100) / 100
        : 0

      await supabaseAdmin
        .from('contractors')
        .update({
          total_reviews: reviewCount,
          average_rating: averageRating,
          updated_at: new Date().toISOString()
        })
        .eq('id', contractorId)

      console.log(`✅ API: Updated contractor stats - ${reviewCount} reviews, ${averageRating} avg rating`)
    }

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      data: reviewData
    })

  } catch (error: any) {
    console.error('❌ API: Error in review submission:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
