import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle, Shield, Volume2, Flame } from 'lucide-react'

export default function MineralWoolInsulationArticle() {
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
            <span className="text-gray-900">What is Mineral Wool Insulation?</span>
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
              What is Mineral Wool Insulation?
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Understanding mineral wool insulation's fire resistance, soundproofing qualities, and thermal performance for superior home protection and comfort.
            </p>
            
            <div className="aspect-video relative rounded-lg overflow-hidden mb-8">
              <Image
                src="/mineral-wool-insulation.jpg"
                alt="Mineral wool insulation installation"
                fill
                className="object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
                  <h2 className="text-2xl font-bold text-[#0a4768] mb-4">What is Mineral Wool Insulation?</h2>
                  <p className="mb-6">
                    Mineral wool insulation, also known as rock wool or stone wool, is made from natural rock and recycled steel slag that is melted and spun into fibers. This creates a dense, fire-resistant insulation material that excels in thermal performance, fire protection, and sound dampening.
                  </p>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Key Benefits of Mineral Wool</h3>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Flame className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Fire Resistance:</strong> Withstands temperatures up to 2000°F without melting</span>
                    </li>
                    <li className="flex items-start">
                      <Volume2 className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Sound Dampening:</strong> Excellent acoustic insulation properties</span>
                    </li>
                    <li className="flex items-start">
                      <Shield className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Moisture Resistant:</strong> Doesn't absorb water or promote mold growth</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Dimensional Stability:</strong> Won't settle, sag, or compress over time</span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Types of Mineral Wool</h3>
                  
                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">Batts and Boards</h4>
                  <p className="mb-4">
                    Semi-rigid boards and flexible batts that fit between framing members. Available in various thicknesses and densities for different applications.
                  </p>

                  <h4 className="text-lg font-semibold text-[#0a4768] mb-3">Loose-Fill</h4>
                  <p className="mb-6">
                    Blown-in mineral wool that can be installed in attics and hard-to-reach areas, providing excellent coverage around obstacles.
                  </p>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Performance Characteristics</h3>
                  <div className="bg-white p-6 rounded-lg border mb-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-2">R-Value</h4>
                        <p>R-3.0 to R-3.3 per inch</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-2">Fire Rating</h4>
                        <p>Non-combustible, Class A</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-2">Density</h4>
                        <p>1.7-8.0 lbs per cubic foot</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768] mb-2">Sound Rating</h4>
                        <p>NRC 0.85-1.05</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Installation Methods</h3>
                  <p className="mb-4">Mineral wool can be installed using several methods:</p>
                  <ul className="list-disc list-inside mb-6 space-y-2">
                    <li><strong>Friction Fit:</strong> Batts are cut slightly oversized and friction-fit between studs</li>
                    <li><strong>Mechanical Fastening:</strong> Boards can be mechanically attached to surfaces</li>
                    <li><strong>Blown Installation:</strong> Loose-fill material blown into cavities</li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Best Applications</h3>
                  <p className="mb-4">Mineral wool excels in applications where fire resistance and sound control are priorities:</p>
                  <ul className="list-disc list-inside mb-6 space-y-2">
                    <li>Exterior walls in fire-prone areas</li>
                    <li>Party walls between units for sound isolation</li>
                    <li>Basement walls and foundations</li>
                    <li>Attics and roof assemblies</li>
                    <li>Commercial and industrial buildings</li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Considerations</h3>
                  <p className="mb-6">
                    While mineral wool offers excellent performance, it is typically more expensive than fiberglass. The material can be irritating to skin and requires proper protective equipment during installation. However, its superior fire resistance and acoustic properties often justify the additional cost in appropriate applications.
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
                          <span className="font-medium">Rock/Steel Slag</span>
                        </li>
                        <li className="flex justify-between">
                          <span>R-Value:</span>
                          <span className="font-medium">R-3.0-3.3/inch</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Fire Rating:</span>
                          <span className="font-medium text-red-600">Class A</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Water Resistance:</span>
                          <span className="font-medium text-green-600">Excellent</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Sound Control:</span>
                          <span className="font-medium text-green-600">Superior</span>
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
                        Get mineral wool insulation installed by certified professionals for optimal fire protection and sound control.
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
                          <Link href="/resources/articles/what-is-spray-foam-insulation" className="text-[#0a4768] hover:underline">
                            What is Spray Foam Insulation?
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
