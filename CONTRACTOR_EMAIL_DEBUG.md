# Contractor Email Notification Debugging Guide

## 🚨 Issue: Contractors Not Receiving Email Notifications

### Step 1: Run Database Diagnostics
Execute the SQL script `database/29-debug-contractor-notifications.sql` to check:

1. **Contractor Contact Information**
   - Do contractors have `contact_email` populated?
   - Do they have `lead_delivery_preference` set?
   - Are they approved and have credits?

2. **Service Areas**
   - Do contractors have service areas set up?
   - Are they covering the cities where leads are being created?

3. **Recent Activity**
   - Are leads being created?
   - Are lead assignments being made?

### Step 2: Check Environment Variables
Verify these environment variables are set in your production environment:

```bash
# SMTP Configuration
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=team@insulationpal.com
SMTP_PASS=JitY*&4^%4tGTr22#

# Site URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Step 3: Test Email Service Directly
Create a test script to verify email sending works:

```javascript
// Test email service - run this in browser console on live site
async function testEmailService() {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'test@example.com', // Replace with your email
        subject: 'Test Email',
        template: 'new-lead',
        data: {
          contractorName: 'Test Contractor',
          city: 'Phoenix',
          state: 'AZ',
          propertyAddress: '123 Test St',
          homeSize: 2500,
          areasNeeded: 'Attic, Walls',
          insulationTypes: 'Fiberglass',
          projectTimeline: 'ASAP',
          budgetRange: '$3000-5000',
          dashboardLink: 'https://your-domain.com/contractor-dashboard'
        }
      })
    })
    
    const result = await response.json()
    console.log('Email test result:', result)
  } catch (error) {
    console.error('Email test error:', error)
  }
}

testEmailService()
```

### Step 4: Monitor Lead Assignment Process
When submitting a new quote request, check browser console for these logs:

**Expected Success Logs:**
```
🎯 Assigning lead to contractors in: Phoenix, AZ
🔍 Searching for contractors...
✅ Found 3 contractors in Phoenix
📋 Auto-assigning lead to 3 contractors: ["ABC Insulation", "XYZ Contractors"]
📋 Creating lead assignments...
📋 Assignment creation result: {assignmentError: null}
💳 Deducting credits from contractors...
✅ Deducted credit from ABC Insulation
📧 Notifying ABC Insulation via email
📧 Contact email: contractor@example.com, Contact phone: 555-1234
✅ Email notification sent to ABC Insulation at contractor@example.com
```

**Common Error Patterns:**
```
❌ No contractors available in Phoenix, AZ
❌ This could be due to:
   - No contractors registered in this city
   - No contractors with available credits
   - No contractors with approved status
   - No contractors with service areas in this city
```

### Step 5: Check Server Logs
Look for these in your production server logs:

**Email Service Logs:**
```
✅ Email sent successfully: {messageId: "...", to: "...", subject: "..."}
❌ Email send error: [error details]
```

**SMTP Connection Issues:**
```
❌ SMTP connection failed: [error details]
❌ Authentication failed: [error details]
```

### Step 6: Verify Contractor Data
Run this query to check contractor setup:

```sql
-- Check contractors with missing contact info
SELECT 
    c.business_name,
    c.status,
    c.credits,
    c.contact_email,
    c.lead_delivery_preference,
    u.email as user_email,
    CASE 
        WHEN c.contact_email IS NULL AND u.email IS NULL THEN 'MISSING EMAIL'
        WHEN c.contact_email IS NULL THEN 'USING USER EMAIL'
        ELSE 'HAS CONTRACTOR EMAIL'
    END as email_status
FROM contractors c
LEFT JOIN users u ON c.user_id = u.id
WHERE c.status = 'approved'
AND (c.contact_email IS NULL OR c.lead_delivery_preference IS NULL);
```

### Step 7: Fix Missing Data
If contractors are missing contact info, run:

```sql
-- Fix missing contact information
UPDATE contractors 
SET 
    contact_email = COALESCE(contact_email, users.email),
    contact_phone = COALESCE(contact_phone, users.phone),
    lead_delivery_preference = COALESCE(lead_delivery_preference, 'email')
FROM users 
WHERE contractors.user_id = users.id 
AND (contractors.contact_email IS NULL 
     OR contractors.contact_phone IS NULL 
     OR contractors.lead_delivery_preference IS NULL);
```

### Step 8: Test Complete Flow
1. **Submit a test quote request**
2. **Check browser console** for assignment logs
3. **Check server logs** for email sending
4. **Verify contractor receives email**
5. **Check spam folder** if email not received

## 🔧 Quick Fixes

### Fix 1: Ensure Contractors Have Contact Info
```sql
UPDATE contractors 
SET contact_email = users.email,
    contact_phone = users.phone,
    lead_delivery_preference = 'email'
FROM users 
WHERE contractors.user_id = users.id;
```

### Fix 2: Verify SMTP Configuration
Check that your production environment has the correct SMTP settings.

### Fix 3: Test Email Service
Use the test script above to verify emails can be sent.

## 📞 Next Steps
1. Run the diagnostic SQL script
2. Check environment variables
3. Test email service directly
4. Monitor console logs during lead creation
5. Fix any missing contractor data
6. Verify contractors receive emails

Let me know what the diagnostic script shows and I'll help you fix the specific issues!
