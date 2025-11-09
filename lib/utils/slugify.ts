/**
 * Converts a string to a URL-friendly slug
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace & with 'and'
    .replace(/&/g, 'and')
    // Remove special characters
    .replace(/[^\w\s-]/g, '')
    // Replace whitespace and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Replace multiple consecutive hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '')
}

/**
 * Validates if a slug is in the correct format
 * @param slug - The slug to validate
 * @returns True if the slug is valid, false otherwise
 */
export function isValidSlug(slug: string): boolean {
  // Slug should only contain lowercase letters, numbers, and hyphens
  // Should not start or end with a hyphen
  // Should not contain consecutive hyphens
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugPattern.test(slug) && slug.length > 0 && slug.length <= 200
}

/**
 * Generates a slug from a title
 * @param title - The title to generate a slug from
 * @returns A URL-friendly slug
 */
export function generateSlugFromTitle(title: string): string {
  const slug = slugify(title)
  
  if (!slug) {
    // If slugify returns empty string, generate a random slug
    return `post-${Date.now()}`
  }
  
  return slug
}
