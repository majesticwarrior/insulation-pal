'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ReviewFormProps {
  contractorId: string
  leadAssignmentId?: string
}

export function ReviewForm({ contractorId, leadAssignmentId }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [location, setLocation] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleStarClick = (value: number) => {
    setRating(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    setSubmitting(true)
    try {
      // Create customer user if doesn't exist
      const { data: existingUser } = await (supabase as any)
        .from('users')
        .select('id')
        .eq('email', customerEmail)
        .single()

      let customerId = (existingUser as { id: string } | null)?.id

      if (!customerId) {
        const { data: newUser, error: userError } = await (supabase as any)
          .from('users')
          .insert({
            email: customerEmail,
            name: customerName,
            user_type: 'customer'
          })
          .select('id')
          .single()

        if (userError) throw userError
        customerId = (newUser as { id: string }).id
      }

      // Insert review
      const { error: reviewError } = await (supabase as any)
        .from('reviews')
        .insert({
          contractor_id: contractorId,
          customer_id: customerId,
          lead_assignment_id: leadAssignmentId,
          rating,
          comment,
          location,
          service_type: serviceType,
          verified: !!leadAssignmentId // Verified if from a real lead
        })

      if (reviewError) throw reviewError

      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Error submitting review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <div className="text-green-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#0a4768] mb-2">Thank You!</h2>
          <p className="text-gray-600">Your review has been submitted successfully.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-[#0a4768]">Leave a Review</CardTitle>
        <p className="text-gray-600">Share your experience to help other homeowners</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating *
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleStarClick(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      value <= (hoveredRating || rating)
                        ? 'text-[#F5DD22] fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 && (
                  <>
                    {rating} star{rating !== 1 ? 's' : ''}
                    {rating === 5 && ' - Excellent!'}
                    {rating === 4 && ' - Very Good'}
                    {rating === 3 && ' - Good'}
                    {rating === 2 && ' - Fair'}
                    {rating === 1 && ' - Poor'}
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name *
              </label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Phoenix, AZ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Type
              </label>
              <Input
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                placeholder="Attic Insulation"
              />
            </div>
          </div>

          {/* Review Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Review
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience with this contractor..."
              className="min-h-32"
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 mt-1">
              {comment.length}/1000 characters
            </div>
          </div>

          <Button
            type="submit"
            disabled={rating === 0 || !customerName || !customerEmail || submitting}
            className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
