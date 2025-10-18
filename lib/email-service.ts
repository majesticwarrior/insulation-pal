// Email service using API route (client-safe)
export interface EmailData {
  to: string
  subject: string
  template: string
  data: Record<string, any>
}

export async function sendEmail({ to, subject, template, data }: EmailData) {
  try {
    const response = await fetch('/api/send-email', {
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
    
    console.log('✅ Email sent successfully:', {
      messageId: result.messageId,
      to: to,
      subject: subject,
      template: template
    })
    
    return { success: true, messageId: result.messageId }
    
  } catch (error: any) {
    console.error('❌ Email send error:', error)
    throw error
  }
}