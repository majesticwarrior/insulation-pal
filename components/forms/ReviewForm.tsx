'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const reviewSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  rating: z.number().min(1, 'Please select a rating').max(5, 'Rating cannot exceed 5 stars'),
  comment: z.string().optional()
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  contractorId: string
  contractorName: string
  leadId?: string
  onSuccess?: () => void
}

export function ReviewForm({ contractorId, contractorName, leadId, onSuccess }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      rating: 0,
      comment: ''
    }
  })

  const watchedRating = form.watch('rating')

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          contractor_id: contractorId,
          lead_id: leadId || null,
          customer_name: data.customerName,
          customer_email: data.customerEmail || null,
          rating: data.rating,
          comment: data.comment || null,
          verified: leadId ? true : false // Verified if from a lead
        })

      if (error) throw error

      toast.success('Thank you for your review!')
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1
      const isActive = starValue <= (hoveredStar || watchedRating)
      
      return (
        <button
          key={i}
          type="button"
          className={`text-2xl transition-colors ${
            isActive ? 'text-yellow-400' : 'text-gray-300'
          } hover:text-yellow-400`}
          onMouseEnter={() => setHoveredStar(starValue)}
          onMouseLeave={() => setHoveredStar(0)}
          onClick={() => form.setValue('rating', starValue)}
        >
          <Star className={`w-8 h-8 ${isActive ? 'fill-current' : ''}`} />
        </button>
      )
    })
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-[#0a4768]">
          Leave a Review for {contractorName}
        </CardTitle>
        <CardDescription>
          Share your experience to help other homeowners make informed decisions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    How would you rate your experience? *
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-1">
                      {renderStars()}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="john@example.com" 
                      type="email" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tell others about your experience</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share details about the quality of work, professionalism, timeliness, and overall satisfaction..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold py-3"
            >
              {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
