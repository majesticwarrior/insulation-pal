// Email service placeholder - will be implemented when nodemailer is installed

export interface EmailData {
  to: string
  subject: string
  template: string
  data: Record<string, any>
}

const emailTemplates = {
  'new-lead': (data: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>New Lead Available</h2>
      <p>Hi ${data.contractorName},</p>
      <p>You have a new lead opportunity:</p>
      
      <div style="background: #f5f5f5; padding: 20px; margin: 20px 0;">
        <h3>Lead Details:</h3>
        <p><strong>Customer:</strong> ${data.customerName}</p>
        <p><strong>Location:</strong> ${data.city}, ${data.state}</p>
        <p><strong>Home Size:</strong> ${data.homeSize} sq ft</p>
        <p><strong>Areas Needed:</strong> ${data.areasNeeded}</p>
        <p><strong>Insulation Types:</strong> ${data.insulationTypes}</p>
      </div>
      
      <p>
        <a href="${data.dashboardLink}" 
           style="background: #F5DD22; color: #0a4768; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
          View Lead in Dashboard
        </a>
      </p>
      
      <p>Best regards,<br>InsulationPal Team</p>
    </div>
  `,
  
  'contractor-response': (data: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>Contractor Interested in Your Project</h2>
      <p>Hi ${data.customerName},</p>
      <p>Great news! A contractor is interested in your insulation project.</p>
      
      <div style="background: #f5f5f5; padding: 20px; margin: 20px 0;">
        <h3>Contractor Details:</h3>
        <p><strong>Business:</strong> ${data.contractorName}</p>
        <p><strong>Email:</strong> ${data.contractorEmail}</p>
        ${data.contractorPhone ? `<p><strong>Phone:</strong> ${data.contractorPhone}</p>` : ''}
      </div>
      
      <p>The contractor will be contacting you soon to discuss your project and provide a quote.</p>
      
      <p>Best regards,<br>InsulationPal Team</p>
    </div>
  `,

  'review-request': (data: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>How was your insulation project?</h2>
      <p>Hi ${data.customerName},</p>
      <p>We hope your insulation project with ${data.contractorName} went well!</p>
      
      <p>Your feedback helps other homeowners find great contractors. Would you mind leaving a review?</p>
      
      <p>
        <a href="${data.reviewLink}" 
           style="background: #F5DD22; color: #0a4768; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
          Leave a Review
        </a>
      </p>
      
      <p>Thank you for using InsulationPal!</p>
    </div>
  `
}

export async function sendEmail({ to, subject, template, data }: EmailData) {
  try {
    // Placeholder implementation - logs email instead of sending
    const htmlContent = emailTemplates[template as keyof typeof emailTemplates]?.(data) || 
                       '<p>Default email content</p>'

    console.log(`Would send email to ${to}:`)
    console.log(`Subject: ${subject}`)
    console.log(`Template: ${template}`)
    console.log(`Content: ${htmlContent}`)
    
    // TODO: Implement actual email sending with SendGrid or similar service
    
  } catch (error) {
    console.error('Email send error:', error)
    throw error
  }
}