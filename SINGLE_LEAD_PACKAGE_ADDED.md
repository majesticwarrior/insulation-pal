# ✅ Single Lead Package Added - $30

**Date**: December 16, 2025  
**Purpose**: Added 1-lead package for testing credit purchase process

---

## 🎯 What Was Added

### New Package Details:

| Property | Value |
|----------|-------|
| **Package ID** | `single` |
| **Name** | Single Lead |
| **Credits** | 1 |
| **Price** | $30 |
| **Price Per Credit** | $30 |
| **Description** | Try it out with one lead |
| **Popular** | No |

---

## 📁 Files Updated

### 1. **lib/stripe.ts** ✅
- Added single lead package at the beginning of `leadPackages` array (lines 13-21)
- Package will appear first in the purchase options

### 2. **lib/payment-service.ts** ✅
- Added matching package to `creditPackages` array (lines 19-25)
- Ensures consistency across payment services

---

## 🎨 How It Will Appear

The contractor dashboard will now show 5 packages:

1. **🆕 Single Lead** - $30 (1 credit) - Try it out with one lead
2. **Starter Package** - $150 (5 credits) - Perfect for new contractors
3. **Professional Package** - $285 (10 credits) - Most popular choice ⭐
4. **Business Package** - $675 (25 credits) - Best value for contractors
5. **Enterprise Package** - $1,250 (50 credits) - Maximum value for contractors

---

## 🧪 Testing the Purchase Flow

### Step 1: Access Contractor Dashboard

1. Log in as a contractor
2. Navigate to **"Purchase Lead Credits"** tab (or Packages section)
3. You should see the new "Single Lead" package at the top

### Step 2: Test Purchase

1. Click **"Purchase"** on the Single Lead package
2. Should create Stripe checkout session for $30
3. Complete test payment (use Stripe test cards)
4. Verify credit is added to contractor account

### Step 3: Verify Credit Application

1. Check contractor's credit balance increases by 1
2. Verify transaction is recorded in database
3. Check Stripe dashboard for payment confirmation

---

## 💳 Stripe Test Cards

For testing the purchase flow, use these Stripe test card numbers:

**Success:**
- Card: `4242 4242 4242 4242`
- Any future expiry date (e.g., 12/34)
- Any 3-digit CVC (e.g., 123)
- Any ZIP code (e.g., 12345)

**Declined:**
- Card: `4000 0000 0000 0002`
- Card will be declined

**Requires Authentication (3D Secure):**
- Card: `4000 0025 0000 3155`
- Will prompt for authentication

---

## 🔧 How Purchase Flow Works

### 1. Package Selection
```typescript
// User clicks "Purchase" on Single Lead package
packageId = 'single'
```

### 2. Checkout Session Created
```typescript
// Backend creates Stripe checkout session
{
  line_items: [{
    price_data: {
      currency: 'usd',
      unit_amount: 3000, // $30 in cents
      product_data: {
        name: 'Single Lead',
        description: 'Try it out with one lead',
      }
    },
    quantity: 1
  }],
  mode: 'payment',
  metadata: {
    contractor_id: contractorId,
    package_id: 'single',
    credits: '1'
  }
}
```

### 3. Payment Processed
- User redirected to Stripe checkout
- Enters payment details
- Stripe processes payment

### 4. Webhook Received
- Stripe sends webhook to your backend
- Backend verifies payment succeeded
- Credits added to contractor account
- Transaction recorded in database

### 5. Contractor Redirected
- Redirected back to dashboard
- Success message displayed
- Credit balance updated

---

## 📊 Database Changes

When a contractor purchases this package:

### credit_transactions table:
```sql
INSERT INTO credit_transactions (
  contractor_id,
  transaction_type,
  credits_amount,
  cost_amount,
  package_id,
  package_name,
  status,
  description,
  stripe_payment_intent_id
) VALUES (
  'contractor-uuid',
  'purchase',
  1,
  30.00,
  'single',
  'Single Lead',
  'completed',
  'Purchase of Single Lead',
  'pi_xxx...'
);
```

### contractors table:
```sql
UPDATE contractors 
SET credits = credits + 1 
WHERE id = 'contractor-uuid';
```

---

## 🎯 Why This Package is Useful

### For Testing:
- ✅ **Low cost** - Only $30 to test the full purchase flow
- ✅ **Quick verification** - See credit added immediately
- ✅ **Stripe integration** - Test payment processing end-to-end
- ✅ **Webhook testing** - Verify webhook handling works

### For Real Users:
- ✅ **Try before bulk buy** - Contractors can test with one lead
- ✅ **Low commitment** - No large upfront investment
- ✅ **Flexibility** - Buy exactly what they need right now
- ✅ **Easy onboarding** - Lower barrier to entry

---

## 📈 Package Pricing Comparison

| Package | Credits | Total | Per Credit | Savings vs Single |
|---------|---------|-------|------------|-------------------|
| **Single Lead** | 1 | $30 | $30.00 | - |
| Starter | 5 | $150 | $30.00 | $0 (0%) |
| Professional | 10 | $285 | $28.50 | $15 (5%) |
| Business | 25 | $675 | $27.00 | $75 (10%) |
| Enterprise | 50 | $1,250 | $25.00 | $250 (17%) |

*The single lead package has the same per-credit price as the Starter package, encouraging bulk purchases for better value.*

---

## 🚀 Next Steps

### 1. Test Locally

```bash
# Start dev server
npm run dev

# Go to contractor dashboard
# Navigate to Purchase Lead Credits tab
# Verify Single Lead package appears first
```

### 2. Configure Stripe (if not already done)

Make sure these environment variables are set:

```env
STRIPE_SECRET_KEY=sk_test_xxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx...
STRIPE_WEBHOOK_SECRET=whsec_xxx...
```

### 3. Test Purchase Flow

1. Click "Purchase" on Single Lead
2. Complete checkout with test card
3. Verify credit is added
4. Check Stripe dashboard

### 4. Deploy to Production

After testing:
1. Commit changes
2. Deploy to production
3. Use production Stripe keys
4. Test with real payment

---

## 🐛 Troubleshooting

### Package Not Showing Up?

1. **Clear cache and restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   rm -rf .next
   npm run dev
   ```

2. **Check imports:**
   - Verify `leadPackages` is imported correctly
   - Check component is using updated package list

3. **Check browser console:**
   - Look for any JavaScript errors
   - Verify data is loading correctly

### Purchase Button Not Working?

1. **Check Stripe configuration:**
   - Verify `STRIPE_SECRET_KEY` is set
   - Check API routes are working
   - Look at server logs for errors

2. **Test API endpoint directly:**
   ```bash
   curl -X POST http://localhost:3000/api/stripe/create-checkout-session \
     -H "Content-Type: application/json" \
     -d '{"packageId":"single","contractorId":"test-id"}'
   ```

### Credits Not Added After Payment?

1. **Check webhook configuration:**
   - Verify webhook endpoint is accessible
   - Check webhook secret is correct
   - Look at Stripe webhook logs

2. **Check database:**
   - Verify transaction was created
   - Check contractor credits were updated
   - Look at transaction status

---

## ✅ Verification Checklist

- [x] Single lead package added to `lib/stripe.ts`
- [x] Single lead package added to `lib/payment-service.ts`
- [ ] Tested locally - package appears in dashboard
- [ ] Tested purchase flow with test card
- [ ] Verified credit is added after payment
- [ ] Checked Stripe dashboard for payment
- [ ] Verified transaction in database
- [ ] Tested on production (after deployment)

---

**Last Updated**: December 16, 2025  
**Status**: ✅ Code updated and ready for testing  
**Price**: $30 for 1 lead credit

