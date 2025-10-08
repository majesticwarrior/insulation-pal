import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle, DollarSign, Wrench, Home, Star, Shield } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'What is Roll and Batt Insulation? | DIY Insulation Guide',
  description: 'Discover the versatility and cost-effectiveness of roll and batt insulation for DIY and professional installations in homes and commercial buildings.',
}

export default function RollAndBattInsulationArticle() {
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
            <span className="text-gray-900">What is Roll and Batt Insulation?</span>
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
              What is Roll and Batt Insulation?
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Discover the versatility and cost-effectiveness of roll and batt insulation for DIY and professional installations in homes and commercial buildings.
            </p>
            
            <div className="aspect-video relative rounded-lg overflow-hidden mb-8">
              <Image
                src="/roll-and-batt-glass-wool-insulation.jpg"
                alt="Roll and batt glass wool insulation installation"
                fill
                className="object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
                  <h2 className="text-2xl font-bold text-[#0a4768] mb-4">What is Roll and Batt Insulation?</h2>
                  <p className="mb-6">
                    Roll and batt insulation consists of flexible fiber materials formed into rolls or pre-cut batts designed to fit between standard framing members. Typically made from fiberglass, mineral wool, or natural fibers, this insulation type is one of the most common and cost-effective options for residential and commercial applications.
                  </p>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Rolls vs. Batts</h3>
                  
                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">Rolls</h4>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Long continuous lengths (up to 50+ feet)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Cut to length on-site for custom fit</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>More economical for large areas</span>
                    </li>
                  </ul>

                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">Batts</h4>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Pre-cut to standard lengths (4', 8' typical)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Easier handling and installation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Less waste for smaller projects</span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Key Benefits</h3>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <DollarSign className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Cost-Effective:</strong> Lowest cost per R-value of most insulation types</span>
                    </li>
                    <li className="flex items-start">
                      <Wrench className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>DIY-Friendly:</strong> Easy to handle and install with basic tools</span>
                    </li>
                    <li className="flex items-start">
                      <Home className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Versatile:</strong> Suitable for walls, attics, floors, and crawl spaces</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Non-Settling:</strong> Maintains thickness and R-value over time</span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Material Types</h3>
                  
                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">Fiberglass</h4>
                  <p className="mb-4">
                    The most common type, made from recycled glass fibers. Available faced or unfaced, with R-values from R-11 to R-38.
                  </p>

                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">Mineral Wool</h4>
                  <p className="mb-4">
                    Made from rock or steel slag, offering better fire resistance and sound dampening than fiberglass.
                  </p>

                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">Natural Fiber</h4>
                  <p className="mb-6">
                    Cotton, sheep's wool, or other natural materials providing eco-friendly alternatives with good performance.
                  </p>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Facing Options</h3>
                  <div className="bg-white p-6 rounded-lg border mb-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-3">Kraft-Faced</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Paper vapor retarder</li>
                          <li>• For interior applications</li>
                          <li>• Tabs for easy stapling</li>
                          <li>• Most common type</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-3">Foil-Faced</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Aluminum foil barrier</li>
                          <li>• Radiant heat reflection</li>
                          <li>• Higher moisture resistance</li>
                          <li>• Commercial applications</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Installation Tips</h3>
                  <ul className="list-disc list-inside mb-6 space-y-2">
                    <li><strong>Proper Fit:</strong> Cut slightly oversized for friction fit, avoid compression</li>
                    <li><strong>Vapor Barrier:</strong> Face toward heated space in cold climates</li>
                    <li><strong>Air Sealing:</strong> Seal gaps with caulk or foam before installing</li>
                    <li><strong>Safety:</strong> Wear protective clothing, gloves, and mask</li>
                    <li><strong>Coverage:</strong> Ensure complete coverage without gaps or voids</li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Performance Characteristics</h3>
                  <div className="bg-white p-6 rounded-lg border mb-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-2">R-Value Range</h4>
                        <p>R-11 to R-38 (varies by thickness)</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-2">Standard Widths</h4>
                        <p>15" and 23" (for 16" and 24" framing)</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-2">Thicknesses</h4>
                        <p>3.5" to 12" common sizes</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-2">Fire Rating</h4>
                        <p>Class A (fiberglass and mineral wool)</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Best Applications</h3>
                  <p className="mb-6">
                    Roll and batt insulation works best in standard framed construction with regular cavity sizes. It's ideal for new construction, basement finishing, attic insulation, and renovation projects where cavities are accessible. The material performs well in walls, floors, and ceilings between joists.
                  </p>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Limitations</h3>
                  <p className="mb-6">
                    While versatile and cost-effective, roll and batt insulation requires proper installation to achieve rated performance. Poor fitting around obstacles, compression, or gaps can significantly reduce effectiveness. It also provides minimal air sealing compared to spray foam options.
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
                          <span className="font-medium">Fiberglass/Mineral</span>
                        </li>
                        <li className="flex justify-between">
                          <span>R-Value:</span>
                          <span className="font-medium">R-11 to R-38</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Installation:</span>
                          <span className="font-medium text-green-600">DIY Friendly</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Cost:</span>
                          <span className="font-medium text-green-600">Lowest</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Availability:</span>
                          <span className="font-medium">Excellent</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#0a4768]">Professional or DIY</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Roll and batt insulation can be installed DIY or by professionals. Get quotes to compare costs and ensure proper installation.
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
                          <Link href="/resources/articles/what-is-blown-in-insulation" className="text-[#0a4768] hover:underline">
                            What is Blown-in Insulation?
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
