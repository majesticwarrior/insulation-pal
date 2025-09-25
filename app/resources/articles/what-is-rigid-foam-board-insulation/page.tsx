import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle, Shield, Layers, Droplets, Star } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function RigidFoamBoardInsulationArticle() {
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
            <span className="text-gray-900">What is Rigid Foam Board Insulation?</span>
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
              What is Rigid Foam Board Insulation?
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Learn about rigid foam board insulation for continuous insulation applications, moisture resistance, and high-performance building envelope solutions.
            </p>
            
            <div className="aspect-video relative rounded-lg overflow-hidden mb-8">
              <Image
                src="/rigid-foam-board.jpg"
                alt="Rigid foam board insulation installation"
                fill
                className="object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>

            {/* Why Trust Insulation Pal Accordion */}
            <div className="mb-4">
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
                  <h2 className="text-2xl font-bold text-[#0a4768] mb-4">What is Rigid Foam Board Insulation?</h2>
                  <p className="mb-6">
                    Rigid foam board insulation consists of stiff panels made from various foam materials including polystyrene, polyisocyanurate, and polyurethane. These boards provide continuous insulation, excellent moisture resistance, and high R-values in relatively thin profiles.
                  </p>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Types of Rigid Foam Boards</h3>
                  
                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">Expanded Polystyrene (EPS)</h4>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>R-3.6 to R-4.0 per inch</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Lowest cost option</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Good moisture resistance</span>
                    </li>
                  </ul>

                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">Extruded Polystyrene (XPS)</h4>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>R-5.0 per inch</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Excellent moisture resistance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Higher compressive strength</span>
                    </li>
                  </ul>

                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">Polyisocyanurate (Polyiso)</h4>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>R-6.0 to R-6.5 per inch</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Highest R-value per inch</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Often faced with foil or fiber</span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Key Benefits</h3>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Layers className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Continuous Insulation:</strong> Eliminates thermal bridging through framing</span>
                    </li>
                    <li className="flex items-start">
                      <Droplets className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Moisture Resistance:</strong> Won't absorb water or lose R-value when wet</span>
                    </li>
                    <li className="flex items-start">
                      <Shield className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Dimensional Stability:</strong> Maintains shape and performance over time</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Versatile Application:</strong> Suitable for walls, roofs, and foundations</span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Installation Methods</h3>
                  <p className="mb-4">Rigid foam boards can be installed using various methods:</p>
                  <ul className="list-disc list-inside mb-6 space-y-2">
                    <li><strong>Mechanical Fastening:</strong> Screws with large washers or specialized fasteners</li>
                    <li><strong>Adhesive Application:</strong> Construction adhesive for certain applications</li>
                    <li><strong>Foam Adhesive:</strong> Spray foam to seal joints and attach boards</li>
                    <li><strong>Furring Strips:</strong> Attached through foam to structural elements</li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Best Applications</h3>
                  <div className="bg-white p-6 rounded-lg border mb-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-3">Exterior Applications</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Continuous exterior insulation</li>
                          <li>• Foundation walls</li>
                          <li>• Roof insulation</li>
                          <li>• Below-grade applications</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-3">Interior Applications</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Basement walls</li>
                          <li>• Cathedral ceilings</li>
                          <li>• Radiant floor systems</li>
                          <li>• HVAC ductwork</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Performance Comparison</h3>
                  <div className="bg-white p-6 rounded-lg border mb-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <h4 className="font-semibold text-[#0a4768] mb-2">EPS</h4>
                        <p className="text-2xl font-bold text-green-600">R-4.0</p>
                        <p className="text-sm text-gray-600">per inch</p>
                        <p className="text-sm mt-2">Most economical</p>
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-[#0a4768] mb-2">XPS</h4>
                        <p className="text-2xl font-bold text-blue-600">R-5.0</p>
                        <p className="text-sm text-gray-600">per inch</p>
                        <p className="text-sm mt-2">Best moisture resistance</p>
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-[#0a4768] mb-2">Polyiso</h4>
                        <p className="text-2xl font-bold text-purple-600">R-6.5</p>
                        <p className="text-sm text-gray-600">per inch</p>
                        <p className="text-sm mt-2">Highest R-value</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Installation Considerations</h3>
                  <p className="mb-6">
                    Proper installation requires attention to air sealing, vapor management, and local building codes. Some foam boards may require thermal barriers when used in interior applications. Professional installation ensures optimal performance and code compliance.
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
                          <span className="font-medium">Foam Plastic</span>
                        </li>
                        <li className="flex justify-between">
                          <span>R-Value:</span>
                          <span className="font-medium">R-4.0-6.5/inch</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Installation:</span>
                          <span className="font-medium">Professional</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Moisture:</span>
                          <span className="font-medium text-green-600">Resistant</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Thermal Bridge:</span>
                          <span className="font-medium text-green-600">Eliminates</span>
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
                        Get rigid foam board insulation professionally installed for optimal continuous insulation performance.
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
