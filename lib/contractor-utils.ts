/**
 * Utility functions for contractor-related operations
 */

/**
 * Get the contractor logo URL, with fallback to default placeholder
 * @param profileImage - The contractor's profile image URL from database
 * @returns The logo URL to display
 */
export function getContractorLogo(profileImage?: string | null): string {
  // If contractor has a profile image, use it
  if (profileImage && profileImage.trim() !== '') {
    return profileImage
  }
  
  // Otherwise, use the default placeholder logo
  return '/insulation-pal-logo.png'
}

/**
 * Check if a contractor is using the default placeholder logo
 * @param profileImage - The contractor's profile image URL from database
 * @returns True if using placeholder, false if has custom logo
 */
export function isUsingPlaceholderLogo(profileImage?: string | null): boolean {
  return !profileImage || profileImage.trim() === '' || profileImage === '/insulation-pal-logo.png'
}
