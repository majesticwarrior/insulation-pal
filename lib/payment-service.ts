import Stripe from 'stripe'
import { supabase } from './supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number // in cents
  popular?: boolean
}

export const creditPackages: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 10,
    price: 19900, // $199
  },
  {
    id: 'professional',
    name: 'Professional Pack',
    credits: 25,
    price: 39900, // $399
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Pack',
    credits: 50,
    price: 69900, // $699
  },
  {
    id: 'bulk',
    name: 'Bulk Pack',
    credits: 100,
    price: 119900, // $1199
  }
]

export async function createPaymentIntent(
  contractorId: string,
  packageId: string
) {
  try {
    const package = creditPackages.find(p => p.id === packageId)
    if (!package) {
      throw new Error('Invalid package')
    }

    // Get contractor details
    const { data: contractor, error: contractorError } = await supabase
      .from('contractors')
      .select('business_name, users(email)')
      .eq('id', contractorId)
      .single()

    if (contractorError) throw contractorError

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: package.price,
      currency: 'usd',
      metadata: {
        contractor_id: contractorId,
        package_id: packageId,
        credits: package.credits.toString(),
        business_name: contractor.business_name
      },
      receipt_email: contractor.users.email
    })

    return {
      client_secret: paymentIntent.client_secret,
      amount: package.price,
      credits: package.credits
    }
  } catch (error) {
    console.error('Payment intent creation error:', error)
    throw error
  }
}

export async function processSuccessfulPayment(paymentIntentId: string) {
  try {
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment not successful')
    }

    const { contractor_id, credits, package_id } = paymentIntent.metadata

    // Add credits to contractor account
    const { data: contractor, error: fetchError } = await supabase
      .from('contractors')
      .select('credits')
      .eq('id', contractor_id)
      .single()

    if (fetchError) throw fetchError

    const newCredits = (contractor.credits || 0) + parseInt(credits)

    const { error: updateError } = await supabase
      .from('contractors')
      .update({ credits: newCredits })
      .eq('id', contractor_id)

    if (updateError) throw updateError

    // Record the transaction
    await supabase
      .from('credit_transactions')
      .insert({
        contractor_id,
        package_id,
        credits_purchased: parseInt(credits),
        amount_paid: paymentIntent.amount,
        stripe_payment_intent_id: paymentIntentId,
        status: 'completed'
      })

    return { success: true, newCredits }
  } catch (error) {
    console.error('Payment processing error:', error)
    throw error
  }
}

// Webhook handler for Stripe events
export async function handleStripeWebhook(
  body: string,
  signature: string
) {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case 'payment_intent.succeeded':
        await processSuccessfulPayment(event.data.object.id)
        break
      
      case 'payment_intent.payment_failed':
        // Handle failed payment
        console.log('Payment failed:', event.data.object.id)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return { received: true }
  } catch (error) {
    console.error('Webhook error:', error)
    throw error
  }
}
