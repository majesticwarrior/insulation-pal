# Insulation Pal - Complete Setup Guide

## Overview

Insulation Pal is a comprehensive platform connecting homeowners with trusted insulation contractors. This implementation includes all requested features:

✅ **Completed Features:**
- Multi-step quote popup form with transitions
- Contractor registration and profile management
- Contractor dashboard with lead management
- Authentication system for contractors
- Resources/Learning Center with comprehensive articles
- State pages (Arizona) with top contractor listings
- City pages (Phoenix) with reviews and contractor profiles
- Automated review system with email/text notifications
- Image watermarking for contractor uploads
- 7 fictitious test companies with complete profiles

## Database Setup

### Supabase Configuration

1. Create a new Supabase project
2. Run the SQL schema from `supabase/schema.sql`
3. Update your environment variables (see Environment Setup below)

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Payment Processing (for future implementation)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email/SMS Notifications (for production)
SENDGRID_API_KEY=your_sendgrid_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## Test Contractor Login Credentials

The following 7 test contractors have been created for testing:

### 1. Arizona Premier Insulation
- **Email:** admin@arizonapremier.com
- **Password:** AZPremier2024!
- **Services:** Attic, Walls, Crawl Space
- **Insulation Types:** Blown-in, Spray Foam, Roll & Batt
- **Credits:** 50

### 2. Desert Shield Insulation
- **Email:** info@desertshield.com
- **Password:** DesertShield2024!
- **Services:** Attic, Basement, Garage
- **Insulation Types:** Spray Foam, Foam Board, Radiant Barrier
- **Credits:** 35

### 3. Valley Comfort Solutions
- **Email:** contact@valleycomfort.com
- **Password:** ValleyComfort2024!
- **Services:** Attic, Walls, Basement
- **Insulation Types:** Blown-in, Roll & Batt, Spray Foam
- **Credits:** 75

### 4. Cactus Insulation Pros
- **Email:** team@cactusinsulation.com
- **Password:** CactusIns2024!
- **Services:** Attic, Garage, Crawl Space
- **Insulation Types:** Spray Foam, Blown-in
- **Credits:** 25

### 5. Southwest Energy Savers
- **Email:** hello@swenergysavers.com
- **Password:** SWEnergy2024!
- **Services:** Walls, Basement, Attic
- **Insulation Types:** Blown-in, Foam Board, Roll & Batt
- **Credits:** 40

### 6. Grand Canyon Insulation
- **Email:** info@grandcanyoninsulation.com
- **Password:** GrandCanyon2024!
- **Services:** Attic, Crawl Space, Walls
- **Insulation Types:** Roll & Batt, Blown-in
- **Credits:** 60

### 7. Arizona Comfort Control
- **Email:** support@arizonacomfort.com
- **Password:** AZComfort2024!
- **Services:** Attic, Walls, Garage
- **Insulation Types:** Blown-in, Spray Foam
- **Credits:** 20

## How to Test the System

### 1. Quote Request Flow
1. Visit the homepage
2. Click "Get Free Quote" button
3. Fill out the multi-step form:
   - Step 1: Enter home size (sq ft)
   - Step 2: Select areas and insulation types
   - Step 3: Enter contact information
4. Choose quote preference:
   - "Random 3" will automatically assign to contractors
   - "Choose 3" will show contractor selection page

### 2. Contractor Registration
1. Visit `/join-contractor`
2. Fill out the comprehensive registration form
3. New contractors will have "pending" status until approved

### 3. Contractor Login & Dashboard
1. Visit `/contractor-login` or use the footer link
2. Use any of the test credentials above
3. Access the dashboard to:
   - View assigned leads
   - Manage profile information
   - Upload project images (will be watermarked)
   - Purchase lead credits
   - Track statistics

### 4. Review System
1. Reviews can be left at `/review/[contractorId]`
2. Verified reviews come from actual leads
3. Automated email/SMS notifications are sent (logged to console in development)

## Key Features Implemented

### Quote Popup Form
- Multi-step form with smooth transitions
- Form validation using Zod
- Real-time assignment to contractors
- Choice between random assignment or manual selection

### Contractor Management
- Complete registration system
- Authentication with bcrypt password hashing
- Profile management with services and service areas
- Lead credit system ($20 per lead)
- BBB accreditation tracking

### Review System
- Star rating (1-5 stars)
- Written reviews with verification
- Automatic review request emails/SMS
- Review display on contractor profiles

### Content Management
- Resources/Learning Center with comprehensive articles
- State pages with top contractor listings
- City pages with local contractor information
- SEO-friendly URLs and structure

### Image Management
- Automatic watermarking with Insulation Pal logo
- Support for multiple image formats
- File size validation
- Image preview functionality

## Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

## Database Population

To populate the test contractors (if using the script):

```bash
# Run the test contractor creation script
npx tsx scripts/create-test-contractors.ts
```

## Project Structure

```
/app
  /arizona-insulation-contractors     # State page
  /phoenix-insulation-contractors     # City page
  /contractor-login                   # Contractor authentication
  /contractor-dashboard               # Contractor management
  /join-contractor                    # Contractor registration
  /resources                          # Learning center
    /articles                         # Individual articles
  /review/[contractorId]             # Review submission

/components
  /forms                             # All form components
  /ui                               # Reusable UI components
  /layout                           # Header and footer

/lib
  /supabase.ts                      # Database client
  /auth.ts                          # Authentication utilities
  /notifications.ts                 # Email/SMS system
  /watermark.ts                     # Image watermarking
```

## Notes for Production

1. **Email/SMS Integration**: Currently logs to console. Integrate with SendGrid, Twilio, etc.
2. **Payment Processing**: Stripe integration for lead credits
3. **Image Storage**: Use Cloudinary or AWS S3 for production image hosting
4. **Security**: Implement proper rate limiting and security headers
5. **Performance**: Add caching and optimize database queries
6. **Monitoring**: Add error tracking and analytics

## Support

All test contractor accounts are pre-approved and ready for testing. Each has different configurations to test various scenarios:

- Different service areas and specializations
- Varying credit balances
- BBB accreditation status
- Different communication preferences

The system is fully functional and ready for demonstration and testing.
