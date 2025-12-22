# City-Specific Project Gallery Implementation

## Overview

This document describes the implementation of location-based project filtering for InsulationPal. Project images are now displayed based on where the **customer lives**, making each city page unique with locally relevant projects.

## Key Features

### 1. **Customer Location Tracking**
- Projects now store the customer's city and state separately (`customer_city` and `customer_state`)
- Links to the original `lead_assignment_id` for traceability
- Separate from `project_city`/`project_state` (where work was done)

### 2. **Detailed Project Information**
Projects now include:
- **Areas Insulated**: Array of locations (attic, walls, basement, crawl space, etc.)
- **Insulation Types**: Array of materials used (spray foam, fiberglass, cellulose, etc.)
- **Customer Location**: City and state where the customer lives
- **Project Location**: City and state where work was completed
- **Contractor Info**: Who completed the project

### 3. **City Page Display Logic**
Projects on city pages follow this priority:
1. **Exact Match**: Shows projects from customers living in that specific city
2. **Nearby Cities**: If fewer than 5 projects, includes nearby cities in the same state
3. **State Fallback**: If still no projects, shows projects from anywhere in the state

### 4. **Contractor Profile Display**
- Contractor profile pages show **all their projects** regardless of customer location
- Displays full project details including customer city/state

### 5. **Intelligent Fallback Logic**
The system uses a nearby cities map for geographical proximity:
```typescript
'peoria': ['glendale', 'phoenix', 'surprise', 'goodyear']
```

## Database Changes

### New Columns in `contractor_portfolio` Table
```sql
-- Run: database/38-add-customer-location-to-portfolio.sql

lead_assignment_id UUID           -- Links to original lead
customer_city VARCHAR(100)         -- Customer's city
customer_state VARCHAR(50)         -- Customer's state
areas_insulated TEXT[]             -- ['attic', 'walls', 'basement']
insulation_types TEXT[]            -- ['spray_foam', 'fiberglass']
```

### Migration Script
Run the migration script to add the new columns and indexes:
```bash
# In Supabase SQL Editor, run:
database/38-add-customer-location-to-portfolio.sql
```

This migration:
- Adds customer location fields
- Adds `lead_assignment_id` reference
- Creates arrays for areas and insulation types
- Creates indexes for performance

## Implementation Files

### 1. **Utility Functions**

#### `lib/city-projects.ts`
Provides project fetching functions:
- `getCityProjects(city, state, limit)` - Fetches projects with intelligent fallback
- `getContractorProjects(contractorId, limit)` - Fetches all projects for a contractor
- `formatAreasInsulated(areas)` - Formats areas for display
- `formatInsulationTypes(types)` - Formats insulation types for display

### 2. **Project Upload**

#### `components/dashboard/ProjectImageUpload.tsx`
Enhanced to capture:
- `lead_assignment_id` - Links to the originating lead
- `customer_city` and `customer_state` - From the lead data
- `areas_insulated` - All areas where insulation was added
- `insulation_types` - All insulation materials used

#### `components/dashboard/ImageUploadManager.tsx`
Updated for manually added projects:
- Includes `areas_insulated` and `insulation_types` arrays
- Sets `customer_city`/`customer_state` same as `project_city`/`project_state`
- Properly tracks all project details

### 3. **Display Pages**

#### City Pages (e.g., `app/arizona/peoria-insulation-contractors/page.tsx`)
Now use:
```typescript
import { getCityProjects, formatAreasInsulated, formatInsulationTypes } from '@/lib/city-projects'

const projects = await getCityProjects('Peoria', 'AZ', 12)
```

Display includes:
- Project image
- Areas insulated (formatted)
- Insulation types used (formatted)
- Customer city and state
- Contractor name

#### Contractor Profiles (`app/contractor/[slug]/page.tsx`)
Shows all contractor projects regardless of location

## Usage Examples

### For City Pages

```typescript
// Fetch projects for a city page
const result = await getCityProjects('Peoria', 'AZ', 12)

// Check what source was used
if (result.source === 'exact') {
  console.log('Showing projects from Peoria customers')
} else if (result.source === 'nearby') {
  console.log(`Showing projects from: ${result.citiesIncluded.join(', ')}`)
} else {
  console.log('Showing projects from all AZ customers')
}

// Display project details
{projects.map(project => (
  <div key={project.id}>
    <h3>{project.title}</h3>
    <p>Areas: {formatAreasInsulated(project.areas_insulated)}</p>
    <p>Insulation: {formatInsulationTypes(project.insulation_types)}</p>
    <p>Customer: {project.customer_city}, {project.customer_state}</p>
    <p>By: {project.contractors.business_name}</p>
  </div>
))}
```

### Project Upload (Automatic from Completed Lead)

When a contractor uploads project images after completing a job:
```typescript
// From ProjectImageUpload.tsx
{
  contractor_id: contractorId,
  lead_assignment_id: leadAssignmentId, // Links to the lead
  areas_insulated: projectDetails.areasNeeded, // ['attic', 'walls']
  insulation_types: projectDetails.insulationTypes, // ['spray_foam']
  customer_city: projectDetails.city, // Customer's city
  customer_state: projectDetails.state, // Customer's state
  project_city: projectDetails.city, // Where work was done
  project_state: projectDetails.state
}
```

### Manual Project Upload

When a contractor manually adds a project:
```typescript
// From ImageUploadManager.tsx
{
  contractor_id: contractorId,
  lead_assignment_id: null, // No lead for manual uploads
  areas_insulated: formData.areas_insulated || [formData.service_type],
  insulation_types: formData.insulation_types,
  customer_city: formData.project_city, // Assumed same
  customer_state: formData.project_state,
  project_city: formData.project_city,
  project_state: formData.project_state
}
```

## Displaying Project Details

### Project Card Template

```typescript
<Card>
  <div className="relative h-48">
    <Image src={project.after_image_url} alt={project.title} fill />
  </div>
  <CardContent className="p-4">
    <h3 className="font-semibold text-[#0a4768] mb-2 text-sm line-clamp-2">
      {project.title}
    </h3>
    <div className="space-y-1 text-xs text-gray-600">
      {/* Areas where insulation was added */}
      {project.areas_insulated && project.areas_insulated.length > 0 && (
        <div>
          <span className="font-medium">Areas:</span>{' '}
          {formatAreasInsulated(project.areas_insulated)}
        </div>
      )}
      
      {/* Types of insulation used */}
      {project.insulation_types && project.insulation_types.length > 0 && (
        <div>
          <span className="font-medium">Insulation:</span>{' '}
          {formatInsulationTypes(project.insulation_types)}
        </div>
      )}
      
      {/* Customer location */}
      {project.customer_city && project.customer_state && (
        <div>
          <span className="font-medium">Customer:</span>{' '}
          {project.customer_city}, {project.customer_state}
        </div>
      )}
      
      {/* Contractor name */}
      <div>
        <span className="font-medium">By:</span>{' '}
        {project.contractors.business_name}
      </div>
    </div>
  </CardContent>
</Card>
```

## Applying to Other City Pages

To update other city pages (Phoenix, Mesa, etc.):

### 1. Update the imports
```typescript
import { getCityProjects, formatAreasInsulated, formatInsulationTypes } from '@/lib/city-projects'
```

### 2. Replace the project fetching function
```typescript
// Replace existing getCityRecentProjects() with:
async function getCityRecentProjects() {
  try {
    const result = await getCityProjects('CityName', 'STATE', 12)
    
    console.log(`✅ Fetched ${result.projects.length} projects for CityName from source: ${result.source}`)
    if (result.source === 'nearby') {
      console.log(`   Including projects from: ${result.citiesIncluded.join(', ')}`)
    }
    
    return result.projects
  } catch (error) {
    console.error('Error fetching CityName projects:', error)
    return []
  }
}
```

### 3. Update the project display section
Use the project card template above to display:
- Areas insulated (formatted)
- Insulation types (formatted)
- Customer city and state
- Contractor name

## Benefits

1. **Unique City Content**: Each city page shows projects from local customers
2. **Better SEO**: Location-specific content improves local search rankings
3. **Social Proof**: Customers see projects from their area
4. **Transparency**: Clear information about what was done and where
5. **Graceful Degradation**: Fallback logic ensures pages always have content
6. **Contractor Showcase**: Full project portfolios on contractor profiles

## Testing

### Manual Testing Steps

1. **Upload a project with complete details**
   - Complete a lead and upload project images
   - Verify customer location is captured
   - Check that areas and insulation types are stored

2. **Verify city page display**
   - Navigate to the customer's city page
   - Verify the project appears
   - Check that all details display correctly

3. **Test fallback logic**
   - For a city with no projects, verify it shows nearby city projects
   - Check console logs to see which fallback level was used

4. **Verify contractor profile**
   - Navigate to the contractor profile
   - Verify all projects display (no filtering by location)
   - Check that customer location shows on each project

## Troubleshooting

### Projects not showing on city page
1. Check if `customer_city` and `customer_state` are populated
2. Verify city name normalization (lowercase, trimmed)
3. Check console logs for fallback behavior
4. Ensure project has an `after_image_url`

### Missing project details
Run the migration script to add new columns:
```sql
-- Run in Supabase SQL Editor
database/38-add-customer-location-to-portfolio.sql
```

### Existing projects missing data
For projects uploaded before this feature:
- They may not have `customer_city`/`customer_state`
- They will fall back to `project_city`/`project_state`
- Consider asking contractors to re-upload or manually update

## Future Enhancements

Potential improvements:
- Add distance calculation for more precise proximity
- Allow filtering projects by insulation type on city pages
- Show before/after image comparisons
- Add project cost ranges (optional)
- Implement project request forms for customers
- Add project density heatmaps for service areas

## Support Files Reference

- **Database Schema**: `database/01-main-schema.sql`
- **Migration Script**: `database/38-add-customer-location-to-portfolio.sql`
- **City Projects Utility**: `lib/city-projects.ts`
- **Nearby Cities Map**: `lib/nearby-cities.ts`
- **Project Upload**: `components/dashboard/ProjectImageUpload.tsx`
- **Manual Upload**: `components/dashboard/ImageUploadManager.tsx`
- **Example City Page**: `app/arizona/peoria-insulation-contractors/page.tsx`
- **Example Contractor Page**: `app/contractor/[slug]/page.tsx`

