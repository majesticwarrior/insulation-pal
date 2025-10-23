// Client-side Stripe configuration
import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe with publishable key
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

// Helper function to create checkout session
export const createCheckoutSession = async (packageId: string, contractorId: string) => {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      packageId,
      contractorId,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create checkout session')
  }

  const { sessionId } = await response.json()
  return sessionId
}

// Helper function to redirect to checkout
export const redirectToCheckout = async (packageId: string, contractorId: string) => {
  const stripe = await stripePromise
  
  if (!stripe) {
    throw new Error('Stripe failed to initialize')
  }

  const sessionId = await createCheckoutSession(packageId, contractorId)
  
  // Use window.location for redirect instead of stripe.redirectToCheckout
  window.location.href = `/api/stripe/checkout-redirect?sessionId=${sessionId}`
}
