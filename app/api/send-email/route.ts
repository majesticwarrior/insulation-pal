// API route for sending emails (server-side only)
import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import { getPropertyImages, getPlaceholderImage, extractStreetName } from '@/lib/google-maps'

// Initialize SendGrid with API key
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
if (!SENDGRID_API_KEY) {
  console.error('SENDGRID_API_KEY is not configured')
}
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY)
}

const emailTemplates = {
  'new-lead': (data: any) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    // Use absolute URL - will use localhost in dev, production domain when deployed
    const logoUrl = `${siteUrl}/insulation-pal-logo-footer.png`
    
    // Get property images
    const propertyImages = getPropertyImages(data.propertyAddress || '', data.city, data.state)
    const streetViewUrl = propertyImages.streetViewUrl || getPlaceholderImage('street')
    const satelliteUrl = propertyImages.satelliteUrl || getPlaceholderImage('satellite')
    
    // Extract street name (remove house number)
    const streetName = extractStreetName(data.propertyAddress || '')
    const displayAddress = streetName ? `${streetName}, ${data.city}, ${data.state}` : `${data.city}, ${data.state}`
    
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
              ${propertyImages.streetViewUrl ? 'Google Street View' : 'Property Image'}
            </div>
          </div>
          
          <!-- Satellite View -->
          <div>
            <img src="${satelliteUrl}" alt="Property Satellite View" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
            <div style="text-align: center; margin-top: 5px; font-size: 12px; color: #666;">
              ${propertyImages.satelliteUrl ? 'Google Satellite View' : 'Property Map'}
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
  
  'contractor-quote': (data: any) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    // Use absolute URL for email compatibility
    const logoUrl = 'https://insulationpal.com/insulation-pal-logo-footer.png'
    
    // Extract street name (remove house number)
    const streetName = data.projectDetails?.propertyAddress ? 
      data.projectDetails.propertyAddress.replace(/^\d+\s+/, '').trim() : 
      ''
    const displayAddress = streetName ? 
      `${streetName}, ${data.projectDetails?.city || 'Unknown'}, ${data.projectDetails?.state || 'Unknown'}` : 
      `${data.projectDetails?.city || 'Unknown'}, ${data.projectDetails?.state || 'Unknown'}`
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Quote Received - InsulationPal</title>
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
        
        <!-- Personalized Greeting -->
        <div style="padding: 30px 30px 20px 30px; text-align: center;">
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; background-color: #0a4768; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 20px;">
              <span style="color: white; font-size: 24px; font-weight: bold;">🏠</span>
            </div>
            <div style="text-align: left;">
              <h1 style="color: #0a4768; font-size: 28px; margin: 0; font-weight: bold;">
                Hi ${data.customerName || 'Valued Customer'}
              </h1>
              <p style="color: #666; font-size: 16px; margin: 5px 0 0 0;">
                Here is another option for your insulation project
              </p>
            </div>
          </div>
        </div>
        
        <!-- Quote Details Section -->
        <div style="padding: 0 30px 20px 30px;">
          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #0a4768; margin-top: 0; font-size: 20px; margin-bottom: 20px;">Latest Quote</h3>
            
            <!-- Contractor Profile -->
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
              <div style="width: 50px; height: 50px; background-color: #0a4768; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                <span style="color: white; font-size: 18px; font-weight: bold;">👷</span>
              </div>
              <div>
                <h4 style="color: #0a4768; margin: 0; font-size: 18px;">${data.contractorName || 'Contractor'}</h4>
                <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Licensed & Insured Contractor</p>
              </div>
            </div>
            
            <!-- Quote Amount -->
            <div style="background-color: white; padding: 20px; border-radius: 8px; border-left: 4px solid #F5DD22; margin-bottom: 15px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <h4 style="color: #0a4768; margin: 0; font-size: 18px;">Quote Amount</h4>
                  <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Total project cost</p>
                </div>
                <div style="text-align: right;">
                  <span style="color: #0a4768; font-size: 28px; font-weight: bold;">$${(data.quoteAmount || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            ${data.quoteNotes ? `
            <div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px;">
              <h5 style="color: #0a4768; margin-top: 0; font-size: 16px;">Contractor Notes</h5>
              <p style="color: #333; margin: 0; font-size: 14px; line-height: 1.5;">${data.quoteNotes}</p>
            </div>
            ` : ''}
          </div>
        </div>
        
        <!-- Project Details Section -->
        <div style="padding: 0 30px 20px 30px;">
          <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <div style="background-color: #0a4768; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold;">
              📋
            </div>
            <h3 style="color: #0a4768; margin: 0; font-size: 18px;">Confirming Your Details</h3>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <div style="margin-bottom: 15px;">
              <p style="color: #666; margin: 0; font-size: 14px;"><strong>Project Location:</strong></p>
              <p style="color: #333; margin: 5px 0 0 0; font-size: 16px;">${displayAddress}</p>
            </div>
            
            <div style="margin-bottom: 15px;">
              <p style="color: #666; margin: 0; font-size: 14px;"><strong>Home Size:</strong></p>
              <p style="color: #333; margin: 5px 0 0 0; font-size: 16px;">${(data.projectDetails?.homeSize || 0).toLocaleString()} sq ft</p>
            </div>
            
            <div style="margin-bottom: 15px;">
              <p style="color: #666; margin: 0; font-size: 14px;"><strong>Areas Needed:</strong></p>
              <p style="color: #333; margin: 5px 0 0 0; font-size: 16px;">${data.projectDetails?.areasNeeded || 'Not specified'}</p>
            </div>
            
            <div>
              <p style="color: #666; margin: 0; font-size: 14px;"><strong>Insulation Types:</strong></p>
              <p style="color: #333; margin: 5px 0 0 0; font-size: 16px;">${data.projectDetails?.insulationTypes || 'Not specified'}</p>
            </div>
          </div>
        </div>
        
        <!-- Call to Action -->
        <div style="padding: 0 30px 30px 30px; text-align: center;">
          <div style="background-color: #F5DD22; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: #0a4768; margin-top: 0; font-size: 18px;">Ready to Compare Quotes?</h4>
            <p style="color: #0a4768; margin: 10px 0 20px 0; font-size: 14px;">
              View all your quotes and choose the best contractor for your project
            </p>
            
            <a href="${data.quoteReviewLink || '#'}" 
               style="background-color: #0a4768; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              VIEW ALL QUOTES & COMPARE
            </a>
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #f39c12;">
            <h5 style="color: #856404; margin-top: 0; font-size: 16px;">💡 What's Next?</h5>
            <ul style="color: #856404; margin: 10px 0; padding-left: 20px; font-size: 14px;">
              <li>Compare prices and services from multiple contractors</li>
              <li>Read contractor reviews and credentials</li>
              <li>Accept the quote that works best for you</li>
              <li>Contact contractors directly with questions</li>
            </ul>
          </div>
        </div>
        
        <!-- Closing -->
        <div style="padding: 0 30px 30px 30px; text-align: center;">
          <p style="color: #333; font-size: 16px; margin-bottom: 10px;">It is our pleasure to help simplify your life by matching you with the best fit insulation contractor in ${data.projectDetails?.city || 'your area'}.</p>
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Cheers!</p>
          <p style="color: #666; font-size: 14px; margin-bottom: 10px;">The InsulationPal Team</p>
          <p style="color: #666; font-size: 14px; margin-bottom: 10px;">Team@insulationpal.com</p>
          <p style="color: #999; font-size: 12px; font-style: italic; margin: 0;">Life's short. Let a pro insulate your home.</p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <p style="color: white; font-size: 14px; margin: 0 0 10px 0;">The remote control for your insulation project</p>
        <p style="color: white; font-size: 12px; margin: 0;">Serving those that serve others</p>
        <p style="color: white; font-size: 12px; margin: 10px 0 0 0;">
          <a href="${siteUrl}/unsubscribe" style="color: #F5DD22; text-decoration: none;">unsubscribe from this list</a>
        </p>
      </div>
      
    </body>
    </html>
    `
  },

  'quote-accepted': (data: any) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    // Use absolute URL for email compatibility
    const logoUrl = 'https://insulationpal.com/insulation-pal-logo-footer.png'
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Congratulations! You Won the Bid - InsulationPal</title>
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
        
        <!-- Congratulations Header -->
        <div style="background: linear-gradient(135deg, #28a745, #20c997); padding: 30px; text-align: center;">
          <div style="color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px;">
            🎉 Congratulations!
          </div>
          <div style="color: white; font-size: 18px;">
            You won the bid for ${data.customerName || 'the customer'}'s project!
          </div>
        </div>
        
        <!-- Customer Contact Information -->
        <div style="padding: 30px;">
          <h2 style="color: #0a4768; margin: 0 0 20px 0; font-size: 22px;">Customer Contact Information</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <div style="margin-bottom: 15px;">
              <strong style="color: #0a4768;">Name:</strong> ${data.customerName || 'Not provided'}
            </div>
            <div style="margin-bottom: 15px;">
              <strong style="color: #0a4768;">Email:</strong> 
              <a href="mailto:${data.customerEmail || ''}" style="color: #0a4768; text-decoration: none;">
                ${data.customerEmail || 'Not provided'}
              </a>
            </div>
            <div style="margin-bottom: 15px;">
              <strong style="color: #0a4768;">Phone:</strong> 
              <a href="tel:${data.customerPhone || ''}" style="color: #0a4768; text-decoration: none;">
                ${data.customerPhone || 'Not provided'}
              </a>
            </div>
          </div>
          
          <!-- Project Details -->
          <h3 style="color: #0a4768; margin: 0 0 15px 0; font-size: 18px;">Project Details</h3>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <div style="margin-bottom: 10px;">
              <strong style="color: #0a4768;">Location:</strong> ${data.projectDetails?.city || 'Unknown'}, ${data.projectDetails?.state || 'Unknown'}
            </div>
            <div style="margin-bottom: 10px;">
              <strong style="color: #0a4768;">Home Size:</strong> ${(data.projectDetails?.homeSize || 0).toLocaleString()} sq ft
            </div>
            <div style="margin-bottom: 10px;">
              <strong style="color: #0a4768;">Areas Needed:</strong> ${data.projectDetails?.areasNeeded || 'Not specified'}
            </div>
            <div style="margin-bottom: 10px;">
              <strong style="color: #0a4768;">Insulation Types:</strong> ${data.projectDetails?.insulationTypes || 'Not specified'}
            </div>
            <div style="margin-bottom: 10px;">
              <strong style="color: #0a4768;">Property Address:</strong> ${data.projectDetails?.propertyAddress || 'Not provided'}
            </div>
          </div>
          
          <!-- Your Quote -->
          <h3 style="color: #0a4768; margin: 0 0 15px 0; font-size: 18px;">Your Winning Quote</h3>
          <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
            <div style="font-size: 24px; font-weight: bold; color: #28a745; margin-bottom: 10px;">
              $${(data.quoteAmount || 0).toLocaleString()}
            </div>
            <div style="color: #155724;">
              ${data.quoteNotes || 'No additional notes provided'}
            </div>
          </div>
          
          <!-- Next Steps -->
          <h3 style="color: #0a4768; margin: 0 0 15px 0; font-size: 18px;">Next Steps</h3>
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
            <div style="color: #856404;">
              <strong>1. Contact the customer immediately</strong> - They're expecting to hear from you soon<br>
              <strong>2. Schedule a site visit</strong> - Confirm project details and timeline<br>
              <strong>3. Begin work</strong> - Deliver excellent service to earn a great review
            </div>
          </div>
          
          <!-- Call to Action -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.dashboardLink || '#'}" 
               style="background-color: #0a4768; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              VIEW PROJECT IN DASHBOARD
            </a>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <p style="color: white; font-size: 12px; margin: 0;">Serving those that serve others</p>
        <p style="color: white; font-size: 12px; margin: 10px 0 0 0;">
          <a href="${siteUrl}/unsubscribe" style="color: #F5DD22; text-decoration: none;">unsubscribe from this list</a>
        </p>
      </div>
      
    </body>
    </html>
    `
  },
  
  'project-completion-review': (data: any) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    // Use absolute URL for email compatibility  
    const logoUrl = 'https://insulationpal.com/insulation-pal-logo-footer.png'
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>How was your insulation project? - InsulationPal</title>
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
        
        <!-- Project Completion Header -->
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center;">
          <div style="color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px;">
            🏠 Project Complete!
          </div>
          <div style="color: white; font-size: 18px;">
            How was your insulation project in ${data.projectDetails?.city || 'your area'}?
          </div>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px;">
          <h2 style="color: #0a4768; margin: 0 0 20px 0; font-size: 22px;">
            Hi ${data.customerName || 'Valued Customer'},
          </h2>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            We hope you're enjoying the improved comfort and energy efficiency in your home! 
            Your insulation project has been completed, and now we'd love to hear about your experience.
          </p>
          
          <!-- Project Details -->
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #0a4768; margin: 0 0 15px 0; font-size: 18px;">Your Project Details</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
              <div>
                <strong style="color: #0a4768;">Home Size:</strong> ${(data.projectDetails?.homeSize || 0).toLocaleString()} sq ft
              </div>
              <div>
                <strong style="color: #0a4768;">Location:</strong> ${data.projectDetails?.city || 'Unknown'}, ${data.projectDetails?.state || 'Unknown'}
              </div>
              <div>
                <strong style="color: #0a4768;">Areas Insulated:</strong> ${data.projectDetails?.areasNeeded?.join(', ') || 'Not specified'}
              </div>
              <div>
                <strong style="color: #0a4768;">Insulation Types:</strong> ${data.projectDetails?.insulationTypes?.join(', ') || 'Not specified'}
              </div>
            </div>
          </div>
          
          <!-- Review Request -->
          <div style="background-color: #eff6ff; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">
              ⭐ Share Your Experience
            </h3>
            <p style="color: #1e40af; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Your feedback helps other homeowners make informed decisions and helps us maintain our high standards. 
              Please take a moment to review your contractor's work.
            </p>
            
            <!-- Review Button -->
            <div style="text-align: center; margin: 25px 0;">
              <a href="${data.reviewLink || '#'}" 
                 style="background-color: #0a4768; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
                LEAVE YOUR REVIEW
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 0;">
              Takes less than 2 minutes • Helps other homeowners
            </p>
          </div>
          
          <!-- What to Review -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #0a4768; margin: 0 0 15px 0; font-size: 18px;">What We'd Like to Know:</h3>
            <ul style="color: #374151; font-size: 16px; line-height: 1.6; padding-left: 20px;">
              <li style="margin-bottom: 8px;">How was the communication throughout the project?</li>
              <li style="margin-bottom: 8px;">Was the work completed on time and as promised?</li>
              <li style="margin-bottom: 8px;">How would you rate the quality of the installation?</li>
              <li style="margin-bottom: 8px;">Would you recommend this contractor to others?</li>
              <li style="margin-bottom: 8px;">Any additional comments about your experience?</li>
            </ul>
          </div>
          
          <!-- Benefits of Reviewing -->
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #166534; margin: 0 0 15px 0; font-size: 16px;">Why Your Review Matters:</h3>
            <div style="color: #166534; font-size: 14px; line-height: 1.5;">
              <div style="margin-bottom: 8px;">✓ Helps other homeowners choose the right contractor</div>
              <div style="margin-bottom: 8px;">✓ Encourages contractors to maintain high standards</div>
              <div style="margin-bottom: 8px;">✓ Builds trust in the InsulationPal community</div>
              <div>✓ Your feedback helps us improve our service</div>
            </div>
          </div>
          
          <!-- Contact Information -->
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
              Questions about your project or need assistance?
            </p>
            <p style="color: #0a4768; font-size: 14px; margin: 0;">
              Contact us at <a href="mailto:team@insulationpal.com" style="color: #0a4768; text-decoration: none;">team@insulationpal.com</a>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <p style="color: white; font-size: 12px; margin: 0;">Serving those that serve others</p>
        <p style="color: white; font-size: 12px; margin: 10px 0 0 0;">
          <a href="${siteUrl}/unsubscribe" style="color: #F5DD22; text-decoration: none;">unsubscribe from this list</a>
        </p>
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

  'contractor-reminder-2h': (data: any) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    const logoUrl = `${siteUrl}/insulation-pal-logo-footer.png`
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reminder: Submit Your Quote - InsulationPal</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a4768; font-family: Arial, sans-serif;">
      
      <!-- Header -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <img src="${logoUrl}" alt="InsulationPal" style="height: 120px; width: auto;">
      </div>
      
      <!-- Main Content Card -->
      <div style="background-color: white; margin: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Reminder Header -->
        <div style="background-color: #fff3cd; padding: 30px; text-align: center; border-bottom: 3px solid #f59e0b;">
          <h1 style="color: #856404; font-size: 28px; margin: 0; font-weight: bold;">
            ⏰ Friendly Reminder: Submit Your Quote
          </h1>
          <p style="color: #856404; font-size: 16px; margin: 10px 0 0 0;">
            It's been 2 hours since you received this lead
          </p>
        </div>
        
        <!-- Lead Details -->
        <div style="padding: 30px;">
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
            Hi <strong>${data.contractorName}</strong>,
          </p>
          
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
            We noticed you haven't submitted a quote yet for the project in <strong>${data.city}, ${data.state}</strong>. 
            Don't miss out on this opportunity!
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #0a4768; margin: 0 0 15px 0; font-size: 18px;">📋 Project Details:</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">📍 ${data.propertyAddress || `${data.city}, ${data.state}`}</li>
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">🏠 ${data.homeSize?.toLocaleString()} sq ft home</li>
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">📅 Timeline: ${data.projectTimeline || 'ASAP'}</li>
              ${data.budgetRange ? `<li style="margin-bottom: 8px; color: #333; font-size: 16px;">💰 Budget: ${data.budgetRange}</li>` : ''}
            </ul>
          </div>
          
          <!-- Urgency Message -->
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #856404; margin-top: 0; font-size: 16px;">💡 Quick Tip:</h4>
            <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
              <strong>Speed matters!</strong> Contractors who submit quotes quickly have a higher chance of winning the project. 
              Take a few minutes now to submit your competitive quote.
            </p>
          </div>
          
          <!-- Call to Action -->
          <div style="text-align: center; margin-top: 30px;">
            <a href="${data.dashboardLink}" 
               style="background-color: #F5DD22; color: #0a4768; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              SUBMIT MY QUOTE NOW
            </a>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <p style="color: white; font-size: 14px; margin: 0 0 10px 0;">The remote control for your insulation business</p>
        <p style="color: white; font-size: 12px; margin: 0;">Serving those that serve others</p>
      </div>
      
    </body>
    </html>
    `
  },

  'contractor-reminder-4h': (data: any) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    const logoUrl = `${siteUrl}/insulation-pal-logo-footer.png`
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reminder: Submit Your Quote - InsulationPal</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a4768; font-family: Arial, sans-serif;">
      
      <!-- Header -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <img src="${logoUrl}" alt="InsulationPal" style="height: 120px; width: auto;">
      </div>
      
      <!-- Main Content Card -->
      <div style="background-color: white; margin: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Reminder Header -->
        <div style="background-color: #ffeaa7; padding: 30px; text-align: center; border-bottom: 3px solid #f39c12;">
          <h1 style="color: #856404; font-size: 28px; margin: 0; font-weight: bold;">
            ⚠️ Second Reminder: Don't Miss This Opportunity
          </h1>
          <p style="color: #856404; font-size: 16px; margin: 10px 0 0 0;">
            It's been 4 hours since you received this lead
          </p>
        </div>
        
        <!-- Lead Details -->
        <div style="padding: 30px;">
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
            Hi <strong>${data.contractorName}</strong>,
          </p>
          
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
            This is your second reminder about the project in <strong>${data.city}, ${data.state}</strong>. 
            Other contractors may already be submitting quotes - make sure you don't get left behind!
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #0a4768; margin: 0 0 15px 0; font-size: 18px;">📋 Project Details:</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">📍 ${data.propertyAddress || `${data.city}, ${data.state}`}</li>
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">🏠 ${data.homeSize?.toLocaleString()} sq ft home</li>
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">📅 Timeline: ${data.projectTimeline || 'ASAP'}</li>
              ${data.budgetRange ? `<li style="margin-bottom: 8px; color: #333; font-size: 16px;">💰 Budget: ${data.budgetRange}</li>` : ''}
            </ul>
          </div>
          
          <!-- Urgency Message -->
          <div style="background-color: #ffeaa7; border: 1px solid #f39c12; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f39c12;">
            <h4 style="color: #856404; margin-top: 0; font-size: 16px;">⏰ Time is Running Out:</h4>
            <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
              Customers typically review quotes within the first 24 hours. The sooner you submit, the better your chances. 
              Don't let this opportunity slip away!
            </p>
          </div>
          
          <!-- Call to Action -->
          <div style="text-align: center; margin-top: 30px;">
            <a href="${data.dashboardLink}" 
               style="background-color: #F5DD22; color: #0a4768; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              SUBMIT MY QUOTE NOW
            </a>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <p style="color: white; font-size: 14px; margin: 0 0 10px 0;">The remote control for your insulation business</p>
        <p style="color: white; font-size: 12px; margin: 0;">Serving those that serve others</p>
      </div>
      
    </body>
    </html>
    `
  },

  'contractor-reminder-24h': (data: any) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    const logoUrl = `${siteUrl}/insulation-pal-logo-footer.png`
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Final Reminder: Submit Your Quote - InsulationPal</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a4768; font-family: Arial, sans-serif;">
      
      <!-- Header -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <img src="${logoUrl}" alt="InsulationPal" style="height: 120px; width: auto;">
      </div>
      
      <!-- Main Content Card -->
      <div style="background-color: white; margin: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Reminder Header -->
        <div style="background-color: #fee2e2; padding: 30px; text-align: center; border-bottom: 3px solid #ef4444;">
          <h1 style="color: #991b1b; font-size: 28px; margin: 0; font-weight: bold;">
            🚨 Final Reminder: Last Chance to Submit Your Quote
          </h1>
          <p style="color: #991b1b; font-size: 16px; margin: 10px 0 0 0;">
            It's been 24 hours since you received this lead
          </p>
        </div>
        
        <!-- Lead Details -->
        <div style="padding: 30px;">
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
            Hi <strong>${data.contractorName}</strong>,
          </p>
          
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
            This is your <strong>final reminder</strong> about the project in <strong>${data.city}, ${data.state}</strong>. 
            The customer is likely reviewing quotes from other contractors right now. This is your last opportunity to submit a quote!
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #0a4768; margin: 0 0 15px 0; font-size: 18px;">📋 Project Details:</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">📍 ${data.propertyAddress || `${data.city}, ${data.state}`}</li>
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">🏠 ${data.homeSize?.toLocaleString()} sq ft home</li>
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">📅 Timeline: ${data.projectTimeline || 'ASAP'}</li>
              ${data.budgetRange ? `<li style="margin-bottom: 8px; color: #333; font-size: 16px;">💰 Budget: ${data.budgetRange}</li>` : ''}
            </ul>
          </div>
          
          <!-- Urgency Message -->
          <div style="background-color: #fee2e2; border: 1px solid #ef4444; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ef4444;">
            <h4 style="color: #991b1b; margin-top: 0; font-size: 16px;">⏰ This is Your Last Chance:</h4>
            <p style="color: #991b1b; margin: 0; font-size: 14px; line-height: 1.5;">
              After 24 hours, customers typically make their decision. If you want to compete for this project, 
              you need to submit your quote <strong>right now</strong>. Don't let this opportunity pass you by!
            </p>
          </div>
          
          <!-- Call to Action -->
          <div style="text-align: center; margin-top: 30px;">
            <a href="${data.dashboardLink}" 
               style="background-color: #F5DD22; color: #0a4768; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              SUBMIT MY QUOTE NOW
            </a>
            <p style="color: #666; font-size: 14px; margin-top: 15px;">
              This may be your last opportunity to win this project
            </p>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <p style="color: white; font-size: 14px; margin: 0 0 10px 0;">The remote control for your insulation business</p>
        <p style="color: white; font-size: 12px; margin: 0;">Serving those that serve others</p>
      </div>
      
    </body>
    </html>
    `
  },

  'won-bid-followup-3d': (data: any) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    const logoUrl = `${siteUrl}/insulation-pal-logo-footer.png`
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Follow-up: Job Completion Status - InsulationPal</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a4768; font-family: Arial, sans-serif;">
      
      <!-- Header -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <img src="${logoUrl}" alt="InsulationPal" style="height: 120px; width: auto;">
      </div>
      
      <!-- Main Content Card -->
      <div style="background-color: white; margin: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Follow-up Header -->
        <div style="background-color: #eff6ff; padding: 30px; text-align: center; border-bottom: 3px solid #3b82f6;">
          <h1 style="color: #1e40af; font-size: 28px; margin: 0; font-weight: bold;">
            📋 Quick Follow-up: Job Completion Status
          </h1>
          <p style="color: #1e40af; font-size: 16px; margin: 10px 0 0 0;">
            It's been 3 days since you won this bid
          </p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px;">
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
            Hi <strong>${data.contractorName}</strong>,
          </p>
          
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
            We're following up on the project you won for <strong>${data.customerName}</strong> in <strong>${data.city}, ${data.state}</strong>. 
            Have you completed the job for this customer?
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #0a4768; margin: 0 0 15px 0; font-size: 18px;">📋 Project Details:</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">📍 ${data.propertyAddress || `${data.city}, ${data.state}`}</li>
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">🏠 ${data.homeSize?.toLocaleString()} sq ft home</li>
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">👤 Customer: ${data.customerName}</li>
              ${data.projectTimeline ? `<li style="margin-bottom: 8px; color: #333; font-size: 16px;">📅 Timeline: ${data.projectTimeline}</li>` : ''}
            </ul>
          </div>
          
          <!-- Action Message -->
          <div style="background-color: #eff6ff; border: 1px solid #3b82f6; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
            <h4 style="color: #1e40af; margin-top: 0; font-size: 16px;">💡 Why This Matters:</h4>
            <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.5;">
              Once you confirm the job is completed, we'll automatically send a review request to your customer. 
              Customer reviews help build your reputation and attract more business!
            </p>
          </div>
          
          <!-- Call to Action -->
          <div style="text-align: center; margin-top: 30px;">
            <a href="${data.dashboardLink}" 
               style="background-color: #F5DD22; color: #0a4768; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              UPDATE JOB STATUS
            </a>
            <p style="color: #666; font-size: 14px; margin-top: 15px;">
              Click to go to your dashboard and mark the job as completed
            </p>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <p style="color: white; font-size: 14px; margin: 0 0 10px 0;">The remote control for your insulation business</p>
        <p style="color: white; font-size: 12px; margin: 0;">Serving those that serve others</p>
      </div>
      
    </body>
    </html>
    `
  },

  'won-bid-followup-5d': (data: any) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'
    const logoUrl = `${siteUrl}/insulation-pal-logo-footer.png`
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Final Follow-up: Job Completion Status - InsulationPal</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a4768; font-family: Arial, sans-serif;">
      
      <!-- Header -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <img src="${logoUrl}" alt="InsulationPal" style="height: 120px; width: auto;">
      </div>
      
      <!-- Main Content Card -->
      <div style="background-color: white; margin: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Follow-up Header -->
        <div style="background-color: #fff3cd; padding: 30px; text-align: center; border-bottom: 3px solid #f59e0b;">
          <h1 style="color: #856404; font-size: 28px; margin: 0; font-weight: bold;">
            ⏰ Final Follow-up: Job Completion Status
          </h1>
          <p style="color: #856404; font-size: 16px; margin: 10px 0 0 0;">
            It's been 5 days since you won this bid
          </p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px;">
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
            Hi <strong>${data.contractorName}</strong>,
          </p>
          
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
            This is our final follow-up regarding the project you won for <strong>${data.customerName}</strong> in <strong>${data.city}, ${data.state}</strong>. 
            Have you completed the job for this customer?
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #0a4768; margin: 0 0 15px 0; font-size: 18px;">📋 Project Details:</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">📍 ${data.propertyAddress || `${data.city}, ${data.state}`}</li>
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">🏠 ${data.homeSize?.toLocaleString()} sq ft home</li>
              <li style="margin-bottom: 8px; color: #333; font-size: 16px;">👤 Customer: ${data.customerName}</li>
              ${data.projectTimeline ? `<li style="margin-bottom: 8px; color: #333; font-size: 16px;">📅 Timeline: ${data.projectTimeline}</li>` : ''}
            </ul>
          </div>
          
          <!-- Urgency Message -->
          <div style="background-color: #fff3cd; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #856404; margin-top: 0; font-size: 16px;">💡 Don't Miss Out on Reviews:</h4>
            <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
              Customer reviews are crucial for your business reputation. Once you confirm the job is completed, 
              we'll send a review request to your customer. This helps you build trust and attract more customers!
            </p>
          </div>
          
          <!-- Call to Action -->
          <div style="text-align: center; margin-top: 30px;">
            <a href="${data.dashboardLink}" 
               style="background-color: #F5DD22; color: #0a4768; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              UPDATE JOB STATUS NOW
            </a>
            <p style="color: #666; font-size: 14px; margin-top: 15px;">
              Click to go to your dashboard and mark the job as completed
            </p>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0a4768; padding: 20px; text-align: center;">
        <p style="color: white; font-size: 14px; margin: 0 0 10px 0;">The remote control for your insulation business</p>
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

export async function POST(request: NextRequest) {
  try {
    const { to, subject, template, data } = await request.json()

    console.log('📧 Email service called:', {
      to,
      subject,
      template,
      hasData: !!data,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      hasSendGridKey: !!process.env.SENDGRID_API_KEY
    })

    // Debug email data
    if (template === 'contractor-quote') {
      console.log('🔍 Email template data:', {
        quoteReviewLink: data.quoteReviewLink,
        leadId: data.leadId,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
        allData: data
      })
    }

    // Get HTML content from template
    const htmlContent = emailTemplates[template as keyof typeof emailTemplates]?.(data) || 
                       '<p>Default email content</p>'

    // SendGrid email configuration
    // Use dedicated verification email for email verification templates
    const isVerificationEmail = template === 'contractor-email-verification'
    const fromEmail = isVerificationEmail 
      ? (process.env.SENDGRID_VERIFICATION_EMAIL || 'verify@quote.insulationpal.com')
      : (process.env.SENDGRID_FROM_EMAIL || 'team@quote.insulationpal.com')
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
    
    console.log('✅ Email sent successfully via SendGrid:', {
      statusCode: response[0].statusCode,
      to: to,
      subject: subject,
      template: template
    })
    
    return NextResponse.json({ 
      success: true, 
      messageId: response[0].headers['x-message-id'] || 'sent',
      statusCode: response[0].statusCode
    })
    
  } catch (error: any) {
    console.error('❌ SendGrid email send error:', error)
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.body || error.response,
      stack: error.stack
    })
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: {
        code: error.code,
        response: error.response?.body || error.response
      }
    }, { status: 500 })
  }
}
