/**
 * Manual Credit Addition Script
 * Use this to manually add credits to a contractor when webhook fails
 * 
 * Usage:
 * npx ts-node scripts/add-credits-manually.ts <contractor_id> <credits> <session_id>
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addCreditsManually(
  contractorId: string,
  creditsToAdd: number,
  stripeSessionId: string,
  packageId: string = 'single'
) {
  try {
    console.log('🔍 Starting manual credit addition...')
    console.log({
      contractorId,
      creditsToAdd,
      stripeSessionId,
      packageId
    })

    // 1. Get current contractor info
    const { data: contractor, error: fetchError } = await supabase
      .from('contractors')
      .select('id, credits, business_name')
      .eq('id', contractorId)
      .single()

    if (fetchError || !contractor) {
      console.error('❌ Contractor not found:', fetchError)
      return { success: false, error: 'Contractor not found' }
    }

    console.log('✅ Contractor found:', {
      businessName: contractor.business_name,
      currentCredits: contractor.credits
    })

    // 2. Add credits using the RPC function
    console.log(`💳 Adding ${creditsToAdd} credits...`)
    const { error: updateError } = await supabase.rpc('add_contractor_credits', {
      contractor_id: contractorId,
      credits_to_add: creditsToAdd
    })

    if (updateError) {
      console.error('❌ Failed to add credits:', updateError)
      return { success: false, error: updateError.message }
    }

    // 3. Get updated contractor info
    const { data: updatedContractor } = await supabase
      .from('contractors')
      .select('credits')
      .eq('id', contractorId)
      .single()

    console.log('✅ Credits added successfully!')
    console.log({
      previousCredits: contractor.credits,
      newCredits: updatedContractor?.credits,
      creditsAdded: creditsToAdd
    })

    // 4. Log the transaction
    console.log('📝 Recording transaction...')
    const { error: logError } = await supabase
      .from('credit_transactions')
      .insert({
        contractor_id: contractorId,
        package_id: packageId,
        credits_purchased: creditsToAdd,
        amount_paid: creditsToAdd * 30 * 100, // Assuming $30 per credit in cents
        stripe_session_id: stripeSessionId,
        transaction_type: 'purchase',
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (logError) {
      console.warn('⚠️ Warning: Failed to log transaction (credits were still added):', logError)
    } else {
      console.log('✅ Transaction recorded successfully!')
    }

    return {
      success: true,
      previousCredits: contractor.credits,
      newCredits: updatedContractor?.credits,
      creditsAdded: creditsToAdd
    }

  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    return { success: false, error: error.message }
  }
}

// Main execution
const args = process.argv.slice(2)

if (args.length < 3) {
  console.log('')
  console.log('❌ Missing required arguments!')
  console.log('')
  console.log('Usage:')
  console.log('  npx ts-node scripts/add-credits-manually.ts <contractor_id> <credits> <session_id> [package_id]')
  console.log('')
  console.log('Example:')
  console.log('  npx ts-node scripts/add-credits-manually.ts d54d6918-59bd-4694-84c1-f19dfe843dd1 1 cs_live_xxx single')
  console.log('')
  process.exit(1)
}

const [contractorId, credits, sessionId, packageId] = args

addCreditsManually(
  contractorId,
  parseInt(credits),
  sessionId,
  packageId || 'single'
).then((result) => {
  if (result.success) {
    console.log('')
    console.log('🎉 SUCCESS! Credits have been added to the contractor.')
    console.log('')
  } else {
    console.log('')
    console.log('❌ FAILED:', result.error)
    console.log('')
    process.exit(1)
  }
})

