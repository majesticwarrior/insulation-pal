'use server'

// SMS service placeholder - will be implemented when Twilio is installed

// import twilio from 'twilio'

// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// )

export interface SMSData {
  to: string
  message: string
  type: 'new-lead' | 'lead-response' | 'reminder'
}

const smsTemplates = {
  'new-lead': (data: any) => 
    `New lead available! ${data.customerName} in ${data.city}, ${data.state} needs insulation for ${data.homeSize} sq ft. Check your dashboard: ${data.dashboardLink}`,
  
  'lead-response': (data: any) => 
    `Good news! ${data.contractorName} is interested in your insulation project. They'll contact you soon at this number.`,
  
  'reminder': (data: any) => 
    `Reminder: You have pending leads in your InsulationPal dashboard. Don't miss out! ${data.dashboardLink}`
}

export async function sendSMS({ to, message, type }: SMSData) {
  try {
    // Placeholder implementation
    console.log(`Would send SMS to ${to}:`)
    console.log(`Type: ${type}`)
    console.log(`Message: ${message}`)
    
    // TODO: Implement actual SMS sending with Twilio
    // const result = await client.messages.create({
    //   body: message,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: to
    // })
    
    // console.log(`SMS sent with SID: ${result.sid}`)
    
  } catch (error) {
    console.error('SMS send error:', error)
    throw error
  }
}

export async function sendTemplatedSMS(to: string, template: keyof typeof smsTemplates, data: any) {
  const message = smsTemplates[template](data)
  await sendSMS({ to, message, type: template })
}