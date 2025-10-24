import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session.url) {
      return NextResponse.json(
        { error: 'No checkout URL available' },
        { status: 400 }
      )
    }

    // Redirect to Stripe checkout
    return NextResponse.redirect(session.url)

  } catch (error: any) {
    console.error('Error redirecting to checkout:', error)
    return NextResponse.json(
      { error: 'Failed to redirect to checkout' },
      { status: 500 }
    )
  }
}
