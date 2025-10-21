'use server'

// Direct server-side email sending using SendGrid
// This uses the server email service directly to avoid HTTP fetch issues
import { sendServerEmail } from './server-email-service'

export async function sendServerEmailDirect({ to, subject, template, data }: {
  to: string
  subject: string
  template: string
  data: Record<string, any>
}) {
  try {
    console.log('📧 Sending server email directly via SendGrid:', {
      to,
      subject,
      template
    })

    // Use the server email service directly (no HTTP calls needed)
    const result = await sendServerEmail({
      to,
      subject,
      template,
      data
    })
    
    console.log('✅ Server email sent successfully via SendGrid:', {
      messageId: result.messageId,
      statusCode: result.statusCode,
      to: to,
      subject: subject,
      template: template
    })
    
    return { success: true, messageId: result.messageId }
    
  } catch (error: any) {
    console.error('❌ Server email send error:', error)
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      response: error.response
    })
    throw error
  }
}
