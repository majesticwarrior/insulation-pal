# ⚡ Quick Fix: Contractor Verification Email Not Arriving

## Problem
Contractor registered but didn't receive verification email.

## Solution
The system now uses `verify@quote.insulationpal.com` for verification emails.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Update Environment Variables

Add this to your `.env.local` file:

```env
SENDGRID_VERIFICATION_EMAIL=verify@quote.insulationpal.com
```

### Step 2: Verify Sender Email in SendGrid

1. Go to: https://app.sendgrid.com/settings/sender_auth/senders
2. Click **"Create New Sender"**
3. Enter:
   - **From Email**: `verify@quote.insulationpal.com` ⚠️
   - **From Name**: `Insulation Pal`
   - **Reply To**: `team@quote.insulationpal.com`
   - Fill in address fields (required by SendGrid)
4. Click **"Save"**
5. **Check inbox** of `verify@quote.insulationpal.com`
6. **Click verification link** in SendGrid email
7. ✅ Done!

### Step 3: Restart Your App

```bash
# Stop your dev server (Ctrl+C)
npm run dev
```

### Step 4: Test

1. Register a new contractor with your email
2. Check your inbox for verification email
3. Should arrive from `verify@quote.insulationpal.com`

---

## 📊 Check if Email Was Sent

1. Go to: https://app.sendgrid.com/
2. Click **Activity** → **Activity Feed**
3. Look for recent emails
4. Check status and any error messages

---

## 🔥 For Existing Contractor Who Didn't Receive Email

If a contractor already registered but didn't receive the email:

### Option 1: Ask Them to Re-register
They can try registering again (the system will prevent duplicates)

### Option 2: Manually Get Verification Link

1. Access your Supabase database
2. Go to the `users` table
3. Find the user by email
4. Copy their `verification_token`
5. Create this link: 
   ```
   https://insulationpal.com/verify-email?token=PASTE_TOKEN_HERE
   ```
6. Send them the link directly

---

## 🚨 Still Not Working?

### Check These:

1. **Sender not verified?**
   - Go to https://app.sendgrid.com/settings/sender_auth/senders
   - Look for `verify@quote.insulationpal.com`
   - Should show green "Verified" status

2. **Wrong API key?**
   - Check `.env.local` has correct `SENDGRID_API_KEY`
   - Key should start with `SG.`

3. **Check spam folder**
   - Verification emails sometimes go to spam
   - Mark as "Not Spam" if found

4. **Check server logs**
   - Look for "✅ Verification email sent successfully"
   - Or "❌ Error sending verification email"

---

## 🎯 Production Deployment

After fixing locally, update production:

### For Vercel:

1. Go to Vercel project → **Settings** → **Environment Variables**
2. Add:
   ```
   SENDGRID_VERIFICATION_EMAIL = verify@quote.insulationpal.com
   ```
3. Click **Save**
4. **Redeploy** your app

---

**That's it!** Verification emails should now work. 🎉

For detailed setup, see `SENDGRID_VERIFICATION_EMAIL_SETUP.md`

