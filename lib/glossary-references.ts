// Term-specific reference mappings for glossary pages
export interface Reference {
  title: string
  url: string
}

export const glossaryReferences: Record<string, Reference[]> = {
  'air-duct-sealing': [
    { title: 'Wikipedia - Duct (HVAC)', url: 'https://en.wikipedia.org/wiki/Duct_(HVAC)' },
    { title: 'Energy.gov - Air Sealing Your Home', url: 'https://www.energy.gov/energysaver/air-sealing-your-home' },
    { title: 'National Insulation Association - Mechanical Insulation', url: 'https://www.insulation.org/about/mechanical-insulation/' },
    { title: 'ICAA - HVAC Services', url: 'https://www.insulate.org' }
  ],
  'attic': [
    { title: 'Wikipedia - Attic', url: 'https://en.wikipedia.org/wiki/Attic' },
    { title: 'Energy.gov - Insulate Attics and Crawl Spaces', url: 'https://www.energy.gov/energysaver/insulate-attic-and-crawl-space' },
    { title: 'National Insulation Association - Residential Insulation', url: 'https://www.insulation.org/about/residential-insulation/' },
    { title: 'Energy.gov - Attic Insulation Guide', url: 'https://www.energy.gov/energysaver/insulate-attic-and-crawl-space' }
  ],
  'basement': [
    { title: 'Wikipedia - Basement', url: 'https://en.wikipedia.org/wiki/Basement' },
    { title: 'Energy.gov - Insulate Basement Walls', url: 'https://www.energy.gov/energysaver/insulate-basement' },
    { title: 'National Insulation Association - Residential Insulation', url: 'https://www.insulation.org/about/residential-insulation/' },
    { title: 'Energy.gov - Basement Insulation', url: 'https://www.energy.gov/energysaver/insulate-basement' }
  ],
  'batt-roll': [
    { title: 'Wikipedia - Fiberglass Insulation', url: 'https://en.wikipedia.org/wiki/Fiberglass' },
    { title: 'Energy.gov - Types of Insulation', url: 'https://www.energy.gov/energysaver/types-insulation' },
    { title: 'National Insulation Association - Insulation Materials', url: 'https://www.insulation.org/about/insulation-materials/' },
    { title: 'Energy.gov - Where to Insulate', url: 'https://www.energy.gov/energysaver/where-insulate-your-house' }
  ],
  'blown-in': [
    { title: 'Wikipedia - Loose Fill Insulation', url: 'https://en.wikipedia.org/wiki/Loose-fill_insulation' },
    { title: 'Energy.gov - Types of Insulation', url: 'https://www.energy.gov/energysaver/types-insulation' },
    { title: 'National Insulation Association - Blown-in Insulation', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Adding Insulation', url: 'https://www.energy.gov/energysaver/adding-insulation-existing-home' }
  ],
  'building-insulation-materials': [
    { title: 'Wikipedia - Building Insulation Materials', url: 'https://en.wikipedia.org/wiki/Building_insulation_material' },
    { title: 'Energy.gov - Types of Insulation', url: 'https://www.energy.gov/energysaver/types-insulation' },
    { title: 'National Insulation Association - Insulation Materials', url: 'https://www.insulation.org/about/insulation-materials/' },
    { title: 'Energy.gov - Insulation Materials', url: 'https://www.energy.gov/energysaver/insulation-materials' }
  ],
  'ceiling': [
    { title: 'Wikipedia - Ceiling', url: 'https://en.wikipedia.org/wiki/Ceiling' },
    { title: 'Energy.gov - Where to Insulate', url: 'https://www.energy.gov/energysaver/where-insulate-your-house' },
    { title: 'National Insulation Association - Residential Insulation', url: 'https://www.insulation.org/about/residential-insulation/' },
    { title: 'Energy.gov - Ceiling Insulation', url: 'https://www.energy.gov/energysaver/insulate-attic-and-crawl-space' }
  ],
  'cellulose': [
    { title: 'Wikipedia - Cellulose Insulation', url: 'https://en.wikipedia.org/wiki/Cellulose_insulation' },
    { title: 'Energy.gov - Types of Insulation', url: 'https://www.energy.gov/energysaver/types-insulation' },
    { title: 'National Insulation Association - Cellulose Insulation', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Insulation Materials', url: 'https://www.energy.gov/energysaver/insulation-materials' }
  ],
  'closed-cell': [
    { title: 'Wikipedia - Spray Foam Insulation', url: 'https://en.wikipedia.org/wiki/Spray_foam' },
    { title: 'Energy.gov - Types of Insulation', url: 'https://www.energy.gov/energysaver/types-insulation' },
    { title: 'SPFA - Closed-Cell Spray Foam', url: 'https://www.sprayfoam.org' },
    { title: 'National Insulation Association - Spray Foam', url: 'https://www.insulation.org' }
  ],
  'clothing': [
    { title: 'Wikipedia - Clothing Insulation', url: 'https://en.wikipedia.org/wiki/Clothing_insulation' },
    { title: 'Energy.gov - Weatherization', url: 'https://www.energy.gov/energysaver/weatherization-works' },
    { title: 'National Insulation Association - Insulation Basics', url: 'https://www.insulation.org' },
    { title: 'Wikipedia - Thermal Insulation', url: 'https://en.wikipedia.org/wiki/Thermal_insulation' }
  ],
  'commercial': [
    { title: 'Wikipedia - Building Insulation', url: 'https://en.wikipedia.org/wiki/Building_insulation' },
    { title: 'Energy.gov - Commercial Buildings', url: 'https://www.energy.gov/eere/buildings/commercial-buildings' },
    { title: 'National Insulation Association - Commercial Insulation', url: 'https://www.insulation.org/about/commercial-insulation/' },
    { title: 'Energy.gov - Building Energy Codes', url: 'https://www.energy.gov/eere/buildings/building-energy-codes-program' }
  ],
  'cork': [
    { title: 'Wikipedia - Cork', url: 'https://en.wikipedia.org/wiki/Cork_(material)' },
    { title: 'Energy.gov - Natural Insulation Materials', url: 'https://www.energy.gov/energysaver/types-insulation' },
    { title: 'National Insulation Association - Insulation Materials', url: 'https://www.insulation.org/about/insulation-materials/' },
    { title: 'Wikipedia - Building Insulation Material', url: 'https://en.wikipedia.org/wiki/Building_insulation_material' }
  ],
  'cotton': [
    { title: 'Wikipedia - Cotton Insulation', url: 'https://en.wikipedia.org/wiki/Cotton_insulation' },
    { title: 'Energy.gov - Types of Insulation', url: 'https://www.energy.gov/energysaver/types-insulation' },
    { title: 'National Insulation Association - Natural Insulation', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Green Building Materials', url: 'https://www.energy.gov/energysaver/energy-efficient-design' }
  ],
  'cost-calculator': [
    { title: 'Wikipedia - Cost Estimation', url: 'https://en.wikipedia.org/wiki/Cost_estimation' },
    { title: 'Energy.gov - Home Energy Saver', url: 'https://www.energy.gov/energysaver/home-energy-saver' },
    { title: 'National Insulation Association - Insulation Cost Guide', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Insulation Installation Cost', url: 'https://www.energy.gov/energysaver/adding-insulation-existing-home' }
  ],
  'crawl-space': [
    { title: 'Wikipedia - Crawl Space', url: 'https://en.wikipedia.org/wiki/Crawl_space' },
    { title: 'Energy.gov - Insulate Attics and Crawl Spaces', url: 'https://www.energy.gov/energysaver/insulate-attic-and-crawl-space' },
    { title: 'National Insulation Association - Residential Insulation', url: 'https://www.insulation.org/about/residential-insulation/' },
    { title: 'Energy.gov - Crawl Space Insulation', url: 'https://www.energy.gov/energysaver/insulate-basement' }
  ],
  'denim': [
    { title: 'Wikipedia - Cotton Insulation', url: 'https://en.wikipedia.org/wiki/Cotton_insulation' },
    { title: 'Energy.gov - Types of Insulation', url: 'https://www.energy.gov/energysaver/types-insulation' },
    { title: 'National Insulation Association - Recycled Insulation', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Green Building Materials', url: 'https://www.energy.gov/energysaver/energy-efficient-design' }
  ],
  'duct-sealing': [
    { title: 'Wikipedia - Duct (HVAC)', url: 'https://en.wikipedia.org/wiki/Duct_(HVAC)' },
    { title: 'Energy.gov - Air Sealing', url: 'https://www.energy.gov/energysaver/air-sealing-your-home' },
    { title: 'National Insulation Association - Mechanical Insulation', url: 'https://www.insulation.org/about/mechanical-insulation/' },
    { title: 'Energy.gov - Duct Sealing', url: 'https://www.energy.gov/energysaver/air-sealing-your-home' }
  ],
  'energy-audit': [
    { title: 'Wikipedia - Energy Audit', url: 'https://en.wikipedia.org/wiki/Energy_audit' },
    { title: 'Energy.gov - Home Energy Audits', url: 'https://www.energy.gov/energysaver/home-energy-audits' },
    { title: 'National Insulation Association - Energy Efficiency', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Professional Energy Assessment', url: 'https://www.energy.gov/energysaver/home-energy-audits' }
  ],
  'faced': [
    { title: 'Wikipedia - Building Insulation', url: 'https://en.wikipedia.org/wiki/Building_insulation' },
    { title: 'Energy.gov - Vapor Barriers', url: 'https://www.energy.gov/energysaver/insulation' },
    { title: 'National Insulation Association - Insulation Installation', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Types of Insulation', url: 'https://www.energy.gov/energysaver/types-insulation' }
  ],
  'feather-thermal': [
    { title: 'Wikipedia - Down Insulation', url: 'https://en.wikipedia.org/wiki/Down_insulation' },
    { title: 'Energy.gov - Natural Insulation Materials', url: 'https://www.energy.gov/energysaver/types-insulation' },
    { title: 'Wikipedia - Thermal Insulation', url: 'https://en.wikipedia.org/wiki/Thermal_insulation' },
    { title: 'National Insulation Association - Insulation Materials', url: 'https://www.insulation.org/about/insulation-materials/' }
  ],
  'fiberglass': [
    { title: 'Wikipedia - Fiberglass', url: 'https://en.wikipedia.org/wiki/Fiberglass' },
    { title: 'Energy.gov - Types of Insulation', url: 'https://www.energy.gov/energysaver/types-insulation' },
    { title: 'National Insulation Association - Fiberglass Insulation', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Insulation Materials', url: 'https://www.energy.gov/energysaver/insulation-materials' }
  ],
  'fire-resistant': [
    { title: 'Wikipedia - Fire Retardant', url: 'https://en.wikipedia.org/wiki/Fire_retardant' },
    { title: 'Energy.gov - Fire Safety and Insulation', url: 'https://www.energy.gov/energysaver/insulation' },
    { title: 'National Insulation Association - Fire Safety', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Building Safety', url: 'https://www.energy.gov' }
  ],
  'floor': [
    { title: 'Wikipedia - Floor', url: 'https://en.wikipedia.org/wiki/Floor' },
    { title: 'Energy.gov - Where to Insulate', url: 'https://www.energy.gov/energysaver/where-insulate-your-house' },
    { title: 'National Insulation Association - Floor Insulation', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Insulate Floors', url: 'https://www.energy.gov/energysaver/insulate-basement' }
  ],
  'foam-board': [
    { title: 'Wikipedia - Rigid Board Insulation', url: 'https://en.wikipedia.org/wiki/Rigid_board_insulation' },
    { title: 'Energy.gov - Types of Insulation', url: 'https://www.energy.gov/energysaver/types-insulation' },
    { title: 'National Insulation Association - Rigid Insulation', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Foam Board Insulation', url: 'https://www.energy.gov/energysaver/types-insulation' }
  ],
  'garage': [
    { title: 'Wikipedia - Garage', url: 'https://en.wikipedia.org/wiki/Garage_(residential)' },
    { title: 'Energy.gov - Where to Insulate', url: 'https://www.energy.gov/energysaver/where-insulate-your-house' },
    { title: 'National Insulation Association - Garage Insulation', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Garage Insulation', url: 'https://www.energy.gov/energysaver/insulate-attic-and-crawl-space' }
  ],
  'insulation-monitoring-device': [
    { title: 'Wikipedia - Building Automation', url: 'https://en.wikipedia.org/wiki/Building_automation' },
    { title: 'Energy.gov - Smart Home Technology', url: 'https://www.energy.gov/energysaver/smart-home-technology' },
    { title: 'National Insulation Association - Building Performance', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Energy Monitoring', url: 'https://www.energy.gov/energysaver/home-energy-audits' }
  ],
  'insulation-removal': [
    { title: 'Wikipedia - Building Renovation', url: 'https://en.wikipedia.org/wiki/Renovation' },
    { title: 'Energy.gov - Removing Old Insulation', url: 'https://www.energy.gov/energysaver/adding-insulation-existing-home' },
    { title: 'National Insulation Association - Insulation Removal', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Home Improvements', url: 'https://www.energy.gov/energysaver/design' }
  ],
  'labor-cost': [
    { title: 'Wikipedia - Construction Cost', url: 'https://en.wikipedia.org/wiki/Construction' },
    { title: 'Energy.gov - Insulation Installation Cost', url: 'https://www.energy.gov/energysaver/adding-insulation-existing-home' },
    { title: 'National Insulation Association - Cost Guides', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Home Improvement Costs', url: 'https://www.energy.gov/energysaver/design' }
  ],
  'loose-fill': [
    { title: 'Wikipedia - Loose-fill Insulation', url: 'https://en.wikipedia.org/wiki/Loose-fill_insulation' },
    { title: 'Energy.gov - Types of Insulation', url: 'https://www.energy.gov/energysaver/types-insulation' },
    { title: 'National Insulation Association - Loose Fill', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Adding Insulation', url: 'https://www.energy.gov/energysaver/adding-insulation-existing-home' }
  ],
  'material-cost': [
    { title: 'Wikipedia - Building Material', url: 'https://en.wikipedia.org/wiki/Building_material' },
    { title: 'Energy.gov - Insulation Materials Cost', url: 'https://www.energy.gov/energysaver/types-insulation' },
    { title: 'National Insulation Association - Material Guide', url: 'https://www.insulation.org/about/insulation-materials/' },
    { title: 'Energy.gov - Insulation Materials', url: 'https://www.energy.gov/energysaver/insulation-materials' }
  ],
  'metal-building': [
    { title: 'Wikipedia - Steel Building', url: 'https://en.wikipedia.org/wiki/Steel_building' },
    { title: 'Energy.gov - Commercial Buildings', url: 'https://www.energy.gov/eere/buildings/commercial-buildings' },
    { title: 'National Insulation Association - Commercial Insulation', url: 'https://www.insulation.org/about/commercial-insulation/' },
    { title: 'Energy.gov - Industrial Buildings', url: 'https://www.energy.gov/eere/buildings' }
  ],
  'open-cell': [
    { title: 'Wikipedia - Spray Foam', url: 'https://en.wikipedia.org/wiki/Spray_foam' },
    { title: 'Energy.gov - Types of Insulation', url: 'https://www.energy.gov/energysaver/types-insulation' },
    { title: 'SPFA - Open-Cell Spray Foam', url: 'https://www.sprayfoam.org' },
    { title: 'National Insulation Association - Spray Foam', url: 'https://www.insulation.org' }
  ],
  'pipe-sealing': [
    { title: 'Wikipedia - Pipe Insulation', url: 'https://en.wikipedia.org/wiki/Pipe_insulation' },
    { title: 'Energy.gov - Insulate Pipes', url: 'https://www.energy.gov/energysaver/insulation' },
    { title: 'National Insulation Association - Mechanical Insulation', url: 'https://www.insulation.org/about/mechanical-insulation/' },
    { title: 'Energy.gov - Water Heating', url: 'https://www.energy.gov/energysaver/water-heating' }
  ],
  'polyurethane-foam': [
    { title: 'Wikipedia - Polyurethane', url: 'https://en.wikipedia.org/wiki/Polyurethane' },
    { title: 'Energy.gov - Types of Insulation', url: 'https://www.energy.gov/energysaver/types-insulation' },
    { title: 'SPFA - Polyurethane Foam', url: 'https://www.sprayfoam.org' },
    { title: 'National Insulation Association - Spray Foam', url: 'https://www.insulation.org' }
  ],
  'r-value': [
    { title: 'Wikipedia - R-value (insulation)', url: 'https://en.wikipedia.org/wiki/R-value_(insulation)' },
    { title: 'Energy.gov - R-Values of Insulation', url: 'https://www.energy.gov/energysaver/r-values-insulation' },
    { title: 'National Insulation Association - R-Value Guide', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Understanding R-Values', url: 'https://www.energy.gov/energysaver/types-insulation' }
  ],
  'radiant-barrier': [
    { title: 'Wikipedia - Radiant Barrier', url: 'https://en.wikipedia.org/wiki/Radiant_barrier' },
    { title: 'Energy.gov - Radiant Barriers', url: 'https://www.energy.gov/energysaver/radiant-barriers' },
    { title: 'National Insulation Association - Radiant Barriers', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Cooling Your Home', url: 'https://www.energy.gov/energysaver/cooling-your-home' }
  ],
  'reflective': [
    { title: 'Wikipedia - Reflective Insulation', url: 'https://en.wikipedia.org/wiki/Reflective_insulation' },
    { title: 'Energy.gov - Radiant Barriers', url: 'https://www.energy.gov/energysaver/radiant-barriers' },
    { title: 'National Insulation Association - Reflective Insulation', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Types of Insulation', url: 'https://www.energy.gov/energysaver/types-insulation' }
  ],
  'residential': [
    { title: 'Wikipedia - Residential Building', url: 'https://en.wikipedia.org/wiki/Residential_building' },
    { title: 'Energy.gov - Home Insulation', url: 'https://www.energy.gov/energysaver/insulation' },
    { title: 'National Insulation Association - Residential Insulation', url: 'https://www.insulation.org/about/residential-insulation/' },
    { title: 'Energy.gov - Energy Efficient Homes', url: 'https://www.energy.gov/energysaver/design' }
  ],
  'rockwool': [
    { title: 'Wikipedia - Mineral Wool', url: 'https://en.wikipedia.org/wiki/Mineral_wool' },
    { title: 'Energy.gov - Types of Insulation', url: 'https://www.energy.gov/energysaver/types-insulation' },
    { title: 'National Insulation Association - Mineral Wool', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Insulation Materials', url: 'https://www.energy.gov/energysaver/insulation-materials' }
  ],
  'sound-proofing': [
    { title: 'Wikipedia - Soundproofing', url: 'https://en.wikipedia.org/wiki/Soundproofing' },
    { title: 'Energy.gov - Noise Control', url: 'https://www.energy.gov/energysaver/insulation' },
    { title: 'National Insulation Association - Acoustic Insulation', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Energy Efficient Design', url: 'https://www.energy.gov/energysaver/design' }
  ],
  'spray-foam': [
    { title: 'Wikipedia - Spray Foam', url: 'https://en.wikipedia.org/wiki/Spray_foam' },
    { title: 'Energy.gov - Types of Insulation', url: 'https://www.energy.gov/energysaver/types-insulation' },
    { title: 'SPFA - Spray Foam Alliance', url: 'https://www.sprayfoam.org' },
    { title: 'National Insulation Association - Spray Foam', url: 'https://www.insulation.org' }
  ],
  'thermal-insulation': [
    { title: 'Wikipedia - Thermal Insulation', url: 'https://en.wikipedia.org/wiki/Thermal_insulation' },
    { title: 'Energy.gov - Insulation', url: 'https://www.energy.gov/energysaver/insulation' },
    { title: 'National Insulation Association - Thermal Performance', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Energy Efficient Design', url: 'https://www.energy.gov/energysaver/design' }
  ],
  'unfaced': [
    { title: 'Wikipedia - Building Insulation', url: 'https://en.wikipedia.org/wiki/Building_insulation' },
    { title: 'Energy.gov - Vapor Barriers', url: 'https://www.energy.gov/energysaver/insulation' },
    { title: 'National Insulation Association - Insulation Installation', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Types of Insulation', url: 'https://www.energy.gov/energysaver/types-insulation' }
  ],
  'vacuum-insulated-panels': [
    { title: 'Wikipedia - Vacuum Insulated Panel', url: 'https://en.wikipedia.org/wiki/Vacuum_insulated_panel' },
    { title: 'Energy.gov - Advanced Insulation Technologies', url: 'https://www.energy.gov/eere/buildings' },
    { title: 'National Insulation Association - Advanced Materials', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Building Technologies', url: 'https://www.energy.gov/eere/buildings' }
  ],
  'vapor-barrier': [
    { title: 'Wikipedia - Vapor Barrier', url: 'https://en.wikipedia.org/wiki/Vapor_barrier' },
    { title: 'Energy.gov - Vapor Barriers', url: 'https://www.energy.gov/energysaver/insulation' },
    { title: 'National Insulation Association - Moisture Control', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Moisture Control', url: 'https://www.energy.gov/energysaver/insulation' }
  ],
  'wall': [
    { title: 'Wikipedia - Cavity Wall', url: 'https://en.wikipedia.org/wiki/Cavity_wall' },
    { title: 'Energy.gov - Insulate Walls', url: 'https://www.energy.gov/energysaver/insulate-walls' },
    { title: 'National Insulation Association - Wall Insulation', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Where to Insulate', url: 'https://www.energy.gov/energysaver/where-insulate-your-house' }
  ],
  'water-resistant': [
    { title: 'Wikipedia - Waterproofing', url: 'https://en.wikipedia.org/wiki/Waterproofing' },
    { title: 'Energy.gov - Moisture Control', url: 'https://www.energy.gov/energysaver/insulation' },
    { title: 'National Insulation Association - Moisture Resistant Insulation', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Basement Insulation', url: 'https://www.energy.gov/energysaver/insulate-basement' }
  ],
  'wool': [
    { title: 'Wikipedia - Sheep Wool Insulation', url: 'https://en.wikipedia.org/wiki/Sheep_wool_insulation' },
    { title: 'Energy.gov - Natural Insulation Materials', url: 'https://www.energy.gov/energysaver/types-insulation' },
    { title: 'National Insulation Association - Natural Insulation', url: 'https://www.insulation.org' },
    { title: 'Energy.gov - Green Building Materials', url: 'https://www.energy.gov/energysaver/energy-efficient-design' }
  ]
}

// Get references for a specific glossary term
export const getTermReferences = (slug: string): Reference[] => {
  return glossaryReferences[slug] || [
    {
      title: 'Wikipedia - Thermal Insulation',
      url: 'https://en.wikipedia.org/wiki/Thermal_insulation'
    },
    {
      title: 'Energy.gov - Insulation',
      url: 'https://www.energy.gov/energysaver/insulation'
    },
    {
      title: 'National Insulation Association',
      url: 'https://www.insulation.org'
    },
    {
      title: 'Insulation Contractors Association of America',
      url: 'https://www.insulate.org'
    }
  ]
}
