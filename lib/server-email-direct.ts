// Direct server-side email sending without nodemailer import issues
import { NextRequest } from 'next/server'

export async function sendServerEmailDirect({ to, subject, template, data }: {
  to: string
  subject: string
  template: string
  data: Record<string, any>
}) {
  try {
    console.log('📧 Sending server email directly:', {
      to,
      subject,
      template
    })

    // Use the existing API route but with full URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    const response = await fetch(`${baseUrl}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        template,
        data
      })
    })

    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send email')
    }
    
    console.log('✅ Server email sent successfully:', {
      messageId: result.messageId,
      to: to,
      subject: subject,
      template: template
    })
    
    return { success: true, messageId: result.messageId }
    
  } catch (error: any) {
    console.error('❌ Server email send error:', error)
    throw error
  }
}
