// Payment service placeholder - will be implemented when Stripe is installed

// import Stripe from 'stripe'
import { supabase } from './supabase'

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2023-10-16',
// })

export interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  description: string
}

export const creditPackages: CreditPackage[] = [
  {
    id: 'basic',
    name: 'Basic Package',
    credits: 10,
    price: 200,
    description: '10 lead credits - perfect for getting started'
  },
  {
    id: 'professional',
    name: 'Professional Package', 
    credits: 25,
    price: 450,
    description: '25 lead credits - great for growing businesses'
  },
  {
    id: 'premium',
    name: 'Premium Package',
    credits: 50,
    price: 800,
    description: '50 lead credits - best value for busy contractors'
  }
]

export async function createPaymentIntent(
  contractorId: string,
  packageId: string
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  try {
    const creditPackage = creditPackages.find(pkg => pkg.id === packageId)
    if (!creditPackage) {
      throw new Error('Invalid package selected')
    }

    // Placeholder implementation
    console.log('Would create payment intent for:', {
      contractorId,
      packageId,
      amount: creditPackage.price,
      credits: creditPackage.credits
    })

    // TODO: Implement actual Stripe payment intent creation
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: creditPackage.price * 100, // Convert to cents
    //   currency: 'usd',
    //   metadata: {
    //     contractor_id: contractorId,
    //     package_id: packageId,
    //     credits: creditPackage.credits.toString()
    //   }
    // })

    // Record the transaction as pending
    await (supabase as any).from('credit_transactions').insert({
      contractor_id: contractorId,
      transaction_type: 'purchase',
      credits_amount: creditPackage.credits,
      cost_amount: creditPackage.price,
      package_id: packageId,
      package_name: creditPackage.name,
      status: 'pending',
      description: `Purchase of ${creditPackage.name}`
    })

    return {
      clientSecret: 'placeholder_client_secret',
      paymentIntentId: 'placeholder_payment_intent'
    }

  } catch (error) {
    console.error('Payment intent creation error:', error)
    throw error
  }
}

export async function confirmPayment(
  paymentIntentId: string,
  contractorId: string
): Promise<{ success: boolean }> {
  try {
    // Placeholder implementation
    console.log('Would confirm payment:', paymentIntentId, contractorId)

    // TODO: Implement actual payment confirmation
    // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    // if (paymentIntent.status === 'succeeded') {
    //   // Add credits to contractor
    //   const credits = parseInt(paymentIntent.metadata.credits)
    //   await addCreditsToContractor(contractorId, credits, paymentIntentId)
    //   return { success: true }
    // }

    return { success: true }

  } catch (error) {
    console.error('Payment confirmation error:', error)
    throw error
  }
}

async function addCreditsToContractor(
  contractorId: string, 
  credits: number, 
  paymentIntentId: string
) {
  try {
    // Update contractor credits
    const { data: contractor } = await (supabase as any)
      .from('contractors')
      .select('credits')
      .eq('id', contractorId)
      .single()

    if (contractor) {
      await (supabase as any)
        .from('contractors')
        .update({ credits: contractor.credits + credits })
        .eq('id', contractorId)
    }

    // Update transaction status
    await (supabase as any)
      .from('credit_transactions')
      .update({ 
        status: 'completed',
        stripe_payment_intent_id: paymentIntentId,
        processed_at: new Date().toISOString()
      })
      .eq('contractor_id', contractorId)
      .eq('status', 'pending')

    console.log(`Added ${credits} credits to contractor ${contractorId}`)

  } catch (error) {
    console.error('Error adding credits:', error)
    throw error
  }
}