'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import { TruncatedText } from '@/components/ui/TruncatedText'

interface Review {
  id: string
  name: string
  location: string
  rating: number
  date: string
  service: string
  comment: string
  verified: boolean
  title?: string
}

interface ContractorReviewsSectionProps {
  reviews: Review[]
}

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${
        i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
      }`}
    />
  ))
}

export function ContractorReviewsSection({ reviews }: ContractorReviewsSectionProps) {
  const [displayedCount, setDisplayedCount] = useState(6)
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set())

  const displayedReviews = reviews.slice(0, displayedCount)
  const hasMore = reviews.length > displayedCount

  const handleLoadMore = () => {
    setDisplayedCount(prev => prev + 6)
  }

  const handleToggleExpand = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev)
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId)
      } else {
        newSet.add(reviewId)
      }
      return newSet
    })
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Star className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h4>
            <p className="text-gray-600">
              This contractor hasn't received any reviews yet. Be the first to share your experience!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        {displayedReviews.map((review) => {
          const isExpanded = expandedReviews.has(review.id)
          const shouldTruncate = review.comment && review.comment.length > 350
          const displayText = shouldTruncate && !isExpanded 
            ? review.comment.substring(0, 350) + '...'
            : review.comment

          return (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      {renderStars(review.rating)}
                      {review.verified && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="font-semibold text-[#0a4768]">{review.name}</div>
                    <div className="text-sm text-gray-600">{review.location}</div>
                  </div>
                  <div className="text-sm text-gray-500">{review.date}</div>
                </div>
                
                {review.title && (
                  <h4 className="font-semibold text-[#0a4768] mb-2 text-sm">
                    {review.title}
                  </h4>
                )}
                
                <Badge className="mb-3 bg-[#F5DD22] text-[#0a4768]">
                  {review.service}
                </Badge>
                
                <p className="text-gray-700 mb-2">
                  {displayText}
                </p>
                
                {shouldTruncate && (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-[#0a4768] hover:underline"
                    onClick={() => handleToggleExpand(review.id)}
                  >
                    {isExpanded ? 'Read Less' : 'Read More'}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {hasMore && (
        <div className="text-center mt-8">
          <Button
            onClick={handleLoadMore}
            className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3"
          >
            Read More Reviews
          </Button>
        </div>
      )}
    </>
  )
}

