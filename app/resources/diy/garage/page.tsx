import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Wrench, Wind, Calculator, FileText, Quote, Zap, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Step-by-Step How-To Guide to Install Garage Insulation - InsulationPal',
  description: 'Complete DIY guide for garage insulation including spray foam, foam board, and batts & rolls methods. Expert tips for converting garage to living space.',
  keywords: 'garage insulation DIY, how to insulate garage, spray foam garage, foam board garage, garage conversion insulation',
  openGraph: {
    title: 'Step-by-Step How-To Guide to Install Garage Insulation - InsulationPal',
    description: 'Complete DIY guide for garage insulation with conversion and comfort tips.',
    type: 'website',
  },
}

export default function GarageDIYGuidePage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'DIY Guides', href: '/resources/diy' },
        { label: 'Garage Insulation' }
      ]} />

      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link href="/resources/diy" className="inline-flex items-center text-[#0a4768] hover:text-[#0a4768]/80 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to DIY Guides
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0a4768] mb-4">Garage Insulation: Step-by-Step How-To Guide</h1>
          <p className="text-lg text-gray-700">Comprehensive instructions for Spray Foam, Foam Board, and Batts & Rolls installations for garage comfort and energy efficiency.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-10">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-2">Before You Start</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Wear PPE: gloves, long sleeves, eye protection, and a respirator or dust mask.</li>
                  <li>Check for moisture issues, leaks, or mold before insulating.</li>
                  <li>Ensure proper ventilation and drainage are in place.</li>
                  <li>Seal all air leaks around doors, windows, and penetrations.</li>
                  <li>Consider insulating garage door separately or replacing with insulated model.</li>
                  <li>Check for electrical wiring and plumbing before drilling.</li>
                  <li>Consider hiring professionals for spray foam installation.</li>
                </ul>
              </div>

              <nav className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a href="#spray-foam" className="block border rounded-lg p-4 hover:shadow-sm">
                  <div className="flex items-center text-[#0a4768] font-semibold"><Zap className="h-5 w-5 mr-2" /> Spray Foam</div>
                  <p className="text-sm text-gray-600">Professional expanding foam insulation.</p>
                </a>
                <a href="#foam-board" className="block border rounded-lg p-4 hover:shadow-sm">
                  <div className="flex items-center text-[#0a4768] font-semibold"><Square className="h-5 w-5 mr-2" /> Foam Board</div>
                  <p className="text-sm text-gray-600">Rigid foam panels for walls and ceiling.</p>
                </a>
                <a href="#batts-rolls" className="block border rounded-lg p-4 hover:shadow-sm">
                  <div className="flex items-center text-[#0a4768] font-semibold"><CheckCircle2 className="h-5 w-5 mr-2" /> Batts & Rolls</div>
                  <p className="text-sm text-gray-600">Fiberglass batts between studs.</p>
                </a>
              </nav>

              <article id="spray-foam" className="space-y-4 scroll-mt-20">
                <h2 className="text-3xl font-bold text-[#0a4768]">Spray Foam Insulation</h2>
                <p className="text-gray-700">Best for garage walls and ceiling. Provides excellent air sealing and moisture resistance. Professional installation recommended.</p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-800">
                  <li>Hire a licensed spray foam contractor for proper installation.</li>
                  <li>Choose closed-cell spray foam for moisture resistance (R-6 per inch).</li>
                  <li>Ensure proper ventilation during application - foam releases gases.</li>
                  <li>Contractor will apply foam to garage walls and ceiling.</li>
                  <li>Foam expands to fill gaps and seal air leaks completely.</li>
                  <li>Allow foam to cure completely before covering.</li>
                  <li>Trim excess foam flush with surfaces using a saw.</li>
                  <li>Install drywall over cured foam for fire protection.</li>
                </ol>
              </article>

              <article id="foam-board" className="space-y-4 scroll-mt-20">
                <h2 className="text-3xl font-bold text-[#0a4768]">Foam Board Installation</h2>
                <p className="text-gray-700">Excellent for garage walls and ceiling. Provides good R-value and moisture resistance. Use extruded polystyrene (XPS) or polyisocyanurate.</p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-800">
                  <li>Clean garage walls and ceiling, remove any debris or loose material.</li>
                  <li>Choose foam board thickness: 2" (R-10) or 3" (R-15) for adequate insulation.</li>
                  <li>Cut foam boards to fit between studs using a utility knife.</li>
                  <li>Apply construction adhesive to the back of foam boards.</li>
                  <li>Press foam boards firmly against garage walls and ceiling.</li>
                  <li>Seal all joints between foam boards with foil tape or caulk.</li>
                  <li>Install foam boards from the floor up to the ceiling.</li>
                  <li>Seal gaps around pipes, wires, and other penetrations.</li>
                </ol>
              </article>

              <article id="batts-rolls" className="space-y-4 scroll-mt-20">
                <h2 className="text-3xl font-bold text-[#0a4768]">Batts & Rolls Installation</h2>
                <p className="text-gray-700">Most economical option for garage walls and ceiling. Install between studs with proper vapor barrier placement.</p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-800">
                  <li>Measure stud spacing (typically 16" or 24" on center).</li>
                  <li>Use faced fiberglass batts with vapor retarder toward living space.</li>
                  <li>Cut batts to fit snugly between garage wall studs.</li>
                  <li>Install batts with paper facing toward the interior (warm side).</li>
                  <li>Staple flanges to stud faces every 6 inches.</li>
                  <li>Fill gaps around pipes and wires with small pieces of insulation.</li>
                  <li>Install vapor barrier over insulation if using unfaced batts.</li>
                  <li>Cover with drywall for fire protection and finish.</li>
                </ol>
              </article>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h3 className="text-xl font-semibold text-[#0a4768] mb-2">Pro Tips</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Consider insulating the garage door separately for better efficiency.</li>
                  <li>Install weatherstripping around garage doors and windows.</li>
                  <li>Ensure proper ventilation to prevent moisture buildup.</li>
                  <li>Check local building codes for fire protection requirements.</li>
                </ul>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-[#0a4768] mb-4">Get Started</h3>
                  <div className="space-y-3">
                    <QuoteButton className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold">
                      <Quote className="mr-2 h-4 w-4" />
                      Get a Quote
                    </QuoteButton>
                    <Button asChild className="w-full bg-[#0a4768] hover:bg-[#0a4768]/90 text-white">
                      <Link href="/resources/insulation-calculator">
                        <Calculator className="mr-2 h-4 w-4" />
                        Cost Calculator
                      </Link>
                    </Button>
                    <Button asChild className="w-full border-[#0a4768] text-white hover:bg-[#0a4768] hover:text-white text-lg">
                      <Link href="/resources/where-to-buy">
                        <Wrench className="mr-2 h-4 w-4" />
                        Where to Buy
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-[#0a4768] mb-4">Learn More</h3>
                  <div className="space-y-3">
                    <Link href="/services/garage-insulation" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center text-[#0a4768]">
                        <Wrench className="h-4 w-4 mr-2" />
                        <span className="font-medium">Professional Garage Insulation</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Get quotes from licensed contractors</p>
                    </Link>
                    <Link href="/resources/glossary/garage" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center text-[#0a4768]">
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="font-medium">Garage Insulation Glossary</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Learn about garage insulation</p>
                    </Link>
                    <Link href="/resources/articles" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center text-[#0a4768]">
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="font-medium">Insulation Articles</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Expert guides and tips</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
