'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Phone, Mail, CheckCircle, Award, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface Contractor {
  id: string
  business_name: string
  business_city: string
  business_state: string
  average_rating: number
  total_reviews: number
  total_completed_projects: number
  license_verified: boolean
  insurance_verified: boolean
  bbb_accredited?: boolean
  license_number?: string
  profile_image?: string
  bio?: string
  founded_year?: number
  contact_phone?: string
  contact_email?: string
  contractor_service_areas?: Array<{ city: string; state: string }>
  contractor_services?: Array<{ service_type: string; insulation_types: string[] }>
}

interface LeadData {
  homeSize: string
  areas: string[]
  insulationTypes: string[]
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  city: string
  state: string
  zipCode: string
}

export default function SelectContractorsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [selectedContractors, setSelectedContractors] = useState<string[]>([])
  const [leadData, setLeadData] = useState<LeadData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get lead data from URL params
        const leadDataParam = searchParams.get('leadData')
        if (leadDataParam) {
          const parsedLeadData = JSON.parse(decodeURIComponent(leadDataParam))
          setLeadData(parsedLeadData)
          
          // Fetch contractors for the customer's city
          await fetchContractors(parsedLeadData.city, parsedLeadData.state)
        } else {
          toast.error('No lead data found. Please start over.')
          router.push('/')
        }
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Error loading contractor data')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [searchParams, router])

  const fetchContractors = async (city: string, state: string) => {
    try {
      console.log(`🔍 Fetching contractors for ${city}, ${state}`)
      
      const { data: contractors, error } = await supabase
        .from('contractors')
        .select(`
          id,
          business_name,
          business_city,
          business_state,
          average_rating,
          total_reviews,
          total_completed_projects,
          license_verified,
          insurance_verified,
          bbb_accredited,
          license_number,
          profile_image,
          bio,
          founded_year,
          contact_phone,
          contact_email,
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
        console.error('Database error:', error)
        // If the error is about missing bbb_accredited column, continue without it
        if (error.message && error.message.includes('bbb_accredited')) {
          console.warn('⚠️ bbb_accredited column not found - BBB badges will not display')
          // Retry query without bbb_accredited column
          const { data: contractorsRetry, error: retryError } = await supabase
            .from('contractors')
            .select(`
              id,
              business_name,
              business_city,
              business_state,
              average_rating,
              total_reviews,
              total_completed_projects,
              license_verified,
              insurance_verified,
              license_number,
              profile_image,
              bio,
              founded_year,
              contact_phone,
              contact_email,
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
            return
          }
          
          setContractors(contractorsRetry || [])
        } else {
          throw error
        }
      } else {
        // Filter contractors who serve the customer's city
        const cityContractors = contractors?.filter((contractor: Contractor) => {
          const contractorCity = contractor.business_city?.toLowerCase()
          const serviceAreas = contractor.contractor_service_areas || []
          const servesCity = serviceAreas.some((area: any) => 
            area.city.toLowerCase() === city.toLowerCase() && 
            area.state.toLowerCase() === state.toLowerCase()
          )
          
          return contractorCity === city.toLowerCase() || servesCity
        }) || []

        console.log(`✅ Found ${cityContractors.length} contractors serving ${city}`)
        setContractors(cityContractors)
      }
    } catch (error) {
      console.error('Error fetching contractors:', error)
      toast.error('Error loading contractors')
    }
  }

  const handleContractorSelect = (contractorId: string) => {
    setSelectedContractors(prev => {
      if (prev.includes(contractorId)) {
        return prev.filter(id => id !== contractorId)
      } else if (prev.length < 3) {
        return [...prev, contractorId]
      } else {
        toast.error('You can only select up to 3 contractors')
        return prev
      }
    })
  }

  const handleSubmit = async () => {
    if (selectedContractors.length === 0) {
      toast.error('Please select at least one contractor')
      return
    }

    if (!leadData) {
      toast.error('Lead data is missing')
      return
    }

    setIsSubmitting(true)
    try {
      // Check if we're in demo mode
      const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
                        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder')
      
      if (isDemoMode) {
        console.log('Demo Mode: Simulating lead creation')
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate delay
        
        toast.success('Quote request submitted successfully! (Demo Mode)')
        router.push('/quote-success')
        return
      }

      // Create the lead in the database
      const leadDataToInsert = {
        home_size_sqft: parseInt(leadData.homeSize),
        areas_needed: leadData.areas,
        insulation_types: leadData.insulationTypes,
        quote_preference: 'choose_three',
        customer_name: leadData.customerName,
        customer_email: leadData.customerEmail,
        customer_phone: leadData.customerPhone,
        property_address: leadData.address,
        city: leadData.city,
        state: leadData.state,
        zip_code: leadData.zipCode,
        status: 'active'
      }

      console.log('📋 Creating lead:', leadDataToInsert)
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

      // Test connection to leads table first
      try {
        console.log('🔍 Testing connection to leads table...')
        const { data: testData, error: testError } = await supabase
          .from('leads')
          .select('id')
          .limit(1)
        
        console.log('🔍 Connection test result:', {
          data: testData,
          error: testError,
          errorKeys: testError ? Object.keys(testError) : [],
          errorStringified: JSON.stringify(testError, null, 2)
        })
        
        if (testError) {
          console.error('🚨 Supabase connection test failed:', testError)
          throw new Error(`Database connection failed: ${testError.message || 'Unknown error'}`)
        }
        
        console.log('✅ Supabase connection test passed, found', testData?.length || 0, 'records')
      } catch (connectionError: any) {
        console.error('🚨 Critical Supabase connection error:', connectionError)
        throw new Error(`Cannot connect to database. Please check your environment variables and database setup.`)
      }

      let lead: any = null
      let leadError: any = null
      try {
        const result = await supabase
          .from('leads')
          .insert(leadDataToInsert as any)
          .select()
        
        console.log('Raw Supabase result:', result)
        console.log('Result data:', result.data)
        console.log('Result error:', result.error)
        
        lead = result.data?.[0] // Get first item from array instead of using .single()
        leadError = result.error
        
        console.log('Lead creation result:', result)
        console.log('Extracted lead:', lead)
        console.log('Extracted error:', leadError)
      } catch (insertError: any) {
        console.error('Exception during lead insert:', insertError)
        throw new Error(`Database insert exception: ${insertError.message}`)
      }

      // Check if there's a meaningful error
      const hasError = leadError && (
        leadError.message || 
        leadError.details || 
        leadError.hint || 
        leadError.code ||
        Object.keys(leadError).length > 0
      )

      if (hasError) {
        console.error('Lead creation error:', leadError)
        console.error('Lead data that failed:', leadDataToInsert)
        
        // If it's an empty object, try alternative approach
        if (leadError && Object.keys(leadError).length === 0) {
          console.log('Empty error object - trying alternative approach...')
          
          const { data: insertData, error: insertError } = await supabase
            .from('leads')
            .insert(leadDataToInsert as any)
          
          if (insertError) {
            throw new Error(`Database error: ${insertError.message || 'RLS policy issue'}`)
          }
          
          const { data: leadData, error: selectError } = await supabase
            .from('leads')
            .select('*')
            .eq('customer_email', leadDataToInsert.customer_email)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()
          
          if (selectError) {
            throw new Error(`Lead created but cannot retrieve: ${selectError.message}`)
          }
          
          lead = leadData
          console.log('✅ Lead created via alternative method:', lead?.id)
        } else {
          throw new Error(`Failed to create lead: ${leadError.message || 'Unknown error'}`)
        }
      }

      if (!lead) {
        console.error('No lead created - no error but no data returned')
        console.error('Lead data attempted:', leadDataToInsert)
        throw new Error('Failed to create lead: No data returned from database')
      }

      console.log('✅ Lead created:', lead?.id)

      // Create lead assignments for selected contractors
      const assignments = selectedContractors.map(contractorId => ({
        lead_id: lead?.id,
        contractor_id: contractorId,
        cost: 20.00,
        status: 'pending'
      }))

      console.log('📋 Creating assignments:', assignments)

      const { error: assignmentError } = await supabase
        .from('lead_assignments')
        .insert(assignments as any)

      if (assignmentError) {
        console.error('Assignment creation error:', assignmentError)
        throw new Error(`Failed to create assignments: ${assignmentError.message}`)
      }

      // Credit deduction temporarily disabled to avoid Edge Function errors
      console.log('Lead assignments created successfully - credit deduction skipped')

      // Send notifications to selected contractors
      const selectedContractorDetails = contractors.filter(c => selectedContractors.includes(c.id))
      await notifyContractors(selectedContractorDetails, lead)

      toast.success('Your quote request has been sent to the selected contractors!')
      router.push('/quote-success')
      
    } catch (error) {
      console.error('Error submitting quote request:', error)
      toast.error('Error submitting quote request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const notifyContractors = async (contractors: Contractor[], lead: any) => {
    for (const contractor of contractors) {
      // Send email notification
      if (contractor.contact_email) {
        try {
          const { error } = await supabase.functions.invoke('send-email', {
            body: {
              to: contractor.contact_email,
              subject: 'New Lead Available - InsulationPal',
              template: 'new-lead',
              data: {
                contractorName: contractor.business_name,
                customerName: lead.customer_name,
                city: lead.city,
                state: lead.state,
                homeSize: lead.home_size_sqft,
                areasNeeded: lead.areas_needed.join(', '),
                dashboardLink: `${process.env.NEXT_PUBLIC_SITE_URL}/contractor-dashboard`
              }
            }
          })
          
          if (error) {
            console.error('Email notification error:', error)
          }
        } catch (error) {
          console.error('Error sending email notification:', error)
        }
      }

      // Send SMS notification (if phone available)
      if (contractor.contact_phone) {
        try {
          const { error } = await supabase.functions.invoke('send-sms', {
            body: {
              to: contractor.contact_phone,
              message: `New lead: ${lead.customer_name} in ${lead.city}, ${lead.state}. View details: ${process.env.NEXT_PUBLIC_SITE_URL}/contractor-dashboard`,
              type: 'new-lead'
            }
          })
          
          if (error) {
            console.error('SMS notification error:', error)
          }
        } catch (error) {
          console.error('Error sending SMS notification:', error)
        }
      }
    }
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

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading contractors...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!leadData) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Lead Data Found</h1>
            <p className="text-gray-600 mb-8">Please start your quote request again.</p>
            <Button onClick={() => router.push('/')}>Start Over</Button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Contractors
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Select up to 3 contractors to receive your quote request
            </p>
            <p className="text-sm text-gray-500">
              Location: {leadData.city}, {leadData.state}
            </p>
          </div>

          {/* Selected Count */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">
                  Selected: {selectedContractors.length} of 3 contractors
                </p>
                <p className="text-sm text-blue-700">
                  {selectedContractors.length === 0 && 'Please select at least one contractor'}
                  {selectedContractors.length > 0 && selectedContractors.length < 3 && 'You can select up to 2 more'}
                  {selectedContractors.length === 3 && 'Maximum contractors selected'}
                </p>
              </div>
              {selectedContractors.length > 0 && (
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? 'Sending...' : 'Send Quote Request'}
                </Button>
              )}
            </div>
          </div>

          {/* Contractors List */}
          {contractors.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Contractors Available</h2>
              <p className="text-gray-600 mb-4">
                We don't have any contractors available in {leadData.city}, {leadData.state} at the moment.
              </p>
              <Button onClick={() => router.push('/')}>Try a Different Location</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {contractors.map((contractor) => (
                <Card key={contractor.id} className={`transition-all duration-200 ${
                  selectedContractors.includes(contractor.id) 
                    ? 'ring-2 ring-blue-500 shadow-lg' 
                    : 'hover:shadow-md'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Radio Button */}
                      <div className="flex-shrink-0 pt-2">
                        <RadioGroup
                          value={selectedContractors.includes(contractor.id) ? contractor.id : ''}
                          onValueChange={() => handleContractorSelect(contractor.id)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem 
                              value={contractor.id} 
                              id={contractor.id}
                              disabled={!selectedContractors.includes(contractor.id) && selectedContractors.length >= 3}
                            />
                            <Label htmlFor={contractor.id} className="sr-only">
                              Select {contractor.business_name}
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Contractor Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {contractor.business_name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{contractor.business_city}, {contractor.business_state}</span>
                              </div>
                              {contractor.founded_year && (
                                <span>Est. {contractor.founded_year}</span>
                              )}
                              {contractor.license_number && (
                                <span>ROC #{contractor.license_number.replace(/^ROC\s*/i, '')}</span>
                              )}
                            </div>
                          </div>
                          
                          {/* Profile Image */}
                          {contractor.profile_image && (
                            <img
                              src={contractor.profile_image}
                              alt={contractor.business_name}
                              className="w-28 h-28 rounded-lg object-contain bg-gray-50 p-3"
                            />
                          )}
                        </div>

                        {/* Rating and Stats */}
                        <div className="flex items-center space-x-6 mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {renderStars(contractor.average_rating || 0)}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {contractor.average_rating?.toFixed(1) || '0.0'}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({contractor.total_reviews || 0} reviews)
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {contractor.total_completed_projects || 0} projects completed
                          </div>
                        </div>

                        {/* Verification Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {contractor.license_verified && contractor.insurance_verified && (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <Shield className="w-3 h-3" />
                              <span>Licensed, Bonded & Insured</span>
                            </Badge>
                          )}
                          {contractor.license_verified && !contractor.insurance_verified && (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <Shield className="w-3 h-3" />
                              <span>Licensed</span>
                            </Badge>
                          )}
                          {!contractor.license_verified && contractor.insurance_verified && (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>Insured</span>
                            </Badge>
                          )}
                          {contractor.bbb_accredited && (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <Award className="w-3 h-3" />
                              <span>BBB Accredited</span>
                            </Badge>
                          )}
                        </div>

                        {/* Bio */}
                        {contractor.bio && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {contractor.bio}
                          </p>
                        )}

                        {/* Services */}
                        {contractor.contractor_services && contractor.contractor_services.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Services:</h4>
                            <div className="flex flex-wrap gap-2">
                              {contractor.contractor_services.map((service, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {service.service_type.replace('_', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Submit Button */}
      {contractors.length > 0 && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Selected: {selectedContractors.length} of 3 contractors
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedContractors.length === 0 && 'Please select at least one contractor'}
                    {selectedContractors.length > 0 && selectedContractors.length < 3 && 'You can select up to 2 more'}
                    {selectedContractors.length === 3 && 'Maximum contractors selected'}
                  </p>
                </div>
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || selectedContractors.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Quote Request'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
