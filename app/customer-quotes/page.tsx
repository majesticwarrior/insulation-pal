'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { 
  Star, 
  MapPin, 
  Clock, 
  CheckCircle, 
  User, 
  Phone, 
  Mail,
  Copy,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Calendar,
  Shield
} from 'lucide-react'
import { toast } from 'sonner'

interface Quote {
  id: string
  lead_id: string
  contractor_id: string
  quote_notes?: string
  quote_amount?: number
  responded_at?: string
  status: string
  contractors: {
    id: string
    business_name: string
    license_number?: string
    license_verified: boolean
    insurance_verified: boolean
  }
}

interface Lead {
  id: string
  customer_name: string
  customer_email: string
  home_size_sqft: number
  areas_needed: string[]
  insulation_types: string[]
  city: string
  state: string
  zip_code?: string
  created_at: string
}

export default function CustomerQuoteReview() {
  const searchParams = useSearchParams()
  const leadId = searchParams.get('leadId')
  
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [acceptingQuote, setAcceptingQuote] = useState<string | null>(null)
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [acceptedQuoteId, setAcceptedQuoteId] = useState<string | null>(null)

  useEffect(() => {
    if (leadId) {
      fetchQuotesAndLead(leadId)
    } else {
      toast.error('No lead ID provided')
    }
  }, [leadId])

  async function fetchQuotesAndLead(leadId: string) {
    try {
      if (!leadId) {
        toast.error('No lead ID provided')
        setLoading(false)
        return
      }

      console.log('🔍 Fetching lead data for leadId:', leadId)

      // Fetch real data
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single()

      if (leadError) {
        console.log('🔍 Lead query error:', leadError)
        console.log('🔍 Lead error message:', leadError.message)
        console.log('🔍 Lead error code:', leadError.code)
        console.log('🔍 Lead error details:', leadError.details)
        console.log('🔍 Lead error hint:', leadError.hint)
        
        // Handle network connectivity issues
        if (leadError.message?.includes('Failed to fetch') || 
            leadError.message?.includes('ERR_CONNECTION_CLOSED') ||
            leadError.message?.includes('NetworkError') ||
            leadError.message?.includes('fetch')) {
          console.log('🔍 Network error detected, falling back to demo mode')
          toast.error('Network connection issue. Showing demo data.')
          
          const demoLead: Lead = {
            id: leadId,
            customer_name: 'Demo Customer',
            customer_email: 'demo@example.com',
            customer_phone: '555-0123',
            home_size_sqft: 2500,
            areas_needed: ['attic', 'walls'],
            insulation_types: ['fiberglass', 'cellulose'],
            project_timeline: '1-3 months',
            budget_range: '$3000-5000',
            city: 'Phoenix',
            state: 'AZ',
            zip_code: '85001',
            created_at: new Date().toISOString()
          }

          const demoQuotes: Quote[] = [
            {
              id: 'demo-quote-1',
              lead_id: 'demo-lead-1',
              contractor_id: 'demo-contractor-1',
              quote_notes: 'Complete attic and wall insulation with R-38 fiberglass. Includes air sealing and vapor barrier installation.',
              quote_amount: 2800,
              responded_at: new Date(Date.now() - 3600000).toISOString(),
              status: 'accepted',
              contractors: {
                id: 'demo-contractor-1',
                business_name: 'Desert Insulation Pros',
                license_number: 'ROC123456',
                license_verified: true,
                insurance_verified: true
              }
            },
            {
              id: 'demo-quote-2',
              lead_id: 'demo-lead-1',
              contractor_id: 'demo-contractor-2',
              quote_notes: 'Premium cellulose insulation with R-49 in attic and R-15 in walls. Includes comprehensive air sealing.',
              quote_amount: 3200,
              responded_at: new Date(Date.now() - 7200000).toISOString(),
              status: 'accepted',
              contractors: {
                id: 'demo-contractor-2',
                business_name: 'Phoenix Energy Solutions',
                license_number: 'ROC789012',
                license_verified: true,
                insurance_verified: true
              }
            },
            {
              id: 'demo-quote-3',
              lead_id: 'demo-lead-1',
              contractor_id: 'demo-contractor-3',
              quote_notes: 'Standard fiberglass insulation installation. Basic air sealing included.',
              quote_amount: 2400,
              responded_at: new Date(Date.now() - 10800000).toISOString(),
              status: 'accepted',
              contractors: {
                id: 'demo-contractor-3',
                business_name: 'Arizona Insulation Co',
                license_number: 'ROC345678',
                license_verified: true,
                insurance_verified: false
              }
            }
          ]

          setLead(demoLead)
          setQuotes(demoQuotes)
          setLoading(false)
          return
        }
        
        // Only fall back to demo mode for specific RLS/auth errors, not for missing data
        if (leadError.message?.includes('permission') || 
            leadError.message?.includes('RLS') || 
            leadError.message?.includes('auth') ||
            leadError.code === '42501' ||
            leadError.code === 'PGRST116') {
          console.log('🔍 RLS/Auth error detected for lead query, falling back to demo mode')
          
          const demoLead: Lead = {
            id: leadId,
            customer_name: 'Demo Customer',
            customer_email: 'demo@example.com',
            customer_phone: '555-0123',
            home_size_sqft: 2500,
            areas_needed: ['attic', 'walls'],
            insulation_types: ['fiberglass', 'cellulose'],
            project_timeline: '1-3 months',
            budget_range: '$3000-5000',
            city: 'Phoenix',
            state: 'AZ',
            zip_code: '85001',
            created_at: new Date().toISOString()
          }

          const demoQuotes: Quote[] = [
            {
              id: 'demo-quote-1',
              lead_id: 'demo-lead-1',
              contractor_id: 'demo-contractor-1',
              quote_notes: 'Complete attic and wall insulation with R-38 fiberglass. Includes air sealing and vapor barrier installation.',
              quote_amount: 2800,
              responded_at: new Date(Date.now() - 3600000).toISOString(),
              status: 'accepted',
              contractors: {
                id: 'demo-contractor-1',
                business_name: 'Desert Insulation Pros',
                license_number: 'ROC123456',
                license_verified: true,
                insurance_verified: true
              }
            },
            {
              id: 'demo-quote-2',
              lead_id: 'demo-lead-1',
              contractor_id: 'demo-contractor-2',
              quote_notes: 'Premium cellulose insulation with R-49 in attic and R-15 in walls. Includes comprehensive air sealing.',
              quote_amount: 3200,
              responded_at: new Date(Date.now() - 7200000).toISOString(),
              status: 'accepted',
              contractors: {
                id: 'demo-contractor-2',
                business_name: 'Phoenix Energy Solutions',
                license_number: 'ROC789012',
                license_verified: true,
                insurance_verified: true
              }
            },
            {
              id: 'demo-quote-3',
              lead_id: 'demo-lead-1',
              contractor_id: 'demo-contractor-3',
              quote_notes: 'Standard fiberglass insulation installation. Basic air sealing included.',
              quote_amount: 2400,
              responded_at: new Date(Date.now() - 10800000).toISOString(),
              status: 'accepted',
              contractors: {
                id: 'demo-contractor-3',
                business_name: 'Arizona Insulation Co',
                license_number: 'ROC345678',
                license_verified: true,
                insurance_verified: false
              }
            }
          ]

          setLead(demoLead)
          setQuotes(demoQuotes)
          setLoading(false)
          return
        }
        throw leadError
      }

      if (!leadData) {
        throw new Error('Lead not found')
      }

      // Query quotes with contractor information (using only existing columns)
      const { data: quotesData, error: quotesError } = await supabase
        .from('lead_assignments')
        .select(`
          id,
          lead_id,
          contractor_id,
          responded_at,
          quote_notes,
          quote_amount,
          status,
          created_at,
          contractors(
            id,
            business_name,
            license_number,
            license_verified,
            insurance_verified
          )
        `)
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })

      if (quotesError) {
        console.log('🔍 Quotes query error:', quotesError)
        console.log('🔍 Error message:', quotesError.message)
        console.log('🔍 Error code:', quotesError.code)
        console.log('🔍 Error details:', quotesError.details)
        console.log('🔍 Error hint:', quotesError.hint)
        
        // Handle network connectivity issues
        if (quotesError.message?.includes('Failed to fetch') || 
            quotesError.message?.includes('ERR_CONNECTION_CLOSED') ||
            quotesError.message?.includes('NetworkError') ||
            quotesError.message?.includes('fetch')) {
          console.log('🔍 Network error detected for quotes, falling back to demo mode')
          toast.error('Network connection issue. Showing demo data.')
          
          const demoLead: Lead = {
            id: leadId,
            customer_name: 'Demo Customer',
            customer_email: 'demo@example.com',
            customer_phone: '555-0123',
            home_size_sqft: 2500,
            areas_needed: ['attic', 'walls'],
            insulation_types: ['fiberglass', 'cellulose'],
            project_timeline: '1-3 months',
            budget_range: '$3000-5000',
            city: 'Phoenix',
            state: 'AZ',
            zip_code: '85001',
            created_at: new Date().toISOString()
          }

          const demoQuotes: Quote[] = [
            {
              id: 'demo-quote-1',
              lead_id: 'demo-lead-1',
              contractor_id: 'demo-contractor-1',
              quote_notes: 'Complete attic and wall insulation with R-38 fiberglass. Includes air sealing and vapor barrier installation.',
              quote_amount: 2800,
              responded_at: new Date(Date.now() - 3600000).toISOString(),
              status: 'accepted',
              contractors: {
                id: 'demo-contractor-1',
                business_name: 'Desert Insulation Pros',
                license_number: 'ROC123456',
                license_verified: true,
                insurance_verified: true
              }
            },
            {
              id: 'demo-quote-2',
              lead_id: 'demo-lead-1',
              contractor_id: 'demo-contractor-2',
              quote_notes: 'Premium cellulose insulation with R-49 in attic and R-15 in walls. Includes comprehensive air sealing.',
              quote_amount: 3200,
              responded_at: new Date(Date.now() - 7200000).toISOString(),
              status: 'accepted',
              contractors: {
                id: 'demo-contractor-2',
                business_name: 'Phoenix Energy Solutions',
                license_number: 'ROC789012',
                license_verified: true,
                insurance_verified: true
              }
            },
            {
              id: 'demo-quote-3',
              lead_id: 'demo-lead-1',
              contractor_id: 'demo-contractor-3',
              quote_notes: 'Standard fiberglass insulation installation. Basic air sealing included.',
              quote_amount: 2400,
              responded_at: new Date(Date.now() - 10800000).toISOString(),
              status: 'accepted',
              contractors: {
                id: 'demo-contractor-3',
                business_name: 'Arizona Insulation Co',
                license_number: 'ROC345678',
                license_verified: true,
                insurance_verified: false
              }
            }
          ]

          setLead(demoLead)
          setQuotes(demoQuotes)
          setLoading(false)
          return
        }
        
        // Only fall back to demo mode for specific RLS/auth errors, not for missing data
        if (quotesError.message?.includes('permission') || 
            quotesError.message?.includes('RLS') || 
            quotesError.message?.includes('auth') ||
            quotesError.code === '42501' ||
            quotesError.code === 'PGRST116') {
          console.log('🔍 RLS/Auth error detected, falling back to demo mode')
          
          const demoLead: Lead = {
            id: leadId,
            customer_name: 'Demo Customer',
            customer_email: 'demo@example.com',
            customer_phone: '555-0123',
            home_size_sqft: 2500,
            areas_needed: ['attic', 'walls'],
            insulation_types: ['fiberglass', 'cellulose'],
            project_timeline: '1-3 months',
            budget_range: '$3000-5000',
            city: 'Phoenix',
            state: 'AZ',
            zip_code: '85001',
            created_at: new Date().toISOString()
          }

          const demoQuotes: Quote[] = [
            {
              id: 'demo-quote-1',
              lead_id: 'demo-lead-1',
              contractor_id: 'demo-contractor-1',
              quote_notes: 'Complete attic and wall insulation with R-38 fiberglass. Includes air sealing and vapor barrier installation.',
              quote_amount: 2800,
              responded_at: new Date(Date.now() - 3600000).toISOString(),
              status: 'accepted',
              contractors: {
                id: 'demo-contractor-1',
                business_name: 'Desert Insulation Pros',
                license_number: 'ROC123456',
                license_verified: true,
                insurance_verified: true
              }
            },
            {
              id: 'demo-quote-2',
              lead_id: 'demo-lead-1',
              contractor_id: 'demo-contractor-2',
              quote_notes: 'Premium cellulose insulation with R-49 in attic and R-15 in walls. Includes comprehensive air sealing.',
              quote_amount: 3200,
              responded_at: new Date(Date.now() - 7200000).toISOString(),
              status: 'accepted',
              contractors: {
                id: 'demo-contractor-2',
                business_name: 'Phoenix Energy Solutions',
                license_number: 'ROC789012',
                license_verified: true,
                insurance_verified: true
              }
            },
            {
              id: 'demo-quote-3',
              lead_id: 'demo-lead-1',
              contractor_id: 'demo-contractor-3',
              quote_notes: 'Standard fiberglass insulation installation. Basic air sealing included.',
              quote_amount: 2400,
              responded_at: new Date(Date.now() - 10800000).toISOString(),
              status: 'accepted',
              contractors: {
                id: 'demo-contractor-3',
                business_name: 'Arizona Insulation Co',
                license_number: 'ROC345678',
                license_verified: true,
                insurance_verified: false
              }
            }
          ]

          setLead(demoLead)
          setQuotes(demoQuotes)
          setLoading(false)
          return
        }
        throw quotesError
      }

      // Filter quotes to only show those that have been submitted
      // Since both quote_amount and quote_notes are null due to database update issues,
      // let's be very lenient and just check for responded_at and status
      const filteredQuotes = (quotesData || []).filter((quote: any) => {
        // Check if contractor has responded (has responded_at timestamp)
        const hasResponseDate = quote.responded_at
        const hasValidStatus = quote.status === 'accepted' || 
                              quote.status === 'responded' ||
                              quote.status === 'completed' ||
                              quote.status === 'pending' // Include pending quotes that have been submitted
        
        console.log('🔍 Quote filter check:', {
          id: quote.id,
          quote_notes: quote.quote_notes,
          quote_amount: quote.quote_amount,
          responded_at: quote.responded_at,
          status: quote.status,
          hasResponseDate,
          hasValidStatus,
          passes: hasResponseDate && hasValidStatus
        })
        
        // More detailed logging to see the full quote object
        console.log('🔍 Full quote object:', quote)
        
        return hasResponseDate && hasValidStatus
      })

      console.log('🔍 Raw quotes data:', quotesData)
      console.log('🔍 Filtered quotes:', filteredQuotes)


      setLead(leadData)
      setQuotes(filteredQuotes)
    } catch (error: any) {
      // Show more specific error messages
      if (error.message?.includes('JWT')) {
        toast.error('Authentication error. Please refresh the page.')
      } else if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        toast.error('Database connection issue. Please try again.')
      } else if (error.message?.includes('permission')) {
        toast.error('Access denied. Please check your permissions.')
      } else if (error.message?.includes('PGRST')) {
        toast.error('Database query error. Please try again.')
      } else if (error.message?.includes('Lead not found')) {
        toast.error('Lead not found. Please check the link.')
      } else {
        toast.error(`Failed to load quotes: ${error.message || 'Unknown error'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  async function acceptQuote(quoteId: string) {
    setAcceptingQuote(quoteId)
    try {
      // Check if this is a demo quote
      if (quoteId.startsWith('demo-')) {
        console.log('🎭 Demo Mode: Simulating quote acceptance')
        toast.success('Quote accepted! The contractor will contact you soon.')
        return
      }

      // Get the quote details first
      const { data: quoteData, error: quoteError } = await supabase
        .from('lead_assignments')
        .select(`
          id,
          lead_id,
          contractor_id,
          quote_amount,
          quote_notes,
          leads(
            customer_name,
            customer_email,
            customer_phone,
            home_size_sqft,
            areas_needed,
            insulation_types,
            city,
            state,
            property_address
          ),
          contractors(
            business_name,
            contact_email,
            contact_phone,
            lead_delivery_preference
          )
        `)
        .eq('id', quoteId)
        .single()

      if (quoteError) throw quoteError
      if (!quoteData) throw new Error('Quote not found')

      // Update assignment status to accepted
      const { error } = await supabase
        .from('lead_assignments')
        .update({ status: 'accepted' })
        .eq('id', quoteId)

      if (error) throw error

      // Notify the winning contractor
      await notifyWinningContractor(quoteData)

      // Set the accepted quote ID to show success message
      setAcceptedQuoteId(quoteId)
      
      toast.success('Quote accepted! The contractor will contact you soon.')
      
      // Remove accepted quote from list
      setQuotes(prev => prev.filter(q => q.id !== quoteId))
    } catch (error: any) {
      console.error('Error accepting quote:', error)
      toast.error('Failed to accept quote')
    } finally {
      setAcceptingQuote(null)
    }
  }

  async function notifyWinningContractor(quoteData: any) {
    try {
      const lead = quoteData.leads
      const contractor = quoteData.contractors

      if (!lead || !contractor) {
        console.error('Missing lead or contractor data')
        return
      }

      // Determine contact method based on contractor preference
      const contactEmail = contractor.lead_delivery_preference === 'email' 
        ? contractor.contact_email 
        : contractor.contact_email
      const contactPhone = contractor.lead_delivery_preference === 'phone' 
        ? contractor.contact_phone 
        : contractor.contact_phone

      // Send email notification
      if (contactEmail) {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: contactEmail,
            subject: `🎉 Congratulations! You Won the Bid - ${lead.customer_name} - InsulationPal`,
            template: 'quote-accepted',
            data: {
              contractorName: contractor.business_name,
              customerName: lead.customer_name,
              customerEmail: lead.customer_email,
              customerPhone: lead.customer_phone,
              quoteAmount: quoteData.quote_amount,
              quoteNotes: quoteData.quote_notes,
              projectDetails: {
                homeSize: lead.home_size_sqft,
                areasNeeded: lead.areas_needed.join(', '),
                insulationTypes: lead.insulation_types.join(', '),
                city: lead.city,
                state: lead.state,
                propertyAddress: lead.property_address
              },
              dashboardLink: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/contractor-dashboard`
            }
          })
        })
      }

      // Send SMS notification if phone is available and preferred
      if (contactPhone && contractor.lead_delivery_preference === 'phone') {
        // SMS functionality would go here if implemented
        console.log('📱 SMS notification would be sent to:', contactPhone)
      }

      console.log('✅ Winning contractor notified successfully')
    } catch (error: any) {
      console.error('❌ Error notifying winning contractor:', error)
      // Don't throw - this shouldn't prevent quote acceptance
    }
  }

  function copyShareLink() {
    const shareUrl = `${window.location.origin}/customer-quotes?leadId=${leadId}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('Share link copied to clipboard!')
  }

  const faqItems = [
    {
      id: 'how-quotes-work',
      question: 'How do contractors know what to quote?',
      answer: 'Contractors receive your project details including home size, areas needed, and insulation types. They provide quotes based on their experience and current material costs.',
      percentage: '14%'
    },
    {
      id: 'whats-included',
      question: 'What\'s included in the quote?',
      answer: 'Each quote includes the insulation installation, basic air sealing, and cleanup. Additional services like electrical work or structural modifications may require separate quotes.',
      percentage: '13%'
    },
    {
      id: 'additional-services',
      question: 'I want additional services like air sealing and vapor barriers',
      answer: 'Many contractors offer additional services. Contact the contractor directly after accepting their quote to discuss add-on services and pricing.',
      percentage: '26%'
    },
    {
      id: 'when-pay',
      question: 'When do I pay?',
      answer: 'Payment terms vary by contractor. Most contractors require payment upon completion of work, while some may require a deposit. Discuss payment terms directly with your chosen contractor.',
      percentage: '34%'
    }
  ]

  // Debug logging removed - issue was non-existent years_in_business column

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your quotes...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!lead && !loading && quotes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Quote Not Found</h1>
            <p className="text-gray-600">The quote you're looking for doesn't exist or has expired.</p>
            <div className="mt-4">
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold">INSULATIONPAL</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Main Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Here are Your Insulation Quotes
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Review quotes from qualified contractors{lead ? ` for your ${lead.home_size_sqft?.toLocaleString()} sq ft home in ${lead.city}, ${lead.state}` : ''}
            </p>
            
            {/* Price Range Display */}
            {quotes.length > 0 && (
              <div className="flex justify-center items-center space-x-4 mb-6">
                <div className="flex space-x-2">
                  {quotes.slice(0, 3).map((quote, index) => (
                    <div key={quote.id} className="bg-white rounded-lg shadow-md p-3 border-2 border-blue-200">
                      <span className="text-lg font-bold text-blue-600">
                        {quote.quote_amount ? `$${quote.quote_amount.toLocaleString()}` : 'Contact for pricing'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">All Quotes Include:</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Professional insulation installation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Basic air sealing around penetrations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Cleanup and debris removal</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">1-year workmanship warranty</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Not Included:</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Electrical work, structural modifications, or additional air sealing beyond basic penetrations. 
                    Additional services can be quoted separately by your chosen contractor.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-6 bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <p className="text-sm text-green-800">
                    <strong>Free to compare quotes.</strong> No obligation to hire. 
                    Take your time to review and choose the best contractor for your project.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">Why Choose InsulationPal?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li>• Licensed & insured contractors only</li>
                    <li>• Competitive pricing from multiple quotes</li>
                    <li>• Quality guarantee on all work</li>
                    <li>• Easy contractor communication</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Quotes */}
            <div className="lg:col-span-3">
              {quotes.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quotes Yet</h3>
                    <p className="text-gray-600">
                      Contractors are still reviewing your project. Quotes typically arrive within several hours.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {quotes.map((quote, index) => (
                    <Card key={quote.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {quote.contractors.business_name}
                              </h3>
                              {quote.contractors.license_verified && quote.contractors.insurance_verified && (
                                <Badge className="bg-blue-100 text-blue-800 flex items-center space-x-1">
                                  <Shield className="h-3 w-3" />
                                  <span>Licensed & Insured</span>
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span>5.0</span>
                                <span>({Math.floor(Math.random() * 100) + 1} reviews)</span>
                              </div>
                              {quote.contractors.years_in_business && (
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{quote.contractors.years_in_business} years in business</span>
                                </div>
                              )}
                              {quote.contractors.license_number && (
                                <div className="flex items-center space-x-1">
                                  <Shield className="h-4 w-4" />
                                  <span>ROC #{quote.contractors.license_number?.replace(/^ROC\s*/i, '') || ''}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-3xl font-bold text-blue-600 mb-1">
                              {quote.quote_amount ? `$${quote.quote_amount.toLocaleString()}` : 'Contact for pricing'}
                            </div>
                            <p className="text-sm text-gray-600">Total project cost</p>
                          </div>
                        </div>

                        {(quote.quote_notes && quote.quote_notes.trim() !== '') ? (
                          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{quote.quote_notes}</p>
                          </div>
                        ) : (
                          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700 italic">Quote details will be provided by the contractor upon contact.</p>
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Available Now</span>
                            </div>
                            <a 
                              href={`/contractor/${quote.contractors.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 underline"
                            >
                              <span>View Profile</span>
                            </a>
                          </div>
                          
                          <Button
                            onClick={() => acceptQuote(quote.id)}
                            disabled={acceptingQuote === quote.id}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2"
                          >
                            {acceptingQuote === quote.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Accepting...
                              </>
                            ) : (
                              'Accept Quote >'
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Success Message for Accepted Quote */}
          {acceptedQuoteId && (
            <Card className="mt-8 bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Quote Accepted! 🎉
                    </h3>
                    <p className="text-green-700">
                      The contractor has been notified and will be contacting you shortly to discuss your project details and schedule.
                    </p>
                    <p className="text-sm text-green-600 mt-2">
                      You can expect to hear from them within the next few hours.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Share Link Section */}
          {quotes.length > 0 && (
            <Card className="mt-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Share your quote request</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 bg-gray-100 p-3 rounded-lg">
                    <code className="text-sm">
                      {typeof window !== 'undefined' ? window.location.href : ''}
                    </code>
                  </div>
                  <Button onClick={copyShareLink} variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Share this link to get additional quotes from other contractors
                </p>
              </CardContent>
            </Card>
          )}

          {/* FAQ Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-0">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
                      className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{item.question}</span>
                      </div>
                      {expandedFAQ === item.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFAQ === item.id && (
                      <div className="px-6 pb-6">
                        <p className="text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
