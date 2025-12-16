import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Manual Credit Addition API
 * Use this endpoint to manually add credits when webhooks fail
 * 
 * POST /api/stripe/manual-credit-addition
 * Body: {
 *   contractorId: string
 *   credits: number
 *   stripeSessionId: string
 *   packageId: string
 *   adminKey: string (set ADMIN_API_KEY in .env.local)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { contractorId, credits, stripeSessionId, packageId, adminKey } = await request.json()

    // Simple authentication - check admin key
    const expectedAdminKey = process.env.ADMIN_API_KEY
    if (!expectedAdminKey || adminKey !== expectedAdminKey) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid admin key' },
        { status: 401 }
      )
    }

    if (!contractorId || !credits || !stripeSessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: contractorId, credits, stripeSessionId' },
        { status: 400 }
      )
    }

    console.log('🔧 Manual credit addition requested:', {
      contractorId,
      credits,
      stripeSessionId,
      packageId
    })

    // 1. Get current contractor info
    const { data: contractor, error: fetchError } = await supabaseAdmin
      .from('contractors')
      .select('id, credits, business_name')
      .eq('id', contractorId)
      .single()

    if (fetchError || !contractor) {
      console.error('❌ Contractor not found:', fetchError)
      return NextResponse.json(
        { error: 'Contractor not found', details: fetchError?.message },
        { status: 404 }
      )
    }

    console.log('✅ Contractor found:', {
      businessName: contractor.business_name,
      currentCredits: contractor.credits
    })

    // 2. Add credits using the RPC function
    console.log(`💳 Adding ${credits} credits...`)
    const { error: updateError } = await supabaseAdmin.rpc('add_contractor_credits', {
      contractor_id: contractorId,
      credits_to_add: parseInt(credits.toString())
    })

    if (updateError) {
      console.error('❌ Failed to add credits:', updateError)
      return NextResponse.json(
        { error: 'Failed to add credits', details: updateError.message },
        { status: 500 }
      )
    }

    // 3. Get updated contractor info
    const { data: updatedContractor } = await supabaseAdmin
      .from('contractors')
      .select('credits')
      .eq('id', contractorId)
      .single()

    console.log('✅ Credits added successfully!')

    // 4. Check if transaction already exists
    const { data: existingTransaction } = await supabaseAdmin
      .from('credit_transactions')
      .select('id')
      .eq('stripe_session_id', stripeSessionId)
      .single()

    if (!existingTransaction) {
      // Log the transaction
      console.log('📝 Recording transaction...')
      const { error: logError } = await supabaseAdmin
        .from('credit_transactions')
        .insert({
          contractor_id: contractorId,
          package_id: packageId || 'manual',
          credits_purchased: parseInt(credits.toString()),
          amount_paid: parseInt(credits.toString()) * 30 * 100, // Assuming $30 per credit in cents
          stripe_session_id: stripeSessionId,
          transaction_type: 'purchase',
          status: 'completed'
        })

      if (logError) {
        console.warn('⚠️ Warning: Failed to log transaction:', logError)
      } else {
        console.log('✅ Transaction recorded successfully!')
      }
    } else {
      console.log('ℹ️ Transaction already exists, skipping...')
    }

    return NextResponse.json({
      success: true,
      message: 'Credits added successfully',
      data: {
        contractorId,
        businessName: contractor.business_name,
        previousCredits: contractor.credits,
        creditsAdded: credits,
        newCredits: updatedContractor?.credits
      }
    })

  } catch (error: any) {
    console.error('❌ Error in manual credit addition:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

