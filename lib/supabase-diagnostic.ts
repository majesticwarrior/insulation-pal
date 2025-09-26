// Supabase Configuration Diagnostic Tool
// This helps debug environment variable and API key issues

export const diagnoseSupabaseConfig = () => {
  const config = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  }

  const diagnosis = {
    hasUrl: !!config.url,
    hasAnonKey: !!config.anonKey,
    hasServiceKey: !!config.serviceKey,
    urlIsPlaceholder: config.url?.includes('placeholder') || false,
    anonKeyIsPlaceholder: config.anonKey?.includes('placeholder') || false,
    serviceKeyIsPlaceholder: config.serviceKey?.includes('placeholder') || false,
    urlLength: config.url?.length || 0,
    anonKeyLength: config.anonKey?.length || 0,
    serviceKeyLength: config.serviceKey?.length || 0,
    environment: typeof window === 'undefined' ? 'server' : 'client',
    isDemoMode: false
  }

  // Determine if we're in demo mode
  diagnosis.isDemoMode = 
    !diagnosis.hasUrl || 
    !diagnosis.hasAnonKey || 
    diagnosis.urlIsPlaceholder || 
    diagnosis.anonKeyIsPlaceholder

  return {
    config: {
      url: config.url ? `${config.url.substring(0, 20)}...` : 'NOT_SET',
      anonKey: config.anonKey ? `${config.anonKey.substring(0, 20)}...` : 'NOT_SET',
      serviceKey: config.serviceKey ? `${config.serviceKey.substring(0, 20)}...` : 'NOT_SET'
    },
    diagnosis,
    recommendations: getRecommendations(diagnosis)
  }
}

const getRecommendations = (diagnosis: any) => {
  const recommendations = []

  if (!diagnosis.hasUrl) {
    recommendations.push('❌ NEXT_PUBLIC_SUPABASE_URL is not set. Add it to your .env.local file.')
  } else if (diagnosis.urlIsPlaceholder) {
    recommendations.push('❌ NEXT_PUBLIC_SUPABASE_URL contains placeholder text. Update with your real Supabase project URL.')
  } else {
    recommendations.push('✅ NEXT_PUBLIC_SUPABASE_URL is configured')
  }

  if (!diagnosis.hasAnonKey) {
    recommendations.push('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Add it to your .env.local file.')
  } else if (diagnosis.anonKeyIsPlaceholder) {
    recommendations.push('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY contains placeholder text. Update with your real Supabase anon key.')
  } else {
    recommendations.push('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is configured')
  }

  if (diagnosis.isDemoMode) {
    recommendations.push('🚨 Application is running in DEMO MODE due to missing/invalid environment variables.')
    recommendations.push('📋 Steps to fix:')
    recommendations.push('  1. Go to your Supabase project dashboard')
    recommendations.push('  2. Navigate to Settings > API')
    recommendations.push('  3. Copy the Project URL and anon public key')
    recommendations.push('  4. Update your .env.local file with the real values')
    recommendations.push('  5. Restart your development server')
  }

  return recommendations
}

// Export for use in components
export default diagnoseSupabaseConfig
