# InsulationPal Database Setup Guide

## 🚀 Quick Setup (5 minutes)

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Choose organization and fill details:
   - **Project Name**: `InsulationPal`
   - **Database Password**: (Generate strong password)
   - **Region**: Choose closest to your users
5. Wait for project to be created (~2 minutes)

### 2. Get Your Connection Details
After project creation, go to **Settings > API**:
- Copy `Project URL` 
- Copy `anon/public` key
- Copy `service_role` key (keep secret!)

### 3. Run Database Scripts

In your Supabase dashboard, go to **SQL Editor** and run these files **in order**:

#### Step 1: Main Schema
```sql
-- Copy and paste contents of: database/01-main-schema.sql
-- This creates all tables, indexes, and types
```

#### Step 2: Security Policies  
```sql
-- Copy and paste contents of: database/02-rls-policies.sql
-- This sets up Row Level Security
```

#### Step 3: Functions & Triggers
```sql
-- Copy and paste contents of: database/03-functions-triggers.sql
-- This adds automation and helper functions
```

#### Step 4: Sample Data (Optional)
```sql
-- Copy and paste contents of: database/04-sample-data.sql
-- This adds test contractors and customers
```

### 4. Configure Your App

Update your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site Configuration  
NEXT_PUBLIC_SITE_URL=https://insulationpal.com
```

### 5. Test the Setup

Install the Supabase client:
```bash
npm install @supabase/supabase-js
```

Create a test file to verify connection:
```typescript
// test-db.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function testConnection() {
  const { data, error } = await supabase
    .from('contractors')
    .select('business_name')
    .limit(1)
    
  if (error) {
    console.error('Database connection failed:', error)
  } else {
    console.log('Database connected successfully!')
    console.log('Sample contractor:', data)
  }
}

testConnection()
```

## 📊 Database Overview

### Core Tables
- **users**: All user accounts (customers, contractors, admins)
- **contractors**: Contractor business profiles and settings
- **leads**: Customer project requests
- **lead_assignments**: Matches leads to contractors
- **reviews**: Customer feedback and ratings
- **credit_transactions**: Contractor credit purchases/usage

### Key Features
- ✅ **Row Level Security**: Data protection by user role
- ✅ **Automated Triggers**: Rating calculations, timestamps
- ✅ **Search Functions**: Find contractors by location/service
- ✅ **Credit System**: Automated lead pricing and payments
- ✅ **Notification System**: Built-in messaging
- ✅ **Analytics**: Dashboard stats and reporting

## 🔧 Advanced Configuration

### Authentication Setup
1. Go to **Authentication > Settings**
2. Configure **Site URL**: `http://localhost:3000` (dev) or your domain
3. Add **Redirect URLs** for production
4. Enable **Email confirmation** if desired

### Storage Setup (for images)
1. Go to **Storage**
2. Create bucket: `contractor-images`
3. Set policies for public read, authenticated write

### API Keys & Security
- **Anon Key**: Safe for frontend, has RLS restrictions
- **Service Role**: Full access, use only in backend/server
- Store service role key securely (never in frontend)

## 🚨 Troubleshooting

### Common Issues

**"relation does not exist" errors**
- Run the schema file first: `01-main-schema.sql`
- Check for typos in table/column names

**Permission denied errors**  
- RLS policies might be too restrictive
- Check user authentication status
- Verify user roles and permissions

**Function not found errors**
- Run the functions file: `03-functions-triggers.sql`
- Check function syntax and dependencies

**Connection issues**
- Verify environment variables
- Check Supabase project URL and keys
- Ensure project is not paused (free tier)

### Getting Help

1. **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
2. **SQL Reference**: [postgresql.org/docs](https://postgresql.org/docs)
3. **Community**: [supabase.com/community](https://supabase.com/community)

## 📈 Production Considerations

### Performance
- Database includes optimized indexes
- Consider upgrading Supabase plan for higher traffic
- Monitor query performance in dashboard

### Backups
- Supabase Pro+ includes automated backups
- Export schema regularly for version control
- Test backup restoration process

### Scaling
- Start with Supabase Pro ($25/month)
- Monitor connection limits and usage
- Consider read replicas for high traffic

### Security
- Regularly review RLS policies
- Use environment variables for all secrets
- Enable 2FA on Supabase account
- Monitor access logs

## 🎯 Next Steps

After database setup:

1. **Test the connection** with sample queries
2. **Set up authentication** (NextAuth.js or Supabase Auth)
3. **Implement lead assignment** system
4. **Add payment processing** (Stripe)
5. **Configure email/SMS** notifications
6. **Deploy to production** environment

Your InsulationPal database is now ready! 🎉
