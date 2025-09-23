import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
  Wrench
} from 'lucide-react'

// Dynamic route - will be rendered on demand
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contractor Profile - InsulationPal',
  description: 'View contractor profile, reviews, and get free quotes from verified insulation professionals in your area.',
}

export default function ContractorProfilePage() {
  // Mock data - in a real app, this would come from params and database
  const contractor = {
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

  const recentReviews = [
    {
      name: "Sarah Johnson",
      location: "Scottsdale, AZ",
      rating: 5,
      date: "September 10, 2025",
      service: "Attic Insulation",
      comment: "Outstanding work! Michael and his team were professional, on time, and cleaned up thoroughly. Our energy bills have already dropped significantly.",
      verified: true
    },
    {
      name: "David Chen",
      location: "Tempe, AZ", 
      rating: 5,
      date: "September 5, 2025",
      service: "Spray Foam Insulation",
      comment: "Excellent service from start to finish. Very knowledgeable about different insulation options and helped us choose the best solution for our home.",
      verified: true
    },
    {
      name: "Maria Gonzalez",
      location: "Phoenix, AZ",
      rating: 5,
      date: "August 28, 2025",
      service: "Wall Insulation",
      comment: "Elite Insulation exceeded our expectations. Fair pricing, quality work, and great communication throughout the project.",
      verified: true
    },
    {
      name: "Robert Wilson",
      location: "Mesa, AZ",
      rating: 4,
      date: "August 20, 2025",
      service: "Crawl Space Insulation",
      comment: "Good work overall. Arrived on time and completed the job as promised. Would recommend to others.",
      verified: true
    }
  ]

  const recentProjects = [
    {
      service: "Attic Insulation",
      location: "North Phoenix",
      price: "$1,200",
      timeline: "1 day",
      description: "Complete attic insulation upgrade with blown-in cellulose"
    },
    {
      service: "Spray Foam Insulation", 
      location: "Scottsdale",
      price: "$2,800",
      timeline: "2 days",
      description: "Closed-cell spray foam for energy efficiency improvement"
    },
    {
      service: "Wall Insulation",
      location: "Tempe",
      price: "$1,800",
      timeline: "1 day",
      description: "Injection foam insulation for existing walls"
    },
    {
      service: "Basement Insulation",
      location: "Mesa",
      price: "$2,200",
      timeline: "2 days",
      description: "Basement wall and ceiling insulation installation"
    }
  ]

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
                  <Image
                    src="/professional-insulation-contractor-working-on-home.jpg"
                    alt={contractor.name}
                    width={120}
                    height={120}
                    className="w-24 h-24 rounded-full object-cover"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
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
                  <p className="text-gray-700 leading-relaxed">{contractor.description}</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-[#0a4768]">Get Free Quote</CardTitle>
                  <p className="text-gray-600">Request a free estimate for your project</p>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div>
                      <Input placeholder="Your Name" />
                    </div>
                    <div>
                      <Input placeholder="Phone Number" />
                    </div>
                    <div>
                      <Input placeholder="Email Address" />
                    </div>
                    <div>
                      <Input placeholder="Project Address" />
                    </div>
                    <div>
                      <Textarea 
                        placeholder="Describe your insulation project..."
                        className="min-h-24"
                      />
                    </div>
                    <QuoteButton className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold">
                      Request Free Quote
                    </QuoteButton>
                    <div className="text-center space-y-2">
                      <Button variant="outline" className="w-full">
                        <Phone className="h-4 w-4 mr-2" />
                        Call {contractor.phone}
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </form>
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
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-[#0a4768] mr-2" />
                        <span className="text-gray-700">{service}</span>
                      </div>
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
                      <Badge key={index} variant="secondary" className="text-[#0a4768]">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Certifications */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#0a4768] flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {contractor.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-gray-700">{cert}</span>
                      </div>
                    ))}
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
          
          <div className="grid md:grid-cols-2 gap-6">
            {recentReviews.map((review, index) => (
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
        </div>
      </section>

      {/* Recent Projects */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0a4768] mb-8">Recent Projects</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProjects.map((project, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <Badge className="bg-[#F5DD22] text-[#0a4768] mb-2">
                      {project.service}
                    </Badge>
                    <div className="font-semibold text-[#0a4768]">{project.location}</div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">{project.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-semibold text-[#0a4768]">{project.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timeline:</span>
                      <span className="font-semibold text-[#0a4768]">{project.timeline}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
