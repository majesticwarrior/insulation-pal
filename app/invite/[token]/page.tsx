'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText, 
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Phone,
  Mail
} from 'lucide-react'
import { toast } from 'sonner'

interface Lead {
  id: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  home_size_sqft: number
  areas_needed: string[]
  insulation_types: string[]
  city: string
  state: string
  zip_code?: string
  property_address?: string
  project_timeline?: string
  budget_range?: string
  created_at: string
}

interface Invitation {
  id: string
  leadId: string
  expiresAt: string
  createdAt: string
  lead: Lead
}

export default function ContractorInvitationPage() {
  const params = useParams()
  const inviteToken = params.token as string
  
  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  // Quote form state
  const [contractorName, setContractorName] = useState('')
  const [contractorEmail, setContractorEmail] = useState('')
  const [contractorPhone, setContractorPhone] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [quoteAmount, setQuoteAmount] = useState('')
  const [quoteNotes, setQuoteNotes] = useState('')
  const [estimatedTimeline, setEstimatedTimeline] = useState('')

  useEffect(() => {
    if (inviteToken) {
      fetchInvitationDetails()
    }
  }, [inviteToken])

  const fetchInvitationDetails = async () => {
    try {
      const response = await fetch(`/api/invitations/details?token=${inviteToken}`)
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Invitation not found or invalid')
        } else if (response.status === 410) {
          toast.error('This invitation has expired')
        } else {
          toast.error(data.error || 'Failed to load invitation')
        }
        return
      }

      setInvitation(data.invitation)
    } catch (error: any) {
      console.error('Error fetching invitation:', error)
      toast.error('Failed to load invitation details')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!contractorName || !contractorEmail || !businessName || !quoteAmount) {
      toast.error('Please fill in all required fields')
      return
    }

    if (parseFloat(quoteAmount) <= 0) {
      toast.error('Please enter a valid quote amount')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/invitations/submit-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteToken,
          contractorName,
          contractorEmail,
          contractorPhone,
          businessName,
          licenseNumber,
          quoteAmount: parseFloat(quoteAmount),
          quoteNotes,
          estimatedTimeline
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit quote')
      }

      toast.success('Quote submitted successfully! The customer will be notified.')
      setSubmitted(true)
    } catch (error: any) {
      console.error('Error submitting quote:', error)
      toast.error(error.message || 'Failed to submit quote')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading invitation details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Invitation</h1>
            <p className="text-gray-600">This invitation link is not valid or has expired.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Quote Submitted Successfully!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for submitting your quote for {invitation.lead.customer_name}'s project. 
              The customer will be notified and may contact you directly.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
              <ul className="text-blue-700 text-left space-y-1">
                <li>• The customer will receive your quote via email</li>
                <li>• They may contact you directly to discuss the project</li>
                <li>• You can expect to hear from them within 24-48 hours</li>
                <li>• If selected, you'll be notified and can proceed with the project</li>
              </ul>
            </div>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Return to Homepage
            </Button>
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
          <p className="text-blue-100">Contractor Invitation</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              You're Invited to Quote This Project
            </h1>
            <p className="text-lg text-gray-600">
              A customer has invited you to submit a quote for their insulation project
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Project Details */}
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Project Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Customer:</span>
                    <span>{invitation.lead.customer_name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Home className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Home Size:</span>
                    <span>{invitation.lead.home_size_sqft.toLocaleString()} sq ft</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Location:</span>
                    <span>{invitation.lead.city}, {invitation.lead.state}</span>
                  </div>

                  {invitation.lead.property_address && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Address:</span>
                      <span>{invitation.lead.property_address}</span>
                    </div>
                  )}

                  <div>
                    <span className="font-medium">Areas Needed:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {invitation.lead.areas_needed.map((area, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-medium">Insulation Types:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {invitation.lead.insulation_types.map((type, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {invitation.lead.project_timeline && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Timeline:</span>
                      <span>{invitation.lead.project_timeline}</span>
                    </div>
                  )}

                  {invitation.lead.budget_range && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Budget Range:</span>
                      <span>{invitation.lead.budget_range}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-green-800 mb-2">Why Quote This Project?</h3>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Direct invitation from customer</li>
                    <li>• No competition from other contractors</li>
                    <li>• Customer is actively seeking quotes</li>
                    <li>• High probability of project award</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Quote Submission Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Send className="h-5 w-5 mr-2" />
                    Submit Your Quote
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitQuote} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contractorName">Your Name *</Label>
                        <Input
                          id="contractorName"
                          value={contractorName}
                          onChange={(e) => setContractorName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contractorEmail">Email *</Label>
                        <Input
                          id="contractorEmail"
                          type="email"
                          value={contractorEmail}
                          onChange={(e) => setContractorEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contractorPhone">Phone</Label>
                        <Input
                          id="contractorPhone"
                          type="tel"
                          value={contractorPhone}
                          onChange={(e) => setContractorPhone(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="businessName">Business Name *</Label>
                        <Input
                          id="businessName"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="licenseNumber">License Number</Label>
                      <Input
                        id="licenseNumber"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="ROC123456"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quoteAmount">Quote Amount ($) *</Label>
                        <Input
                          id="quoteAmount"
                          type="number"
                          step="0.01"
                          min="0"
                          value={quoteAmount}
                          onChange={(e) => setQuoteAmount(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="estimatedTimeline">Estimated Timeline</Label>
                        <Input
                          id="estimatedTimeline"
                          value={estimatedTimeline}
                          onChange={(e) => setEstimatedTimeline(e.target.value)}
                          placeholder="e.g., 2-3 weeks"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="quoteNotes">Quote Details & Notes</Label>
                      <Textarea
                        id="quoteNotes"
                        value={quoteNotes}
                        onChange={(e) => setQuoteNotes(e.target.value)}
                        placeholder="Describe your approach, materials, timeline, and any special considerations..."
                        rows={4}
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Your quote will be sent directly to the customer. 
                        They may contact you for additional questions or to schedule the work.
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting Quote...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Quote
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
