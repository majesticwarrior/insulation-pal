# Security Best Practices - Insulation Pal

## 🔐 Environment Variable Security

This document outlines critical security practices for protecting API keys and sensitive data in the Insulation Pal application.

---

## ⚠️ CRITICAL: What's Already Protected

Your `.env.local` file is properly excluded from git via `.gitignore`. This means your actual API keys are NOT in the repository.

---

## 🚨 Exposed Secrets That Were Found & Fixed

The following secrets were found hardcoded in documentation and code files and have been removed:

### ✅ Fixed Issues:
1. **SendGrid API Key** - Removed from `app/api/send-email/route.ts` and `lib/server-email-service.ts`
2. **Stripe Secret Key** - Removed from `STRIPE_SETUP_STATUS.md`
3. **Google Maps API Key** - Removed from `SENDGRID_COMPLETE.md`
4. **Supabase Service Role Key** - Removed from `database/README.md`

---

## 🛡️ Security Rules You Must Follow

### 1. Environment Variable Prefixes

**NEXT_PUBLIC_* Variables** = Exposed to Browser
```bash
# ✅ SAFE - Public data
NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...  # Anon key is designed for browser
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Publishable by design
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-123456789

# ❌ DANGEROUS - Never use NEXT_PUBLIC_ for these:
NEXT_PUBLIC_STRIPE_SECRET_KEY=sk_live_...  # WRONG!
NEXT_PUBLIC_SENDGRID_API_KEY=SG.xxx...     # WRONG!
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=...  # WRONG!
```

**No Prefix** = Server-Side Only
```bash
# ✅ CORRECT - These are never exposed to browser
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
STRIPE_SECRET_KEY=sk_live_...
SENDGRID_API_KEY=SG.xxx...
TWILIO_AUTH_TOKEN=xxx...
NEXTAUTH_SECRET=xxx...
```

### 2. File Security Checklist

#### ✅ Safe Practices:
- Keep all secrets in `.env.local` (already in `.gitignore`)
- Use `.env.example` for templates (no real values)
- Document environment variables in README files using placeholders
- Use environment variables in deployment platforms (Vercel, Netlify, etc.)

#### ❌ Dangerous Practices (DO NOT DO):
- Never hardcode API keys directly in source code
- Never commit `.env.local` to git
- Never share `.env.local` files via email or chat
- Never use real API keys in documentation examples
- Never commit real API keys to public repositories

### 3. Git Security

#### Check Git History for Exposed Secrets:
```bash
# Search git history for potential API keys
git log -p | grep -i "api_key\|secret\|password\|token"

# Check if .env.local was ever committed
git log --all --full-history -- .env.local
```

#### If Secrets Were Committed:
1. **Immediately revoke the compromised keys** in their respective service dashboards
2. Generate new keys
3. Update your `.env.local` with new keys
4. (Optional) Use `git-filter-repo` or BFG Repo-Cleaner to remove from history
5. Force push to overwrite history (only if necessary and coordinated with team)

---

## 🔑 Service-Specific Security

### Supabase
- **ANON KEY**: ✅ Safe for browser (public, protected by RLS)
- **SERVICE ROLE KEY**: ❌ NEVER expose - bypasses all security rules
- Use service role key ONLY in API routes (`app/api/*`)

### Stripe
- **Publishable Key** (`pk_*`): ✅ Safe for browser
- **Secret Key** (`sk_*`): ❌ NEVER expose - allows charges/refunds
- Always use test keys (`sk_test_*`) in development

### SendGrid
- **API Key**: ❌ NEVER expose - allows sending emails from your account
- Can create restricted keys with limited permissions

### Twilio
- **Account SID**: ⚠️ Can be public but prefer to keep private
- **Auth Token**: ❌ NEVER expose - allows sending SMS from your account

### Google Maps
- **API Key**: ⚠️ Restrict by HTTP referrer for browser use
- Use API restrictions in Google Cloud Console

### Google Ads
- **Conversion ID/Label**: ✅ Safe for browser (designed for client-side tracking)

---

## 🚀 Deployment Security

### Vercel (Recommended)
1. Go to Project Settings → Environment Variables
2. Add each variable separately
3. Choose environment: Production, Preview, Development
4. Never store secrets in `vercel.json`

### Environment Variable Groups
```bash
# Development (.env.local)
STRIPE_SECRET_KEY=sk_test_...

# Production (Vercel Dashboard)
STRIPE_SECRET_KEY=sk_live_...
```

---

## 🔄 Key Rotation Schedule

Rotate your API keys periodically:

| Service | Recommended Rotation |
|---------|---------------------|
| Supabase Service Role Key | Every 90 days |
| Stripe Secret Key | Every 90 days |
| SendGrid API Key | Every 90 days |
| Twilio Auth Token | Every 90 days |
| NEXTAUTH_SECRET | Every 90 days |
| Google Maps API Key | Yearly |

---

## 🆘 If You Suspect a Key Was Exposed

### Immediate Actions:
1. **Revoke the key immediately** in the service dashboard
2. **Generate a new key**
3. **Update** `.env.local` locally
4. **Update** environment variables in your deployment platform
5. **Restart** your application
6. **Monitor** for unusual activity in service dashboards
7. **Review** git history and remove if found

### Service-Specific Revocation Links:
- **Supabase**: https://app.supabase.com → Project Settings → API
- **Stripe**: https://dashboard.stripe.com/apikeys
- **SendGrid**: https://app.sendgrid.com/settings/api_keys
- **Twilio**: https://console.twilio.com/us1/develop/api-keys/api-keys-list
- **Google Maps**: https://console.cloud.google.com/apis/credentials

---

## 📋 Security Audit Checklist

Before deploying:

- [ ] `.env.local` is in `.gitignore`
- [ ] No hardcoded secrets in source code
- [ ] All `NEXT_PUBLIC_*` variables are safe to expose
- [ ] Production uses different keys than development
- [ ] API keys have appropriate restrictions (IP, referrer, etc.)
- [ ] Stripe is using live keys in production only
- [ ] All secrets are stored in Vercel environment variables
- [ ] `.env.example` has no real secrets
- [ ] Documentation uses placeholder values only

---

## 🔍 Automated Security Scanning

Consider using these tools:

```bash
# Install git-secrets to prevent committing secrets
brew install git-secrets  # macOS
git secrets --install
git secrets --register-aws

# Scan repository for secrets
npm install -g detect-secrets
detect-secrets scan
```

---

## 📚 Additional Resources

- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

---

## 📞 Security Contacts

If you discover a security vulnerability:
1. DO NOT open a public GitHub issue
2. Email security concerns to: [your-email@example.com]
3. Provide details about the vulnerability
4. Allow reasonable time for response before disclosure

---

**Last Updated**: November 29, 2025
**Status**: ✅ Security hardening complete

