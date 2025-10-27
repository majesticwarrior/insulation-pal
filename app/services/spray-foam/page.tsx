import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import { Input } from '@/components/ui/input'
import { CheckCircle, Star, Shield, MapPin, ThermometerSun, Wind, Droplet } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Premium Spray Foam Insulation Services - InsulationPal | Maximum Energy Efficiency',
  description: 'Achieve maximum energy efficiency with professional spray foam insulation. Superior R-value and complete air sealing in one application. Connect with certified contractors for free quotes.',
  keywords: 'spray foam insulation, spray foam contractors, closed cell foam, open cell foam, air sealing, energy efficiency, R-value',
  openGraph: {
    title: 'Premium Spray Foam Insulation Services - Maximum Energy Efficiency',
    description: 'Professional spray foam insulation installation by certified contractors. Get superior R-value and complete air sealing in one application.',
    type: 'website',
  },
}

export default function SprayFoamPage() {
  const benefits = [
    {
      icon: ThermometerSun,
      title: 'Superior R-Value',
      description: 'Achieve the highest insulation performance per inch with spray foam technology.'
    },
    {
      icon: Wind,
      title: 'Complete Air Sealing',
      description: 'Eliminate air leaks and drafts with superior air sealing properties.'
    },
    {
      icon: Droplet,
      title: 'Moisture Protection',
      description: 'Built-in vapor barrier prevents moisture issues and mold growth.'
    }
  ]

  const process = [
    {
      step: 1,
      title: 'Site Preparation',
      description: 'Thorough cleaning and preparation of the spray area for optimal application.'
    },
    {
      step: 2,
      title: 'Professional Application',
      description: 'Expert spray foam installation using commercial-grade equipment.'
    },
    {
      step: 3,
      title: 'Curing Process',
      description: 'Allow proper curing time for maximum performance and safety.'
    },
    {
      step: 4,
      title: 'Quality Inspection',
      description: 'Final inspection and cleanup to ensure perfect installation.'
    }
  ]

  const features = [
    'Open-cell spray foam insulation',
    'Closed-cell spray foam application',
    'Complete air sealing services',
    'Moisture barrier installation',
    'R-value optimization',
    'Energy efficiency improvement',
    'Rim joist insulation',
    'Crawl space encapsulation'
  ]

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#0a4768]">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/services" className="text-gray-500 hover:text-[#0a4768]">Services</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900">Spray Foam Insulation</span>
          </nav>
        </div>
      </section>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a4768] mb-6 leading-tight">
                Premium Spray Foam Insulation Services
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Achieve maximum energy efficiency with professional spray foam insulation. 
                Superior R-value and complete air sealing in one application.
              </p>

              {/* Quote form */}
              <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-[#0a4768] mb-4">
                  Get Your Free Spray Foam Quote
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
                  <Button className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold h-12 px-8">
                    Get Free Quote
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  No obligations • Licensed contractors only
                </p>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-[#0a4768]">Starting at $1.00/sq ft</div>
                <div className="text-gray-500 mt-1" style={{fontSize: '12px'}}>Based on material & region</div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl p-8">
                <Image
                  src="/spray-foam-insulation-installed.jpg"
                  alt="Professional spray foam insulation application"
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                  priority
                />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">R-Value Range:</span>
                    <span className="font-bold text-[#0a4768]">R-6 to R-7 per inch</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Application Time:</span>
                    <span className="font-bold text-[#0a4768]">4-6 Hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Warranty:</span>
                    <span className="font-bold text-[#0a4768]">Up to Lifetime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0a4768] mb-6">
              Why Choose Spray Foam Insulation?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Spray foam insulation provides the highest R-value per inch and creates 
              a complete thermal barrier with superior air sealing properties.
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
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0a4768] mb-6">
              Spray Foam Installation Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional spray foam application requires specialized equipment and expertise 
              for optimal performance and safety.
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
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#0a4768] mb-6">
                Complete Spray Foam Solutions
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our certified contractors provide both open-cell and closed-cell spray foam 
                applications tailored to your specific insulation needs and budget.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#0a4768] mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Image
                src="/professional-insulation-contractor-working-on-home.jpg"
                alt="Spray foam insulation application process"
                width={600}
                height={400}
                className="w-full h-96 object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#D6D6D6] text-[#0a4768]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready for Spray Foam Insulation?
          </h2>
          <p className="text-xl text-[#0a4768] mb-8 max-w-2xl mx-auto">
            Connect with certified spray foam contractors in your area. 
            Get the ultimate in energy efficiency and comfort.
          </p>
          <QuoteButton className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-4 text-lg">
            Find Contractors Near Me
          </QuoteButton>
        </div>
      </section>

      <Footer />
    </main>
  )
}
