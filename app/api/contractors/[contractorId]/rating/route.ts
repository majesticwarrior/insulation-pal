import { NextRequest, NextResponse } from 'next/server'
import { calculateContractorRating } from '@/lib/contractor-rating'

interface RouteContext {
  params: Promise<{
    contractorId: string
  }>
}

export const GET = async (_request: NextRequest, context: RouteContext) => {
  const { contractorId } = await context.params

  if (!contractorId) {
    return NextResponse.json(
      {
        success: false,
        error: 'Contractor ID is required.'
      },
      { status: 400 }
    )
  }

  const ratingSummary = await calculateContractorRating(contractorId)

  return NextResponse.json(
    {
      success: true,
      data: ratingSummary
    },
    { status: 200 }
  )
}

