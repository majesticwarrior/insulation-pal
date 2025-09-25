import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle, Wind, Target, Layers, Star, Shield } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function BlownInInsulationArticle() {
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
            <span className="text-gray-900">What is Blown-in Insulation?</span>
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
                Installation
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-[#0a4768] mb-6">
              What is Blown-in Insulation?
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Understanding blown-in insulation techniques for filling gaps and achieving complete coverage in attics, walls, and hard-to-reach areas.
            </p>
            
            <div className="aspect-video relative rounded-lg overflow-hidden mb-8">
              <Image
                src="/attic-insulation-blown-in.jpg"
                alt="Blown-in insulation being installed in attic"
                fill
                className="object-cover"
              />
            </div>

            {/* Why Trust Insulation Pal Accordion */}
            <div className="mb-2">
              <Accordion type="single" collapsible className="border rounded-lg bg-white shadow-sm">
                <AccordionItem value="trust-insulation-pal">
                  <AccordionTrigger className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-[#0a4768]" />
                      <span className="text-lg font-semibold text-[#0a4768]">Why trust Insulation Pal</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4">
                      <p className="text-gray-700">
                        1000's of customers have trusted Insulation Pal, a digital platform that provides access to local insulation contractors and provide fast estimates.
                      </p>
                      
                      <ul className="space-y-3">
                        <li className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-[#F5DD22] rounded-full mt-2"></div>
                          <span className="text-gray-700">
                            <strong>30% reduction in energy bills*</strong> reported by Insulation Pal customers
                          </span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-[#F5DD22] rounded-full mt-2"></div>
                          <span className="text-gray-700">
                            Hundreds of licensed physical therapists and health coaches
                          </span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-[#F5DD22] rounded-full mt-2"></div>
                          <div className="text-gray-700">
                            <div className="flex items-center space-x-2 mb-1">
                              <span><strong>4.9/5 average star rating</strong> of Insulation Pal reviews on Google</span>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                      
                      <p className="text-sm text-gray-600 pt-2 border-t">
                        Insulation Pal prides itself on the integrity of its content, which is carefully curated and created by our staff. We use only trusted sources in our reporting, including home improvement journals, university and government websites.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
                  <h2 className="text-2xl font-bold text-[#0a4768] mb-4">What is Blown-in Insulation?</h2>
                  <p className="mb-6">
                    Blown-in insulation is a method of installing loose-fill insulation materials using specialized equipment that blows the material into attics, wall cavities, and other spaces. This technique allows for excellent coverage around obstacles and in irregular spaces where traditional batt insulation would be difficult to install.
                  </p>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Types of Blown-in Materials</h3>
                  
                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">Cellulose</h4>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>R-3.2 to R-3.8 per inch</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Made from recycled paper products</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Excellent for air sealing</span>
                    </li>
                  </ul>

                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">Fiberglass</h4>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>R-2.2 to R-2.7 per inch</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Lightweight and non-combustible</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Resistant to moisture and mold</span>
                    </li>
                  </ul>

                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">Mineral Wool</h4>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>R-3.0 to R-3.3 per inch</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Superior fire resistance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Excellent sound dampening</span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Key Benefits</h3>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Target className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Complete Coverage:</strong> Fills gaps and voids that batts cannot reach</span>
                    </li>
                    <li className="flex items-start">
                      <Wind className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Air Sealing:</strong> Reduces air infiltration and drafts</span>
                    </li>
                    <li className="flex items-start">
                      <Layers className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Seamless Application:</strong> No joints or seams to create thermal bridging</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Retrofit Friendly:</strong> Perfect for existing homes and hard-to-reach areas</span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Installation Process</h3>
                  
                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">Equipment Required</h4>
                  <ul className="list-disc list-inside mb-4 space-y-2">
                    <li>Insulation blowing machine</li>
                    <li>Flexible hoses (up to 150+ feet)</li>
                    <li>Material hopper and agitator</li>
                    <li>Depth measurement tools</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">Installation Steps</h4>
                  <ol className="list-decimal list-inside mb-6 space-y-2">
                    <li>Seal air leaks with caulk or foam</li>
                    <li>Install proper ventilation baffles</li>
                    <li>Set up blowing equipment</li>
                    <li>Blow insulation to specified depth</li>
                    <li>Level and verify coverage</li>
                    <li>Install depth markers for future reference</li>
                  </ol>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Installation Methods</h3>
                  <div className="bg-white p-6 rounded-lg border mb-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-3">Open Blow</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Attic floors</li>
                          <li>• Open cavities</li>
                          <li>• Accessible areas</li>
                          <li>• New construction</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-3">Dense Pack</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Enclosed wall cavities</li>
                          <li>• Existing wall retrofits</li>
                          <li>• Higher density application</li>
                          <li>• Better air sealing</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Best Applications</h3>
                  <p className="mb-4">Blown-in insulation excels in several applications:</p>
                  <ul className="list-disc list-inside mb-6 space-y-2">
                    <li><strong>Attics:</strong> Over existing insulation or in new construction</li>
                    <li><strong>Wall Retrofits:</strong> Adding insulation to existing walls without renovation</li>
                    <li><strong>Irregular Spaces:</strong> Around wiring, plumbing, and ductwork</li>
                    <li><strong>Floor Cavities:</strong> Between floor joists over unheated spaces</li>
                    <li><strong>Cathedral Ceilings:</strong> In enclosed rafter spaces</li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Performance Considerations</h3>
                  <div className="bg-white p-6 rounded-lg border mb-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-2">Density</h4>
                        <p>Critical for performance - too low reduces R-value, too high can compress material</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-2">Settling</h4>
                        <p>Properly installed blown-in insulation settles minimally over time</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-2">Coverage</h4>
                        <p>Uniform coverage essential for optimal thermal performance</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-2">Air Sealing</h4>
                        <p>Provides moderate air sealing but not as effective as spray foam</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Professional Installation</h3>
                  <p className="mb-6">
                    While DIY rental equipment is available, professional installation ensures proper density, coverage, and air sealing. Professionals have the experience to achieve optimal performance and can access hard-to-reach areas safely. They also understand local building codes and ventilation requirements.
                  </p>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Cost Considerations</h3>
                  <p className="mb-6">
                    Blown-in insulation typically costs more than DIY batt installation but less than spray foam. The superior coverage and air sealing often justify the additional cost through improved energy savings. Professional installation includes equipment, materials, and labor.
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
                          <span>Materials:</span>
                          <span className="font-medium">Cellulose/Fiberglass</span>
                        </li>
                        <li className="flex justify-between">
                          <span>R-Value:</span>
                          <span className="font-medium">R-2.2-3.8/inch</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Installation:</span>
                          <span className="font-medium">Professional</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Coverage:</span>
                          <span className="font-medium text-green-600">Complete</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Air Sealing:</span>
                          <span className="font-medium text-green-600">Good</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#0a4768]">Professional Installation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Get blown-in insulation professionally installed for optimal coverage and performance in your home.
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
                          <Link href="/resources/articles/what-is-cellulose-insulation" className="text-[#0a4768] hover:underline">
                            What is Cellulose Insulation?
                          </Link>
                        </li>
                        <li>
                          <Link href="/resources/articles/what-is-fibreglass-insulation" className="text-[#0a4768] hover:underline">
                            What is Fibreglass Insulation?
                          </Link>
                        </li>
                        <li>
                          <Link href="/resources/articles/what-is-an-energy-audit" className="text-[#0a4768] hover:underline">
                            What is an Energy Audit?
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
