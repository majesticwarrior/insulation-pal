'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Star, 
  MapPin, 
  Shield, 
  Calendar, 
  Users,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
  Search
} from 'lucide-react'
import { toast } from 'sonner'

interface Contractor {
  id: string
  business_name: string
  license_number?: string
  license_verified: boolean
  insurance_verified: boolean
  business_city?: string
  business_state?: string
  business_zip?: string
  bio?: string
  founded_year?: number
  employee_count?: number
  certifications?: string[]
  review_count: number
  average_rating: number
}

interface ContractorInvitationModalProps {
  isOpen: boolean
  onClose: () => void
  leadId: string
  customerCity: string
  customerState: string
  customerZip?: string
  projectDetails: {
    homeSize: number
    areas: string[]
    insulationTypes: string[]
  }
}

export function ContractorInvitationModal({
  isOpen,
  onClose,
  leadId,
  customerCity,
  customerState,
  customerZip,
  projectDetails
}: ContractorInvitationModalProps) {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [selectedContractors, setSelectedContractors] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [sendingInvitations, setSendingInvitations] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [excludedCount, setExcludedCount] = useState(0)

  useEffect(() => {
    if (isOpen) {
      fetchContractors()
    }
  }, [isOpen, leadId, customerCity, customerState])

  const fetchContractors = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        city: customerCity,
        state: customerState,
        leadId: leadId
      })
      
      if (customerZip) {
        params.append('zipCode', customerZip)
      }

      console.log('🔍 Fetching contractors with params:', params.toString())
      const response = await fetch(`/api/contractors/search?${params}`)
      const data = await response.json()
      
      console.log('📊 API response:', { 
        ok: response.ok, 
        status: response.status, 
        contractorsCount: data.contractors?.length || 0,
        excludedCount: data.excludedCount || 0,
        data 
      })

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch contractors')
      }

      setContractors(data.contractors || [])
      setExcludedCount(data.excludedCount || 0)
    } catch (error: any) {
      console.error('Error fetching contractors:', error)
      toast.error('Failed to load contractors')
    } finally {
      setLoading(false)
    }
  }

  const handleContractorSelect = (contractorId: string) => {
    const newSelected = new Set(selectedContractors)
    if (newSelected.has(contractorId)) {
      newSelected.delete(contractorId)
    } else {
      newSelected.add(contractorId)
    }
    setSelectedContractors(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedContractors.size === filteredContractors.length) {
      setSelectedContractors(new Set())
    } else {
      setSelectedContractors(new Set(filteredContractors.map(c => c.id)))
    }
  }

  const handleSendInvitations = async () => {
    if (selectedContractors.size === 0) {
      toast.error('Please select at least one contractor')
      return
    }

    setSendingInvitations(true)
    try {
      const response = await fetch('/api/invitations/bulk-send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId,
          contractorIds: Array.from(selectedContractors),
          customerName: 'Customer', // This would come from lead data
          projectDetails
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitations')
      }

      toast.success(`Invitations sent to ${data.totalInvited} contractors!`)
      
      if (data.errors && data.errors.length > 0) {
        toast.warning(`${data.totalErrors} invitations failed to send`)
      }

      onClose()
    } catch (error: any) {
      console.error('Error sending invitations:', error)
      toast.error(error.message || 'Failed to send invitations')
    } finally {
      setSendingInvitations(false)
    }
  }

  const filteredContractors = contractors.filter(contractor =>
    contractor.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contractor.business_city?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Invite Contractors to Quote Your Project
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col flex-1 min-h-0 space-y-4">
          {/* Project Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Project Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <span className="font-medium">Home Size:</span> {projectDetails.homeSize.toLocaleString()} sq ft
                </div>
                <div>
                  <span className="font-medium">Location:</span> {customerCity}, {customerState}
                </div>
                <div>
                  <span className="font-medium">Areas:</span> {projectDetails.areas.join(', ')}
                </div>
                <div>
                  <span className="font-medium">Insulation Types:</span> {projectDetails.insulationTypes.join(', ')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search and Selection Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contractors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={filteredContractors.length === 0}
              >
                {selectedContractors.size === filteredContractors.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              {selectedContractors.size} of {filteredContractors.length} selected
              {excludedCount > 0 && (
                <span className="ml-2 text-blue-600">
                  ({excludedCount} already invited)
                </span>
              )}
            </div>
          </div>

          {/* Contractors List - Scrollable */}
          <div className="flex-1 overflow-y-auto min-h-0 border border-gray-200 rounded-lg">
            <div className="p-4 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading contractors...</span>
              </div>
            ) : filteredContractors.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Contractors Found</h3>
                <p className="text-gray-500">
                  No additional contractors found in your area. Try expanding your search or check back later.
                </p>
              </div>
            ) : (
              filteredContractors.map((contractor) => (
                <Card 
                  key={contractor.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedContractors.has(contractor.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => handleContractorSelect(contractor.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <Checkbox
                        checked={selectedContractors.has(contractor.id)}
                        onChange={() => handleContractorSelect(contractor.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {contractor.business_name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {contractor.license_verified && contractor.insurance_verified && (
                              <Badge className="bg-green-100 text-green-800 flex items-center space-x-1">
                                <Shield className="h-3 w-3" />
                                <span>Verified</span>
                              </Badge>
                            )}
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span>{contractor.average_rating > 0 ? contractor.average_rating.toFixed(1) : 'No reviews'}</span>
                              <span>({contractor.review_count} reviews)</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {contractor.business_city}, {contractor.business_state}
                              {contractor.business_zip && ` ${contractor.business_zip}`}
                            </span>
                          </div>
                          {contractor.founded_year && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date().getFullYear() - contractor.founded_year} years in business</span>
                            </div>
                          )}
                          {contractor.employee_count && (
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{contractor.employee_count} employees</span>
                            </div>
                          )}
                        </div>

                        {contractor.license_number && (
                          <div className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">License:</span> {contractor.license_number}
                          </div>
                        )}


                        {contractor.bio && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {contractor.bio}
                          </p>
                        )}

                        {contractor.certifications && contractor.certifications.length > 0 && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {contractor.certifications.slice(0, 3).map((cert, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {cert}
                                </Badge>
                              ))}
                              {contractor.certifications.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{contractor.certifications.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              {selectedContractors.size > 0 && (
                <span>
                  {selectedContractors.size} contractor{selectedContractors.size !== 1 ? 's' : ''} selected
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSendInvitations}
                disabled={selectedContractors.size === 0 || sendingInvitations}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {sendingInvitations ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending Invitations...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invitations ({selectedContractors.size})
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
