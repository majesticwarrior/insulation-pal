export interface CityCountyRecord {
  city: string
  county: string
  state: string
  stateAbbr: string
  population: number
}

export interface CountyCity {
  name: string
  population: number
}

export interface CountyRecord {
  county: string
  state: string
  stateAbbr: string
  cities: CountyCity[]
}

const cityCountyData: CityCountyRecord[] = [
  // Alabama
  { city: 'Birmingham', county: 'Jefferson County', state: 'Alabama', stateAbbr: 'AL', population: 200733 },
  { city: 'Montgomery', county: 'Montgomery County', state: 'Alabama', stateAbbr: 'AL', population: 200603 },
  { city: 'Mobile', county: 'Mobile County', state: 'Alabama', stateAbbr: 'AL', population: 187041 },
  { city: 'Huntsville', county: 'Madison County', state: 'Alabama', stateAbbr: 'AL', population: 215006 },
  { city: 'Tuscaloosa', county: 'Tuscaloosa County', state: 'Alabama', stateAbbr: 'AL', population: 101129 },
  // Alaska
  { city: 'Anchorage', county: 'Anchorage Municipality', state: 'Alaska', stateAbbr: 'AK', population: 291247 },
  // Arizona
  { city: 'Phoenix', county: 'Maricopa County', state: 'Arizona', stateAbbr: 'AZ', population: 1608139 },
  { city: 'Tucson', county: 'Pima County', state: 'Arizona', stateAbbr: 'AZ', population: 548073 },
  { city: 'Mesa', county: 'Maricopa County', state: 'Arizona', stateAbbr: 'AZ', population: 504258 },
  { city: 'Chandler', county: 'Maricopa County', state: 'Arizona', stateAbbr: 'AZ', population: 275987 },
  { city: 'Scottsdale', county: 'Maricopa County', state: 'Arizona', stateAbbr: 'AZ', population: 241361 },
  { city: 'Glendale', county: 'Maricopa County', state: 'Arizona', stateAbbr: 'AZ', population: 248325 },
  { city: 'Gilbert', county: 'Maricopa County', state: 'Arizona', stateAbbr: 'AZ', population: 267918 },
  { city: 'Tempe', county: 'Maricopa County', state: 'Arizona', stateAbbr: 'AZ', population: 195805 },
  { city: 'Peoria', county: 'Maricopa County', state: 'Arizona', stateAbbr: 'AZ', population: 190985 },
  { city: 'Surprise', county: 'Maricopa County', state: 'Arizona', stateAbbr: 'AZ', population: 147965 },
  { city: 'Yuma', county: 'Yuma County', state: 'Arizona', stateAbbr: 'AZ', population: 100064 },
  // Arkansas
  { city: 'Little Rock', county: 'Pulaski County', state: 'Arkansas', stateAbbr: 'AR', population: 202591 },
  // California
  { city: 'Los Angeles', county: 'Los Angeles County', state: 'California', stateAbbr: 'CA', population: 3898747 },
  { city: 'San Diego', county: 'San Diego County', state: 'California', stateAbbr: 'CA', population: 1423851 },
  { city: 'San Jose', county: 'Santa Clara County', state: 'California', stateAbbr: 'CA', population: 1021795 },
  { city: 'San Francisco', county: 'San Francisco County', state: 'California', stateAbbr: 'CA', population: 873965 },
  { city: 'Fresno', county: 'Fresno County', state: 'California', stateAbbr: 'CA', population: 542107 },
  { city: 'Sacramento', county: 'Sacramento County', state: 'California', stateAbbr: 'CA', population: 524943 },
  { city: 'Long Beach', county: 'Los Angeles County', state: 'California', stateAbbr: 'CA', population: 456062 },
  { city: 'Oakland', county: 'Alameda County', state: 'California', stateAbbr: 'CA', population: 433031 },
  { city: 'Bakersfield', county: 'Kern County', state: 'California', stateAbbr: 'CA', population: 407615 },
  { city: 'Anaheim', county: 'Orange County', state: 'California', stateAbbr: 'CA', population: 346824 },
  { city: 'Santa Ana', county: 'Orange County', state: 'California', stateAbbr: 'CA', population: 332318 },
  { city: 'Riverside', county: 'Riverside County', state: 'California', stateAbbr: 'CA', population: 314998 },
  { city: 'Stockton', county: 'San Joaquin County', state: 'California', stateAbbr: 'CA', population: 320804 },
  { city: 'Irvine', county: 'Orange County', state: 'California', stateAbbr: 'CA', population: 307670 },
  { city: 'Chula Vista', county: 'San Diego County', state: 'California', stateAbbr: 'CA', population: 275487 },
  { city: 'Fremont', county: 'Alameda County', state: 'California', stateAbbr: 'CA', population: 230504 },
  { city: 'San Bernardino', county: 'San Bernardino County', state: 'California', stateAbbr: 'CA', population: 222101 },
  { city: 'Modesto', county: 'Stanislaus County', state: 'California', stateAbbr: 'CA', population: 218464 },
  { city: 'Fontana', county: 'San Bernardino County', state: 'California', stateAbbr: 'CA', population: 208393 },
  { city: 'Moreno Valley', county: 'Riverside County', state: 'California', stateAbbr: 'CA', population: 208634 },
  { city: 'Santa Clarita', county: 'Los Angeles County', state: 'California', stateAbbr: 'CA', population: 228673 },
  { city: 'Oxnard', county: 'Ventura County', state: 'California', stateAbbr: 'CA', population: 202063 },
  { city: 'Huntington Beach', county: 'Orange County', state: 'California', stateAbbr: 'CA', population: 198711 },
  { city: 'Glendale', county: 'Los Angeles County', state: 'California', stateAbbr: 'CA', population: 196543 },
  { city: 'Garden Grove', county: 'Orange County', state: 'California', stateAbbr: 'CA', population: 172646 },
  { city: 'Oceanside', county: 'San Diego County', state: 'California', stateAbbr: 'CA', population: 174068 },
  { city: 'Rancho Cucamonga', county: 'San Bernardino County', state: 'California', stateAbbr: 'CA', population: 174453 },
  { city: 'Ontario', county: 'San Bernardino County', state: 'California', stateAbbr: 'CA', population: 175265 },
  { city: 'Elk Grove', county: 'Sacramento County', state: 'California', stateAbbr: 'CA', population: 176124 },
  { city: 'Corona', county: 'Riverside County', state: 'California', stateAbbr: 'CA', population: 157136 },
  { city: 'Lancaster', county: 'Los Angeles County', state: 'California', stateAbbr: 'CA', population: 157601 },
  { city: 'Palmdale', county: 'Los Angeles County', state: 'California', stateAbbr: 'CA', population: 169450 },
  { city: 'Salinas', county: 'Monterey County', state: 'California', stateAbbr: 'CA', population: 163542 },
  { city: 'Hayward', county: 'Alameda County', state: 'California', stateAbbr: 'CA', population: 162954 },
  { city: 'Pomona', county: 'Los Angeles County', state: 'California', stateAbbr: 'CA', population: 151713 },
  { city: 'Escondido', county: 'San Diego County', state: 'California', stateAbbr: 'CA', population: 151038 },
  { city: 'Sunnyvale', county: 'Santa Clara County', state: 'California', stateAbbr: 'CA', population: 155805 },
  { city: 'Torrance', county: 'Los Angeles County', state: 'California', stateAbbr: 'CA', population: 143592 },
  { city: 'Pasadena', county: 'Los Angeles County', state: 'California', stateAbbr: 'CA', population: 138699 },
  { city: 'Fullerton', county: 'Orange County', state: 'California', stateAbbr: 'CA', population: 143617 },
  { city: 'Orange', county: 'Orange County', state: 'California', stateAbbr: 'CA', population: 139911 },
  { city: 'Thousand Oaks', county: 'Ventura County', state: 'California', stateAbbr: 'CA', population: 126966 },
  { city: 'Visalia', county: 'Tulare County', state: 'California', stateAbbr: 'CA', population: 141384 },
  { city: 'Simi Valley', county: 'Ventura County', state: 'California', stateAbbr: 'CA', population: 125613 },
  { city: 'Concord', county: 'Contra Costa County', state: 'California', stateAbbr: 'CA', population: 129295 },
  { city: 'Roseville', county: 'Placer County', state: 'California', stateAbbr: 'CA', population: 147773 },
  { city: 'Victorville', county: 'San Bernardino County', state: 'California', stateAbbr: 'CA', population: 134810 },
  { city: 'Santa Clara', county: 'Santa Clara County', state: 'California', stateAbbr: 'CA', population: 127647 },
  { city: 'Vallejo', county: 'Solano County', state: 'California', stateAbbr: 'CA', population: 126090 },
  { city: 'Berkeley', county: 'Alameda County', state: 'California', stateAbbr: 'CA', population: 124321 },
  { city: 'El Monte', county: 'Los Angeles County', state: 'California', stateAbbr: 'CA', population: 109450 },
  { city: 'Downey', county: 'Los Angeles County', state: 'California', stateAbbr: 'CA', population: 114355 },
  { city: 'Costa Mesa', county: 'Orange County', state: 'California', stateAbbr: 'CA', population: 110000 },
  { city: 'Inglewood', county: 'Los Angeles County', state: 'California', stateAbbr: 'CA', population: 107762 },
  { city: 'Carlsbad', county: 'San Diego County', state: 'California', stateAbbr: 'CA', population: 114746 },
  { city: 'Fairfield', county: 'Solano County', state: 'California', stateAbbr: 'CA', population: 119881 },
  { city: 'West Covina', county: 'Los Angeles County', state: 'California', stateAbbr: 'CA', population: 109501 },
  { city: 'Murrieta', county: 'Riverside County', state: 'California', stateAbbr: 'CA', population: 118394 },
  { city: 'Richmond', county: 'Contra Costa County', state: 'California', stateAbbr: 'CA', population: 114853 },
  { city: 'Norwalk', county: 'Los Angeles County', state: 'California', stateAbbr: 'CA', population: 102773 },
  { city: 'Antioch', county: 'Contra Costa County', state: 'California', stateAbbr: 'CA', population: 115291 },
  { city: 'Temecula', county: 'Riverside County', state: 'California', stateAbbr: 'CA', population: 110003 },
  { city: 'Burbank', county: 'Los Angeles County', state: 'California', stateAbbr: 'CA', population: 107337 },
  { city: 'Daly City', county: 'San Mateo County', state: 'California', stateAbbr: 'CA', population: 104901 },
  { city: 'Santa Maria', county: 'Santa Barbara County', state: 'California', stateAbbr: 'CA', population: 109707 },
  { city: 'El Cajon', county: 'San Diego County', state: 'California', stateAbbr: 'CA', population: 106215 },
  { city: 'Rialto', county: 'San Bernardino County', state: 'California', stateAbbr: 'CA', population: 104026 },
  { city: 'Jurupa Valley', county: 'Riverside County', state: 'California', stateAbbr: 'CA', population: 105053 },
  { city: 'San Mateo', county: 'San Mateo County', state: 'California', stateAbbr: 'CA', population: 105661 },
  { city: 'Clovis', county: 'Fresno County', state: 'California', stateAbbr: 'CA', population: 120124 },
  { city: 'Vista', county: 'San Diego County', state: 'California', stateAbbr: 'CA', population: 101638 },
  { city: 'Ventura', county: 'Ventura County', state: 'California', stateAbbr: 'CA', population: 110763 },
  { city: 'Vacaville', county: 'Solano County', state: 'California', stateAbbr: 'CA', population: 102386 },
  { city: 'Chico', county: 'Butte County', state: 'California', stateAbbr: 'CA', population: 101475 },
  { city: 'Menifee', county: 'Riverside County', state: 'California', stateAbbr: 'CA', population: 105579 },
  // Colorado
  { city: 'Denver', county: 'Denver County', state: 'Colorado', stateAbbr: 'CO', population: 715522 },
  { city: 'Colorado Springs', county: 'El Paso County', state: 'Colorado', stateAbbr: 'CO', population: 478961 },
  { city: 'Aurora', county: 'Arapahoe County', state: 'Colorado', stateAbbr: 'CO', population: 386261 },
  { city: 'Fort Collins', county: 'Larimer County', state: 'Colorado', stateAbbr: 'CO', population: 169810 },
  { city: 'Lakewood', county: 'Jefferson County', state: 'Colorado', stateAbbr: 'CO', population: 155984 },
  { city: 'Thornton', county: 'Adams County', state: 'Colorado', stateAbbr: 'CO', population: 141867 },
  { city: 'Arvada', county: 'Jefferson County', state: 'Colorado', stateAbbr: 'CO', population: 124402 },
  { city: 'Westminster', county: 'Jefferson County', state: 'Colorado', stateAbbr: 'CO', population: 116317 },
  { city: 'Pueblo', county: 'Pueblo County', state: 'Colorado', stateAbbr: 'CO', population: 111876 },
  { city: 'Greeley', county: 'Weld County', state: 'Colorado', stateAbbr: 'CO', population: 108795 },
  { city: 'Boulder', county: 'Boulder County', state: 'Colorado', stateAbbr: 'CO', population: 108250 },
  // Connecticut
  { city: 'Bridgeport', county: 'Fairfield County', state: 'Connecticut', stateAbbr: 'CT', population: 148654 },
  { city: 'Stamford', county: 'Fairfield County', state: 'Connecticut', stateAbbr: 'CT', population: 135470 },
  { city: 'New Haven', county: 'New Haven County', state: 'Connecticut', stateAbbr: 'CT', population: 135081 },
  { city: 'Hartford', county: 'Hartford County', state: 'Connecticut', stateAbbr: 'CT', population: 121054 },
  { city: 'Waterbury', county: 'New Haven County', state: 'Connecticut', stateAbbr: 'CT', population: 114403 },
  // District of Columbia
  { city: 'Washington', county: 'District of Columbia', state: 'District of Columbia', stateAbbr: 'DC', population: 689545 },
  // Florida
  { city: 'Jacksonville', county: 'Duval County', state: 'Florida', stateAbbr: 'FL', population: 949611 },
  { city: 'Miami', county: 'Miami-Dade County', state: 'Florida', stateAbbr: 'FL', population: 442241 },
  { city: 'Tampa', county: 'Hillsborough County', state: 'Florida', stateAbbr: 'FL', population: 384959 },
  { city: 'Orlando', county: 'Orange County', state: 'Florida', stateAbbr: 'FL', population: 307573 },
  { city: 'St. Petersburg', county: 'Pinellas County', state: 'Florida', stateAbbr: 'FL', population: 258308 },
  { city: 'Hialeah', county: 'Miami-Dade County', state: 'Florida', stateAbbr: 'FL', population: 223109 },
  { city: 'Port St. Lucie', county: 'St. Lucie County', state: 'Florida', stateAbbr: 'FL', population: 204851 },
  { city: 'Cape Coral', county: 'Lee County', state: 'Florida', stateAbbr: 'FL', population: 194016 },
  { city: 'Tallahassee', county: 'Leon County', state: 'Florida', stateAbbr: 'FL', population: 196169 },
  { city: 'Fort Lauderdale', county: 'Broward County', state: 'Florida', stateAbbr: 'FL', population: 182760 },
  { city: 'Pembroke Pines', county: 'Broward County', state: 'Florida', stateAbbr: 'FL', population: 171178 },
  { city: 'Hollywood', county: 'Broward County', state: 'Florida', stateAbbr: 'FL', population: 153067 },
  { city: 'Miramar', county: 'Broward County', state: 'Florida', stateAbbr: 'FL', population: 134721 },
  { city: 'Gainesville', county: 'Alachua County', state: 'Florida', stateAbbr: 'FL', population: 141085 },
  { city: 'Coral Springs', county: 'Broward County', state: 'Florida', stateAbbr: 'FL', population: 134394 },
  { city: 'Miami Gardens', county: 'Miami-Dade County', state: 'Florida', stateAbbr: 'FL', population: 111640 },
  { city: 'Clearwater', county: 'Pinellas County', state: 'Florida', stateAbbr: 'FL', population: 117292 },
  { city: 'Palm Bay', county: 'Brevard County', state: 'Florida', stateAbbr: 'FL', population: 119760 },
  { city: 'West Palm Beach', county: 'Palm Beach County', state: 'Florida', stateAbbr: 'FL', population: 117415 },
  { city: 'Pompano Beach', county: 'Broward County', state: 'Florida', stateAbbr: 'FL', population: 112046 },
  { city: 'Lakeland', county: 'Polk County', state: 'Florida', stateAbbr: 'FL', population: 112641 },
  { city: 'Davie', county: 'Broward County', state: 'Florida', stateAbbr: 'FL', population: 105691 },
  // Georgia
  { city: 'Atlanta', county: 'Fulton County', state: 'Georgia', stateAbbr: 'GA', population: 498715 },
  { city: 'Columbus', county: 'Muscogee County', state: 'Georgia', stateAbbr: 'GA', population: 206922 },
  { city: 'Augusta', county: 'Richmond County', state: 'Georgia', stateAbbr: 'GA', population: 202081 },
  { city: 'Macon', county: 'Bibb County', state: 'Georgia', stateAbbr: 'GA', population: 157346 },
  { city: 'Savannah', county: 'Chatham County', state: 'Georgia', stateAbbr: 'GA', population: 147780 },
  { city: 'Athens', county: 'Clarke County', state: 'Georgia', stateAbbr: 'GA', population: 127315 },
  { city: 'Sandy Springs', county: 'Fulton County', state: 'Georgia', stateAbbr: 'GA', population: 108080 },
  // Hawaii
  { city: 'Honolulu', county: 'Honolulu County', state: 'Hawaii', stateAbbr: 'HI', population: 350964 },
  // Idaho
  { city: 'Boise', county: 'Ada County', state: 'Idaho', stateAbbr: 'ID', population: 235684 },
  { city: 'Meridian', county: 'Ada County', state: 'Idaho', stateAbbr: 'ID', population: 117635 },
  { city: 'Nampa', county: 'Canyon County', state: 'Idaho', stateAbbr: 'ID', population: 100200 },
  // Illinois
  { city: 'Chicago', county: 'Cook County', state: 'Illinois', stateAbbr: 'IL', population: 2693976 },
  { city: 'Aurora', county: 'Kane County', state: 'Illinois', stateAbbr: 'IL', population: 180542 },
  { city: 'Naperville', county: 'DuPage County', state: 'Illinois', stateAbbr: 'IL', population: 149540 },
  { city: 'Joliet', county: 'Will County', state: 'Illinois', stateAbbr: 'IL', population: 150362 },
  { city: 'Rockford', county: 'Winnebago County', state: 'Illinois', stateAbbr: 'IL', population: 148655 },
  { city: 'Springfield', county: 'Sangamon County', state: 'Illinois', stateAbbr: 'IL', population: 116250 },
  { city: 'Peoria', county: 'Peoria County', state: 'Illinois', stateAbbr: 'IL', population: 113150 },
  { city: 'Elgin', county: 'Kane County', state: 'Illinois', stateAbbr: 'IL', population: 114797 },
  // Indiana
  { city: 'Indianapolis', county: 'Marion County', state: 'Indiana', stateAbbr: 'IN', population: 887642 },
  { city: 'Fort Wayne', county: 'Allen County', state: 'Indiana', stateAbbr: 'IN', population: 267927 },
  { city: 'Evansville', county: 'Vanderburgh County', state: 'Indiana', stateAbbr: 'IN', population: 117429 },
  { city: 'South Bend', county: 'St. Joseph County', state: 'Indiana', stateAbbr: 'IN', population: 103453 },
  // Iowa
  { city: 'Des Moines', county: 'Polk County', state: 'Iowa', stateAbbr: 'IA', population: 214133 },
  { city: 'Cedar Rapids', county: 'Linn County', state: 'Iowa', stateAbbr: 'IA', population: 137710 },
  { city: 'Davenport', county: 'Scott County', state: 'Iowa', stateAbbr: 'IA', population: 101724 },
  // Kansas
  { city: 'Wichita', county: 'Sedgwick County', state: 'Kansas', stateAbbr: 'KS', population: 397532 },
  { city: 'Overland Park', county: 'Johnson County', state: 'Kansas', stateAbbr: 'KS', population: 197238 },
  { city: 'Kansas City', county: 'Wyandotte County', state: 'Kansas', stateAbbr: 'KS', population: 156607 },
  { city: 'Olathe', county: 'Johnson County', state: 'Kansas', stateAbbr: 'KS', population: 141290 },
  { city: 'Topeka', county: 'Shawnee County', state: 'Kansas', stateAbbr: 'KS', population: 126587 },
  // Kentucky
  { city: 'Louisville', county: 'Jefferson County', state: 'Kentucky', stateAbbr: 'KY', population: 628594 },
  { city: 'Lexington', county: 'Fayette County', state: 'Kentucky', stateAbbr: 'KY', population: 322570 },
  // Louisiana
  { city: 'New Orleans', county: 'Orleans Parish', state: 'Louisiana', stateAbbr: 'LA', population: 383997 },
  { city: 'Baton Rouge', county: 'East Baton Rouge Parish', state: 'Louisiana', stateAbbr: 'LA', population: 227470 },
  { city: 'Shreveport', county: 'Caddo Parish', state: 'Louisiana', stateAbbr: 'LA', population: 187593 },
  { city: 'Lafayette', county: 'Lafayette Parish', state: 'Louisiana', stateAbbr: 'LA', population: 121374 },
  // Maryland
  { city: 'Baltimore', county: 'Baltimore City', state: 'Maryland', stateAbbr: 'MD', population: 576498 },
  // Massachusetts
  { city: 'Boston', county: 'Suffolk County', state: 'Massachusetts', stateAbbr: 'MA', population: 692600 },
  { city: 'Worcester', county: 'Worcester County', state: 'Massachusetts', stateAbbr: 'MA', population: 206518 },
  { city: 'Springfield', county: 'Hampden County', state: 'Massachusetts', stateAbbr: 'MA', population: 155929 },
  { city: 'Cambridge', county: 'Middlesex County', state: 'Massachusetts', stateAbbr: 'MA', population: 118403 },
  { city: 'Lowell', county: 'Middlesex County', state: 'Massachusetts', stateAbbr: 'MA', population: 115554 },
  { city: 'Brockton', county: 'Plymouth County', state: 'Massachusetts', stateAbbr: 'MA', population: 105643 },
  { city: 'New Bedford', county: 'Bristol County', state: 'Massachusetts', stateAbbr: 'MA', population: 101079 },
  { city: 'Quincy', county: 'Norfolk County', state: 'Massachusetts', stateAbbr: 'MA', population: 101636 },
  { city: 'Lynn', county: 'Essex County', state: 'Massachusetts', stateAbbr: 'MA', population: 101253 },
  // Michigan
  { city: 'Detroit', county: 'Wayne County', state: 'Michigan', stateAbbr: 'MI', population: 639111 },
  { city: 'Grand Rapids', county: 'Kent County', state: 'Michigan', stateAbbr: 'MI', population: 198917 },
  { city: 'Warren', county: 'Macomb County', state: 'Michigan', stateAbbr: 'MI', population: 139387 },
  { city: 'Sterling Heights', county: 'Macomb County', state: 'Michigan', stateAbbr: 'MI', population: 134346 },
  { city: 'Ann Arbor', county: 'Washtenaw County', state: 'Michigan', stateAbbr: 'MI', population: 123851 },
  { city: 'Lansing', county: 'Ingham County', state: 'Michigan', stateAbbr: 'MI', population: 118210 },
  { city: 'Dearborn', county: 'Wayne County', state: 'Michigan', stateAbbr: 'MI', population: 109976 },
  // Minnesota
  { city: 'Minneapolis', county: 'Hennepin County', state: 'Minnesota', stateAbbr: 'MN', population: 429606 },
  { city: 'St. Paul', county: 'Ramsey County', state: 'Minnesota', stateAbbr: 'MN', population: 311527 },
  { city: 'Rochester', county: 'Olmsted County', state: 'Minnesota', stateAbbr: 'MN', population: 121395 },
  // Mississippi
  { city: 'Jackson', county: 'Hinds County', state: 'Mississippi', stateAbbr: 'MS', population: 153701 },
  // Missouri
  { city: 'Kansas City', county: 'Jackson County', state: 'Missouri', stateAbbr: 'MO', population: 508090 },
  { city: 'St. Louis', county: 'St. Louis City', state: 'Missouri', stateAbbr: 'MO', population: 301578 },
  { city: 'Springfield', county: 'Greene County', state: 'Missouri', stateAbbr: 'MO', population: 169176 },
  { city: 'Columbia', county: 'Boone County', state: 'Missouri', stateAbbr: 'MO', population: 126254 },
  { city: 'Independence', county: 'Jackson County', state: 'Missouri', stateAbbr: 'MO', population: 123011 },
  { city: 'Lee\'s Summit', county: 'Jackson County', state: 'Missouri', stateAbbr: 'MO', population: 101108 },
  // Montana
  { city: 'Billings', county: 'Yellowstone County', state: 'Montana', stateAbbr: 'MT', population: 117116 },
  // Nebraska
  { city: 'Omaha', county: 'Douglas County', state: 'Nebraska', stateAbbr: 'NE', population: 486051 },
  { city: 'Lincoln', county: 'Lancaster County', state: 'Nebraska', stateAbbr: 'NE', population: 291082 },
  // Nevada
  { city: 'Las Vegas', county: 'Clark County', state: 'Nevada', stateAbbr: 'NV', population: 641903 },
  { city: 'Henderson', county: 'Clark County', state: 'Nevada', stateAbbr: 'NV', population: 317610 },
  { city: 'North Las Vegas', county: 'Clark County', state: 'Nevada', stateAbbr: 'NV', population: 262527 },
  { city: 'Reno', county: 'Washoe County', state: 'Nevada', stateAbbr: 'NV', population: 264165 },
  { city: 'Sparks', county: 'Washoe County', state: 'Nevada', stateAbbr: 'NV', population: 108445 },
  // New Hampshire
  { city: 'Manchester', county: 'Hillsborough County', state: 'New Hampshire', stateAbbr: 'NH', population: 115644 },
  // New Jersey
  { city: 'Newark', county: 'Essex County', state: 'New Jersey', stateAbbr: 'NJ', population: 311549 },
  { city: 'Jersey City', county: 'Hudson County', state: 'New Jersey', stateAbbr: 'NJ', population: 292449 },
  { city: 'Paterson', county: 'Passaic County', state: 'New Jersey', stateAbbr: 'NJ', population: 159732 },
  { city: 'Elizabeth', county: 'Union County', state: 'New Jersey', stateAbbr: 'NJ', population: 137298 },
  { city: 'Edison', county: 'Middlesex County', state: 'New Jersey', stateAbbr: 'NJ', population: 107588 },
  { city: 'Woodbridge', county: 'Middlesex County', state: 'New Jersey', stateAbbr: 'NJ', population: 103639 },
  { city: 'Lakewood', county: 'Ocean County', state: 'New Jersey', stateAbbr: 'NJ', population: 135158 },
  // New Mexico
  { city: 'Albuquerque', county: 'Bernalillo County', state: 'New Mexico', stateAbbr: 'NM', population: 564559 },
  { city: 'Las Cruces', county: 'Doña Ana County', state: 'New Mexico', stateAbbr: 'NM', population: 111385 },
  { city: 'Rio Rancho', county: 'Sandoval County', state: 'New Mexico', stateAbbr: 'NM', population: 104046 },
  // New York (New York City spans multiple counties)
  { city: 'New York', county: 'New York County', state: 'New York', stateAbbr: 'NY', population: 1628706 },
  { city: 'New York', county: 'Kings County', state: 'New York', stateAbbr: 'NY', population: 2559903 },
  { city: 'New York', county: 'Queens County', state: 'New York', stateAbbr: 'NY', population: 2253858 },
  { city: 'New York', county: 'Bronx County', state: 'New York', stateAbbr: 'NY', population: 1472654 },
  { city: 'New York', county: 'Richmond County', state: 'New York', stateAbbr: 'NY', population: 495747 },
  { city: 'Buffalo', county: 'Erie County', state: 'New York', stateAbbr: 'NY', population: 276807 },
  { city: 'Rochester', county: 'Monroe County', state: 'New York', stateAbbr: 'NY', population: 211328 },
  { city: 'Yonkers', county: 'Westchester County', state: 'New York', stateAbbr: 'NY', population: 211569 },
  { city: 'Syracuse', county: 'Onondaga County', state: 'New York', stateAbbr: 'NY', population: 148620 },
  // North Carolina
  { city: 'Charlotte', county: 'Mecklenburg County', state: 'North Carolina', stateAbbr: 'NC', population: 885708 },
  { city: 'Raleigh', county: 'Wake County', state: 'North Carolina', stateAbbr: 'NC', population: 474069 },
  { city: 'Greensboro', county: 'Guilford County', state: 'North Carolina', stateAbbr: 'NC', population: 298263 },
  { city: 'Durham', county: 'Durham County', state: 'North Carolina', stateAbbr: 'NC', population: 278993 },
  { city: 'Winston-Salem', county: 'Forsyth County', state: 'North Carolina', stateAbbr: 'NC', population: 247945 },
  { city: 'Fayetteville', county: 'Cumberland County', state: 'North Carolina', stateAbbr: 'NC', population: 208501 },
  { city: 'Cary', county: 'Wake County', state: 'North Carolina', stateAbbr: 'NC', population: 174721 },
  { city: 'Wilmington', county: 'New Hanover County', state: 'North Carolina', stateAbbr: 'NC', population: 115451 },
  { city: 'High Point', county: 'Guilford County', state: 'North Carolina', stateAbbr: 'NC', population: 114059 },
  { city: 'Concord', county: 'Cabarrus County', state: 'North Carolina', stateAbbr: 'NC', population: 105240 },
  // North Dakota
  { city: 'Fargo', county: 'Cass County', state: 'North Dakota', stateAbbr: 'ND', population: 125990 },
  // Ohio
  { city: 'Columbus', county: 'Franklin County', state: 'Ohio', stateAbbr: 'OH', population: 905748 },
  { city: 'Cleveland', county: 'Cuyahoga County', state: 'Ohio', stateAbbr: 'OH', population: 383793 },
  { city: 'Cincinnati', county: 'Hamilton County', state: 'Ohio', stateAbbr: 'OH', population: 309317 },
  { city: 'Toledo', county: 'Lucas County', state: 'Ohio', stateAbbr: 'OH', population: 270871 },
  { city: 'Akron', county: 'Summit County', state: 'Ohio', stateAbbr: 'OH', population: 197597 },
  { city: 'Dayton', county: 'Montgomery County', state: 'Ohio', stateAbbr: 'OH', population: 137644 },
  // Oklahoma
  { city: 'Oklahoma City', county: 'Oklahoma County', state: 'Oklahoma', stateAbbr: 'OK', population: 681054 },
  { city: 'Tulsa', county: 'Tulsa County', state: 'Oklahoma', stateAbbr: 'OK', population: 413066 },
  { city: 'Norman', county: 'Cleveland County', state: 'Oklahoma', stateAbbr: 'OK', population: 128026 },
  { city: 'Broken Arrow', county: 'Tulsa County', state: 'Oklahoma', stateAbbr: 'OK', population: 113540 },
  // Oregon
  { city: 'Portland', county: 'Multnomah County', state: 'Oregon', stateAbbr: 'OR', population: 652503 },
  { city: 'Salem', county: 'Marion County', state: 'Oregon', stateAbbr: 'OR', population: 175535 },
  { city: 'Eugene', county: 'Lane County', state: 'Oregon', stateAbbr: 'OR', population: 176654 },
  { city: 'Gresham', county: 'Multnomah County', state: 'Oregon', stateAbbr: 'OR', population: 114247 },
  { city: 'Hillsboro', county: 'Washington County', state: 'Oregon', stateAbbr: 'OR', population: 106894 },
  { city: 'Bend', county: 'Deschutes County', state: 'Oregon', stateAbbr: 'OR', population: 102059 },
  // Pennsylvania
  { city: 'Philadelphia', county: 'Philadelphia County', state: 'Pennsylvania', stateAbbr: 'PA', population: 1584064 },
  { city: 'Pittsburgh', county: 'Allegheny County', state: 'Pennsylvania', stateAbbr: 'PA', population: 302971 },
  { city: 'Allentown', county: 'Lehigh County', state: 'Pennsylvania', stateAbbr: 'PA', population: 125845 },
  // Rhode Island
  { city: 'Providence', county: 'Providence County', state: 'Rhode Island', stateAbbr: 'RI', population: 190934 },
  // South Carolina
  { city: 'Columbia', county: 'Richland County', state: 'South Carolina', stateAbbr: 'SC', population: 136632 },
  { city: 'Charleston', county: 'Charleston County', state: 'South Carolina', stateAbbr: 'SC', population: 150227 },
  { city: 'North Charleston', county: 'Charleston County', state: 'South Carolina', stateAbbr: 'SC', population: 115382 },
  // South Dakota
  { city: 'Sioux Falls', county: 'Minnehaha County', state: 'South Dakota', stateAbbr: 'SD', population: 192517 },
  // Tennessee
  { city: 'Nashville', county: 'Davidson County', state: 'Tennessee', stateAbbr: 'TN', population: 689447 },
  { city: 'Memphis', county: 'Shelby County', state: 'Tennessee', stateAbbr: 'TN', population: 633104 },
  { city: 'Knoxville', county: 'Knox County', state: 'Tennessee', stateAbbr: 'TN', population: 190740 },
  { city: 'Chattanooga', county: 'Hamilton County', state: 'Tennessee', stateAbbr: 'TN', population: 181099 },
  { city: 'Clarksville', county: 'Montgomery County', state: 'Tennessee', stateAbbr: 'TN', population: 166722 },
  { city: 'Murfreesboro', county: 'Rutherford County', state: 'Tennessee', stateAbbr: 'TN', population: 152769 },
  // Texas
  { city: 'Houston', county: 'Harris County', state: 'Texas', stateAbbr: 'TX', population: 2304580 },
  { city: 'San Antonio', county: 'Bexar County', state: 'Texas', stateAbbr: 'TX', population: 1547253 },
  { city: 'Dallas', county: 'Dallas County', state: 'Texas', stateAbbr: 'TX', population: 1343573 },
  { city: 'Austin', county: 'Travis County', state: 'Texas', stateAbbr: 'TX', population: 978908 },
  { city: 'Fort Worth', county: 'Tarrant County', state: 'Texas', stateAbbr: 'TX', population: 918915 },
  { city: 'El Paso', county: 'El Paso County', state: 'Texas', stateAbbr: 'TX', population: 678815 },
  { city: 'Arlington', county: 'Tarrant County', state: 'Texas', stateAbbr: 'TX', population: 394266 },
  { city: 'Corpus Christi', county: 'Nueces County', state: 'Texas', stateAbbr: 'TX', population: 317863 },
  { city: 'Plano', county: 'Collin County', state: 'Texas', stateAbbr: 'TX', population: 285494 },
  { city: 'Laredo', county: 'Webb County', state: 'Texas', stateAbbr: 'TX', population: 256187 },
  { city: 'Lubbock', county: 'Lubbock County', state: 'Texas', stateAbbr: 'TX', population: 257141 },
  { city: 'Garland', county: 'Dallas County', state: 'Texas', stateAbbr: 'TX', population: 246018 },
  { city: 'Irving', county: 'Dallas County', state: 'Texas', stateAbbr: 'TX', population: 256684 },
  { city: 'Amarillo', county: 'Potter County', state: 'Texas', stateAbbr: 'TX', population: 200393 },
  { city: 'Grand Prairie', county: 'Dallas County', state: 'Texas', stateAbbr: 'TX', population: 196100 },
  { city: 'Brownsville', county: 'Cameron County', state: 'Texas', stateAbbr: 'TX', population: 186738 },
  { city: 'McKinney', county: 'Collin County', state: 'Texas', stateAbbr: 'TX', population: 202690 },
  { city: 'Frisco', county: 'Collin County', state: 'Texas', stateAbbr: 'TX', population: 200490 },
  { city: 'Pasadena', county: 'Harris County', state: 'Texas', stateAbbr: 'TX', population: 153784 },
  { city: 'Killeen', county: 'Bell County', state: 'Texas', stateAbbr: 'TX', population: 153095 },
  { city: 'Mesquite', county: 'Dallas County', state: 'Texas', stateAbbr: 'TX', population: 150108 },
  { city: 'McAllen', county: 'Hidalgo County', state: 'Texas', stateAbbr: 'TX', population: 142210 },
  { city: 'Carrollton', county: 'Denton County', state: 'Texas', stateAbbr: 'TX', population: 133434 },
  { city: 'Waco', county: 'McLennan County', state: 'Texas', stateAbbr: 'TX', population: 138486 },
  { city: 'Midland', county: 'Midland County', state: 'Texas', stateAbbr: 'TX', population: 132524 },
  { city: 'Denton', county: 'Denton County', state: 'Texas', stateAbbr: 'TX', population: 139869 },
  { city: 'Abilene', county: 'Taylor County', state: 'Texas', stateAbbr: 'TX', population: 125182 },
  { city: 'Beaumont', county: 'Jefferson County', state: 'Texas', stateAbbr: 'TX', population: 115282 },
  { city: 'Round Rock', county: 'Williamson County', state: 'Texas', stateAbbr: 'TX', population: 128812 },
  { city: 'Odessa', county: 'Ector County', state: 'Texas', stateAbbr: 'TX', population: 114428 },
  { city: 'Sugar Land', county: 'Fort Bend County', state: 'Texas', stateAbbr: 'TX', population: 111026 },
  { city: 'Richardson', county: 'Dallas County', state: 'Texas', stateAbbr: 'TX', population: 119469 },
  { city: 'Lewisville', county: 'Denton County', state: 'Texas', stateAbbr: 'TX', population: 111822 },
  { city: 'Tyler', county: 'Smith County', state: 'Texas', stateAbbr: 'TX', population: 105995 },
  { city: 'College Station', county: 'Brazos County', state: 'Texas', stateAbbr: 'TX', population: 120511 },
  { city: 'Pearland', county: 'Brazoria County', state: 'Texas', stateAbbr: 'TX', population: 125828 },
  { city: 'San Angelo', county: 'Tom Green County', state: 'Texas', stateAbbr: 'TX', population: 101004 },
  { city: 'Allen', county: 'Collin County', state: 'Texas', stateAbbr: 'TX', population: 106874 },
  { city: 'League City', county: 'Galveston County', state: 'Texas', stateAbbr: 'TX', population: 111949 },
  { city: 'Wichita Falls', county: 'Wichita County', state: 'Texas', stateAbbr: 'TX', population: 104683 },
  { city: 'Edinburg', county: 'Hidalgo County', state: 'Texas', stateAbbr: 'TX', population: 102483 },
  // Utah
  { city: 'Salt Lake City', county: 'Salt Lake County', state: 'Utah', stateAbbr: 'UT', population: 200133 },
  { city: 'West Valley City', county: 'Salt Lake County', state: 'Utah', stateAbbr: 'UT', population: 140230 },
  { city: 'Provo', county: 'Utah County', state: 'Utah', stateAbbr: 'UT', population: 115162 },
  { city: 'West Jordan', county: 'Salt Lake County', state: 'Utah', stateAbbr: 'UT', population: 116961 },
  // Virginia
  { city: 'Virginia Beach', county: 'Virginia Beach City', state: 'Virginia', stateAbbr: 'VA', population: 459470 },
  { city: 'Norfolk', county: 'Norfolk City', state: 'Virginia', stateAbbr: 'VA', population: 238005 },
  { city: 'Chesapeake', county: 'Chesapeake City', state: 'Virginia', stateAbbr: 'VA', population: 249422 },
  { city: 'Richmond', county: 'Richmond City', state: 'Virginia', stateAbbr: 'VA', population: 226610 },
  { city: 'Newport News', county: 'Newport News City', state: 'Virginia', stateAbbr: 'VA', population: 186247 },
  { city: 'Alexandria', county: 'Alexandria City', state: 'Virginia', stateAbbr: 'VA', population: 159467 },
  { city: 'Hampton', county: 'Hampton City', state: 'Virginia', stateAbbr: 'VA', population: 137148 },
  { city: 'Roanoke', county: 'Roanoke City', state: 'Virginia', stateAbbr: 'VA', population: 100011 },
  // Washington
  { city: 'Seattle', county: 'King County', state: 'Washington', stateAbbr: 'WA', population: 749256 },
  { city: 'Spokane', county: 'Spokane County', state: 'Washington', stateAbbr: 'WA', population: 228989 },
  { city: 'Tacoma', county: 'Pierce County', state: 'Washington', stateAbbr: 'WA', population: 219346 },
  { city: 'Vancouver', county: 'Clark County', state: 'Washington', stateAbbr: 'WA', population: 190915 },
  { city: 'Bellevue', county: 'King County', state: 'Washington', stateAbbr: 'WA', population: 151854 },
  { city: 'Kent', county: 'King County', state: 'Washington', stateAbbr: 'WA', population: 132319 },
  { city: 'Everett', county: 'Snohomish County', state: 'Washington', stateAbbr: 'WA', population: 110629 },
  { city: 'Renton', county: 'King County', state: 'Washington', stateAbbr: 'WA', population: 106785 },
  { city: 'Spokane Valley', county: 'Spokane County', state: 'Washington', stateAbbr: 'WA', population: 102976 },
  { city: 'Federal Way', county: 'King County', state: 'Washington', stateAbbr: 'WA', population: 101030 },
  // Wisconsin
  { city: 'Milwaukee', county: 'Milwaukee County', state: 'Wisconsin', stateAbbr: 'WI', population: 577222 },
  { city: 'Madison', county: 'Dane County', state: 'Wisconsin', stateAbbr: 'WI', population: 269840 },
  { city: 'Green Bay', county: 'Brown County', state: 'Wisconsin', stateAbbr: 'WI', population: 107395 },
]

const countyMap = new Map<string, CountyRecord>()

for (const record of cityCountyData) {
  const key = `${record.stateAbbr}|${record.county}`
  if (!countyMap.has(key)) {
    countyMap.set(key, {
      county: record.county,
      state: record.state,
      stateAbbr: record.stateAbbr,
      cities: []
    })
  }
  countyMap.get(key)!.cities.push({ name: record.city, population: record.population })
}

export const countyRecords: CountyRecord[] = Array.from(countyMap.values()).map((county) => ({
  ...county,
  cities: county.cities
    .reduce<CountyCity[]>((unique, city) => {
      if (!unique.find((c) => c.name.toLowerCase() === city.name.toLowerCase())) {
        unique.push(city)
      }
      return unique
    }, [])
    .sort((a, b) => b.population - a.population)
})).sort((a, b) => {
  if (a.state !== b.state) {
    return a.state.localeCompare(b.state)
  }
  return a.county.localeCompare(b.county)
})

const countyById = new Map<string, CountyRecord>(
  countyRecords.map((county) => [makeCountyId(county.stateAbbr, county.county), county])
)

export function makeCountyId(stateAbbr: string, countyName: string): string {
  return `${stateAbbr.toUpperCase()}|${countyName}`
}

export function parseCountyId(id: string): { stateAbbr: string; county: string } {
  const [stateAbbr, ...countyParts] = id.split('|')
  return {
    stateAbbr: stateAbbr?.toUpperCase() || '',
    county: countyParts.join('|')
  }
}

export function getCountyById(id: string): CountyRecord | undefined {
  return countyById.get(id)
}

export function getCountiesByState(stateAbbr: string): CountyRecord[] {
  const normalized = stateAbbr.toUpperCase()
  return countyRecords.filter((county) => county.stateAbbr === normalized)
}

export function getCitiesForCountyId(countyId: string): CountyCity[] {
  return getCountyById(countyId)?.cities ?? []
}

export function getCitiesForCounty(stateAbbr: string, countyName: string): CountyCity[] {
  return getCitiesForCountyId(makeCountyId(stateAbbr, countyName))
}

export function getCountyForCity(cityName: string, stateAbbr?: string): CountyRecord | null {
  const normalizedCity = cityName.trim().toLowerCase()
  const normalizedState = stateAbbr?.toUpperCase()

  for (const record of cityCountyData) {
    if (record.city.toLowerCase() === normalizedCity) {
      if (!normalizedState || record.stateAbbr === normalizedState) {
        const countyId = makeCountyId(record.stateAbbr, record.county)
        const county = getCountyById(countyId)
        if (county) {
          return county
        }
      }
    }
  }

  return null
}

export function getStatesWithCountyData(): { state: string; stateAbbr: string }[] {
  const seen = new Map<string, string>()
  for (const county of countyRecords) {
    if (!seen.has(county.stateAbbr)) {
      seen.set(county.stateAbbr, county.state)
    }
  }
  return Array.from(seen.entries())
    .map(([stateAbbr, state]) => ({ state, stateAbbr }))
    .sort((a, b) => a.state.localeCompare(b.state))
}

export function getCityCountyData(): CityCountyRecord[] {
  return cityCountyData
}

