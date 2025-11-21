# Google Ads Conversion Tracking - Quick Start

## ✅ What's Been Implemented

Google Ads conversion tracking has been added to track when customers successfully submit quote forms. This allows you to:
- Track conversions in Google Ads
- Optimize your ad campaigns automatically
- Measure ROI and cost per lead
- Target users more likely to convert

## 🚀 Quick Setup (5 Minutes)

### 1. Get Your Google Ads Conversion Details

Go to: [Google Ads Conversions](https://ads.google.com/aw/conversions)

Create a new conversion action:
- **Type**: Website
- **Category**: Submit lead form
- **Name**: Quote Form Submission
- **Value**: Enter estimated lead value (e.g., $50)

You'll receive:
- **Google Ads ID**: `AW-XXXXXXXXXX`
- **Conversion Label**: `AW-XXXXXXXXXX/AbCdEfGhIjKl`

### 2. Add to Your Environment Variables

Create or update `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=AW-XXXXXXXXXX/AbCdEfGhIjKl
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_VALUE=50.00
```

Replace the X's with your actual values from Google Ads.

### 3. Deploy and Test

```bash
npm run dev
```

1. Fill out a quote form on your site
2. Check browser console for: `✅ Google Ads conversion tracked successfully`
3. Verify in Google Ads dashboard (conversions appear within 24 hours)

## 📊 Where Tracking Is Active

Conversions are tracked on successful submissions from:
1. ✅ **Standard Quote Form** (Get 3 Free Quotes button)
2. ✅ **Direct Quote Form** (Quote from specific contractor)

Both forms track conversions even in demo mode for testing.

## 🔍 Verify It's Working

### Method 1: Browser Console (Instant)
1. Open Developer Tools (F12)
2. Go to Console tab
3. Submit a quote form
4. Look for: `🎯 Tracking Google Ads conversion`

### Method 2: Google Tag Assistant (Recommended)
1. Install [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Enable it on your site
3. Submit a quote form
4. Check the extension - should show conversion event

### Method 3: Google Ads Dashboard (24 hours)
1. Go to: Tools & Settings > Conversions
2. Click your conversion action
3. Check "Recent conversions" tab
4. Your test conversions will appear here

## 💡 Campaign Optimization

Once tracking is working, optimize your campaigns:

1. **Set Conversion Goal**
   - Campaign settings > Bidding
   - Select "Maximize conversions" or "Target CPA"

2. **Monitor Performance**
   - View conversion data in campaign reports
   - Track: Cost per conversion, conversion rate

3. **Let Google Optimize**
   - Google Ads will automatically optimize ad delivery
   - Shows ads to users most likely to submit quote forms

## 📝 Files Modified

- ✅ `lib/google-ads-conversion.ts` - Conversion tracking utility
- ✅ `components/forms/QuotePopup.tsx` - Standard quote form
- ✅ `components/forms/DirectQuotePopup.tsx` - Direct quote form
- ✅ `app/layout.tsx` - Google Ads script loader

## 🔗 Full Documentation

See [GOOGLE_ADS_CONVERSION_SETUP.md](./GOOGLE_ADS_CONVERSION_SETUP.md) for:
- Detailed setup instructions
- Troubleshooting guide
- Advanced configuration
- Multiple conversion tracking
- Custom conversion values

## ⚠️ Important Notes

- Environment variables must start with `NEXT_PUBLIC_` to work in the browser
- Conversions can take up to 24 hours to appear in Google Ads
- Each form submission generates a unique transaction ID to prevent duplicates
- Works in both development and production environments
- Tracking works even if forms are in "demo mode"

## 🎯 Example Environment Variables

```bash
# Your actual values will look like this:
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-123456789
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=AW-123456789/Abc-DEf1Gh2IjKl3Mn
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_VALUE=50.00
```

## Need Help?

1. Check browser console for error messages
2. Verify environment variables are set correctly
3. Review [GOOGLE_ADS_CONVERSION_SETUP.md](./GOOGLE_ADS_CONVERSION_SETUP.md)
4. Use Google Tag Assistant for real-time debugging

