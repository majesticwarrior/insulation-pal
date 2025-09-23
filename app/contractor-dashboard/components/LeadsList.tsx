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
  response_date?: string
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

export function LeadsList({ contractorId }: { contractorId: string }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [responding, setResponding] = useState<string | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [contractorId])

  async function fetchLeads() {
    try {
      const { data, error } = await supabase
        .from('lead_assignments')
        .select(`
          id,
          lead_id,
          status,
          cost,
          created_at,
          response_date,
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
        .order('created_at', { ascending: false })

      if (error) throw error
      setLeads(data || [])
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  async function respondToLead(leadAssignmentId: string, response: 'accept' | 'decline') {
    setResponding(leadAssignmentId)
    try {
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
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'declined': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading leads...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#0a4768]">Available Leads</h2>
        <Badge variant="secondary">
          {leads.filter(l => l.status === 'pending').length} pending
        </Badge>
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
                
                {leadAssignment.status === 'accepted' && (
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
                )}
              </div>

              {leadAssignment.status === 'pending' && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => respondToLead(leadAssignment.id, 'accept')}
                    disabled={responding === leadAssignment.id}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {responding === leadAssignment.id ? 'Responding...' : 'Accept Lead'}
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

              {leadAssignment.status === 'declined' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600">
                    <X className="h-5 w-5 mr-2" />
                    <span className="font-medium">Lead Declined</span>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 mt-4">
                <Clock className="h-3 w-3 inline mr-1" />
                Received: {new Date(leadAssignment.created_at).toLocaleDateString()}
                {leadAssignment.response_date && (
                  <span className="ml-4">
                    Responded: {new Date(leadAssignment.response_date).toLocaleDateString()}
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
