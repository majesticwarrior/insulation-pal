// Utility for storing and retrieving customer data (address, email) for form autopopulation

export interface CustomerData {
  address?: string
  email?: string
}

const STORAGE_KEY = 'insulationpal_customer_data'

/**
 * Save customer address and/or email to localStorage
 */
export function saveCustomerData(data: Partial<CustomerData>): void {
  if (typeof window === 'undefined') return
  
  try {
    const existing = getCustomerData()
    const updated = {
      ...existing,
      ...data
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Error saving customer data:', error)
  }
}

/**
 * Retrieve customer data from localStorage
 */
export function getCustomerData(): CustomerData {
  if (typeof window === 'undefined') return {}
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error('Error retrieving customer data:', error)
    return {}
  }
}

/**
 * Clear customer data from localStorage
 */
export function clearCustomerData(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing customer data:', error)
  }
}

/**
 * Parse address string into components (address, city, state, zipCode)
 * Attempts to parse common address formats
 */
export function parseAddress(addressString: string): {
  address: string
  city?: string
  state?: string
  zipCode?: string
} {
  if (!addressString) {
    return { address: '' }
  }

  // Try to parse formats like:
  // "123 Main St, Phoenix, AZ 85001"
  // "123 Main St, Phoenix AZ 85001"
  // "123 Main St Phoenix AZ 85001"
  
  const trimmed = addressString.trim()
  
  // Check if it contains commas (likely formatted address)
  if (trimmed.includes(',')) {
    const parts = trimmed.split(',').map(p => p.trim())
    
    if (parts.length >= 3) {
      // Format: "Street, City, State ZIP"
      const address = parts[0]
      const city = parts[1]
      const stateZip = parts[2]
      
      // Extract state and zip from "State ZIP" or "StateZIP"
      const stateZipMatch = stateZip.match(/^([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?/)
      if (stateZipMatch) {
        return {
          address,
          city,
          state: stateZipMatch[1],
          zipCode: stateZipMatch[2] || ''
        }
      }
      
      return {
        address,
        city,
        state: stateZip.split(/\s+/)[0] || '',
        zipCode: stateZip.match(/\d{5}(?:-\d{4})?/)?.[0] || ''
      }
    } else if (parts.length === 2) {
      // Format: "Street, City State ZIP" or "Street, City"
      const address = parts[0]
      const cityStateZip = parts[1]
      const stateZipMatch = cityStateZip.match(/^(.+?)\s+([A-Z]{2})\s+(\d{5}(?:-\d{4})?)?$/)
      
      if (stateZipMatch) {
        return {
          address,
          city: stateZipMatch[1],
          state: stateZipMatch[2],
          zipCode: stateZipMatch[3] || ''
        }
      }
      
      return {
        address,
        city: cityStateZip
      }
    }
  }
  
  // Try to parse format without commas: "123 Main St Phoenix AZ 85001"
  const spaceParts = trimmed.split(/\s+/)
  if (spaceParts.length >= 4) {
    // Try to find state (2 letters) and zip (5 digits) at the end
    const lastPart = spaceParts[spaceParts.length - 1]
    const secondLastPart = spaceParts[spaceParts.length - 2]
    
    // Check if last part is a zip code
    if (/^\d{5}(?:-\d{4})?$/.test(lastPart)) {
      // Check if second last is a state
      if (/^[A-Z]{2}$/.test(secondLastPart)) {
        const address = spaceParts.slice(0, -3).join(' ')
        const city = spaceParts[spaceParts.length - 3]
        return {
          address,
          city,
          state: secondLastPart,
          zipCode: lastPart
        }
      }
    }
  }
  
  // If we can't parse it, just return the full string as address
  return { address: trimmed }
}

