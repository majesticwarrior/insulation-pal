import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Wrench, Wind, Calculator, FileText, Quote, Zap, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import CostCalculatorDialog from '@/components/pages/CostCalculatorDialog'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Step-by-Step How-To Guide to Install Basement Insulation - InsulationPal',
  description: 'Complete DIY guide for basement insulation including spray foam, foam board, batts & rolls, and loose-fill methods. Expert tips for below-grade insulation.',
  keywords: 'basement insulation DIY, how to insulate basement, spray foam basement, foam board basement, basement insulation guide',
  openGraph: {
    title: 'Step-by-Step How-To Guide to Install Basement Insulation - InsulationPal',
    description: 'Complete DIY guide for basement insulation with moisture control and air sealing tips.',
    type: 'website',
  },
}

export default function BasementDIYGuidePage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link href="/resources/diy" className="inline-flex items-center text-[#0a4768] hover:text-[#0a4768]/80 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to DIY Guides
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0a4768] mb-4">Basement Insulation: Step-by-Step How-To Guide</h1>
          <p className="text-lg text-gray-700">Comprehensive instructions for Spray Foam, Foam Board, Batts & Rolls, and Loose-Fill installations for below-grade spaces.</p>
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
                  <li>Ensure proper drainage and waterproofing are in place.</li>
                  <li>Seal all air leaks from the living space above.</li>
                  <li>Install vapor barrier on the interior side of insulation.</li>
                  <li>Check for electrical wiring and plumbing before drilling.</li>
                  <li>Consider hiring professionals for spray foam installation.</li>
                </ul>
              </div>

              <nav className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <a href="#spray-foam" className="block border rounded-lg p-4 hover:shadow-sm">
                  <div className="flex items-center text-[#0a4768] font-semibold"><Zap className="h-5 w-5 mr-2" /> Spray Foam</div>
                  <p className="text-sm text-gray-600">Professional expanding foam insulation.</p>
                </a>
                <a href="#foam-board" className="block border rounded-lg p-4 hover:shadow-sm">
                  <div className="flex items-center text-[#0a4768] font-semibold"><Square className="h-5 w-5 mr-2" /> Foam Board</div>
                  <p className="text-sm text-gray-600">Rigid foam panels for walls and floors.</p>
                </a>
                <a href="#batts-rolls" className="block border rounded-lg p-4 hover:shadow-sm">
                  <div className="flex items-center text-[#0a4768] font-semibold"><CheckCircle2 className="h-5 w-5 mr-2" /> Batts & Rolls</div>
                  <p className="text-sm text-gray-600">Fiberglass batts between studs.</p>
                </a>
                <a href="#loose-fill" className="block border rounded-lg p-4 hover:shadow-sm">
                  <div className="flex items-center text-[#0a4768] font-semibold"><Wind className="h-5 w-5 mr-2" /> Loose-Fill</div>
                  <p className="text-sm text-gray-600">Blown-in insulation for floors.</p>
                </a>
              </nav>

              <article id="spray-foam" className="space-y-4 scroll-mt-20">
                <h2 className="text-3xl font-bold text-[#0a4768]">Spray Foam Insulation</h2>
                <p className="text-gray-700">Best for basement walls and rim joists. Provides excellent air sealing and moisture resistance. Professional installation recommended.</p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-800">
                  <li>Hire a licensed spray foam contractor for proper installation.</li>
                  <li>Choose closed-cell spray foam for moisture resistance (R-6 per inch).</li>
                  <li>Ensure proper ventilation during application - foam releases gases.</li>
                  <li>Contractor will apply foam to basement walls and rim joists.</li>
                  <li>Foam expands to fill gaps and seal air leaks completely.</li>
                  <li>Allow foam to cure completely before covering.</li>
                  <li>Trim excess foam flush with surfaces using a saw.</li>
                  <li>Install drywall over cured foam for fire protection.</li>
                </ol>
              </article>

              <article id="foam-board" className="space-y-4 scroll-mt-20">
                <h2 className="text-3xl font-bold text-[#0a4768]">Foam Board Installation</h2>
                <p className="text-gray-700">Excellent for basement walls and floors. Provides good R-value and moisture resistance. Use extruded polystyrene (XPS) or polyisocyanurate.</p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-800">
                  <li>Clean basement walls and remove any debris or loose material.</li>
                  <li>Choose foam board thickness: 2" (R-10) or 3" (R-15) for adequate insulation.</li>
                  <li>Cut foam boards to fit between studs using a utility knife.</li>
                  <li>Apply construction adhesive to the back of foam boards.</li>
                  <li>Press foam boards firmly against basement walls.</li>
                  <li>Seal all joints between foam boards with foil tape or caulk.</li>
                  <li>Install foam boards from the floor up to the ceiling.</li>
                  <li>Seal gaps around pipes, wires, and other penetrations.</li>
                </ol>
              </article>

              <article id="batts-rolls" className="space-y-4 scroll-mt-20">
                <h2 className="text-3xl font-bold text-[#0a4768]">Batts & Rolls Installation</h2>
                <p className="text-gray-700">Most economical option for basement walls. Install between studs with proper vapor barrier placement.</p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-800">
                  <li>Measure stud spacing (typically 16" or 24" on center).</li>
                  <li>Use faced fiberglass batts with vapor retarder toward living space.</li>
                  <li>Cut batts to fit snugly between basement wall studs.</li>
                  <li>Install batts with paper facing toward the interior (warm side).</li>
                  <li>Staple flanges to stud faces every 6 inches.</li>
                  <li>Fill gaps around pipes and wires with small pieces of insulation.</li>
                  <li>Install vapor barrier over insulation if using unfaced batts.</li>
                  <li>Cover with drywall for fire protection and finish.</li>
                </ol>
              </article>

              <article id="loose-fill" className="space-y-4 scroll-mt-20">
                <h2 className="text-3xl font-bold text-[#0a4768]">Loose-Fill Installation</h2>
                <p className="text-gray-700">Best for basement floors and ceiling cavities. Uses cellulose or fiberglass blown into spaces.</p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-800">
                  <li>Measure basement floor area and determine target R-value.</li>
                  <li>Install depth markers to ensure proper coverage.</li>
                  <li>Position blower outside; run hose to the basement.</li>
                  <li>Start at the farthest corner and work systematically.</li>
                  <li>Keep the hose low and level for uniform coverage.</li>
                  <li>Check marker depths frequently and add material to low spots.</li>
                  <li>Build dams around obstacles to contain loose insulation.</li>
                  <li>Install vapor barrier over loose-fill insulation.</li>
                </ol>
              </article>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h3 className="text-xl font-semibold text-[#0a4768] mb-2">Pro Tips</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Always install vapor barrier on the warm side of insulation.</li>
                  <li>Ensure proper drainage away from the foundation.</li>
                  <li>Consider insulating basement floors for comfort.</li>
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
                    <CostCalculatorDialog>
                      <Button className="w-full bg-[#0a4768] hover:bg-[#0a4768]/90 text-white">
                        <Calculator className="mr-2 h-4 w-4" />
                        Cost Calculator
                      </Button>
                    </CostCalculatorDialog>
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
                    <Link href="/resources/articles" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center text-[#0a4768]">
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="font-medium">Insulation Articles</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Expert guides and tips</p>
                    </Link>
                    <Link href="/services/basement-insulation" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center text-[#0a4768]">
                        <Wrench className="h-4 w-4 mr-2" />
                        <span className="font-medium">What is Basement Insulation?</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Learn about basement insulation</p>
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
