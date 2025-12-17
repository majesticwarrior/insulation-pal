import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { QuoteButton } from '@/components/ui/quote-button'
import Link from 'next/link'
import type { GlossaryTerm } from '@/lib/glossary-data'
import { getTermBySlug } from '@/lib/glossary-data'

export type StaticTerm = {
  title: string
  slug: string
  description: string
}

type Props = {
  term: GlossaryTerm
}

const getDisplayTitle = (slug: string, title: string) => {
  if (slug === 'cost-calculator') return 'Cost Calculator for Insulation'
  return title
}

export default function TermPage({ term }: Props) {
  const displayTitle = getDisplayTitle(term.slug, term.title)

  const getServiceLinksForTerm = (slug: string) => {
    const links: { href: string, label: string, description: string }[] = [
      { href: '/services', label: 'All Insulation Services', description: 'Explore all services we offer' }
    ]

    const add = (href: string, label: string, description: string) => {
      if (!links.find(l => l.href === href)) links.push({ href, label, description })
    }

    const garageArticleLink = {
      href: '/resources/articles/essential-materials-benefits-and-types-to-insulate-your-garage',
      label: 'Garage Insulation Materials Guide',
      description: 'Essential materials, benefits, and insulation types for garages'
    }

    const comparisonArticleLink = {
      href: '/resources/articles/cellulose-vs-fiberglass-insulation',
      label: 'Cellulose vs Fiberglass Comparison',
      description: 'Compare performance, cost, and best applications for cellulose and fiberglass insulation'
    }

    const battVsBlownInArticleLink = {
      href: '/resources/articles/batt-insulation-vs-blown-in-insulation',
      label: 'Batt vs Blown-In Insulation Comparison',
      description: 'Compare batt and blown-in insulation installation methods, R-values, costs, and best applications'
    }

    const atticClimateArticleLink = {
      href: '/resources/articles/best-attic-insulation-for-dry-cold-and-humid-climates',
      label: 'Best Attic Insulation for Different Climates',
      description: 'Choose the best attic insulation based on your climate zone, covering R-values, moisture control, and material selection'
    }

    const facedUnfacedArticleLink = {
      href: '/resources/articles/faced-or-unfaced-attic-insulation',
      label: 'Faced or Unfaced Attic Insulation Guide',
      description: 'Learn when to use faced vs unfaced insulation, how vapor barriers work, and which option is best for your climate'
    }

    // Map common glossary slugs to relevant services
    const map: Record<string, Array<{ href: string, label: string, description: string }>> = {
      attic: [
        facedUnfacedArticleLink,
        atticClimateArticleLink,
        battVsBlownInArticleLink,
        comparisonArticleLink,
        { href: '/services/attic-insulation', label: 'Attic Insulation', description: 'Professional attic insulation and air sealing' }
      ],
      wall: [
        battVsBlownInArticleLink,
        comparisonArticleLink,
        { href: '/services/wall-insulation', label: 'Wall Insulation', description: 'Upgrade wall cavities for better comfort' }
      ],
      'spray-foam': [
        atticClimateArticleLink,
        { href: '/services/spray-foam-insulation', label: 'Spray Foam Insulation', description: 'Closed-cell and open-cell spray foam installation' }
      ],
      'open-cell': [
        atticClimateArticleLink,
        { href: '/services/spray-foam-insulation', label: 'Spray Foam Insulation', description: 'Open-cell spray foam for interior applications' }
      ],
      'closed-cell': [
        atticClimateArticleLink,
        { href: '/services/spray-foam-insulation', label: 'Spray Foam Insulation', description: 'Closed-cell spray foam for high performance' }
      ],
      'crawl-space': [
        comparisonArticleLink,
        { href: '/services/crawl-space-insulation', label: 'Crawl Space Insulation', description: 'Encapsulation, insulation, and moisture control' }
      ],
      basement: [
        comparisonArticleLink,
        { href: '/services/basement-insulation', label: 'Basement Insulation', description: 'Insulate foundation walls and rim joists' }
      ],
      'insulation-removal': [
        { href: '/services/insulation-removal', label: 'Insulation Removal', description: 'Safe removal of old or damaged insulation' }
      ],
      'air-duct-sealing': [
        { href: '/services', label: 'Duct Sealing', description: 'Seal leaky ducts to improve HVAC efficiency' }
      ],
      'duct-sealing': [
        { href: '/services', label: 'Duct Sealing', description: 'Seal leaky ducts to improve HVAC efficiency' }
      ],
      'foam-board': [
        garageArticleLink,
        { href: '/services/wall-insulation', label: 'Wall Insulation', description: 'Continuous insulation with foam board options' }
      ],
      'fiberglass': [
        atticClimateArticleLink,
        battVsBlownInArticleLink,
        comparisonArticleLink,
        garageArticleLink,
        { href: '/services/attic-insulation', label: 'Attic Insulation', description: 'Blown fiberglass and batt upgrades' },
        { href: '/services/wall-insulation', label: 'Wall Insulation', description: 'Batt and dense-pack options' }
      ],
      'cellulose': [
        atticClimateArticleLink,
        battVsBlownInArticleLink,
        comparisonArticleLink,
        { href: '/services/attic-insulation', label: 'Attic Insulation', description: 'Blown-in cellulose for complete coverage' },
        { href: '/services/wall-insulation', label: 'Wall Insulation', description: 'Dense-pack cellulose for walls' }
      ],
      'blown-in': [
        atticClimateArticleLink,
        battVsBlownInArticleLink,
        comparisonArticleLink,
        { href: '/services/attic-insulation', label: 'Attic Insulation', description: 'Blown-in upgrades for attics and more' }
      ],
      'sound-proofing': [
        { href: '/services/wall-insulation', label: 'Wall Insulation', description: 'Acoustic wall upgrades with mineral wool' }
      ],
      'vapor-barrier': [
        facedUnfacedArticleLink,
        atticClimateArticleLink,
        { href: '/services/crawl-space-insulation', label: 'Crawl Space Insulation', description: 'Vapor control and encapsulation systems' }
      ],
      'radiant-barrier': [
        atticClimateArticleLink,
        garageArticleLink,
        { href: '/services/attic-insulation', label: 'Attic Insulation', description: 'Attic radiant barrier and insulation' }
      ],
      garage: [
        garageArticleLink,
        comparisonArticleLink,
        { href: '/services/garage-insulation', label: 'Garage Insulation', description: 'Professional garage wall, ceiling, and door insulation' }
      ],
      'r-value': [
        facedUnfacedArticleLink,
        atticClimateArticleLink,
        battVsBlownInArticleLink,
        comparisonArticleLink
      ],
      'loose-fill': [
        atticClimateArticleLink,
        battVsBlownInArticleLink,
        { href: '/services/attic-insulation', label: 'Attic Insulation', description: 'Loose-fill insulation for attics' }
      ],
      'rockwool': [
        atticClimateArticleLink,
        { href: '/services/attic-insulation', label: 'Attic Insulation', description: 'Mineral wool insulation for attics' }
      ],
      'batt-roll': [
        facedUnfacedArticleLink,
        atticClimateArticleLink,
        battVsBlownInArticleLink,
        comparisonArticleLink,
        { href: '/services/wall-insulation', label: 'Wall Insulation', description: 'Batt and roll installation for walls' }
      ],
      'faced': [
        facedUnfacedArticleLink,
        atticClimateArticleLink,
        battVsBlownInArticleLink,
        { href: '/services/attic-insulation', label: 'Attic Insulation', description: 'Professional attic insulation with vapor barriers' },
        { href: '/services/wall-insulation', label: 'Wall Insulation', description: 'Faced insulation for exterior walls' }
      ],
      'unfaced': [
        facedUnfacedArticleLink,
        atticClimateArticleLink,
        battVsBlownInArticleLink,
        { href: '/services/attic-insulation', label: 'Attic Insulation', description: 'Add unfaced insulation layers to existing attic insulation' },
        { href: '/services/wall-insulation', label: 'Wall Insulation', description: 'Unfaced insulation for interior walls' }
      ]
    }

    Object.entries(map).forEach(([key, serviceLinks]) => {
      if (slug === key) serviceLinks.forEach(l => add(l.href, l.label, l.description))
    })

    return links
  }

  const getReferencesForTerm = (slug: string) => {
    // Default authoritative deep links
    const defaults = [
      { href: 'https://en.wikipedia.org/wiki/Thermal_insulation', label: 'Wikipedia - Thermal Insulation' },
      { href: 'https://www.energy.gov/energysaver/insulation', label: 'Energy.gov - Insulation (Energy Saver)' },
      { href: 'https://insulation.org/resources/insulation-basics/', label: 'National Insulation Association - Insulation Basics' },
      { href: 'https://www.insulation.org/about-insulation/for-consumers/', label: 'ICAA - Insulation for Consumers' }
    ]

    const map: Record<string, Array<{ href: string, label: string }>> = {
      'attic': [
        { href: 'https://www.energy.gov/energysaver/weatherize/insulation/attic-insulation', label: 'Energy.gov - Attic Insulation' },
        { href: 'https://en.wikipedia.org/wiki/Roof_insulation', label: 'Wikipedia - Roof/Attic Insulation' }
      ],
      'basement': [
        { href: 'https://www.energy.gov/energysaver/basement-insulation', label: 'Energy.gov - Basement Insulation' },
        { href: 'https://www.buildingscience.com/documents/digests/bsd-103-understanding-basements', label: 'Building Science - Understanding Basements' }
      ],
      'crawl-space': [
        { href: 'https://www.energy.gov/energysaver/crawlspace-insulation', label: 'Energy.gov - Crawlspace Insulation' },
        { href: 'https://www.buildingscience.com/documents/information-sheets/insulating-crawlspace', label: 'Building Science - Insulating Crawlspaces' }
      ],
      'wall': [
        { href: 'https://www.energy.gov/energysaver/walls-and-attics', label: 'Energy.gov - Walls & Attics' },
        { href: 'https://en.wikipedia.org/wiki/Cavity_wall_insulation', label: 'Wikipedia - Cavity Wall Insulation' }
      ],
      'spray-foam': [
        { href: 'https://en.wikipedia.org/wiki/Spray_foam', label: 'Wikipedia - Spray Foam' },
        { href: 'https://www.energy.gov/energysaver/types-insulation#foam', label: 'Energy.gov - Foam Insulation (Types)' }
      ],
      'open-cell': [
        { href: 'https://www.energy.gov/energysaver/types-insulation#foam', label: 'Energy.gov - Foam Insulation Types' },
        { href: 'https://en.wikipedia.org/wiki/Spray_foam', label: 'Wikipedia - Spray Foam' }
      ],
      'closed-cell': [
        { href: 'https://www.energy.gov/energysaver/types-insulation#foam', label: 'Energy.gov - Foam Insulation Types' },
        { href: 'https://www.energystar.gov/campaign/seal_insulate/methods_techniques', label: 'ENERGY STAR - Seal and Insulate' }
      ],
      'cellulose': [
        { href: 'https://en.wikipedia.org/wiki/Cellulose_insulation', label: 'Wikipedia - Cellulose Insulation' },
        { href: 'https://www.energy.gov/energysaver/types-insulation#loosefill', label: 'Energy.gov - Loose-Fill Insulation' }
      ],
      'fiberglass': [
        { href: 'https://en.wikipedia.org/wiki/Fiberglass_insulation', label: 'Wikipedia - Fiberglass Insulation' },
        { href: 'https://www.energy.gov/energysaver/types-insulation#blankets', label: 'Energy.gov - Blanket (Batt/Roll) Insulation' }
      ],
      'rockwool': [
        { href: 'https://en.wikipedia.org/wiki/Mineral_wool', label: 'Wikipedia - Mineral Wool' },
        { href: 'https://www.energy.gov/energysaver/types-insulation#blankets', label: 'Energy.gov - Blanket Insulation' }
      ],
      'foam-board': [
        { href: 'https://www.energy.gov/energysaver/types-insulation#rigid', label: 'Energy.gov - Rigid Foam Board' },
        { href: 'https://en.wikipedia.org/wiki/Insulation_board', label: 'Wikipedia - Rigid Insulation Board' }
      ],
      'radiant-barrier': [
        { href: 'https://www.energy.gov/energysaver/radiant-barriers', label: 'Energy.gov - Radiant Barriers' },
        { href: 'https://en.wikipedia.org/wiki/Radiant_barrier', label: 'Wikipedia - Radiant Barrier' }
      ],
      'reflective': [
        { href: 'https://www.energy.gov/energysaver/radiant-barriers', label: 'Energy.gov - Radiant/Reflective Barriers' }
      ],
      'r-value': [
        { href: 'https://en.wikipedia.org/wiki/R-value_(insulation)', label: 'Wikipedia - R-value (Insulation)' },
        { href: 'https://www.energy.gov/energysaver/insulation/r-value-map', label: 'Energy.gov - R-Value Recommendations' }
      ],
      'vapor-barrier': [
        { href: 'https://www.energy.gov/energysaver/building-envelope-design-vapor-barriers', label: 'Energy.gov - Vapor Barriers' },
        { href: 'https://en.wikipedia.org/wiki/Vapour_barrier', label: 'Wikipedia - Vapor Barrier' }
      ],
      'air-duct-sealing': [
        { href: 'https://www.energy.gov/energysaver/sealing-your-home/duct-sealing', label: 'Energy.gov - Duct Sealing' },
        { href: 'https://www.energystar.gov/campaign/seal_insulate/ducts', label: 'ENERGY STAR - Duct Sealing' }
      ],
      'duct-sealing': [
        { href: 'https://www.energy.gov/energysaver/sealing-your-home/duct-sealing', label: 'Energy.gov - Duct Sealing' },
        { href: 'https://www.energystar.gov/campaign/seal_insulate/ducts', label: 'ENERGY STAR - Duct Sealing' }
      ],
      'loose-fill': [
        { href: 'https://www.energy.gov/energysaver/types-insulation#loosefill', label: 'Energy.gov - Loose-Fill Insulation' }
      ],
      'batt-roll': [
        { href: 'https://www.energy.gov/energysaver/types-insulation#blankets', label: 'Energy.gov - Blanket (Batt/Roll)' }
      ],
      'sound-proofing': [
        { href: 'https://en.wikipedia.org/wiki/Soundproofing', label: 'Wikipedia - Soundproofing' },
        { href: 'https://www.energy.gov/energysaver/soundproofing', label: 'Energy.gov - Soundproofing' }
      ],
      'thermal-insulation': [
        { href: 'https://en.wikipedia.org/wiki/Thermal_insulation', label: 'Wikipedia - Thermal Insulation' },
        { href: 'https://www.energy.gov/energysaver/insulation', label: 'Energy.gov - Insulation (Energy Saver)' }
      ],
      'vacuum-insulated-panels': [
        { href: 'https://en.wikipedia.org/wiki/Vacuum_insulated_panel', label: 'Wikipedia - Vacuum Insulated Panel' }
      ],
      'insulation-removal': [
        { href: 'https://www.epa.gov/mold/renovation-repair-and-painting-program', label: 'EPA - Renovation, Repair and Painting (Containment/Mold)' }
      ],
      'energy-audit': [
        { href: 'https://www.energy.gov/energysaver/home-energy-audits', label: 'Energy.gov - Home Energy Audits' },
        { href: 'https://www.energystar.gov/campaign/heating_cooling/assessment', label: 'ENERGY STAR - Home Energy Assessment' }
      ]
    }

    return map[slug] && map[slug].length > 0 ? [...map[slug], ...defaults] : defaults
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `${term.title}: Definition, Impact and More`,
            "description": term.description,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://insulationpal.com/resources/glossary/${term.slug}`
            },
            "author": {
              "@type": "Organization",
              "name": "InsulationPal"
            },
            "publisher": {
              "@type": "Organization",
              "name": "InsulationPal",
              "logo": {
                "@type": "ImageObject",
                "url": "https://insulationpal.com/insulation-pal-logo.png"
              }
            },
            "image": [
              "https://insulationpal.com/home-outside-walls-insulation-installation.jpg"
            ],
            "articleSection": "Glossary"
          })
        }}
      />
      <main className="min-h-screen">
      <Header />

      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'Glossary', href: '/resources/glossary' },
        { label: term.title }
      ]} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-20">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/resources/glossary" 
              className="inline-flex items-center text-[#0a4768] hover:text-[#0a4768]/80 transition-colors mb-6"
            >
              ← Back to Glossary
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a4768] mb-6 leading-tight">
              {term.title}: Definition and What it is
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              {term.description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            {/* Definition */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
                {term.slug === 'cost-calculator' ? 'What is an Insulation Cost Calculator?' : `What is ${displayTitle}?`}
              </h2>
              {term.content ? (
                <>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    {term.content.definition}
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {term.content.extendedDescription}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    {term.description}
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {term.title} is an essential concept in insulation planning and home energy improvement. Understanding how {term.title.toLowerCase()} applies to your project helps you make informed decisions.
                  </p>
                </>
              )}
            </div>

            {/* Types */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
                {term.content?.types?.title || `Types of ${displayTitle}`}
              </h2>
              {term.content?.types ? (
                <ul className="list-disc list-inside space-y-3 text-lg text-gray-700 leading-relaxed ml-4">
                  {term.content.types.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    The best approach to {displayTitle.toLowerCase()} depends on your goals, climate, and budget. Below are common considerations and variations you may encounter.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Always confirm local code requirements and discuss options with a qualified contractor to ensure proper performance and compliance.
                  </p>
                </>
              )}
            </div>

            {/* Best Practices */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
                {term.content?.bestPractices?.title || `What is the Best ${displayTitle}?`}
              </h2>
              {term.content?.bestPractices ? (
                <p className="text-lg text-gray-700 leading-relaxed">
                  {term.content.bestPractices.description}
                </p>
              ) : (
                <>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    The best choice is situational. Factors include your home's current condition, regional climate, R-value targets, moisture control needs, and project budget.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    A professional assessment ensures the selected solution meets performance, durability, and code requirements while aligning with your goals.
                  </p>
                </>
              )}
            </div>

            {/* Benefits */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
                {term.slug === 'cost-calculator' ? 'Benefits of a Cost Calculator for Insulation' : `Benefits of ${displayTitle}`}
              </h2>
              <ul className="list-disc list-inside space-y-3 text-lg text-gray-700 leading-relaxed ml-4">
                {term.content?.benefits ? (
                  term.content.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))
                ) : (
                  <>
                    <li>Improved energy efficiency and comfort</li>
                    <li>Clearer budgeting and planning</li>
                    <li>Better moisture and air control strategies</li>
                    <li>Potential increase in property value</li>
                    <li>Reduced noise transmission</li>
                  </>
                )}
              </ul>
            </div>

            {/* Cost */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">{displayTitle} Cost</h2>
              {term.content?.costInfo ? (
                <>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    {term.content.costInfo.description}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 leading-relaxed ml-4">
                    {term.content.costInfo.factors.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Costs vary by scope, materials, access, regional pricing, and labor. Request free quotes to get accurate pricing for your home.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Typical ranges reflect square footage, installation complexity, and performance targets (R-values, air sealing, vapor control).
                  </p>
                </>
              )}
            </div>

            {/* How InsulationPal Can Help */}
            <div className="mb-12 bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] p-8 rounded-lg">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">How InsulationPal Can Help You</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                InsulationPal connects you with licensed, experienced insulation contractors. Compare multiple quotes to get the best value for your project.
              </p>
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed"><strong>Free Quotes:</strong> Get multiple competitive quotes from pre-screened contractors.</p>
                <p className="text-lg text-gray-700 leading-relaxed"><strong>Expert Matching:</strong> We match you with pros experienced in {term.title.toLowerCase()}.</p>
                <p className="text-lg text-gray-700 leading-relaxed"><strong>Quality Assurance:</strong> Licensed, insured, and verified contractors.</p>
              </div>
              <div className="mt-8">
                <QuoteButton className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3 text-lg">
                  Get Free Quotes for {term.title}
                </QuoteButton>
              </div>
            </div>

            {/* Related Services and Resources */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">Related Services and Resources</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {getServiceLinksForTerm(term.slug).map((item, idx) => (
                  <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Link href={item.href} className="text-lg font-semibold text-[#0a4768] mb-2 inline-block hover:underline">{item.label}</Link>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Link href="/resources/articles" className="text-lg font-semibold text-[#0a4768] mb-2 inline-block hover:underline">Insulation Articles</Link>
                  <p className="text-gray-600">Expert guides and tips on insulation</p>
                </div>
                {term.slug === 'cost-calculator' && (
                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Link href="/resources/diy#calculator" className="text-lg font-semibold text-[#0a4768] mb-2 inline-block hover:underline">Cost Calculator Tool</Link>
                    <p className="text-gray-600">Use our interactive cost calculator</p>
                  </div>
                )}
              </div>
            </div>

            {/* Related Terms */}
            {term.relatedTerms && term.relatedTerms.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">Related Terms</h2>
                <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 leading-relaxed ml-4">
                  {term.relatedTerms.map((relatedSlug) => {
                    const related = getTermBySlug(relatedSlug)
                    if (!related) return null
                    const relatedDisplayTitle = getDisplayTitle(related.slug, related.title)
                    return (
                      <li key={relatedSlug}>
                        <Link href={`/resources/glossary/${relatedSlug}`} className="text-[#0a4768] hover:underline">
                          {`${relatedDisplayTitle}: Definition and What it is`}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* References */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">References</h2>
              <ul className="space-y-3">
                {getReferencesForTerm(term.slug).map((ref, i) => (
                  <li key={i} className="text-lg">
                    <a href={ref.href} target="_blank" rel="noopener noreferrer" className="text-[#0a4768] hover:underline">{ref.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
    </>
  )
}


