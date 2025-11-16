import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Lightbulb, Calculator, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { articles } from '@/lib/articles-data'

export const metadata: Metadata = {
  title: 'Insulation Articles, Comprehensive Tips and Advice for Homeowners - InsulationPal',
  description: 'Comprehensive guides on insulation types, energy efficiency, and home improvement. Learn about spray foam, cellulose, fiberglass, and more with expert insights.',
  keywords: 'insulation guide, energy efficiency, home insulation types, spray foam guide, cellulose insulation, fiberglass insulation',
  openGraph: {
    title: 'InsulationPal Articles - Expert Insulation Guides',
    description: 'Access comprehensive guides on insulation types, energy efficiency, and home improvement from InsulationPal experts.',
    type: 'website',
  },
}

const features = [
  {
    icon: BookOpen,
    title: 'Expert Knowledge',
    description: 'In-depth guides written by insulation professionals with decades of experience.'
  },
  {
    icon: Lightbulb,
    title: 'Practical Tips',
    description: 'Real-world advice to help you make informed decisions about your insulation needs.'
  },
  {
    icon: Calculator,
    title: 'Cost Savings',
    description: 'Learn how proper insulation can reduce your energy bills by up to 30%.'
  },
  {
    icon: CheckCircle,
    title: 'Quality Assured',
    description: 'All content is reviewed by certified insulation contractors and energy efficiency experts.'
  }
]

export default function ArticlesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'Articles' }
      ]} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-20">
        <div className="container mx-auto px-4 max-w-[1400px]">
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a4768] mb-6 leading-tight">
              Insulation Articles
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Everything you need to know about home insulation. From understanding different materials 
              to energy efficiency tips, our comprehensive guides help you make informed decisions.
            </p>
            <Button 
              asChild
              className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3 text-lg"
            >
              <Link href="#articles">Explore Articles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
              Why Use Our Learning Center?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our resources are designed to help homeowners understand insulation options and make the best choices for their homes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="bg-[#F5DD22] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-[#0a4768]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
              Comprehensive Articles and Guides
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dive deep into insulation materials, techniques, and energy efficiency strategies with our expert-written articles.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#F5DD22] text-[#0a4768] px-3 py-1 rounded-full text-sm font-medium">
                      {article.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0a4768] mb-3">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white"
                  >
                    <Link href={`/resources/articles/${article.slug}`}>
                      Read Article <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#D6D6D6] text-[#0a4768]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Improve Your Home's Insulation?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Use our knowledge to make informed decisions, then connect with trusted contractors in your area for professional installation.
          </p>
          <QuoteButton className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3 text-lg">
            Get Free Quotes
          </QuoteButton>
        </div>
      </section>

      <Footer />
    </main>
  )
}
