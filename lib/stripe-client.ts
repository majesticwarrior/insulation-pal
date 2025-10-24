// Client-side Stripe configuration
import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe with publishable key
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

// Helper function to create checkout session
export const createCheckoutSession = async (packageId: string, contractorId: string) => {
  try {
    console.log('🔄 Creating checkout session...', { packageId, contractorId })
    
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

    console.log('📡 API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API error response:', errorText)
      throw new Error(`Failed to create checkout session: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ Checkout session data:', data)
    
    if (!data.sessionId) {
      throw new Error('No session ID returned from API')
    }
    
    return data.sessionId
  } catch (error: any) {
    console.error('❌ Error in createCheckoutSession:', error)
    throw error
  }
}

// Helper function to redirect to checkout
export const redirectToCheckout = async (packageId: string, contractorId: string) => {
  try {
    console.log('🔄 Starting checkout process...', { packageId, contractorId })
    
    // Check if Stripe is configured
    const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    console.log('🔍 Stripe publishable key check:', { 
      hasKey: !!stripePublishableKey, 
      keyPrefix: stripePublishableKey?.substring(0, 10) + '...',
      isPlaceholder: stripePublishableKey?.includes('placeholder')
    })
    
    if (!stripePublishableKey || stripePublishableKey.includes('placeholder')) {
      console.log('🎭 Demo Mode: Stripe not configured, simulating payment')
      
      // Simulate a successful payment in demo mode
      const response = await fetch('/api/stripe/simulate-payment', {
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
        throw new Error('Demo payment simulation failed')
      }

      const result = await response.json()
      console.log('✅ Demo payment completed:', result)
      
      // Show success message and redirect
      window.location.href = '/contractor-dashboard?payment=success&demo=true'
      return
    }
    
    const stripe = await stripePromise
    
    if (!stripe) {
      console.error('❌ Stripe failed to initialize')
      throw new Error('Stripe failed to initialize')
    }

    console.log('✅ Stripe initialized successfully')
    
    const sessionId = await createCheckoutSession(packageId, contractorId)
    console.log('✅ Checkout session created:', sessionId)
    
    // Use window.location for redirect instead of stripe.redirectToCheckout
    const redirectUrl = `/api/stripe/checkout-redirect?sessionId=${sessionId}`
    console.log('🔄 Redirecting to:', redirectUrl)
    
    window.location.href = redirectUrl
  } catch (error: any) {
    console.error('❌ Error in redirectToCheckout:', error)
    throw error
  }
}
