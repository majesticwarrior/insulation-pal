import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Wrench, Wind, Calculator, FileText, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import CostCalculatorDialog from '@/components/pages/CostCalculatorDialog'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Step-by-Step How-To Guide to Install Attic Insulation - InsulationPal',
  description: 'Complete DIY guide for attic insulation installation including blown-in, loose-fill, and roll & batt methods. Expert tips, safety guidelines, and step-by-step instructions.',
  keywords: 'attic insulation DIY, how to install attic insulation, blown-in insulation, batt insulation, attic insulation guide',
  openGraph: {
    title: 'Step-by-Step How-To Guide to Install Attic Insulation - InsulationPal',
    description: 'Complete DIY guide for attic insulation installation with expert tips and safety guidelines.',
    type: 'website',
  },
}

export default function AtticDIYGuidePage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link href="/resources/diy" className="inline-flex items-center text-[#0a4768] hover:text-[#0a4768]/80 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to DIY Guides
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0a4768] mb-4">Attic Insulation: Step-by-Step How-To Guide</h1>
          <p className="text-lg text-gray-700">Comprehensive instructions for Blown-in, Loose-Fill, and Roll & Batt installations, including prep, safety, tools, and pro tips.</p>
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
              <li>Seal air leaks around lights, pipes, and openings before insulating.</li>
              <li>Check for moisture issues or roof leaks and resolve first.</li>
              <li>Maintain clearances around recessed lights and flues per local code.</li>
              <li>Install rulers/markers to verify final insulation depth for R-value.</li>
            </ul>
          </div>

          <nav className="grid md:grid-cols-3 gap-4">
            <a href="#blown-in" className="block border rounded-lg p-4 hover:shadow-sm">
              <div className="flex items-center text-[#0a4768] font-semibold"><Wind className="h-5 w-5 mr-2" /> Blown-in</div>
              <p className="text-sm text-gray-600">Loose-fill installed with a blower for even coverage.</p>
            </a>
            <a href="#loose-fill" className="block border rounded-lg p-4 hover:shadow-sm">
              <div className="flex items-center text-[#0a4768] font-semibold"><Wrench className="h-5 w-5 mr-2" /> Loose-Fill (Manual)</div>
              <p className="text-sm text-gray-600">Spread manually without a blower for small areas.</p>
            </a>
            <a href="#roll-batt" className="block border rounded-lg p-4 hover:shadow-sm">
              <div className="flex items-center text-[#0a4768] font-semibold"><CheckCircle2 className="h-5 w-5 mr-2" /> Roll & Batt</div>
              <p className="text-sm text-gray-600">Faced or unfaced batts and rolls between joists.</p>
            </a>
          </nav>

          <article id="blown-in" className="space-y-4 scroll-mt-20">
            <h2 className="text-3xl font-bold text-[#0a4768]">Blown-in Attic Insulation</h2>
            <p className="text-gray-700">Best for achieving high R-values and filling irregular cavities. Typically uses cellulose or loose fiberglass with a rental blower.</p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-800">
              <li>Measure attic area and determine target R-value by climate zone.</li>
              <li>Install depth markers across the attic indicating required finished depth.</li>
              <li>Air seal penetrations and install baffles at eaves to maintain ventilation.</li>
              <li>Position blower outside; run hose to the attic. One person feeds, one spreads.</li>
              <li>Start at the farthest corner and work back toward the hatch.</li>
              <li>Keep the hose low and level; move steadily for uniform coverage.</li>
              <li>Check marker depths frequently and add material to low spots.</li>
              <li>Build a dam around the attic hatch to contain loose insulation.</li>
            </ol>
          </article>

          <article id="loose-fill" className="space-y-4 scroll-mt-20">
            <h2 className="text-3xl font-bold text-[#0a4768]">Loose-Fill (Manual) Installation</h2>
            <p className="text-gray-700">Suitable for small attics or touch-up work. Materials are spread manually without a blower.</p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-800">
              <li>Calculate coverage based on bag labels and target R-value.</li>
              <li>Place depth stakes and install baffles at eaves for airflow.</li>
              <li>Open bags and gently loosen material by hand into even layers.</li>
              <li>Spread with a rake to avoid mounding; do not compress insulation.</li>
              <li>Verify depths across the attic, topping up low areas as needed.</li>
            </ol>
          </article>

          <article id="roll-batt" className="space-y-4 scroll-mt-20">
            <h2 className="text-3xl font-bold text-[#0a4768]">Roll & Batt Installation</h2>
            <p className="text-gray-700">A common DIY method. Use faced batts with the vapor retarder toward the living space unless local code states otherwise.</p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-800">
              <li>Measure joist spacing and select correct batt width and thickness.</li>
              <li>Cut batts with a straightedge on scrap plywood; avoid compressing.</li>
              <li>Lay batts snugly between joists; split around wiring and obstructions.</li>
              <li>Staple flanges to the side of joists (if faced) without over-tightening.</li>
              <li>Layer perpendicular batts if additional R-value is required.</li>
              <li>Maintain clearance from heat sources and recessed lights per code.</li>
            </ol>
          </article>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h3 className="text-xl font-semibold text-[#0a4768] mb-2">Pro Tips</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Use walkway boards to avoid compressing insulation and for safety.</li>
              <li>Mark truss bays completed to ensure even coverage.</li>
              <li>Keep soffit vents clear with baffles to prevent moisture issues.</li>
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
                    <Link href="/services/attic-insulation" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center text-[#0a4768]">
                        <Wrench className="h-4 w-4 mr-2" />
                        <span className="font-medium">What is Attic Insulation?</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Learn about attic insulation</p>
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


