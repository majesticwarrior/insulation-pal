import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import { Input } from '@/components/ui/input'
import { CheckCircle, Star, Shield, MapPin, Home, Thermometer, Building } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professional Basement Insulation Services - InsulationPal | Comfortable Living Space',
  description: 'Transform your basement into comfortable, usable space with expert insulation solutions for comfort and energy savings. Get free quotes from certified contractors.',
  keywords: 'basement insulation, basement renovation, foundation insulation, moisture control, basement energy efficiency, basement comfort',
  openGraph: {
    title: 'Professional Basement Insulation Services - Comfortable Living Space',
    description: 'Transform your basement with expert insulation solutions. Create comfortable, energy-efficient living space.',
    type: 'website',
  },
}

export default function BasementInsulationPage() {
  const benefits = [
    {
      icon: Thermometer,
      title: 'Year-Round Comfort',
      description: 'Maintain consistent temperatures and create usable living space.'
    },
    {
      icon: Shield,
      title: 'Moisture Prevention',
      description: 'Prevent condensation and protect against mold and mildew.'
    },
    {
      icon: Building,
      title: 'Increased Home Value',
      description: 'Add functional square footage and improve property value.'
    }
  ]

  const process = [
    {
      step: 1,
      title: 'Foundation Assessment',
      description: 'Complete evaluation of basement conditions and moisture levels.'
    },
    {
      step: 2,
      title: 'Moisture Management',
      description: 'Address any moisture issues before insulation installation.'
    },
    {
      step: 3,
      title: 'Insulation Installation',
      description: 'Professional application of appropriate insulation materials.'
    },
    {
      step: 4,
      title: 'Finishing & Inspection',
      description: 'Final touches and quality assurance inspection.'
    }
  ]

  const features = [
    'Foundation wall insulation',
    'Rim joist insulation',
    'Basement ceiling insulation',
    'Waterproofing integration',
    'Vapor barrier installation',
    'Spray foam applications',
    'Rigid foam boards',
    'Energy code compliance'
  ]

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a4768] mb-6 leading-tight">
                Professional Basement Insulation Services
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Transform your basement into comfortable, usable space with expert 
                insulation solutions for comfort and energy savings.
              </p>

              {/* Quote form */}
              <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-[#0a4768] mb-4">
                  Get Your Free Basement Insulation Quote
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
                <div className="text-2xl font-bold text-[#0a4768]">Starting at $1.45/sq ft</div>
                <div className="text-gray-500 mt-1" style={{fontSize: '12px'}}>Based on material & region</div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl p-8">
                <Image
                  src="/basement-insulation-installed.jpg"
                  alt="Professional basement insulation"
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                  priority
                />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Energy Savings:</span>
                    <span className="font-bold text-[#0a4768]">Up to 20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Installation Time:</span>
                    <span className="font-bold text-[#0a4768]">2-3 Days</span>
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
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0a4768] mb-6">
              Benefits of Basement Insulation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Basement insulation provides comfort, energy efficiency, and adds 
              valuable living space to your home.
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
              Basement Insulation Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional basement insulation requires careful attention to moisture 
              management and proper material selection.
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
                Complete Basement Insulation Solutions
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our certified contractors provide comprehensive basement insulation 
                services for both finished and unfinished basements.
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
                alt="Basement insulation installation process"
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
            Ready to Insulate Your Basement?
          </h2>
          <p className="text-xl text-[#0a4768] mb-8 max-w-2xl mx-auto">
            Connect with experienced basement insulation contractors in your area. 
            Transform your basement into comfortable, usable space.
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