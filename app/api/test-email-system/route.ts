import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/email-service'

export async function GET() {
  try {
    console.log('🔍 Testing email notification system...')
    
    // Test basic email sending
    const testEmail = process.env.SMTP_USER || 'team@insulationpal.com'
    
    console.log('📧 Testing email service with test email:', testEmail)
    
    try {
      const emailResult = await sendEmail({
        to: testEmail,
        subject: 'Test Email - InsulationPal Notification System',
        template: 'new-lead',
        data: {
          contractorName: 'Test Contractor',
          city: 'Phoenix',
          state: 'AZ',
          propertyAddress: '123 Test St',
          homeSize: 1500,
          areasNeeded: 'attic',
          insulationTypes: 'blown_in',
          projectTimeline: 'ASAP',
          budgetRange: '$1000-$3000',
          dashboardLink: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'}/contractor-dashboard?from=email`
        }
      })
      
      console.log('✅ Test email sent successfully:', emailResult)
      
      return NextResponse.json({ 
        success: true,
        message: 'Email notification system is working',
        emailResult,
        environment: {
          siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
          smtpUser: process.env.SMTP_USER,
          smtpHost: process.env.SMTP_HOST
        }
      })
    } catch (emailError) {
      console.error('❌ Email test failed:', emailError)
      return NextResponse.json({ 
        success: false,
        error: 'Email notification system failed',
        details: emailError?.message,
        environment: {
          siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
          smtpUser: process.env.SMTP_USER,
          smtpHost: process.env.SMTP_HOST
        }
      }, { status: 500 })
    }
  } catch (error) {
    console.error('❌ Diagnostic test error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
