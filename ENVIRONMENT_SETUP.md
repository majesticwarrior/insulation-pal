# Environment Setup Instructions

## Quick Setup for Demo

The application is currently running in **Demo Mode** which allows you to test all features without setting up a real database.

## Setting Up Environment Variables

To enable full functionality with a real Supabase database, create a `.env.local` file in the project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Authentication
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Optional: Payment Processing
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Optional: Email/SMS Notifications
SENDGRID_API_KEY=your_sendgrid_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## Demo Mode Features

Currently in demo mode, you can test:

✅ **Quote Form**: Submits successfully and shows "Demo Mode" message
✅ **Navigation**: All pages load correctly
✅ **UI Components**: All components render properly
✅ **Form Validation**: All forms validate correctly
✅ **Responsive Design**: Mobile and desktop layouts work

## To Enable Full Database Features:

1. Create a Supabase project at https://supabase.com
2. Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
3. Get your project URL and API keys from the Supabase dashboard
4. Create the `.env.local` file with your actual values
5. Restart the development server

## Current Status

- ✅ Website loads successfully at http://localhost:3000
- ✅ All pages are accessible
- ✅ Quote forms work in demo mode
- ✅ Navigation and UI components function properly
- 🔄 Database features require Supabase setup for full functionality

The application is designed to gracefully handle missing environment variables and will continue to work for demonstration purposes.
