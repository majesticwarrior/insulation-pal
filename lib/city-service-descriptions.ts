// City-specific service descriptions for insulation services
export function getCityServiceDescriptions(cityName: string) {
  const cityLower = cityName.toLowerCase()
  
  // Hot desert climate cities (Phoenix metro area)
  const hotDesertCities = ['phoenix', 'tucson', 'mesa', 'chandler', 'scottsdale', 'glendale', 
    'gilbert', 'tempe', 'peoria', 'surprise', 'avondale', 'goodyear', 'buckeye', 'maricopa', 'sun city']
  
  // Mountain/cooler climate cities
  const mountainCities = ['flagstaff', 'prescott']
  
  const isHotDesert = hotDesertCities.some(c => cityLower.includes(c))
  const isMountain = mountainCities.some(c => cityLower.includes(c))
  
  if (isMountain) {
    // Flagstaff, Prescott - cooler mountain climate, focus on winter heating
    return {
      attic: 'Essential attic insulation to prevent heat loss during cold winters and reduce heating costs in mountain climates.',
      wall: 'Comprehensive wall insulation to maintain comfortable temperatures and lower energy bills in cooler climates.',
      sprayFoam: 'Premium spray foam insulation for superior air sealing and thermal performance in variable mountain weather.',
      crawlSpace: 'Protect your crawl space from cold air infiltration and moisture with professional insulation solutions.',
      basement: 'Complete basement insulation to create a warm, comfortable living space and prevent heat loss.',
      garage: 'Transform your garage into a comfortable space that protects against cold mountain winters.',
      removal: 'Safe removal of old, damaged insulation to prepare for modern, energy-efficient upgrades.'
    }
  } else if (cityLower.includes('tucson')) {
    // Tucson - hot desert but slightly different from Phoenix
    return {
      attic: 'Critical attic insulation to keep your Tucson home cool in extreme summer heat and reduce AC costs significantly.',
      wall: 'Effective wall insulation to block heat transfer and maintain comfortable indoor temperatures year-round.',
      sprayFoam: 'Premium spray foam insulation for maximum energy efficiency and air sealing in Tucson\'s hot climate.',
      crawlSpace: 'Protect your crawl space from heat and maintain cooler temperatures throughout your home.',
      basement: 'Complete basement insulation solutions to keep your space comfortable in Tucson\'s hot summers.',
      garage: 'Transform your garage into a comfortable space that prevents extreme heat from affecting your home.',
      removal: 'Professional removal of old, damaged insulation to upgrade to modern, energy-efficient materials.'
    }
  } else if (isHotDesert) {
    // Phoenix metro area - extreme heat focus
    return {
      attic: 'Essential attic insulation to combat Phoenix\'s extreme heat and reduce cooling costs by up to 30%.',
      wall: 'Complete wall insulation services to block heat transfer and keep your Phoenix home comfortable year-round.',
      sprayFoam: 'Premium spray foam insulation for superior energy efficiency and air sealing in Phoenix\'s hot climate.',
      crawlSpace: 'Protect your crawl space from heat penetration and maintain cooler temperatures in your home.',
      basement: 'Complete basement insulation solutions to create a comfortable space in Phoenix\'s hot summers.',
      garage: 'Transform your Phoenix garage into a comfortable space that prevents heat from affecting your home.',
      removal: 'Safe removal of old, damaged insulation to upgrade to modern, energy-efficient materials for Phoenix homes.'
    }
  } else {
    // Default descriptions
    return {
      attic: 'Professional attic insulation installation and replacement to reduce energy costs and improve comfort.',
      wall: 'Complete wall insulation services for new construction and retrofits to help reduce energy costs and improve comfort.',
      sprayFoam: 'Premium spray foam insulation for maximum energy efficiency and air sealing.',
      crawlSpace: 'Protect your crawl space from moisture and temperature extremes.',
      basement: 'Complete basement insulation solutions for comfort and energy savings.',
      garage: 'Transform your garage into a comfortable, energy-efficient space that protects your home and belongings.',
      removal: 'Safe removal of old, damaged, or contaminated insulation.'
    }
  }
}

