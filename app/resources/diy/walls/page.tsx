import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Wrench, Wind, Calculator, FileText, Quote, Zap, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import CostCalculatorDialog from '@/components/pages/CostCalculatorDialog'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Step-by-Step How-To Guide to Install Wall Insulation - InsulationPal',
  description: 'Complete DIY guide for wall insulation installation including blown-in, batts & rolls, spray foam, and rigid foam board methods. Expert tips for 2x4 and 2x6 construction.',
  keywords: 'wall insulation DIY, how to install wall insulation, blown-in wall insulation, batt insulation, spray foam insulation, rigid foam board',
  openGraph: {
    title: 'Step-by-Step How-To Guide to Install Wall Insulation - InsulationPal',
    description: 'Complete DIY guide for wall insulation installation with expert tips for different construction types.',
    type: 'website',
  },
}

export default function WallDIYGuidePage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'DIY Guides', href: '/resources/diy' },
        { label: 'Wall Insulation' }
      ]} />

      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link href="/resources/diy" className="inline-flex items-center text-[#0a4768] hover:text-[#0a4768]/80 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to DIY Guides
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0a4768] mb-4">Wall Insulation: Step-by-Step How-To Guide</h1>
          <p className="text-lg text-gray-700">Comprehensive instructions for Blown-in, Batts & Rolls, Spray Foam, and Rigid Foam Board installations for both 2x4 and 2x6 construction.</p>
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
                  <li>Identify your wall construction: 2x4 (3.5" cavity) or 2x6 (5.5" cavity).</li>
                  <li>Check for existing insulation and assess its condition.</li>
                  <li>Seal air leaks around outlets, switches, and windows before insulating.</li>
                  <li>Ensure proper vapor barrier placement per local building codes.</li>
                  <li>Check for electrical wiring and plumbing before drilling holes.</li>
                </ul>
              </div>

              <nav className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <a href="#blown-in" className="block border rounded-lg p-4 hover:shadow-sm">
                  <div className="flex items-center text-[#0a4768] font-semibold"><Wind className="h-5 w-5 mr-2" /> Blown-in</div>
                  <p className="text-sm text-gray-600">Loose-fill installed through small holes in drywall.</p>
                </a>
                <a href="#batts-rolls" className="block border rounded-lg p-4 hover:shadow-sm">
                  <div className="flex items-center text-[#0a4768] font-semibold"><CheckCircle2 className="h-5 w-5 mr-2" /> Batts & Rolls</div>
                  <p className="text-sm text-gray-600">Faced or unfaced fiberglass batts between studs.</p>
                </a>
                <a href="#spray-foam" className="block border rounded-lg p-4 hover:shadow-sm">
                  <div className="flex items-center text-[#0a4768] font-semibold"><Zap className="h-5 w-5 mr-2" /> Spray Foam</div>
                  <p className="text-sm text-gray-600">Professional-grade expanding foam insulation.</p>
                </a>
                <a href="#rigid-foam" className="block border rounded-lg p-4 hover:shadow-sm">
                  <div className="flex items-center text-[#0a4768] font-semibold"><Square className="h-5 w-5 mr-2" /> Rigid Foam</div>
                  <p className="text-sm text-gray-600">Foam board installed on interior or exterior.</p>
                </a>
              </nav>

              <article id="blown-in" className="space-y-4 scroll-mt-20">
                <h2 className="text-3xl font-bold text-[#0a4768]">Blown-in Wall Insulation</h2>
                <p className="text-gray-700">Best for existing walls without removing drywall. Uses cellulose or fiberglass blown through small holes drilled in the wall.</p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-800">
                  <li>Locate wall studs using a stud finder and mark their positions.</li>
                  <li>Drill 2-inch holes between studs at the top of each wall cavity.</li>
                  <li>For 2x4 walls: drill holes every 16 inches; for 2x6 walls: every 24 inches.</li>
                  <li>Insert the blower hose through the hole and fill cavity from bottom to top.</li>
                  <li>Monitor density using a density probe to ensure proper coverage.</li>
                  <li>Stop when material reaches the hole opening, then patch holes.</li>
                  <li>Use drywall compound to patch holes and sand smooth when dry.</li>
                  <li>Prime and paint patched areas to match existing wall finish.</li>
                </ol>
              </article>

              <article id="batts-rolls" className="space-y-4 scroll-mt-20">
                <h2 className="text-3xl font-bold text-[#0a4768]">Batts & Rolls Installation</h2>
                <p className="text-gray-700">Most common DIY method for new construction or when drywall is removed. Use faced batts with vapor retarder toward the living space.</p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-800">
                  <li>Measure stud spacing (typically 16" or 24" on center) and cavity depth.</li>
                  <li>For 2x4 walls: use R-13 to R-15 batts; for 2x6 walls: use R-19 to R-21 batts.</li>
                  <li>Cut batts to fit snugly between studs using a utility knife and straightedge.</li>
                  <li>Split batts around electrical boxes, pipes, and other obstructions.</li>
                  <li>Install batts with paper facing toward the living space (warm side).</li>
                  <li>Staple flanges to stud faces every 6 inches, avoiding over-compression.</li>
                  <li>Fill gaps around electrical boxes with small pieces of insulation.</li>
                  <li>Install vapor barrier over insulation if using unfaced batts.</li>
                </ol>
              </article>

              <article id="spray-foam" className="space-y-4 scroll-mt-20">
                <h2 className="text-3xl font-bold text-[#0a4768]">Spray Foam Insulation</h2>
                <p className="text-gray-700">Professional-grade insulation that expands to fill cavities completely. Best for air sealing and high R-value requirements.</p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-800">
                  <li>Hire a licensed spray foam contractor for proper installation.</li>
                  <li>Choose between open-cell (R-3.5 per inch) or closed-cell (R-6 per inch) foam.</li>
                  <li>For 2x4 walls: 3.5" of closed-cell provides R-21; 2x6 walls: 5.5" provides R-33.</li>
                  <li>Ensure proper ventilation during application - foam releases gases.</li>
                  <li>Contractor will drill holes and inject foam into wall cavities.</li>
                  <li>Foam expands to fill entire cavity, sealing air leaks completely.</li>
                  <li>Allow foam to cure completely before covering with drywall.</li>
                  <li>Trim excess foam flush with stud faces using a saw.</li>
                </ol>
              </article>

              <article id="rigid-foam" className="space-y-4 scroll-mt-20">
                <h2 className="text-3xl font-bold text-[#0a4768]">Rigid Foam Board Installation</h2>
                <p className="text-gray-700">Installed on interior or exterior walls. Provides continuous insulation and reduces thermal bridging through studs.</p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-800">
                  <li>Choose foam board thickness: 1" (R-5), 2" (R-10), or 3" (R-15).</li>
                  <li>For interior installation: attach directly to studs before drywall.</li>
                  <li>Cut foam boards to fit between studs using a utility knife.</li>
                  <li>Apply construction adhesive to stud faces for additional hold.</li>
                  <li>Install foam boards snugly between studs, sealing joints with tape.</li>
                  <li>For exterior installation: attach over sheathing before siding.</li>
                  <li>Seal all joints and penetrations with appropriate sealant.</li>
                  <li>Install drywall over interior foam or siding over exterior foam.</li>
                </ol>
              </article>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h3 className="text-xl font-semibold text-[#0a4768] mb-2">Pro Tips</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Always check local building codes for vapor barrier requirements.</li>
                  <li>For 2x6 construction, consider higher R-value insulation for better efficiency.</li>
                  <li>Seal air leaks before insulating to maximize effectiveness.</li>
                  <li>Consider hiring professionals for spray foam and blown-in installations.</li>
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
                    <Link href="/services/wall-insulation" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center text-[#0a4768]">
                        <Wrench className="h-4 w-4 mr-2" />
                        <span className="font-medium">What is Wall Insulation?</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Learn about wall insulation</p>
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
