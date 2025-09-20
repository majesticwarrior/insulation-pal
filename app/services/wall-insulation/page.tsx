import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle, Star, Shield, MapPin, Home, Wind, Thermometer } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Expert Wall Insulation Services - InsulationPal',
  description: 'Improve your home\'s energy efficiency with professional wall insulation. Get free quotes from certified contractors in your area.',
}

export default function WallInsulationPage() {
  const benefits = [
    {
      icon: Thermometer,
      title: 'Better Temperature Control',
      description: 'Maintain consistent indoor temperatures year-round with quality wall insulation.'
    },
    {
      icon: Wind,
      title: 'Reduced Air Drafts',
      description: 'Eliminate cold drafts and air leaks for improved comfort and efficiency.'
    },
    {
      icon: Shield,
      title: 'Lower Utility Bills',
      description: 'Reduce heating and cooling costs by up to 25% with proper wall insulation.'
    }
  ]

  const process = [
    {
      step: 1,
      title: 'Wall Assessment',
      description: 'Thorough inspection of existing wall insulation and identification of problem areas.'
    },
    {
      step: 2,
      title: 'Insulation Selection',
      description: 'Choose the right insulation type based on wall construction and local climate.'
    },
    {
      step: 3,
      title: 'Professional Installation',
      description: 'Expert installation with minimal disruption to your daily routine.'
    },
    {
      step: 4,
      title: 'Final Inspection',
      description: 'Quality check and cleanup to ensure optimal performance and satisfaction.'
    }
  ]

  const features = [
    'Injection foam insulation',
    'Blown-in cellulose installation',
    'Fiberglass batt insulation',
    'Vapor barrier installation',
    'Retrofit wall insulation',
    'New construction insulation',
    'Cavity wall insulation',
    'Thermal bridge prevention'
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
                Expert Wall Insulation Services
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Improve your home's energy efficiency with professional wall insulation. 
                Get free quotes from certified contractors in your area.
              </p>

              {/* Quote form */}
              <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-[#0a4768] mb-4">
                  Get Your Free Wall Insulation Quote
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
                  src="/contractor-installing-wall-insulation.jpg"
                  alt="Professional wall insulation installation"
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                  priority
                />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Energy Savings:</span>
                    <span className="font-bold text-[#0a4768]">Up to 25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Installation Time:</span>
                    <span className="font-bold text-[#0a4768]">1-2 Days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">R-Value Range:</span>
                    <span className="font-bold text-[#0a4768]">R-11 to R-21</span>
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
              Benefits of Wall Insulation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Wall insulation significantly improves your home's thermal performance, 
              creating a more comfortable living environment while reducing energy costs.
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
              Wall Insulation Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our systematic approach ensures proper installation with minimal disruption to your home.
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
                Comprehensive Wall Insulation Solutions
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Whether you're building new or retrofitting existing walls, our contractors 
                provide the right insulation solution for your specific needs.
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
                alt="Wall insulation installation process"
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
            Ready to Insulate Your Walls?
          </h2>
          <p className="text-xl text-[#0a4768] mb-8 max-w-2xl mx-auto">
            Connect with experienced wall insulation contractors in your area. 
            Get competitive quotes and improve your home's comfort today.
          </p>
          <Button className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-4 text-lg">
            Find Contractors Near Me
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
