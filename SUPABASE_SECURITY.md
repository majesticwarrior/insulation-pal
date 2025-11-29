# 🔐 Supabase Security Configuration

**Last Updated**: November 29, 2025  
**Status**: ✅ Secured with Best Practices

---

## 🎯 Supabase Key Types & Security

### 1. **ANON KEY** (Public/Browser Safe) 🟢

```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Security Level**: 🟢 **PUBLIC - Safe for Browser**

**What it does:**
- Used in client-side code (browser)
- Protected by Row Level Security (RLS) policies
- Users can only access data allowed by your RLS rules
- Cannot bypass security policies

**Best Practices:**
- ✅ Safe to use with `NEXT_PUBLIC_` prefix
- ✅ Protected by Supabase RLS policies
- ✅ Cannot access restricted data
- ⚠️ Still requires proper RLS configuration

---

### 2. **SERVICE ROLE KEY** (Critical Secret) 🔴

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Security Level**: 🔴 **CRITICAL - NEVER EXPOSE**

**What it does:**
- **Bypasses ALL Row Level Security (RLS) policies**
- Has complete admin access to your database
- Can read, write, delete ANY data
- Used for server-side admin operations

**CRITICAL RULES:**
- ❌ **NEVER** use `NEXT_PUBLIC_` prefix
- ❌ **NEVER** expose to client-side code
- ❌ **NEVER** include in browser bundles
- ✅ **ONLY** use in API routes (`app/api/*`)
- ✅ **ONLY** use in server-side functions
- ✅ Keep in `.env.local` (never commit)

---

### 3. **PROJECT URL** (Public) 🟢

```bash
NEXT_PUBLIC_SUPABASE_URL=https://nacaxeklijillnrvdeah.supabase.co
```

**Security Level**: 🟢 **PUBLIC - Safe**

**What it does:**
- Your Supabase project endpoint
- Safe to expose in client code
- Public by design

---

## 🛡️ Security Best Practices

### ✅ DO's

1. **Use Anon Key in Client Code**
```typescript
// ✅ CORRECT - Client-side usage
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Safe for browser
)
```

2. **Use Service Role Key in API Routes Only**
```typescript
// ✅ CORRECT - Server-side API route
// app/api/admin/route.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Server-only, bypasses RLS
)
```

3. **Enable Row Level Security (RLS)**
```sql
-- ✅ CORRECT - Enable RLS on all tables
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

-- Create policies for data access
CREATE POLICY "Users can read own data"
  ON contractors FOR SELECT
  USING (auth.uid() = user_id);
```

---

### ❌ DON'Ts

1. **Never Use Service Role Key in Client**
```typescript
// ❌ WRONG - Never do this!
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // DANGEROUS!
)
```

2. **Never Prefix Service Role Key with NEXT_PUBLIC_**
```bash
# ❌ WRONG - This exposes it to browser!
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=eyJ...

# ✅ CORRECT - No prefix = server-only
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

3. **Never Store Keys in Client-Side Variables**
```typescript
// ❌ WRONG - Exposed in browser
const SERVICE_KEY = "eyJ..."

// ✅ CORRECT - Load from env at runtime
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
```

---

## 🔒 Row Level Security (RLS) Configuration

### Why RLS is Critical

Even with the anon key exposed to browsers, RLS protects your data:

```sql
-- Example: Contractors can only see their own data
CREATE POLICY "contractors_own_data"
  ON contractors FOR ALL
  USING (auth.uid() = user_id);

-- Example: Leads are assigned based on rules
CREATE POLICY "contractors_assigned_leads"
  ON leads FOR SELECT
  USING (
    contractor_id = (
      SELECT id FROM contractors WHERE user_id = auth.uid()
    )
  );
```

### Verify RLS is Enabled

Check all tables have RLS:

```sql
-- Check RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Should show rowsecurity = true for all tables
```

---

## 🚨 Common Security Mistakes

### 1. Exposing Service Role Key

**Problem:**
```typescript
// ❌ BAD - Service key in client component
'use client'
export default function Page() {
  const supabase = createClient(
    url,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Exposed!
  )
}
```

**Solution:**
```typescript
// ✅ GOOD - Use anon key in client
'use client'
export default function Page() {
  const supabase = createClient(
    url,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Safe
  )
}
```

### 2. Missing RLS Policies

**Problem:**
```sql
-- ❌ BAD - No RLS policies
CREATE TABLE sensitive_data (
  id uuid,
  secret text
);
-- RLS not enabled - anyone can access!
```

**Solution:**
```sql
-- ✅ GOOD - Enable RLS with policies
CREATE TABLE sensitive_data (
  id uuid,
  secret text,
  user_id uuid REFERENCES auth.users
);

ALTER TABLE sensitive_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_data"
  ON sensitive_data FOR ALL
  USING (auth.uid() = user_id);
```

### 3. Overly Permissive Policies

**Problem:**
```sql
-- ❌ BAD - Too permissive
CREATE POLICY "public_read"
  ON contractors FOR SELECT
  USING (true); -- Everyone can read everything!
```

**Solution:**
```sql
-- ✅ GOOD - Restricted access
CREATE POLICY "public_read_active_only"
  ON contractors FOR SELECT
  USING (
    status = 'active' AND 
    subscription_status = 'active'
  ); -- Only active contractors visible
```

---

## 🔍 Security Audit Checklist

### Database Security
- [x] All tables have RLS enabled
- [x] RLS policies are properly configured
- [x] Service role key is server-side only
- [x] Anon key is used for client-side
- [ ] Regular security audits scheduled

### Environment Variables
- [x] `SUPABASE_SERVICE_ROLE_KEY` has NO `NEXT_PUBLIC_` prefix
- [x] `.env.local` is in `.gitignore`
- [x] Production keys are in Vercel/hosting dashboard
- [x] Keys are different for dev/staging/production

### Code Review
- [x] No service role key in client components
- [x] No service role key in browser bundles
- [x] API routes properly validate requests
- [x] Authentication checks before sensitive operations

---

## 📊 Current Configuration Status

### Your Current Setup (Verified)

```bash
# ✅ CORRECT Configuration

# Public/Client-Safe
NEXT_PUBLIC_SUPABASE_URL=https://nacaxeklijillnrvdeah.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (Protected by RLS)

# Server-Only (Critical)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (No NEXT_PUBLIC_ prefix ✅)
```

**Security Status**: ✅ **PROPERLY CONFIGURED**

### What's Protected

| Item | Protection Level | Notes |
|------|-----------------|-------|
| Anon Key | 🟢 Public (RLS Protected) | Safe for browser |
| Service Role Key | 🔴 Server-Only | Properly secured |
| Project URL | 🟢 Public | Safe to expose |
| `.env.local` | 🔒 Ignored by git | Not committed |
| RLS Policies | ✅ Enabled | Database protected |

---

## 🔄 Key Rotation

### When to Rotate Supabase Keys

**Service Role Key**: Every 90 days or if compromised

**How to Rotate:**

1. **Generate New Service Role Key**
   - Go to: https://app.supabase.com/project/nacaxeklijillnrvdeah/settings/api
   - Navigate to **Project API keys**
   - Click **Generate new key** for service_role
   - Copy the new key

2. **Update Local Environment**
   ```bash
   # Update in .env.local
   SUPABASE_SERVICE_ROLE_KEY=new_key_here
   ```

3. **Update Production**
   - Update in Vercel/hosting dashboard
   - Redeploy application

4. **Test Everything**
   - Test API routes that use service role key
   - Verify admin functions work
   - Check database operations

5. **Revoke Old Key**
   - In Supabase dashboard, revoke the old key
   - Monitor for any failures

**Next Rotation**: February 27, 2026 (90 days)

---

## 🆘 If Service Role Key is Compromised

### Immediate Actions

1. **Revoke the Key Immediately**
   - Go to Supabase dashboard
   - API Settings → Service Role Key
   - Click **Revoke** or **Generate New**

2. **Generate New Key**
   - Copy the new service role key
   - Update `.env.local` locally
   - Update Vercel/production environment

3. **Check for Unauthorized Access**
   - Review Supabase logs
   - Check for unusual database queries
   - Review RLS policy violations

4. **Audit Your Tables**
   ```sql
   -- Check for unexpected data changes
   SELECT * FROM audit_logs
   WHERE created_at > NOW() - INTERVAL '24 hours'
   ORDER BY created_at DESC;
   ```

5. **Restart Application**
   ```bash
   # Local
   npm run dev

   # Production
   # Redeploy in Vercel
   ```

---

## 📚 Additional Resources

- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Managing API Keys](https://supabase.com/docs/guides/api/api-keys)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)

---

## ✅ Summary

Your Supabase configuration is **properly secured**:

- ✅ Service role key is server-side only (no `NEXT_PUBLIC_` prefix)
- ✅ Anon key is public but protected by RLS
- ✅ All sensitive keys are in `.env.local` (not committed)
- ✅ Row Level Security enabled on all tables
- ✅ Keys are properly documented with security levels

**No immediate action required** - Your Supabase setup follows security best practices!

---

**Last Audit**: November 29, 2025  
**Next Audit**: December 29, 2025  
**Status**: 🔐 **SECURE**

