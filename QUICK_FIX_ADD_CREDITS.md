# ⚡ Quick Fix: Add Credits to Contractor NOW

**Contractor ID**: `d54d6918-59bd-4694-84c1-f19dfe843dd1`  
**Session ID**: `cs_live_a1mlxW9LF1Xc5xUFAjr3Ne4LsAR4GAPR1kUo2xxESZ1giR6im6MI6xW09Q`  
**Credits to Add**: 1 (Single Lead package - $30)

---

## 🚀 FASTEST Method (30 seconds)

### Step 1: Add Admin Key

Add this line to your `.env.local` file:

```env
ADMIN_API_KEY=insulation-admin-2025
```

### Step 2: Restart Server

Stop your server (Ctrl+C) and restart:

```bash
npm run dev
```

### Step 3: Run This in Browser Console

Open your browser console (F12) and paste this:

```javascript
fetch('/api/stripe/manual-credit-addition', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contractorId: 'd54d6918-59bd-4694-84c1-f19dfe843dd1',
    credits: 1,
    stripeSessionId: 'cs_live_a1mlxW9LF1Xc5xUFAjr3Ne4LsAR4GAPR1kUo2xxESZ1giR6im6MI6xW09Q',
    packageId: 'single',
    adminKey: 'insulation-admin-2025'
  })
}).then(r => r.json()).then(result => {
  console.log('✅ Result:', result)
  alert(result.message || 'Credits added!')
})
```

### Step 4: Verify

Expected response:
```json
{
  "success": true,
  "message": "Credits added successfully",
  "data": {
    "contractorId": "d54d6918-59bd-4694-84c1-f19dfe843dd1",
    "businessName": "AZ Pride Insulation",
    "previousCredits": 0,
    "creditsAdded": 1,
    "newCredits": 1
  }
}
```

Refresh the contractor dashboard - credit should appear!

---

## 📋 Alternative: Direct SQL (If API Doesn't Work)

1. Go to: https://app.supabase.com/
2. Select your project
3. Go to **SQL Editor**
4. Run this:

```sql
-- Add 1 credit
UPDATE contractors 
SET credits = credits + 1,
    updated_at = NOW()
WHERE id = 'd54d6918-59bd-4694-84c1-f19dfe843dd1';

-- Record transaction
INSERT INTO credit_transactions (
  contractor_id,
  package_id,
  credits_purchased,
  amount_paid,
  stripe_session_id,
  transaction_type,
  status,
  created_at,
  updated_at
) VALUES (
  'd54d6918-59bd-4694-84c1-f19dfe843dd1',
  'single',
  1,
  3000,
  'cs_live_a1mlxW9LF1Xc5xUFAjr3Ne4LsAR4GAPR1kUo2xxESZ1giR6im6MI6xW09Q',
  'purchase',
  'completed',
  NOW(),
  NOW()
);

-- Verify
SELECT credits FROM contractors 
WHERE id = 'd54d6918-59bd-4694-84c1-f19dfe843dd1';
```

---

## 🔧 Why This Happened

**Problem**: Stripe webhooks can't reach localhost

Your terminal logs show:
- ✅ Payment processed successfully
- ✅ Session ID: `cs_live_a1mlxW9LF1Xc5xUFAjr3Ne4LsAR4GAPR1kUo2xxESZ1giR6im6MI6xW09Q`
- ❌ No webhook received (credits not added)

**You're using LIVE Stripe keys on localhost** - Stripe can't send webhooks to localhost!

---

## 🎯 Permanent Solution

### For Testing on Localhost:

Install Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI (Windows - use Scoop)
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# Login
stripe login

# Forward webhooks (keep this running in a separate terminal)
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy the webhook secret it prints and add to .env.local:
STRIPE_WEBHOOK_SECRET=whsec_xxx...

# Restart your dev server
npm run dev
```

### For Production (Deployed):

1. Deploy your app
2. Go to: https://dashboard.stripe.com/webhooks
3. Add endpoint: `https://yoursite.com/api/stripe/webhook`
4. Select event: `checkout.session.completed`
5. Copy webhook secret → Add to production environment variables
6. Redeploy

---

## ✅ What Happens Next

After adding credits manually:
1. Contractor sees 1 credit in dashboard
2. Can use credit to respond to leads
3. Transaction is recorded for bookkeeping
4. Stripe payment already completed (no refund needed)

Then set up webhooks properly so this doesn't happen again!

---

**See `WEBHOOK_CREDITS_NOT_ADDED_FIX.md` for complete troubleshooting guide.**

