// Google Maps API utilities for getting property images
export interface PropertyImages {
  streetViewUrl?: string
  satelliteUrl?: string
  mapUrl?: string
}

// Extract street name from full address (remove house number)
export function extractStreetName(address: string): string {
  if (!address) return ''
  
  // Remove house number and keep street name
  // Examples: "123 Main St" -> "Main St", "456 Oak Avenue" -> "Oak Avenue"
  const streetName = address.replace(/^\d+\s+/, '').trim()
  return streetName
}

export function getPropertyImages(address: string, city: string, state: string): PropertyImages {
  const fullAddress = `${address}, ${city}, ${state}`
  const encodedAddress = encodeURIComponent(fullAddress)
  
  // Google Street View Static API
  const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${encodedAddress}&key=${process.env.GOOGLE_MAPS_API_KEY || ''}`
  
  // Google Maps Static API (satellite view)
  const satelliteUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=20&size=600x300&maptype=satellite&markers=color:red%7C${encodedAddress}&key=${process.env.GOOGLE_MAPS_API_KEY || ''}`
  
  // Google Maps Static API (road map view)
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=16&size=600x300&maptype=roadmap&markers=color:red%7C${encodedAddress}&key=${process.env.GOOGLE_MAPS_API_KEY || ''}`
  
  return {
    streetViewUrl: process.env.GOOGLE_MAPS_API_KEY ? streetViewUrl : undefined,
    satelliteUrl: process.env.GOOGLE_MAPS_API_KEY ? satelliteUrl : undefined,
    mapUrl: process.env.GOOGLE_MAPS_API_KEY ? mapUrl : undefined
  }
}

// Fallback function to get a placeholder image if Google Maps API is not available
export function getPlaceholderImage(type: 'street' | 'satellite' | 'map'): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
  
  switch (type) {
    case 'street':
      return `${baseUrl}/professional-insulation-contractor-working-on-home.jpg`
    case 'satellite':
      return `${baseUrl}/attic-insulation-blown-in.jpg`
    case 'map':
      return `${baseUrl}/basement-insulation-installed.jpg`
    default:
      return `${baseUrl}/professional-insulation-contractor-working-on-home.jpg`
  }
}
