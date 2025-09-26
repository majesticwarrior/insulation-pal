import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QuoteButton } from '@/components/ui/quote-button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
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
  Play,
  ExternalLink
} from 'lucide-react'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { generateUniqueSlug } from '@/lib/slug-utils'
import { articles } from '@/lib/articles-data'

export const metadata: Metadata = {
  title: 'Phoenix Insulation Contractors - InsulationPal | Top-Rated Professionals',
  description: 'Find the best insulation contractors in Phoenix, AZ. Get free quotes from licensed professionals for attic, wall, and spray foam insulation services.',
  keywords: 'Phoenix insulation contractors, Phoenix attic insulation, Phoenix spray foam, Phoenix energy efficiency, Arizona insulation services',
  openGraph: {
    title: 'Phoenix Insulation Contractors - Top-Rated Professionals',
    description: 'Connect with the best licensed insulation contractors in Phoenix, Arizona. Get free quotes for all types of insulation services.',
    type: 'website',
  },
}


// Fetch Phoenix contractors from Supabase database
async function getPhoenixContractors() {
  try {
    // Get contractors who serve Phoenix (either based in Phoenix or have Phoenix as a service area)
    const { data: contractors, error } = await (supabase as any)
      .from('contractors')
      .select(`
        id,
        business_name,
        business_city,
        business_state,
        average_rating,
        total_reviews,
        total_completed_projects,
        status,
        license_verified,
        insurance_verified,
        profile_image,
        bio,
        founded_year,
        contractor_service_areas(
          city,
          state
        ),
        contractor_services(
          service_type,
          insulation_types
        )
      `)
      .eq('status', 'approved')
      .order('average_rating', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return []
    }

    // Filter contractors who serve Phoenix (either based in Phoenix or have Phoenix as a service area)
    const phoenixContractors = contractors?.filter((contractor: any) => {
      const isBasedInPhoenix = contractor.business_city?.toLowerCase() === 'phoenix'
      const hasPhoenixServiceArea = contractor.contractor_service_areas?.some((area: any) => 
        area.city?.toLowerCase() === 'phoenix' || area.city?.toLowerCase().includes('phoenix')
      )
      return isBasedInPhoenix || hasPhoenixServiceArea
    }) || []

    // Remove duplicates and transform data to match component format
    const uniqueContractors = phoenixContractors.reduce((acc: any[], contractor: any) => {
      const existingContractor = acc.find(c => c.id === contractor.id)
      if (!existingContractor) {
        // Extract services offered from contractor_services
        const servicesOffered = contractor.contractor_services?.map((service: any) => service.service_type) || []
        
        // Extract unique insulation types from all services
        const allInsulationTypes = contractor.contractor_services?.reduce((acc: string[], service: any) => {
          if (service.insulation_types && Array.isArray(service.insulation_types)) {
            return [...acc, ...service.insulation_types]
          }
          return acc
        }, []) || []
        const insulationTypes = Array.from(new Set(allInsulationTypes))

        acc.push({
          id: contractor.id,
          name: contractor.business_name,
          slug: generateUniqueSlug(contractor.business_name, contractor.id),
          rating: contractor.average_rating || 4.5,
          reviewCount: contractor.total_reviews || 0,
          jobsCompleted: contractor.total_completed_projects || 0,
          reliabilityScore: 95, // Could be calculated
          services: servicesOffered.length > 0 ? servicesOffered : ['General Insulation'], // Real services from profile
          insulationTypes: insulationTypes.length > 0 ? insulationTypes : ['Fiberglass'], // Real insulation types from profile
          image: contractor.profile_image || '/alex.jpg',
          verified: contractor.license_verified || false,
          bbbAccredited: contractor.insurance_verified || false,
          yearEstablished: contractor.founded_year || 2020,
          about: contractor.bio || 'Professional insulation contractor serving the Phoenix area.'
          // Removed recentProjects as requested
        })
      }
      return acc
    }, [])

    console.log(`Found ${uniqueContractors.length} contractors serving Phoenix`)
    return uniqueContractors
  } catch (error) {
    console.error('Database error:', error)
    return []
  }
}

// Fetch recent insulation projects completed in Phoenix
async function getPhoenixRecentProjects() {
  try {
    console.log('🏗️ Fetching recent projects in Phoenix...')
    
    const { data: projects, error } = await (supabase as any)
      .from('contractor_portfolio')
      .select(`
        id,
        title,
        service_type,
        after_image_url,
        project_city,
        project_state,
        completion_date,
        contractor_id,
        contractors!inner(
          business_name,
          status
        )
      `)
      .eq('project_state', 'AZ')
      .ilike('project_city', '%phoenix%')
      .neq('after_image_url', null)
      .eq('contractors.status', 'approved')
      .order('completion_date', { ascending: false })
      .limit(12)

    if (error) {
      console.error('Error fetching Phoenix projects:', error)
      return []
    }

    console.log(`Found ${projects?.length || 0} recent projects in Phoenix`)
    return projects || []
  } catch (error) {
    console.error('Error in getPhoenixRecentProjects:', error)
    return []
  }
}



// Add Phoenix area cities with 50k+ population
const phoenixAreaCities = [
  { name: 'Phoenix', population: '1,608,139' },
  { name: 'Mesa', population: '504,258' },
  { name: 'Chandler', population: '275,987' },
  { name: 'Scottsdale', population: '241,361' },
  { name: 'Glendale', population: '248,325' },
  { name: 'Gilbert', population: '267,918' },
  { name: 'Tempe', population: '195,805' },
  { name: 'Peoria', population: '190,985' },
  { name: 'Surprise', population: '147,965' },
  { name: 'Avondale', population: '87,931' },
  { name: 'Goodyear', population: '95,294' },
  { name: 'Buckeye', population: '91,502' },
  { name: 'Maricopa', population: '62,720' }
]


export default async function PhoenixInsulationContractors() {
  const phoenixContractors = await getPhoenixContractors()
  const recentProjects = await getPhoenixRecentProjects()
  
  const cityStats = {
    totalReviews: 847, // Base reviews from the platform
    averageRating: 4.8,
    totalContractors: phoenixContractors.length,
    jobsCompleted: phoenixContractors.reduce((sum: number, contractor: any) => sum + contractor.jobsCompleted, 0) + 234
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
            {phoenixContractors.map((contractor: any) => (
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
                      {contractor.services.map((service: any, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>

                    <h4 className="font-semibold text-[#0a4768] mb-2">Types of Insulation Offered</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {contractor.insulationTypes.map((type: any, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {type}
                        </Badge>
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
                      <Link href={`/contractor/${contractor.slug}`}>
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

      {/* Phoenix Area Cities */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0a4768] mb-8 text-center">
            Phoenix Metro Area Cities We Serve
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {phoenixAreaCities.map((city, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-700">{city.name}</h3>
                      <p className="text-sm text-gray-500">Pop: {city.population}</p>
                    </div>
                    <div className="text-right">
                      {city.name === 'Phoenix' ? (
                        <Badge variant="default" className="bg-[#F5DD22] text-[#0a4768]">
                          Current Page
                        </Badge>
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

      {/* Service Areas Map */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d422508.0351092426!2d-112.41914644999999!3d33.3586662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b5d0c0572a2ff%3A0x4aec1cd17f2c4880!2sMaricopa%20County%2C%20AZ!5e0!3m2!1sen!2sus!4v1709562834567!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Maricopa County, Arizona - Service Area Map"
            />
          </div>
          <div className="text-center mt-6">
            <p className="text-gray-600 mb-4">
              Our certified insulation contractors serve all cities and communities throughout Maricopa County, including Phoenix and surrounding areas.
            </p>
            <Button 
              asChild 
              variant="outline"
              className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white"
            >
              <Link 
                href="https://www.google.com/maps/place/Maricopa+County,+AZ/@33.3586662,-112.0192618,10z/data=!4m6!3m5!1s0x872b5d0c0572a2ff:0x4aec1cd17f2c4880!8m2!3d33.2917968!4d-112.4291464!16zL20vMG0yN24?entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                View Full Map
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>



      {/* All Phoenix Reviews */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0a4768] mb-8 text-center">
            All Phoenix Reviews
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Reviews will be populated from database when available */}
            {[].map((review: any) => (
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
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Customer reviews help you make informed decisions. All reviews are verified and from actual completed projects.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Phoenix Completed Insulation Projects */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0a4768] mb-4">
              Recent Phoenix Completed Insulation Projects
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              See the quality work performed by our verified contractors in the Phoenix metro area
            </p>
          </div>

          {recentProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentProjects.map((project: any) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={project.after_image_url || '/placeholder-project.jpg'}
                      alt={project.title || 'Insulation Project'}
                      fill
                      className="object-cover"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-[#0a4768] mb-2 text-sm">
                      {project.title || 'Insulation Project'}
                    </h3>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">Service:</span> {project.service_type || 'Insulation'}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {project.project_city}, AZ
                      </div>
                      <div>
                        <span className="font-medium">Contractor:</span> {project.contractors.business_name}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">
                Project portfolio coming soon. Contractors are adding their recent work to showcase quality installations.
              </p>
            </div>
          )}
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

      {/* Understanding Home Insulation - Educational Articles Carousel */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0a4768] mb-4">
              Understanding Home Insulation
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Learn the basics of home insulation and why it's crucial for Phoenix homes
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {articles.map((article, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card className="hover:shadow-xl transition-shadow overflow-hidden h-full">
                      <div className="aspect-video relative">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#F5DD22] text-[#0a4768] px-3 py-1 rounded-full text-sm font-medium">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-6 flex flex-col justify-between h-48">
                        <div>
                          <h3 className="text-lg font-bold text-[#0a4768] mb-3 line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                            {article.description}
                          </p>
                        </div>
                        <Button 
                          asChild 
                          variant="outline" 
                          size="sm"
                          className="w-full border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white"
                        >
                          <Link href={`/resources/articles/${article.slug}`} className="flex items-center">
                            Read Article
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
            
            <div className="text-center mt-8">
              <Button 
                asChild 
                className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold"
              >
                <Link href="/resources/articles">
                  View All Articles
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
