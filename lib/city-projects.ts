/**
 * City Projects Utility
 * 
 * This module provides functionality to fetch contractor portfolio projects for city pages
 * Projects are filtered by where the customer lives (not where the project was completed)
 */

import { supabase } from './supabase'
import { getNearbyCities, normalizeCityName } from './nearby-cities'

export interface CityProject {
  id: string
  contractor_id: string
  lead_assignment_id: string | null
  title: string
  description: string | null
  service_type: string | null
  areas_insulated: string[] | null
  insulation_types: string[] | null
  project_size_sqft: number | null
  completion_date: string | null
  before_image_url: string | null
  after_image_url: string | null
  additional_images: string[] | null
  customer_city: string | null
  customer_state: string | null
  project_city: string
  project_state: string
  is_featured: boolean
  display_order: number
  created_at: string
  contractors: {
    business_name: string
    business_city: string | null
    business_state: string | null
    status: string
  }
}

export interface ProjectFetchResult {
  projects: CityProject[]
  source: 'exact' | 'nearby' | 'state'
  citiesIncluded: string[]
}

/**
 * Fetch projects for a city page with intelligent fallback
 * 
 * Priority order:
 * 1. Projects from customers in the exact city
 * 2. Projects from customers in nearby cities (same state)
 * 3. Projects from anywhere in the state
 * 
 * @param city - The city name (e.g., 'Peoria')
 * @param state - The state abbreviation (e.g., 'AZ')
 * @param limit - Maximum number of projects to return (default: 12)
 * @returns ProjectFetchResult with projects and metadata
 */
export const getCityProjects = async (
  city: string,
  state: string,
  limit: number = 12
): Promise<ProjectFetchResult> => {
  const normalizedCity = normalizeCityName(city)
  const normalizedState = state.toUpperCase().trim()

  // Step 1: Try to get projects from customers in the exact city
  const exactCityProjects = await fetchProjectsByCustomerLocation(
    normalizedCity,
    normalizedState,
    limit
  )

  if (exactCityProjects.length >= 5) {
    // We have enough projects from the exact city
    return {
      projects: exactCityProjects.slice(0, limit),
      source: 'exact',
      citiesIncluded: [city]
    }
  }

  // Step 2: Not enough projects from exact city, try nearby cities
  const nearbyCities = getNearbyCities(normalizedCity, normalizedState)
  
  if (nearbyCities.length > 0) {
    const citiesIncluded = [normalizedCity, ...nearbyCities]
    const nearbyProjects = await fetchProjectsByCustomerLocations(
      citiesIncluded,
      normalizedState,
      limit
    )

    if (nearbyProjects.length > 0) {
      return {
        projects: nearbyProjects.slice(0, limit),
        source: 'nearby',
        citiesIncluded: [city, ...nearbyCities]
      }
    }
  }

  // Step 3: Ultimate fallback - get any projects from the state
  const stateProjects = await fetchProjectsByState(normalizedState, limit)

  return {
    projects: stateProjects.slice(0, limit),
    source: 'state',
    citiesIncluded: ['All cities in ' + normalizedState]
  }
}

/**
 * Fetch projects from customers in a specific city
 * 
 * @param city - Normalized city name
 * @param state - Normalized state abbreviation
 * @param limit - Maximum number of projects
 * @returns Array of projects
 */
const fetchProjectsByCustomerLocation = async (
  city: string,
  state: string,
  limit: number
): Promise<CityProject[]> => {
  try {
    const { data: projects, error } = await (supabase as any)
      .from('contractor_portfolio')
      .select(`
        id,
        contractor_id,
        lead_assignment_id,
        title,
        description,
        service_type,
        areas_insulated,
        insulation_types,
        project_size_sqft,
        completion_date,
        before_image_url,
        after_image_url,
        additional_images,
        customer_city,
        customer_state,
        project_city,
        project_state,
        is_featured,
        display_order,
        created_at,
        contractors!inner(
          business_name,
          business_city,
          business_state,
          status
        )
      `)
      .eq('contractors.status', 'approved')
      .ilike('customer_city', city)
      .ilike('customer_state', state)
      .not('after_image_url', 'is', null) // Only show projects with images
      .order('completion_date', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching projects by customer location:', error)
      return []
    }

    return projects || []
  } catch (error) {
    console.error('Error in fetchProjectsByCustomerLocation:', error)
    return []
  }
}

/**
 * Fetch projects from customers in multiple cities (for nearby city fallback)
 * 
 * @param cities - Array of normalized city names
 * @param state - Normalized state abbreviation
 * @param limit - Maximum number of projects
 * @returns Array of projects
 */
const fetchProjectsByCustomerLocations = async (
  cities: string[],
  state: string,
  limit: number
): Promise<CityProject[]> => {
  try {
    // Build OR query for multiple cities
    const cityQueries = cities.map(city => `customer_city.ilike.${city}`)
    const orQuery = cityQueries.join(',')

    const { data: projects, error } = await (supabase as any)
      .from('contractor_portfolio')
      .select(`
        id,
        contractor_id,
        lead_assignment_id,
        title,
        description,
        service_type,
        areas_insulated,
        insulation_types,
        project_size_sqft,
        completion_date,
        before_image_url,
        after_image_url,
        additional_images,
        customer_city,
        customer_state,
        project_city,
        project_state,
        is_featured,
        display_order,
        created_at,
        contractors!inner(
          business_name,
          business_city,
          business_state,
          status
        )
      `)
      .eq('contractors.status', 'approved')
      .ilike('customer_state', state)
      .or(orQuery)
      .not('after_image_url', 'is', null)
      .order('completion_date', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching projects by customer locations:', error)
      return []
    }

    return projects || []
  } catch (error) {
    console.error('Error in fetchProjectsByCustomerLocations:', error)
    return []
  }
}

/**
 * Fetch projects from anywhere in the state (ultimate fallback)
 * 
 * @param state - Normalized state abbreviation
 * @param limit - Maximum number of projects
 * @returns Array of projects
 */
const fetchProjectsByState = async (
  state: string,
  limit: number
): Promise<CityProject[]> => {
  try {
    const { data: projects, error } = await (supabase as any)
      .from('contractor_portfolio')
      .select(`
        id,
        contractor_id,
        lead_assignment_id,
        title,
        description,
        service_type,
        areas_insulated,
        insulation_types,
        project_size_sqft,
        completion_date,
        before_image_url,
        after_image_url,
        additional_images,
        customer_city,
        customer_state,
        project_city,
        project_state,
        is_featured,
        display_order,
        created_at,
        contractors!inner(
          business_name,
          business_city,
          business_state,
          status
        )
      `)
      .eq('contractors.status', 'approved')
      .ilike('customer_state', state)
      .not('after_image_url', 'is', null)
      .order('completion_date', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching projects by state:', error)
      return []
    }

    return projects || []
  } catch (error) {
    console.error('Error in fetchProjectsByState:', error)
    return []
  }
}

/**
 * Fetch all projects for a specific contractor (for contractor profile page)
 * No location filtering - shows all projects for the contractor
 * 
 * @param contractorId - The contractor's UUID
 * @param limit - Maximum number of projects (default: 50)
 * @returns Array of projects
 */
export const getContractorProjects = async (
  contractorId: string,
  limit: number = 50
): Promise<CityProject[]> => {
  try {
    const { data: projects, error } = await (supabase as any)
      .from('contractor_portfolio')
      .select(`
        id,
        contractor_id,
        lead_assignment_id,
        title,
        description,
        service_type,
        areas_insulated,
        insulation_types,
        project_size_sqft,
        completion_date,
        before_image_url,
        after_image_url,
        additional_images,
        customer_city,
        customer_state,
        project_city,
        project_state,
        is_featured,
        display_order,
        created_at,
        contractors!inner(
          business_name,
          business_city,
          business_state,
          status
        )
      `)
      .eq('contractor_id', contractorId)
      .order('completion_date', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching contractor projects:', error)
      return []
    }

    return projects || []
  } catch (error) {
    console.error('Error in getContractorProjects:', error)
    return []
  }
}

/**
 * Format areas insulated for display
 * 
 * @param areas - Array of areas or single area
 * @returns Formatted string
 */
export const formatAreasInsulated = (areas: string[] | string | null): string => {
  if (!areas) return 'N/A'
  
  const areasArray = Array.isArray(areas) ? areas : [areas]
  
  if (areasArray.length === 0) return 'N/A'
  if (areasArray.length === 1) return capitalizeFirst(areasArray[0])
  if (areasArray.length === 2) return areasArray.map(capitalizeFirst).join(' and ')
  
  const lastArea = areasArray[areasArray.length - 1]
  const otherAreas = areasArray.slice(0, -1)
  return otherAreas.map(capitalizeFirst).join(', ') + ', and ' + capitalizeFirst(lastArea)
}

/**
 * Format insulation types for display
 * 
 * @param types - Array of insulation types
 * @returns Formatted string
 */
export const formatInsulationTypes = (types: string[] | null): string => {
  if (!types || types.length === 0) return 'N/A'
  
  return types.map(type => {
    // Convert snake_case to Title Case
    return type.split('_').map(capitalizeFirst).join(' ')
  }).join(', ')
}

/**
 * Capitalize first letter of a string
 */
const capitalizeFirst = (str: string): string => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

