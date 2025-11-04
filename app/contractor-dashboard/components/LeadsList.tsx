'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase'
import { Phone, Mail, MapPin, Home, CheckCircle, X, Clock, AlertCircle, Trophy, ChevronDown, ChevronUp, FileText } from 'lucide-react'
import { QuoteSubmissionForm } from '@/components/dashboard/QuoteSubmissionForm'
import { ProjectImageUpload } from '@/components/dashboard/ProjectImageUpload'
import '@/lib/error-handler'

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
    additional_services?: string[]
    ceiling_fan_count?: number
    project_type?: string
    attic_insulation_depth?: string
    city: string
    state: string
    zip_code?: string
    property_address?: string
  }
}

export function LeadsList({ contractorId, contractorCredits }: { contractorId: string, contractorCredits?: number }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedWonLeads, setExpandedWonLeads] = useState<Set<string>>(new Set())
  const [expandedAvailableLeads, setExpandedAvailableLeads] = useState<Set<string>>(new Set())
  const [expandedDidntWinLeads, setExpandedDidntWinLeads] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (contractorId) {
      fetchLeads()
    }
  }, [contractorId])

  async function fetchLeads() {
    try {
      console.log('🔍 LeadsList: Fetching leads for contractor:', contractorId)
      
      // Validate contractorId before proceeding
      if (!contractorId || typeof contractorId !== 'string') {
        console.error('❌ Invalid contractor ID:', contractorId)
        setLeads([])
        setLoading(false)
        return
      }
      
      // First, test if the tables exist to detect demo mode
      console.log('🔍 Testing table access...')
      let testData, testError
      try {
        const result = await supabase
          .from('lead_assignments')
          .select('id')
          .limit(1)
        testData = result.data
        testError = result.error
      } catch (error) {
        console.error('❌ Error testing table access:', error)
        testError = error
      }

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
              additional_services: ['energy_audit', 'air_sealing'],
              ceiling_fan_count: 2,
              project_type: 'residential',
              attic_insulation_depth: '6_inches',
              city: 'Phoenix',
              state: 'AZ',
              zip_code: '85001',
              property_address: '123 Main St'
            }
          },
          {
            id: 'demo-2',
            lead_id: 'demo-lead-2',
            status: 'pending',
            cost: 20,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            responded_at: new Date().toISOString(),
            quote_amount: undefined, // No quote submitted yet
            quote_notes: undefined,
            leads: {
              customer_name: 'Sarah Johnson',
              customer_email: 'sarah@example.com',
              customer_phone: '555-0456',
              home_size_sqft: 1800,
              areas_needed: ['Attic'],
              insulation_types: ['Fiberglass'],
              additional_services: ['ceiling_fan_installation'],
              ceiling_fan_count: 3,
              project_type: 'residential',
              attic_insulation_depth: '12_inches',
              city: 'Phoenix',
              state: 'AZ',
              zip_code: '85002',
              property_address: '456 Oak Ave'
            }
          },
          {
            id: 'demo-3',
            lead_id: 'demo-lead-3',
            status: 'accepted',
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
              additional_services: ['duct_sealing'],
              project_type: 'commercial',
              attic_insulation_depth: '3_inches',
              city: 'Phoenix',
              state: 'AZ',
              zip_code: '85003',
              property_address: '789 Pine St'
            }
          },
          {
            id: 'demo-4',
            lead_id: 'demo-lead-4',
            status: 'won',
            cost: 20,
            created_at: new Date(Date.now() - 259200000).toISOString(),
            responded_at: new Date(Date.now() - 172800000).toISOString(),
            quote_amount: 3800,
            quote_notes: 'Complete attic insulation with R-38 fiberglass',
            leads: {
              customer_name: 'Lisa Brown',
              customer_email: 'lisa@example.com',
              customer_phone: '555-0321',
              home_size_sqft: 1500,
              areas_needed: ['Attic'],
              insulation_types: ['Fiberglass'],
              additional_services: ['energy_audit', 'air_sealing', 'duct_sealing'],
              project_type: 'residential',
              attic_insulation_depth: '6_inches',
              city: 'Phoenix',
              state: 'AZ',
              zip_code: '85004',
              property_address: '321 Elm St'
            }
          },
          {
            id: 'demo-5',
            lead_id: 'demo-lead-5',
            status: 'declined',
            cost: 20,
            created_at: new Date(Date.now() - 259200000).toISOString(),
            responded_at: new Date(Date.now() - 172800000).toISOString(),
            leads: {
              customer_name: 'Tom Davis',
              customer_email: 'tom@example.com',
              customer_phone: '555-0321',
              home_size_sqft: 1500,
              areas_needed: ['Attic'],
              insulation_types: ['Fiberglass'],
              project_type: 'residential',
              attic_insulation_depth: '12_inches',
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
      let leadAssignments, leadError
      try {
        const result = await supabase
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
              additional_services,
              ceiling_fan_count,
              project_type,
              attic_insulation_depth,
              city,
              state,
              zip_code,
              property_address
            )
          `)
          .eq('contractor_id', contractorId)
          .order('created_at', { ascending: false })
        leadAssignments = result.data
        leadError = result.error
      } catch (error) {
        console.error('❌ Error executing main query:', error)
        leadError = error
      }

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


  function getStatusColor(status: string) {
    if (!status || typeof status !== 'string') {
      return 'bg-gray-100 text-gray-800'
    }
    
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
    if (!status || typeof status !== 'string') {
      return 'Unknown'
    }
    
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
  // All leads that come in are considered available leads (except won, declined, expired)
  const availableLeads = leads.filter(lead => 
    lead.status !== 'won' && lead.status !== 'declined' && lead.status !== 'expired' && lead.status !== 'hired' && lead.status !== 'completed'
  )
  
  const wonLeads = leads.filter(lead => 
    lead.status === 'won' || lead.status === 'hired' || lead.status === 'completed'
  )
  
  const didntWinLeads = leads.filter(lead => 
    lead.status === 'declined' || lead.status === 'expired'
  )

  // Function to toggle expanded state for won leads
  const toggleWonLeadExpansion = (leadId: string) => {
    setExpandedWonLeads(prev => {
      const newSet = new Set(prev)
      if (newSet.has(leadId)) {
        newSet.delete(leadId)
      } else {
        newSet.add(leadId)
      }
      return newSet
    })
  }

  // Function to toggle expanded state for available leads
  const toggleAvailableLeadExpansion = (leadId: string) => {
    setExpandedAvailableLeads(prev => {
      const newSet = new Set(prev)
      if (newSet.has(leadId)) {
        newSet.delete(leadId)
      } else {
        newSet.add(leadId)
      }
      return newSet
    })
  }


  // Function to toggle expanded state for didn't win leads
  const toggleDidntWinLeadExpansion = (leadId: string) => {
    setExpandedDidntWinLeads(prev => {
      const newSet = new Set(prev)
      if (newSet.has(leadId)) {
        newSet.delete(leadId)
      } else {
        newSet.add(leadId)
      }
      return newSet
    })
  }

  // Helper function to render condensed won lead cards
  const renderCondensedWonLeadCard = (leadAssignment: Lead) => {
    const isExpanded = expandedWonLeads.has(leadAssignment.id)
    
    return (
      <Card key={leadAssignment.id} className="mb-3 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="h-5 w-5 text-green-600" />
              <div>
                <h3 
                  className="font-semibold text-[#0a4768] cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => toggleWonLeadExpansion(leadAssignment.id)}
                >
                  {leadAssignment.leads.customer_name}
                </h3>
                <p className="text-sm text-gray-600">
                  {leadAssignment.leads.city}, {leadAssignment.leads.state}
                </p>
                <p className="text-xs text-gray-500">
                  Completed: {new Date(leadAssignment.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleWonLeadExpansion(leadAssignment.id)}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
            >
              <span className="text-sm">
                {isExpanded ? 'Hide Details' : 'Show Details'}
              </span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              {/* Show the full won lead details when expanded */}
              {renderFullWonLeadDetails(leadAssignment)}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Helper function to render condensed available lead cards (all leads are considered available)
  const renderCondensedAcceptedLeadCard = (leadAssignment: Lead) => {
    const isExpanded = expandedAvailableLeads.has(leadAssignment.id)
    // Allow quote submission for all leads that haven't submitted a quote yet
    const needsQuoteSubmission = !leadAssignment.quote_amount && (leadAssignment.status === 'pending' || leadAssignment.status === 'sent' || leadAssignment.status === 'accepted')
    
    return (
      <Card key={leadAssignment.id} className="mb-3 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="h-5 w-5 text-orange-600" />
              <div>
                <h3 
                  className="font-semibold text-[#0a4768] cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => toggleAvailableLeadExpansion(leadAssignment.id)}
                >
                  {leadAssignment.leads.customer_name}
                </h3>
                <p className="text-sm text-gray-600">
                  {leadAssignment.leads.city}, {leadAssignment.leads.state}
                </p>
                <p className="text-xs text-gray-500">
                  Received: {new Date(leadAssignment.responded_at || leadAssignment.created_at).toLocaleDateString()}
                </p>
                {needsQuoteSubmission && (
                  <Badge variant="outline" className="text-xs text-orange-600 border-orange-300 mt-1">
                    Quote Required
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {leadAssignment.quote_amount && (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Bid Submitted
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleAvailableLeadExpansion(leadAssignment.id)}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
              >
                <span className="text-sm">
                  {isExpanded ? 'Hide Details' : 'Show Details'}
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Show project details for leads that need quote submission OR when expanded */}
          {(needsQuoteSubmission || isExpanded) && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-[#0a4768] mb-2 text-sm">Project Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center">
                  <Home className="h-3 w-3 mr-1 text-gray-600" />
                  <span className="font-medium">Home Size:</span>
                  <span className="ml-1 text-gray-700">{leadAssignment.leads.home_size_sqft?.toLocaleString()} sq ft</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-gray-600" />
                  <span className="font-medium">Location:</span>
                  <span className="ml-1 text-gray-700">{leadAssignment.leads.city}, {leadAssignment.leads.state}</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-start">
                  <span className="font-medium text-xs mr-2">Areas:</span>
                  <div className="flex flex-wrap gap-1">
                    {leadAssignment.leads.areas_needed?.map((area: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                        {area && typeof area === 'string' ? area.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-1">
                <div className="flex items-start">
                  <span className="font-medium text-xs mr-2">Insulation:</span>
                  <div className="flex flex-wrap gap-1">
                    {leadAssignment.leads.insulation_types?.map((type: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                        {type && typeof type === 'string' ? type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Attic Insulation Depth */}
              {leadAssignment.leads.attic_insulation_depth && (
                <div className="mt-1">
                  <div className="flex items-start">
                    <span className="font-medium text-xs mr-2">Attic Depth:</span>
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      {leadAssignment.leads.attic_insulation_depth && typeof leadAssignment.leads.attic_insulation_depth === 'string' ? leadAssignment.leads.attic_insulation_depth.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : leadAssignment.leads.attic_insulation_depth}
                    </Badge>
                  </div>
                </div>
              )}
              
              {/* Project Type */}
              {leadAssignment.leads.project_type && (
                <div className="mt-1">
                  <div className="flex items-start">
                    <span className="font-medium text-xs mr-2">Type:</span>
                    <Badge variant="outline" className="text-xs px-1 py-0 capitalize">
                      {leadAssignment.leads.project_type}
                    </Badge>
                  </div>
                </div>
              )}
              
              {/* Additional Services */}
              {leadAssignment.leads.additional_services && leadAssignment.leads.additional_services.length > 0 && (
                <div className="mt-1">
                  <div className="flex items-start">
                    <span className="font-medium text-xs mr-2">Additional Services:</span>
                    <div className="flex flex-wrap gap-1">
                      {leadAssignment.leads.additional_services.map((service: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                          {service && typeof service === 'string' ? service.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Ceiling Fan Count */}
              {leadAssignment.leads.ceiling_fan_count && (
                <div className="mt-1">
                  <div className="flex items-start">
                    <span className="font-medium text-xs mr-2">Fans:</span>
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      {leadAssignment.leads.ceiling_fan_count} fan{leadAssignment.leads.ceiling_fan_count > 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}
            
            {/* Show quote submission form directly for leads that need it */}
          {needsQuoteSubmission && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Submit Your Quote
                </h3>
                <p className="text-sm text-blue-700">
                  Submit your quote to compete for this project. Customer contact information will be provided if you win the bid.
                </p>
              </div>
              
              <QuoteSubmissionForm
                leadAssignmentId={leadAssignment.id}
                contractorId={contractorId}
                onQuoteSubmitted={() => {
                  fetchLeads()
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Helper function to render condensed didn't win lead cards
  const renderCondensedDidntWinLeadCard = (leadAssignment: Lead) => {
    const isExpanded = expandedDidntWinLeads.has(leadAssignment.id)
    
    return (
      <Card key={leadAssignment.id} className="mb-3 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <h3 
                  className="font-semibold text-[#0a4768] cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => toggleDidntWinLeadExpansion(leadAssignment.id)}
                >
                  {leadAssignment.leads.customer_name}
                </h3>
                <p className="text-sm text-gray-600">
                  {leadAssignment.leads.city}, {leadAssignment.leads.state}
                </p>
                <p className="text-xs text-gray-500">
                  {leadAssignment.status === 'declined' ? 'Declined or Lost' : 'Expired'}: {new Date(leadAssignment.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleDidntWinLeadExpansion(leadAssignment.id)}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
            >
              <span className="text-sm">
                {isExpanded ? 'Hide Details' : 'Show Details'}
              </span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              {/* Show the full lead details when expanded */}
              {renderFullLeadDetails(leadAssignment)}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Helper function to render full lead details for won leads
  const renderFullWonLeadDetails = (leadAssignment: Lead) => (
    <>
      {/* Customer Contact Information */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-3 flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-green-600" />
          🎉 Congratulations! You Won This Bid!
        </h3>
        <p className="text-sm text-green-700 mb-4">
          The customer has selected your quote. Here's their contact information:
        </p>
        <div className="grid md:grid-cols-2 gap-4 bg-white rounded-lg p-4">
          <div>
            <div className="flex items-center mb-2">
              <Mail className="h-4 w-4 mr-2 text-green-600" />
              <span className="font-medium">Email:</span>
            </div>
            <p className="text-sm text-gray-700 ml-6">{leadAssignment.leads.customer_email || 'Not provided'}</p>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <Phone className="h-4 w-4 mr-2 text-green-600" />
              <span className="font-medium">Phone:</span>
            </div>
            <p className="text-sm text-gray-700 ml-6">{leadAssignment.leads.customer_phone || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-[#0a4768] mb-3">Project Details</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center mb-2">
              <Home className="h-4 w-4 mr-2 text-gray-600" />
              <span className="font-medium">Home Size:</span>
            </div>
            <p className="text-sm text-gray-700 ml-6">{leadAssignment.leads.home_size_sqft?.toLocaleString()} sq ft</p>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <MapPin className="h-4 w-4 mr-2 text-gray-600" />
              <span className="font-medium">Location:</span>
            </div>
            <p className="text-sm text-gray-700 ml-6">
              {leadAssignment.leads.city}, {leadAssignment.leads.state}
              {leadAssignment.leads.zip_code && ` ${leadAssignment.leads.zip_code}`}
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-start mb-2">
            <span className="font-medium mr-2">Areas Needed:</span>
          </div>
          <div className="flex flex-wrap gap-2 ml-6">
            {leadAssignment.leads.areas_needed?.map((area: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {area && typeof area === 'string' ? area.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : area}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-start mb-2">
            <span className="font-medium mr-2">Insulation Types:</span>
          </div>
          <div className="flex flex-wrap gap-2 ml-6">
            {leadAssignment.leads.insulation_types?.map((type: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {type && typeof type === 'string' ? type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : type}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Project Image Upload */}
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
    </>
  )

  // Helper function to render full lead details for non-won leads
  const renderFullLeadDetails = (leadAssignment: Lead) => (
    <>
      {/* Project Details */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-[#0a4768] mb-3">Project Details</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center mb-2">
              <Home className="h-4 w-4 mr-2 text-gray-600" />
              <span className="font-medium">Home Size:</span>
            </div>
            <p className="text-sm text-gray-700 ml-6">{leadAssignment.leads.home_size_sqft?.toLocaleString()} sq ft</p>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <MapPin className="h-4 w-4 mr-2 text-gray-600" />
              <span className="font-medium">Location:</span>
            </div>
            <p className="text-sm text-gray-700 ml-6">
              {leadAssignment.leads.city}, {leadAssignment.leads.state}
              {leadAssignment.leads.zip_code && ` ${leadAssignment.leads.zip_code}`}
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-start mb-2">
            <span className="font-medium mr-2">Areas Needed:</span>
          </div>
          <div className="flex flex-wrap gap-2 ml-6">
            {leadAssignment.leads.areas_needed?.map((area: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {area && typeof area === 'string' ? area.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : area}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-start mb-2">
            <span className="font-medium mr-2">Insulation Types:</span>
          </div>
          <div className="flex flex-wrap gap-2 ml-6">
            {leadAssignment.leads.insulation_types?.map((type: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {type && typeof type === 'string' ? type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Attic Insulation Depth */}
        {leadAssignment.leads.attic_insulation_depth && (
          <div className="mt-4">
            <div className="flex items-start mb-2">
              <span className="font-medium mr-2">Attic Insulation Depth:</span>
            </div>
            <div className="ml-6">
              <Badge variant="outline" className="text-xs">
                {leadAssignment.leads.attic_insulation_depth && typeof leadAssignment.leads.attic_insulation_depth === 'string' ? leadAssignment.leads.attic_insulation_depth.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : leadAssignment.leads.attic_insulation_depth}
              </Badge>
            </div>
          </div>
        )}

        {/* Project Type */}
        {leadAssignment.leads.project_type && (
          <div className="mt-4">
            <div className="flex items-start mb-2">
              <span className="font-medium mr-2">Project Type:</span>
            </div>
            <div className="ml-6">
              <Badge variant="outline" className="text-xs capitalize">
                {leadAssignment.leads.project_type}
              </Badge>
            </div>
          </div>
        )}

        {/* Additional Services */}
        {leadAssignment.leads.additional_services && leadAssignment.leads.additional_services.length > 0 && (
          <div className="mt-4">
            <div className="flex items-start mb-2">
              <span className="font-medium mr-2">Additional Services:</span>
            </div>
            <div className="flex flex-wrap gap-2 ml-6">
              {leadAssignment.leads.additional_services.map((service: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {service && typeof service === 'string' ? service.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : service}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Ceiling Fan Count */}
        {leadAssignment.leads.ceiling_fan_count && (
          <div className="mt-4">
            <div className="flex items-start mb-2">
              <span className="font-medium mr-2">Ceiling Fans:</span>
            </div>
            <div className="ml-6">
              <Badge variant="outline" className="text-xs">
                {leadAssignment.leads.ceiling_fan_count} fan{leadAssignment.leads.ceiling_fan_count > 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Show lead information for non-won leads */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 mb-2">
          <span className="font-semibold">Lead Available</span>
        </p>
        <p className="text-sm text-blue-700">
          Submit your quote to compete for this project. Customer contact information will be provided if you win the bid.
        </p>
      </div>
    </>
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
                    {area && typeof area === 'string' ? area.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : area}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="font-medium">Insulation Types:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {leadAssignment.leads.insulation_types.map((type, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {type && typeof type === 'string' ? type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Show lead information for non-won leads */}
        {(leadAssignment.status !== 'won' && leadAssignment.status !== 'hired' && leadAssignment.status !== 'completed') && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              <span className="font-semibold">Lead Available</span>
            </p>
            <p className="text-sm text-blue-700">
              Submit your quote to compete for this project. Customer contact information will be provided if you win the bid.
            </p>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Available Leads ({availableLeads.length})
          </TabsTrigger>
          <TabsTrigger value="won" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Won Leads ({wonLeads.length})
          </TabsTrigger>
          <TabsTrigger value="didnt-win" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Declined or Lost Leads ({didntWinLeads.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          {availableLeads.length > 0 ? (
            availableLeads.map(renderCondensedAcceptedLeadCard)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Available Leads</h3>
                <p className="text-gray-500">You don't have any available leads at the moment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="won" className="space-y-4">
          {wonLeads.length > 0 ? (
            wonLeads.map(renderCondensedWonLeadCard)
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
            didntWinLeads.map(renderCondensedDidntWinLeadCard)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Declined or Lost Leads</h3>
                <p className="text-gray-500">You don't have any declined or lost leads yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}