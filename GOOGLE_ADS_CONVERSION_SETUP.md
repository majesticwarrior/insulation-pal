# Google Ads Conversion Tracking Setup Guide

This guide will help you set up Google Ads conversion tracking for your InsulationPal application to track quote form submissions and optimize your ad campaigns.

## Overview

Conversion tracking has been implemented in the following forms:
- **Standard Quote Form** (`QuotePopup.tsx`) - When customers request 3 quotes
- **Direct Quote Form** (`DirectQuotePopup.tsx`) - When customers request a quote from a specific contractor

## Step 1: Get Your Google Ads Conversion ID

1. Sign in to your [Google Ads account](https://ads.google.com)
2. Click **Tools & Settings** (wrench icon) in the top right
3. Under **Measurement**, click **Conversions**
4. Click the **+ New conversion action** button
5. Select **Website** as your conversion source
6. Choose **Submit lead form** as the conversion category
7. Fill in the conversion details:
   - **Name**: "Quote Form Submission" (or your preferred name)
   - **Value**: Set a value for each conversion (e.g., $50) or use "Don't use a value"
   - **Count**: Choose "One" (recommended to avoid duplicate conversions)
   - **Conversion window**: 30 days (recommended)
   - **Attribution model**: Choose your preferred model (Data-driven recommended)

8. Click **Create and continue**
9. Select **Use Google tag** (this is the gtag.js option)
10. You'll see your **Google tag ID** (format: `AW-XXXXXXXXXX`) and **Conversion label**

## Step 2: Configure Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Google Ads Conversion Tracking
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=AW-XXXXXXXXXX/AbCdEfGhIjKlMnOpQrSt
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_VALUE=50.00
```

### Variable Explanations:

- **NEXT_PUBLIC_GOOGLE_ADS_ID**: Your Google Ads account ID (format: `AW-XXXXXXXXXX`)
  - Find this at the top of your conversion tracking code
  - Example: `AW-123456789`

- **NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL**: The full conversion label including the ID
  - Format: `AW-XXXXXXXXXX/AbCdEfGhIjKlMnOpQrSt`
  - Example: `AW-123456789/Abc-DEf1Gh2IjKl3Mn`
  - This is unique to each conversion action you create

- **NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_VALUE**: Optional - The value assigned to each conversion
  - Set this to the estimated value of a lead for your business
  - Example: `50.00` (represents $50 per lead)
  - If you don't want to track value, you can omit this variable

## Step 3: Verify Installation

After deploying your changes:

1. Go to your website and fill out a quote form
2. Submit the form successfully
3. Check your browser's developer console - you should see:
   ```
   🎯 Tracking Google Ads conversion: { conversionId: 'AW-XXXXXXXXXX', ... }
   ✅ Google Ads conversion tracked successfully
   ```

4. In Google Ads, go to **Tools & Settings** > **Conversions**
5. Click on your conversion action
6. Check the **Recent conversions** tab - your test conversion should appear within 24 hours
7. You can also use the [Google Tag Assistant](https://tagassistant.google.com/) Chrome extension to verify in real-time

## Step 4: Test with Google Tag Assistant (Recommended)

1. Install [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk) Chrome extension
2. Click the extension icon while on your website
3. Click **Enable** and refresh the page
4. Fill out and submit a quote form
5. Check Tag Assistant - you should see:
   - Google Ads Remarketing tag firing
   - Conversion event being sent
   - All parameters correctly populated

## How It Works

### Implementation Details

The conversion tracking is implemented using the following flow:

1. **Google Ads Script Loading** (`app/layout.tsx`)
   - The gtag.js script is loaded on all pages
   - Initialized with your Google Ads ID

2. **Conversion Tracking Utility** (`lib/google-ads-conversion.ts`)
   - Provides `trackQuoteSubmissionConversion()` function
   - Handles conversion event sending to Google Ads
   - Generates unique transaction IDs to prevent duplicates
   - Includes error handling and logging

3. **Form Integration** (Both quote forms)
   - Conversion tracking is triggered on successful form submission
   - Works in both production and demo mode
   - Sends conversion event with optional value

### Code Example

```typescript
import { trackQuoteSubmissionConversion } from '@/lib/google-ads-conversion'

// After successful form submission
trackQuoteSubmissionConversion('standard') // or 'direct' for direct quotes
```

## Conversion Data Sent

Each conversion event sends the following data to Google Ads:

- **send_to**: Your conversion label (identifies which conversion action)
- **value**: Optional conversion value (from environment variable or custom)
- **currency**: 'USD' (default)
- **transaction_id**: Unique ID to prevent duplicate conversions
- **event**: 'generate_lead' (for enhanced conversion tracking)

## Troubleshooting

### Conversions Not Showing Up

1. **Check environment variables**: Make sure all three variables are correctly set in `.env.local`
2. **Verify Google Ads ID format**: Should be `AW-XXXXXXXXXX` (with 'AW-' prefix)
3. **Check conversion label format**: Should include the ID: `AW-XXXXXXXXXX/AbCdEfGh...`
4. **Wait 24 hours**: Conversions can take up to 24 hours to appear in Google Ads
5. **Check browser console**: Look for error messages or warning logs

### Script Not Loading

1. Make sure you've deployed your changes
2. Clear your browser cache
3. Check the Network tab in DevTools - look for `googletagmanager.com/gtag/js` request
4. Verify the environment variable is accessible (it must start with `NEXT_PUBLIC_`)

### Testing in Development

The conversion tracking works in both development and production:

- Set your environment variables in `.env.local` for local development
- Test form submissions - they will send real conversion events to Google Ads
- Use a test conversion action in Google Ads to avoid polluting production data

### Common Errors

**"Google Ads gtag not found"**
- The gtag script hasn't loaded yet
- Usually happens if form is submitted too quickly after page load
- The script loads asynchronously with `strategy="afterInteractive"`

**"Invalid Google Ads conversion label format"**
- Check your conversion label format
- Must be: `AW-XXXXXXXXXX/AbCdEfGh...`
- Both the ID and label parts are required

## Campaign Optimization

Once conversion tracking is working:

1. **Enable Conversion Tracking in Campaigns**
   - Go to your campaign settings
   - Under "Bidding", select a conversion-based bid strategy
   - Choose: "Maximize conversions" or "Target CPA"

2. **Set Conversion Goals**
   - In campaign settings, select which conversions to optimize for
   - Choose your "Quote Form Submission" conversion action

3. **Monitor Performance**
   - Go to **Campaigns** > Select a campaign
   - Click the **Conversions** column to see conversion data
   - Analyze cost per conversion, conversion rate, etc.

4. **Optimize Based on Data**
   - Google Ads will use conversion data to optimize ad delivery
   - Better targeting of users likely to submit quote forms
   - Automatic bid adjustments to maximize conversions within budget

## Additional Features

### Custom Conversion Values

You can pass custom values when tracking conversions:

```typescript
// Track with a specific estimated lead value
trackQuoteSubmissionConversion('standard', 75.00) // $75 lead value
```

### Multiple Conversion Actions

To track different conversion labels for standard vs direct quotes:

1. Create two separate conversion actions in Google Ads
2. Add environment variables for each:
   ```bash
   NEXT_PUBLIC_GOOGLE_ADS_STANDARD_QUOTE_LABEL=AW-XXX/Label1
   NEXT_PUBLIC_GOOGLE_ADS_DIRECT_QUOTE_LABEL=AW-XXX/Label2
   ```
3. Update the tracking calls to use different labels

## Resources

- [Google Ads Conversion Tracking Guide](https://support.google.com/google-ads/answer/1722022)
- [Google Tag (gtag.js) Documentation](https://developers.google.com/tag-platform/gtagjs)
- [Conversion Tracking Best Practices](https://support.google.com/google-ads/answer/6331314)
- [Google Tag Assistant Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Use Google Tag Assistant to debug in real-time
4. Contact Google Ads support for account-specific issues

