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
      insulationAdded, 
      comments 
    } = body
    
    console.log('🔍 API: Parsed review data:', { 
      contractorId, 
      leadAssignmentId, 
      customerName, 
      customerEmail, 
      rating, 
      insulationAdded, 
      comments 
    })
    
    if (!contractorId || !leadAssignmentId || !customerName || !customerEmail || !rating || !insulationAdded || !comments) {
      console.log('❌ API: Missing required fields')
      console.log('❌ API: Field check:', {
        contractorId: !!contractorId,
        leadAssignmentId: !!leadAssignmentId,
        customerName: !!customerName,
        customerEmail: !!customerEmail,
        rating: !!rating,
        insulationAdded: !!insulationAdded,
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
              insulationAdded,
              comments
            },
            fieldCheck: {
              contractorId: !!contractorId,
              leadAssignmentId: !!leadAssignmentId,
              customerName: !!customerName,
              customerEmail: !!customerEmail,
              rating: !!rating,
              insulationAdded: !!insulationAdded,
              comments: !!comments
            }
          }
        },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Insert review using service role (bypasses RLS)
    const { data: reviewData, error: reviewError } = await supabaseAdmin
      .from('reviews')
      .insert({
        contractor_id: contractorId,
        lead_assignment_id: leadAssignmentId,
        customer_name: customerName,
        customer_email: customerEmail,
        rating: rating,
        insulation_added: insulationAdded,
        comments: comments,
        review_date: new Date().toISOString(),
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

    // Update contractor's review count and average rating
    const { error: updateError } = await supabaseAdmin
      .rpc('update_contractor_reviews', {
        contractor_id_param: contractorId
      })

    if (updateError) {
      console.error('❌ API: Error updating contractor stats:', updateError)
      // Don't fail the request, just log the error
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
