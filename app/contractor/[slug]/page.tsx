import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QuoteButton } from '@/components/ui/quote-button'
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Shield, 
  Award, 
  Users, 
  CheckCircle,
  Calendar,
  DollarSign,
  Wrench,
  ExternalLink
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { extractIdFromSlug } from '@/lib/slug-utils'
import Link from 'next/link'
import { getContractorLogo } from '@/lib/contractor-utils'

// Dynamic route - will be rendered on demand
import type { Metadata } from 'next'

interface ContractorPageProps {
  params: Promise<{ slug: string }>
}

interface ContractorProject {
  id: string
  title: string
  description?: string
  service_type: string
  project_size_sqft?: number
  completion_date?: string
  before_image_url?: string
  after_image_url?: string
  additional_images?: string[]
  project_city: string
  project_state: string
  is_featured: boolean
  display_order: number
}

// Fetch contractor data from database by slug or ID
async function getContractorBySlug(slug: string) {
  try {
    console.log('🔍 Fetching contractor by slug:', slug)
    
    // First, try to extract ID from slug
    const extractedId = extractIdFromSlug(slug)
    console.log('🔍 Extracted ID from slug:', extractedId)
    
    let contractorId = extractedId
    
    // If no ID extracted, try direct lookup by slug (fallback for old URLs)
    if (!contractorId) {
      console.log('🔍 No ID found in slug, trying direct ID lookup as fallback')
      contractorId = slug
    }
    
    console.log('🔍 Final contractor ID for lookup:', contractorId)
    
    if (!contractorId) {
      console.log('❌ No valid contractor ID found')
      return null
    }
    
    const { data: contractor, error } = await (supabase as any)
      .from('contractors')
      .select(`
        id,
        business_name,
        license_number,
        bio,
        business_address,
        business_city,
        business_state,
        business_zip,
        average_rating,
        total_reviews,
        total_completed_projects,
        status,
        license_verified,
        insurance_verified,
        profile_image,
        founded_year,
        employee_count,
        contact_phone,
        contact_email,
        certifications
      `)
      .eq('id', contractorId)
      .eq('status', 'approved')
      .single()

    if (error) {
      console.error('Database error fetching contractor:', error)
      return null
    }
    
    if (!contractor) {
      console.log('❌ No contractor found with ID:', contractorId)
      return null
    }

    console.log('✅ Found contractor:', contractor.business_name)
    return contractor
  } catch (error) {
    console.error('Error fetching contractor:', error)
    return null
  }
}

// Fetch contractor portfolio projects
async function getContractorProjects(contractorId: string): Promise<ContractorProject[]> {
  try {
    console.log('🔍 Fetching contractor projects for ID:', contractorId)
    
    const { data: projects, error } = await (supabase as any)
      .from('contractor_portfolio')
      .select(`
        id,
        title,
        description,
        service_type,
        project_size_sqft,
        completion_date,
        before_image_url,
        after_image_url,
        additional_images,
        project_city,
        project_state,
        is_featured,
        display_order
      `)
      .eq('contractor_id', contractorId)
      .order('display_order', { ascending: true })
      .limit(8) // Show up to 8 recent projects

    if (error) {
      console.error('Database error fetching contractor projects:', error)
      return []
    }
    
    console.log(`✅ Found ${projects?.length || 0} projects for contractor`)
    return projects || []
  } catch (error) {
    console.error('Error fetching contractor projects:', error)
    return []
  }
}

// Fetch contractor reviews
async function getContractorReviews(contractorId: string) {
  try {
    console.log('🔍 Fetching contractor reviews for ID:', contractorId)
    
    const { data: reviews, error } = await (supabase as any)
      .from('reviews')
      .select(`
        id,
        customer_name,
        customer_email,
        rating,
        title,
        comment,
        service_type,
        location,
        verified,
        created_at
      `)
      .eq('contractor_id', contractorId)
      .order('created_at', { ascending: false })
      .limit(10) // Show up to 10 recent reviews

    if (error) {
      console.error('Database error fetching contractor reviews:', error)
      return []
    }
    
    console.log(`✅ Found ${reviews?.length || 0} reviews for contractor`)
    return reviews || []
  } catch (error) {
    console.error('Error fetching contractor reviews:', error)
    return []
  }
}

// Generate dynamic metadata based on contractor data
export async function generateMetadata({ params }: ContractorPageProps): Promise<Metadata> {
  const { slug } = await params
  const contractorData = await getContractorBySlug(slug)
  
  if (!contractorData) {
    return {
      title: 'Contractor Not Found - InsulationPal',
      description: 'The requested contractor profile could not be found.',
    }
  }

  const contractorName = contractorData.business_name
  const location = `${contractorData.business_city}, ${contractorData.business_state}`
  const rating = contractorData.average_rating || 4.5
  const reviewCount = contractorData.total_reviews || 0
  const services = "Attic, Wall, Spray Foam, Basement, and Crawl Space Insulation"
  
  return {
    title: `${contractorName} - ${rating}★ Insulation Contractor in ${location} | InsulationPal`,
    description: `Get quotes from ${contractorName}, a ${rating}★ rated insulation contractor in ${location}. ${reviewCount} reviews. Services: ${services}. Licensed & insured.`,
    keywords: [
      `${contractorName}`,
      'insulation contractor',
      location,
      `${contractorData.business_state} insulation`,
      'attic insulation',
      'wall insulation',
      'spray foam insulation',
      'basement insulation',
      'crawl space insulation',
      'insulation quotes',
      'verified contractor'
    ],
    openGraph: {
      title: `${contractorName} - ${rating}★ Insulation Contractor`,
      description: `Professional insulation services in ${location}. ${rating}★ rating with ${reviewCount} reviews. Get your free quote today!`,
      type: 'website',
      locale: 'en_US',
      siteName: 'InsulationPal',
      images: contractorData.profile_image ? [{
        url: contractorData.profile_image,
        width: 800,
        height: 600,
        alt: `${contractorName} logo`,
      }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${contractorName} - ${rating}★ Insulation Contractor`,
      description: `Professional insulation services in ${location}. ${rating}★ rating with ${reviewCount} reviews.`,
      images: contractorData.profile_image ? [contractorData.profile_image] : undefined,
    },
    alternates: {
      canonical: `https://insulationpal.com/contractor/${slug}`,
    },
  }
}

export default async function ContractorProfilePage({ params }: ContractorPageProps) {
  const { slug } = await params
  
  console.log('🔍 ContractorProfilePage called with slug:', slug)
  
  const contractorData = await getContractorBySlug(slug)
  
  if (!contractorData) {
    console.log('❌ ContractorProfilePage: contractor not found, returning 404')
    notFound()
  }
  
  console.log('✅ ContractorProfilePage: displaying contractor:', contractorData.business_name)

  // Fetch real contractor projects and reviews
  const contractorProjects = await getContractorProjects(contractorData.id)
  const contractorReviews = await getContractorReviews(contractorData.id)

  // Transform database data to component format
  const licenseNumber = contractorData.license_number || "N/A"
  
  const contractor = {
    name: contractorData.business_name,
    owner: "Business Owner", // Could be added to database schema
    rating: contractorData.average_rating || 4.5,
    reviewCount: contractorData.total_reviews || 0,
    yearsInBusiness: contractorData.founded_year ? new Date().getFullYear() - contractorData.founded_year : 5,
    reliabilityRating: 95, // Could be calculated
    responseTime: "2 hours", // Could be tracked in database
    completedProjects: contractorData.total_completed_projects || 0,
    address: `${contractorData.business_address || ''}, ${contractorData.business_city || ''}, ${contractorData.business_state || ''} ${contractorData.business_zip || ''}`.trim(),
    phone: contractorData.contact_phone || "(555) 123-4567",
    email: contractorData.contact_email || "contact@contractor.com",
    licenseNumber,
    insuranceVerified: contractorData.insurance_verified || false,
    serviceAreas: [
      contractorData.business_city || "Phoenix", "Scottsdale", "Tempe", "Mesa", "Chandler", 
      "Glendale", "Peoria", "Surprise", "Avondale", "Goodyear"
    ],
    services: [
      "Attic Insulation",
      "Wall Insulation", 
      "Spray Foam Insulation",
      "Crawl Space Insulation",
      "Basement Insulation"
    ],
    logo: getContractorLogo(contractorData.profile_image),
    bio: contractorData.bio || "Professional insulation contractor with years of experience serving the local community.",
    certifications: contractorData.certifications || [],
    licenseNumber: contractorData.license_number || ''
  }

  // Demo reviews and projects (in real app, these would also come from database)
  const demoContractor = {
    name: "Elite Insulation Services",
    owner: "Michael Rodriguez",
    rating: 4.9,
    reviewCount: 127,
    yearsInBusiness: 8,
    reliabilityRating: 95,
    responseTime: "2 hours",
    completedProjects: 450,
    address: "2847 Desert Ridge Pkwy, Phoenix, AZ 85054",
    phone: "(602) 555-0123",
    email: "info@eliteinsulation.com",
    licenseNumber: "ROC-298847",
    insuranceVerified: true,
    serviceAreas: [
      "Phoenix", "Scottsdale", "Tempe", "Mesa", "Chandler", 
      "Glendale", "Peoria", "Surprise", "Avondale", "Goodyear"
    ],
    services: [
      "Attic Insulation",
      "Wall Insulation", 
      "Spray Foam Insulation",
      "Crawl Space Insulation",
      "Basement Insulation",
      "Insulation Removal"
    ],
    specialties: [
      "Energy Efficiency Consulting",
      "Eco-Friendly Materials",
      "Commercial Projects",
      "Historic Home Restoration"
    ],
    description: "Elite Insulation Services has been serving the Phoenix metro area for over 8 years, providing top-quality insulation solutions for residential and commercial properties. We specialize in energy-efficient installations using the latest materials and techniques to help our customers save money on their energy bills while improving home comfort.",
    certifications: [
      "BPI Certified",
      "ENERGY STAR Partner",
      "OSHA Safety Certified",
      "Arizona ROC Licensed"
    ]
  }

  // Transform real contractor reviews for display
  const recentReviews = contractorReviews.map((review: any) => ({
    name: review.customer_name,
    location: review.location || `${contractorData.business_city}, ${contractorData.business_state}`,
    rating: review.rating,
    date: new Date(review.created_at).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    service: review.service_type || 'Insulation Service',
    comment: review.comment,
    verified: review.verified,
    title: review.title
  }))

  // Transform real contractor projects for display
  const recentProjects = contractorProjects.map((project: ContractorProject) => ({
    id: project.id,
    service: project.service_type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) + ' Insulation',
    location: `${project.project_city}, ${project.project_state}`,
    timeline: project.completion_date ? 
      `Completed ${new Date(project.completion_date).toLocaleDateString()}` : 
      'Recent project',
    description: project.description || project.title,
    image: project.after_image_url || project.before_image_url || '/attic-insulation-blown-in.jpg', // fallback image
    title: project.title,
    size: project.project_size_sqft
  }))

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-[#F5DD22] fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contractor Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200 overflow-hidden">
                    {contractor.logo ? (
                      <Image
                        src={contractor.logo}
                        alt={`${contractor.name} logo`}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-xs text-gray-500 text-center">
                        {contractor.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-[#0a4768] mb-2">{contractor.name}</h1>
                    <p className="text-lg text-gray-600 mb-4">Owned by {contractor.owner}</p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center">
                        {renderStars(contractor.rating)}
                        <span className="ml-2 font-semibold text-[#0a4768]">{contractor.rating}</span>
                        <span className="ml-1 text-gray-600">({contractor.reviewCount} reviews)</span>
                      </div>
                      {contractor.insuranceVerified && (
                        <Badge className="bg-green-100 text-green-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-[#0a4768]">{contractor.yearsInBusiness}</div>
                        <div className="text-sm text-gray-600">Years in Business</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#0a4768]">{contractor.reliabilityRating}%</div>
                        <div className="text-sm text-gray-600">Reliability Rating</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#0a4768]">{contractor.completedProjects}</div>
                        <div className="text-sm text-gray-600">Projects Completed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#0a4768]">{contractor.responseTime}</div>
                        <div className="text-sm text-gray-600">Avg Response Time</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">About Our Company</h3>
                  <p className="text-gray-700 leading-relaxed">{contractor.bio}</p>
                </div>
              </div>
            </div>

            {/* Quote Options */}
            <div>
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-[#0a4768]">Get Free Quote</CardTitle>
                  <p className="text-gray-600">Choose how you'd like to get your estimate</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <QuoteButton className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold py-4 text-center">
                    Get 3 Free Quotes
                  </QuoteButton>
                  <p className="text-sm text-gray-600 text-center">
                    Compare quotes from multiple contractors
                  </p>
                  
                  <div className="border-t pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white font-semibold py-4"
                    >
                      Direct Contractor Quote
                    </Button>
                    <p className="text-sm text-gray-600 text-center mt-2">
                      Get a quote directly from {contractor.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Areas */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Services */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#0a4768] flex items-center">
                    <Wrench className="h-5 w-5 mr-2" />
                    Services Offered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {contractor.services.map((service, index) => (
                      <Button
                        key={index}
                        asChild
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-[#0a4768] hover:bg-[#0a4768] hover:text-white"
                      >
                        <Link href={`/services/${service.toLowerCase().replace(/\s+/g, '-')}`}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {service}
                          <ExternalLink className="w-3 h-3 ml-auto" />
                        </Link>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Areas */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#0a4768] flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Service Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {contractor.serviceAreas.map((area, index) => (
                      <Button
                        key={index}
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white"
                      >
                        <Link href={`/arizona/${area.toLowerCase().replace(/\s+/g, '-')}-insulation-contractors`}>
                          {area}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Certifications & License */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#0a4768] flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Certifications & License
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* License Number */}
                    {contractor.licenseNumber && (
                      <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <Shield className="h-5 w-5 text-blue-600 mr-3" />
                        <div>
                          <div className="font-semibold text-blue-900">License Number</div>
                          <div className="text-blue-700 font-mono">{contractor.licenseNumber}</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Certifications */}
                    {contractor.certifications && contractor.certifications.length > 0 && (
                      <div className="space-y-2">
                        <div className="font-semibold text-gray-800 mb-2">Certifications:</div>
                        {contractor.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center p-2 bg-green-50 rounded border border-green-200">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                            <span className="text-gray-700">{cert}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* No certifications message */}
                    {(!contractor.certifications || contractor.certifications.length === 0) && (
                      <div className="text-gray-500 text-sm italic">
                        No certifications listed
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-12 bg-[#D6D6D6]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0a4768] mb-8">Customer Reviews</h2>
          
          {recentReviews.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Star className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h4>
                  <p className="text-gray-600">
                    This contractor hasn't received any reviews yet. Be the first to share your experience!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {recentReviews.map((review: any, index: number) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        {renderStars(review.rating)}
                        {review.verified && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="font-semibold text-[#0a4768]">{review.name}</div>
                      <div className="text-sm text-gray-600">{review.location}</div>
                    </div>
                    <div className="text-sm text-gray-500">{review.date}</div>
                  </div>
                  
                  <Badge className="mb-3 bg-[#F5DD22] text-[#0a4768]">
                    {review.service}
                  </Badge>
                  
                  <p className="text-gray-700">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Projects */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0a4768] mb-8">Recent Projects</h2>
          
          {recentProjects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Wrench className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Projects Yet</h4>
                  <p className="text-gray-600">
                    This contractor hasn't uploaded any project photos yet.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProjects.map((project: any, index: number) => (
                <Card key={project.id || index} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="aspect-video relative">
                    <Image
                      src={project.image}
                      alt={`${project.service} project in ${project.location}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#F5DD22] text-[#0a4768]">
                        {project.service}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="font-semibold text-[#0a4768] mb-2">{project.title}</div>
                      <div className="text-sm text-gray-600 mb-2">{project.location}</div>
                      <p className="text-gray-700 text-sm mb-4">{project.description}</p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      {project.size && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Size:</span>
                          <span className="font-semibold text-[#0a4768]">{project.size} sq ft</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed:</span>
                        <span className="font-semibold text-[#0a4768]">{project.timeline}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Ready to Get Started Section */}
      <section className="py-16 bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0a4768] mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Join thousands of homeowners who have found their perfect insulation contractor through InsulationPal.
            </p>
            <QuoteButton className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-4 text-lg">
              Find My Contractor
            </QuoteButton>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
