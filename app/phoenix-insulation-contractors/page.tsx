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
  Award,
  Quote,
  Play
} from 'lucide-react'

// Mock data for Phoenix contractors
const phoenixContractors = [
  {
    id: 'phoenix-1',
    name: 'Arizona Premier Insulation',
    rating: 4.9,
    reviewCount: 127,
    jobsCompleted: 89,
    reliabilityScore: 98,
    services: ['Attic', 'Walls', 'Crawl Space', 'Spray Foam'],
    image: '/alex.jpg',
    verified: true,
    bbbAccredited: true,
    yearEstablished: 2015,
    about: 'Arizona Premier Insulation has been serving Phoenix homeowners for over 8 years with top-quality insulation services. We specialize in energy-efficient solutions that reduce costs and improve comfort.',
    recentProjects: [
      '/attic-insulation-blown-in.jpg',
      '/spray-foam-insulation-installed.jpg',
      '/wall-insulation-icon.jpg'
    ]
  },
  {
    id: 'phoenix-2',
    name: 'Desert Shield Insulation',
    rating: 4.8,
    reviewCount: 94,
    jobsCompleted: 67,
    reliabilityScore: 95,
    services: ['Attic', 'Basement', 'Spray Foam', 'Foam Board'],
    image: '/Shannon_Adams_b-w.jpg',
    verified: true,
    bbbAccredited: true,
    yearEstablished: 2018,
    about: 'Desert Shield Insulation brings innovative insulation solutions to Phoenix homes. Our expert team focuses on spray foam applications and comprehensive energy audits.',
    recentProjects: [
      '/basement-insulation-installed.jpg',
      '/spray-foam-insulation-installed.jpg',
      '/crawl-space-insulation-installed.jpg'
    ]
  },
  {
    id: 'phoenix-3',
    name: 'Valley Comfort Solutions',
    rating: 4.9,
    reviewCount: 156,
    jobsCompleted: 112,
    reliabilityScore: 97,
    services: ['Attic', 'Walls', 'Blown-in', 'Roll & Batt'],
    image: '/alex.jpg',
    verified: true,
    bbbAccredited: false,
    yearEstablished: 2012,
    about: 'Valley Comfort Solutions is Phoenix\'s most trusted insulation contractor, with over 11 years of experience helping homeowners reduce energy costs and improve home comfort.',
    recentProjects: [
      '/attic-insulation-blown-in.jpg',
      '/contractor-installing-wall-insulation.jpg',
      '/professional-insulation-contractor-working-on-home.jpg'
    ]
  },
  {
    id: 'phoenix-4',
    name: 'Cactus Insulation Pros',
    rating: 4.7,
    reviewCount: 83,
    jobsCompleted: 54,
    reliabilityScore: 92,
    services: ['Attic', 'Garage', 'Spray Foam'],
    image: '/Shannon_Adams_b-w.jpg',
    verified: true,
    bbbAccredited: true,
    yearEstablished: 2019,
    about: 'Cactus Insulation Pros specializes in residential insulation with a focus on customer satisfaction and energy efficiency. Family-owned and operated in Phoenix.',
    recentProjects: [
      '/spray-foam-insulation-installed.jpg',
      '/attic-insulation-blown-in.jpg'
    ]
  },
  {
    id: 'phoenix-5',
    name: 'Southwest Energy Savers',
    rating: 4.8,
    reviewCount: 71,
    jobsCompleted: 43,
    reliabilityScore: 94,
    services: ['Walls', 'Basement', 'Blown-in', 'Foam Board'],
    image: '/alex.jpg',
    verified: true,
    bbbAccredited: false,
    yearEstablished: 2020,
    about: 'Southwest Energy Savers is committed to helping Phoenix residents achieve maximum energy efficiency through professional insulation installation and upgrades.',
    recentProjects: [
      '/wall-insulation-icon.jpg',
      '/basement-insulation-installed.jpg'
    ]
  }
]

const phoenixReviews = [
  {
    id: 1,
    customerName: 'Mike Johnson',
    rating: 5,
    comment: 'Arizona Premier Insulation did an amazing job on our attic. Our energy bills dropped by 25% the first month!',
    contractorName: 'Arizona Premier Insulation',
    date: '2024-01-15',
    verified: true
  },
  {
    id: 2,
    customerName: 'Sarah Martinez',
    rating: 5,
    comment: 'Valley Comfort Solutions was professional, clean, and efficient. Highly recommend for anyone needing insulation work.',
    contractorName: 'Valley Comfort Solutions',
    date: '2024-01-10',
    verified: true
  },
  {
    id: 3,
    customerName: 'David Chen',
    rating: 4,
    comment: 'Desert Shield did great work with spray foam insulation. The team was knowledgeable and explained everything clearly.',
    contractorName: 'Desert Shield Insulation',
    date: '2024-01-08',
    verified: true
  },
  {
    id: 4,
    customerName: 'Lisa Thompson',
    rating: 5,
    comment: 'Cactus Insulation Pros exceeded our expectations. Fair pricing and excellent workmanship.',
    contractorName: 'Cactus Insulation Pros',
    date: '2024-01-05',
    verified: true
  },
  {
    id: 5,
    customerName: 'Robert Wilson',
    rating: 5,
    comment: 'Southwest Energy Savers helped us choose the right insulation for our home. Very satisfied with the results.',
    contractorName: 'Southwest Energy Savers',
    date: '2024-01-03',
    verified: true
  }
]

const cityStats = {
  totalReviews: phoenixReviews.length + 847, // Mock additional reviews
  averageRating: 4.8,
  totalContractors: phoenixContractors.length,
  jobsCompleted: phoenixContractors.reduce((sum, contractor) => sum + contractor.jobsCompleted, 0) + 234
}

export default function PhoenixInsulationContractors() {
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
              Phoenix Insulation Contractors
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Find the best insulation contractors in Phoenix, Arizona. Get free quotes from local, 
              licensed professionals who understand Phoenix's unique climate challenges.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0a4768]">{cityStats.totalReviews}</div>
                <div className="text-gray-600">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0a4768]">{cityStats.averageRating}</div>
                <div className="text-gray-600">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0a4768]">{cityStats.totalContractors}</div>
                <div className="text-gray-600">Contractors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0a4768]">{cityStats.jobsCompleted}</div>
                <div className="text-gray-600">Jobs Done</div>
              </div>
            </div>
            <QuoteButton className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3 text-lg">
              Get Free Phoenix Quotes
            </QuoteButton>
          </div>
        </div>
      </section>

      {/* Recent Reviews */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#0a4768] mb-8 text-center">
            Recent Customer Reviews in Phoenix
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phoenixReviews.slice(0, 3).map((review) => (
              <Card key={review.id} className="border-l-4 border-l-[#F5DD22]">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {renderStars(review.rating)}
                    <span className="ml-2 font-semibold">{review.rating}.0</span>
                    {review.verified && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <blockquote className="text-gray-700 mb-4">
                    "{review.comment}"
                  </blockquote>
                  <div className="text-sm text-gray-600">
                    <div className="font-medium">{review.customerName}</div>
                    <div>{review.contractorName}</div>
                    <div>{new Date(review.date).toLocaleDateString()}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Insulation Information */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0a4768]">Insulation Types for Phoenix</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Spray Foam - Best for hot climates
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Blown-in Cellulose - Cost-effective
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Fiberglass Batts - DIY friendly
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Radiant Barriers - Reflects heat
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#0a4768]">Where to Insulate</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Attics - Highest priority
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Walls - Exterior/Interior facing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Crawl Spaces - Moisture control
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Garages - Additional comfort
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#0a4768]">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  <li className="flex items-start">
                    <span className="bg-[#F5DD22] text-[#0a4768] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2 mt-0.5">1</span>
                    Get free quotes from verified contractors
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#F5DD22] text-[#0a4768] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2 mt-0.5">2</span>
                    Compare prices and services
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#F5DD22] text-[#0a4768] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2 mt-0.5">3</span>
                    Schedule installation
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#F5DD22] text-[#0a4768] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2 mt-0.5">4</span>
                    Enjoy lower energy bills
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mini Profiles */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0a4768] mb-12 text-center">
            Top Phoenix Insulation Contractors
          </h2>
          <div className="space-y-8">
            {phoenixContractors.map((contractor) => (
              <Card key={contractor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid lg:grid-cols-4 gap-6 p-6">
                  {/* Company Info */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative">
                        <Image
                          src={contractor.image}
                          alt={contractor.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        {contractor.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#0a4768]">{contractor.name}</h3>
                        <p className="text-gray-600">Est. {contractor.yearEstablished}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        {renderStars(contractor.rating)}
                        <span className="ml-2 font-semibold">{contractor.rating}</span>
                        <span className="text-gray-600 ml-1">({contractor.reviewCount})</span>
                      </div>
                      <div>
                        <span className="font-medium">Jobs Completed:</span> {contractor.jobsCompleted}
                      </div>
                      <div>
                        <span className="font-medium">Reliability:</span> {contractor.reliabilityScore}%
                      </div>
                      {contractor.bbbAccredited && (
                        <div className="flex items-center text-green-600">
                          <Award className="w-4 h-4 mr-1" />
                          BBB Accredited
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Services & About */}
                  <div className="lg:col-span-2">
                    <h4 className="font-semibold text-[#0a4768] mb-2">About</h4>
                    <p className="text-gray-700 mb-4 text-sm">{contractor.about}</p>
                    
                    <h4 className="font-semibold text-[#0a4768] mb-2">Services Offered</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {contractor.services.map((service, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>

                    {/* Recent Projects */}
                    <h4 className="font-semibold text-[#0a4768] mb-2">Recent Projects</h4>
                    <div className="flex space-x-2">
                      {contractor.recentProjects.slice(0, 3).map((project, index) => (
                        <Image
                          key={index}
                          src={project}
                          alt={`Recent project ${index + 1}`}
                          width={60}
                          height={60}
                          className="w-15 h-15 rounded object-cover"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-1 flex flex-col space-y-3">
                    <QuoteButton className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold">
                      Get Quote
                    </QuoteButton>
                    <Button 
                      asChild
                      variant="outline" 
                      className="w-full"
                    >
                      <Link href={`/contractor/${contractor.id}`}>
                        View Full Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Video */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0a4768] mb-4">
              Understanding Home Insulation
            </h2>
            <p className="text-lg text-gray-600">
              Learn the basics of home insulation and why it's crucial for Phoenix homes
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-[#0a4768] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#0a4768] mb-2">
                    Insulation 101: Phoenix Edition
                  </h3>
                  <p className="text-gray-600">
                    Educational whiteboard video coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map Placeholder */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0a4768] mb-8 text-center">
            Phoenix Service Areas
          </h2>
          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-[#0a4768] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0a4768] mb-2">
                Interactive Map
              </h3>
              <p className="text-gray-600">
                Google Map showing contractor locations coming soon
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All Reviews */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0a4768] mb-8 text-center">
            All Phoenix Reviews
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phoenixReviews.map((review) => (
              <Card key={review.id} className="border-l-4 border-l-[#F5DD22]">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {renderStars(review.rating)}
                    <span className="ml-2 font-semibold">{review.rating}.0</span>
                    {review.verified && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <blockquote className="text-gray-700 mb-4">
                    "{review.comment}"
                  </blockquote>
                  <div className="text-sm text-gray-600">
                    <div className="font-medium">{review.customerName}</div>
                    <div>{review.contractorName}</div>
                    <div>{new Date(review.date).toLocaleDateString()}</div>
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
            Ready to Improve Your Phoenix Home?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with Phoenix's most trusted insulation contractors. Get free quotes from verified professionals 
            who understand the unique insulation needs of desert homes.
          </p>
          <QuoteButton className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3 text-lg">
            Get Phoenix Quotes Now
          </QuoteButton>
        </div>
      </section>

      <Footer />
    </main>
  )
}
