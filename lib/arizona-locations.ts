// Arizona Counties and Cities Data
// This file contains comprehensive Arizona location data for service area selection

export interface County {
  name: string
  cities: string[]
}

export const arizonaCounties: County[] = [
  {
    name: "Maricopa County",
    cities: [
      "Phoenix", "Mesa", "Chandler", "Scottsdale", "Glendale", "Tempe", 
      "Peoria", "Surprise", "Avondale", "Goodyear", "Buckeye", "El Mirage",
      "Tolleson", "Litchfield Park", "Youngtown", "Wickenburg", "Sun City",
      "Sun City West", "Fountain Hills", "Paradise Valley", "Cave Creek",
      "Carefree", "Gilbert", "Queen Creek", "Ahwatukee", "Laveen"
    ]
  },
  {
    name: "Pima County", 
    cities: [
      "Tucson", "Oro Valley", "Marana", "Sahuarita", "South Tucson",
      "Catalina Foothills", "Casas Adobes", "Drexel Heights", "Flowing Wells",
      "Green Valley", "Tanque Verde", "Vail", "Three Points", "Catalina"
    ]
  },
  {
    name: "Pinal County",
    cities: [
      "Casa Grande", "Maricopa", "Florence", "Apache Junction", "Eloy",
      "Coolidge", "Superior", "Mammoth", "Kearny", "Winkelman", "Hayden",
      "Arizona City", "Gold Canyon", "San Tan Valley", "Queen Creek"
    ]
  },
  {
    name: "Yavapai County",
    cities: [
      "Prescott", "Prescott Valley", "Sedona", "Chino Valley", "Cottonwood",
      "Camp Verde", "Clarkdale", "Jerome", "Dewey-Humboldt", "Bagdad"
    ]
  },
  {
    name: "Mohave County",
    cities: [
      "Lake Havasu City", "Kingman", "Bullhead City", "Fort Mohave",
      "Golden Valley", "Mohave Valley", "Colorado City", "Topock"
    ]
  },
  {
    name: "Coconino County",
    cities: [
      "Flagstaff", "Sedona", "Page", "Williams", "Winona", "Fredonia",
      "Tusayan", "Bellemont", "Kachina Village", "Mountainaire"
    ]
  },
  {
    name: "Yuma County",
    cities: [
      "Yuma", "San Luis", "Somerton", "Wellton", "Fortuna Foothills",
      "Gadsden", "Tacna", "Roll", "Dateland"
    ]
  },
  {
    name: "Apache County",
    cities: [
      "Show Low", "Eagar", "Springerville", "St. Johns", "Holbrook",
      "Window Rock", "Chinle", "Many Farms", "Ganado", "Fort Defiance"
    ]
  },
  {
    name: "Navajo County",
    cities: [
      "Show Low", "Winslow", "Holbrook", "Snowflake", "Taylor", "Pinetop-Lakeside",
      "Joseph City", "Heber-Overgaard", "Dilkon", "Leupp"
    ]
  },
  {
    name: "Cochise County",
    cities: [
      "Sierra Vista", "Bisbee", "Douglas", "Tombstone", "Willcox",
      "Benson", "Huachuca City", "Elfrida", "McNeal", "Sunizona"
    ]
  },
  {
    name: "Santa Cruz County",
    cities: [
      "Nogales", "Patagonia", "Tubac", "Rio Rico", "Tumacacori-Carmen",
      "Sonoita", "Elgin"
    ]
  },
  {
    name: "Graham County",
    cities: [
      "Safford", "Thatcher", "Pima", "Duncan", "Solomon", "Fort Thomas",
      "York", "Klondyke", "Bonita"
    ]
  },
  {
    name: "Greenlee County",
    cities: [
      "Clifton", "Duncan", "York", "Franklin"
    ]
  },
  {
    name: "Gila County",
    cities: [
      "Globe", "Payson", "Winkelman", "Hayden", "Miami", "Star Valley",
      "Pine", "Strawberry", "Young", "Roosevelt"
    ]
  },
  {
    name: "La Paz County",
    cities: [
      "Parker", "Quartzsite", "Ehrenberg", "Bouse", "Salome", "Wenden",
      "Cibola", "Poston"
    ]
  }
]

// Helper function to get all cities for a specific county
export function getCitiesForCounty(countyName: string): string[] {
  const county = arizonaCounties.find(c => c.name === countyName)
  return county ? county.cities : []
}

// Helper function to get all Arizona cities (for backward compatibility)
export function getAllArizonaCities(): string[] {
  return arizonaCounties.flatMap(county => 
    county.cities.map(city => `${city}, AZ`)
  )
}

// Helper function to get county names only
export function getCountyNames(): string[] {
  return arizonaCounties.map(county => county.name)
}

// Helper function to find county for a city
export function getCountyForCity(cityName: string): string | null {
  for (const county of arizonaCounties) {
    if (county.cities.includes(cityName)) {
      return county.name
    }
  }
  return null
}
