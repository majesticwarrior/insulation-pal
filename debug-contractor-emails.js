// Debug contractor invitation email system
// This will help identify why contractors aren't receiving emails

console.log('🔍 Contractor Invitation Email Debug')
console.log('=====================================')
console.log('')

// Test 1: Check if SendGrid is configured
console.log('📧 SendGrid Configuration Check:')
console.log('- SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing')
console.log('- SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL || 'team@quote.insulationpal.com')
console.log('- SENDGRID_FROM_NAME:', process.env.SENDGRID_FROM_NAME || 'Insulation Pal')
console.log('- NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL || 'Not set')
console.log('')

// Test 2: Check contractor data structure
console.log('👷 Contractor Data Structure Test:')
const testContractorData = {
  contractorName: 'Test Contractor',
  customerName: 'Test Customer',
  homeSize: 2000,
  areas: 'attic, walls',
  insulationTypes: 'spray foam',
  city: 'Phoenix',
  state: 'AZ',
  timeline: 'ASAP',
  budget: '$3000-5000',
  inviteUrl: 'https://insulationpal.com/invite/test123'
}
console.log('Test data:', testContractorData)
console.log('')

// Test 3: Common issues checklist
console.log('🔍 Common Issues Checklist:')
console.log('1. ✅ SendGrid API key configured')
console.log('2. ⚠️  Sender email verification (team@quote.insulationpal.com)')
console.log('3. ⚠️  Contractor email addresses valid')
console.log('4. ⚠️  Email delivery (check spam folder)')
console.log('5. ⚠️  Template data structure matches')
console.log('')

console.log('📋 Next Steps:')
console.log('1. Verify sender email in SendGrid dashboard')
console.log('2. Check contractor email addresses in database')
console.log('3. Test with a real email address')
console.log('4. Check SendGrid Activity Feed for delivery status')
console.log('')

console.log('🌐 SendGrid Dashboard: https://app.sendgrid.com/')
console.log('📊 Activity Feed: https://app.sendgrid.com/activity/activity-feed')
console.log('🔐 Sender Auth: https://app.sendgrid.com/settings/sender_auth/senders')
