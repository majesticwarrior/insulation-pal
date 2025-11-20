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
        <CardContent className="text-center py-8 md:py-12">
          <div className="text-gray-500 mb-4">
            <Star className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-400" />
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h4>
            <p className="text-sm sm:text-base text-gray-600 px-4">
              This contractor hasn't received any reviews yet. Be the first to share your experience!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {displayedReviews.map((review) => {
          const isExpanded = expandedReviews.has(review.id)
          const shouldTruncate = review.comment && review.comment.length > 350
          const displayText = shouldTruncate && !isExpanded 
            ? review.comment.substring(0, 350) + '...'
            : review.comment

          return (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-3 md:mb-4 gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-2 flex-wrap gap-2">
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="font-semibold text-[#0a4768] text-sm sm:text-base">{review.name}</div>
                    <div className="text-xs sm:text-sm text-gray-600">{review.location}</div>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">{review.date}</div>
                </div>
                
                {review.title && (
                  <h4 className="font-semibold text-[#0a4768] mb-2 text-xs sm:text-sm">
                    {review.title}
                  </h4>
                )}
                
                <Badge className="mb-3 bg-[#F5DD22] text-[#0a4768] text-xs">
                  {review.service}
                </Badge>
                
                <p className="text-gray-700 mb-2 text-sm sm:text-base leading-relaxed">
                  {displayText}
                </p>
                
                {shouldTruncate && (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-[#0a4768] hover:underline text-sm"
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
        <div className="text-center mt-6 md:mt-8">
          <Button
            onClick={handleLoadMore}
            className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-base"
          >
            Read More Reviews
          </Button>
        </div>
      )}
    </>
  )
}

