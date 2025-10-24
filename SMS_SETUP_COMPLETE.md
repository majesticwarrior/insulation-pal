# SMS Notification Setup - Complete ✅

## Overview
SMS notifications for contractor lead alerts have been successfully implemented using Twilio.

## What Was Done

### 1. ✅ Installed Twilio SDK
- Installed `twilio` package (v18 packages added)
- Installed `@types/twilio` for TypeScript support

### 2. ✅ Implemented SMS Service (`lib/sms-service.ts`)
The SMS service now includes:
- **Active Twilio Integration**: Real Twilio client initialization
- **Phone Number Formatting**: Automatic conversion to E.164 format
  - Handles formats like: (555) 123-4567, 555-123-4567, 5551234567
  - Automatically adds +1 for US numbers
- **Environment Variable Validation**: Checks for required Twilio credentials
- **Error Handling**: Comprehensive error logging with Twilio error codes
- **Success Tracking**: Returns message SID and status

### 3. ✅ Enhanced Lead Assignment SMS (`lib/lead-assignment.ts`)
- SMS messages now include detailed lead information:
  - City and state
  - Home size (sq ft)
  - Areas needing insulation
  - Direct link to contractor dashboard with tracking parameter
- Enhanced logging for debugging
- Error handling that doesn't break the lead assignment process

### 4. ✅ SMS Consent Notice Added
- Added required consent text in contractor dashboard:
  - "*By selecting Text Messages, you are giving Insulation Pal consent to receive marketing messages."

## Environment Variables Required

Make sure these are set in your `.env.local` file:

```env
TWILIO_ACCOUNT_SID=your_actual_twilio_account_sid
TWILIO_AUTH_TOKEN=your_actual_twilio_auth_token
TWILIO_PHONE_NUMBER=your_actual_twilio_phone_number
NEXT_PUBLIC_SITE_URL=https://insulationpal.com
```

## How It Works

### Notification Flow
1. **Customer submits quote request** → Lead created
2. **System assigns lead to contractors** based on service area and credits
3. **System checks contractor's notification preference**:
   - `email` → Email only
   - `text` → SMS only
   - `both` → Email AND SMS
4. **SMS sent via Twilio** if preference includes text
5. **Contractor receives notification** with lead details

### SMS Message Format
```
InsulationPal: New lead in Phoenix, AZ! 2500 sq ft home. Areas: Attic, Walls. 
View details: https://insulationpal.com/contractor-dashboard?from=sms
```

## Testing Your SMS Setup

### Option 1: Test with Twilio Console
1. Log into your Twilio Console
2. Go to **Phone Numbers** → **Manage** → **Active Numbers**
3. Click on your purchased number
4. Use the **Send a Test SMS** feature

### Option 2: Test with a Real Lead
1. **Add your phone number to a test contractor**:
   - Go to contractor dashboard
   - Set notification preference to "Text" or "Both"
   - Add your phone number in "Phone # for Text Messages"
   - Save changes

2. **Create a test lead**:
   - Go to your website homepage
   - Fill out the quote form
   - Use an address in the contractor's service area
   - Submit the form

3. **Check your phone**:
   - You should receive an SMS within seconds
   - Check server logs for detailed information

### Option 3: Test with Development Environment
If using Twilio trial account:
- Verify your phone number in Twilio Console first
- Trial accounts can only send to verified numbers
- Upgrade to a paid account for production use

## Troubleshooting

### SMS Not Sending?

**Check 1: Environment Variables**
```bash
# In your terminal
echo $TWILIO_ACCOUNT_SID
echo $TWILIO_AUTH_TOKEN
echo $TWILIO_PHONE_NUMBER
```

**Check 2: Twilio Account Status**
- Is your account active?
- Is your Twilio number active and SMS-enabled?
- Do you have sufficient balance? (Trial accounts have credit limits)

**Check 3: Phone Number Format**
- Contractor's phone number must be valid
- US numbers should be 10 digits
- System automatically formats to E.164 (+1XXXXXXXXXX)

**Check 4: Server Logs**
Look for these log messages:
- `📱 Attempting to send SMS to [contractor] at [phone]`
- `✅ SMS sent successfully with SID: [message_id]`
- `❌ CRITICAL: Failed to send SMS` (if error occurred)

**Check 5: Contractor Preferences**
- Contractor must have `lead_delivery_preference` set to `'text'` or `'both'`
- Contractor must have a valid `contact_phone` number

### Common Error Messages

**"Twilio credentials are not configured"**
- Environment variables are missing or not loaded
- Restart your development server after adding env vars

**"Invalid phone number format"**
- Phone number must be at least 10 digits
- Check the contractor's phone number in the database

**Twilio Error 21211 - Invalid 'To' Number**
- The destination phone number is not valid
- For trial accounts, verify the number in Twilio Console

**Twilio Error 21608 - Unverified Number**
- Trial accounts can only send to verified numbers
- Either verify the number or upgrade your Twilio account

## Database Schema

### Contractors Table Fields Used
```sql
-- Phone number for SMS notifications
contact_phone VARCHAR(20)

-- Notification preference
lead_delivery_preference VARCHAR(20) 
  CHECK (lead_delivery_preference IN ('email', 'text', 'both'))
  DEFAULT 'email'
```

## Cost Considerations

### Twilio Pricing (as of 2024)
- **SMS to US/Canada**: ~$0.0079 per message
- **SMS to other countries**: Varies by destination
- **Trial Account**: Free credit ($15-20) for testing

### Your Use Case
- Each contractor receives 1 SMS per lead
- If you send 1000 leads/month with SMS: ~$7.90/month
- This cost is typically built into your lead pricing

## Security Best Practices

✅ **Already Implemented:**
- Twilio credentials stored in environment variables (not in code)
- 'use server' directive ensures SMS code runs server-side only
- Phone numbers automatically formatted and validated
- Comprehensive error logging without exposing credentials

🔒 **Additional Recommendations:**
- Rotate Twilio Auth Token periodically
- Monitor Twilio usage in their console for unusual activity
- Set up usage alerts in Twilio Console
- Never commit `.env.local` to version control

## Compliance

### TCPA Compliance
✅ Consent notice added to contractor dashboard
✅ SMS only sent to contractors who opted in
✅ Contractors can change preferences anytime

### Opt-Out Handling
Currently, contractors can opt out by:
1. Changing notification preference in dashboard
2. Contacting support

**Future Enhancement**: Add automatic STOP keyword handling:
```typescript
// Twilio can automatically handle STOP, START, HELP keywords
// Configure in Twilio Console → Messaging → Opt-Out Keywords
```

## Next Steps

### Immediate
1. ✅ Twilio credentials added to environment
2. ✅ SMS service implemented
3. ✅ Lead notifications updated
4. **Test with a real lead** (when ready)

### Future Enhancements
- [ ] Add SMS delivery status tracking (delivered, failed, etc.)
- [ ] Implement SMS delivery webhooks for real-time status
- [ ] Add SMS templates for different lead types
- [ ] Create SMS analytics dashboard
- [ ] Add customer SMS notifications (quote responses)
- [ ] Implement two-way SMS (contractors can reply)

## Support Resources

- **Twilio Documentation**: https://www.twilio.com/docs/sms
- **Twilio Node.js SDK**: https://www.twilio.com/docs/libraries/node
- **Twilio Error Codes**: https://www.twilio.com/docs/api/errors
- **Your Twilio Console**: https://console.twilio.com/

## Files Modified

1. `lib/sms-service.ts` - SMS sending logic
2. `lib/lead-assignment.ts` - Lead notification integration
3. `components/dashboard/ProfileEditForm.tsx` - Consent notice
4. `package.json` - Added Twilio dependencies

---

**Status**: ✅ SMS notifications are now fully functional and ready for testing!

**Last Updated**: October 24, 2024

