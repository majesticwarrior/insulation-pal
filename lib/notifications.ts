// This would integrate with actual email/SMS services in production
// For now, this is a placeholder for the notification system

export interface NotificationData {
  to: string
  type: 'email' | 'sms'
  template: 'review_request' | 'lead_assignment' | 'welcome'
  data: Record<string, any>
}

export async function sendNotification({ to, type, template, data }: NotificationData) {
  // In production, this would integrate with services like:
  // - SendGrid for email
  // - Twilio for SMS
  // - AWS SES for email
  // - etc.

  console.log('Sending notification:', {
    to,
    type,
    template,
    data
  })

  // Mock implementation
  if (type === 'email') {
    return sendEmail({ to, template, data })
  } else if (type === 'sms') {
    return sendSMS({ to, template, data })
  }
}

async function sendEmail({ to, template, data }: { to: string, template: string, data: any }) {
  console.log(`Sending email to ${to} using template ${template}`)
  
  const templates = {
    review_request: {
      subject: `How was your experience with ${data.contractorName}?`,
      body: `
        Hi ${data.customerName},

        Thank you for choosing ${data.contractorName} for your insulation project!

        We hope you're satisfied with the work completed. Would you mind taking a moment to share your experience?

        Leave a review here: ${data.reviewLink}

        Your feedback helps other homeowners make informed decisions and helps us maintain our network of quality contractors.

        Best regards,
        The Insulation Pal Team
      `
    },
    lead_assignment: {
      subject: 'New Lead Assigned - Insulation Pal',
      body: `
        Hi ${data.contractorName},

        You have a new lead assigned!

        Customer: ${data.customerName}
        Location: ${data.city}
        Project: ${data.projectDetails}

        Log in to your dashboard to view details and respond: ${data.dashboardLink}

        Best regards,
        The Insulation Pal Team
      `
    },
    welcome: {
      subject: 'Welcome to Insulation Pal!',
      body: `
        Hi ${data.contractorName},

        Welcome to the Insulation Pal contractor network!

        Your application is being reviewed and you'll hear from us within 2-3 business days.

        In the meantime, you can log in to your dashboard: ${data.dashboardLink}

        Best regards,
        The Insulation Pal Team
      `
    }
  }

  const emailTemplate = templates[template as keyof typeof templates]
  
  // In production, this would use a real email service
  console.log('Email sent:', {
    to,
    subject: emailTemplate.subject,
    body: emailTemplate.body
  })

  return { success: true }
}

async function sendSMS({ to, template, data }: { to: string, template: string, data: any }) {
  console.log(`Sending SMS to ${to} using template ${template}`)
  
  const templates = {
    review_request: `Hi ${data.customerName}! How was your experience with ${data.contractorName}? Please leave a review: ${data.reviewLink}`,
    lead_assignment: `New lead assigned! Customer: ${data.customerName} in ${data.city}. Check your dashboard: ${data.dashboardLink}`,
    welcome: `Welcome to Insulation Pal, ${data.contractorName}! Your application is under review. Dashboard: ${data.dashboardLink}`
  }

  const message = templates[template as keyof typeof templates]
  
  // In production, this would use Twilio or similar
  console.log('SMS sent:', {
    to,
    message
  })

  return { success: true }
}

export async function sendReviewRequest({
  customerName,
  customerEmail,
  customerPhone,
  contractorName,
  contractorId,
  leadId,
  preference = 'email'
}: {
  customerName: string
  customerEmail?: string
  customerPhone?: string
  contractorName: string
  contractorId: string
  leadId: string
  preference?: 'email' | 'sms' | 'both'
}) {
  const reviewLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/review/${contractorId}?lead=${leadId}`
  
  const data = {
    customerName,
    contractorName,
    reviewLink
  }

  const notifications = []

  if ((preference === 'email' || preference === 'both') && customerEmail) {
    notifications.push(
      sendNotification({
        to: customerEmail,
        type: 'email',
        template: 'review_request',
        data
      })
    )
  }

  if ((preference === 'sms' || preference === 'both') && customerPhone) {
    notifications.push(
      sendNotification({
        to: customerPhone,
        type: 'sms',
        template: 'review_request',
        data
      })
    )
  }

  try {
    await Promise.all(notifications)
    console.log('Review request notifications sent successfully')
    return { success: true }
  } catch (error) {
    console.error('Error sending review request notifications:', error)
    return { success: false, error }
  }
}

export async function sendLeadNotification({
  contractorName,
  contractorEmail,
  contractorPhone,
  customerName,
  city,
  projectDetails,
  preference = 'email'
}: {
  contractorName: string
  contractorEmail?: string
  contractorPhone?: string
  customerName: string
  city: string
  projectDetails: string
  preference?: 'email' | 'sms' | 'both'
}) {
  const dashboardLink = `${process.env.NEXTAUTH_URL || 'https://insulationpal.com'}/contractor-dashboard`
  
  const data = {
    contractorName,
    customerName,
    city,
    projectDetails,
    dashboardLink
  }

  const notifications = []

  if ((preference === 'email' || preference === 'both') && contractorEmail) {
    notifications.push(
      sendNotification({
        to: contractorEmail,
        type: 'email',
        template: 'lead_assignment',
        data
      })
    )
  }

  if ((preference === 'sms' || preference === 'both') && contractorPhone) {
    notifications.push(
      sendNotification({
        to: contractorPhone,
        type: 'sms',
        template: 'lead_assignment',
        data
      })
    )
  }

  try {
    await Promise.all(notifications)
    console.log('Lead assignment notifications sent successfully')
    return { success: true }
  } catch (error) {
    console.error('Error sending lead assignment notifications:', error)
    return { success: false, error }
  }
}
