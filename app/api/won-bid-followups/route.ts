import { NextRequest, NextResponse } from 'next/server'
import { checkAndSendWonBidFollowups, getWonBidFollowupStats } from '@/lib/won-bid-followups'

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Starting won bid follow-up check...')
    
    // Check for won bids that need follow-ups and send them
    const result = await checkAndSendWonBidFollowups()
    
    // Get statistics for monitoring
    const stats = await getWonBidFollowupStats()
    
    console.log('✅ Won bid follow-up check completed')
    
    return NextResponse.json({
      success: true,
      message: 'Won bid follow-up check completed',
      result: result,
      stats: stats
    })
    
  } catch (error: any) {
    console.error('❌ Error in won bid follow-ups API:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const stats = await getWonBidFollowupStats()
    
    return NextResponse.json({
      success: true,
      stats: stats
    })
    
  } catch (error: any) {
    console.error('❌ Error getting won bid follow-up stats:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

