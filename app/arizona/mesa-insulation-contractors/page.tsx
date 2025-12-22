import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QuoteButton } from '@/components/ui/quote-button'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { TruncatedText } from '@/components/ui/TruncatedText'
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
  ExternalLink,
  Home,
  Building,
  Wind,
  Snowflake,
  Flame,
  Wrench,
  Car
} from 'lucide-react'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { generateUniqueSlug } from '@/lib/slug-utils'
import { articles } from '@/lib/articles-data'
import { getContractorLogo } from '@/lib/contractor-utils'
import { createCitySchemas } from '@/lib/city-schema'
import { getCityMapUrl } from '@/lib/city-maps'
import { getCityServiceDescriptions } from '@/lib/city-service-descriptions'

// Revalidate this page every 60 seconds to show updated contractor data
export const revalidate = 60

// Generate dynamic metadata based on Mesa contractor data
export async function generateMetadata(): Promise<Metadata> {
  try {
    const contractors = await getMesaContractors()
    const contractorCount = contractors.length
    const topContractor = contractors[0]
    
    const baseTitle = 'Mesa Insulation Contractors'
    const baseDescription = 'Find the best insulation contractors in Mesa, AZ'
    
    return {
      title: 'Insulation Contractors in Mesa, AZ, Expert Licensed Companies - InsulationPal',
      description: `${baseDescription}. ${contractorCount} licensed professionals available. Get free quotes for attic, wall, spray foam, and basement insulation services.`,
      keywords: [
        'Mesa insulation contractors',
        'Mesa attic insulation',
        'Mesa spray foam insulation',
        'Mesa wall insulation',
        'Mesa basement insulation',
        'Mesa crawl space insulation',
        'Mesa energy efficiency',
        'Arizona insulation services',
        'Mesa insulation quotes',
        'licensed insulation contractors Mesa',
        'verified insulation professionals Mesa'
      ],
      openGraph: {
        title: `${baseTitle} - ${contractorCount} Top-Rated Professionals`,
        description: `Connect with ${contractorCount} licensed insulation contractors in Mesa, Arizona. Get free quotes for all types of insulation services.`,
        type: 'website',
        locale: 'en_US',
        siteName: 'InsulationPal',
        images: topContractor?.profile_image ? [{
          url: topContractor.profile_image,
          width: 1200,
          height: 630,
          alt: `${topContractor.business_name} - Mesa Insulation Contractor`,
        }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${baseTitle} - ${contractorCount} Top-Rated Professionals`,
        description: `Connect with ${contractorCount} licensed insulation contractors in Mesa, Arizona. Get free quotes today!`,
        images: topContractor?.profile_image ? [topContractor.profile_image] : undefined,
      },
      alternates: {
        canonical: 'https://insulationpal.com/arizona/mesa-insulation-contractors',
      },
    }
  } catch (error) {
    return {
      title: 'Mesa Insulation Contractors - InsulationPal',
      description: 'Find the best insulation contractors in Mesa, AZ. Get free quotes from licensed professionals.',
    }
  }
}


// Fetch Mesa contractors from Supabase database
async function getMesaContractors() {
  try {
    // Get contractors based in Mesa (business city from their profile)
    // Service areas are only used for lead bidding, not for city page display
    // Only show contractors with available credits
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
        bbb_accredited,
        license_number,
        profile_image,
        bio,
        founded_year,
        credits,
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
      .gt('credits', 0)
      .order('average_rating', { ascending: false })

    if (error) {
      return []
    }

    // Filter contractors who serve Mesa:
    // 1. Contractors based in Mesa (business_city matches)
    // 2. Contractors who have Mesa in their service areas
    const targetCity = 'mesa'
    const targetCityNormalized = targetCity.toLowerCase().trim()
    
    const mesaContractors = contractors?.filter((contractor: any) => {
      // Check if contractor is based in Mesa
      const isBasedInMesa = contractor.business_city?.toLowerCase().trim() === targetCityNormalized
      
      // Check if contractor serves Mesa via service areas
      const serviceAreas = contractor.contractor_service_areas || []
      const servesMesa = serviceAreas.some((area: any) => {
        const areaCity = area.city?.toLowerCase().trim()
        return areaCity === targetCityNormalized
      })
      
      return isBasedInMesa || servesMesa
    }) || []

    // Remove duplicates and transform data to match component format
    // Also mark which contractors are based in the city vs serve via service areas
    const uniqueContractors = mesaContractors.reduce((acc: any[], contractor: any) => {
      const existingContractor = acc.find(c => c.id === contractor.id)
      if (!existingContractor) {
        // Check if contractor is based in Mesa
        const isBasedInMesa = contractor.business_city?.toLowerCase().trim() === targetCityNormalized
        
        // Extract services offered from contractor_services and capitalize them
        const servicesOffered = contractor.contractor_services?.map((service: any) => {
          const serviceType = service.service_type || ''
          // Capitalize each word in the service type
          return serviceType.split(' ').map((word: string) => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ')
        }) || []
        
        // Extract unique insulation types from all services
        const allInsulationTypes = contractor.contractor_services?.reduce((acc: string[], service: any) => {
          if (service.insulation_types && Array.isArray(service.insulation_types)) {
            return [...acc, ...service.insulation_types]
          }
          return acc
        }, [])
        const insulationTypes = Array.from(new Set(allInsulationTypes))

        acc.push({
          id: contractor.id,
          name: contractor.business_name,
          slug: generateUniqueSlug(contractor.business_name, contractor.id),
          rating: contractor.average_rating || 4.5,
          reviewCount: contractor.total_reviews || 0,
          jobsCompleted: contractor.total_completed_projects || 0,
          reliabilityScore: 95, // Could be calculated
          services: servicesOffered.length > 0 ? servicesOffered : ['Basement', 'Attic', 'Garage', 'Crawl Space', 'Walls'],
          insulationTypes: insulationTypes.length > 0 ? insulationTypes : ['Fiberglass'],
          image: getContractorLogo(contractor.profile_image),
          verified: contractor.license_verified || false,
          bbbAccredited: contractor.bbb_accredited || false,
          licensedBondedInsured: Boolean(contractor.license_verified && contractor.insurance_verified),
          licenseNumber: contractor.license_number || '',
          yearEstablished: contractor.founded_year || 2020,
          about: contractor.bio || 'Professional insulation contractor serving the Mesa area.',
          isBasedInCity: isBasedInMesa // Flag to sort city-based contractors first
        })
      }
      return acc
    }, [])
    
    // Sort: City-based contractors first, then by rating (descending)
    uniqueContractors.sort((a: any, b: any) => {
      // First, sort by isBasedInCity (true comes first)
      if (a.isBasedInCity && !b.isBasedInCity) return -1
      if (!a.isBasedInCity && b.isBasedInCity) return 1
      // If both are in the same group, sort by rating (descending)
      return (b.rating || 0) - (a.rating || 0)
    })
    
    return uniqueContractors
  } catch (error) {
    return []
  }
}

// Fetch recent insulation projects completed in Mesa
async function getMesaRecentProjects() {
  try {
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
      .ilike('project_city', 'mesa')
      .neq('after_image_url', null)
      .eq('contractors.status', 'approved')
      .order('completion_date', { ascending: false })
      .limit(12)

    if (error) {
      return []
    }

    return projects || []
  } catch (error) {
    return []
  }
}

// Fetch Mesa contractor reviews
async function getMesaReviews() {
  try {
    // Try to fetch reviews with location containing Mesa
    const { data: locationReviews, error: locationError } = await (supabase as any)
      .from('reviews')
      .select(`
        id,
        customer_name,
        rating,
        title,
        comment,
        service_type,
        location,
        verified,
        created_at,
        contractors!inner(
          business_name,
          business_city,
          business_state,
          status
        )
      `)
      .eq('contractors.status', 'approved')
      .ilike('location', '%Mesa%')
      .order('created_at', { ascending: false })
      .limit(10)

    // Try to fetch reviews from contractors based in Mesa
    const { data: contractorReviews, error: contractorError } = await (supabase as any)
      .from('reviews')
      .select(`
        id,
        customer_name,
        rating,
        title,
        comment,
        service_type,
        location,
        verified,
        created_at,
        contractors!inner(
          business_name,
          business_city,
          business_state,
          status
        )
      `)
      .eq('contractors.status', 'approved')
      .ilike('contractors.business_city', '%Mesa%')
      .order('created_at', { ascending: false })
      .limit(10)

    // Combine and deduplicate results
    const allReviews = []
    const seenIds = new Set()

    // Add location-based reviews
    if (locationReviews) {
      for (const review of locationReviews) {
        if (!seenIds.has(review.id)) {
          allReviews.push(review)
          seenIds.add(review.id)
        }
      }
    }

    // Add contractor-based reviews
    if (contractorReviews) {
      for (const review of contractorReviews) {
        if (!seenIds.has(review.id)) {
          allReviews.push(review)
          seenIds.add(review.id)
        }
      }
    }

    // Sort by created_at descending and limit to 15
    allReviews.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    const finalReviews = allReviews.slice(0, 15)

    return finalReviews
  } catch (error) {
    return []
  }
}

// Add Mesa area cities with 50k+ population
const mesaAreaCities = [
  { name: 'Mesa', population: '504,258', slug: 'mesa' },
  { name: 'Phoenix', population: '1,608,139', slug: 'phoenix' },
  { name: 'Chandler', population: '275,987', slug: 'chandler' },
  { name: 'Scottsdale', population: '241,361', slug: 'scottsdale' },
  { name: 'Gilbert', population: '267,918', slug: 'gilbert' },
  { name: 'Tempe', population: '195,805', slug: 'tempe' },
  { name: 'Glendale', population: '248,325', slug: 'glendale' }
]

export default async function MesaInsulationContractors() {
  const schemas = createCitySchemas('Mesa', 'Arizona', '/arizona/mesa-insulation-contractors')
  const mapUrl = getCityMapUrl('mesa', 'Mesa, AZ')
  const serviceDescriptions = getCityServiceDescriptions('Mesa')
  
  const mesaContractors = await getMesaContractors()
  const recentProjects = await getMesaRecentProjects()
  const mesaReviews = await getMesaReviews()
  
  const cityStats = {
    totalReviews: mesaContractors.reduce((sum: number, contractor: any) => sum + contractor.reviewCount, 0),
    averageRating: mesaContractors.length > 0 ? 
      (mesaContractors.reduce((sum: number, contractor: any) => sum + contractor.rating, 0) / mesaContractors.length).toFixed(1) : 
      '4.8',
    totalContractors: mesaContractors.length,
    jobsCompleted: mesaContractors.reduce((sum: number, contractor: any) => sum + contractor.jobsCompleted, 0)
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.brand) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }} />
      <main className="min-h-screen">
      <Header />
      
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Arizona', href: '/arizona' },
        { label: 'Mesa' }
      ]} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-16">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0a4768] mb-6">
              Hire a Licensed Insulation Contractor in Mesa
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Find the best insulation contractors in Mesa, Arizona. Get free quotes from local, 
              licensed professionals who understand Mesa's unique climate challenges.
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
              Get Free Mesa Quotes
            </QuoteButton>
          </div>
        </div>
      </section>

      {/* Insulation Information */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="grid lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0a4768]">Insulation Types for Mesa</CardTitle>
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
      <section className="py-16 bg-[#D6D6D6]">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <h2 className="text-3xl font-bold text-[#0a4768] mb-12 text-center">
            Top Mesa Insulation Contractors
          </h2>
          <div className="space-y-8">
            {mesaContractors.map((contractor: any) => (
              <Card key={contractor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid lg:grid-cols-4 gap-6 p-6">
                  {/* Company Info */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative w-32 h-32 rounded-full bg-white border border-gray-200 overflow-hidden flex items-center justify-center">
                        <Image
                          src={contractor.image}
                          alt={contractor.name}
                          fill
                          className="object-contain scale-115"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#0a4768] leading-[26px]">{contractor.name}</h3>
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
                      <div className="space-y-1">
                        {contractor.bbbAccredited && (
                          <div className="flex items-center text-green-600 text-sm">
                            <Award className="w-4 h-4 mr-1" />
                            BBB Accredited
                          </div>
                        )}
                        {contractor.licensedBondedInsured && (
                          <div className="flex items-center text-green-600 text-sm">
                            <Shield className="w-4 h-4 mr-1" />
                            <span>Licensed, Bonded & Insured</span>
                          </div>
                        )}
                        {contractor.licenseNumber && (
                          <div className="flex items-center text-gray-600 text-xs ml-5">
                            {contractor.verified && (
                              <div className="bg-green-500 rounded-full p-0.5 mr-1.5">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                            License # {contractor.licenseNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Services & About */}
                  <div className="lg:col-span-2">
                    <h4 className="font-semibold text-[#0a4768] mb-2">About</h4>
                    <p className="text-gray-700 mb-4 text-sm leading-[24px]">
                      {contractor.about && contractor.about.length > 250 
                        ? `${contractor.about.substring(0, 250)}...` 
                        : contractor.about}
                    </p>
                    
                    <h4 className="font-semibold text-[#0a4768] mb-2">Services Offered</h4>
                    <div className="text-gray-700 mb-4 text-sm">
                      {contractor.services.join(', ')}
                    </div>

                    <h4 className="font-semibold text-[#0a4768] mb-2">Types of Insulation Offered</h4>
                    <div className="text-gray-700 mb-4 text-sm">
                      {contractor.insulationTypes.join(', ')}
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

      {/* Finding a Qualified Insulation Contractor in Mesa */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-[#0a4768] mb-8 text-center">
            Finding a Qualified Insulation Contractor in Mesa
          </h2>
          
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              Trying to find a reliable insulation contractor in Mesa? Yeah, it can be a real headache—verifying licenses, sorting through prices, and figuring out who actually does good work. InsulationPal has expanded its network to include local insulation contractors in Mesa, so folks in Arizona can get connected with vetted pros and snag up to three solid bids for their projects. No more second-guessing who to hire; every contractor goes through checks for licensing and insurance.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              We get it—good insulation isn't just about comfort, it's about keeping those energy bills from spiraling out of control, especially with Arizona's wild weather. Our platform is basically a shortcut for Mesa homeowners: you get access to pre-screened contractors, minus the endless research and credential-checking rabbit holes.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              By teaming up with established local pros across Mesa and Arizona, we're aiming for a system that actually works for everyone. Homeowners find quality help, and licensed contractors meet real customers. It's free for homeowners, pretty simple, and matches each project with the right person for the job.
            </p>
            
            <Card className="bg-[#D8E1FF] border-[#0a4768] shadow-lg mt-8">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-[#0a4768] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#0a4768] mb-3">Ready to Find Your Mesa Contractor?</h3>
                <p className="text-lg text-gray-700 mb-2">
                  Connect with pre-screened, licensed, and insured insulation professionals in Mesa, AZ.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  Get up to 3 free quotes today!
                </p>
                <QuoteButton className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3 text-lg">
                  See Prices
                </QuoteButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mesa Area Cities */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <h2 className="text-3xl font-bold text-[#0a4768] mb-8 text-center">
            Additional Nearby Cities We Serve
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mesaAreaCities.map((city, index) => (
              city.name === 'Mesa' ? (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-700">{city.name}</h3>
                        <p className="text-sm text-gray-500">Pop: {city.population}</p>
                      </div>
                      <Badge variant="default" className="bg-[#F5DD22] text-[#0a4768]">
                        Current Page
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Link key={index} href={`/arizona/${city.slug}-insulation-contractors`} className="hover:no-underline">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-[#0a4768]">{city.name}</h3>
                          <p className="text-sm text-gray-500">Pop: {city.population}</p>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs">
                          View Contractors
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas Map */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={mapUrl}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mesa, Arizona - Service Area Map"
            />
          </div>
          <div className="text-center mt-6">
            <p className="text-gray-600 mb-4">
              Our certified insulation contractors serve all cities and communities throughout Mesa and the surrounding East Valley area.
            </p>
            <Button 
              asChild 
              variant="outline"
              className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white"
            >
              <Link 
                href="https://www.google.com/maps/place/Mesa,+AZ"
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

      {/* Mesa Reviews Carousel */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0a4768] mb-4">
              Latest Mesa Reviews
            </h2>
            <p className="text-lg text-gray-600">
              See what customers are saying about our Mesa insulation contractors
            </p>
          </div>
          
          {mesaReviews.length > 0 ? (
            <div className="max-w-[1400px] mx-auto">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {mesaReviews.map((review: any) => (
                    <CarouselItem key={review.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                      <Card className="border-l-4 border-l-[#F5DD22] h-full">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex items-center mb-4">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="ml-2 font-semibold">{review.rating}.0</span>
                            {review.verified && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          
                          {review.title && (
                            <h4 className="font-semibold text-[#0a4768] mb-2 text-sm">
                              {review.title}
                            </h4>
                          )}
                          
                          <TruncatedText 
                            text={review.comment || ''} 
                            maxLength={350}
                            className="mb-4 flex-grow"
                          />
                          
                          <div className="text-xs text-gray-600 mt-auto">
                            <div className="font-medium">{review.customer_name}</div>
                            <div className="text-[#0a4768]">{review.contractors.business_name}</div>
                            <div>{new Date(review.created_at).toLocaleDateString()}</div>
                            {review.service_type && (
                              <div className="text-[#0a4768] mt-1 font-medium">
                                {review.service_type}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
              
              <div className="text-center mt-8">
                <p className="text-gray-600 text-sm">
                  Showing {mesaReviews.length} of the latest reviews from Mesa customers
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h4>
              <p className="text-gray-600">
                Mesa contractor reviews will appear here as customers share their experiences.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Mesa Completed Projects */}
      <section className="py-12 bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6]">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0a4768] mb-4">
              Recent Mesa Completed Projects
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              See the quality work performed by our verified contractors in the Mesa metro area
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

      {/* Services Carousel */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0a4768] mb-4">
              Our Contractor Insulation Services
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Comprehensive insulation solutions for every part of your Mesa home
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
                {[
                  {
                    icon: Home,
                    title: 'Attic Insulation',
                    description: serviceDescriptions.attic,
                    image: '/attic-insulation-blown-in.jpg',
                    url: '/services/attic-insulation'
                  },
                  {
                    icon: Building,
                    title: 'Wall Insulation',
                    description: serviceDescriptions.wall,
                    image: '/contractor-installing-wall-insulation.jpg',
                    url: '/services/wall-insulation'
                  },
                  {
                    icon: Wind,
                    title: 'Spray Foam Insulation',
                    description: serviceDescriptions.sprayFoam,
                    image: '/spray-foam-insulation-installed.jpg',
                    url: '/services/spray-foam-insulation'
                  },
                  {
                    icon: Snowflake,
                    title: 'Crawl Space Insulation',
                    description: serviceDescriptions.crawlSpace,
                    image: '/crawl-space-insulation-installed.jpg',
                    url: '/services/crawl-space-insulation'
                  },
                  {
                    icon: Flame,
                    title: 'Basement Insulation',
                    description: serviceDescriptions.basement,
                    image: '/basement-insulation-installed.jpg',
                    url: '/services/basement-insulation'
                  },
                  {
                    icon: Car,
                    title: 'Garage Insulation',
                    description: serviceDescriptions.garage,
                    image: '/garage-wall-ceiling-attic-door-panel-insulation.jpg',
                    url: '/services/garage-insulation'
                  },
                  {
                    icon: Wrench,
                    title: 'Insulation Removal',
                    description: serviceDescriptions.removal,
                    image: '/insulation-removal.jpg',
                    url: '/services/insulation-removal'
                  }
                ].map((service, index) => {
                  const Icon = service.icon
                  return (
                    <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                      <Card className="hover:shadow-xl transition-shadow overflow-hidden h-full flex flex-col">
                        <div className="relative h-48">
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover"
                            loading="lazy"
                          />
                          <div className="absolute top-4 left-4 bg-[#F5DD22] rounded-full p-3">
                            <Icon className="h-6 w-6 text-[#0a4768]" />
                          </div>
                        </div>
                        <CardContent className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-bold text-[#0a4768] mb-3">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 flex-grow">
                            {service.description}
                          </p>
                          <Button 
                            asChild 
                            className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold"
                          >
                            <Link href={service.url}>
                              Learn More
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Understanding Home Insulation - Educational Articles Carousel */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0a4768] mb-4">
              Understanding Home Insulation
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Learn the basics of home insulation and why it's crucial for Mesa homes
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
                      <CardContent className="p-6 flex flex-col justify-between min-h-[240px]">
                        <div>
                          <Link href={`/resources/articles/${article.slug}`}>
                            <h3 className="text-lg font-bold text-[#0a4768] mb-3 line-clamp-2 hover:underline cursor-pointer">
                              {article.title}
                            </h3>
                          </Link>
                          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                            {article.description}
                          </p>
                        </div>
                        <Button 
                          asChild 
                          variant="outline" 
                          className="w-full border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white"
                        >
                          <Link href={`/resources/articles/${article.slug}`} className="flex items-center justify-center">
                            Read Article
                            <ExternalLink className="w-4 h-4 ml-2" />
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

      {/* CTA Section */}
      <section className="py-16 bg-[#D6D6D6] text-[#0a4768]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Improve Your Mesa Home?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with Mesa's most trusted insulation contractors. Get free quotes from verified professionals 
            who understand the unique insulation needs of desert homes.
          </p>
          <QuoteButton className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3 text-lg">
            Get Mesa Quotes Now
          </QuoteButton>
        </div>
      </section>

      <Footer />
    </main>
    </>
  )
}

