# SendGrid Quick Start Guide 🚀

## ✅ Setup Complete

Your email system is now using SendGrid! Here's what to do next:

---

## 🎯 Step 1: Verify Your Sender Email (5 minutes)

**This is REQUIRED before you can send emails!**

1. Go to: https://app.sendgrid.com/settings/sender_auth/senders
2. Click **Create New Sender**
3. Enter these details:
   - **From Name**: `Insulation Pal`
   - **From Email**: `team@quote.insulationpal.com`
   - **Reply To**: `team@quote.insulationpal.com`
   - **Address**: (any valid address - required by SendGrid)
4. Click **Save**
5. **Check your email inbox** for verification
6. **Click the verification link**
7. ✅ Done! You can now send emails

---

## 🎯 Step 2: Create Environment File (2 minutes)

Copy `.env.local.example` to `.env.local` and update with your values:

```env
# SendGrid (already configured)
SENDGRID_API_KEY=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
SENDGRID_FROM_EMAIL=team@quote.insulationpal.com
SENDGRID_FROM_NAME=Insulation Pal

# Add your Supabase keys
NEXT_PUBLIC_SUPABASE_URL=your_actual_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_key
```

---

## 🎯 Step 3: Test It (2 minutes)

### Start dev server:
```bash
npm run dev
```

### Send a test email:

Open browser console on your site and run:

```javascript
fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'YOUR_EMAIL@example.com', // Replace with your email
    subject: '✅ SendGrid Test - InsulationPal',
    template: 'new-lead',
    data: {
      contractorName: 'Test Contractor',
      city: 'Phoenix',
      state: 'AZ',
      homeSize: 2000,
      areasNeeded: 'attic, walls',
      insulationTypes: 'spray foam',
      projectTimeline: 'ASAP',
      budgetRange: '$3,000-$5,000',
      dashboardLink: 'https://insulationpal.com/contractor-dashboard'
    }
  })
}).then(r => r.json()).then(console.log)
```

**Expected Result**: Email arrives in your inbox! 📧

---

## 🎯 Step 4: Deploy to Production

### Add to Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   ```
   SENDGRID_API_KEY
   SENDGRID_FROM_EMAIL
   SENDGRID_FROM_NAME
   ```
3. Redeploy

---

## 📊 Monitor Emails

View email activity: https://app.sendgrid.com/email_activity

You'll see:
- ✅ Delivered
- 📧 Opened
- 🔗 Clicked
- ❌ Bounced

---

## 🆘 Troubleshooting

### "The from address does not match a verified Sender Identity"
→ Go to Step 1 above and verify your sender email

### "API key does not start with SG."
→ Check `.env.local` file exists and has correct key

### Emails not arriving
→ Check SendGrid Activity Feed: https://app.sendgrid.com/email_activity

---

## 📚 Full Documentation

See `SENDGRID_SETUP.md` for complete details.

---

## ✅ Checklist

- [ ] Verified sender email in SendGrid
- [ ] Created `.env.local` file
- [ ] Tested email sending locally
- [ ] Added environment variables to Vercel
- [ ] Tested in production

---

**You're all set! Your email system is ready to go.** 🎉

**Questions?** Check the full documentation in `SENDGRID_SETUP.md`

