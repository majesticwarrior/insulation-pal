'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, Star, DollarSign, Users, TrendingUp, Shield } from 'lucide-react'

export default function JoinContractorPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    rocNumber: '',
    password: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Contractor signup:', formData)
    // Handle form submission
  }

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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a4768] mb-6 leading-tight">
                Grow Your Insulation Business
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Join InsulationPal's network of trusted contractors and connect with homeowners 
                who need your services. Increase your revenue and expand your customer base.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0a4768]">50K+</div>
                  <div className="text-gray-600">Active Homeowners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0a4768]">$2.5M+</div>
                  <div className="text-gray-600">Monthly Project Value</div>
                </div>
              </div>

              <Button className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3 text-lg">
                Join Our Network Today
              </Button>
            </div>

            {/* Signup Form */}
            <div className="relative">
              <Card className="shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#0a4768] text-center">
                    Start Growing Your Business
                  </CardTitle>
                  <p className="text-gray-600 text-center">
                    Join thousands of successful contractors on our platform
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="companyName" className="text-[#0a4768] font-medium">
                        Your Company Name *
                      </Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="ABC Insulation Services"
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-[#0a4768] font-medium">
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-[#0a4768] font-medium">
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Smith"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-[#0a4768] font-medium">
                        Your Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@abcinsulation.com"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-[#0a4768] font-medium">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="licenseNumber" className="text-[#0a4768] font-medium">
                        License # *
                      </Label>
                      <Input
                        id="licenseNumber"
                        name="licenseNumber"
                        type="text"
                        required
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        placeholder="Enter your license number"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="rocNumber" className="text-[#0a4768] font-medium">
                        ROC #
                      </Label>
                      <Input
                        id="rocNumber"
                        name="rocNumber"
                        type="text"
                        value={formData.rocNumber}
                        onChange={handleInputChange}
                        placeholder="Enter your ROC number"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-[#0a4768] font-medium">
                        Choose a Password *
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a secure password"
                        className="mt-1"
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold py-3 text-lg"
                    >
                      Start Growing My Business
                    </Button>

                    <p className="text-sm text-gray-500 text-center">
                      By signing up, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0a4768] mb-6">
              Why Join InsulationPal?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join the leading platform for insulation contractors and take your business to the next level.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="bg-[#F5DD22] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-[#0a4768]" />
                    </div>
                    <div className="text-xl font-bold text-[#0a4768] mb-2">{benefit.stat}</div>
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
