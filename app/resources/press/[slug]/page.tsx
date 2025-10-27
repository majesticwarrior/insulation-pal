import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { Calendar, ArrowLeft, ExternalLink, Share2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface PressArticlePageProps {
  params: Promise<{ slug: string }>
}

// Press release data
const pressArticles: { [key: string]: {
  title: string
  date: string
  category: string
  summary: string
  content: string[]
  pressReleaseUrl?: string
}} = {
  'insulationpal-launches-new-platform-to-connect-homeowners-with-trusted-local-insulation-contractors': {
    title: 'InsulationPal Launches New Platform to Connect Homeowners with Trusted Local Insulation Contractors',
    date: 'October 27, 2025',
    category: 'Company Launch',
    summary: 'InsulationPal announces the launch of its innovative platform designed to simplify the process of finding and hiring qualified insulation contractors.',
    content: [
      'InsulationPal is excited to announce the official launch of its groundbreaking platform that connects homeowners with trusted, local insulation contractors. The platform streamlines the process of finding qualified professionals, comparing quotes, and managing insulation projects from start to finish.',
      'With a focus on transparency, quality, and customer satisfaction, InsulationPal is revolutionizing how homeowners approach their insulation needs. The platform features a comprehensive network of licensed and insured contractors, verified customer reviews, and detailed project portfolios to help homeowners make informed decisions.',
      '"We created InsulationPal to solve a common problem homeowners face: finding trustworthy, qualified insulation contractors," said the InsulationPal team. "Our platform makes it easy to connect with local professionals, compare multiple quotes, and feel confident in your hiring decision."',
      'Key features of the InsulationPal platform include:',
      '• Verified contractor profiles with licensing and insurance information',
      '• Real customer reviews and ratings',
      '• Project portfolio galleries showcasing completed work',
      '• Free quote request system connecting homeowners with multiple contractors',
      '• Educational resources about insulation types, costs, and best practices',
      '• City-specific contractor directories across multiple states',
      'The platform initially launches with coverage in Arizona, with plans to expand to additional states in the coming months. Homeowners can visit InsulationPal.com to search for contractors in their area, request quotes, and access free educational resources about home insulation.',
      'For contractors interested in joining the InsulationPal network, the platform offers tools to showcase their work, connect with qualified leads, and grow their business. Licensed and insured insulation professionals can apply at InsulationPal.com/join-contractor.',
    ],
    pressReleaseUrl: 'https://www.abnewswire.com/pressreleases/insulationpal-launches-new-platform-to-connect-homeowners-with-trusted-local-insulation-contractors_770586.html'
  }
}

export async function generateMetadata({ params }: PressArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = pressArticles[slug]
  
  if (!article) {
    return {
      title: 'Article Not Found - InsulationPal',
    }
  }

  return {
    title: `${article.title} | InsulationPal Press`,
    description: article.summary,
    keywords: 'InsulationPal, press release, company news, insulation contractors',
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
    },
  }
}

export default async function PressArticlePage({ params }: PressArticlePageProps) {
  const { slug } = await params
  const article = pressArticles[slug]

  if (!article) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'Press and Media', href: '/resources/press' },
        { label: article.title }
      ]} />

      {/* Article Content */}
      <article className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <Link 
                href="/resources/press" 
                className="inline-flex items-center text-[#0a4768] hover:text-[#0a4768]/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Press & News
              </Link>
            </div>

            {/* Article Header */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#F5DD22] text-[#0a4768] px-4 py-2 rounded-full text-sm font-medium">
                  {article.category}
                </span>
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {article.date}
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-[#0a4768] mb-6 leading-tight">
                {article.title}
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                {article.summary}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-12 pb-8 border-b border-gray-200">
              {article.pressReleaseUrl && (
                <Button asChild className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]">
                  <Link href={article.pressReleaseUrl} target="_blank" rel="noopener noreferrer">
                    View Official Press Release <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button 
                variant="outline" 
                className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: article.title,
                      text: article.summary,
                      url: window.location.href,
                    })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                    alert('Link copied to clipboard!')
                  }
                }}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none">
              {article.content.map((paragraph, index) => (
                <p key={index} className="text-gray-700 mb-6 leading-relaxed text-lg">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Footer CTA */}
            <Card className="mt-16 bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] border-none">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-[#0a4768] mb-4">
                  About InsulationPal
                </h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  InsulationPal is the leading platform connecting homeowners with licensed, 
                  insured insulation contractors. Our mission is to make home insulation projects 
                  simple, transparent, and stress-free.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]">
                    <Link href="/">
                      Find Contractors
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white bg-white">
                    <Link href="/about">
                      Learn More About Us
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Media Contact */}
            <div className="mt-16 p-8 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold text-[#0a4768] mb-4">
                Media Contact
              </h3>
              <p className="text-gray-700 mb-2">
                For media inquiries and interview requests:
              </p>
              <p className="text-[#0a4768] font-semibold">
                press@insulationpal.com
              </p>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}

