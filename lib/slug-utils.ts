// Utility functions for generating and handling SEO-friendly slugs

/**
 * Generates a URL-friendly slug from a business name
 * @param businessName - The business name to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^a-z0-9-]/g, '')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
}

/**
 * Generates a unique slug by appending the contractor ID if needed
 * @param businessName - The business name to convert to a slug
 * @param contractorId - The contractor ID to ensure uniqueness
 * @returns A unique URL-friendly slug
 */
export function generateUniqueSlug(businessName: string, contractorId: string): string {
  const baseSlug = generateSlug(businessName)
  // Take first 8 characters of ID for uniqueness while keeping URLs readable
  const shortId = contractorId.substring(0, 8)
  return `${baseSlug}-${shortId}`
}

/**
 * Extracts contractor ID from a unique slug
 * @param slug - The slug to extract ID from
 * @returns The contractor ID or null if not found
 */
export function extractIdFromSlug(slug: string): string | null {
  // Slug format: "business-name-shortid"
  const parts = slug.split('-')
  if (parts.length < 2) return null
  
  // The last part should be the short ID (8 characters)
  const lastPart = parts[parts.length - 1]
  if (lastPart.length === 8) {
    return lastPart
  }
  
  return null
}

/**
 * For development: creates a mapping of contractor ID to slug
 * This could be stored in database in production for better performance
 */
export async function getContractorSlugMapping() {
  // This is a placeholder - in production you might want to:
  // 1. Store slugs in the database
  // 2. Create a dedicated slugs table
  // 3. Cache this mapping in Redis
  return new Map<string, string>()
}
