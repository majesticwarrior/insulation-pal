import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import HowItWorks from '@/components/sections/HowItWorks'
import Testimonials from '@/components/sections/Testimonials'
import Coverage from '@/components/sections/Coverage'
import CallToAction from '@/components/sections/CallToAction'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professional Insulation Services Made Simple - InsulationPal | Free Contractor Quotes',
  description: 'Connect with trusted insulation contractors in your area. Get free quotes for attic insulation, wall insulation, spray foam, and more. Save up to 30% on energy bills.',
  keywords: 'insulation contractors, insulation services, attic insulation, spray foam, wall insulation, energy efficiency, home insulation quotes',
  openGraph: {
    title: 'Professional Insulation Services Made Simple - InsulationPal',
    description: 'Connect with trusted insulation contractors nationwide. Get free quotes and save up to 30% on energy bills.',
    type: 'website',
  },
}

export default function Home() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "InsulationPal",
    "image": "https://insulationpal.com/home-outside-walls-insulation-installation.jpg",
    "logo": "https://insulationpal.com/insulation-pal-logo.png",
    "@id": "https://insulationpal.com",
    "url": "https://insulationpal.com/",
    "telephone": "(888) 357-9555",
    "description": "USA's #1 Home Insulation Contractors Near Me, Get Free Quotes",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "14210 N 46th Dr",
      "addressLocality": "Glendale",
      "addressRegion": "AZ",
      "postalCode": "85306",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 33.5506,
      "longitude": -112.1747
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "InsulationPal",
    "url": "https://insulationpal.com/",
    "logo": "https://insulationpal.com/insulation-pal-logo.png",
    "image": "https://insulationpal.com/home-outside-walls-insulation-installation.jpg",
    "description": "USA's #1 Home Insulation Contractors Near Me, Get Free Quotes",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "14210 N 46th Dr",
      "addressLocality": "Glendale",
      "addressRegion": "AZ",
      "postalCode": "85306",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://x.com/insulationpal",
      "https://www.facebook.com/insulationpal/",
      "https://www.linkedin.com/in/insulationpal/",
      "https://www.instagram.com/insulationpal/",
      "https://www.pinterest.com/insulationpal/"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "(888) 357-9555",
      "contactType": "Customer Service",
      "availableLanguage": "English"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <main className="min-h-screen">
        <Header />
        <Hero />
        <Services />
        <HowItWorks />
        <Testimonials />
        <Coverage />
        <CallToAction />
        <Footer />
      </main>
    </>
  )
}