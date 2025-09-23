import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QuoteButton } from '@/components/ui/quote-button'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Star, 
  MapPin, 
  Phone, 
  CheckCircle, 
  Users,
  TrendingUp,
  Shield,
  Award
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Arizona Insulation Contractors - InsulationPal',
  description: 'Find top-rated insulation contractors in Arizona. Get free quotes from licensed professionals for attic, basement and walls insulation in Arizona.',
  keywords: 'Arizona insulation contractors, Arizona home energy efficiency',
  openGraph: {
    title: 'Arizona Insulation Contractors - Top-Rated Professionals',
    description: 'Connect with licensed insulation contractors throughout Arizona. Get free quotes from licensed professionals for attic, basement and walls insulation in Arizona.',
    type: 'website',
  },
}

// This would come from the database in a real application
const topContractors = [
  {
    id: 1,
    name: 'Arizona Premier Insulation',
    rating: 4.9,
    reviewCount: 127,
    jobsCompleted: 89,
    city: 'Phoenix',
    services: ['Attic', 'Walls', 'Crawl Space', 'Spray Foam'],
    image: '/alex.jpg',
    verified: true,
    bbbAccredited: true
  },
  {
    id: 2,
    name: 'Desert Shield Insulation',
    rating: 4.8,
    reviewCount: 94,
    jobsCompleted: 67,
    city: 'Scottsdale',
    services: ['Attic', 'Basement', 'Spray Foam', 'Foam Board'],
    image: '/Shannon_Adams_b-w.jpg',
    verified: true,
    bbbAccredited: true
  },
  {
    id: 3,
    name: 'Valley Comfort Solutions',
    rating: 4.9,
    reviewCount: 156,
    jobsCompleted: 112,
    city: 'Mesa',
    services: ['Attic', 'Walls', 'Blown-in', 'Roll & Batt'],
    image: '/alex.jpg',
    verified: true,
    bbbAccredited: false
  },
  {
    id: 4,
    name: 'Cactus Insulation Pros',
    rating: 4.7,
    reviewCount: 83,
    jobsCompleted: 54,
    city: 'Chandler',
    services: ['Attic', 'Garage', 'Spray Foam'],
    image: '/Shannon_Adams_b-w.jpg',
    verified: true,
    bbbAccredited: true
  },
  {
    id: 5,
    name: 'Southwest Energy Savers',
    rating: 4.8,
    reviewCount: 71,
    jobsCompleted: 43,
    city: 'Tempe',
    services: ['Walls', 'Basement', 'Blown-in', 'Foam Board'],
    image: '/alex.jpg',
    verified: true,
    bbbAccredited: false
  },
  {
    id: 6,
    name: 'Grand Canyon Insulation',
    rating: 4.6,
    reviewCount: 62,
    jobsCompleted: 38,
    city: 'Glendale',
    services: ['Attic', 'Crawl Space', 'Roll & Batt'],
    image: '/Shannon_Adams_b-w.jpg',
    verified: true,
    bbbAccredited: true
  }
]

const allContractors = [
  ...topContractors,
  {
    id: 7,
    name: 'Arizona Comfort Control',
    rating: 4.5,
    reviewCount: 45,
    jobsCompleted: 28,
    city: 'Surprise',
    services: ['Attic', 'Walls', 'Blown-in'],
    image: '/alex.jpg',
    verified: true,
    bbbAccredited: false
  },
  {
    id: 8,
    name: 'Desert Thermal Solutions',
    rating: 4.7,
    reviewCount: 58,
    jobsCompleted: 34,
    city: 'Peoria',
    services: ['Spray Foam', 'Foam Board', 'Attic'],
    image: '/Shannon_Adams_b-w.jpg',
    verified: true,
    bbbAccredited: true
  },
  {
    id: 9,
    name: 'Valley Insulation Experts',
    rating: 4.4,
    reviewCount: 39,
    jobsCompleted: 22,
    city: 'Gilbert',
    services: ['Walls', 'Basement', 'Roll & Batt'],
    image: '/alex.jpg',
    verified: true,
    bbbAccredited: false
  },
  {
    id: 10,
    name: 'Arizona Energy Shield',
    rating: 4.6,
    reviewCount: 51,
    jobsCompleted: 31,
    city: 'Queen Creek',
    services: ['Attic', 'Garage', 'Blown-in', 'Spray Foam'],
    image: '/Shannon_Adams_b-w.jpg',
    verified: true,
    bbbAccredited: true
  }
]

// Arizona cities with 50,000+ population
const arizonaCities = [
  { name: 'Phoenix', population: '1,608,139', slug: 'phoenix' },
  { name: 'Tucson', population: '548,073', slug: 'tucson' },
  { name: 'Mesa', population: '504,258', slug: 'mesa' },
  { name: 'Chandler', population: '275,987', slug: 'chandler' },
  { name: 'Scottsdale', population: '241,361', slug: 'scottsdale' },
  { name: 'Glendale', population: '248,325', slug: 'glendale' },
  { name: 'Gilbert', population: '267,918', slug: 'gilbert' },
  { name: 'Tempe', population: '195,805', slug: 'tempe' },
  { name: 'Peoria', population: '190,985', slug: 'peoria' },
  { name: 'Surprise', population: '147,965', slug: 'surprise' },
  { name: 'Yuma', population: '95,548', slug: 'yuma' },
  { name: 'Avondale', population: '87,931', slug: 'avondale' },
  { name: 'Goodyear', population: '95,294', slug: 'goodyear' },
  { name: 'Flagstaff', population: '76,831', slug: 'flagstaff' },
  { name: 'Buckeye', population: '91,502', slug: 'buckeye' },
  { name: 'Lake Havasu City', population: '57,144', slug: 'lake-havasu-city' },
  { name: 'Casa Grande', population: '55,477', slug: 'casa-grande' },
  { name: 'Sierra Vista', population: '43,888', slug: 'sierra-vista' },
  { name: 'Maricopa', population: '62,720', slug: 'maricopa' },
  { name: 'Oro Valley', population: '47,070', slug: 'oro-valley' }
]

const stats = {
  totalContractors: allContractors.length,
  totalReviews: allContractors.reduce((sum, contractor) => sum + contractor.reviewCount, 0),
  averageRating: (allContractors.reduce((sum, contractor) => sum + contractor.rating, 0) / allContractors.length).toFixed(1),
  totalJobsCompleted: allContractors.reduce((sum, contractor) => sum + contractor.jobsCompleted, 0)
}

export default function ArizonaInsulationContractors() {
  const getServiceBadges = (services: string[]) => {
    return services.map((service, index) => (
      <Badge key={index} variant="secondary" className="text-xs">
        {service}
      </Badge>
    ))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0a4768] mb-6">
              Arizona Insulation Contractors
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Connect with the top-rated insulation contractors in Arizona. Get free quotes from licensed, 
              insured professionals who know the unique insulation needs of the Arizona climate.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0a4768]">{stats.totalContractors}</div>
                <div className="text-gray-600">Contractors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0a4768]">{stats.totalReviews}</div>
                <div className="text-gray-600">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0a4768]">{stats.averageRating}</div>
                <div className="text-gray-600">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0a4768]">{stats.totalJobsCompleted}</div>
                <div className="text-gray-600">Jobs Done</div>
              </div>
            </div>
            <QuoteButton className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3 text-lg">
              Get Free Quotes Today
            </QuoteButton>
          </div>
        </div>
      </section>

      {/* Top 6 Contractors */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0a4768] mb-4">
              Top 6 Insulation Contractors in Arizona
            </h2>
            <p className="text-lg text-gray-600">
              Based on customer reviews, jobs completed, and overall rating
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topContractors.map((contractor, index) => (
              <Card key={contractor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Image
                          src={contractor.image}
                          alt={contractor.name}
                          width={60}
                          height={60}
                          className="w-15 h-15 rounded-full object-cover"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                        {contractor.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0a4768]">{contractor.name}</h3>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-gray-500" />
                          <span className="text-sm text-gray-600">{contractor.city}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-[#F5DD22] text-[#0a4768] px-2 py-1 rounded text-sm font-bold">
                        #{index + 1}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 mb-3">
                    {renderStars(contractor.rating)}
                    <span className="text-sm font-semibold ml-2">{contractor.rating}</span>
                    <span className="text-sm text-gray-600">({contractor.reviewCount} reviews)</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Jobs Completed:</span>
                      <span className="font-semibold">{contractor.jobsCompleted}</span>
                    </div>
                    {contractor.bbbAccredited && (
                      <div className="flex items-center text-sm text-green-600">
                        <Award className="w-4 h-4 mr-1" />
                        BBB Accredited
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Services:</div>
                    <div className="flex flex-wrap gap-1">
                      {getServiceBadges(contractor.services)}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <QuoteButton 
                      variant="outline" 
                      size="sm"
                      className="flex-1 text-xs"
                    >
                      Get Quote
                    </QuoteButton>
                    <Button 
                      asChild
                      variant="outline" 
                      size="sm"
                      className="flex-1 text-xs"
                    >
                      <Link href={`/contractor/${contractor.id}`}>
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Contractors */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0a4768] mb-4">
              All Arizona Insulation Contractors
            </h2>
            <p className="text-lg text-gray-600">
              Complete directory of verified insulation contractors in Arizona
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contractor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allContractors.map((contractor) => (
                  <tr key={contractor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative mr-4">
                          <Image
                            src={contractor.image}
                            alt={contractor.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                          />
                          {contractor.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                              <CheckCircle className="w-2 h-2 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {contractor.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {contractor.jobsCompleted} jobs completed
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {contractor.city}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center space-x-1">
                          {renderStars(contractor.rating)}
                        </div>
                        <span className="ml-2 text-sm text-gray-900">
                          {contractor.rating} ({contractor.reviewCount})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {contractor.services.slice(0, 3).map((service, index) => (
                          <span key={index} className="text-xs">
                            {service === 'Attic' && <CheckCircle className="w-3 h-3 text-green-500 inline mr-1" />}
                            {service === 'Walls' && <CheckCircle className="w-3 h-3 text-green-500 inline mr-1" />}
                            {service === 'Basement' && <CheckCircle className="w-3 h-3 text-green-500 inline mr-1" />}
                            {service === 'Crawl Space' && <CheckCircle className="w-3 h-3 text-green-500 inline mr-1" />}
                            {service === 'Garage' && <CheckCircle className="w-3 h-3 text-green-500 inline mr-1" />}
                            {service === 'Blown-in' && <CheckCircle className="w-3 h-3 text-blue-500 inline mr-1" />}
                            {service === 'Spray Foam' && <CheckCircle className="w-3 h-3 text-blue-500 inline mr-1" />}
                            {service === 'Foam Board' && <CheckCircle className="w-3 h-3 text-blue-500 inline mr-1" />}
                            {service === 'Roll & Batt' && <CheckCircle className="w-3 h-3 text-blue-500 inline mr-1" />}
                            {service}
                          </span>
                        ))}
                        {contractor.services.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{contractor.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <QuoteButton 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                        >
                          Quote
                        </QuoteButton>
                        <Button 
                          asChild
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                        >
                          <Link href={`/contractor/${contractor.id}`}>
                            Profile
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Arizona Cities Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0a4768] mb-4">
              Arizona Cities We Serve
            </h2>
            <p className="text-lg text-gray-600">
              Find insulation contractors in major Arizona cities (50,000+ population)
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {arizonaCities.map((city, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      {city.slug === 'phoenix' ? (
                        <Link href={`/arizona/${city.slug}-insulation-contractors`} className="text-[#0a4768] hover:underline">
                          <h3 className="font-semibold text-lg">{city.name}</h3>
                        </Link>
                      ) : (
                        <h3 className="font-semibold text-lg text-gray-700">{city.name}</h3>
                      )}
                      <p className="text-sm text-gray-500">Pop: {city.population}</p>
                    </div>
                    <div className="text-right">
                      {city.slug === 'phoenix' ? (
                        <Link href={`/arizona/${city.slug}-insulation-contractors`}>
                          <Button size="sm" variant="outline" className="text-xs">
                            View Contractors
                          </Button>
                        </Link>
                      ) : (
                        <Button size="sm" variant="outline" className="text-xs" disabled>
                          Coming Soon
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

      {/* CTA Section */}
      <section className="py-16 bg-[#D6D6D6] text-[#0a4768]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Improve Your Home's Energy Efficiency?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get connected with Arizona's top insulation contractors. Free quotes, no obligations, 
            and qualified professionals ready to help you save on energy costs.
          </p>
          <QuoteButton className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3 text-lg">
            Get Started Today
          </QuoteButton>
        </div>
      </section>

      <Footer />
    </main>
  )
}
