import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import CostCalculatorDialog from '@/components/pages/CostCalculatorDialog'
import Link from 'next/link'
import { Calculator, DollarSign, TrendingUp, MapPin, Clock, Users, ArrowRight, FileText, Wrench, BookOpen, BarChart3, PieChart } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How Much Does Insulation Cost? Complete 2025 Pricing Guide | InsulationPal',
  description: 'Complete guide to home insulation costs in 2024. Get detailed pricing for attic, wall, basement, and crawl space insulation. DIY vs professional installation costs.',
  keywords: 'home insulation cost, insulation pricing, attic insulation cost, wall insulation cost, basement insulation cost, insulation installation cost',
  openGraph: {
    title: 'What Does Home Insulation Cost? Complete 2024 Pricing Guide | InsulationPal',
    description: 'Complete guide to home insulation costs with detailed pricing breakdowns for all types of insulation.',
    type: 'website',
  },
}

const costFactors = [
  {
    title: 'Type of Insulation',
    description: 'Different materials have varying costs per square foot',
    impact: 'High',
    examples: ['Fiberglass: $0.50-$1.50/sq ft', 'Spray Foam: $3.00-$7.00/sq ft', 'Cellulose: $0.60-$1.20/sq ft']
  },
  {
    title: 'Area Size',
    description: 'Larger areas typically cost less per square foot',
    impact: 'High',
    examples: ['Attic: 1,000-3,000 sq ft', 'Walls: 500-2,000 sq ft', 'Basement: 200-1,500 sq ft']
  },
  {
    title: 'Installation Complexity',
    description: 'Access difficulty and existing conditions affect labor costs',
    impact: 'Medium',
    examples: ['Easy access: Standard rates', 'Difficult access: +20-50%', 'Existing insulation removal: +$0.50-$1.00/sq ft']
  },
  {
    title: 'Geographic Location',
    description: 'Labor costs vary significantly by region',
    impact: 'High',
    examples: ['West Coast: +15-25%', 'Northeast: +10-20%', 'Midwest/South: Standard rates']
  }
]

const insulationTypes = [
  {
    name: 'Attic Insulation',
    diyCost: '$0.50 - $1.50/sq ft',
    proCost: '$1.50 - $3.50/sq ft',
    avgCost: '$2,000 - $4,500',
    description: 'Most cost-effective insulation upgrade',
    rValue: 'R-30 to R-60',
    image: '/attic-insulation-blown-in.jpg'
  },
  {
    name: 'Wall Insulation',
    diyCost: '$0.75 - $2.00/sq ft',
    proCost: '$2.00 - $4.00/sq ft',
    avgCost: '$1,500 - $3,500',
    description: 'Improves comfort and energy efficiency',
    rValue: 'R-13 to R-21',
    image: '/cellulose-wall-insulation-installed.jpg'
  },
  {
    name: 'Basement Insulation',
    diyCost: '$1.00 - $2.50/sq ft',
    proCost: '$2.50 - $5.00/sq ft',
    avgCost: '$1,200 - $3,000',
    description: 'Prevents moisture and improves comfort',
    rValue: 'R-10 to R-20',
    image: '/basement-insulation-installed.jpg'
  },
  {
    name: 'Crawl Space Insulation',
    diyCost: '$0.75 - $2.00/sq ft',
    proCost: '$2.00 - $4.50/sq ft',
    avgCost: '$800 - $2,000',
    description: 'Includes vapor barrier installation',
    rValue: 'R-10 to R-19',
    image: '/crawl-space-insulation-installed.jpg'
  }
]

const materialCosts = [
  { material: 'Fiberglass Batts', costPerSqFt: '$0.50 - $1.50', rValue: 'R-13 to R-21', difficulty: 'Easy' },
  { material: 'Blown-in Fiberglass', costPerSqFt: '$0.60 - $1.80', rValue: 'R-30 to R-60', difficulty: 'Medium' },
  { material: 'Cellulose', costPerSqFt: '$0.60 - $1.20', rValue: 'R-30 to R-60', difficulty: 'Medium' },
  { material: 'Spray Foam (Open-cell)', costPerSqFt: '$3.00 - $5.00', rValue: 'R-3.5 per inch', difficulty: 'Professional' },
  { material: 'Spray Foam (Closed-cell)', costPerSqFt: '$4.00 - $7.00', rValue: 'R-6 per inch', difficulty: 'Professional' },
  { material: 'Rigid Foam Board', costPerSqFt: '$1.50 - $3.00', rValue: 'R-5 to R-15', difficulty: 'Easy' }
]

const regionalCosts = [
  { region: 'West Coast (CA, WA, OR)', multiplier: '1.15 - 1.25', avgCost: '$2,500 - $5,500' },
  { region: 'Northeast (NY, MA, CT)', multiplier: '1.10 - 1.20', avgCost: '$2,200 - $5,000' },
  { region: 'Southeast (FL, GA, NC)', multiplier: '0.95 - 1.05', avgCost: '$1,800 - $4,200' },
  { region: 'Midwest (IL, OH, MI)', multiplier: '1.00 - 1.10', avgCost: '$2,000 - $4,500' },
  { region: 'Southwest (TX, AZ, NV)', multiplier: '0.90 - 1.00', avgCost: '$1,700 - $4,000' },
  { region: 'Mountain West (CO, UT, ID)', multiplier: '1.05 - 1.15', avgCost: '$2,100 - $4,700' }
]

export default function CostPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Header />
      
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'What Does Home Insulation Cost' }
      ]} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center overflow-hidden">
            <div className="bg-[#F5DD22] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <DollarSign className="h-12 w-12 text-[#0a4768]" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a4768] mb-6 leading-tight">
              A 2025 Pricing Guide for Home Insulation Costs?
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed px-4 sm:px-0">
              Complete pricing breakdown for all types of insulation. Compare DIY vs professional costs, 
              regional pricing variations, and get accurate estimates for your project.
            </p>
            <div className="flex justify-center px-4 sm:px-0">
              <QuoteButton className="bg-[#0a4768] hover:bg-[#0a4768]/90 text-white px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto">
                Get Free Quote
              </QuoteButton>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-7xl overflow-hidden">
          <div className="grid lg:grid-cols-4 gap-4 lg:gap-8 overflow-hidden">
            <div className="lg:col-span-3 space-y-8 sm:space-y-10 overflow-hidden">
              {/* Long-form Content */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0a4768] mb-6">Understanding Insulation Costs</h2>
                <div className="prose prose-lg max-w-none text-gray-700 overflow-hidden">
                  <p className="text-base sm:text-lg mb-6">
                    Home insulation costs vary significantly based on several factors including the type of material, 
                    area size, installation complexity, and geographic location. Understanding these variables is 
                    crucial for homeowners planning insulation projects and budgeting accordingly.
                  </p>
                  
                  <p className="text-base sm:text-lg mb-6">
                    The average cost of insulating a home ranges from $1,500 to $6,000, with most homeowners 
                    spending between $2,000 and $4,500. This wide range reflects the diversity of insulation 
                    projects, from simple attic upgrades to comprehensive whole-house insulation improvements.
                  </p>

                  <p className="text-base sm:text-lg mb-6">
                    Professional installation typically costs 2-3 times more than DIY installation, but includes 
                    labor, equipment rental, and warranty coverage. DIY projects can save 50-70% on labor costs 
                    but require proper tools, safety equipment, and technical knowledge.
                  </p>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#0a4768] mb-4">Cost Breakdown Analysis</h3>
                  <p className="text-base sm:text-lg mb-6">
                    Material costs typically represent 40-60% of total project costs, while labor accounts for 
                    30-50%. Additional costs may include equipment rental, disposal fees, and permit costs. 
                    Understanding this breakdown helps homeowners make informed decisions about DIY vs professional installation.
                  </p>
                </div>
              </section>

              {/* Average Costs Overview */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0a4768] mb-6">Average Insulation Costs by Type</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 overflow-hidden">
                  {insulationTypes.map((type, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-xl font-bold text-[#0a4768] mb-3">{type.name}</h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">DIY Cost:</span>
                            <span className="font-semibold text-green-600">{type.diyCost}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Professional:</span>
                            <span className="font-semibold text-blue-600">{type.proCost}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Average Total:</span>
                            <span className="font-semibold text-[#0a4768]">{type.avgCost}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                        <p className="text-sm text-gray-500">R-Value: {type.rValue}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Cost Factors */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0a4768] mb-6">What Affects Insulation Costs?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 overflow-hidden">
                  {costFactors.map((factor, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-[#0a4768]">{factor.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            factor.impact === 'High' ? 'bg-red-100 text-red-700' :
                            factor.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {factor.impact} Impact
                          </span>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-4">{factor.description}</p>
                        <ul className="space-y-1">
                          {factor.examples.map((example, i) => (
                            <li key={i} className="text-sm text-gray-500 flex items-center">
                              <ArrowRight className="h-3 w-3 mr-2 text-[#0a4768]" />
                              {example}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Material Costs */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0a4768] mb-6">Insulation Material Costs</h2>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px]">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost per Sq Ft</th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">R-Value</th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {materialCosts.map((material, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0a4768]">{material.material}</td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.costPerSqFt}</td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.rValue}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  material.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                  material.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {material.difficulty}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Regional Pricing */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0a4768] mb-6">Regional Cost Variations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 overflow-hidden">
                  {regionalCosts.map((region, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-bold text-[#0a4768] mb-3">{region.region}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm sm:text-base">
                            <span className="text-gray-600">Cost Multiplier:</span>
                            <span className="font-semibold text-[#0a4768]">{region.multiplier}</span>
                          </div>
                          <div className="flex justify-between text-sm sm:text-base">
                            <span className="text-gray-600">Average Cost:</span>
                            <span className="font-semibold text-[#0a4768]">{region.avgCost}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Additional Long-form Content */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0a4768] mb-6">Return on Investment</h2>
                <div className="prose prose-lg max-w-none text-gray-700 overflow-hidden">
                  <p className="mb-6">
                    Insulation provides one of the best returns on investment for home improvements, typically 
                    paying for itself within 3-7 years through energy savings. The exact payback period depends 
                    on local energy costs, climate conditions, and the efficiency of your existing insulation.
                  </p>
                  
                  <p className="mb-6">
                    According to the U.S. Department of Energy, proper insulation can reduce heating and cooling 
                    costs by up to 20%. For a typical home with annual energy costs of $2,000, this represents 
                    savings of $400 per year, making insulation upgrades highly cost-effective.
                  </p>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#0a4768] mb-4">Energy Savings Breakdown</h3>
                  <p className="mb-6">
                    Attic insulation typically provides the highest energy savings, as heat rises and escapes 
                    through poorly insulated roofs. Wall insulation offers moderate savings, while basement and 
                    crawl space insulation primarily improve comfort and prevent moisture issues.
                  </p>

                  <p className="mb-6">
                    Professional installation often includes air sealing services, which can increase energy 
                    savings by an additional 10-20%. This comprehensive approach maximizes the return on 
                    investment and ensures optimal performance.
                  </p>
                </div>
              </section>

            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 mt-8 lg:mt-0 overflow-hidden">
              <div className="sticky top-8 space-y-4 sm:space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                  <h3 className="text-base sm:text-lg font-semibold text-[#0a4768] mb-4">Get Started</h3>
                  <div className="space-y-3">
                    <QuoteButton className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Get a Quote
                    </QuoteButton>
                    <Button asChild className="w-full bg-[#0a4768] hover:bg-[#0a4768]/90 text-white">
                      <Link href="/resources/diy#calculator">
                        <Calculator className="mr-2 h-4 w-4" />
                        Cost Calculator
                      </Link>
                    </Button>
                    <Button asChild className="w-full border-[#0a4768] text-white hover:bg-[#0a4768] hover:text-white text-lg">
                      <Link href="/resources/where-to-buy">
                        <MapPin className="mr-2 h-4 w-4" />
                        Where to Buy
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                  <h3 className="text-base sm:text-lg font-semibold text-[#0a4768] mb-4">Learning Center</h3>
                  <div className="space-y-3">
                    <Link href="/resources/articles" className="block p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center text-[#0a4768]">
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="text-sm sm:text-base font-medium">Articles</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">Expert guides and tips</p>
                    </Link>
                    <Link href="/resources/diy" className="block p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center text-[#0a4768]">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span className="text-sm sm:text-base font-medium">Do It Yourself</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">Step-by-step guides</p>
                    </Link>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                  <div className="space-y-3">
                    <Link href="/services/attic-insulation" className="block p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center text-[#0a4768]">
                        <Wrench className="h-4 w-4 mr-2" />
                        <span className="text-sm sm:text-base font-medium">What is Attic Insulation?</span>
                      </div>
                    </Link>
                    <Link href="/services/wall-insulation" className="block p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center text-[#0a4768]">
                        <Wrench className="h-4 w-4 mr-2" />
                        <span className="text-sm sm:text-base font-medium">What is Wall Insulation?</span>
                      </div>
                    </Link>
                    <Link href="/services/basement-insulation" className="block p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center text-[#0a4768]">
                        <Wrench className="h-4 w-4 mr-2" />
                        <span className="text-sm sm:text-base font-medium">What is Basement Insulation?</span>
                      </div>
                    </Link>
                    <Link href="/services/crawl-space" className="block p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center text-[#0a4768]">
                        <Wrench className="h-4 w-4 mr-2" />
                        <span className="text-sm sm:text-base font-medium">What is Crawl Space Insulation?</span>
                      </div>
                    </Link>
                    <Link href="/services/spray-foam" className="block p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center text-[#0a4768]">
                        <Wrench className="h-4 w-4 mr-2" />
                        <span className="text-sm sm:text-base font-medium">What is Spray Foam Insulation?</span>
                      </div>
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
