import { NextRequest, NextResponse } from 'next/server'
import { assignLeadToContractors } from '@/lib/lead-assignment'

export async function POST(req: NextRequest) {
  try {
    console.log('🧪 Testing lead assignment process...')

    // Create a test lead
    const testLead = {
      id: 'test-lead-' + Date.now(),
      customer_name: 'Test Customer',
      customer_email: 'test@example.com',
      customer_phone: '555-0123',
      home_size_sqft: 2500,
      areas_needed: ['attic'],
      insulation_types: ['blown_in'],
      city: 'Phoenix',
      state: 'AZ',
      zip_code: '85001',
      created_at: new Date().toISOString()
    }

    console.log('🎯 Test lead created:', testLead)

    // Try to assign the lead
    const result = await assignLeadToContractors(testLead as any)

    console.log('✅ Lead assignment test completed')

    return NextResponse.json({
      success: true,
      message: 'Lead assignment test completed',
      testLead,
      result
    })

  } catch (error: any) {
    console.error('❌ Lead assignment test failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
