import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle, Search, Thermometer, DollarSign, FileText } from 'lucide-react'

export default function EnergyAuditArticle() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#0a4768]">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/resources" className="text-gray-500 hover:text-[#0a4768]">Learning Center</Link>
            <span className="text-gray-300">/</span>
            <Link href="/resources/articles" className="text-gray-500 hover:text-[#0a4768]">Articles</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900">What is an Energy Audit?</span>
          </nav>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/resources/articles" className="inline-flex items-center text-[#0a4768] hover:underline mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Link>
            
            <div className="mb-8">
              <span className="bg-[#F5DD22] text-[#0a4768] px-3 py-1 rounded-full text-sm font-medium">
                Energy Efficiency
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-[#0a4768] mb-6">
              What is an Energy Audit?
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Learn how energy audits identify insulation needs and energy efficiency improvements to reduce your home's energy consumption and costs.
            </p>
            
            <div className="aspect-video relative rounded-lg overflow-hidden mb-8">
              <Image
                src="/professional-insulation-contractor-working-on-home.jpg"
                alt="Energy auditor conducting home inspection"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-2xl font-bold text-[#0a4768] mb-4">What is an Energy Audit?</h2>
                  <p className="mb-6">
                    An energy audit is a comprehensive assessment of your home's energy consumption that identifies where energy is being wasted and recommends improvements to increase efficiency. Professional energy auditors use specialized equipment and techniques to locate air leaks, insufficient insulation, and other energy-wasting problems.
                  </p>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Types of Energy Audits</h3>
                  
                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">DIY Walk-Through Audit</h4>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Visual inspection of obvious issues</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Review of utility bills and usage patterns</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Free but limited in scope</span>
                    </li>
                  </ul>

                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">Professional Energy Assessment</h4>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Comprehensive analysis using specialized equipment</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Detailed report with prioritized recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Cost-benefit analysis of improvements</span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Energy Audit Process</h3>
                  
                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">1. Pre-Audit Analysis</h4>
                  <ul className="list-disc list-inside mb-4 space-y-1">
                    <li>Review 12-24 months of utility bills</li>
                    <li>Assess home size, age, and construction type</li>
                    <li>Interview homeowners about comfort issues</li>
                    <li>Identify major energy-using appliances</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">2. Visual Inspection</h4>
                  <ul className="list-disc list-inside mb-4 space-y-1">
                    <li>Examine insulation levels in attic, walls, and basement</li>
                    <li>Check for air leaks around windows, doors, and penetrations</li>
                    <li>Assess ductwork condition and sealing</li>
                    <li>Evaluate HVAC equipment efficiency</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">3. Diagnostic Testing</h4>
                  <ul className="list-disc list-inside mb-6 space-y-1">
                    <li>Blower door test to measure air leakage</li>
                    <li>Thermal imaging to identify insulation gaps</li>
                    <li>Duct blaster test for ductwork leaks</li>
                    <li>Combustion safety testing</li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Key Diagnostic Tools</h3>
                  <div className="bg-white p-6 rounded-lg border mb-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-3">Blower Door Test</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Measures total air leakage</li>
                          <li>• Pressurizes/depressurizes home</li>
                          <li>• Locates air leak sources</li>
                          <li>• Quantifies improvement potential</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-3">Thermal Imaging</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Infrared camera visualization</li>
                          <li>• Identifies missing insulation</li>
                          <li>• Shows thermal bridging</li>
                          <li>• Reveals moisture issues</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Common Findings</h3>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Search className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Insufficient Insulation:</strong> Attics, walls, and floors below recommended R-values</span>
                    </li>
                    <li className="flex items-start">
                      <Thermometer className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Air Leaks:</strong> Around windows, doors, electrical outlets, and penetrations</span>
                    </li>
                    <li className="flex items-start">
                      <DollarSign className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Duct Problems:</strong> Leaky or uninsulated ductwork in unconditioned spaces</span>
                    </li>
                    <li className="flex items-start">
                      <FileText className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Equipment Issues:</strong> Inefficient or improperly sized HVAC systems</span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Audit Report Components</h3>
                  <p className="mb-4">A comprehensive energy audit report typically includes:</p>
                  <ul className="list-disc list-inside mb-6 space-y-2">
                    <li><strong>Executive Summary:</strong> Key findings and priority recommendations</li>
                    <li><strong>Current Energy Use:</strong> Baseline consumption and costs</li>
                    <li><strong>Improvement Recommendations:</strong> Specific upgrades with cost estimates</li>
                    <li><strong>Cost-Benefit Analysis:</strong> Payback periods and savings projections</li>
                    <li><strong>Implementation Priority:</strong> Most effective improvements first</li>
                    <li><strong>Utility Rebates:</strong> Available incentives and programs</li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Cost and Savings</h3>
                  <div className="bg-white p-6 rounded-lg border mb-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-2">Audit Costs</h4>
                        <p className="text-sm">$300-$800 for professional audit</p>
                        <p className="text-sm">Often rebated by utilities</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-2">Potential Savings</h4>
                        <p className="text-sm">10-40% reduction in energy costs</p>
                        <p className="text-sm">$200-$2,000+ annual savings</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-2">Payback Period</h4>
                        <p className="text-sm">2-10 years typical range</p>
                        <p className="text-sm">Varies by improvement type</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-2">Home Value</h4>
                        <p className="text-sm">Increases resale value</p>
                        <p className="text-sm">Improves comfort and health</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">When to Get an Energy Audit</h3>
                  <ul className="list-disc list-inside mb-6 space-y-2">
                    <li>High or increasing energy bills</li>
                    <li>Uncomfortable rooms or temperature variations</li>
                    <li>Drafts or air leaks</li>
                    <li>Before major renovations</li>
                    <li>When purchasing a new home</li>
                    <li>To qualify for utility rebates</li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Choosing an Energy Auditor</h3>
                  <p className="mb-6">
                    Look for certified professionals with credentials from organizations like BPI (Building Performance Institute) or RESNET. Many utility companies offer subsidized audits or maintain lists of qualified auditors. Ensure the auditor uses diagnostic equipment and provides a detailed written report with specific recommendations.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#0a4768]">Quick Facts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-sm">
                        <li className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">2-4 hours</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Cost:</span>
                          <span className="font-medium">$300-$800</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Savings:</span>
                          <span className="font-medium text-green-600">10-40%</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Payback:</span>
                          <span className="font-medium">2-10 years</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Rebates:</span>
                          <span className="font-medium text-green-600">Often Available</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#0a4768]">Get Professional Energy Audit</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Connect with certified energy auditors in your area to identify insulation and efficiency improvements.
                      </p>
                      <QuoteButton className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold">
                        Get Free Quotes
                      </QuoteButton>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#0a4768]">Related Articles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <Link href="/resources/articles/what-is-spray-foam-insulation" className="text-[#0a4768] hover:underline">
                            What is Spray Foam Insulation?
                          </Link>
                        </li>
                        <li>
                          <Link href="/resources/articles/what-is-blown-in-insulation" className="text-[#0a4768] hover:underline">
                            What is Blown-in Insulation?
                          </Link>
                        </li>
                        <li>
                          <Link href="/resources/articles/what-is-fibreglass-insulation" className="text-[#0a4768] hover:underline">
                            What is Fibreglass Insulation?
                          </Link>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
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
