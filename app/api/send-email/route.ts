// API route for sending emails (server-side only)
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getPropertyImages, getPlaceholderImage, extractStreetName } from '@/lib/google-maps'

const emailTemplates = {
  'new-lead': (data: any) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const logoUrl = `${siteUrl}/insulation-pal-logo.png`
    
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
  
  'contractor-quote': (data: any) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const logoUrl = `${siteUrl}/insulation-pal-logo.png`
    
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
        <img src="${logoUrl}" alt="InsulationPal" style="height: 40px; width: auto;">
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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const logoUrl = `${siteUrl}/insulation-pal-logo.png`
    
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
        <img src="${logoUrl}" alt="InsulationPal" style="height: 40px; width: auto;">
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
  }
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, template, data } = await request.json()

    // Create transporter with Outlook SMTP configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.office365.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'team@insulationpal.com',
        pass: process.env.SMTP_PASS || 'JitY*&4^%4tGTr22#'
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
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

    // Email options
    const mailOptions = {
      from: {
        name: process.env.SMTP_FROM_NAME || 'Insulation Pal',
        address: process.env.SMTP_FROM_EMAIL || 'team@insulationpal.com'
      },
      to: to,
      replyTo: process.env.SMTP_REPLY_TO || 'team@insulationpal.com',
      subject: subject,
      html: htmlContent
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    
    console.log('✅ Email sent successfully:', {
      messageId: info.messageId,
      to: to,
      subject: subject,
      template: template
    })
    
    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId 
    })
    
  } catch (error: any) {
    console.error('❌ Email send error:', error)
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      response: error.response,
      stack: error.stack
    })
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: {
        code: error.code,
        response: error.response
      }
    }, { status: 500 })
  }
}
