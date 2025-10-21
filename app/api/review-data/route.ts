import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: Review data route called')
    
    const { searchParams } = new URL(request.url)
    const contractorId = searchParams.get('contractorId')
    const leadId = searchParams.get('leadId')
    
    console.log('🔍 API: Parameters:', { contractorId, leadId })
    
    // For now, just return a simple response to test if the route works
    return NextResponse.json({
      success: true,
      message: 'Review data API route is working',
      data: {
        contractorId,
        leadId,
        timestamp: new Date().toISOString()
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
