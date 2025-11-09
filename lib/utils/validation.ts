import { isValidSlug } from './slugify'

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export interface FieldValidation {
  isValid: boolean
  error: string | null
}

/**
 * Validates post title
 * @param title - The title to validate
 * @returns Validation error message or null if valid
 */
export function validateTitle(title: string): string | null {
  if (!title || title.trim().length === 0) {
    return 'Title is required'
  }
  
  if (title.length > 200) {
    return 'Title must be 200 characters or less'
  }
  
  return null
}

/**
 * Validates post slug
 * @param slug - The slug to validate
 * @returns Validation error message or null if valid
 */
export function validateSlug(slug: string): string | null {
  if (!slug || slug.trim().length === 0) {
    return 'Slug is required'
  }
  
  if (!isValidSlug(slug)) {
    return 'Slug must contain only lowercase letters, numbers, and hyphens'
  }
  
  return null
}

/**
 * Validates post content
 * @param content - The content to validate
 * @returns Validation error message or null if valid
 */
export function validateContent(content: string | null): string | null {
  // Content is optional, but if provided should not exceed reasonable length
  if (content && content.length > 100000) {
    return 'Content must be 100,000 characters or less'
  }
  
  return null
}

/**
 * Validates all post inputs
 * @param title - The post title
 * @param slug - The post slug
 * @param content - The post content
 * @returns Validation result with errors
 */
export function validatePostInputs(
  title: string,
  slug: string,
  content: string | null
): ValidationResult {
  const errors: Record<string, string> = {}
  
  const titleError = validateTitle(title)
  if (titleError) {
    errors.title = titleError
  }
  
  const slugError = validateSlug(slug)
  if (slugError) {
    errors.slug = slugError
  }
  
  const contentError = validateContent(content)
  if (contentError) {
    errors.content = contentError
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Real-time field validation for client-side forms
 * @param field - The field name
 * @param value - The field value
 * @returns Field validation result
 */
export function validateField(field: string, value: string | null): FieldValidation {
  let error: string | null = null

  switch (field) {
    case 'title':
      error = validateTitle(value || '')
      break
    case 'slug':
      error = validateSlug(value || '')
      break
    case 'content':
      error = validateContent(value)
      break
    default:
      error = null
  }

  return {
    isValid: error === null,
    error,
  }
}

/**
 * Validates email format
 * @param email - The email to validate
 * @returns Validation error message or null if valid
 */
export function validateEmail(email: string): string | null {
  if (!email || email.trim().length === 0) {
    return 'Email is required'
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    return 'Please enter a valid email address'
  }

  return null
}

/**
 * Validates password strength
 * @param password - The password to validate
 * @returns Validation error message or null if valid
 */
export function validatePassword(password: string): string | null {
  if (!password || password.length === 0) {
    return 'Password is required'
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters long'
  }

  return null
}
