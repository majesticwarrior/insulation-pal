import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Lightbulb, Calculator, CheckCircle, Play, ShoppingCart, Newspaper, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { articles } from '@/lib/articles-data'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

export const metadata: Metadata = {
  title: 'Learning Center, Insulation Articles,Guides, News & Resources - InsulationPal',
  description: 'Comprehensive guides on insulation types, energy efficiency, and home improvement. Learn about spray foam, cellulose, fiberglass, and more with expert insights.',
  keywords: 'insulation guide, energy efficiency, home insulation types, spray foam guide, cellulose insulation, fiberglass insulation',
  openGraph: {
    title: 'InsulationPal Learning Center - Expert Insulation Guides',
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

export default function ResourcesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Resources' }
      ]} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a4768] mb-6 leading-tight">
              Insulation Learning Center
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Everything you need to know about home insulation. From understanding different materials 
              to energy efficiency tips, our comprehensive guides help you make informed decisions.
            </p>
            <Button 
              asChild
              className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3 text-lg"
            >
              <Link href="/resources/articles">Explore Articles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
              Recent Articles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Stay updated with our latest insulation guides and expert insights.
            </p>
            <Button 
              asChild
              className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-6 py-2"
            >
              <Link href="/resources/articles">
                View All Articles <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="max-w-6xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {articles.slice(0, 5).map((article, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card className="hover:shadow-xl transition-shadow overflow-hidden h-full">
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
                      Read Article
                    </Link>
                  </Button>
                </CardContent>
              </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>

      {/* DIY Section */}
      <section className="py-20 bg-[#D6D6D6]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
              Do It Yourself
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how to tackle insulation projects yourself with our comprehensive DIY guides and video tutorials.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="bg-[#F5DD22] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="h-8 w-8 text-[#0a4768]" />
                </div>
                <h3 className="text-xl font-bold text-[#0a4768] mb-4">Glossary of Insulation Terms</h3>
                <p className="text-gray-600 mb-6">
                  Our glossary of terms that explains the different types of insulation and their applications.
                </p>
                <Button asChild variant="outline" className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white">
                  <Link href="/resources/glossary">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="bg-[#F5DD22] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-8 w-8 text-[#0a4768]" />
                </div>
                <h3 className="text-xl font-bold text-[#0a4768] mb-4">DIY & Video Guides</h3>
                <p className="text-gray-600 mb-6">
                  Comprehensive written guides with tools lists, safety tips, and detailed instructions.
                </p>
                <Button asChild variant="outline" className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white">
                  <Link href="/resources/diy">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="bg-[#F5DD22] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calculator className="h-8 w-8 text-[#0a4768]" />
                </div>
                <h3 className="text-xl font-bold text-[#0a4768] mb-4">Cost Calculator</h3>
                <p className="text-gray-600 mb-6">
                  Estimate the cost of your DIY insulation project with our interactive calculator.
                </p>
                <Button asChild variant="outline" className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white">
                  <Link href="/resources/diy">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Where to Buy Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
              Where to Buy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find quality insulation materials and supplies from trusted retailers and manufacturers.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="hover:shadow-xl transition-shadow overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-12 flex flex-col justify-center">
                  <div className="bg-[#F5DD22] w-20 h-20 rounded-full flex items-center justify-center mb-8">
                    <ShoppingCart className="h-10 w-10 text-[#0a4768]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0a4768] mb-4">
                    InsulationPal Store
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    Browse our curated selection of premium insulation materials, tools, and accessories. 
                    Get expert recommendations and competitive pricing.
                  </p>
                  <Button 
                    asChild
                    className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-6 py-3"
                  >
                    <Link href="/resources/where-to-buy">
                      Visit Store <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] p-12 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <p className="text-[#0a4768] font-semibold text-lg">eCommerce Store</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Press Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
              Recent Press & News
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest news, press releases, and media coverage about InsulationPal.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="hover:shadow-xl transition-shadow border-2 border-[#F5DD22]">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-[#F5DD22] w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <Newspaper className="h-6 w-6 text-[#0a4768]" />
                  </div>
                  <div>
                    <span className="bg-[#F5DD22] text-[#0a4768] px-3 py-1 rounded-full text-sm font-medium">
                      Company Launch
                    </span>
                    <p className="text-sm text-gray-500 mt-2">October 24, 2025</p>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#0a4768] mb-4 leading-tight">
                  InsulationPal Launches New Platform to Connect Homeowners with Trusted Local Insulation Contractors
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  InsulationPal launches a new online platform connecting homeowners with licensed local insulation contractors, helping users compare bids, access trusted professionals, and find affordable, high-quality home and commercial insulation solutions.
                </p>
                <Button asChild className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold">
                  <Link href="/resources/press/insulationpal-launches-new-platform-to-connect-homeowners-with-trusted-local-insulation-contractors">
                    Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button 
              asChild
              className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-6 py-3"
            >
              <Link href="/resources/press">
                View All Press <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
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
