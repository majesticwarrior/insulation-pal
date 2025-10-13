'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { handleContractorResponse } from '@/lib/lead-assignment'
import { Phone, Mail, MapPin, Home, CheckCircle, X, Clock } from 'lucide-react'

interface Lead {
  id: string
  lead_id: string
  status: string
  cost: number
  created_at: string
  responded_at?: string
  leads: {
    customer_name: string
    customer_email: string
    customer_phone?: string
    home_size_sqft: number
    areas_needed: string[]
    insulation_types: string[]
    city: string
    state: string
    zip_code?: string
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
      
      // If we get a connection error, we're likely in demo mode
      if (testError && (testError.message?.includes('placeholder') || 
                       testError.message?.includes('Invalid API key') ||
                       testError.code === 'PGRST301' ||
                       testError.code === 'PGRST116')) {
        console.log('🎭 Demo Mode detected: Simulating leads data')
        // Simulate some demo leads
        const demoLeads = [
          {
            id: 'demo-1',
            lead_id: 'demo-lead-1',
            status: 'sent',
            cost: 20.00,
            created_at: new Date().toISOString(),
            leads: {
              customer_name: 'John Smith',
              customer_email: 'john@example.com',
              customer_phone: '(555) 123-4567',
              home_size_sqft: 2500,
              areas_needed: ['attic', 'walls'],
              insulation_types: ['fiberglass', 'cellulose'],
              city: 'Phoenix',
              state: 'AZ',
              zip_code: '85001'
            }
          },
          {
            id: 'demo-2',
            lead_id: 'demo-lead-2',
            status: 'sent',
            cost: 20.00,
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            leads: {
              customer_name: 'Sarah Johnson',
              customer_email: 'sarah@example.com',
              customer_phone: '(555) 987-6543',
              home_size_sqft: 1800,
              areas_needed: ['basement'],
              insulation_types: ['spray_foam'],
              city: 'Tempe',
              state: 'AZ',
              zip_code: '85281'
            }
          }
        ]
        
        console.log('✅ Demo Mode: Returning simulated leads:', demoLeads)
        setLeads(demoLeads)
        return
      }
      
      if (testError) {
        console.error('❌ Table access error:', testError)
        throw new Error(`Cannot access lead_assignments table: ${testError.message}`)
      }
      
      // Now try the full query
      console.log('🔍 Executing main query for contractor:', contractorId)
      let { data, error }: { data: any[] | null, error: any } = await supabase
        .from('lead_assignments')
        .select(`
          id,
          lead_id,
          status,
          cost,
          created_at,
          responded_at,
          leads(
            customer_name,
            customer_email,
            customer_phone,
            home_size_sqft,
            areas_needed,
            insulation_types,
            city,
            state,
            zip_code
          )
        `)
        .eq('contractor_id', contractorId)
        .neq('status', 'declined')
        .order('created_at', { ascending: false })

      console.log('🔍 Main query result:', { 
        dataLength: data?.length || 0, 
        error, 
        data: data?.slice(0, 2) // Log first 2 items for debugging
      })

      // If the join query fails, try a simpler approach
      if (error && error.message?.includes('relation') || error?.code === 'PGRST116') {
        console.log('🔄 Join query failed, trying separate queries...')
        
        // First get lead assignments
        const { data: assignments, error: assignmentsError } = await supabase
          .from('lead_assignments')
          .select('*')
          .eq('contractor_id', contractorId)
          .neq('status', 'declined')
          .order('created_at', { ascending: false })
        
        if (assignmentsError) {
          console.error('❌ Assignments query failed:', assignmentsError)
          throw assignmentsError
        }
        
        console.log('✅ Got assignments:', assignments)
        
        if (assignments && assignments.length > 0) {
          // Get lead details for each assignment
          const leadIds = assignments.map((a: any) => a.lead_id)
          const { data: leadsData, error: leadsError } = await supabase
            .from('leads')
            .select('*')
            .in('id', leadIds)
          
          if (leadsError) {
            console.error('❌ Leads query failed:', leadsError)
            throw leadsError
          }
          
          console.log('✅ Got leads:', leadsData)
          
          // Combine the data
          data = assignments.map((assignment: any) => ({
            ...assignment,
            leads: leadsData?.find((lead: any) => lead.id === assignment.lead_id) || {}
          }))
          
          error = null
          console.log('✅ Combined data:', data)
        } else {
          data = []
          error = null
        }
      }

      console.log('🔍 LeadsList: Query result:', { data, error })
      console.log('🔍 LeadsList: Data length:', data?.length || 0)
      console.log('🔍 LeadsList: Error details:', {
        error,
        errorMessage: error?.message,
        errorCode: error?.code,
        errorDetails: error?.details,
        errorHint: error?.hint
      })
      
      if (error) {
        console.error('❌ LeadsList: Query error:', error)
        console.error('❌ Error message:', error.message)
        console.error('❌ Error code:', error.code)
        console.error('❌ Error details:', error.details)
        throw error
      }
      
      console.log('✅ LeadsList: Successfully fetched leads:', data)
      setLeads(data || [])
    } catch (error) {
      console.error('❌ LeadsList: Error fetching leads:', error)
      console.error('❌ Error type:', typeof error)
      console.error('❌ Error constructor:', error?.constructor?.name)
      console.error('❌ Error stringified:', JSON.stringify(error, null, 2))
    } finally {
      setLoading(false)
    }
  }

  async function respondToLead(leadAssignmentId: string, response: 'accept' | 'decline') {
    setResponding(leadAssignmentId)
    try {
      // Check if this is a demo lead
      if (leadAssignmentId.startsWith('demo-')) {
        console.log('🎭 Demo Mode: Simulating lead response:', response)
        // Simulate response by updating local state
        setLeads(prevLeads => 
          prevLeads.map(lead => 
            lead.id === leadAssignmentId 
              ? { 
                  ...lead, 
                  status: response === 'accept' ? 'accepted' : 'declined',
                  responded_at: new Date().toISOString()
                }
              : lead
          )
        )
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        return
      }
      
      await handleContractorResponse(leadAssignmentId, contractorId, response)
      await fetchLeads() // Refresh the list
    } catch (error) {
      console.error('Error responding to lead:', error)
    } finally {
      setResponding(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-yellow-100 text-yellow-800'
      case 'viewed': return 'bg-blue-100 text-blue-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'hired': return 'bg-green-100 text-green-800'
      // Legacy support for old status values
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading leads...</div>
  }

  // Check if we're in demo mode by looking at the leads data
  const isDemoMode = leads.length > 0 && leads[0]?.id?.startsWith('demo-')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0a4768]">Available Leads</h2>
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
            {leads.filter(l => l.status === 'sent' || l.status === 'pending').length} pending
          </Badge>
        </div>
      </div>

      {leads.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No leads available at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        leads.map((leadAssignment) => (
          <Card key={leadAssignment.id} className="hover:shadow-lg transition-shadow">
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
                    {leadAssignment.status}
                  </Badge>
                  <div className="text-sm text-gray-500 mt-1">
                    Cost: ${leadAssignment.cost}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {leadAssignment.status === 'accepted' ? (
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <Home className="h-4 w-4 mr-2 text-[#0a4768]" />
                      <span className="font-medium">Home Size:</span>
                      <span className="ml-1">{leadAssignment.leads.home_size_sqft.toLocaleString()} sq ft</span>
                    </div>
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
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-[#0a4768]" />
                      <span className="text-sm">{leadAssignment.leads.customer_email}</span>
                    </div>
                    {leadAssignment.leads.customer_phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-[#0a4768]" />
                        <span className="text-sm">{leadAssignment.leads.customer_phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    <span className="font-semibold">New Lead Available</span>
                  </p>
                  <p className="text-sm text-blue-700">
                    Accept this lead to view complete project details and customer contact information.
                  </p>
                </div>
              )}

              {(leadAssignment.status === 'pending' || leadAssignment.status === 'sent') && (
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

              {leadAssignment.status === 'accepted' && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center text-green-800">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Lead Accepted</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    You can now contact the customer directly using the information above.
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
        ))
      )}
    </div>
  )
}
