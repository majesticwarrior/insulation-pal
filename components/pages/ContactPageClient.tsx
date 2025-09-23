'use client'

import { useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ContactForm } from '@/components/forms/ContactForm'

export function ContactPageClient() {
  useEffect(() => {
    // Set document title and meta tags
    document.title = 'Contact Us - InsulationPal | Customer Support & Help'
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', 'Get in touch with InsulationPal\'s customer support team. Call (888) 357-9555, email help@insulationpal.com, or use our contact form for assistance with insulation services.')
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute('content', 'contact InsulationPal, customer support, insulation help, contractor support, phone number')
  }, [])
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-[#0a4768] mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Have questions about insulation services? Need help finding the right contractor? 
              Our team is here to help you every step of the way.
            </p>
          </div>
        </div>
      </section>

      <ContactForm />

      <Footer />
    </main>
  )
}
