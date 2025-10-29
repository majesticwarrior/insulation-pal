export interface GlossaryTerm {
  title: string
  slug: string
  description: string
  relatedTerms?: string[] // slugs of related terms
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    title: 'Air Duct Sealing',
    slug: 'air-duct-sealing',
    description: 'The process of sealing air ducts to prevent air leakage and improve HVAC efficiency.',
    relatedTerms: ['duct-sealing', 'energy-audit', 'air-sealing', 'hvac']
  },
  {
    title: 'Attic Insulation',
    slug: 'attic',
    description: 'Insulation installed in the attic space to reduce heat transfer and improve energy efficiency.',
    relatedTerms: ['blown-in', 'batt-roll', 'spray-foam', 'r-value', 'loose-fill']
  },
  {
    title: 'Basement Insulation',
    slug: 'basement',
    description: 'Insulation applied to basement walls and floors to prevent heat loss and moisture issues.',
    relatedTerms: ['wall', 'foam-board', 'vapor-barrier', 'moisture-control']
  },
  {
    title: 'Batt & Roll Insulation',
    slug: 'batt-roll',
    description: 'Pre-cut insulation panels or rolls made from fiberglass or other materials, easy to install between framing.',
    relatedTerms: ['fiberglass', 'faced', 'unfaced', 'r-value']
  },
  {
    title: 'Blown-in Insulation',
    slug: 'blown-in',
    description: 'Loose insulation material that is blown into cavities using special equipment for complete coverage.',
    relatedTerms: ['loose-fill', 'cellulose', 'fiberglass', 'attic']
  },
  {
    title: 'Building Insulation Materials',
    slug: 'building-insulation-materials',
    description: 'Comprehensive category of all materials used to insulate buildings, including various types and applications.',
    relatedTerms: ['fiberglass', 'cellulose', 'spray-foam', 'foam-board', 'rockwool']
  },
  {
    title: 'Ceiling Insulation',
    slug: 'ceiling',
    description: 'Insulation installed in ceilings to reduce heat transfer between floors and improve energy efficiency.',
    relatedTerms: ['attic', 'blown-in', 'batt-roll', 'thermal-insulation']
  },
  {
    title: 'Cellulose Insulation',
    slug: 'cellulose',
    description: 'Eco-friendly insulation made from recycled paper products, treated with fire retardants.',
    relatedTerms: ['blown-in', 'loose-fill', 'building-insulation-materials', 'fire-resistant']
  },
  {
    title: 'Closed Cell Insulation',
    slug: 'closed-cell',
    description: 'Type of spray foam insulation with dense cells that provide superior R-value and moisture resistance.',
    relatedTerms: ['spray-foam', 'open-cell', 'polyurethane-foam', 'r-value']
  },
  {
    title: 'Clothing Insulation',
    slug: 'clothing',
    description: 'Specialized insulation materials used in clothing and textiles for thermal regulation.',
    relatedTerms: ['thermal-insulation', 'wool', 'feather-thermal']
  },
  {
    title: 'Commercial Insulation',
    slug: 'commercial',
    description: 'Insulation systems designed for commercial buildings, offices, and industrial facilities.',
    relatedTerms: ['building-insulation-materials', 'metal-building', 'spray-foam', 'energy-audit']
  },
  {
    title: 'Cork Insulation',
    slug: 'cork',
    description: 'Natural insulation material made from cork bark, offering good thermal and acoustic properties.',
    relatedTerms: ['natural-insulation', 'building-insulation-materials', 'sound-proofing']
  },
  {
    title: 'Cotton Insulation',
    slug: 'cotton',
    description: 'Eco-friendly insulation made from recycled cotton fibers, often used in sustainable building projects.',
    relatedTerms: ['denim', 'cellulose', 'natural-insulation', 'building-insulation-materials']
  },
  {
    title: 'Cost Calculator Insulation',
    slug: 'cost-calculator',
    description: 'Tools and methods used to calculate the cost of insulation projects based on material, labor, and area.',
    relatedTerms: ['material-cost', 'labor-cost', 'r-value', 'attic', 'basement']
  },
  {
    title: 'Crawl Space Insulation',
    slug: 'crawl-space',
    description: 'Insulation installed in crawl spaces to prevent heat loss and moisture issues in the foundation area.',
    relatedTerms: ['basement', 'vapor-barrier', 'foam-board', 'moisture-control']
  },
  {
    title: 'Denim Insulation',
    slug: 'denim',
    description: 'Recycled denim insulation made from post-consumer denim, offering eco-friendly thermal performance.',
    relatedTerms: ['cotton', 'natural-insulation', 'sound-proofing', 'building-insulation-materials']
  },
  {
    title: 'Duct Sealing Insulation',
    slug: 'duct-sealing',
    description: 'Process of sealing HVAC ducts to improve system efficiency and reduce energy costs.',
    relatedTerms: ['air-duct-sealing', 'energy-audit', 'hvac', 'air-sealing']
  },
  {
    title: 'Energy Audit',
    slug: 'energy-audit',
    description: 'Comprehensive assessment of a building\'s energy use to identify efficiency improvements and insulation needs.',
    relatedTerms: ['r-value', 'energy-efficiency', 'hvac', 'air-sealing']
  },
  {
    title: 'Faced Insulation',
    slug: 'faced',
    description: 'Insulation with a facing layer (kraft paper or foil) that acts as a vapor barrier.',
    relatedTerms: ['batt-roll', 'unfaced', 'vapor-barrier', 'fiberglass']
  },
  {
    title: 'Feather Thermal Insulation',
    slug: 'feather-thermal',
    description: 'Natural insulation material using feathers, primarily for specialized applications.',
    relatedTerms: ['clothing', 'natural-insulation', 'wool', 'thermal-insulation']
  },
  {
    title: 'Fiberglass (Glass Fiber) Insulation',
    slug: 'fiberglass',
    description: 'Common insulation material made from fine glass fibers, widely used in residential and commercial buildings.',
    relatedTerms: ['batt-roll', 'blown-in', 'r-value', 'building-insulation-materials']
  },
  {
    title: 'Fire Resistant Insulation',
    slug: 'fire-resistant',
    description: 'Insulation materials designed to resist fire and slow flame spread, meeting strict safety standards.',
    relatedTerms: ['rockwool', 'cellulose', 'rockwool', 'spray-foam']
  },
  {
    title: 'Floor Insulation',
    slug: 'floor',
    description: 'Insulation installed under or within floors to reduce heat loss and improve comfort.',
    relatedTerms: ['crawl-space', 'thermal-insulation', 'foam-board', 'basement']
  },
  {
    title: 'Foam Board Insulation',
    slug: 'foam-board',
    description: 'Rigid foam panels used for continuous insulation applications in walls, roofs, and foundations.',
    relatedTerms: ['rigid-foam', 'building-insulation-materials', 'basement', 'wall']
  },
  {
    title: 'Garage Insulation',
    slug: 'garage',
    description: 'Insulation applied to garage walls, ceiling, and doors to improve temperature control and energy efficiency.',
    relatedTerms: ['wall', 'ceiling', 'foam-board', 'batt-roll']
  },
  {
    title: 'Insulation Monitoring Device',
    slug: 'insulation-monitoring-device',
    description: 'Devices used to monitor insulation performance, temperature, and energy efficiency over time.',
    relatedTerms: ['energy-audit', 'r-value', 'energy-efficiency', 'thermal-insulation']
  },
  {
    title: 'Insulation Removal',
    slug: 'insulation-removal',
    description: 'Process of removing old, damaged, or contaminated insulation before installing new material.',
    relatedTerms: ['asbestos', 'attic', 'basement', 'replacement']
  },
  {
    title: 'Labor Insulation Cost',
    slug: 'labor-cost',
    description: 'Costs associated with professional installation labor for insulation projects.',
    relatedTerms: ['cost-calculator', 'material-cost', 'installation', 'professional']
  },
  {
    title: 'Loose Fill Insulation',
    slug: 'loose-fill',
    description: 'Insulation material installed loosely, typically blown or poured into cavities.',
    relatedTerms: ['blown-in', 'cellulose', 'fiberglass', 'attic']
  },
  {
    title: 'Material Insulation Cost',
    slug: 'material-cost',
    description: 'Cost of insulation materials themselves, varying by type, R-value, and quantity.',
    relatedTerms: ['cost-calculator', 'labor-cost', 'r-value', 'building-insulation-materials']
  },
  {
    title: 'Metal Building Insulation',
    slug: 'metal-building',
    description: 'Specialized insulation systems designed for metal buildings and structures.',
    relatedTerms: ['commercial', 'foam-board', 'spray-foam', 'building-insulation-materials']
  },
  {
    title: 'Open Cell Insulation',
    slug: 'open-cell',
    description: 'Type of spray foam with open cells that allow air and moisture to pass through.',
    relatedTerms: ['spray-foam', 'closed-cell', 'polyurethane-foam', 'air-sealing']
  },
  {
    title: 'Pipe Sealing',
    slug: 'pipe-sealing',
    description: 'Sealing and insulating pipes to prevent heat loss and condensation in plumbing systems.',
    relatedTerms: ['thermal-insulation', 'spray-foam', 'pipe-insulation']
  },
  {
    title: 'Polyurethane Foam Insulation',
    slug: 'polyurethane-foam',
    description: 'Type of spray foam insulation made from polyurethane, offering high R-value and air sealing.',
    relatedTerms: ['spray-foam', 'closed-cell', 'open-cell', 'r-value']
  },
  {
    title: 'R-Value Insulation',
    slug: 'r-value',
    description: 'Measure of thermal resistance indicating how well insulation prevents heat transfer.',
    relatedTerms: ['thermal-insulation', 'efficiency', 'performance', 'measurement']
  },
  {
    title: 'Radiant Barrier Insulation',
    slug: 'radiant-barrier',
    description: 'Reflective insulation that blocks radiant heat transfer, typically installed in attics.',
    relatedTerms: ['reflective', 'attic', 'thermal-insulation', 'energy-efficiency']
  },
  {
    title: 'Reflective Insulation',
    slug: 'reflective',
    description: 'Insulation with reflective surfaces that reduce radiant heat transfer.',
    relatedTerms: ['radiant-barrier', 'attic', 'thermal-insulation', 'energy-efficiency']
  },
  {
    title: 'Residential Insulation',
    slug: 'residential',
    description: 'Insulation systems designed specifically for residential homes and dwellings.',
    relatedTerms: ['attic', 'wall', 'basement', 'building-insulation-materials']
  },
  {
    title: 'Rockwool (Mineral Wool) Insulation',
    slug: 'rockwool',
    description: 'Insulation made from rock and mineral fibers, offering excellent fire resistance and soundproofing.',
    relatedTerms: ['mineral-wool', 'fire-resistant', 'sound-proofing', 'building-insulation-materials']
  },
  {
    title: 'Sound Proofing Insulation',
    slug: 'sound-proofing',
    description: 'Insulation designed to reduce sound transmission between rooms and from outside.',
    relatedTerms: ['rockwool', 'mineral-wool', 'acoustic', 'residential']
  },
  {
    title: 'Spray Foam Insulation',
    slug: 'spray-foam',
    description: 'Insulation applied as liquid foam that expands to fill cavities, providing air sealing and high R-value.',
    relatedTerms: ['closed-cell', 'open-cell', 'polyurethane-foam', 'r-value']
  },
  {
    title: 'Thermal Insulation',
    slug: 'thermal-insulation',
    description: 'General term for materials and systems that reduce heat transfer in buildings.',
    relatedTerms: ['r-value', 'energy-efficiency', 'building-insulation-materials', 'performance']
  },
  {
    title: 'Unfaced Insulation',
    slug: 'unfaced',
    description: 'Insulation without a facing layer, suitable for applications where vapor barrier isn\'t needed.',
    relatedTerms: ['faced', 'batt-roll', 'fiberglass', 'vapor-barrier']
  },
  {
    title: 'Vacuum Insulated Panels',
    slug: 'vacuum-insulated-panels',
    description: 'Advanced insulation technology with extremely high R-value using vacuum-sealed panels.',
    relatedTerms: ['r-value', 'thermal-insulation', 'advanced', 'efficiency']
  },
  {
    title: 'Vapor Barrier Insulation',
    slug: 'vapor-barrier',
    description: 'Material layer that prevents moisture vapor from passing through insulation and walls.',
    relatedTerms: ['faced', 'moisture-control', 'basement', 'crawl-space']
  },
  {
    title: 'Wall (Cavity Wall) Insulation',
    slug: 'wall',
    description: 'Insulation installed in wall cavities between studs to reduce heat transfer.',
    relatedTerms: ['batt-roll', 'blown-in', 'spray-foam', 'residential']
  },
  {
    title: 'Water Resistant Insulation',
    slug: 'water-resistant',
    description: 'Insulation materials designed to resist water damage and maintain performance in moist conditions.',
    relatedTerms: ['closed-cell', 'foam-board', 'basement', 'crawl-space']
  },
  {
    title: 'Wool Insulation',
    slug: 'wool',
    description: 'Natural insulation made from sheep\'s wool, offering good thermal and moisture-wicking properties.',
    relatedTerms: ['natural-insulation', 'thermal-insulation', 'cotton', 'denim']
  }
]

// Organize terms by first letter for navigation
export const glossaryByLetter = glossaryTerms.reduce((acc, term) => {
  const firstLetter = term.title.charAt(0).toUpperCase()
  if (!acc[firstLetter]) {
    acc[firstLetter] = []
  }
  acc[firstLetter].push(term)
  return acc
}, {} as Record<string, GlossaryTerm[]>)

// Get available letters (letters that have at least one term)
export const availableLetters = Object.keys(glossaryByLetter).sort()

// Get term by slug
export const getTermBySlug = (slug: string): GlossaryTerm | undefined => {
  return glossaryTerms.find(term => term.slug === slug)
}

// Get related terms for a given term slug
export const getRelatedTerms = (slug: string, limit: number = 8): GlossaryTerm[] => {
  const term = getTermBySlug(slug)
  if (!term || !term.relatedTerms) return []
  
  const related = term.relatedTerms
    .map(slug => getTermBySlug(slug))
    .filter((t): t is GlossaryTerm => t !== undefined)
    .slice(0, limit)
  
  return related
}

