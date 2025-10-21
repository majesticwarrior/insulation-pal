'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Star, CheckCircle, AlertCircle, Home, MapPin, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface ReviewData {
  rating: number
  insulationAdded: string
  comments: string
  customerName: string
  customerEmail: string
}

interface ProjectDetails {
  customerName: string
  homeSize: number
  areasNeeded: string[]
  insulationTypes: string[]
  city: string
  state: string
  completedAt: string
}

export default function ContractorReview({ params }: { params: Promise<{ contractorId: string }> }) {
  const [contractorId, setContractorId] = useState<string>('')
  const searchParams = useSearchParams()
  const leadId = searchParams.get('lead')
  
  useEffect(() => {
    params.then(({ contractorId }) => setContractorId(contractorId))
  }, [params])
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null)
  const [contractorDetails, setContractorDetails] = useState<any>(null)
  const [reviewData, setReviewData] = useState<ReviewData>({
    rating: 0,
    insulationAdded: '',
    comments: '',
    customerName: '',
    customerEmail: ''
  })
  const [hoveredStar, setHoveredStar] = useState(0)

  useEffect(() => {
    if (contractorId && leadId) {
      fetchProjectDetails()
    } else {
      setLoading(false)
    }
  }, [contractorId, leadId])

  const fetchProjectDetails = async () => {
    try {
      if (!leadId || !contractorId) {
        toast.error('Invalid review link')
        return
      }

      // Fetch lead assignment and related data
      const { data: assignment, error: assignmentError } = await (supabase as any)
        .from('lead_assignments')
        .select(`
          id,
          status,
          project_completed_at,
          leads(
            customer_name,
            customer_email,
            home_size_sqft,
            areas_needed,
            insulation_types,
            city,
            state
          ),
          contractors(
            business_name,
            license_number
          )
        `)
        .eq('id', leadId)
        .eq('contractor_id', contractorId)
        .single()

      if (assignmentError) {
        console.error('Error fetching assignment:', assignmentError)
        toast.error('Project not found or access denied')
        return
      }

      if (!assignment || assignment.status !== 'completed') {
        toast.error('This project is not yet completed')
        return
      }

      setProjectDetails({
        customerName: assignment.leads.customer_name,
        homeSize: assignment.leads.home_size_sqft,
        areasNeeded: assignment.leads.areas_needed,
        insulationTypes: assignment.leads.insulation_types,
        city: assignment.leads.city,
        state: assignment.leads.state,
        completedAt: assignment.project_completed_at
      })

      setContractorDetails(assignment.contractors)
      setReviewData(prev => ({
        ...prev,
        customerName: assignment.leads.customer_name,
        customerEmail: assignment.leads.customer_email
      }))

    } catch (error) {
      console.error('Error fetching project details:', error)
      toast.error('Failed to load project details')
    } finally {
      setLoading(false)
    }
  }

  const handleRatingChange = (rating: number) => {
    setReviewData(prev => ({ ...prev, rating }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (reviewData.rating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (!reviewData.insulationAdded.trim()) {
      toast.error('Please specify what insulation was added')
      return
    }

    if (!reviewData.comments.trim()) {
      toast.error('Please provide comments about your experience')
      return
    }

    setSubmitting(true)
    try {
      // Submit review to database
      const { error: reviewError } = await (supabase as any)
        .from('reviews')
        .insert({
          contractor_id: contractorId,
          lead_assignment_id: leadId,
          customer_name: reviewData.customerName,
          customer_email: reviewData.customerEmail,
          rating: reviewData.rating,
          insulation_added: reviewData.insulationAdded,
          comments: reviewData.comments,
          review_date: new Date().toISOString()
        })

      if (reviewError) {
        console.error('Review submission error:', reviewError)
        toast.error('Failed to submit review')
        return
      }

      toast.success('Thank you for your review!')
      
      // Redirect or show success message
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)

    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a4768] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading project details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!projectDetails || !contractorDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Project Not Found</h2>
              <p className="text-gray-600">
                This project could not be found or you don't have permission to review it.
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#0a4768] mb-4">
              How was your insulation project?
            </h1>
            <p className="text-gray-600 text-lg">
              Help other homeowners by sharing your experience with {contractorDetails.business_name}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Details */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-[#0a4768]" />
                    <span className="font-medium">{projectDetails.homeSize.toLocaleString()} sq ft</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#0a4768]" />
                    <span>{projectDetails.city}, {projectDetails.state}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#0a4768]" />
                    <span>Completed {new Date(projectDetails.completedAt).toLocaleDateString()}</span>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Areas Insulated:</h4>
                    <div className="flex flex-wrap gap-1">
                      {projectDetails.areasNeeded.map((area, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Insulation Types:</h4>
                    <div className="flex flex-wrap gap-1">
                      {projectDetails.insulationTypes.map((type, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Review Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Leave Your Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Star Rating */}
                    <div>
                      <Label className="text-base font-medium">Overall Rating *</Label>
                      <div className="flex items-center gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(star)}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-8 w-8 ${
                                star <= (hoveredStar || reviewData.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {reviewData.rating === 0 ? 'Select rating' : 
                           reviewData.rating === 1 ? 'Poor' :
                           reviewData.rating === 2 ? 'Fair' :
                           reviewData.rating === 3 ? 'Good' :
                           reviewData.rating === 4 ? 'Very Good' : 'Excellent'}
                        </span>
                      </div>
                    </div>

                    {/* Insulation Added */}
                    <div>
                      <Label htmlFor="insulation-added" className="text-base font-medium">
                        What insulation was added? *
                      </Label>
                      <Textarea
                        id="insulation-added"
                        placeholder="e.g., R-38 fiberglass in attic, R-13 cellulose in walls..."
                        value={reviewData.insulationAdded}
                        onChange={(e) => setReviewData(prev => ({ ...prev, insulationAdded: e.target.value }))}
                        className="mt-2"
                        rows={3}
                        required
                      />
                    </div>

                    {/* Comments */}
                    <div>
                      <Label htmlFor="comments" className="text-base font-medium">
                        Tell us about your experience *
                      </Label>
                      <Textarea
                        id="comments"
                        placeholder="How was the communication? Was the work completed on time? How was the quality? Any issues or highlights?"
                        value={reviewData.comments}
                        onChange={(e) => setReviewData(prev => ({ ...prev, comments: e.target.value }))}
                        className="mt-2"
                        rows={5}
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-[#0a4768] hover:bg-[#0a4768]/90 text-white px-8 py-2"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Submit Review
                          </>
                        )}
                      </Button>
                    </div>
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