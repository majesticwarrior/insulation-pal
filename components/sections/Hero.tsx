'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { QuoteButton } from '@/components/ui/quote-button'
import { MapPin, Shield, Star, Users } from 'lucide-react'
import { saveCustomerData, getCustomerData } from '@/lib/customer-data-storage'

const Hero = () => {
  const [zipCode, setZipCode] = useState('')

  useEffect(() => {
    // Load stored address if available
    const storedData = getCustomerData()
    if (storedData.address) {
      setZipCode(storedData.address)
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

  return (
    <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a4768] mb-6 leading-tight">
              Professional Insulation Services{' '}
              <span className="text-[#6B7280] made-simple-text">Made Simple</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Connect with trusted, licensed insulation contractors in your area. 
              Get competitive quotes for attic insulation, wall insulation, spray foam, and more.
            </p>

            {/* Quote form */}
            <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-[#0a4768] mb-4">
                Get Your Free Quote Today
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter Your Address"
                    value={zipCode}
                    onChange={handleZipCodeChange}
                    className="pl-10 h-12"
                    aria-label="Enter Your Address"
                  />
                </div>
                <QuoteButton className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold h-12 px-8">
                  Get Free Quote
                </QuoteButton>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                No obligations • Get matched instantly
              </p>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-full p-3 shadow-md mb-2">
                  <Users className="h-6 w-6 text-[#0a4768]" />
                </div>
                <div className="text-2xl font-bold text-[#0a4768]">1000's of</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-full p-3 shadow-md mb-2">
                  <Shield className="h-6 w-6 text-[#0a4768]" />
                </div>
                <div className="text-2xl font-bold text-[#0a4768]">100%</div>
                <div className="text-sm text-gray-600">Licensed</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-full p-3 shadow-md mb-2">
                  <Star className="h-6 w-6 text-[#0a4768]" />
                </div>
                <div className="text-2xl font-bold text-[#0a4768]">4.9</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-full p-3 shadow-md mb-2">
                  <MapPin className="h-6 w-6 text-[#0a4768]" />
                </div>
                <div className="text-2xl font-bold text-[#0a4768]">500+</div>
                <div className="text-sm text-gray-600">Cities Served</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-lg shadow-2xl p-8">
              <Image
                src="/professional-insulation-contractor-working-on-home.jpg"
                alt="Professional insulation contractor working on home"
                width={800}
                height={600}
                className="w-full h-96 object-cover rounded-lg mb-6"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Energy Savings:</span>
                  <span className="font-bold text-[#0a4768]">Up to 30%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Installation Time:</span>
                  <span className="font-bold text-[#0a4768]">1-2 Days</span>
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
  )
}

export default Hero