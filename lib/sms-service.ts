'use server'

import twilio from 'twilio'

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

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

/**
 * Format phone number to E.164 format for Twilio
 * Accepts formats like: (555) 123-4567, 555-123-4567, 5551234567, etc.
 */
const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '')
  
  // If phone starts with 1 and is 11 digits, it's already in the right format
  if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
    return `+${cleanPhone}`
  }
  
  // If phone is 10 digits, add +1 for US
  if (cleanPhone.length === 10) {
    return `+1${cleanPhone}`
  }
  
  // If phone already has country code (more than 11 digits), just add +
  if (cleanPhone.length > 11) {
    return `+${cleanPhone}`
  }
  
  // Otherwise, throw an error for invalid format
  throw new Error(`Invalid phone number format: ${phone}. Expected 10 or 11 digits.`)
}

export async function sendSMS({ to, message, type }: SMSData) {
  try {
    // Validate environment variables
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      throw new Error('Twilio credentials are not configured. Please check your environment variables.')
    }

    // Format the phone number
    const formattedPhone = formatPhoneNumber(to)
    
    console.log(`📱 Sending SMS to ${formattedPhone}`)
    console.log(`📱 Type: ${type}`)
    console.log(`📱 Message: ${message.substring(0, 50)}...`)
    
    // Send SMS via Twilio
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    })
    
    console.log(`✅ SMS sent successfully with SID: ${result.sid}`)
    console.log(`✅ Status: ${result.status}`)
    
    return { 
      success: true, 
      messageId: result.sid,
      status: result.status 
    }
    
  } catch (error: any) {
    console.error('❌ SMS send error:', error)
    console.error('❌ Error details:', {
      message: error?.message,
      code: error?.code,
      moreInfo: error?.moreInfo
    })
    
    // Re-throw with more context
    throw new Error(`Failed to send SMS: ${error?.message || 'Unknown error'}`)
  }
}

export async function sendTemplatedSMS(to: string, template: keyof typeof smsTemplates, data: any) {
  const message = smsTemplates[template](data)
  return await sendSMS({ to, message, type: template })
}