import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import { Input } from '@/components/ui/input'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { CheckCircle, Star, Shield, MapPin, Home, Droplet, Wind } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Expert Crawl Space Insulation Services - InsulationPal',
  description: 'Protect your crawl space from moisture and temperature extremes with professional insulation and encapsulation services.',
}

export default function CrawlSpacePage() {
  const benefits = [
    {
      icon: Droplet,
      title: 'Moisture Control',
      description: 'Prevent moisture issues and protect your home from water damage and mold.'
    },
    {
      icon: Wind,
      title: 'Eliminate Drafts',
      description: 'Stop cold air infiltration and improve overall home comfort.'
    },
    {
      icon: Home,
      title: 'Foundation Protection',
      description: 'Protect your foundation and improve structural integrity.'
    }
  ]

  const process = [
    {
      step: 1,
      title: 'Moisture Assessment',
      description: 'Comprehensive evaluation of moisture levels and existing conditions.'
    },
    {
      step: 2,
      title: 'Vapor Barrier Installation',
      description: 'Install high-quality vapor barriers to prevent moisture infiltration.'
    },
    {
      step: 3,
      title: 'Insulation Application',
      description: 'Professional insulation installation for optimal thermal performance.'
    },
    {
      step: 4,
      title: 'Encapsulation Completion',
      description: 'Final sealing and inspection to ensure complete protection.'
    }
  ]

  const features = [
    'Vapor barrier installation',
    'Floor joist insulation',
    'Crawl space encapsulation',
    'Moisture control systems',
    'Rim joist sealing',
    'Vent sealing services',
    'Dehumidification solutions',
    'Pest control integration'
  ]

  return (
    <main className="min-h-screen">
      <Header />
      
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Crawl Space Insulation' }
      ]} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a4768] mb-6 leading-tight">
                Expert Crawl Space Insulation Services
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Protect your crawl space from moisture and temperature extremes with 
                professional insulation and encapsulation services.
              </p>

              {/* Quote form */}
              <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-[#0a4768] mb-4">
                  Get Your Free Crawl Space Quote
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
                <div className="text-2xl font-bold text-[#0a4768]">Starting at $.30/board ft</div>
                <div className="text-gray-500 mt-1" style={{fontSize: '12px'}}>Based on material & region</div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl p-8">
                <Image
                  src="/crawl-space-insulation-installed.jpg"
                  alt="Professional crawl space insulation"
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                  priority
                />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Moisture Prevention:</span>
                    <span className="font-bold text-[#0a4768]">100% Protection</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Installation Time:</span>
                    <span className="font-bold text-[#0a4768]">1-3 Days</span>
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
              Benefits of Crawl Space Insulation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Crawl space insulation and encapsulation provide essential moisture control 
              and energy efficiency improvements for your home.
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
              Crawl Space Encapsulation Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional crawl space treatment requires systematic approach for 
              optimal moisture control and energy efficiency.
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
                Complete Crawl Space Solutions
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our certified contractors provide comprehensive crawl space insulation 
                and encapsulation services to protect your home from moisture and energy loss.
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
                alt="Crawl space insulation installation process"
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
            Ready to Insulate Your Crawl Space?
          </h2>
          <p className="text-xl text-[#0a4768] mb-8 max-w-2xl mx-auto">
            Connect with experienced crawl space contractors in your area. 
            Protect your home from moisture and improve energy efficiency.
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

