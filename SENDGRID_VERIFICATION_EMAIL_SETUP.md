# SendGrid Verification Email Setup ✅

## Issue Fixed: Contractor Email Verification

The system has been updated to use a dedicated email address for verification emails: **`verify@quote.insulationpal.com`**

---

## ✅ Changes Made

### 1. Updated Files

**`app/api/contractor-register/route.ts`**
- Changed default sender from `team@quote.insulationpal.com` to `verify@quote.insulationpal.com`
- Now uses `SENDGRID_VERIFICATION_EMAIL` environment variable

**`app/api/send-email/route.ts`**
- Added logic to use verification email for `contractor-email-verification` template
- Other email templates continue to use `team@quote.insulationpal.com`

---

## 🔧 Required Setup Steps

### Step 1: Update Your `.env.local` File

Add this new environment variable to your `.env.local` file:

```env
# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=team@quote.insulationpal.com
SENDGRID_VERIFICATION_EMAIL=verify@quote.insulationpal.com
SENDGRID_FROM_NAME=Insulation Pal
SENDGRID_REPLY_TO=team@quote.insulationpal.com

# Your existing Supabase variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://insulationpal.com
```

### Step 2: Verify Sender Email in SendGrid (CRITICAL)

**You MUST verify `verify@quote.insulationpal.com` in SendGrid before sending emails!**

#### Option A: Single Sender Verification (Recommended - Takes 5 minutes)

1. Go to: https://app.sendgrid.com/settings/sender_auth/senders
2. Click **"Create New Sender"** or **"Verify New Sender"**
3. Fill in the form:
   - **From Name**: `Insulation Pal`
   - **From Email**: `verify@quote.insulationpal.com` ⚠️ **Use this exact email**
   - **Reply To**: `team@quote.insulationpal.com` or `verify@quote.insulationpal.com`
   - **Company Address**: (enter any valid address - required by SendGrid)
   - **City**: Your city
   - **State**: Your state
   - **Zip**: Your zip code
   - **Country**: Your country

4. Click **"Save"**
5. **Check your email inbox** at `verify@quote.insulationpal.com`
6. **Click the verification link** in the email from SendGrid
7. ✅ Done! You can now send emails from this address

#### Option B: Domain Authentication (Advanced - Better for Production)

If you want to send from any email address at `insulationpal.com`:

1. Go to: https://app.sendgrid.com/settings/sender_auth
2. Click **"Authenticate Your Domain"**
3. Select your DNS provider
4. Follow the instructions to add DNS records
5. Wait 24-48 hours for DNS propagation
6. ✅ Done! You can send from any @insulationpal.com address

---

## 🚀 Production Deployment (Vercel/Other Hosting)

### Add Environment Variables to Your Hosting Platform

#### For Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables for **all environments** (Production, Preview, Development):

```
SENDGRID_API_KEY = your_sendgrid_api_key
SENDGRID_FROM_EMAIL = team@quote.insulationpal.com
SENDGRID_VERIFICATION_EMAIL = verify@quote.insulationpal.com
SENDGRID_FROM_NAME = Insulation Pal
SENDGRID_REPLY_TO = team@quote.insulationpal.com
```

4. Click **"Save"**
5. **Redeploy** your application

#### For Other Platforms:

- Add the same environment variables to your hosting platform's configuration
- Redeploy your application after adding the variables

---

## 🧪 Testing

### Test 1: Register a New Contractor

1. Go to your contractor registration page
2. Fill in the form with a test email address you have access to
3. Submit the registration
4. **Check your inbox** for the verification email
5. Verify the email is from **`verify@quote.insulationpal.com`**
6. Click the verification link

**Expected Result**: ✅ Email arrives from `verify@quote.insulationpal.com` and verification works

### Test 2: Check SendGrid Activity Feed

1. Go to: https://app.sendgrid.com/
2. Navigate to **Activity** → **Activity Feed**
3. Look for the verification email you just sent
4. Check the status (should be "Delivered")
5. Check the sender email (should be `verify@quote.insulationpal.com`)

### Test 3: Verify Email Not Going to Spam

1. Check your spam/junk folder
2. If the email is in spam:
   - Mark it as "Not Spam"
   - Check SendGrid sender authentication
   - Consider setting up domain authentication (Option B above)

---

## 📧 Email Types and Senders

The system now uses different sender emails for different purposes:

| Email Type | Sender Email | Purpose |
|------------|--------------|---------|
| Verification Emails | `verify@quote.insulationpal.com` | Contractor email verification |
| Lead Notifications | `team@quote.insulationpal.com` | New lead notifications to contractors |
| Quote Notifications | `team@quote.insulationpal.com` | Quote submission emails to customers |
| General Emails | `team@quote.insulationpal.com` | All other system emails |

---

## 🐛 Troubleshooting

### Error: "The from address does not match a verified Sender Identity"

**Solution**: 
1. Go to https://app.sendgrid.com/settings/sender_auth/senders
2. Verify that `verify@quote.insulationpal.com` is in the list
3. Check that it shows "Verified" status (green checkmark)
4. If not verified, check your email for the verification link
5. If you didn't receive the verification email, resend it from SendGrid

### Verification Email Not Arriving

**Possible Causes**:
1. Sender email not verified in SendGrid (see above)
2. Email in spam/junk folder (check there)
3. Wrong email address entered during registration
4. SendGrid API key not configured or invalid

**Solutions**:
1. Verify sender email in SendGrid (Step 2 above)
2. Check spam/junk folder
3. Check SendGrid Activity Feed for delivery status
4. Verify `SENDGRID_API_KEY` is correct in `.env.local`
5. Check server logs for error messages

### Verification Email Going to Spam

**Solutions**:
1. Complete domain authentication (Option B in Step 2)
2. Ask recipients to add `verify@quote.insulationpal.com` to contacts
3. Check SendGrid sender reputation: https://app.sendgrid.com/suppressions
4. Avoid spam trigger words in email content

### How to Resend Verification Email

If a contractor didn't receive their verification email:

1. **Option 1**: Ask them to re-register (existing check will prevent duplicate)
2. **Option 2**: Manually generate a new verification link:
   - Access your database
   - Find the user record
   - Get their `verification_token`
   - Create link: `https://insulationpal.com/verify-email?token={verification_token}`
   - Send them the link manually

---

## 📊 Monitoring

### View Email Delivery Stats

1. **SendGrid Dashboard**: https://app.sendgrid.com/
2. **Activity Feed**: Real-time email tracking
   - See every email sent
   - Check delivery status
   - View bounce/spam reports
3. **Statistics**: 
   - Delivered: Should be 98%+
   - Opens: Typical 20-30%
   - Bounces: Should be <2%

### Set Up Alerts (Optional)

1. Go to: **Settings** → **Mail Settings** → **Event Notification**
2. Configure webhooks for:
   - Bounces (remove invalid emails from your list)
   - Spam reports (investigate email content issues)
   - Unsubscribes (update user preferences)

---

## ⚠️ Important Notes

### Email Sending Limits

**SendGrid Free Tier**:
- 100 emails/day
- 3,000 emails/month

**If you need more**:
- Essentials Plan: $19.95/month - 50,000 emails
- Pro Plan: $89.95/month - 100,000 emails

**Check your current plan**: https://app.sendgrid.com/settings/billing

### Security Best Practices

🔒 **Keep your API key secure!**
- Never commit to git (already in `.gitignore`)
- Use environment variables only
- Rotate key if compromised
- Create separate keys for dev/prod environments

### Sender Email Best Practices

- Use a dedicated email for verification (`verify@`)
- Use a different email for general communication (`team@`)
- Keep emails professional and branded
- Always provide a reply-to address
- Consider using different emails for different email types (support@, noreply@, etc.)

---

## 🎯 Next Steps

- [ ] Add `SENDGRID_VERIFICATION_EMAIL` to `.env.local`
- [ ] Verify `verify@quote.insulationpal.com` in SendGrid
- [ ] Test contractor registration with a real email
- [ ] Check verification email arrives correctly
- [ ] Add environment variable to production (Vercel/hosting)
- [ ] Redeploy production application
- [ ] Test on production environment

---

## ✅ Verification Checklist

Before considering this complete:

- [ ] Environment variable added to `.env.local`
- [ ] Sender email verified in SendGrid
- [ ] Test registration completed successfully
- [ ] Verification email received and working
- [ ] Email not in spam folder
- [ ] Production environment variables updated
- [ ] Production deployment completed
- [ ] Production verification email tested

---

## 📞 Support

If you continue to experience issues:

1. Check SendGrid Activity Feed for detailed error messages
2. Review server logs for error details
3. Verify all environment variables are set correctly
4. Ensure sender email is verified in SendGrid
5. Contact SendGrid support if delivery issues persist

**SendGrid Support**: https://support.sendgrid.com/

---

**Last Updated**: December 16, 2025
**Issue**: Contractor verification emails not being delivered
**Solution**: Dedicated verification sender email with proper SendGrid configuration

