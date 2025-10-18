'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase'
import { handleContractorResponse } from '@/lib/lead-assignment'
import { Phone, Mail, MapPin, Home, CheckCircle, X, Clock, AlertCircle, Trophy } from 'lucide-react'
import { QuoteSubmissionForm } from '@/components/dashboard/QuoteSubmissionForm'
import { ProjectImageUpload } from '@/components/dashboard/ProjectImageUpload'

interface Lead {
  id: string
  lead_id: string
  status: string
  cost: number
  created_at: string
  responded_at?: string
  quote_amount?: number
  quote_notes?: string
  leads: {
    customer_name: string
    customer_email?: string
    customer_phone?: string
    home_size_sqft: number
    areas_needed: string[]
    insulation_types: string[]
    city: string
    state: string
    zip_code?: string
    property_address?: string
  }
}

export function LeadsList({ contractorId, contractorCredits }: { contractorId: string, contractorCredits?: number }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [responding, setResponding] = useState<string | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [contractorId])

  async function fetchLeads() {
    try {
      console.log('🔍 LeadsList: Fetching leads for contractor:', contractorId)
      
      // First, test if the tables exist to detect demo mode
      console.log('🔍 Testing table access...')
      const { data: testData, error: testError } = await supabase
        .from('lead_assignments')
        .select('id')
        .limit(1)

      console.log('🔍 Table test result:', { testData, testError })

      if (testError) {
        console.log('🎭 Demo Mode: Using sample data due to table access error')
        setLeads([
          {
            id: 'demo-1',
            lead_id: 'demo-lead-1',
            status: 'pending',
            cost: 20,
            created_at: new Date().toISOString(),
            leads: {
              customer_name: 'John Smith',
              customer_email: 'john@example.com',
              customer_phone: '555-0123',
              home_size_sqft: 2500,
              areas_needed: ['Attic', 'Walls'],
              insulation_types: ['Fiberglass', 'Spray Foam'],
              city: 'Phoenix',
              state: 'AZ',
              zip_code: '85001',
              property_address: '123 Main St'
            }
          },
          {
            id: 'demo-2',
            lead_id: 'demo-lead-2',
            status: 'accepted',
            cost: 20,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            responded_at: new Date().toISOString(),
            quote_amount: 3500,
            quote_notes: 'Complete attic insulation with R-38 fiberglass',
            leads: {
              customer_name: 'Sarah Johnson',
              customer_email: 'sarah@example.com',
              customer_phone: '555-0456',
              home_size_sqft: 1800,
              areas_needed: ['Attic'],
              insulation_types: ['Fiberglass'],
              city: 'Phoenix',
              state: 'AZ',
              zip_code: '85002',
              property_address: '456 Oak Ave'
            }
          },
          {
            id: 'demo-3',
            lead_id: 'demo-lead-3',
            status: 'won',
            cost: 20,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            responded_at: new Date(Date.now() - 86400000).toISOString(),
            quote_amount: 4200,
            quote_notes: 'Complete attic and crawl space insulation with premium materials',
            leads: {
              customer_name: 'Mike Wilson',
              customer_email: 'mike@example.com',
              customer_phone: '555-0789',
              home_size_sqft: 3200,
              areas_needed: ['Attic', 'Crawl Space'],
              insulation_types: ['Cellulose', 'Spray Foam'],
              city: 'Phoenix',
              state: 'AZ',
              zip_code: '85003',
              property_address: '789 Pine St'
            }
          },
          {
            id: 'demo-4',
            lead_id: 'demo-lead-4',
            status: 'declined',
            cost: 20,
            created_at: new Date(Date.now() - 259200000).toISOString(),
            responded_at: new Date(Date.now() - 172800000).toISOString(),
            leads: {
              customer_name: 'Lisa Brown',
              customer_email: 'lisa@example.com',
              customer_phone: '555-0321',
              home_size_sqft: 1500,
              areas_needed: ['Attic'],
              insulation_types: ['Fiberglass'],
              city: 'Phoenix',
              state: 'AZ',
              zip_code: '85004',
              property_address: '321 Elm St'
            }
          }
        ])
        setLoading(false)
        return
      }

      console.log('🔍 Executing main query for contractor:', contractorId)
      const { data: leadAssignments, error: leadError } = await supabase
        .from('lead_assignments')
        .select(`
          id,
          lead_id,
          status,
          cost,
          created_at,
          responded_at,
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
            zip_code,
            property_address
          )
        `)
        .eq('contractor_id', contractorId)
        .order('created_at', { ascending: false })

      console.log('🔍 Lead assignments query result:', { leadAssignments, leadError })

      if (leadError) {
        console.error('❌ Error fetching leads:', leadError)
        throw leadError
      }

      setLeads(leadAssignments || [])
    } catch (error) {
      console.error('❌ Error in fetchLeads:', error)
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  async function respondToLead(leadAssignmentId: string, response: 'accept' | 'decline') {
    setResponding(leadAssignmentId)
    try {
      // Check if this is a demo lead
      if (leadAssignmentId.startsWith('demo-')) {
        console.log('🎭 Demo Mode: Simulating lead response')
        setLeads(prevLeads => 
          prevLeads.map(lead => 
            lead.id === leadAssignmentId 
              ? { 
                  ...lead, 
                  status: response === 'accept' ? 'pending' : 'declined',
                  responded_at: new Date().toISOString()
                }
              : lead
          )
        )
        return
      }

      await handleContractorResponse(leadAssignmentId, contractorId, response)
      
      // Refresh the leads list
      await fetchLeads()
    } catch (error) {
      console.error('Error responding to lead:', error)
    } finally {
      setResponding(null)
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'won': return 'bg-emerald-100 text-emerald-800'
      case 'hired': return 'bg-emerald-100 text-emerald-800'
      case 'completed': return 'bg-emerald-100 text-emerald-800'
      case 'declined': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'pending': return 'Pending'
      case 'accepted': return 'Accepted'
      case 'won': return 'Won'
      case 'hired': return 'Hired'
      case 'completed': return 'Completed'
      case 'declined': return 'Declined'
      case 'expired': return 'Expired'
      default: return status
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading leads...</div>
  }

  const isDemoMode = leads.length > 0 && leads[0]?.id?.startsWith('demo-')

  // Categorize leads into different tabs
  const availableLeads = leads.filter(lead => 
    (lead.status === 'pending' || lead.status === 'sent') && !lead.responded_at
  )
  
  const acceptedLeads = leads.filter(lead => 
    lead.status === 'accepted' || (lead.status === 'pending' && lead.responded_at)
  )
  
  const wonLeads = leads.filter(lead => 
    lead.status === 'won' || lead.status === 'hired' || lead.status === 'completed'
  )
  
  const didntWinLeads = leads.filter(lead => 
    lead.status === 'declined' || lead.status === 'expired'
  )

  // Helper function to render lead cards
  const renderLeadCard = (leadAssignment: Lead) => (
    <Card key={leadAssignment.id} className="mb-6 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-[#0a4768]">
              {leadAssignment.leads.customer_name}
            </CardTitle>
            <div className="flex items-center text-gray-600 mt-2">
              <MapPin className="h-4 w-4 mr-1" />
              {leadAssignment.leads.city}, {leadAssignment.leads.state}
              {leadAssignment.leads.zip_code && ` ${leadAssignment.leads.zip_code}`}
            </div>
          </div>
          <div className="text-right">
            <Badge className={getStatusColor(leadAssignment.status)}>
              {getStatusText(leadAssignment.status)}
            </Badge>
            <div className="text-sm text-gray-500 mt-1">
              Cost: ${leadAssignment.cost}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center mb-2">
              <Home className="h-4 w-4 mr-2 text-[#0a4768]" />
              <span className="font-medium">Home Size:</span>
              <span className="ml-1">{leadAssignment.leads.home_size_sqft.toLocaleString()} sq ft</span>
            </div>
          </div>
          <div>
            <div className="mb-2">
              <span className="font-medium">Areas Needed:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {leadAssignment.leads.areas_needed.map((area, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="font-medium">Insulation Types:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {leadAssignment.leads.insulation_types.map((type, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Show project image upload for won leads */}
        {leadAssignment.status === 'won' || leadAssignment.status === 'hired' || leadAssignment.status === 'completed' ? (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <h3 className="font-semibold text-emerald-800 mb-3 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Project Completed - Add Images
            </h3>
            <p className="text-sm text-emerald-700 mb-4">
              Upload project completion images to showcase your work and request a customer review.
            </p>
            <ProjectImageUpload
              leadAssignmentId={leadAssignment.id}
              contractorId={contractorId}
              customerName={leadAssignment.leads.customer_name}
              customerEmail={leadAssignment.leads.customer_email || ''}
              projectDetails={{
                homeSize: leadAssignment.leads.home_size_sqft,
                areasNeeded: leadAssignment.leads.areas_needed,
                insulationTypes: leadAssignment.leads.insulation_types,
                city: leadAssignment.leads.city,
                state: leadAssignment.leads.state
              }}
              onImagesUploaded={() => {
                fetchLeads()
              }}
            />
          </div>
        ) : leadAssignment.status === 'accepted' ? (
          <>
            {/* Customer Contact Information */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Customer Contact Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Mail className="h-4 w-4 mr-2 text-green-600" />
                    <span className="font-medium">Email:</span>
                    <a href={`mailto:${leadAssignment.leads.customer_email}`} 
                       className="ml-2 text-blue-600 hover:text-blue-800 underline">
                      {leadAssignment.leads.customer_email}
                    </a>
                  </div>
                  <div className="flex items-center mb-2">
                    <Phone className="h-4 w-4 mr-2 text-green-600" />
                    <span className="font-medium">Phone:</span>
                    <a href={`tel:${leadAssignment.leads.customer_phone}`} 
                       className="ml-2 text-blue-600 hover:text-blue-800 underline">
                      {leadAssignment.leads.customer_phone}
                    </a>
                  </div>
                  {leadAssignment.leads.property_address && (
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 mr-2 text-green-600" />
                      <span className="font-medium">Address:</span>
                      <span className="ml-2">{leadAssignment.leads.property_address}</span>
                    </div>
                  )}
                </div>
                <div>
                  {leadAssignment.quote_amount && (
                    <div className="mb-2">
                      <span className="font-medium">Your Quote:</span>
                      <div className="text-lg font-bold text-green-600">
                        ${leadAssignment.quote_amount.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {leadAssignment.quote_notes && (
                    <div>
                      <span className="font-medium">Quote Notes:</span>
                      <p className="text-sm text-gray-600 mt-1">{leadAssignment.quote_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Quote Submission Form */}
            <QuoteSubmissionForm
              leadAssignmentId={leadAssignment.id}
              contractorId={contractorId}
              onQuoteSubmitted={() => {
                fetchLeads()
              }}
            />
          </>
        ) : (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              <span className="font-semibold">New Lead Available</span>
            </p>
            <p className="text-sm text-blue-700">
              Accept this lead to view complete project details. Customer contact information will be provided if you win the bid.
            </p>
          </div>
        )}
        
        {/* Show quote submission form for pending leads (contractor accepted but hasn't submitted quote yet) */}
        {leadAssignment.status === 'pending' && leadAssignment.responded_at && (
          <>
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Lead Accepted - Submit Your Quote
              </h3>
              <p className="text-sm text-blue-700">
                You've accepted this lead. Submit your quote to compete for the project.
              </p>
            </div>
            
            {/* Quote Submission Form */}
            <QuoteSubmissionForm
              leadAssignmentId={leadAssignment.id}
              contractorId={contractorId}
              onQuoteSubmitted={() => {
                fetchLeads()
              }}
            />
          </>
        )}
        
        {(leadAssignment.status === 'pending' || leadAssignment.status === 'sent') && !leadAssignment.responded_at && (
          <div className="flex gap-3">
            <Button
              onClick={() => respondToLead(leadAssignment.id, 'accept')}
              disabled={responding === leadAssignment.id || (contractorCredits !== undefined && contractorCredits <= 0)}
              className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {responding === leadAssignment.id ? 'Responding...' : 
               (contractorCredits !== undefined && contractorCredits <= 0) ? 'No Credits' : 'Accept Lead'}
            </Button>
            <Button
              onClick={() => respondToLead(leadAssignment.id, 'decline')}
              disabled={responding === leadAssignment.id}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Decline
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          <Clock className="h-3 w-3 inline mr-1" />
          Received: {new Date(leadAssignment.created_at).toLocaleDateString()}
          {leadAssignment.responded_at && (
            <span className="ml-4">
              Responded: {new Date(leadAssignment.responded_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0a4768]">Leads</h2>
          {isDemoMode && (
            <p className="text-sm text-amber-600 mt-1">
              🎭 Demo Mode - Showing sample leads
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {contractorCredits !== undefined && (
            <Badge variant={contractorCredits > 0 ? "default" : "destructive"}>
              {contractorCredits} credits
            </Badge>
          )}
          <Badge variant="secondary">
            {leads.length} total leads
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="available" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Available Leads ({availableLeads.length})
          </TabsTrigger>
          <TabsTrigger value="accepted" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Accepted Leads ({acceptedLeads.length})
          </TabsTrigger>
          <TabsTrigger value="won" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Won Leads ({wonLeads.length})
          </TabsTrigger>
          <TabsTrigger value="didnt-win" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Didn't Win Leads ({didntWinLeads.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          {availableLeads.length > 0 ? (
            availableLeads.map(renderLeadCard)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Available Leads</h3>
                <p className="text-gray-500">You don't have any pending leads at the moment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {acceptedLeads.length > 0 ? (
            acceptedLeads.map(renderLeadCard)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Accepted Leads</h3>
                <p className="text-gray-500">You haven't accepted any leads yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="won" className="space-y-4">
          {wonLeads.length > 0 ? (
            wonLeads.map(renderLeadCard)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Won Leads</h3>
                <p className="text-gray-500">You haven't won any bids yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="didnt-win" className="space-y-4">
          {didntWinLeads.length > 0 ? (
            didntWinLeads.map(renderLeadCard)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Declined Leads</h3>
                <p className="text-gray-500">You haven't declined any leads yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}