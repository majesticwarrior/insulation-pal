import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-[#0a4768] text-white">
      <div className="container mx-auto px-4 py-16 max-w-[1400px]">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Image
                src="/insulation-pal-footer-logo-large.png"
                alt="InsulationPal Logo"
                width={350}
                height={140}
                className="h-24 w-auto"
              />
            </div>
            <p className="text-gray-300 mb-6">
              Connecting homeowners with trusted insulation contractors nationwide. 
              Save money, improve comfort, and reduce energy costs all on InsulationPal.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/insulationpal/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#F5DD22] transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://x.com/insulationpal" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#F5DD22] transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/insulationpal/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#F5DD22] transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/insulationpal/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#F5DD22] transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/attic-insulation" className="text-gray-300 hover:text-[#F5DD22] transition-colors">
                  Attic Insulation
                </Link>
              </li>
              <li>
                <Link href="/services/wall-insulation" className="text-gray-300 hover:text-[#F5DD22] transition-colors">
                  Wall Insulation
                </Link>
              </li>
              <li>
                <Link href="/services/spray-foam-insulation" className="text-gray-300 hover:text-[#F5DD22] transition-colors">
                  Spray Foam
                </Link>
              </li>
              <li>
                <Link href="/services/crawl-space-insulation" className="text-gray-300 hover:text-[#F5DD22] transition-colors">
                  Crawl Space
                </Link>
              </li>
              <li>
                <Link href="/services/basement-insulation" className="text-gray-300 hover:text-[#F5DD22] transition-colors">
                  Basement Insulation
                </Link>
              </li>
              <li>
                <Link href="/services/insulation-removal" className="text-gray-300 hover:text-[#F5DD22] transition-colors">
                  Insulation Removal
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-[#F5DD22] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-300 hover:text-[#F5DD22] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/join-contractor" className="text-gray-300 hover:text-[#F5DD22] transition-colors">
                  Join as Contractor
                </Link>
              </li>
              <li>
                <Link href="/contractor-login" className="text-gray-300 hover:text-[#F5DD22] transition-colors">
                  Contractor Login
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-300 hover:text-[#F5DD22] transition-colors">
                  Learning Center
                </Link>
              </li>
              <li>
                <Link href="/resources/press" className="text-gray-300 hover:text-[#F5DD22] transition-colors">
                  Press and Media
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-[#F5DD22] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-[#F5DD22]" />
                <span className="text-gray-300">(888) 357-9555</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-[#F5DD22]" />
                <span className="text-gray-300">support@insulationpal.com</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-[#F5DD22] mt-0.5" />
                <span className="text-gray-300">
                  14210 N 46th Dr<br />
                  Glendale, AZ 85306
                </span>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-600" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-300 mb-4 md:mb-0">
            © 2025 InsulationPal. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link href="/privacy" className="text-gray-300 hover:text-[#F5DD22] transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-300 hover:text-[#F5DD22] transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-300 hover:text-[#F5DD22] transition-colors text-sm">
              Cookie Policy
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-[#F5DD22] transition-colors text-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer