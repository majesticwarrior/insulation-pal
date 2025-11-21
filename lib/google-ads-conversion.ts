/**
 * Google Ads Conversion Tracking Utility
 * 
 * This module provides functions to track conversions for Google Ads campaigns.
 * It supports both gtag.js (Google Tag) and Google Ads Conversion Tracking.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

export interface ConversionData {
  conversionId?: string
  conversionLabel?: string
  value?: number
  currency?: string
  transactionId?: string
}

/**
 * Track a Google Ads conversion event
 * 
 * @param conversionLabel - The conversion label from Google Ads (e.g., 'AW-123456789/AbC-D_efG-h12_34-567')
 * @param value - Optional conversion value (e.g., estimated lead value)
 * @param currency - Currency code (default: 'USD')
 * @param transactionId - Optional unique transaction ID to prevent duplicate conversions
 */
export function trackGoogleAdsConversion(
  conversionLabel: string,
  value?: number,
  currency: string = 'USD',
  transactionId?: string
): void {
  try {
    // Check if gtag is available
    if (typeof window === 'undefined' || !window.gtag) {
      console.warn('Google Ads gtag not found. Conversion tracking skipped.')
      return
    }

    // Extract conversion ID from label (format: AW-XXXXXXXXX/...)
    const conversionIdMatch = conversionLabel.match(/^(AW-\d+)\//)
    if (!conversionIdMatch) {
      console.error('Invalid Google Ads conversion label format:', conversionLabel)
      return
    }

    const conversionId = conversionIdMatch[1]
    const label = conversionLabel.split('/')[1]

    // Build conversion parameters
    const conversionParams: any = {
      send_to: conversionLabel
    }

    // Add optional parameters if provided
    if (value !== undefined && value > 0) {
      conversionParams.value = value
      conversionParams.currency = currency
    }

    if (transactionId) {
      conversionParams.transaction_id = transactionId
    }

    // Send conversion event to Google Ads
    console.log('🎯 Tracking Google Ads conversion:', {
      conversionId,
      label,
      ...conversionParams
    })

    window.gtag('event', 'conversion', conversionParams)

    // Also send a custom event for additional tracking
    window.gtag('event', 'generate_lead', {
      event_category: 'engagement',
      event_label: 'Quote Form Submission',
      value: value || 0,
      currency: currency
    })

    console.log('✅ Google Ads conversion tracked successfully')
  } catch (error) {
    console.error('❌ Error tracking Google Ads conversion:', error)
  }
}

/**
 * Track a quote form submission conversion
 * This is a convenience function for tracking quote submissions
 * 
 * @param formType - Type of form ('standard' or 'direct')
 * @param estimatedValue - Optional estimated value of the lead
 */
export function trackQuoteSubmissionConversion(
  formType: 'standard' | 'direct' = 'standard',
  estimatedValue?: number
): void {
  // Get conversion tracking settings from environment variables
  const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL
  const defaultValue = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_VALUE
  
  if (!conversionLabel) {
    console.warn('Google Ads conversion label not configured in environment variables')
    return
  }

  // Use provided value or default from environment
  const value = estimatedValue || (defaultValue ? parseFloat(defaultValue) : undefined)

  // Generate a unique transaction ID to prevent duplicate conversions
  const transactionId = `${formType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Track the conversion
  trackGoogleAdsConversion(
    conversionLabel,
    value,
    'USD',
    transactionId
  )
}

/**
 * Initialize Google Ads tracking
 * This should be called once when the app loads
 * 
 * @param conversionId - Your Google Ads conversion ID (e.g., 'AW-123456789')
 */
export function initializeGoogleAds(conversionId?: string): void {
  const adsId = conversionId || process.env.NEXT_PUBLIC_GOOGLE_ADS_ID

  if (!adsId) {
    console.warn('Google Ads ID not configured')
    return
  }

  if (typeof window === 'undefined') {
    return
  }

  // Initialize dataLayer if not exists
  window.dataLayer = window.dataLayer || []
  
  // Define gtag function if not exists
  if (!window.gtag) {
    window.gtag = function() {
      window.dataLayer?.push(arguments)
    }
  }

  // Configure Google Ads
  window.gtag('js', new Date())
  window.gtag('config', adsId)

  console.log('✅ Google Ads initialized:', adsId)
}

