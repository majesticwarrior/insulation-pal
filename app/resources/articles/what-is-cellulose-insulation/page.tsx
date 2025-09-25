import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle, Leaf, Recycle, Shield, Star } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function CelluloseInsulationArticle() {
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
            <span className="text-gray-900">What is Cellulose Insulation?</span>
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
              What is Cellulose Insulation?
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Discover the eco-friendly benefits of cellulose insulation made from recycled paper products and learn why it's becoming a popular choice for environmentally conscious homeowners.
            </p>
            
            <div className="aspect-video relative rounded-lg overflow-hidden mb-8">
              <Image
                src="/cellulose-wall-insulation-installed.jpg"
                alt="Cellulose wall insulation installation"
                fill
                className="object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>

            {/* Why Trust Insulation Pal Accordion */}
            <div className="mb-8">
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
                  <h2 className="text-2xl font-bold text-[#0a4768] mb-4">What is Cellulose Insulation?</h2>
                  <p className="mb-6">
                    Cellulose insulation is an eco-friendly insulation material made primarily from recycled newspaper and other paper products. Treated with fire-retardant chemicals, cellulose insulation provides excellent thermal performance while being one of the most environmentally sustainable insulation options available.
                  </p>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Key Benefits of Cellulose Insulation</h3>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Leaf className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Environmentally Friendly:</strong> Made from 75-85% recycled paper content</span>
                    </li>
                    <li className="flex items-start">
                      <Shield className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Fire Resistant:</strong> Treated with borates for fire and pest resistance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Superior Air Sealing:</strong> Conforms to irregular spaces better than rigid materials</span>
                    </li>
                    <li className="flex items-start">
                      <Recycle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Cost-Effective:</strong> Often less expensive than other insulation types</span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">How Cellulose Insulation is Made</h3>
                  <p className="mb-6">
                    Cellulose insulation is manufactured by grinding recycled paper into small particles and treating them with borate-based chemicals. These chemicals provide fire retardancy, mold resistance, and pest deterrence. The result is a loose-fill insulation material that can be blown into attics, walls, and other cavities.
                  </p>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Installation Methods</h3>
                  <p className="mb-4">Cellulose insulation can be installed using several methods:</p>
                  <ul className="list-disc list-inside mb-6 space-y-2">
                    <li><strong>Dry Blown:</strong> The most common method for attics and enclosed walls</li>
                    <li><strong>Dense Pack:</strong> Higher density installation for walls and floors</li>
                    <li><strong>Wet Spray:</strong> Mixed with water for new construction applications</li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Performance Characteristics</h3>
                  <div className="bg-white p-6 rounded-lg border mb-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-2">R-Value</h4>
                        <p>R-3.2 to R-3.8 per inch</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-2">Density</h4>
                        <p>1.5-3.5 lbs per cubic foot</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-2">Settling</h4>
                        <p>Minimal when properly installed</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-2">Lifespan</h4>
                        <p>50+ years with proper installation</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Best Applications</h3>
                  <p className="mb-6">
                    Cellulose insulation works best in attics, enclosed wall cavities, and floors. It's particularly effective in retrofitting older homes where access to wall cavities is limited. The material's ability to conform to irregular shapes makes it ideal for areas with wiring, plumbing, or other obstructions.
                  </p>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Considerations</h3>
                  <p className="mb-6">
                    While cellulose is an excellent insulation choice, proper installation is crucial. The material can settle over time if not installed at the correct density, and moisture exposure should be avoided. Professional installation ensures optimal performance and longevity.
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
                          <span className="font-medium">Recycled Paper</span>
                        </li>
                        <li className="flex justify-between">
                          <span>R-Value:</span>
                          <span className="font-medium">R-3.2-3.8/inch</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Installation:</span>
                          <span className="font-medium">Blown-in</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Lifespan:</span>
                          <span className="font-medium">50+ years</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Eco-Friendly:</span>
                          <span className="font-medium text-green-600">Yes</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#0a4768]">Get Professional Installation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Ready to upgrade your home with cellulose insulation? Connect with certified contractors in your area.
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
