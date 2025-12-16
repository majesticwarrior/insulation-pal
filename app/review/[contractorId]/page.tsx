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
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface ReviewData {
  rating: number
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
  const leadId = searchParams.get('leadId')
  
  useEffect(() => {
    params.then(({ contractorId }) => setContractorId(contractorId))
  }, [params])
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null)
  const [contractorDetails, setContractorDetails] = useState<any>(null)
  const [reviewData, setReviewData] = useState<ReviewData>({
    rating: 0,
    comments: '',
    customerName: '',
    customerEmail: ''
  })
  const [hoveredStar, setHoveredStar] = useState(0)

  useEffect(() => {
    if (contractorId && leadId) {
      fetchProjectDetails()
    }
    // Don't set loading to false here - let fetchProjectDetails handle it
  }, [contractorId, leadId])

  const fetchProjectDetails = async () => {
    try {
      if (!leadId || !contractorId) {
        console.error('Missing required parameters:', { contractorId, leadId })
        setLoading(false)
        return
      }

      console.log('🔍 Fetching project details:', { contractorId, leadId })

      // Use API route to bypass RLS policies
      console.log('🔍 Fetching from API:', `/api/review-data?contractorId=${contractorId}&leadId=${leadId}`)
      const response = await fetch(`/api/review-data?contractorId=${contractorId}&leadId=${leadId}`)
      console.log('🔍 API Response status:', response.status)
      const result = await response.json()
      console.log('🔍 API Response body:', result)

      if (!response.ok || !result.success) {
        console.error('❌ Error fetching project details:', result.error)
        console.error('❌ Full error response:', result)
        toast.error(result.error || 'Project not found or access denied')
        setLoading(false)
        return
      }

      console.log('✅ Project details fetched successfully:', result.data)
      console.log('🔍 Full API response:', result)

      // Add defensive checks for data structure
      if (!result.data || !result.data.projectDetails || !result.data.contractorDetails) {
        console.error('❌ Invalid data structure:', result.data)
        toast.error('Invalid project data received')
        setLoading(false)
        return
      }

      console.log('🔍 Project details:', result.data.projectDetails)
      console.log('🔍 Contractor details:', result.data.contractorDetails)

      setProjectDetails(result.data.projectDetails)
      setContractorDetails(result.data.contractorDetails)
      
      const newReviewData = {
        ...reviewData,
        customerName: result.data.projectDetails.customerName || 'Betty Wilcox',
        customerEmail: result.data.projectDetails.customerEmail || 'shannon.adams78@gmail.com'
      }
      
      console.log('🔍 Setting review data:', newReviewData)
      console.log('🔍 Customer name from API:', result.data.projectDetails.customerName)
      console.log('🔍 Customer email from API:', result.data.projectDetails.customerEmail)
      
      setReviewData(newReviewData)

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


    if (!reviewData.comments.trim()) {
      toast.error('Please provide comments about your experience')
      return
    }

    setSubmitting(true)
    try {
      // Submit review using API route (bypasses RLS)
      const response = await fetch('/api/submit-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractorId: contractorId,
          leadAssignmentId: leadId,
          customerName: reviewData.customerName,
          customerEmail: reviewData.customerEmail,
          rating: reviewData.rating,
          comments: reviewData.comments
        })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        console.error('Review submission error:', result.error)
        toast.error(result.error || 'Failed to submit review')
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
              <div className="mt-4 text-sm text-gray-500">
                <p>Contractor ID: {contractorId}</p>
                <p>Lead ID: {leadId}</p>
              </div>
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
              Help other homeowners by sharing your experience with {contractorDetails.businessName || 'this contractor'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Details */}
            <div className="lg:col-span-1 space-y-4">
              {/* Contractor Info Card */}
              <Card className="border-2 border-[#0a4768]">
                <CardHeader className="bg-[#0a4768] text-white">
                  <CardTitle className="text-lg">Reviewing Contractor</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#F5DD22] rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#0a4768]">
                        {contractorDetails.businessName?.charAt(0) || 'C'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#0a4768] mb-2">
                      {contractorDetails.businessName || 'Contractor'}
                    </h3>
                    {contractorDetails.licenseNumber && (
                      <p className="text-sm text-gray-600">
                        License: {contractorDetails.licenseNumber}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Project Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-[#0a4768]" />
                    <span className="font-medium">{projectDetails.homeSize?.toLocaleString() || 'N/A'} sq ft</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#0a4768]" />
                    <span>{projectDetails.city || 'N/A'}, {projectDetails.state || 'N/A'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#0a4768]" />
                    <span>Completed {projectDetails.completedAt ? new Date(projectDetails.completedAt).toLocaleDateString() : 'N/A'}</span>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Areas Insulated:</h4>
                    <div className="flex flex-wrap gap-1">
                      {projectDetails.areasNeeded?.map((area, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {area}
                        </span>
                      )) || <span className="text-gray-500">N/A</span>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Insulation Types:</h4>
                    <div className="flex flex-wrap gap-1">
                      {projectDetails.insulationTypes?.map((type, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {type}
                        </span>
                      )) || <span className="text-gray-500">N/A</span>}
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