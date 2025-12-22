# Location-Based Reviews Implementation

## Overview

This document describes the implementation of location-based review filtering for InsulationPal. Reviews are now displayed based on where the **customer lives**, not where the contractor is based.

## Key Features

### 1. **Customer Location Tracking**
- Reviews now store the customer's city and state separately (`customer_city` and `customer_state`)
- This allows precise filtering of reviews by customer location
- The `location` field is kept for backward compatibility

### 2. **City Page Review Display**
Reviews on city pages (e.g., Peoria, AZ) follow this priority:
1. **Exact Match**: Shows reviews from customers living in that specific city
2. **Nearby Cities**: If fewer than 5 reviews, includes reviews from nearby cities in the same state
3. **State Fallback**: If still no reviews, shows reviews from anywhere in the state

### 3. **Contractor Profile Review Display**
- Contractor profile pages show **all verified reviews** for that contractor
- No location filtering - displays reviews from all customer locations
- Shows customer city/state on each review

### 4. **Intelligent Fallback Logic**
The system uses a nearby cities map that defines geographical proximity:
```typescript
'peoria': ['glendale', 'phoenix', 'surprise', 'goodyear']
```

## Database Changes

### New Columns in `reviews` Table
```sql
-- Added in database/37-add-customer-location-to-reviews.sql
customer_city VARCHAR(100)      -- Customer's city (e.g., "Peoria")
customer_state VARCHAR(50)      -- Customer's state (e.g., "AZ")
```

### Migration Script
Run the migration script to add the new columns and indexes:
```bash
# In Supabase SQL Editor, run:
database/37-add-customer-location-to-reviews.sql
```

This migration:
- Adds `customer_city` and `customer_state` columns
- Creates indexes for performance
- Attempts to populate existing reviews by parsing the `location` field

## Implementation Files

### 1. **Utility Functions**

#### `lib/nearby-cities.ts`
Defines nearby city mappings and provides functions:
- `getNearbyCities(city, state)` - Returns nearby cities in order of proximity
- `getAllCitiesInState(state)` - Returns all cities in a state
- `normalizeCityName(city)` - Normalizes city names for comparison

#### `lib/city-reviews.ts`
Provides review fetching functions:
- `getCityReviews(city, state, limit)` - Fetches reviews with intelligent fallback
- `getContractorReviews(contractorId, limit)` - Fetches all reviews for a contractor

### 2. **Review Submission**

#### `app/review/[contractorId]/ReviewForm.tsx`
Updated to capture:
- Separate city and state fields (required)
- Automatically formats location string for backward compatibility

#### `app/api/submit-review/route.ts`
Enhanced to:
- Extract customer location from the lead when available
- Store `customer_city` and `customer_state` separately
- Maintain backward compatibility with `location` field

### 3. **Display Pages**

#### City Pages (e.g., `app/arizona/peoria-insulation-contractors/page.tsx`)
Now use:
```typescript
import { getCityReviews } from '@/lib/city-reviews'

const result = await getCityReviews('Peoria', 'AZ', 15)
// result.reviews - Array of reviews
// result.source - 'exact', 'nearby', or 'state'
// result.citiesIncluded - List of cities included
```

#### Contractor Profiles (`app/contractor/[slug]/page.tsx`)
Now use:
```typescript
import { getContractorReviews } from '@/lib/city-reviews'

const reviews = await getContractorReviews(contractorId, 50)
// Returns all verified reviews for the contractor
```

### 4. **TypeScript Types**

Updated `lib/database.types.ts` to include:
- `customer_city: string | null`
- `customer_state: string | null`
- All other review fields

## Usage Examples

### For City Pages

```typescript
// Fetch reviews for a city page
const { reviews, source, citiesIncluded } = await getCityReviews('Peoria', 'AZ', 15)

// Check what source was used
if (source === 'exact') {
  console.log('Showing reviews from Peoria customers')
} else if (source === 'nearby') {
  console.log(`Showing reviews from: ${citiesIncluded.join(', ')}`)
} else {
  console.log('Showing reviews from all AZ customers')
}
```

### For Contractor Profiles

```typescript
// Fetch all reviews for a contractor
const reviews = await getContractorReviews(contractorId)

// Display with customer location
reviews.map(review => ({
  customerName: review.customer_name,
  location: `${review.customer_city}, ${review.customer_state}`,
  rating: review.rating,
  comment: review.comment
}))
```

## Adding New Cities

To add a new city or update nearby city mappings:

1. Edit `lib/nearby-cities.ts`
2. Add the city to the appropriate state in `nearbyCitiesMap`
3. Define nearby cities in order of proximity

Example:
```typescript
'AZ': {
  'newcity': ['closecity', 'mediumcity', 'farcity'],
  // ... other cities
}
```

## Testing

### Manual Testing Steps

1. **Create a review with customer location**
   - Navigate to `/review/[contractorId]`
   - Fill in customer city and state
   - Submit review

2. **Verify city page display**
   - Navigate to a city page (e.g., `/arizona/peoria-insulation-contractors`)
   - Check that reviews from customers in that city appear
   - Check console logs for fallback behavior

3. **Verify contractor profile**
   - Navigate to a contractor profile
   - Verify all reviews display regardless of customer location
   - Check that customer city/state shows on each review

4. **Test fallback logic**
   - For a city with no reviews, verify it shows nearby city reviews
   - Check console logs to see which fallback level was used

## Benefits

1. **Relevant Social Proof**: Customers see reviews from people in their area
2. **Better SEO**: Location-specific content improves local search rankings
3. **Trust Building**: Reviews from nearby customers are more relatable
4. **Graceful Degradation**: Fallback logic ensures pages always have content
5. **Contractor Transparency**: Contractor profiles show all reviews fairly

## Future Enhancements

Potential improvements:
- Add distance calculation for more precise proximity
- Allow customers to filter reviews by city on contractor profiles
- Show review source indicator (e.g., "Review from nearby Phoenix")
- Add review density heatmaps for service areas
- Implement review request automation based on customer location

## Troubleshooting

### Reviews not showing on city page
1. Check if `customer_city` and `customer_state` are populated in the database
2. Verify city name normalization (lowercase, trimmed)
3. Check console logs for fallback behavior
4. Ensure reviews are marked as `verified: true`

### Existing reviews missing customer location
Run the migration script to populate existing reviews:
```sql
-- Run in Supabase SQL Editor
UPDATE reviews 
SET 
  customer_city = TRIM(SPLIT_PART(location, ',', 1)),
  customer_state = TRIM(SPLIT_PART(location, ',', 2))
WHERE customer_city IS NULL AND location IS NOT NULL;
```

### Performance issues
The implementation includes indexes on:
- `customer_city`
- `customer_state`
- Combined `(customer_city, customer_state)`
- `verified` status

If queries are still slow, consider:
- Adding materialized views for frequently accessed city pages
- Implementing caching at the application level
- Using database query optimization tools

## Support

For questions or issues with this implementation, please refer to:
- Database schema: `database/01-main-schema.sql`
- Migration: `database/37-add-customer-location-to-reviews.sql`
- Utility functions: `lib/city-reviews.ts` and `lib/nearby-cities.ts`

