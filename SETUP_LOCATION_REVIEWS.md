# Quick Setup Guide: Location-Based Reviews

## Step 1: Run Database Migration

1. Open Supabase SQL Editor
2. Run the migration script:

```sql
-- Copy and paste contents from: database/37-add-customer-location-to-reviews.sql
```

This will:
- Add `customer_city` and `customer_state` columns to reviews table
- Create necessary indexes
- Attempt to populate existing reviews from the `location` field

## Step 2: Update City Pages

For each city page that needs location-based reviews, update the file:

### Example: Update Phoenix page

**File**: `app/arizona/phoenix-insulation-contractors/page.tsx`

#### 2.1. Add Import
```typescript
import { getCityReviews } from '@/lib/city-reviews'
```

#### 2.2. Replace Review Fetching Function
Replace the existing review fetching function with:

```typescript
// Fetch Phoenix customer reviews with intelligent fallback
async function getPhoenixReviews() {
  try {
    const result = await getCityReviews('Phoenix', 'AZ', 15)
    
    console.log(`✅ Fetched ${result.reviews.length} reviews for Phoenix from source: ${result.source}`)
    if (result.source === 'nearby') {
      console.log(`   Including reviews from: ${result.citiesIncluded.join(', ')}`)
    }
    
    return result.reviews
  } catch (error) {
    console.error('Error fetching Phoenix reviews:', error)
    return []
  }
}
```

#### 2.3. Update Review Display
In the reviews section, update to show customer location:

```typescript
<div className="text-xs text-gray-600 mt-auto">
  <div className="font-medium">{review.customer_name}</div>
  {review.customer_city && review.customer_state && (
    <div className="text-gray-500">
      {review.customer_city}, {review.customer_state}
    </div>
  )}
  <div className="text-[#0a4768]">{review.contractors.business_name}</div>
  <div>{new Date(review.created_at).toLocaleDateString()}</div>
  {review.service_type && (
    <div className="text-[#0a4768] mt-1 font-medium">
      {review.service_type}
    </div>
  )}
</div>
```

## Step 3: Test the Implementation

### 3.1. Test Review Submission
1. Navigate to `/review/[contractorId]`
2. Fill out the review form with:
   - Customer name and email
   - **City** (e.g., "Phoenix")
   - **State** (e.g., "AZ")
   - Rating and comment
3. Submit and verify in database

### 3.2. Test City Page Display
1. Navigate to a city page (e.g., `/arizona/phoenix-insulation-contractors`)
2. Check browser console for logs:
   ```
   ✅ Fetched 10 reviews for Phoenix from source: exact
   ```
   or
   ```
   ✅ Fetched 8 reviews for Phoenix from source: nearby
      Including reviews from: Scottsdale, Tempe, Mesa
   ```

### 3.3. Test Contractor Profile
1. Navigate to any contractor profile
2. Verify all reviews display (no filtering by location)
3. Verify customer city/state shows on each review

## Step 4: Add New Cities to Nearby Map (Optional)

If you have new cities, add them to `lib/nearby-cities.ts`:

```typescript
export const nearbyCitiesMap: Record<string, Record<string, string[]>> = {
  'AZ': {
    'newcity': ['nearby1', 'nearby2', 'nearby3'],
    // ... existing cities
  },
  // Add other states as needed
  'CA': {
    'losangeles': ['burbank', 'glendale', 'pasadena'],
    // ... more CA cities
  }
}
```

## Quick Copy-Paste Templates

### Template for City Review Function
```typescript
// Fetch [CITY] customer reviews with intelligent fallback
async function get[CITY]Reviews() {
  try {
    const result = await getCityReviews('[CITY]', '[STATE]', 15)
    
    console.log(`✅ Fetched ${result.reviews.length} reviews for [CITY] from source: ${result.source}`)
    if (result.source === 'nearby') {
      console.log(`   Including reviews from: ${result.citiesIncluded.join(', ')}`)
    }
    
    return result.reviews
  } catch (error) {
    console.error('Error fetching [CITY] reviews:', error)
    return []
  }
}
```

### Template for Review Display with Location
```typescript
<div className="text-xs text-gray-600 mt-auto">
  <div className="font-medium">{review.customer_name}</div>
  {review.customer_city && review.customer_state && (
    <div className="text-gray-500">
      {review.customer_city}, {review.customer_state}
    </div>
  )}
  <div className="text-[#0a4768]">{review.contractors.business_name}</div>
  <div>{new Date(review.created_at).toLocaleDateString()}</div>
  {review.service_type && (
    <div className="text-[#0a4768] mt-1 font-medium">
      {review.service_type}
    </div>
  )}
</div>
```

## Verification Checklist

- [ ] Database migration completed
- [ ] `customer_city` and `customer_state` columns exist in reviews table
- [ ] Indexes created successfully
- [ ] Review form captures city and state separately
- [ ] City pages use `getCityReviews()` function
- [ ] Contractor profiles use `getContractorReviews()` function
- [ ] Customer location displays on reviews
- [ ] Tested review submission with location data
- [ ] Tested city page review display
- [ ] Tested fallback logic (check console logs)
- [ ] Verified contractor profile shows all reviews

## Common Issues

### Issue: "Column customer_city does not exist"
**Solution**: Run the database migration script in Supabase SQL Editor

### Issue: Reviews not showing customer city
**Solution**: 
1. Check if new reviews are capturing city/state properly
2. For old reviews, run the update script to extract from `location` field
3. Verify the review submission is using the updated form/API

### Issue: No reviews showing on city page
**Solution**:
1. Check if reviews have `verified: true`
2. Verify `customer_city` and `customer_state` are populated
3. Check console logs for fallback behavior
4. Ensure city name normalization matches (lowercase, no extra spaces)

## Support Files Reference

- **Database Schema**: `database/01-main-schema.sql`
- **Migration Script**: `database/37-add-customer-location-to-reviews.sql`
- **City Reviews Utility**: `lib/city-reviews.ts`
- **Nearby Cities Map**: `lib/nearby-cities.ts`
- **Review Form**: `app/review/[contractorId]/ReviewForm.tsx`
- **Review API**: `app/api/submit-review/route.ts`
- **Example City Page**: `app/arizona/peoria-insulation-contractors/page.tsx`
- **Example Contractor Page**: `app/contractor/[slug]/page.tsx`

## Next Steps

1. Apply the same pattern to all other city pages
2. Consider adding more states to the nearby cities map
3. Test thoroughly with real customer data
4. Monitor performance and add caching if needed
5. Consider adding review request automation based on customer location

