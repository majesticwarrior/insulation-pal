import { NextRequest, NextResponse } from 'next/server'
import { stripe, leadPackages } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    console.log('Stripe checkout session API called')
    
    // Check if Stripe is configured
    console.log('🔍 Stripe configuration check:', { 
      hasStripe: !!stripe,
      hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
      secretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10) + '...'
    })
    
    if (!stripe) {
      console.log('Stripe not configured')
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' },
        { status: 500 }
      )
    }

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
      .select('business_name, contact_email')
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

    // Create Stripe checkout session
    console.log('Creating Stripe checkout session...')
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: selectedPackage.name,
              description: `${selectedPackage.credits} Lead Credits - ${selectedPackage.description}`,
              metadata: {
                packageId: selectedPackage.id,
                credits: selectedPackage.credits.toString(),
              },
            },
            unit_amount: selectedPackage.price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/contractor-dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/contractor-dashboard?payment=cancelled`,
      customer_email: contractor.contact_email,
      metadata: {
        contractorId,
        packageId: selectedPackage.id,
        credits: selectedPackage.credits.toString(),
      },
    })

    console.log('Stripe session created:', session.id)
    return NextResponse.json({ sessionId: session.id })

  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    )
  }
}
