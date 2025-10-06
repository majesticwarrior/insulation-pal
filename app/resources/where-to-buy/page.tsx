import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, MapPin, Phone, Star, Truck, Shield, ArrowLeft, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Where to Buy Insulation - InsulationPal Store | Premium Materials & Tools',
  description: 'Shop premium insulation materials, tools, and accessories at InsulationPal Store. Expert recommendations, competitive pricing, and fast shipping.',
  keywords: 'buy insulation, insulation store, insulation materials, insulation tools, home depot insulation, lowes insulation, insulation suppliers',
  openGraph: {
    title: 'Where to Buy Insulation - InsulationPal Store',
    description: 'Find premium insulation materials and tools with expert recommendations.',
    type: 'website',
  },
}

const featuredProducts = [
  {
    name: 'Blown-in Fiberglass Insulation',
    description: 'Premium blown-in insulation for attics and walls',
    price: '$0.85/sq ft',
    image: '/blown-in-fiberglass-insulation.jpg',
    rating: 4.8,
    reviews: 156,
    inStock: true
  },
  {
    name: 'Spray Foam Insulation Kit',
    description: 'Professional-grade spray foam for air sealing',
    price: '$299.99',
    image: '/spray-foam-insulation-installed.jpg',
    rating: 4.9,
    reviews: 89,
    inStock: true
  },
  {
    name: 'Cellulose Insulation',
    description: 'Eco-friendly recycled paper insulation',
    price: '$0.65/sq ft',
    image: '/cellulose-wall-insulation-installed.jpg',
    rating: 4.7,
    reviews: 203,
    inStock: true
  },
  {
    name: 'Insulation Blower Machine',
    description: 'Professional-grade blower for blown-in insulation',
    price: '$1,299.99',
    image: '/professional-insulation-contractor-working-on-home.jpg',
    rating: 4.9,
    reviews: 45,
    inStock: false
  }
]

const retailers = [
  {
    name: 'Home Depot',
    description: 'Nationwide home improvement retailer with extensive insulation selection',
    logo: '🏠',
    website: 'https://homedepot.com',
    pros: ['Wide selection', 'Competitive prices', 'Store pickup available'],
    cons: ['Limited professional advice']
  },
  {
    name: 'Lowe\'s',
    description: 'Major home improvement chain with good insulation department',
    logo: '🔧',
    website: 'https://lowes.com',
    pros: ['Good prices', 'Online ordering', 'Installation services'],
    cons: ['Varying product availability']
  },
  {
    name: 'Menards',
    description: 'Regional home improvement store with quality insulation products',
    logo: '🏪',
    website: 'https://menards.com',
    pros: ['Competitive pricing', 'Bulk discounts', 'Good customer service'],
    cons: ['Limited locations']
  },
  {
    name: 'Local Insulation Suppliers',
    description: 'Specialized suppliers with expert knowledge and bulk pricing',
    logo: '🏢',
    website: '#',
    pros: ['Expert advice', 'Bulk pricing', 'Professional grade products'],
    cons: ['May require minimum orders']
  }
]

const categories = [
  {
    name: 'Insulation Materials',
    description: 'All types of insulation including fiberglass, cellulose, and spray foam',
    icon: '🧱',
    productCount: 45,
    link: '#'
  },
  {
    name: 'Installation Tools',
    description: 'Professional tools for insulation installation and maintenance',
    icon: '🔨',
    productCount: 23,
    link: '#'
  },
  {
    name: 'Safety Equipment',
    description: 'Protective gear for safe insulation installation',
    icon: '🛡️',
    productCount: 18,
    link: '#'
  },
  {
    name: 'Accessories',
    description: 'Vapor barriers, tape, and other installation accessories',
    icon: '📦',
    productCount: 31,
    link: '#'
  }
]

export default function WhereToBuyPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
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
              <ShoppingCart className="h-12 w-12 text-[#0a4768]" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a4768] mb-6 leading-tight">
              InsulationPal Store
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Shop premium insulation materials, professional tools, and expert-recommended products. 
              Get the best quality with competitive pricing and fast shipping.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3 text-lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
              <Button 
                asChild
                variant="outline"
                className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white px-8 py-3 text-lg"
              >
                <Link href="#retailers">
                  <MapPin className="mr-2 h-5 w-5" />
                  Find Retailers
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Store Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
              Why Shop at InsulationPal Store?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've curated the best insulation products and tools to help you achieve professional results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="bg-[#F5DD22] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="h-8 w-8 text-[#0a4768]" />
                </div>
                <h3 className="text-xl font-bold text-[#0a4768] mb-4">Expert Curated</h3>
                <p className="text-gray-600">
                  Every product is selected by insulation professionals for quality and performance.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="bg-[#F5DD22] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck className="h-8 w-8 text-[#0a4768]" />
                </div>
                <h3 className="text-xl font-bold text-[#0a4768] mb-4">Fast Shipping</h3>
                <p className="text-gray-600">
                  Quick delivery on most items with tracking and secure packaging.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="bg-[#F5DD22] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-[#0a4768]" />
                </div>
                <h3 className="text-xl font-bold text-[#0a4768] mb-4">Quality Guarantee</h3>
                <p className="text-gray-600">
                  All products come with manufacturer warranties and our satisfaction guarantee.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our most popular and highly-rated insulation products and tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-[#0a4768] mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      ({product.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-[#0a4768]">{product.price}</span>
                  </div>

                  <Button 
                    className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold"
                    disabled={!product.inStock}
                  >
                    {product.inStock ? 'Add to Cart' : 'Notify When Available'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse our comprehensive selection of insulation products and tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow text-center">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-bold text-[#0a4768] mb-3">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    {category.productCount} products
                  </p>
                  <Button asChild variant="outline" className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white">
                    <Link href={category.link}>
                      Browse Products
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Other Retailers */}
      <section id="retailers" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
              Other Retailers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find insulation products at major home improvement stores and local suppliers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {retailers.map((retailer, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">{retailer.logo}</div>
                      <div>
                        <h3 className="text-xl font-bold text-[#0a4768] mb-2">
                          {retailer.name}
                        </h3>
                        <p className="text-gray-600">
                          {retailer.description}
                        </p>
                      </div>
                    </div>
                    {retailer.website !== '#' && (
                      <Button asChild size="sm" variant="outline" className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white">
                        <Link href={retailer.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-[#0a4768] mb-2">Pros:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {retailer.pros.map((pro, i) => (
                          <li key={i} className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0a4768] mb-2">Considerations:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {retailer.cons.map((con, i) => (
                          <li key={i} className="flex items-center">
                            <span className="text-orange-500 mr-2">!</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
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
            Need Help Choosing the Right Products?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our insulation experts can help you select the perfect products for your project. 
            Get personalized recommendations and professional advice.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <QuoteButton className="bg-[#0a4768] hover:bg-[#0a4768]/90 text-white px-8 py-3 text-lg">
              Get Installation Quote
            </QuoteButton>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
