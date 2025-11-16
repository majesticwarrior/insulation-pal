import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import { Input } from '@/components/ui/input'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { CheckCircle, Star, Shield, MapPin, ThermometerSun, Snowflake, Car, Wrench } from 'lucide-react'
import type { Metadata } from 'next'
import { createServiceSchemas } from '@/lib/service-schema'

export const metadata: Metadata = {
  title: 'Professional Garage Insulation Services, Transform Your Space - InsulationPal',
  description: 'Transform your garage into a comfortable, energy-efficient space with expert garage insulation installation. Connect with licensed contractors in our network for free quotes on wall, ceiling, and door insulation.',
  keywords: 'garage insulation, garage wall insulation, garage door insulation, garage insulation contractors, garage conversion, energy efficient garage',
  openGraph: {
    title: 'Professional Garage Insulation Services - Transform Your Space',
    description: 'Expert garage insulation installation by licensed contractors. Get free quotes for wall, ceiling, and door insulation to improve comfort and energy efficiency.',
    type: 'website',
  },
}

export default function GarageInsulationPage() {
  const schemas = createServiceSchemas('Garage Insulation', '/services/garage-insulation')

  const benefits = [
    {
      icon: ThermometerSun,
      title: 'Protect Living Spaces',
      description: 'Prevent cold air infiltration from uninsulated garages into adjacent living areas, reducing heating costs significantly.'
    },
    {
      icon: Shield,
      title: 'Protect Stored Items',
      description: 'Maintain stable temperatures to protect vehicles, tools, and stored items from extreme temperature damage.'
    },
    {
      icon: Snowflake,
      title: 'Prevent Freezing',
      description: 'Keep water heaters, HVAC equipment, and plumbing safe from freezing during cold winter months.'
    }
  ]

  const process = [
    {
      step: 1,
      title: 'Free Assessment',
      description: 'Our certified contractors inspect your garage, identify thermal weak points, and assess insulation needs.'
    },
    {
      step: 2,
      title: 'Custom Solution',
      description: 'We recommend the best insulation approach for walls, ceiling, and garage door based on your specific setup.'
    },
    {
      step: 3,
      title: 'Professional Installation',
      description: 'Expert installation by licensed contractors using quality materials and proven techniques.'
    },
    {
      step: 4,
      title: 'Quality Assurance',
      description: 'Final inspection ensures proper installation and sealing for maximum energy efficiency and comfort.'
    }
  ]

  const features = [
    'Wall insulation (batts or spray foam)',
    'Ceiling insulation for rooms above',
    'Garage door insulation kits',
    'Rim joist air sealing',
    'Vapor barrier installation',
    'Weather stripping installation',
    'Air sealing services',
    'Fire-rated insulation options'
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.service) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.brand) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }} />
      <main className="min-h-screen">
      <Header />
      
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Garage Insulation' }
      ]} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-20">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a4768] mb-6 leading-tight">
                Professional Garage Insulation Services
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Transform your garage into a comfortable, energy-efficient space. Our network of licensed 
                contractors provides expert garage insulation to protect your home and belongings.
              </p>

              {/* Quote form */}
              <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-[#0a4768] mb-4">
                  Get Your Free Garage Insulation Quote
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Enter Your Address"
                      className="pl-10 h-12"
                      aria-label="Enter Your Address"
                    />
                  </div>
                  <QuoteButton className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold h-12 px-8">
                    Get Free Quote
                  </QuoteButton>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  No obligations • Licensed contractors only
                </p>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-[#0a4768]">Starting at $1.50/sq ft</div>
                <div className="text-gray-500 mt-1" style={{fontSize: '12px'}}>Based on material & region</div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl p-8">
                <Image
                  src="/garage-wall-ceiling-attic-door-panel-insulation.jpg"
                  alt="Professional garage insulation installation"
                  width={600}
                  height={500}
                  className="w-full h-96 object-cover rounded-lg mb-6"
                  priority
                />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Savings:</span>
                    <span className="font-bold text-[#0a4768]">$200-500/year</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Installation Time:</span>
                    <span className="font-bold text-[#0a4768]">1-2 Days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Warranty:</span>
                    <span className="font-bold text-[#0a4768]">Up to 25 Years</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0a4768] mb-6">
              Why Insulate Your Garage?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Attached garages are one of the biggest sources of energy loss in homes. Our contractors 
              understand that insulating your garage protects both your living spaces and your valuable belongings.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="bg-[#F5DD22] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-[#0a4768]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0a4768] mb-4">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-[#D8E1FF]">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0a4768] mb-6">
              Our Installation Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From assessment to completion, our contractors ensure a seamless experience with quality 
              results that protect your home and improve energy efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-[#F5DD22] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#0a4768]">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold text-[#0a4768] mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-4xl font-bold text-[#0a4768] mb-6">
                Complete Garage Insulation Services
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our network of certified contractors provides comprehensive garage insulation solutions. 
                We focus on the areas that matter most: walls shared with living spaces, ceilings under 
                rooms, and garage doors that represent the largest surface area.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#0a4768] mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#0a4768]">Garage Door Insulation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Garage doors represent the largest uninsulated surface in most garages. Our contractors 
                      can install insulation kits or recommend insulated door replacements to significantly 
                      improve energy efficiency.
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#0a4768] mr-2 mt-0.5 flex-shrink-0" />
                        <span>Rigid foam panel installation (R-8 to R-18)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#0a4768] mr-2 mt-0.5 flex-shrink-0" />
                        <span>Reflective barrier systems</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#0a4768] mr-2 mt-0.5 flex-shrink-0" />
                        <span>Weather stripping upgrades</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#0a4768]">Walls & Ceiling Priority</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Our contractors prioritize walls shared with living spaces and ceilings under rooms—these 
                      provide the greatest energy benefit and protect your home from temperature extremes.
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#0a4768] mr-2 mt-0.5 flex-shrink-0" />
                        <span>Walls: R-13 to R-21 minimum</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#0a4768] mr-2 mt-0.5 flex-shrink-0" />
                        <span>Ceiling: R-30 to R-38 if room above</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#0a4768] mr-2 mt-0.5 flex-shrink-0" />
                        <span>Rim joist air sealing included</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/professional-insulation-contractor-working-on-home.jpg"
                alt="Garage insulation installation process"
                width={600}
                height={400}
                className="w-full h-96 object-cover rounded-lg shadow-xl mb-6"
              />
              <div className="p-6 bg-[#D8E1FF] rounded-lg">
                <h3 className="text-xl font-bold text-[#0a4768] mb-4">Professional Contractor Network</h3>
                <p className="text-gray-700 mb-4">
                  Our contractors are licensed, insured, and experienced in garage insulation. They understand 
                  building codes, fire safety requirements, and proper installation techniques for maximum 
                  energy efficiency and comfort.
                </p>
                <p className="text-gray-700">
                  Whether you're looking to protect your home from energy loss, create a comfortable workshop 
                  space, or prevent freezing during winter months, our contractors have the expertise to get 
                  the job done right.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#D6D6D6] text-[#0a4768]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Insulate Your Garage?
          </h2>
          <p className="text-xl text-[#0a4768] mb-8 max-w-2xl mx-auto">
            Get connected with top-rated garage insulation contractors in your area. 
            Compare quotes and start protecting your home and belongings today.
          </p>
          <QuoteButton className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-4 text-lg">
            Find Contractors Near Me
          </QuoteButton>
        </div>
      </section>

      <Footer />
    </main>
    </>
  )
}

