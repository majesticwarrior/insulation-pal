'use server'

// Server-side email service using SendGrid
import sgMail from '@sendgrid/mail'

// Initialize SendGrid with API key
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
if (!SENDGRID_API_KEY) {
  console.error('SENDGRID_API_KEY is not configured')
}
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY)
}

export interface ServerEmailData {
  to: string
  subject: string
  template: string
  data: Record<string, any>
}

const emailTemplates = {
  'new-lead': (data: any) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    // Use absolute URL - will use localhost in dev, production domain when deployed
    const logoUrl = `${siteUrl}/insulation-pal-logo-footer.png`
    
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
        <img src="${logoUrl}" alt="InsulationPal" style="height: 120px; width: auto;">
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
  },

  'contractor-invitation': (data: any) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    const logoUrl = `${siteUrl}/insulation-pal-logo-footer.png`
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Project Invitation - InsulationPal</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0a4768; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .project-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .cta-button { 
          display: inline-block; 
          background: #0a4768; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 5px; 
          margin: 15px 0;
        }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="InsulationPal" style="height: 60px; width: auto;">
          <h1>🏠 InsulationPal</h1>
          <h2>New Project Invitation</h2>
        </div>
        
        <div class="content">
          <p>Hi <strong>${data.contractorName}</strong>,</p>
          
          <p>You've been invited to submit a quote for an insulation project by <strong>${data.customerName}</strong>.</p>
          
          <div class="project-details">
            <h3>📋 Project Details:</h3>
            <ul>
              <li><strong>Home Size:</strong> ${data.homeSize.toLocaleString()} sq ft</li>
              <li><strong>Location:</strong> ${data.city}, ${data.state}</li>
              <li><strong>Areas Needed:</strong> ${data.areas}</li>
              <li><strong>Insulation Types:</strong> ${data.insulationTypes}</li>
              ${data.timeline ? `<li><strong>Timeline:</strong> ${data.timeline}</li>` : ''}
              ${data.budget ? `<li><strong>Budget Range:</strong> ${data.budget}</li>` : ''}
            </ul>
          </div>
          
          <p>Click the button below to go to your dashboard and submit your quote:</p>
          
          <a href="${data.inviteUrl}" class="cta-button">Go to Dashboard</a>
          
          <p><strong>Important:</strong> This invitation expires in 30 days.</p>
          
          <p>You can also copy and paste this link into your browser:<br>
          <a href="${data.inviteUrl}">${data.inviteUrl}</a></p>
        </div>
        
        <div class="footer">
          <p>Best regards,<br>The InsulationPal Team</p>
          <p>This email was sent because you were invited to bid on a project.</p>
        </div>
      </div>
    </body>
    </html>
    `
  },

  'contractor-registration-confirmation': (data: any) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    const logoUrl = 'https://insulationpal.com/insulation-pal-logo-footer.png'
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Received - InsulationPal</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a4768; font-family: Arial, sans-serif;">
      
      <!-- Header -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <img src="${logoUrl}" alt="InsulationPal" style="height: 120px; width: auto;">
      </div>
      
      <!-- Main Content Card -->
      <div style="background-color: white; margin: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Success Header -->
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center;">
          <div style="color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px;">
            ✅ Registration Received!
          </div>
          <div style="color: white; font-size: 18px;">
            Thank you for joining InsulationPal
          </div>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px;">
          <h2 style="color: #0a4768; margin: 0 0 20px 0; font-size: 22px;">
            Hello ${data.name || 'Valued Contractor'},
          </h2>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Your contractor registration has been successfully submitted! We're excited to have you join the InsulationPal network.
          </p>
          
          <!-- What Happens Next -->
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #10b981;">
            <h3 style="color: #166534; margin: 0 0 15px 0; font-size: 18px;">
              📋 What Happens Next?
            </h3>
            <div style="color: #166534; font-size: 14px; line-height: 1.8;">
              <div style="margin-bottom: 10px;">
                <strong>1. Admin Notification Sent ✓</strong><br>
                <span style="font-size: 13px;">We've notified our admin team about your registration.</span>
              </div>
              <div style="margin-bottom: 10px;">
                <strong>2. Review Process</strong><br>
                <span style="font-size: 13px;">Our team will review your application and business information.</span>
              </div>
              <div>
                <strong>3. Approval Email</strong><br>
                <span style="font-size: 13px;">Once approved, you'll receive an email with your login credentials and access to your dashboard.</span>
              </div>
            </div>
          </div>
          
          <!-- Your Registration Details -->
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #0a4768; margin: 0 0 15px 0; font-size: 18px;">Your Registration Details</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
              <div>
                <strong style="color: #0a4768;">Business Name:</strong><br>
                <span style="color: #333;">${data.businessName || 'Not provided'}</span>
              </div>
              <div>
                <strong style="color: #0a4768;">Contact Email:</strong><br>
                <span style="color: #333;">${data.email || 'Not provided'}</span>
              </div>
              <div>
                <strong style="color: #0a4768;">License Number:</strong><br>
                <span style="color: #333;">${data.licenseNumber || 'Not provided'}</span>
              </div>
              <div>
                <strong style="color: #0a4768;">City:</strong><br>
                <span style="color: #333;">${data.city || 'Not provided'}</span>
              </div>
            </div>
          </div>
          
          <!-- Timeline Info -->
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #856404; margin-top: 0; font-size: 16px;">⏱️ Expected Review Time</h4>
            <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
              Our team typically reviews applications within 1-2 business days. You'll receive an email notification as soon as your application has been processed.
            </p>
          </div>
          
          <!-- Contact Information -->
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
              Questions about your registration?
            </p>
            <p style="color: #0a4768; font-size: 14px; margin: 0;">
              Contact us at <a href="mailto:info@majesticwarrior.com" style="color: #0a4768; text-decoration: none;">info@majesticwarrior.com</a>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <p style="color: white; font-size: 14px; margin: 0 0 10px 0;">Welcome to InsulationPal</p>
        <p style="color: white; font-size: 12px; margin: 0;">Serving those that serve others</p>
      </div>
      
    </body>
    </html>
    `
  },

  'contractor-approved': (data: any) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    const logoUrl = 'https://insulationpal.com/insulation-pal-logo-footer.png'
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Congratulations! You're Approved - InsulationPal</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a4768; font-family: Arial, sans-serif;">
      
      <!-- Header -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <img src="${logoUrl}" alt="InsulationPal" style="height: 120px; width: auto;">
      </div>
      
      <!-- Main Content Card -->
      <div style="background-color: white; margin: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Congratulations Header -->
        <div style="background: linear-gradient(135deg, #28a745, #20c997); padding: 30px; text-align: center;">
          <div style="color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px;">
            🎉 Congratulations!
          </div>
          <div style="color: white; font-size: 18px;">
            Your application has been approved
          </div>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px;">
          <h2 style="color: #0a4768; margin: 0 0 20px 0; font-size: 22px;">
            Hello ${data.name || 'Valued Contractor'},
          </h2>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Great news! Your contractor application has been reviewed and approved. You're now ready to start receiving qualified insulation leads from homeowners in your area.
          </p>
          
          <!-- Login Information -->
          <div style="background-color: #eff6ff; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">
              🔑 Your Login Credentials
            </h3>
            <div style="color: #1e40af; font-size: 14px; line-height: 1.8;">
              <div style="margin-bottom: 12px;">
                <strong>Email:</strong> ${data.email}<br>
                <strong>Password:</strong> ${data.password}
              </div>
              <p style="margin: 15px 0 0 0; font-size: 13px;">
                ⚠️ <strong>Important:</strong> Please change your password after your first login for security.
              </p>
            </div>
          </div>
          
          <!-- Getting Started -->
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #10b981;">
            <h3 style="color: #166534; margin: 0 0 15px 0; font-size: 18px;">
              🚀 Getting Started
            </h3>
            <ul style="color: #166534; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
              <li style="margin-bottom: 8px;">Complete your contractor profile with business details</li>
              <li style="margin-bottom: 8px;">Upload your portfolio images to showcase your work</li>
              <li style="margin-bottom: 8px;">Set up your service areas to target local leads</li>
              <li style="margin-bottom: 8px;">Purchase lead credits to start receiving projects</li>
              <li>Start bidding on insulation projects!</li>
            </ul>
          </div>
          
          <!-- Action Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.loginUrl}" 
               style="background-color: #0a4768; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
              LOG IN TO YOUR DASHBOARD
            </a>
          </div>
          
          <!-- Next Steps -->
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #856404; margin-top: 0; font-size: 16px;">💡 Tips for Success</h4>
            <ul style="color: #856404; margin: 10px 0 0 0; padding-left: 20px; font-size: 14px;">
              <li style="margin-bottom: 6px;">Respond to leads quickly - speed matters!</li>
              <li style="margin-bottom: 6px;">Write detailed, personalized quotes</li>
              <li style="margin-bottom: 6px;">Upload high-quality portfolio images</li>
              <li>Keep your availability updated</li>
            </ul>
          </div>
          
          <!-- Contact Information -->
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
              Need help getting started?
            </p>
            <p style="color: #0a4768; font-size: 14px; margin: 0;">
              Contact us at <a href="mailto:info@majesticwarrior.com" style="color: #0a4768; text-decoration: none;">info@majesticwarrior.com</a>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <p style="color: white; font-size: 14px; margin: 0 0 10px 0;">Welcome to the InsulationPal network!</p>
        <p style="color: white; font-size: 12px; margin: 0;">Serving those that serve others</p>
      </div>
      
    </body>
    </html>
    `
  },

  'new-contractor-registration': (data: any) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    const logoUrl = 'https://insulationpal.com/insulation-pal-logo-footer.png'
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contractor Registration - InsulationPal</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a4768; font-family: Arial, sans-serif;">
      
      <!-- Header -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <img src="${logoUrl}" alt="InsulationPal" style="height: 120px; width: auto;">
        <div style="color: white; font-size: 14px; margin-top: 10px; text-align: right;">
          ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
      
      <!-- Main Content Card -->
      <div style="background-color: white; margin: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Alert Header -->
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center;">
          <div style="color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px;">
            🆕 New Contractor Registration
          </div>
          <div style="color: white; font-size: 18px;">
            A new contractor has signed up on InsulationPal
          </div>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px;">
          <h2 style="color: #0a4768; margin: 0 0 20px 0; font-size: 22px;">
            Hi Admin,
          </h2>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            A new contractor has registered and is awaiting your approval. Please review their information below:
          </p>
          
          <!-- Contractor Details -->
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #0a4768; margin: 0 0 15px 0; font-size: 18px;">Contractor Information</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
              <div>
                <strong style="color: #0a4768;">Business Name:</strong><br>
                <span style="color: #333;">${data.businessName || 'Not provided'}</span>
              </div>
              <div>
                <strong style="color: #0a4768;">Contact Name:</strong><br>
                <span style="color: #333;">${data.name || 'Not provided'}</span>
              </div>
              <div>
                <strong style="color: #0a4768;">Email:</strong><br>
                <a href="mailto:${data.email}" style="color: #0a4768; text-decoration: none;">${data.email || 'Not provided'}</a>
              </div>
              <div>
                <strong style="color: #0a4768;">Phone:</strong><br>
                <a href="tel:${data.phone}" style="color: #0a4768; text-decoration: none;">${data.phone || 'Not provided'}</a>
              </div>
              <div>
                <strong style="color: #0a4768;">License Number:</strong><br>
                <span style="color: #333;">${data.licenseNumber || 'Not provided'}</span>
              </div>
              <div>
                <strong style="color: #0a4768;">City:</strong><br>
                <span style="color: #333;">${data.city || 'Not provided'}</span>
              </div>
            </div>
          </div>
          
          <!-- Status Alert -->
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #856404; margin-top: 0; font-size: 16px;">⏳ Action Required</h4>
            <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
              This contractor is currently in <strong>"pending"</strong> status and needs your review. 
              Please log in to the admin dashboard to approve or reject their application.
            </p>
          </div>
          
          <!-- Call to Action -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.adminDashboardLink || '#'}" 
               style="background-color: #0a4768; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
              REVIEW CONTRACTOR
            </a>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <p style="color: white; font-size: 14px; margin: 0 0 10px 0;">InsulationPal Admin Notification</p>
        <p style="color: white; font-size: 12px; margin: 0;">Serving those that serve others</p>
      </div>
      
    </body>
    </html>
    `
  },

  'contractor-email-verification': (data: any) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    const logoUrl = `${siteUrl}/insulation-pal-logo-footer.png`
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - InsulationPal</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a4768; font-family: Arial, sans-serif;">
      
      <!-- Header -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <img src="${logoUrl}" alt="InsulationPal" style="height: 120px; width: auto;">
      </div>
      
      <!-- Main Content Card -->
      <div style="background-color: white; margin: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Verification Header -->
        <div style="background: linear-gradient(135deg, #0a4768, #0d5a7f); padding: 30px; text-align: center;">
          <div style="color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px;">
            ✉️ Verify Your Email Address
          </div>
          <div style="color: white; font-size: 18px;">
            Complete your InsulationPal registration
          </div>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px;">
          <h2 style="color: #0a4768; margin: 0 0 20px 0; font-size: 22px;">
            Hello ${data.name || 'Valued Contractor'},
          </h2>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for registering with InsulationPal! To complete your registration and start receiving qualified leads, please verify your email address by clicking the button below.
          </p>
          
          <!-- Verification Info -->
          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #0a4768;">
            <h3 style="color: #0a4768; margin: 0 0 15px 0; font-size: 18px;">
              📧 Why Verify Your Email?
            </h3>
            <div style="color: #1e40af; font-size: 14px; line-height: 1.8;">
              <div style="margin-bottom: 10px;">
                <strong>✓ Secure Your Account</strong><br>
                <span style="font-size: 13px;">Email verification helps protect your account and ensures you receive important notifications.</span>
              </div>
              <div style="margin-bottom: 10px;">
                <strong>✓ Start Receiving Leads</strong><br>
                <span style="font-size: 13px;">Once verified, your application will be reviewed and you'll be able to receive qualified leads.</span>
              </div>
              <div>
                <strong>✓ Access Your Dashboard</strong><br>
                <span style="font-size: 13px;">Verified accounts get full access to the contractor dashboard and all features.</span>
              </div>
            </div>
          </div>
          
          <!-- Call to Action -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verificationLink || '#'}" 
               style="background-color: #F5DD22; color: #0a4768; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              VERIFY EMAIL ADDRESS
            </a>
          </div>
          
          <!-- Alternative Link -->
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
              Button not working? Copy and paste this link into your browser:
            </p>
            <p style="color: #0a4768; font-size: 12px; word-break: break-all; margin: 0;">
              ${data.verificationLink || '#'}
            </p>
          </div>
          
          <!-- Expiration Notice -->
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 25px; border-left: 4px solid #f59e0b;">
            <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
              ⏰ <strong>Important:</strong> This verification link will expire in 24 hours. If you didn't register for InsulationPal, please ignore this email.
            </p>
          </div>
          
          <!-- Contact Information -->
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
              Need help or have questions?
            </p>
            <p style="color: #0a4768; font-size: 14px; margin: 0;">
              Contact us at <a href="mailto:info@majesticwarrior.com" style="color: #0a4768; text-decoration: none;">info@majesticwarrior.com</a>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <p style="color: white; font-size: 14px; margin: 0 0 10px 0;">InsulationPal - Professional Insulation Services</p>
        <p style="color: white; font-size: 12px; margin: 0;">Serving those that serve others</p>
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
