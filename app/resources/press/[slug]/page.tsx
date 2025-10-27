import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { ShareButton } from '@/components/ui/share-button'
import Link from 'next/link'
import { Calendar, ArrowLeft, ExternalLink } from 'lucide-react'
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
    date: 'October 24, 2025',
    category: 'Company Launch',
    summary: 'InsulationPal launches a new online platform connecting homeowners with licensed local insulation contractors, helping users compare bids, access trusted professionals, and find affordable, high-quality home and commercial insulation solutions.',
    content: [
      'Glendale, Arizona – Oct 24, 2025 – InsulationPal, a newly launched consumer-focused digital platform, is set to transform how homeowners and businesses find and hire licensed insulation contractors across the United States. Designed to make insulation projects easier, faster, and more transparent, the platform allows users to connect with local insulation professionals, compare multiple bids, and confidently choose the right expert for their project – whether for residential, commercial, or industrial spaces.',
      'With energy efficiency and home comfort becoming top priorities for property owners, InsulationPal fills a crucial gap in the home improvement industry. The platform simplifies the process of finding reliable home insulation and commercial insulation services by providing a single destination where users can access verified, insured, and experienced contractors.',
      '"Choosing the right insulation contractor shouldn\'t be complicated," said Shannon Adams, spokesperson for InsulationPal. "Our goal is to make the process transparent, affordable, and convenient. We help homeowners and businesses make informed decisions while ensuring that only licensed professionals handle their projects."',
      'A Smarter Way to Hire Insulation Contractors',
      'The InsulationPal website – https://insulationpal.com/ – features an intuitive design that allows users to easily enter project details and receive estimates from qualified contractors in their area. Whether it\'s upgrading attic insulation, improving wall insulation, or installing specialized materials for commercial properties, the platform provides users with multiple options tailored to their specific needs and budget.',
      'By partnering exclusively with licensed insulation contractors, InsulationPal ensures that every project is handled by professionals who adhere to industry standards and safety regulations. This commitment to quality gives users peace of mind, knowing their homes and businesses are in expert hands.',
      'Bridging the Gap Between Homeowners and Professionals',
      'In today\'s competitive home services market, property owners often struggle to identify trustworthy service providers. Many face issues such as unclear pricing, limited local options, or unverified contractors. InsulationPal addresses these challenges head-on by creating a centralized hub for comparing verified contractors, customer reviews, and fair estimates – all in one place.',
      'Homeowners can use InsulationPal to:',
      '• Compare bids from multiple local insulation professionals',
      '• Verify licensing and credentials before hiring',
      '• Access expert advice and insulation-related resources',
      '• Connect with specialists in home, attic, wall, and commercial insulation',
      'For contractors, the platform offers valuable visibility and access to new leads, helping local professionals grow their businesses while maintaining high industry standards.',
      'Driving Energy Efficiency and Comfort Nationwide',
      'Insulation plays a vital role in reducing energy costs, improving indoor air quality, and maintaining comfort year-round. As homeowners look for ways to save on utility bills and support sustainability efforts, the demand for professional insulation services continues to rise.',
      '"Proper insulation is one of the smartest investments you can make in your home or building," added Adams. "With InsulationPal, we\'re not just connecting people to contractors – we\'re connecting them to long-term comfort and savings."',
      'The platform is already gaining attention among energy-conscious homeowners, property managers, and business owners seeking reliable insulation solutions that combine affordability with expertise.',
      'About InsulationPal',
      'Insulation Pal is a U.S.-based digital platform headquartered in Glendale, Arizona, dedicated to connecting homeowners and businesses with licensed, local insulation contractors. The company\'s mission is to make the process of finding trusted insulation professionals simpler, more transparent, and cost-effective. By offering tools to compare bids, verify credentials, and access professional insights, Insulation Pal ensures that every project receives the right expertise – at the right price.',
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
              <ShareButton 
                title={article.title}
                text={article.summary}
              />
            </div>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none">
              {article.content.map((paragraph, index) => {
                // Check if it's a section header (no period at end, relatively short)
                const isHeader = !paragraph.endsWith('.') && 
                                !paragraph.endsWith('"') && 
                                !paragraph.startsWith('•') && 
                                paragraph.length < 100 &&
                                !paragraph.includes('–') // Not the dateline
                
                // Check if it's a bullet point
                const isBullet = paragraph.startsWith('•')
                
                if (isHeader && paragraph.length > 10) {
                  return (
                    <h3 key={index} className="text-2xl font-bold text-[#0a4768] mt-12 mb-6">
                      {paragraph}
                    </h3>
                  )
                } else if (isBullet) {
                  return (
                    <p key={index} className="text-gray-700 mb-3 leading-relaxed text-lg pl-6">
                      {paragraph}
                    </p>
                  )
                } else {
                  return (
                    <p key={index} className="text-gray-700 mb-6 leading-relaxed text-lg">
                      {paragraph}
                    </p>
                  )
                }
              })}
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

