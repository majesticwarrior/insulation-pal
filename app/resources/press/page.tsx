import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import Image from 'next/image'
import { Newspaper, Calendar, ExternalLink, ArrowLeft, Download, Mail } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Press & News - InsulationPal | Company Updates & Media Coverage',
  description: 'Stay updated with the latest news, press releases, and media coverage about InsulationPal. Company updates, industry recognition, and expansion news.',
  keywords: 'InsulationPal news, press release, company updates, insulation industry news, media coverage, company expansion',
  openGraph: {
    title: 'Press & News - InsulationPal',
    description: 'Latest news and press releases from InsulationPal.',
    type: 'website',
  },
}

const pressReleases = [
  {
    title: 'InsulationPal Platform Launches in Arizona to Connect Homeowners with Verified Insulation Contractors',
    date: 'November 7, 2025',
    summary: 'InsulationPal has officially launched in Arizona, offering homeowners a streamlined approach to finding and hiring licensed insulation contractors through its online platform. The service provides Arizona residents with access to verified local professionals for various insulation projects.',
    content: 'InsulationPal has officially launched in Arizona, offering homeowners a streamlined approach to finding and hiring licensed insulation contractors through its online platform. The service provides Arizona residents with access to verified local professionals for various insulation projects, including attics, crawl spaces, commercial properties, and industrial facilities.',
    category: 'Company Expansion',
    readTime: '3 min read',
    featured: true,
    pressReleaseUrl: 'https://www.citybuzz.co/2025/11/07/insulationpal-platform-launches-in-arizona-to-connect-homeowners-with-verified-insulation-contractors/'
  },
  {
    title: 'InsulationPal Launches New Platform to Connect Homeowners with Trusted Local Insulation Contractors',
    date: 'October 24, 2025',
    summary: 'InsulationPal launches a new online platform connecting homeowners with licensed local insulation contractors, helping users compare bids, access trusted professionals, and find affordable, high-quality home and commercial insulation solutions.',
    content: 'Glendale, Arizona – InsulationPal, a newly launched consumer-focused digital platform, is set to transform how homeowners and businesses find and hire licensed insulation contractors across the United States. Designed to make insulation projects easier, faster, and more transparent, the platform allows users to connect with local insulation professionals, compare multiple bids, and confidently choose the right expert for their project – whether for residential, commercial, or industrial spaces.',
    category: 'Company Launch',
    readTime: '3 min read',
    featured: false,
    pressReleaseUrl: 'https://www.abnewswire.com/pressreleases/insulationpal-launches-new-platform-to-connect-homeowners-with-trusted-local-insulation-contractors_770586.html'
  }
]

const mediaCoverage = [
  {
    outlet: 'Home Improvement Weekly',
    title: 'How InsulationPal is Revolutionizing Home Energy Efficiency',
    date: 'December 5, 2024',
    summary: 'Feature article highlighting InsulationPal\'s innovative approach to connecting homeowners with qualified contractors.',
    link: '#',
    logo: '📰'
  },
  {
    outlet: 'Energy Efficiency Today',
    title: 'InsulationPal\'s Impact on Residential Energy Savings',
    date: 'November 20, 2024',
    summary: 'Industry analysis of how InsulationPal\'s platform has helped homeowners save energy and reduce costs.',
    link: '#',
    logo: '⚡'
  },
  {
    outlet: 'Contractor Business Magazine',
    title: 'InsulationPal: A New Model for Contractor-Client Connections',
    date: 'October 25, 2024',
    summary: 'Business feature on how InsulationPal is changing the way contractors find and serve customers.',
    link: '#',
    logo: '🔧'
  },
  {
    outlet: 'Green Home Builder',
    title: 'Sustainable Insulation Solutions Through Technology',
    date: 'September 15, 2024',
    summary: 'Coverage of InsulationPal\'s commitment to promoting eco-friendly insulation materials and practices.',
    link: '#',
    logo: '🌱'
  }
]

const companyMilestones = [
  {
    year: '2025',
    title: 'InsulationPal App Launches',
    description: 'Official launch of InsulationPal platform connecting homeowners with trusted local insulation contractors'
  }
]

export default function PressPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'Press and Media' }
      ]} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <Link 
                href="/resources" 
                className="inline-flex items-center text-[#0a4768] hover:text-[#0a4768]/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Resources
              </Link>
            </div>
            <div className="bg-[#F5DD22] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <Newspaper className="h-12 w-12 text-[#0a4768]" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a4768] mb-6 leading-tight">
              Press & News
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Stay updated with the latest news, press releases, and media coverage about InsulationPal. 
              Company updates, industry recognition, and expansion news.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3 text-lg"
              >
                <Download className="mr-2 h-5 w-5" />
                Press Kit
              </Button>
              <Button 
                asChild
                variant="outline"
                className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white px-8 py-3 text-lg"
              >
                <Link href="#contact">
                  <Mail className="mr-2 h-5 w-5" />
                  Media Contact
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Press Release */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
              Latest News
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our most recent press releases and company announcements.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {pressReleases.map((release, index) => (
              <Card key={index} className={`mb-8 hover:shadow-xl transition-shadow ${release.featured ? 'border-2 border-[#F5DD22]' : ''}`}>
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center mb-3">
                        <span className="bg-[#F5DD22] text-[#0a4768] px-3 py-1 rounded-full text-sm font-medium mr-3">
                          {release.category}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          {release.date}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-[#0a4768] mb-4">
                        {release.title}
                      </h3>
                      <p className="text-gray-600 text-lg mb-4">
                        {release.summary}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {release.content}
                  </p>
                  
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <span className="text-sm text-gray-500">{release.readTime}</span>
                    <div className="flex gap-3">
                      <Button asChild variant="outline" className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white">
                        <Link href={`/resources/press/${release.title.toLowerCase().replace(/\s+/g, '-')}`}>
                          Read Full Article
                        </Link>
                      </Button>
                      {release.pressReleaseUrl && (
                        <Button asChild className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]">
                          <Link href={release.pressReleaseUrl} target="_blank" rel="noopener noreferrer">
                            Press Release <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
              Media Coverage
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Recent articles and features about InsulationPal in industry publications and media outlets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {mediaCoverage.map((article, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{article.logo}</div>
                      <div>
                        <h4 className="font-semibold text-[#0a4768]">{article.outlet}</h4>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          {article.date}
                        </div>
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline" className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white">
                      <Link href={article.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#0a4768] mb-3">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {article.summary}
                  </p>
                  
                  <Button asChild variant="outline" className="w-full border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white">
                    <Link href={article.link} target="_blank" rel="noopener noreferrer">
                      Read Article <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
              Company Milestones
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key moments in InsulationPal's growth and development.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#F5DD22]"></div>
              
              {companyMilestones.map((milestone, index) => (
                <div key={index} className="relative flex items-start mb-12">
                  <div className="bg-[#F5DD22] w-16 h-16 rounded-full flex items-center justify-center z-10">
                    <span className="text-[#0a4768] font-bold">{milestone.year}</span>
                  </div>
                  <div className="ml-8 flex-1">
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-[#0a4768] mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section id="contact" className="py-20 bg-[#D6D6D6] text-[#0a4768]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Media Contact
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            For media inquiries, press releases, or interview requests, please contact our communications team.
          </p>
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h3 className="font-bold text-[#0a4768] mb-2">Press Inquiries</h3>
                    <p className="text-gray-600 mb-4">
                      For media questions and interview requests
                    </p>
                    <p className="text-[#0a4768] font-semibold">
                      press@insulationpal.com
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0a4768] mb-2">General Media</h3>
                    <p className="text-gray-600 mb-4">
                      For general media and partnership inquiries
                    </p>
                    <p className="text-[#0a4768] font-semibold">
                      media@insulationpal.com
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Response time: We typically respond to media inquiries within 24 hours during business days.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
