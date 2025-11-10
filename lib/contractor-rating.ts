import { SupabaseClient } from '@supabase/supabase-js'
import { createServerClient } from './supabase'
import { Database } from './database.types'

export interface ContractorRatingSummary {
  reviewScore: number
  reviewCount: number
  responseScore: number
  responseSampleSize: number
  averageResponseMinutes: number | null
  compositeScore: number
}

const mapResponseMinutesToScore = (minutes: number) => {
  if (minutes <= 30) {
    return 5
  }

  if (minutes <= 120) {
    return 4
  }

  if (minutes <= 360) {
    return 3
  }

  if (minutes <= 1440) {
    return 2
  }

  return 1
}

const roundToSingleDecimal = (value: number) => {
  return Math.round(value * 10) / 10
}

export const calculateContractorRating = async (
  contractorId: string,
  client?: SupabaseClient<Database>
): Promise<ContractorRatingSummary> => {
  const supabaseClient =
    client ?? createServerClient()

  try {
    const [{ data: reviewRows, error: reviewError }, { data: responseRows, error: responseError }] =
      await Promise.all([
        (supabaseClient as any)
          .from('reviews')
          .select('rating')
          .eq('contractor_id', contractorId)
          .eq('verified', true),
        (supabaseClient as any)
          .from('lead_assignments')
          .select('assigned_at, responded_at')
          .eq('contractor_id', contractorId)
          .not('responded_at', 'is', null)
      ])

    if (reviewError) {
      console.error('🚨 Failed to fetch contractor reviews for rating:', reviewError)
    }

    if (responseError) {
      console.error('🚨 Failed to fetch contractor response data for rating:', responseError)
    }

    const validReviewRatings =
      reviewRows
        ?.map((row: { rating: number | null }) => Number(row.rating))
        .filter((ratingValue: number) => !Number.isNaN(ratingValue)) ?? []

    const reviewScore =
      validReviewRatings.length > 0
        ? roundToSingleDecimal(
            validReviewRatings.reduce((total: number, rating: number) => total + rating, 0) / validReviewRatings.length
          )
        : 0

    const reviewCount = validReviewRatings.length

    const responseMinutes =
      responseRows
        ?.map((row: { assigned_at: string; responded_at: string | null }) => {
          if (!row.assigned_at || !row.responded_at) {
            return null
          }

          const assignedAt = new Date(row.assigned_at).getTime()
          const respondedAt = new Date(row.responded_at).getTime()

          if (Number.isNaN(assignedAt) || Number.isNaN(respondedAt) || respondedAt <= assignedAt) {
            return null
          }

          const differenceMs = respondedAt - assignedAt

          return differenceMs / (1000 * 60)
        })
        .filter((minutes: number | null): minutes is number => minutes !== null && Number.isFinite(minutes)) ?? []

    const averageResponseMinutes =
      responseMinutes.length > 0
        ? roundToSingleDecimal(
            responseMinutes.reduce((total: number, minutes: number) => total + minutes, 0) /
              responseMinutes.length
          )
        : null

    const responseScore =
      averageResponseMinutes !== null ? mapResponseMinutesToScore(averageResponseMinutes) : 0

    const responseSampleSize = responseMinutes.length

    const reviewWeight = reviewCount > 0 ? 0.7 : 0
    const responseWeight = responseSampleSize > 0 ? 0.3 : 0
    const totalWeight = reviewWeight + responseWeight

    const compositeScore =
      totalWeight === 0
        ? 0
        : roundToSingleDecimal(
            ((reviewScore * reviewWeight) + (responseScore * responseWeight)) / totalWeight
          )

    return {
      reviewScore,
      reviewCount,
      responseScore,
      responseSampleSize,
      averageResponseMinutes,
      compositeScore
    }
  } catch (error) {
    console.error('🚨 Unexpected error calculating contractor rating:', error)

    return {
      reviewScore: 0,
      reviewCount: 0,
      responseScore: 0,
      responseSampleSize: 0,
      averageResponseMinutes: null,
      compositeScore: 0
    }
  }
}

