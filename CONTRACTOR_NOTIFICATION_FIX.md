# Contractor Notification Issues - Diagnosis & Fix

## Problem
Contractors are not receiving notifications when new leads are assigned on the live site.

## Root Causes Identified

### 1. Missing Contact Information
- Contractors may not have `contact_email` or `contact_phone` fields populated
- The system falls back to `users.email` and `users.phone` but this might not be working properly

### 2. Database Schema Issues
- The `contact_email` and `contact_phone` fields were added in migration 05 but may not be populated for existing contractors
- Some contractors might not have the `lead_delivery_preference` field set

### 3. Query Issues
- The contractor selection query might not be finding contractors due to:
  - No contractors in the customer's city
  - No contractors with available credits
  - No contractors with approved status
  - Missing service area data

## Solutions Implemented

### 1. Database Fix (Run this SQL)
```sql
-- Fix contractor contact information for notifications
-- This script ensures all contractors have contact_email and contact_phone populated

-- Update contractors to populate contact fields from their user record
UPDATE contractors 
SET 
    contact_email = COALESCE(contact_email, users.email),
    contact_phone = COALESCE(contact_phone, users.phone)
FROM users 
WHERE contractors.user_id = users.id 
AND (contractors.contact_email IS NULL OR contractors.contact_phone IS NULL);

-- Set default lead delivery preference if not set
UPDATE contractors 
SET lead_delivery_preference = 'email' 
WHERE lead_delivery_preference IS NULL;

-- Verify the updates
SELECT 
    c.id,
    c.business_name,
    c.contact_email,
    c.contact_phone,
    c.lead_delivery_preference,
    c.credits,
    c.status,
    u.email as user_email,
    u.phone as user_phone
FROM contractors c
LEFT JOIN users u ON c.user_id = u.id
WHERE c.status = 'approved'
ORDER BY c.created_at DESC
LIMIT 10;
```

### 2. Code Improvements
- Enhanced error logging in `lib/lead-assignment.ts`
- Added fallback logic for contact information (contractor fields → user fields)
- Better error messages when no contractors are found
- Improved notification handling with detailed logging

### 3. Debug Script
Created `debug-contractor-notifications.js` to help diagnose issues on the live site.

## How to Test the Fix

### 1. Run the Database Fix
Execute the SQL script above in your Supabase SQL editor.

### 2. Test Lead Creation
1. Go to the live site
2. Submit a new quote request
3. Check the browser console for detailed logging
4. Look for these log messages:
   - `🎯 Assigning lead to contractors in: [city], [state]`
   - `✅ Found X contractors in [city]`
   - `📧 Notifying [contractor] via [preference]`
   - `✅ Email notification sent to [contractor]`

### 3. Check Email Delivery
- Verify emails are being sent to contractor email addresses
- Check spam folders
- Verify SMTP configuration is working

### 4. Debug on Live Site
Run the debug script in the browser console:
```javascript
// Copy and paste the contents of debug-contractor-notifications.js
// into the browser console on the live site
```

## Expected Log Output (Success)
```
🎯 Assigning lead to contractors in: Phoenix, AZ
🔍 Searching for contractors...
✅ Found 3 contractors in Phoenix
📋 Auto-assigning lead to 3 contractors: ["ABC Insulation", "XYZ Contractors", "Best Insulation"]
📋 Creating lead assignments...
📋 Assignment data: [array of assignments]
📋 Assignment creation result: {assignmentError: null}
💳 Deducting credits from contractors...
✅ Deducted credit from ABC Insulation
✅ Deducted credit from XYZ Contractors
✅ Deducted credit from Best Insulation
📧 Notifying ABC Insulation via email
📧 Contact email: contractor@example.com, Contact phone: 555-1234
✅ Email notification sent to ABC Insulation at contractor@example.com
✅ Notifications sent to 3 contractors
Lead [lead-id] assigned to 3 contractors
```

## Common Issues & Solutions

### Issue: "No contractors available in [city]"
**Solution**: Check if contractors have service areas set up for that city

### Issue: "No contact information found for contractor"
**Solution**: Run the database fix script above

### Issue: "Failed to send email"
**Solution**: Check SMTP configuration and email service setup

### Issue: "Demo mode triggered"
**Solution**: Verify Supabase environment variables are set correctly

## Next Steps
1. Run the database fix script
2. Test lead creation on the live site
3. Monitor console logs for any remaining issues
4. Verify contractors are receiving emails
5. If issues persist, run the debug script and share the output
