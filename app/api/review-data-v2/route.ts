import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contractorId = searchParams.get('contractorId')
    const leadId = searchParams.get('leadId')
    
    return NextResponse.json({
      success: true,
      message: 'Review data API route is working',
      data: {
        contractorId,
        leadId,
        timestamp: new Date().toISOString(),
        route: 'review-data-v2'
      }
    })

  } catch (error: any) {
    console.error('❌ API: Error in review data fetch:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
