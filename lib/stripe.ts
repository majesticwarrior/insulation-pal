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
    price: 50, // $50
    pricePerCredit: 10,
    description: 'Perfect for new contractors',
    popular: false
  },
  {
    id: 'professional',
    name: 'Professional Package', 
    credits: 10,
    price: 90, // $90 (10% discount)
    pricePerCredit: 9,
    description: 'Most popular choice',
    popular: true
  },
  {
    id: 'business',
    name: 'Business Package',
    credits: 25,
    price: 200, // $200 (20% discount)
    pricePerCredit: 8,
    description: 'Best value for established contractors',
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
