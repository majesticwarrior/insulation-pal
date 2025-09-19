import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, Building, Wind, Snowflake, Flame, Wrench, CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professional Insulation Services - InsulationPal',
  description: 'From attic insulation to spray foam applications, our network of certified contractors provides comprehensive insulation solutions for every need and budget.',
}

export default function ServicesPage() {
  const services = [
    {
      icon: Home,
      title: 'Attic Insulation',
      description: 'Professional attic insulation installation and replacement to reduce energy costs and improve comfort.',
      features: ['Blown-in insulation', 'Batt insulation', 'Radiant barriers', 'Air sealing'],
      price: 'Starting at $1.00/sq ft',
      benefits: ['Up to 30% energy savings', 'Improved comfort', 'Noise reduction'],
      image: '/attic-insulation-blown-in.jpg',
      url: '/services/attic-insulation'
    },
    {
      icon: Building,
      title: 'Wall Insulation',
      description: 'Complete wall insulation services for new construction and retrofits to help reduce energy costs and improve comfort.',
      features: ['Injection foam', 'Blown-in cellulose', 'Fiberglass batts', 'Vapor barriers'],
      price: 'Starting at $1.00/sq ft',
      benefits: ['Better temperature control', 'Reduced drafts', 'Lower utility bills'],
      image: '/contractor-installing-wall-insulation.jpg',
      url: '/services/wall-insulation'
    },
    {
      icon: Wind,
      title: 'Spray Foam Insulation',
      description: 'Premium spray foam insulation for maximum energy efficiency and air sealing.',
      features: ['Open-cell spray foam', 'Closed-cell spray foam', 'Complete air sealing', 'Moisture barrier'],
      price: 'Starting at $1.00/sq ft',
      benefits: ['Superior R-value', 'Air & moisture seal', 'Long-lasting performance'],
      image: '/spray-foam-insulation-installed.jpg',
      url: '/services/spray-foam'
    },
    {
      icon: Snowflake,
      title: 'Crawl Space Insulation',
      description: 'Protect your crawl space from moisture and temperature extremes.',
      features: ['Vapor barriers', 'Floor joist insulation', 'Crawl space encapsulation', 'Moisture control'],
      price: 'Starting at $.30/board ft',
      benefits: ['Prevent moisture issues', 'Warmer floors', 'Improved indoor air quality'],
      image: '/crawl-space-insulation-installed.jpg',
      url: '/services/crawl-space'
    },
    {
      icon: Flame,
      title: 'Basement Insulation',
      description: 'Complete basement insulation solutions for comfort and energy savings.',
      features: ['Foundation walls', 'Rim joists', 'Ceiling insulation', 'Waterproofing'],
      price: 'Starting at $1.45/sq ft',
      benefits: ['Year-round comfort', 'Prevent condensation', 'Additional living space'],
      image: '/basement-insulation-installed.jpg',
      url: '/services/basement-insulation'
    },
    {
      icon: Wrench,
      title: 'Insulation Removal',
      description: 'Safe removal of old, damaged, or contaminated insulation.',
      features: ['Old insulation removal', 'Contaminated material cleanup', 'Pest damage cleanup', 'Safe disposal'],
      price: 'Starting at $1.00/sq ft',
      benefits: ['Clean slate for new insulation', 'Remove health hazards', 'Pest remediation'],
      image: '/insulation-removal.jpg',
      url: '/services/insulation-removal'
    }
  ]

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-[#0a4768] mb-6">
              Professional Insulation Services
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              From attic insulation to spray foam applications, our network of certified contractors 
              provides comprehensive insulation solutions for every need and budget.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center bg-white rounded-lg px-6 py-3 shadow-md">
                <Star className="h-5 w-5 text-[#F5DD22] mr-2" />
                <span className="font-semibold text-[#0a4768]">Highly Rated</span>
              </div>
              <div className="flex items-center bg-white rounded-lg px-6 py-3 shadow-md">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="font-semibold text-[#0a4768]">Licensed & Insured</span>
              </div>
              <div className="flex items-center bg-white rounded-lg px-6 py-3 shadow-md">
                <Home className="h-5 w-5 text-[#0a4768] mr-2" />
                <span className="font-semibold text-[#0a4768]">1,000's of Projects</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Card key={index} className="overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-[300px] object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-[#F5DD22] rounded-full p-3">
                      <Icon className="h-8 w-8 text-[#0a4768]" />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#0a4768]">{service.title}</CardTitle>
                    <p className="text-gray-600">{service.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h4 className="font-semibold text-[#0a4768] mb-3">What's Included:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-[#0a4768] mb-3">Benefits:</h4>
                      <div className="space-y-2">
                        {service.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-center text-sm text-gray-600">
                            <Star className="h-4 w-4 text-[#F5DD22] mr-2 flex-shrink-0" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-[#0a4768]">{service.price}</div>
                      <div className="flex gap-3">
                        <Link href={service.url}>
                          <Button variant="outline" className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white">
                            Learn More
                          </Button>
                        </Link>
                        <Button className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold">
                          Get Free Quote
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#D6D6D6] text-[#0a4768]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Insulation Project?
          </h2>
          <p className="text-xl text-[#0a4768] mb-8 max-w-2xl mx-auto">
            Get connected with top-rated insulation contractors in your area. 
            Compare quotes and choose the best option for your home.
          </p>
          <Button className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-4 text-lg">
            Get Started Today
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}