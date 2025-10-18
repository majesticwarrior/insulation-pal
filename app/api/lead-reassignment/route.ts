import { NextRequest, NextResponse } from 'next/server'
import { checkAndReassignExpiredLeads, getLeadAssignmentStats } from '@/lib/lead-reassignment'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting lead reassignment check...')
    
    // Check for expired assignments and reassign them
    await checkAndReassignExpiredLeads()
    
    // Get statistics for monitoring
    const stats = await getLeadAssignmentStats()
    
    console.log('✅ Lead reassignment check completed')
    
    return NextResponse.json({
      success: true,
      message: 'Lead reassignment check completed',
      stats: stats
    })
    
  } catch (error: any) {
    console.error('❌ Error in lead reassignment API:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return current statistics
    const stats = await getLeadAssignmentStats()
    
    return NextResponse.json({
      success: true,
      stats: stats
    })
    
  } catch (error: any) {
    console.error('❌ Error fetching assignment stats:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
