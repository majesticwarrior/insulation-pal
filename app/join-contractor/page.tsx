'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ContractorRegistration } from '@/components/forms/ContractorRegistration'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Star, DollarSign, Users, TrendingUp, Shield } from 'lucide-react'

export default function JoinContractorPage() {

  const benefits = [
    {
      icon: DollarSign,
      title: 'Increase Revenue',
      description: 'Access a steady stream of qualified leads and grow your business revenue by up to 40%.',
      stat: 'Up to 40% Revenue Growth'
    },
    {
      icon: Users,
      title: 'Quality Leads',
      description: 'Connect with serious homeowners who are ready to hire and complete their insulation projects.',
      stat: '95% Lead Quality'
    },
    {
      icon: TrendingUp,
      title: 'Business Growth',
      description: 'Expand your customer base and build your reputation through our trusted platform.',
      stat: '3x More Projects'
    },
    {
      icon: Shield,
      title: 'Trusted Platform',
      description: 'Join a network of verified professionals and benefit from our marketing efforts.',
      stat: '100% Verified Network'
    }
  ]

  const features = [
    'Direct access to homeowner leads',
    'Mobile-friendly contractor dashboard',
    'Automated quote management system',
    'Customer review and rating system',
    'Marketing support and promotion',
    'Flexible pricing and payment terms',
    'Local market territory protection',
    '24/7 customer support'
  ]

  const process = [
    {
      step: 1,
      title: 'Apply Online',
      description: 'Complete our simple application with your business and licensing information.'
    },
    {
      step: 2,
      title: 'Verification Process',
      description: 'We verify your licenses, insurance, and business credentials for platform approval.'
    },
    {
      step: 3,
      title: 'Profile Setup',
      description: 'Create your professional profile with photos, services, and service areas.'
    },
    {
      step: 4,
      title: 'Start Getting Leads',
      description: 'Begin receiving qualified leads and growing your insulation business immediately.'
    }
  ]

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a4768] mb-6 leading-tight">
              Grow Your Insulation Business
            </h1>
            <p className="text-xl text-gray-700 mb-12 leading-relaxed max-w-4xl mx-auto">
              Join InsulationPal's network of trusted contractors and connect with homeowners 
              who need your services. Increase your revenue and expand your customer base.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Why Join InsulationPal Section */}
            <div>
              <h2 className="text-3xl font-bold text-[#0a4768] mb-8 text-center lg:text-left">
                Why Join InsulationPal?
              </h2>
              <div className="grid gap-6">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="bg-[#F5DD22] w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon className="h-6 w-6 text-[#0a4768]" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-[#0a4768] mb-1">{benefit.stat}</div>
                            <h3 className="text-lg font-bold text-[#0a4768] mb-2">{benefit.title}</h3>
                            <p className="text-gray-600 text-sm">{benefit.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Registration Form */}
            <div className="relative">
              <ContractorRegistration />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0a4768] mb-6">
              How to Get Started
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our network in just 4 simple steps and start receiving leads within days.
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
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our platform provides all the tools and support you need to grow your 
                insulation business and serve more customers.
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
              <Card className="shadow-xl">
                <CardContent className="p-8">
                  <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center mb-6">
                    <TrendingUp className="h-24 w-24 text-[#0a4768]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">Contractor Dashboard</h3>
                  <p className="text-gray-600">
                    Manage leads, track projects, and grow your business with our intuitive contractor portal.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#D6D6D6] text-[#0a4768]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-[#0a4768] mb-8 max-w-2xl mx-auto">
            Join thousands of successful contractors who are growing their business 
            with InsulationPal. Start receiving leads today.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
