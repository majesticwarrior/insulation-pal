'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm border-b border-gray-100">
          <div className="flex items-center">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>Serving 500+ Cities Nationwide</span>
            </div>
          </div>
          <div className="text-gray-600">
            Licensed & Insured Contractors
          </div>
        </div>

        {/* Main header */}
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/insulation-pal-logo.png"
              alt="InsulationPal Logo"
              width={400}
              height={160}
              className="h-24 w-auto"
              priority
            />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/services" className="text-gray-700 hover:text-[#0a4768] transition-colors">
              Services
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-[#0a4768] transition-colors">
              How It Works
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-[#0a4768] transition-colors">
              About
            </Link>
            <div className="flex space-x-3">
              <Button className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold">
                Find a Pro
              </Button>
              <Button variant="outline" className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white font-semibold">
                Become a Pro
              </Button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={handleMenuToggle}
            className="lg:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/services"
              className="block text-gray-700 hover:text-[#0a4768] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/how-it-works"
              className="block text-gray-700 hover:text-[#0a4768] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/about"
              className="block text-gray-700 hover:text-[#0a4768] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="space-y-3">
              <Button className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold">
                Find a Pro
              </Button>
              <Button variant="outline" className="w-full border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white font-semibold">
                Become a Pro
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header