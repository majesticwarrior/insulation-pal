// Stripe configuration and utilities
import Stripe from 'stripe'

// Initialize Stripe with secret key (only if available)
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
    })
  : null

// Lead package pricing structure
export const leadPackages = [
  {
    id: 'starter',
    name: 'Starter Package',
    credits: 5,
    price: 100, // $100
    pricePerCredit: 20,
    description: 'Perfect for new contractors',
    popular: false
  },
  {
    id: 'professional',
    name: 'Professional Package', 
    credits: 10,
    price: 190, // $190
    pricePerCredit: 19,
    description: 'Most popular choice',
    popular: true
  },
  {
    id: 'business',
    name: 'Business Package',
    credits: 25,
    price: 450, // $450
    pricePerCredit: 18,
    description: 'Best value for established contractors',
    popular: false
  },
  {
    id: 'enterprise',
    name: 'Enterprise Package',
    credits: 50,
    price: 850, // $850
    pricePerCredit: 17,
    description: 'Maximum value for high-volume contractors',
    popular: false
  }
] as const

export type LeadPackage = typeof leadPackages[number]

// Helper function to get package by ID
export const getPackageById = (id: string): LeadPackage | undefined => {
  return leadPackages.find(pkg => pkg.id === id)
}

// Helper function to format price
export const formatPrice = (priceInCents: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(priceInCents / 100)
}
