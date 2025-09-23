import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export interface SMSData {
  to: string
  message: string
}

export async function sendSMS({ to, message }: SMSData) {
  try {
    // Only send SMS in production or if explicitly enabled
    if (process.env.NODE_ENV !== 'production' && !process.env.ENABLE_SMS) {
      console.log(`SMS would be sent to ${to}: ${message}`)
      return
    }

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    })

    console.log(`SMS sent to ${to}, SID: ${result.sid}`)
    return result
    
  } catch (error) {
    console.error('SMS send error:', error)
    throw error
  }
}

// Predefined SMS templates
export const smsTemplates = {
  newLead: (data: { customerName: string; city: string; state: string; dashboardUrl: string }) => 
    `New lead: ${data.customerName} in ${data.city}, ${data.state}. View details: ${data.dashboardUrl}`,
    
  leadAccepted: (data: { contractorName: string; contractorPhone?: string }) =>
    `${data.contractorName} is interested in your project!${data.contractorPhone ? ` Contact: ${data.contractorPhone}` : ''}`,
    
  reviewReminder: (data: { contractorName: string; reviewUrl: string }) =>
    `How was your project with ${data.contractorName}? Leave a review: ${data.reviewUrl}`
}
