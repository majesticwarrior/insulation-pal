# 🔧 Fix: Credits Not Added After Payment

**Issue**: Contractor purchased credits, payment processed, but credits were NOT added to their account.

**Root Cause**: Stripe webhooks not reaching your localhost server.

---

## 🚨 Immediate Fix - Add Credits Manually

### Option A: Using the API Endpoint (Recommended)

1. **Add admin key to `.env.local`:**
   ```env
   ADMIN_API_KEY=your-secret-admin-key-here
   ```

2. **Restart your dev server:**
   ```bash
   npm run dev
   ```

3. **Call the API using browser console or Postman:**

   Open browser console and run:
   ```javascript
   fetch('/api/stripe/manual-credit-addition', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       contractorId: 'd54d6918-59bd-4694-84c1-f19dfe843dd1',
       credits: 1,
       stripeSessionId: 'cs_live_a1mlxW9LF1Xc5xUFAjr3Ne4LsAR4GAPR1kUo2xxESZ1giR6im6MI6xW09Q',
       packageId: 'single',
       adminKey: 'your-secret-admin-key-here'
     })
   }).then(r => r.json()).then(console.log)
   ```

4. **Verify credits were added:**
   - Refresh contractor dashboard
   - Check credit balance

### Option B: Using the TypeScript Script

1. **Install ts-node if not already installed:**
   ```bash
   npm install -g ts-node
   ```

2. **Run the script:**
   ```bash
   npx ts-node scripts/add-credits-manually.ts d54d6918-59bd-4694-84c1-f19dfe843dd1 1 cs_live_a1mlxW9LF1Xc5xUFAjr3Ne4LsAR4GAPR1kUo2xxESZ1giR6im6MI6xW09Q single
   ```

3. **Expected output:**
   ```
   ✅ Contractor found: AZ Pride Insulation
   💳 Adding 1 credits...
   ✅ Credits added successfully!
   📝 Recording transaction...
   ✅ Transaction recorded successfully!
   🎉 SUCCESS! Credits have been added to the contractor.
   ```

### Option C: Direct Database Update (Last Resort)

1. **Go to Supabase Dashboard:**
   - https://app.supabase.com/

2. **Run this SQL in SQL Editor:**
   ```sql
   -- Add 1 credit to the contractor
   UPDATE contractors 
   SET credits = credits + 1,
       updated_at = NOW()
   WHERE id = 'd54d6918-59bd-4694-84c1-f19dfe843dd1';

   -- Record the transaction
   INSERT INTO credit_transactions (
     contractor_id,
     package_id,
     credits_purchased,
     amount_paid,
     stripe_session_id,
     transaction_type,
     status
   ) VALUES (
     'd54d6918-59bd-4694-84c1-f19dfe843dd1',
     'single',
     1,
     3000,
     'cs_live_a1mlxW9LF1Xc5xUFAjr3Ne4LsAR4GAPR1kUo2xxESZ1giR6im6MI6xW09Q',
     'purchase',
     'completed'
   );
   ```

3. **Verify the update:**
   ```sql
   SELECT credits FROM contractors 
   WHERE id = 'd54d6918-59bd-4694-84c1-f19dfe843dd1';
   ```

---

## 🎯 Permanent Fix - Setup Webhooks Properly

### For Production (Deployed App)

1. **Get your webhook endpoint URL:**
   - Your deployed URL + `/api/stripe/webhook`
   - Example: `https://insulationpal.com/api/stripe/webhook`

2. **Add webhook in Stripe Dashboard:**
   - Go to: https://dashboard.stripe.com/webhooks
   - Click **"Add endpoint"**
   - Enter your webhook URL
   - Select events to listen for:
     - ✅ `checkout.session.completed`
     - ✅ `payment_intent.succeeded`
   - Click **"Add endpoint"**

3. **Copy webhook signing secret:**
   - After creating endpoint, click to reveal signing secret
   - Starts with `whsec_...`

4. **Add to production environment variables:**
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

5. **Redeploy your application**

6. **Test the webhook:**
   - Make a test purchase
   - Check Stripe Dashboard > Webhooks > [Your endpoint]
   - Should show "Succeeded" status
   - Credits should be added automatically

### For Local Development

You need Stripe CLI to forward webhooks to localhost:

#### Step 1: Install Stripe CLI

**Windows:**
```bash
# Download from https://github.com/stripe/stripe-cli/releases/latest
# Or use Scoop:
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**Mac:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
tar -xvf stripe_1.19.4_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin
```

#### Step 2: Login to Stripe CLI

```bash
stripe login
```

This will open a browser for authentication.

#### Step 3: Forward Webhooks to Localhost

**Open a NEW terminal window** and run:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

You'll see output like:
```
> Ready! Your webhook signing secret is whsec_... (^C to quit)
```

#### Step 4: Copy the Webhook Secret

Copy the webhook secret from the output and add to `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_local_webhook_secret_here
```

#### Step 5: Restart Dev Server

```bash
# In your main terminal (Ctrl+C to stop)
npm run dev
```

#### Step 6: Keep Stripe CLI Running

Keep the Stripe CLI terminal running while testing. You should see webhook events appear in that terminal:

```
2025-12-16 10:30:45   --> checkout.session.completed [evt_xxx]
2025-12-16 10:30:45  <--  [200] POST http://localhost:3000/api/stripe/webhook
```

#### Step 7: Test

1. Make a test purchase on localhost
2. Complete payment with test card: `4242 4242 4242 4242`
3. Watch Stripe CLI terminal for webhook event
4. Credits should be added automatically
5. Check server logs for: `Successfully added X credits to contractor`

---

## 🔍 Troubleshooting

### Webhook Not Receiving Events

**Check Stripe Dashboard:**
1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click on your webhook endpoint
3. Check "Recent events" section
4. Look for failed attempts and error messages

**Common Issues:**

1. **Wrong URL:**
   - Webhook URL must be publicly accessible (not localhost)
   - For localhost, MUST use Stripe CLI
   - Check URL doesn't have typos

2. **Wrong webhook secret:**
   - Each webhook endpoint has its own secret
   - Local CLI secret is different from dashboard secret
   - Make sure you're using the correct one

3. **Firewall blocking:**
   - Production server must allow incoming HTTPS requests
   - Check server firewall rules

### Webhook Receiving But Credits Not Added

**Check server logs for errors:**

```bash
# Look for these log entries:
❌ Failed to add credits to contractor:
❌ Missing metadata in checkout session:
❌ Webhook signature verification failed:
```

**Common Issues:**

1. **Missing metadata:**
   - Check checkout session includes: contractorId, packageId, credits
   - Verify metadata in Stripe Dashboard > Payments > [Session]

2. **Database function missing:**
   - Run the migration: `database/36-add-stripe-integration.sql`
   - Check function exists in Supabase SQL Editor:
     ```sql
     SELECT * FROM pg_proc WHERE proname = 'add_contractor_credits';
     ```

3. **RLS policies:**
   - Webhook uses service role key (bypasses RLS)
   - Check SUPABASE_SERVICE_ROLE_KEY is set correctly

### Test Webhook Manually

You can manually trigger a webhook event using Stripe CLI:

```bash
stripe trigger checkout.session.completed
```

Or send a test event from Stripe Dashboard:
1. Go to: Developers > Webhooks > [Your endpoint]
2. Click "Send test webhook"
3. Select "checkout.session.completed"
4. Add test metadata
5. Click "Send test webhook"

---

## 📊 Verify Credits Were Added

### Option 1: Contractor Dashboard

1. Log in as contractor
2. Check credit balance at top of dashboard
3. Go to "Purchase History" or "Transactions" tab
4. Should see completed purchase

### Option 2: Database Query

```sql
-- Check contractor credits
SELECT 
  id,
  business_name,
  credits,
  updated_at
FROM contractors 
WHERE id = 'd54d6918-59bd-4694-84c1-f19dfe843dd1';

-- Check transaction history
SELECT 
  id,
  contractor_id,
  package_id,
  credits_purchased,
  amount_paid,
  stripe_session_id,
  status,
  created_at
FROM credit_transactions 
WHERE contractor_id = 'd54d6918-59bd-4694-84c1-f19dfe843dd1'
ORDER BY created_at DESC
LIMIT 5;
```

### Option 3: Stripe Dashboard

1. Go to: https://dashboard.stripe.com/payments
2. Find the payment
3. Scroll to "Metadata" section
4. Should show: contractorId, packageId, credits
5. Check webhook logs for this payment

---

## 🎯 Complete Setup Checklist

### For Production:

- [ ] Webhook endpoint added in Stripe Dashboard
- [ ] Webhook URL is your production URL + `/api/stripe/webhook`
- [ ] Webhook events selected: `checkout.session.completed`
- [ ] Webhook signing secret copied
- [ ] `STRIPE_WEBHOOK_SECRET` added to production environment variables
- [ ] Application redeployed
- [ ] Test purchase completed successfully
- [ ] Credits added automatically
- [ ] Transaction logged in database
- [ ] Webhook shows "Succeeded" in Stripe Dashboard

### For Local Development:

- [ ] Stripe CLI installed
- [ ] Logged in with `stripe login`
- [ ] Stripe CLI forwarding with `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- [ ] Local webhook secret added to `.env.local`
- [ ] Dev server restarted
- [ ] Test purchase completed
- [ ] Webhook event appears in CLI terminal
- [ ] Credits added automatically
- [ ] Server logs show success message

---

## 📝 Files Created

1. **`scripts/add-credits-manually.ts`** - Command-line script to add credits
2. **`app/api/stripe/manual-credit-addition/route.ts`** - API endpoint to add credits
3. **`WEBHOOK_CREDITS_NOT_ADDED_FIX.md`** - This documentation

---

## 🆘 Still Having Issues?

### Check These:

1. **Environment variables set?**
   ```bash
   # Check if all variables are set
   echo $STRIPE_SECRET_KEY
   echo $STRIPE_WEBHOOK_SECRET
   echo $SUPABASE_SERVICE_ROLE_KEY
   ```

2. **Database migration ran?**
   - Check `add_contractor_credits` function exists
   - Check `credit_transactions` table exists

3. **Webhook endpoint accessible?**
   - For production: Test with `curl https://yoursite.com/api/stripe/webhook`
   - Should return 405 Method Not Allowed (POST is required)

4. **Server logs showing errors?**
   - Check for error messages in terminal
   - Look at Vercel logs (if deployed on Vercel)

---

**Last Updated**: December 16, 2025  
**Status**: ✅ Manual credit addition tools created  
**Next Step**: Add credits manually for this contractor, then set up webhooks properly

