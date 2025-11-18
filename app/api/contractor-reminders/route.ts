import { NextRequest, NextResponse } from 'next/server'
import { checkAndSendReminders, getReminderStats } from '@/lib/contractor-reminders'

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Starting contractor reminder check...')
    
    // Check for contractors who need reminders and send them
    const result = await checkAndSendReminders()
    
    // Get statistics for monitoring
    const stats = await getReminderStats()
    
    console.log('✅ Contractor reminder check completed')
    
    return NextResponse.json({
      success: true,
      message: 'Contractor reminder check completed',
      result: result,
      stats: stats
    })
    
  } catch (error: any) {
    console.error('❌ Error in contractor reminders API:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const stats = await getReminderStats()
    
    return NextResponse.json({
      success: true,
      stats: stats
    })
    
  } catch (error: any) {
    console.error('❌ Error getting reminder stats:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

