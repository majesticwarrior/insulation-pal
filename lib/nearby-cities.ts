/**
 * Nearby Cities Utility
 * 
 * This module provides functionality to get nearby cities for review fallback.
 * When a city page has no customer reviews, we can show reviews from nearby cities
 * in the same state to provide relevant social proof.
 */

// Define nearby cities by state for review fallback
// Each city maps to an array of nearby cities in order of proximity
export const nearbyCitiesMap: Record<string, Record<string, string[]>> = {
  'AZ': {
    'phoenix': ['scottsdale', 'tempe', 'mesa', 'glendale', 'chandler', 'peoria', 'gilbert', 'surprise'],
    'scottsdale': ['phoenix', 'tempe', 'mesa', 'chandler', 'gilbert'],
    'tempe': ['phoenix', 'scottsdale', 'mesa', 'chandler', 'gilbert'],
    'mesa': ['phoenix', 'tempe', 'chandler', 'gilbert', 'scottsdale'],
    'chandler': ['gilbert', 'mesa', 'phoenix', 'tempe'],
    'gilbert': ['chandler', 'mesa', 'phoenix', 'tempe'],
    'glendale': ['phoenix', 'peoria', 'surprise', 'avondale', 'goodyear'],
    'peoria': ['glendale', 'phoenix', 'surprise', 'goodyear'],
    'surprise': ['peoria', 'glendale', 'phoenix', 'goodyear', 'avondale'],
    'avondale': ['goodyear', 'glendale', 'phoenix', 'surprise'],
    'goodyear': ['avondale', 'surprise', 'peoria', 'glendale'],
    'buckeye': ['goodyear', 'avondale', 'phoenix'],
    'maricopa': ['phoenix', 'chandler', 'gilbert'],
    'tucson': ['phoenix'], // Tucson is far, so only fallback to Phoenix
    'flagstaff': ['phoenix'], // Flagstaff is far, so only fallback to Phoenix
    'prescott': ['phoenix'], // Prescott is far, so only fallback to Phoenix
    'sun city': ['surprise', 'peoria', 'glendale', 'phoenix']
  }
  // Add more states as needed
}

/**
 * Get nearby cities for a given city and state
 * Returns an array of nearby city names in order of proximity
 * 
 * @param city - The city name (case-insensitive)
 * @param state - The state abbreviation (e.g., 'AZ')
 * @returns Array of nearby city names, or empty array if no nearby cities found
 */
export const getNearbyCities = (city: string, state: string): string[] => {
  const normalizedCity = city.toLowerCase().trim()
  const normalizedState = state.toUpperCase().trim()
  
  const stateCities = nearbyCitiesMap[normalizedState]
  if (!stateCities) {
    return []
  }
  
  const nearbyCities = stateCities[normalizedCity]
  if (!nearbyCities) {
    return []
  }
  
  return nearbyCities
}

/**
 * Get all cities in a state (for ultimate fallback)
 * 
 * @param state - The state abbreviation (e.g., 'AZ')
 * @returns Array of all city names in the state
 */
export const getAllCitiesInState = (state: string): string[] => {
  const normalizedState = state.toUpperCase().trim()
  const stateCities = nearbyCitiesMap[normalizedState]
  
  if (!stateCities) {
    return []
  }
  
  // Return all unique cities in the state
  const allCities = new Set<string>()
  
  // Add all keys (primary cities)
  Object.keys(stateCities).forEach(city => allCities.add(city))
  
  // Add all nearby cities from values
  Object.values(stateCities).forEach(nearby => {
    nearby.forEach(city => allCities.add(city))
  })
  
  return Array.from(allCities)
}

/**
 * Normalize city name for comparison
 * Handles common variations and removes extra whitespace
 * 
 * @param city - The city name to normalize
 * @returns Normalized city name
 */
export const normalizeCityName = (city: string): string => {
  return city
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
}

/**
 * Check if two cities match (accounting for variations)
 * 
 * @param city1 - First city name
 * @param city2 - Second city name
 * @returns True if cities match
 */
export const citiesMatch = (city1: string, city2: string): boolean => {
  return normalizeCityName(city1) === normalizeCityName(city2)
}

