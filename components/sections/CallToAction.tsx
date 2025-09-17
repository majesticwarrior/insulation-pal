'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const CallToAction = () => {
  const [zipCode, setZipCode] = useState('')
  const [email, setEmail] = useState('')

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipCode(e.target.value)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleGetStarted = () => {
    console.log('Get started with:', { zipCode, email })
  }

  return (
    <section className="py-20 bg-[#2c3c50]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Save on Energy Bills?
            </h2>
            <p className="text-xl mb-8 text-gray-200">
              Join thousands of homeowners who have reduced their energy costs by up to 30% 
              with professional insulation services from InsulationPal.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center">
                <div className="bg-[#F5DD22] rounded-full p-3 mr-4">
                  <Clock className="h-6 w-6 text-[#2c3c50]" />
                </div>
                <div>
                  <h4 className="font-semibold">24-Hour Matching</h4>
                  <p className="text-sm text-gray-300">Get matched with contractors fast</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-[#F5DD22] rounded-full p-3 mr-4">
                  <Phone className="h-6 w-6 text-[#2c3c50]" />
                </div>
                <div>
                  <h4 className="font-semibold">Free Consultations</h4>
                  <p className="text-sm text-gray-300">No obligation quotes</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-4">Get Started Today</h3>
              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter your zip code"
                    value={zipCode}
                    onChange={handleZipCodeChange}
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                    aria-label="Enter zip code"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={handleEmailChange}
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                    aria-label="Enter email address"
                  />
                </div>
                <Button 
                  onClick={handleGetStarted}
                  className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#2c3c50] font-semibold py-3"
                >
                  Get My Free Quote
                </Button>
              </div>
              <p className="text-sm text-gray-300 mt-3 text-center">
                100% free • No spam • Quick response
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h3 className="text-2xl font-bold text-[#2c3c50] mb-6">
                Why Homeowners Choose Us
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#F5DD22] rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold text-[#2c3c50]">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2c3c50]">Vetted Contractors</h4>
                    <p className="text-gray-600 text-sm">All licensed, insured, and background-checked</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#F5DD22] rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold text-[#2c3c50]">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2c3c50]">Competitive Quotes</h4>
                    <p className="text-gray-600 text-sm">Compare up to 3 free estimates</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#F5DD22] rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold text-[#2c3c50]">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2c3c50]">Quality Guarantee</h4>
                    <p className="text-gray-600 text-sm">Satisfaction guaranteed or your money back</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F5DD22] rounded-lg p-8">
              <h3 className="text-2xl font-bold text-[#2c3c50] mb-4">
                Limited Time Offer
              </h3>
              <p className="text-[#2c3c50] mb-4">
                Get matched with top contractors and receive an additional 10% off 
                your first insulation project.
              </p>
              <p className="text-sm text-[#2c3c50]/80">
                *Offer valid for new customers only. Some restrictions apply.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CallToAction