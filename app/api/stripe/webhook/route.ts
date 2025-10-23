import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      
      const { contractorId, packageId, credits } = session.metadata!
      
      if (!contractorId || !packageId || !credits) {
        console.error('Missing metadata in checkout session:', session.metadata)
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
      }

      // Add credits to contractor
      const { error: updateError } = await supabaseAdmin.rpc('add_contractor_credits', {
        contractor_id: contractorId,
        credits_to_add: parseInt(credits)
      })

      if (updateError) {
        console.error('Failed to add credits to contractor:', updateError)
        return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 })
      }

      // Log the transaction
      const { error: logError } = await supabaseAdmin
        .from('credit_transactions')
        .insert({
          contractor_id: contractorId,
          package_id: packageId,
          credits_purchased: parseInt(credits),
          amount_paid: session.amount_total,
          stripe_session_id: session.id,
          transaction_type: 'purchase',
          status: 'completed'
        })

      if (logError) {
        console.error('Failed to log transaction:', logError)
        // Don't fail the webhook for logging errors
      }

      console.log(`Successfully added ${credits} credits to contractor ${contractorId}`)
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
