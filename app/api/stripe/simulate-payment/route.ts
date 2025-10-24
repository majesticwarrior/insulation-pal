import { NextRequest, NextResponse } from 'next/server'
import { leadPackages } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    console.log('🎭 Demo payment simulation API called')
    
    const { packageId, contractorId } = await request.json()
    console.log('Received request:', { packageId, contractorId })

    if (!packageId || !contractorId) {
      return NextResponse.json(
        { error: 'Package ID and Contractor ID are required' },
        { status: 400 }
      )
    }

    // Find the package
    const selectedPackage = leadPackages.find(pkg => pkg.id === packageId)
    if (!selectedPackage) {
      return NextResponse.json(
        { error: 'Invalid package ID' },
        { status: 400 }
      )
    }

    console.log('Selected package:', selectedPackage.name)

    // Get contractor information
    console.log('Fetching contractor information...')
    const { data: contractor, error: contractorError } = await supabaseAdmin
      .from('contractors')
      .select('business_name, contact_email, credits')
      .eq('id', contractorId)
      .single()

    if (contractorError) {
      console.error('Contractor fetch error:', contractorError)
      return NextResponse.json(
        { error: 'Contractor not found or database connection failed', details: contractorError.message },
        { status: 404 }
      )
    }

    if (!contractor) {
      console.log('No contractor found')
      return NextResponse.json(
        { error: 'Contractor not found' },
        { status: 404 }
      )
    }

    console.log('Contractor found:', contractor.business_name)

    // Simulate adding credits to contractor
    console.log('🎭 Simulating credit addition...')
    const newCredits = (contractor.credits || 0) + selectedPackage.credits
    
    const { error: updateError } = await supabaseAdmin
      .from('contractors')
      .update({ credits: newCredits })
      .eq('id', contractorId)

    if (updateError) {
      console.error('Error updating contractor credits:', updateError)
      return NextResponse.json(
        { error: 'Failed to update contractor credits', details: updateError.message },
        { status: 500 }
      )
    }

    // Record the transaction
    console.log('🎭 Recording demo transaction...')
    const { error: transactionError } = await supabaseAdmin
      .from('credit_transactions')
      .insert({
        contractor_id: contractorId,
        package_id: selectedPackage.id,
        credits_purchased: selectedPackage.credits,
        amount_paid: selectedPackage.price * 100, // Convert to cents
        transaction_type: 'purchase',
        status: 'completed',
        description: `Demo purchase of ${selectedPackage.name}`,
        processed_at: new Date().toISOString()
      })

    if (transactionError) {
      console.error('Error recording transaction:', transactionError)
      // Don't fail the request if transaction recording fails
    }

    console.log('✅ Demo payment completed successfully')
    return NextResponse.json({ 
      success: true, 
      creditsAdded: selectedPackage.credits,
      newTotalCredits: newCredits,
      message: 'Demo payment completed successfully'
    })

  } catch (error: any) {
    console.error('Error in demo payment simulation:', error)
    return NextResponse.json(
      { error: 'Failed to simulate payment', details: error.message },
      { status: 500 }
    )
  }
}
