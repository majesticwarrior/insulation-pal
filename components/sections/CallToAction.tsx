'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { QuoteButton } from '@/components/ui/quote-button'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { saveCustomerData, getCustomerData } from '@/lib/customer-data-storage'

const CallToAction = () => {
  // Load stored data if available
  const [zipCode, setZipCode] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const storedData = getCustomerData()
    if (storedData.address) {
      setZipCode(storedData.address)
    }
    if (storedData.email) {
      setEmail(storedData.email)
    }
  }, [])

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setZipCode(value)
    // Save address to localStorage as user types
    if (value.trim()) {
      saveCustomerData({ address: value.trim() })
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    // Save email to localStorage as user types
    if (value.trim()) {
      saveCustomerData({ email: value.trim() })
    }
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-[#0a4768]">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Save on Energy Bills?
            </h2>
            <p className="text-xl mb-8 text-gray-600">
              Join thousands of homeowners who have reduced their energy costs by up to 30% 
              with professional insulation services from InsulationPal.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center">
                <div className="bg-[#F5DD22] rounded-full p-3 mr-4">
                  <Clock className="h-6 w-6 text-[#0a4768]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0a4768]">Instant Matching</h4>
                  <p className="text-sm text-gray-600">Get matched with contractors fast</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-[#F5DD22] rounded-full p-3 mr-4">
                  <Phone className="h-6 w-6 text-[#0a4768]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0a4768]">Free Consultations</h4>
                  <p className="text-sm text-gray-600">No obligation quotes</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-2xl font-bold text-[#0a4768] mb-4">Get Started Today</h3>
              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter Your Address"
                    value={zipCode}
                    onChange={handleZipCodeChange}
                    className="pl-10 bg-white border-gray-300 text-[#0a4768] placeholder:text-gray-400"
                    aria-label="Enter Your Address"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={handleEmailChange}
                    className="pl-10 bg-white border-gray-300 text-[#0a4768] placeholder:text-gray-400"
                    aria-label="Enter email address"
                  />
                </div>
                <QuoteButton className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold py-3">
                  Get My Free Quote
                </QuoteButton>
              </div>
              <p className="text-sm text-gray-600 mt-3 text-center">
                100% free • No spam • Quick response
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h3 className="text-2xl font-bold text-[#0a4768] mb-6">
                Why Homeowners Choose Us
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#F5DD22] rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold text-[#0a4768]">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0a4768]">Vetted Contractors</h4>
                    <p className="text-gray-600 text-sm">All licensed, insured, and background-checked</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#F5DD22] rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold text-[#0a4768]">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0a4768]">Competitive Quotes</h4>
                    <p className="text-gray-600 text-sm">Compare up to 3 free estimates</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#F5DD22] rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold text-[#0a4768]">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0a4768]">Quality Guarantee</h4>
                    <p className="text-gray-600 text-sm">Satisfaction guaranteed or your money back</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default CallToAction