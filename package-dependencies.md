# Required Dependencies for Production

## Install these packages:

```bash
# Database & Auth
npm install @supabase/supabase-js next-auth

# Email & SMS
npm install nodemailer @sendgrid/mail twilio

# Image Upload
npm install cloudinary multer

# Payments
npm install stripe

# Form Handling
npm install react-hook-form @hookform/resolvers zod

# Additional UI
npm install @radix-ui/react-dialog @radix-ui/react-toast

# Development
npm install -D @types/nodemailer
```

## Environment Variables (.env.local):

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=noreply@insulationpal.com

# SMS
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Payments
STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Images
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Site
NEXT_PUBLIC_SITE_URL=https://insulationpal.com
```
