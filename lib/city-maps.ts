// City coordinates and zoom levels for Google Maps embeds
export const cityMapConfig = {
  phoenix: { lat: 33.4484, lng: -112.0740, zoom: 12 },
  mesa: { lat: 33.4152, lng: -111.8315, zoom: 12 },
  chandler: { lat: 33.3062, lng: -111.8413, zoom: 12 },
  scottsdale: { lat: 33.4942, lng: -111.9261, zoom: 12 },
  glendale: { lat: 33.5387, lng: -112.1856, zoom: 12 },
  gilbert: { lat: 33.3528, lng: -111.7890, zoom: 12 },
  tempe: { lat: 33.4255, lng: -111.9400, zoom: 12 },
  peoria: { lat: 33.5806, lng: -112.2374, zoom: 12 },
  surprise: { lat: 33.6292, lng: -112.3680, zoom: 12 },
  tucson: { lat: 32.2226, lng: -110.9747, zoom: 12 },
  avondale: { lat: 33.4356, lng: -112.3496, zoom: 13 },
  goodyear: { lat: 33.4353, lng: -112.3582, zoom: 13 },
  buckeye: { lat: 33.3703, lng: -112.5839, zoom: 13 },
  maricopa: { lat: 33.0581, lng: -112.0476, zoom: 13 },
  'sun-city': { lat: 33.5976, lng: -112.2795, zoom: 13 },
  flagstaff: { lat: 35.1983, lng: -111.6513, zoom: 13 },
  prescott: { lat: 34.5400, lng: -112.4689, zoom: 13 },
}

export const getCityMapUrl = (citySlug: string, cityName: string): string => {
  const config = cityMapConfig[citySlug.toLowerCase() as keyof typeof cityMapConfig]
  
  if (!config) {
    // Fallback to a generic Arizona map if city not found
    return `https://www.google.com/maps?q=Arizona&output=embed`
  }
  
  const { lat, lng } = config
  // Use the simple embed format with query parameter
  return `https://www.google.com/maps?q=${encodeURIComponent(cityName + ', AZ')}&output=embed&ll=${lat},${lng}&z=${config.zoom}`
}

