import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { QuoteButton } from '@/components/ui/quote-button'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getTermBySlug, getRelatedTerms, glossaryTerms } from '@/lib/glossary-data'
import { getTermReferences } from '@/lib/glossary-references'

interface GlossaryTermPageProps {
  params: Promise<{ slug: string }>
}

// Generate static params for all glossary terms
export async function generateStaticParams() {
  return glossaryTerms.map((term) => ({
    slug: term.slug,
  }))
}

// Generate metadata for each term page
export async function generateMetadata({ params }: GlossaryTermPageProps): Promise<Metadata> {
  const { slug } = await params
  const term = getTermBySlug(slug)
  
  if (!term) {
    return {
      title: 'Term Not Found - InsulationPal',
    }
  }

  return {
    title: `${term.title}: Definition, Impact and More - InsulationPal`,
    description: term.description,
    keywords: `${term.title.toLowerCase()}, insulation, definition, what is ${term.title.toLowerCase()}`,
    openGraph: {
      title: `${term.title}: Definition and What it is`,
      description: term.description,
      type: 'article',
    },
  }
}

// Helper function to get service page links based on term
const getServiceLinks = (slug: string): Array<{ title: string; href: string }> => {
  const serviceMap: Record<string, Array<{ title: string; href: string }>> = {
    attic: [{ title: 'Attic Insulation Services', href: '/services/attic-insulation' }],
    basement: [{ title: 'Basement Insulation Services', href: '/services/basement-insulation' }],
    'crawl-space': [{ title: 'Crawl Space Insulation Services', href: '/services/crawl-space-insulation' }],
    'spray-foam': [{ title: 'Spray Foam Insulation Services', href: '/services/spray-foam-insulation' }],
    wall: [{ title: 'Wall Insulation Services', href: '/services/wall-insulation' }],
    'insulation-removal': [{ title: 'Insulation Removal Services', href: '/services/insulation-removal' }],
  }
  
  return serviceMap[slug] || [{ title: 'Insulation Services', href: '/services' }]
}

// Helper function to generate comprehensive content
const generateContent = (term: ReturnType<typeof getTermBySlug>) => {
  if (!term) return null

  const titleLower = term.title.toLowerCase()
  const isMaterialType = ['fiberglass', 'cellulose', 'spray-foam', 'foam-board', 'rockwool', 'wool', 'cotton', 'denim', 'cork'].includes(term.slug)
  const isLocationType = ['attic', 'basement', 'wall', 'floor', 'ceiling', 'garage', 'crawl-space'].includes(term.slug)
  const isCostType = term.slug.includes('cost') || term.slug === 'cost-calculator'

  return {
    definition: term.description,
    types: isMaterialType ? `There are several types of ${titleLower} available, each with unique properties and applications. ${term.title} can vary in composition, density, and installation methods depending on the specific requirements of the project.` : null,
    best: `The best ${titleLower} solution depends on various factors including your home's specific needs, climate conditions, budget, and energy efficiency goals. Professional assessment is recommended to determine the optimal ${titleLower} for your project.`,
    benefits: `${term.title} offers numerous benefits including improved energy efficiency, reduced heating and cooling costs, enhanced comfort, better indoor air quality, and increased property value. Proper installation can lead to significant long-term savings on energy bills.`,
    cost: isCostType ? null : `The cost of ${titleLower} varies based on several factors including material type, quantity needed, installation complexity, and regional pricing. On average, homeowners can expect to invest between $1,500 and $5,000 for a typical insulation project, with the investment typically paying for itself within 3-5 years through energy savings.`,
  }
}

export default async function GlossaryTermPage({ params }: GlossaryTermPageProps) {
  const { slug } = await params
  const term = getTermBySlug(slug)
  
  if (!term) {
    notFound()
  }

  const relatedTerms = getRelatedTerms(slug, 8)
  const content = generateContent(term)
  const serviceLinks = getServiceLinks(slug)
  const references = getTermReferences(slug)

  return (
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
        <div className="container mx-auto px-4">
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
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            {/* Definition */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">What is {term.title}?</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                {content.definition}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {term.title} is an essential component of modern building construction and energy efficiency strategies. Understanding how {term.title.toLowerCase()} works and its applications can help homeowners make informed decisions about their insulation needs.
              </p>
            </div>

            {/* Types */}
            {content.types && (
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">Types of {term.title}</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  {content.types}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  When selecting {term.title.toLowerCase()}, it's important to consider factors such as R-value requirements, installation method, environmental impact, and compatibility with your existing building structure.
                </p>
              </div>
            )}

            {/* Best Practices */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">What is the Best {term.title}?</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                {content.best}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Consultation with certified insulation professionals is crucial to ensure you select the most appropriate {term.title.toLowerCase()} solution that meets building codes, energy efficiency standards, and your specific performance requirements.
              </p>
            </div>

            {/* Benefits */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">Benefits of {term.title}</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                {content.benefits}
              </p>
              <ul className="list-disc list-inside space-y-3 text-lg text-gray-700 leading-relaxed ml-4">
                <li>Significant reduction in energy consumption and utility bills</li>
                <li>Improved thermal comfort throughout your home</li>
                <li>Enhanced indoor air quality and moisture control</li>
                <li>Increased property value and market appeal</li>
                <li>Environmental benefits through reduced carbon footprint</li>
                <li>Noise reduction and improved acoustic performance</li>
              </ul>
            </div>

            {/* Cost */}
            {content.cost && (
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">{term.title} Cost</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  {content.cost}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  For accurate pricing specific to your project, we recommend requesting free quotes from licensed insulation contractors in your area. Factors such as square footage, accessibility, material choice, and local labor rates all influence the final cost.
                </p>
              </div>
            )}

            {/* How InsulationPal Can Help */}
            <div className="mb-12 bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] p-8 rounded-lg">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">How InsulationPal Can Help You</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                InsulationPal connects you with licensed, experienced insulation contractors who specialize in {term.title.toLowerCase()}. Our platform makes it easy to compare quotes from multiple professionals, ensuring you get the best value for your insulation project.
              </p>
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  <strong>Free Quotes:</strong> Get multiple competitive quotes from pre-screened contractors in your area.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  <strong>Expert Matching:</strong> We match you with contractors who have experience with {term.title.toLowerCase()} and understand your specific needs.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  <strong>Quality Assurance:</strong> All contractors are licensed, insured, and verified for quality workmanship.
                </p>
              </div>
              <div className="mt-8">
                <QuoteButton className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3 text-lg">
                  Get Free Quotes for {term.title}
                </QuoteButton>
              </div>
            </div>

            {/* Internal Links */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">Related Services and Resources</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {serviceLinks.map((link, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Link
                      href={link.href}
                      className="text-lg font-semibold text-[#0a4768] mb-2 inline-block hover:underline"
                    >
                      {link.title}
                    </Link>
                    <p className="text-gray-600">Learn more about {link.title.toLowerCase()}</p>
                  </div>
                ))}
                <div
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Link
                    href="/resources/articles"
                    className="text-lg font-semibold text-[#0a4768] mb-2 inline-block hover:underline"
                  >
                    Insulation Articles
                  </Link>
                  <p className="text-gray-600">Expert guides and tips on insulation</p>
                </div>
              </div>
            </div>

            {/* Related Terms */}
            {relatedTerms.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">Related Terms</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {relatedTerms.map((relatedTerm) => (
                    <div
                      key={relatedTerm.slug}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Link
                        href={`/resources/glossary/${relatedTerm.slug}`}
                        className="text-lg font-semibold text-[#0a4768] mb-2 inline-block hover:underline"
                      >
                        {`${relatedTerm.title}: Definition and What it is`}
                      </Link>
                      <p className="text-gray-600 text-sm mt-1">{relatedTerm.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* References */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">References</h2>
              <ul className="space-y-3">
                {references.map((ref, index) => (
                  <li key={index} className="text-lg">
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0a4768] hover:underline"
                    >
                      {ref.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

