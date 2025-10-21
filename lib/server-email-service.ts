'use server'

// Server-side email service using SendGrid
import sgMail from '@sendgrid/mail'

// Initialize SendGrid with API key
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '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'
sgMail.setApiKey(SENDGRID_API_KEY)

export interface ServerEmailData {
  to: string
  subject: string
  template: string
  data: Record<string, any>
}

const emailTemplates = {
  'new-lead': (data: any) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    const logoUrl = `${siteUrl}/insulation-pal-logo.png`
    
    // Get property images (simplified for server-side)
    const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=400x300&location=${encodeURIComponent(data.propertyAddress || data.city + ', ' + data.state)}&key=${process.env.GOOGLE_MAPS_API_KEY || ''}`
    const satelliteUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(data.city + ', ' + data.state)}&zoom=15&size=400x300&maptype=satellite&key=${process.env.GOOGLE_MAPS_API_KEY || ''}`
    
    // Extract street name (remove house number)
    const streetName = data.propertyAddress ? 
      data.propertyAddress.replace(/^\d+\s+/, '').trim() : 
      ''
    const displayAddress = streetName ? 
      `${streetName}, ${data.city}, ${data.state}` : 
      `${data.city}, ${data.state}`
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Lead Available - InsulationPal</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a4768; font-family: Arial, sans-serif;">
      
      <!-- Header -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <img src="${logoUrl}" alt="InsulationPal" style="height: 40px; width: auto;">
        <div style="color: white; font-size: 14px; margin-top: 10px; text-align: right;">
          ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
      
      <!-- Main Content Card -->
      <div style="background-color: white; margin: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Headline -->
        <div style="padding: 30px 30px 20px 30px; text-align: center;">
          <h1 style="color: #0a4768; font-size: 28px; margin: 0; font-weight: bold;">
            ${data.contractorName}... There's a new insulation project up for grabs in ${data.city}.
          </h1>
        </div>
        
        <!-- Lead Details -->
        <div style="padding: 0 30px 20px 30px;">
          <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <div style="background-color: #0a4768; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold;">
              📍
            </div>
            <h3 style="color: #0a4768; margin: 0; font-size: 18px;">Here are the details:</h3>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">📍 ${displayAddress}</li>
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">🏠 ${data.homeSize?.toLocaleString()} sq ft home</li>
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">📅 Project timeline: ${data.projectTimeline || 'ASAP'}</li>
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">💰 Budget: ${data.budgetRange || 'Not specified'}</li>
            </ul>
          </div>
        </div>
        
        <!-- Property Images -->
        <div style="padding: 0 30px 20px 30px;">
          <!-- Street View -->
          <div style="margin-bottom: 20px;">
            <img src="${streetViewUrl}" alt="Property Street View" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px;">
            <div style="text-align: center; margin-top: 5px; font-size: 12px; color: #666;">
              Google Street View
            </div>
          </div>
          
          <!-- Satellite View -->
          <div>
            <img src="${satelliteUrl}" alt="Property Satellite View" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
            <div style="text-align: center; margin-top: 5px; font-size: 12px; color: #666;">
              Google Satellite View
            </div>
          </div>
        </div>
        
        <!-- Service Expectations -->
        <div style="padding: 0 30px 20px 30px;">
          <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <div style="background-color: #0a4768; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold;">
              ✅
            </div>
            <h3 style="color: #0a4768; margin: 0; font-size: 18px;">Here's what they are expecting you to include in your quote:</h3>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${data.areasNeeded ? data.areasNeeded.split(', ').map((area: string) => 
                `<li style="margin-bottom: 8px; color: #333; font-size: 16px;">✅ ${area.charAt(0).toUpperCase() + area.slice(1)} Insulation</li>`
              ).join('') : ''}
              ${data.insulationTypes ? data.insulationTypes.split(', ').map((type: string) => 
                `<li style="margin-bottom: 8px; color: #333; font-size: 16px;">✅ ${type} Installation</li>`
              ).join('') : ''}
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">✅ Professional installation</li>
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">✅ Clean-up and disposal</li>
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">✅ Warranty included</li>
            </ul>
          </div>
        </div>
        
        <!-- Pro Tip -->
        <div style="padding: 0 30px 20px 30px;">
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; border-left: 4px solid #f39c12;">
            <h4 style="color: #856404; margin-top: 0; font-size: 16px;">💡 Pro Tip:</h4>
            <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
              <strong>Speed Kills!</strong> Send your bid as fast as you can to win this customer. 
              Make sure to add a nice note along with your bid explaining your experience and why you're the best choice for this project.
            </p>
          </div>
        </div>
        
        <!-- Call to Action -->
        <div style="padding: 0 30px 30px 30px; text-align: center;">
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Good luck!</p>
          <p style="color: #666; font-size: 14px; margin-bottom: 20px;">The InsulationPal Team</p>
          
          <a href="${data.dashboardLink}" 
             style="background-color: #F5DD22; color: #0a4768; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; margin-bottom: 20px;">
            SUBMIT MY QUOTE
          </a>
          
          <p style="color: #666; font-size: 12px; margin: 0;">
            So what are you waiting for... Win this project and add it to your portfolio
          </p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <p style="color: white; font-size: 14px; margin: 0 0 10px 0;">The remote control for your insulation business</p>
        <p style="color: white; font-size: 12px; margin: 0;">Serving those that serve others</p>
        <p style="color: white; font-size: 12px; margin: 10px 0 0 0;">
          <a href="${siteUrl}/unsubscribe" style="color: #F5DD22; text-decoration: none;">unsubscribe from this list</a>
        </p>
      </div>
      
    </body>
    </html>
    `
  }
}

export async function sendServerEmail({ to, subject, template, data }: ServerEmailData) {
  try {
    console.log('📧 Sending server email via SendGrid:', { to, subject, template })
    
    // Get HTML content from template
    const htmlContent = emailTemplates[template as keyof typeof emailTemplates]?.(data) || 
                       '<p>Default email content</p>'

    // SendGrid email configuration
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'team@quote.insulationpal.com'
    const fromName = process.env.SENDGRID_FROM_NAME || 'Insulation Pal'
    
    const msg = {
      to: to,
      from: {
        email: fromEmail,
        name: fromName
      },
      replyTo: process.env.SENDGRID_REPLY_TO || fromEmail,
      subject: subject,
      html: htmlContent
    }

    // Send email via SendGrid
    const response = await sgMail.send(msg)
    
    console.log('✅ Server email sent successfully via SendGrid:', {
      statusCode: response[0].statusCode,
      to: to,
      subject: subject,
      template: template
    })
    
    return { 
      success: true, 
      messageId: response[0].headers['x-message-id'] || 'sent',
      statusCode: response[0].statusCode
    }
    
  } catch (error: any) {
    console.error('❌ SendGrid email send error:', error)
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.body || error.response,
      stack: error.stack
    })
    throw error
  }
}
