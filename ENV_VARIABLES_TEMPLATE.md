# Environment Variables Template

Copy these variables to your `.env.local` file:

```env
# ============================================
# SendGrid Email Configuration
# ============================================
# Get your API key from: https://app.sendgrid.com/settings/api_keys
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Sender email addresses (MUST be verified in SendGrid)
# Verify at: https://app.sendgrid.com/settings/sender_auth/senders

# General email sender (for quotes, leads, notifications)
SENDGRID_FROM_EMAIL=team@quote.insulationpal.com

# Dedicated email verification sender (NEW - for contractor verification)
SENDGRID_VERIFICATION_EMAIL=verify@quote.insulationpal.com

# Sender name displayed in emails
SENDGRID_FROM_NAME=Insulation Pal

# Reply-to email address
SENDGRID_REPLY_TO=team@quote.insulationpal.com


# ============================================
# Supabase Configuration
# ============================================
# Get these from: https://app.supabase.com/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here


# ============================================
# Site Configuration
# ============================================
# For development: http://localhost:3000
# For production: https://insulationpal.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000


# ============================================
# Google Maps (Optional)
# ============================================
# Get from: https://console.cloud.google.com/google/maps-apis
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## 🚨 IMPORTANT: SendGrid Sender Verification Required

You **MUST** verify both sender emails in SendGrid before they will work:

1. **`verify@quote.insulationpal.com`** - for verification emails
2. **`team@quote.insulationpal.com`** - for general emails

### How to Verify:

1. Go to: https://app.sendgrid.com/settings/sender_auth/senders
2. Click **"Create New Sender"** for each email
3. Fill in the form with the email address
4. Check your email inbox and click the verification link
5. Wait for "Verified" status in SendGrid

---

## 📝 How to Create `.env.local`

1. Copy the entire template above
2. Create a new file named `.env.local` in your project root
3. Paste the template
4. Replace all `your_*_here` values with your actual credentials
5. Save the file
6. Restart your development server

---

## ⚠️ Security Note

- **NEVER** commit `.env.local` to git
- It's already in `.gitignore`
- Keep your API keys secret
- Use different keys for development and production

