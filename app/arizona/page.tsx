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
import { supabase } from '@/lib/supabase'
import { generateUniqueSlug } from '@/lib/slug-utils'
import { getContractorLogo } from '@/lib/contractor-utils'

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

// Revalidate this page every 60 seconds to show updated contractor data
export const revalidate = 60

// Fetch contractors from Supabase database who serve Arizona
async function getArizonaContractors() {
  try {
    // Get contractors who have service areas in Arizona (AZ) OR are based in Arizona
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
        profile_image,
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
      .limit(50)

    if (error) {
      console.error('Error fetching contractors:', error)
      // If the error is about missing bbb_accredited column, continue without it
      if (error.message && error.message.includes('bbb_accredited')) {
        console.warn('⚠️ bbb_accredited column not found - BBB badges will not display')
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
          console.error('Database error on retry:', retryError)
          return []
        }
        
        // Process contractors without bbb_accredited
        const arizonaContractors = contractorsRetry?.filter((contractor: any) => {
          const contractorState = contractor.business_state?.toLowerCase()
          const serviceAreas = contractor.contractor_service_areas || []
          const servesArizona = serviceAreas.some((area: any) => 
            area.state?.toLowerCase() === 'arizona'
          )
          return contractorState === 'arizona' || servesArizona
        }) || []

        // Remove duplicates and format contractor data
        const uniqueContractors = arizonaContractors.reduce((acc: any[], contractor: any) => {
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
              city: contractor.business_city || 'Phoenix',
              services: servicesOffered.length > 0 ? servicesOffered : ['Basement', 'Attic', 'Garage', 'Crawl Space', 'Walls'], // Real services from profile
              insulationTypes: insulationTypes.length > 0 ? insulationTypes : ['Fiberglass'], // Real insulation types from profile
              image: getContractorLogo(contractor.profile_image),
              verified: contractor.license_verified || false,
              bbbAccredited: false, // Column doesn't exist yet
              licensedBondedInsured: Boolean(contractor.license_verified && contractor.insurance_verified)
            })
          }
          return acc
        }, [])

        return uniqueContractors
      }
      return []
    }

    // Filter contractors who serve Arizona (either based in AZ or have service areas in AZ)
    const arizonaContractors = contractors?.filter((contractor: any) => {
      const isBasedInAZ = contractor.business_state === 'AZ'
      const hasAZServiceAreas = contractor.contractor_service_areas?.some((area: any) => area.state === 'AZ')
      return isBasedInAZ || hasAZServiceAreas
    }) || []

    // Remove duplicates and format contractor data
    const uniqueContractors = arizonaContractors.reduce((acc: any[], contractor: any) => {
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
          city: contractor.business_city || 'Phoenix',
          services: servicesOffered.length > 0 ? servicesOffered : ['Basement', 'Attic', 'Garage', 'Crawl Space', 'Walls'], // Real services from profile
          insulationTypes: insulationTypes.length > 0 ? insulationTypes : ['Fiberglass'], // Real insulation types from profile
          image: getContractorLogo(contractor.profile_image),
          verified: contractor.license_verified || false,
          bbbAccredited: contractor.bbb_accredited || false,
          licensedBondedInsured: Boolean(contractor.license_verified && contractor.insurance_verified)
        })
      }
      return acc
    }, [])

    console.log(`Found ${uniqueContractors.length} contractors serving Arizona`)
    
    // Debug: Log contractor badge status
    uniqueContractors.forEach((contractor: any) => {
      console.log(`🏷️ ${contractor.name}:`)
      console.log(`   BBB Accredited: ${contractor.bbbAccredited}`)
      console.log(`   Licensed, Bonded & Insured: ${contractor.licensedBondedInsured}`)
    })
    
    return uniqueContractors
  } catch (error) {
    console.error('Database error:', error)
    return []
  }
}

// Fetch recent insulation projects completed in Arizona
async function getArizonaRecentProjects() {
  try {
    console.log('🏗️ Fetching recent projects in Arizona...')
    
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
      .neq('after_image_url', null)
      .eq('contractors.status', 'approved')
      .order('completion_date', { ascending: false })
      .limit(12)

    if (error) {
      console.error('Error fetching Arizona projects:', error)
      return []
    }

    console.log(`Found ${projects?.length || 0} recent projects in Arizona`)
    return projects || []
  } catch (error) {
    console.error('Error in getArizonaRecentProjects:', error)
    return []
  }
}

export default async function ArizonaInsulationContractors() {
  const contractors = await getArizonaContractors()
  const recentProjects = await getArizonaRecentProjects()
  const topContractors = contractors.slice(0, 6) // Top 6 contractors
  const allContractors = contractors // All contractors

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
    totalReviews: allContractors.reduce((sum: number, contractor: any) => sum + contractor.reviewCount, 0),
    averageRating: allContractors.length > 0 ? (allContractors.reduce((sum: number, contractor: any) => sum + contractor.rating, 0) / allContractors.length).toFixed(1) : '0.0',
    totalJobsCompleted: allContractors.reduce((sum: number, contractor: any) => sum + contractor.jobsCompleted, 0)
  }

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
            {topContractors.map((contractor: any, index: number) => (
              <Card key={contractor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden p-1">
                          <Image
                            src={contractor.image || '/alex.jpg'}
                            alt={contractor.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-contain"
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                          />
                        </div>
                        {contractor.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                            <CheckCircle className="w-4 h-4 text-white" />
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
                    <div className="space-y-1">
                      {contractor.bbbAccredited && (
                        <div className="flex items-center text-sm text-green-600">
                          <Award className="w-4 h-4 mr-1" />
                          BBB Accredited
                        </div>
                      )}
                      {contractor.licensedBondedInsured && (
                        <div className="flex items-center text-sm text-green-600">
                          <Shield className="w-4 h-4 mr-1" />
                          Licensed, Bonded & Insured
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Services Offered:</div>
                    <div className="flex flex-wrap gap-1">
                      {getServiceBadges(contractor.services)}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Types of Insulation Offered:</div>
                    <div className="flex flex-wrap gap-1">
                      {getServiceBadges(contractor.insulationTypes)}
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
                      <Link href={`/contractor/${contractor.slug}`}>
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
                {allContractors.map((contractor: any) => (
                  <tr key={contractor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative mr-4">
                          <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden p-1">
                            <Image
                              src={contractor.image}
                              alt={contractor.name}
                              width={56}
                              height={56}
                              className="w-full h-full object-contain"
                              loading="lazy"
                              placeholder="blur"
                              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                            />
                          </div>
                          {contractor.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                              <CheckCircle className="w-3 h-3 text-white" />
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
                        {contractor.services.slice(0, 3).map((service: any, index: number) => (
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
                          <Link href={`/contractor/${contractor.slug}`}>
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

      {/* Recent Projects Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0a4768] mb-4">
              Recent Insulation Projects Completed in Arizona
            </h2>
            <p className="text-lg text-gray-600">
              See the quality work performed by our verified contractors across Arizona
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
