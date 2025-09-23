import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import { Input } from '@/components/ui/input'
import { CheckCircle, Star, Shield, MapPin, ThermometerSun, Snowflake, Wrench } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professional Attic Insulation Services - InsulationPal | Save 30% on Energy Bills',
  description: 'Save up to 30% on energy bills with expert attic insulation installation. Connect with licensed contractors in your area for free quotes on blown-in, batt, and spray foam insulation.',
  keywords: 'attic insulation, blown-in insulation, attic insulation cost, energy savings, insulation contractors, attic insulation installation',
  openGraph: {
    title: 'Professional Attic Insulation Services - Save 30% on Energy Bills',
    description: 'Expert attic insulation installation by licensed contractors. Get free quotes for blown-in, batt, and spray foam insulation.',
    type: 'website',
  },
}

export default function AtticInsulationPage() {
  const benefits = [
    {
      icon: ThermometerSun,
      title: 'Up to 30% Energy Savings',
      description: 'Reduce your heating and cooling costs significantly with proper attic insulation.'
    },
    {
      icon: Shield,
      title: 'Year-Round Comfort',
      description: 'Maintain consistent temperatures throughout your home in all seasons.'
    },
    {
      icon: Snowflake,
      title: 'Noise Reduction',
      description: 'Block outside noise and create a quieter indoor environment.'
    }
  ]

  const process = [
    {
      step: 1,
      title: 'Free Assessment',
      description: 'Our certified contractor inspects your attic and provides a detailed evaluation.'
    },
    {
      step: 2,
      title: 'Custom Solution',
      description: 'We recommend the best insulation type and R-value for your specific needs.'
    },
    {
      step: 3,
      title: 'Professional Installation',
      description: 'Expert installation using industry-leading materials and techniques.'
    },
    {
      step: 4,
      title: 'Quality Assurance',
      description: 'Final inspection and warranty coverage for your peace of mind.'
    }
  ]

  const features = [
    'Blown-in cellulose insulation',
    'Fiberglass batt installation',
    'Radiant barrier installation',
    'Air sealing services',
    'Vapor barrier installation',
    'Attic ventilation improvement',
    'R-value optimization',
    'Energy efficiency consultation'
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
                Professional Attic Insulation Services
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Save up to 30% on energy bills with expert attic insulation installation. 
                Connect with licensed contractors in your area for free quotes.
              </p>

              {/* Quote form */}
              <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-[#0a4768] mb-4">
                  Get Your Free Attic Insulation Quote
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
                <div className="text-2xl font-bold text-[#0a4768]">Starting at $1.00/sq ft</div>
                <div className="text-gray-500 mt-1" style={{fontSize: '12px'}}>Based on material & region</div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl p-8">
                <Image
                  src="/attic-insulation-blown-in.jpg"
                  alt="Professional attic insulation installation"
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                  priority
                />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Savings:</span>
                    <span className="font-bold text-[#0a4768]">$400-800/year</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Installation Time:</span>
                    <span className="font-bold text-[#0a4768]">4-8 Hours</span>
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
              Why Choose Attic Insulation?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Attic insulation is one of the most cost-effective home improvements, 
              providing immediate and long-term benefits for your comfort and wallet.
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
              Our Installation Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From assessment to completion, we ensure a seamless experience with quality results.
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
                Complete Attic Insulation Services
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our certified contractors provide comprehensive attic insulation solutions 
                tailored to your home's specific needs and local climate conditions.
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
                alt="Attic insulation installation process"
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
            Ready to Insulate Your Attic?
          </h2>
          <p className="text-xl text-[#0a4768] mb-8 max-w-2xl mx-auto">
            Get connected with top-rated attic insulation contractors in your area. 
            Compare quotes and start saving on energy costs today.
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
