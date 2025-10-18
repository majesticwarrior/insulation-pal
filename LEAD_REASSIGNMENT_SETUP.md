# Lead Reassignment System Setup

## Overview
The lead reassignment system ensures customers always receive multiple quotes by automatically reassigning expired leads to new contractors.

## Key Features
- **24-hour response deadline** (reduced from 48 hours)
- **Automatic reassignment** of expired leads
- **Ensures minimum 3 quotes** per customer
- **Excludes already assigned contractors** from reassignment
- **Maintains contractor credit system**

## API Endpoints

### Check and Reassign Expired Leads
```bash
POST /api/lead-reassignment
```
Triggers the reassignment process for expired leads.

### Get Assignment Statistics
```bash
GET /api/lead-reassignment
```
Returns current statistics about lead assignments.

## Admin Dashboard
Access the lead reassignment management at:
```
/admin-dashboard/lead-reassignment
```

## Cron Job Setup

### Option 1: Vercel Cron Jobs (Recommended for Vercel deployment)
Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/lead-reassignment",
      "schedule": "0 */6 * * *"
    }
  ]
}
```
This runs every 6 hours.

### Option 2: External Cron Service
Use services like:
- **Cron-job.org**: https://cron-job.org/
- **EasyCron**: https://www.easycron.com/
- **SetCronJob**: https://www.setcronjob.com/

Set up a cron job to call:
```
https://yourdomain.com/api/lead-reassignment
```

Recommended schedule: Every 6 hours (`0 */6 * * *`)

### Option 3: GitHub Actions (for development/testing)
Create `.github/workflows/lead-reassignment.yml`:
```yaml
name: Lead Reassignment Check
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:  # Manual trigger

jobs:
  reassign:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Reassignment
        run: |
          curl -X POST https://yourdomain.com/api/lead-reassignment
```

## Manual Testing

### Test the API Endpoint
```bash
# Check current statistics
curl https://yourdomain.com/api/lead-reassignment

# Trigger reassignment check
curl -X POST https://yourdomain.com/api/lead-reassignment
```

### Test via Admin Dashboard
1. Navigate to `/admin-dashboard/lead-reassignment`
2. Click "Check & Reassign Expired Leads"
3. View statistics and results

## Database Schema Requirements

The system uses the existing `lead_assignments` table with these key fields:
- `assigned_at`: When the assignment was created
- `response_deadline`: 24-hour deadline for contractor response
- `responded_at`: When contractor responded (if they did)
- `status`: 'pending', 'accepted', 'declined', 'expired'

## How It Works

1. **Initial Assignment**: When a customer submits a quote request, 3 contractors are randomly assigned with a 24-hour response deadline.

2. **Monitoring**: The system checks for assignments where:
   - Status is 'pending'
   - Current time > response_deadline

3. **Reassignment**: For expired assignments:
   - Mark assignment as 'expired'
   - Count active assignments for the lead
   - If less than 3 active assignments, find new contractors
   - Exclude contractors already assigned to the same lead
   - Create new assignments with 24-hour deadline
   - Notify new contractors

4. **Credit Management**: Credits are deducted when assignments are created (both initial and reassigned).

## Monitoring

The admin dashboard provides:
- Total assignments count
- Pending assignments count
- Accepted assignments count
- Expired assignments count
- Last check timestamp

## Troubleshooting

### Common Issues
1. **No contractors available**: Check contractor service areas and credit availability
2. **API errors**: Check Supabase connection and RLS policies
3. **Email/SMS failures**: Check email service configuration

### Debugging
- Check browser console for errors
- Review server logs for API calls
- Verify Supabase RLS policies allow the operations

## Security Considerations

- The API endpoint should be protected or rate-limited
- Consider adding authentication for manual triggers
- Monitor for abuse of the reassignment system
