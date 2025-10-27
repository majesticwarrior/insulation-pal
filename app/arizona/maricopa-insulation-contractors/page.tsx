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
  ExternalLink
} from 'lucide-react'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { generateUniqueSlug } from '@/lib/slug-utils'
import { articles } from '@/lib/articles-data'
import { getContractorLogo } from '@/lib/contractor-utils'

// Revalidate this page every 60 seconds to show updated contractor data
export const revalidate = 60

// Generate dynamic metadata based on Maricopa contractor data
export async function generateMetadata(): Promise<Metadata> {
  try {
    const contractors = await getMaricopaContractors()
    const contractorCount = contractors.length
    const topContractor = contractors[0]
    
    const baseTitle = 'Maricopa Insulation Contractors'
    const baseDescription = 'Find the best insulation contractors in Maricopa, AZ'
    
    return {
      title: `Maricopa Insulation Contractors, Find Top Rated Local Companies Near You`,
      description: `${baseDescription}. ${contractorCount} licensed professionals available. Get free quotes for attic, wall, spray foam, and basement insulation services.`,
      keywords: [
        'Maricopa insulation contractors',
        'Maricopa attic insulation',
        'Maricopa spray foam insulation',
        'Maricopa wall insulation',
        'Maricopa basement insulation',
        'Maricopa crawl space insulation',
        'Maricopa energy efficiency',
        'Arizona insulation services',
        'Maricopa insulation quotes',
        'licensed insulation contractors Maricopa',
        'verified insulation professionals Maricopa'
      ],
      openGraph: {
        title: `${baseTitle} - ${contractorCount} Top-Rated Professionals`,
        description: `Connect with ${contractorCount} licensed insulation contractors in Phoenix, Arizona. Get free quotes for all types of insulation services.`,
        type: 'website',
        locale: 'en_US',
        siteName: 'InsulationPal',
        images: topContractor?.profile_image ? [{
          url: topContractor.profile_image,
          width: 1200,
          height: 630,
          alt: `${topContractor.business_name} - Phoenix Insulation Contractor`,
        }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${baseTitle} - ${contractorCount} Top-Rated Professionals`,
        description: `Connect with ${contractorCount} licensed insulation contractors in Phoenix, Arizona. Get free quotes today!`,
        images: topContractor?.profile_image ? [topContractor.profile_image] : undefined,
      },
      alternates: {
        canonical: 'https://insulationpal.com/arizona/maricopa-insulation-contractors',
      },
    }
  } catch (error) {
    return {
      title: 'Maricopa Insulation Contractors - InsulationPal',
      description: 'Find the best insulation contractors in Maricopa, AZ. Get free quotes from licensed professionals.',
    }
  }
}


// Fetch Maricopa contractors from Supabase database
async function getMaricopaContractors() {
  try {
    // Get contractors based in Maricopa (business city from their profile)
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
      // If the error is about missing bbb_accredited column, continue without it
      if (error.message && error.message.includes('bbb_accredited')) {
        // Retry query without bbb_accredited column
        const { data: contractorsRetry, error: retryError } = await (supabase as any)
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

        if (retryError) {
          return []
        }
        
        // Process contractors without bbb_accredited
        // Filter by business_city only - service areas are NOT used for city page display
        const phoenixContractors = contractorsRetry?.filter((contractor: any) => {
          const contractorCity = contractor.business_city?.toLowerCase()
          return contractorCity === 'phoenix'
        }) || []

        // Remove duplicates and transform data to match component format
        const uniqueContractors = phoenixContractors.reduce((acc: any[], contractor: any) => {
          const existingContractor = acc.find(c => c.id === contractor.id)
          if (!existingContractor) {
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
            }, []) || []
            
            const insulationTypes = [...new Set(allInsulationTypes)]

            acc.push({
              id: contractor.id,
              name: contractor.business_name,
              slug: generateUniqueSlug(contractor.business_name, contractor.id),
              rating: contractor.average_rating || 4.5,
              reviewCount: contractor.total_reviews || 0,
              jobsCompleted: contractor.total_completed_projects || 0,
              reliabilityScore: 95, // Could be calculated
              services: servicesOffered.length > 0 ? servicesOffered : ['Basement', 'Attic', 'Garage', 'Crawl Space', 'Walls'], // Real services from profile
              insulationTypes: insulationTypes.length > 0 ? insulationTypes : ['Fiberglass'], // Real insulation types from profile
              image: getContractorLogo(contractor.profile_image),
              verified: contractor.license_verified || false,
              bbbAccredited: false, // Column doesn't exist yet
              licensedBondedInsured: Boolean(contractor.license_verified && contractor.insurance_verified),
              yearEstablished: contractor.founded_year || 2020,
              about: contractor.bio || 'Professional insulation contractor serving the Phoenix area.'
              // Removed recentProjects as requested
            })
          }
          return acc
        }, [])

        return uniqueContractors
      }
      return []
    }

    // Filter contractors who are based in Maricopa (business_city from their business address)
    // Service areas are NOT used for city page display - they're only for lead bidding
    const maricopaContractors = contractors?.filter((contractor: any) => {
      const isBasedInMaricopa = contractor.business_city?.toLowerCase() === 'maricopa'
      return isBasedInMaricopa
    }) || []

    // Remove duplicates and transform data to match component format
    const uniqueContractors = maricopaContractors.reduce((acc: any[], contractor: any) => {
      const existingContractor = acc.find(c => c.id === contractor.id)
      if (!existingContractor) {
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
          services: servicesOffered.length > 0 ? servicesOffered : ['Basement', 'Attic', 'Garage', 'Crawl Space', 'Walls'], // Real services from profile
          insulationTypes: insulationTypes.length > 0 ? insulationTypes : ['Fiberglass'], // Real insulation types from profile
          image: getContractorLogo(contractor.profile_image),
          verified: contractor.license_verified || false,
          bbbAccredited: contractor.bbb_accredited || false,
          licensedBondedInsured: Boolean(contractor.license_verified && contractor.insurance_verified),
          licenseNumber: contractor.license_number || '',
          yearEstablished: contractor.founded_year || 2020,
          about: contractor.bio || 'Professional insulation contractor serving the Phoenix area.'
          // Removed recentProjects as requested
        })
      }
      return acc
    }, [])
    
    return uniqueContractors
  } catch (error) {
    return []
  }
}

// Fetch recent insulation projects completed in Phoenix
async function getPhoenixRecentProjects() {
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
      .ilike('project_city', '%phoenix%')
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

// Fetch Maricopa contractor reviews
async function getPhoenixReviews() {
  try {
    // Try to fetch reviews with location containing Maricopa
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
      .ilike('location', '%Maricopa%')
      .order('created_at', { ascending: false })
      .limit(10)

    // Try to fetch reviews from contractors based in Phoenix
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
      .ilike('contractors.business_city', '%Maricopa%')
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

    // If no Maricopa reviews found, fallback to Phoenix reviews
    if (allReviews.length === 0) {
      const { data: phoenixLocationReviews } = await (supabase as any)
        .from('reviews').select(`id,customer_name,rating,title,comment,service_type,location,verified,created_at,contractors!inner(business_name,business_city,business_state,status)`).eq('contractors.status', 'approved').ilike('location', '%Phoenix%').order('created_at', { ascending: false }).limit(10)
      const { data: phoenixContractorReviews } = await (supabase as any)
        .from('reviews').select(`id,customer_name,rating,title,comment,service_type,location,verified,created_at,contractors!inner(business_name,business_city,business_state,status)`).eq('contractors.status', 'approved').ilike('contractors.business_city', '%Phoenix%').order('created_at', { ascending: false }).limit(10)
      if (phoenixLocationReviews) { for (const review of phoenixLocationReviews) { if (!seenIds.has(review.id)) { allReviews.push(review); seenIds.add(review.id); } } }
      if (phoenixContractorReviews) { for (const review of phoenixContractorReviews) { if (!seenIds.has(review.id)) { allReviews.push(review); seenIds.add(review.id); } } }
    }

    // Sort by created_at descending and limit to 15
    allReviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    const finalReviews = allReviews.slice(0, 15)

    return finalReviews
  } catch (error) {
    return []
  }
}



// Add Maricopa area cities with 50k+ population
const maricopaAreaCities = [
  { name: 'Maricopa', population: '61,908', slug: 'maricopa' },
  { name: 'Phoenix', population: '1,608,139', slug: 'phoenix' },
  { name: 'Chandler', population: '275,987', slug: 'chandler' },
  { name: 'Gilbert', population: '267,918', slug: 'gilbert' },
  { name: 'Casa Grande', population: '55,653', slug: 'casa-grande' }
]


export default async function MaricopaInsulationContractors() {
  const maricopaContractors = await getMaricopaContractors()
  const recentProjects = await getPhoenixRecentProjects()
  const phoenixReviews = await getPhoenixReviews()
  
  const cityStats = {
    totalReviews: maricopaContractors.reduce((sum: number, contractor: any) => sum + contractor.reviewCount, 0),
    averageRating: maricopaContractors.length > 0 ? 
      (maricopaContractors.reduce((sum: number, contractor: any) => sum + contractor.rating, 0) / maricopaContractors.length).toFixed(1) : 
      '4.8',
    totalContractors: maricopaContractors.length,
    jobsCompleted: maricopaContractors.reduce((sum: number, contractor: any) => sum + contractor.jobsCompleted, 0)
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
      
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Arizona', href: '/arizona' },
        { label: 'Maricopa' }
      ]} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0a4768] mb-6">
              Maricopa Insulation Contractors
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Find the best insulation contractors in Maricopa, Arizona. Get free quotes from local, 
              licensed professionals who understand Maricopa's unique climate challenges.
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
              Get Free Maricopa Quotes
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
                <CardTitle className="text-[#0a4768]">Insulation Types for Maricopa</CardTitle>
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
            Top Maricopa Insulation Contractors
          </h2>
          <div className="space-y-8">
            {maricopaContractors.map((contractor: any) => (
              <Card key={contractor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid lg:grid-cols-4 gap-6 p-6">
                  {/* Company Info */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative">
                        <Image
                          src={contractor.image}
                          alt={contractor.name}
                          width={100}
                          height={100}
                          className="w-25 h-25 rounded-full object-cover"
                        />
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
                    <p className="text-gray-700 mb-4 text-sm leading-[24px]">{contractor.about}</p>
                    
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
            Additional Nearby Cities We Serve
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {maricopaAreaCities.map((city, index) => (
              city.name === 'Maricopa' ? (
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
        <div className="container mx-auto px-4">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52852.05642346523!2d-112.0476029!3d33.0581063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872ade8e8e8e8e8d%3A0x7e8f01e1da73e80!2sMaricopa%2C%20AZ!5e0!3m2!1sen!2sus!4v1709562834567"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Maricopa, Arizona - Service Area Map"
            />
          </div>
          <div className="text-center mt-6">
            <p className="text-gray-600 mb-4">
              Our certified insulation contractors serve all cities and communities throughout Maricopa and the surrounding East Valley area.
            </p>
            <Button 
              asChild 
              variant="outline"
              className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white"
            >
              <Link 
                href="https://www.google.com/maps/place/Maricopa,+AZ"
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



      {/* Phoenix Reviews Carousel */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0a4768] mb-4">
              Latest Maricopa Reviews
            </h2>
            <p className="text-lg text-gray-600">
              See what customers are saying about our Maricopa insulation contractors
            </p>
          </div>
          
          {phoenixReviews.length > 0 ? (
            <div className="max-w-6xl mx-auto">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {phoenixReviews.map((review: any) => (
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
                  Showing {phoenixReviews.length} of the latest reviews from Phoenix customers
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h4>
              <p className="text-gray-600">
                Phoenix contractor reviews will appear here as customers share their experiences.
              </p>
            </div>
          )}
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
            Ready to Improve Your Maricopa Home?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with Maricopa's most trusted insulation contractors. Get free quotes from verified professionals 
            who understand the unique insulation needs of desert homes.
          </p>
          <QuoteButton className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3 text-lg">
            Get Maricopa Quotes Now
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
