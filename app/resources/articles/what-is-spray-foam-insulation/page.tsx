import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle, Shield, Thermometer, Wind, Star } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function SprayFoamInsulationArticle() {
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
            <span className="text-gray-900">What is Spray Foam Insulation?</span>
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
                Materials
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-[#0a4768] mb-6">
              What is Spray Foam Insulation?
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Explore the superior air sealing properties of spray foam insulation and discover why it's considered the premium choice for maximum energy efficiency and moisture control.
            </p>
            
            <div className="aspect-video relative rounded-lg overflow-hidden mb-8">
              <Image
                src="/spray-foam-insulation-installed.jpg"
                alt="Spray foam insulation being applied"
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
                  <h2 className="text-2xl font-bold text-[#0a4768] mb-4">What is Spray Foam Insulation?</h2>
                  <p className="mb-6">
                    Spray foam insulation is a chemical mixture that expands and hardens upon application, creating an airtight barrier that provides both insulation and air sealing in one product. Available in open-cell and closed-cell formulations, spray foam offers superior performance compared to traditional insulation materials.
                  </p>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Types of Spray Foam</h3>
                  
                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">Open-Cell Spray Foam</h4>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>R-3.5 to R-3.7 per inch</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>More flexible and cost-effective</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Allows moisture vapor to pass through</span>
                    </li>
                  </ul>

                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">Closed-Cell Spray Foam</h4>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>R-6.0 to R-7.0 per inch</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Acts as vapor barrier and structural reinforcement</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Higher density and superior moisture resistance</span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Key Benefits</h3>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Wind className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Superior Air Sealing:</strong> Eliminates air leaks and drafts completely</span>
                    </li>
                    <li className="flex items-start">
                      <Thermometer className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Highest R-Value:</strong> Best thermal performance per inch</span>
                    </li>
                    <li className="flex items-start">
                      <Shield className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Moisture Control:</strong> Prevents condensation and mold growth</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Structural Support:</strong> Adds rigidity to building structure</span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Installation Process</h3>
                  <p className="mb-4">
                    Spray foam insulation requires professional installation using specialized equipment. The process involves:
                  </p>
                  <ol className="list-decimal list-inside mb-6 space-y-2">
                    <li>Surface preparation and area protection</li>
                    <li>Mixing of two chemical components</li>
                    <li>Application using spray equipment</li>
                    <li>Expansion and curing (15-30 seconds)</li>
                    <li>Trimming excess foam if necessary</li>
                  </ol>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Best Applications</h3>
                  <div className="bg-white p-6 rounded-lg border mb-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-3">Open-Cell Applications</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Interior walls</li>
                          <li>• Attics (under roof deck)</li>
                          <li>• Sound dampening</li>
                          <li>• Irregular cavities</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-3">Closed-Cell Applications</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Exterior walls</li>
                          <li>• Basements and crawl spaces</li>
                          <li>• Roof applications</li>
                          <li>• Areas requiring vapor barriers</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Cost Considerations</h3>
                  <p className="mb-6">
                    While spray foam has a higher upfront cost compared to traditional insulation, the long-term energy savings and superior performance often justify the investment. Closed-cell foam typically costs more than open-cell but provides higher R-values and additional benefits.
                  </p>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Safety and Environmental Considerations</h3>
                  <p className="mb-6">
                    Modern spray foam formulations are safe when properly installed by certified professionals. The curing process requires proper ventilation, and the area should be vacated during application. Once cured, spray foam is inert and safe for occupancy.
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
                          <span>Material:</span>
                          <span className="font-medium">Polyurethane</span>
                        </li>
                        <li className="flex justify-between">
                          <span>R-Value:</span>
                          <span className="font-medium">R-3.5-7.0/inch</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Installation:</span>
                          <span className="font-medium">Professional Only</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Lifespan:</span>
                          <span className="font-medium">Lifetime</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Air Sealing:</span>
                          <span className="font-medium text-green-600">Excellent</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#0a4768]">Professional Installation Required</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Spray foam insulation requires certified professionals with specialized equipment for safe and effective installation.
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
                          <Link href="/resources/articles/what-is-fibreglass-insulation" className="text-[#0a4768] hover:underline">
                            What is Fibreglass Insulation?
                          </Link>
                        </li>
                        <li>
                          <Link href="/resources/articles/what-is-rigid-foam-board-insulation" className="text-[#0a4768] hover:underline">
                            What is Rigid Foam Board?
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
