/**
 * City Reviews Utility
 * 
 * This module provides functionality to fetch reviews for city pages
 * with intelligent fallback to nearby cities when needed.
 */

import { supabase } from './supabase'
import { getNearbyCities, normalizeCityName } from './nearby-cities'

export interface CityReview {
  id: string
  customer_name: string
  customer_city: string | null
  customer_state: string | null
  rating: number
  title: string | null
  comment: string | null
  service_type: string | null
  location: string | null
  verified: boolean
  created_at: string
  contractors: {
    business_name: string
    business_city: string | null
    business_state: string | null
    status: string
  }
}

export interface ReviewFetchResult {
  reviews: CityReview[]
  source: 'exact' | 'nearby' | 'state'
  citiesIncluded: string[]
}

/**
 * Fetch reviews for a city page with intelligent fallback
 * 
 * Priority order:
 * 1. Reviews from customers in the exact city
 * 2. Reviews from customers in nearby cities (same state)
 * 3. Reviews from anywhere in the state
 * 
 * @param city - The city name (e.g., 'Peoria')
 * @param state - The state abbreviation (e.g., 'AZ')
 * @param limit - Maximum number of reviews to return (default: 15)
 * @returns ReviewFetchResult with reviews and metadata
 */
export const getCityReviews = async (
  city: string,
  state: string,
  limit: number = 15
): Promise<ReviewFetchResult> => {
  const normalizedCity = normalizeCityName(city)
  const normalizedState = state.toUpperCase().trim()

  // Step 1: Try to get reviews from customers in the exact city
  const exactCityReviews = await fetchReviewsByCustomerLocation(
    normalizedCity,
    normalizedState,
    limit
  )

  if (exactCityReviews.length >= 5) {
    // We have enough reviews from the exact city
    return {
      reviews: exactCityReviews.slice(0, limit),
      source: 'exact',
      citiesIncluded: [city]
    }
  }

  // Step 2: Not enough reviews from exact city, try nearby cities
  const nearbyCities = getNearbyCities(normalizedCity, normalizedState)
  
  if (nearbyCities.length > 0) {
    const citiesIncluded = [normalizedCity, ...nearbyCities]
    const nearbyReviews = await fetchReviewsByCustomerLocations(
      citiesIncluded,
      normalizedState,
      limit
    )

    if (nearbyReviews.length > 0) {
      return {
        reviews: nearbyReviews.slice(0, limit),
        source: 'nearby',
        citiesIncluded: [city, ...nearbyCities]
      }
    }
  }

  // Step 3: Ultimate fallback - get any reviews from the state
  const stateReviews = await fetchReviewsByState(normalizedState, limit)

  return {
    reviews: stateReviews.slice(0, limit),
    source: 'state',
    citiesIncluded: ['All cities in ' + normalizedState]
  }
}

/**
 * Fetch reviews from customers in a specific city
 * 
 * @param city - Normalized city name
 * @param state - Normalized state abbreviation
 * @param limit - Maximum number of reviews
 * @returns Array of reviews
 */
const fetchReviewsByCustomerLocation = async (
  city: string,
  state: string,
  limit: number
): Promise<CityReview[]> => {
  try {
    const { data: reviews, error } = await (supabase as any)
      .from('reviews')
      .select(`
        id,
        customer_name,
        customer_city,
        customer_state,
        rating,
        title,
        comment,
        service_type,
        location,
        verified,
        created_at,
        contractors!inner(
          business_name,
          business_city,
          business_state,
          status
        )
      `)
      .eq('contractors.status', 'approved')
      .eq('verified', true) // Only show verified reviews
      .ilike('customer_city', city)
      .ilike('customer_state', state)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching reviews by customer location:', error)
      return []
    }

    return reviews || []
  } catch (error) {
    console.error('Error in fetchReviewsByCustomerLocation:', error)
    return []
  }
}

/**
 * Fetch reviews from customers in multiple cities (for nearby city fallback)
 * 
 * @param cities - Array of normalized city names
 * @param state - Normalized state abbreviation
 * @param limit - Maximum number of reviews
 * @returns Array of reviews
 */
const fetchReviewsByCustomerLocations = async (
  cities: string[],
  state: string,
  limit: number
): Promise<CityReview[]> => {
  try {
    // Build OR query for multiple cities
    const cityQueries = cities.map(city => `customer_city.ilike.${city}`)
    const orQuery = cityQueries.join(',')

    const { data: reviews, error } = await (supabase as any)
      .from('reviews')
      .select(`
        id,
        customer_name,
        customer_city,
        customer_state,
        rating,
        title,
        comment,
        service_type,
        location,
        verified,
        created_at,
        contractors!inner(
          business_name,
          business_city,
          business_state,
          status
        )
      `)
      .eq('contractors.status', 'approved')
      .eq('verified', true)
      .ilike('customer_state', state)
      .or(orQuery)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching reviews by customer locations:', error)
      return []
    }

    return reviews || []
  } catch (error) {
    console.error('Error in fetchReviewsByCustomerLocations:', error)
    return []
  }
}

/**
 * Fetch reviews from anywhere in the state (ultimate fallback)
 * 
 * @param state - Normalized state abbreviation
 * @param limit - Maximum number of reviews
 * @returns Array of reviews
 */
const fetchReviewsByState = async (
  state: string,
  limit: number
): Promise<CityReview[]> => {
  try {
    const { data: reviews, error } = await (supabase as any)
      .from('reviews')
      .select(`
        id,
        customer_name,
        customer_city,
        customer_state,
        rating,
        title,
        comment,
        service_type,
        location,
        verified,
        created_at,
        contractors!inner(
          business_name,
          business_city,
          business_state,
          status
        )
      `)
      .eq('contractors.status', 'approved')
      .eq('verified', true)
      .ilike('customer_state', state)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching reviews by state:', error)
      return []
    }

    return reviews || []
  } catch (error) {
    console.error('Error in fetchReviewsByState:', error)
    return []
  }
}

/**
 * Fetch all reviews for a specific contractor (for contractor profile page)
 * No location filtering - shows all verified reviews for the contractor
 * 
 * @param contractorId - The contractor's UUID
 * @param limit - Maximum number of reviews (default: 50)
 * @returns Array of reviews
 */
export const getContractorReviews = async (
  contractorId: string,
  limit: number = 50
): Promise<CityReview[]> => {
  try {
    const { data: reviews, error } = await (supabase as any)
      .from('reviews')
      .select(`
        id,
        customer_name,
        customer_city,
        customer_state,
        rating,
        title,
        comment,
        service_type,
        location,
        verified,
        created_at,
        contractors!inner(
          business_name,
          business_city,
          business_state,
          status
        )
      `)
      .eq('contractor_id', contractorId)
      .eq('verified', true) // Only show verified reviews
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching contractor reviews:', error)
      return []
    }

    return reviews || []
  } catch (error) {
    console.error('Error in getContractorReviews:', error)
    return []
  }
}

