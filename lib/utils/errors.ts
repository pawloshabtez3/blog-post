/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

/**
 * Validation error for invalid user input
 */
export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

/**
 * Authentication error for unauthorized access
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'AuthenticationError'
    Object.setPrototypeOf(this, AuthenticationError.prototype)
  }
}

/**
 * Authorization error for forbidden access
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'You do not have permission to perform this action') {
    super(message, 'AUTHORIZATION_ERROR', 403)
    this.name = 'AuthorizationError'
    Object.setPrototypeOf(this, AuthorizationError.prototype)
  }
}

/**
 * Not found error for missing resources
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

/**
 * Conflict error for duplicate resources
 */
export class ConflictError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 'CONFLICT_ERROR', 409)
    this.name = 'ConflictError'
    Object.setPrototypeOf(this, ConflictError.prototype)
  }
}

/**
 * External service error for third-party API failures
 */
export class ExternalServiceError extends AppError {
  constructor(service: string, message: string = 'Service temporarily unavailable') {
    super(`${service}: ${message}`, 'EXTERNAL_SERVICE_ERROR', 503)
    this.name = 'ExternalServiceError'
    Object.setPrototypeOf(this, ExternalServiceError.prototype)
  }
}

/**
 * Database error for database operation failures
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 'DATABASE_ERROR', 500)
    this.name = 'DatabaseError'
    Object.setPrototypeOf(this, DatabaseError.prototype)
  }
}

/**
 * Handles errors and returns user-friendly messages
 */
export function handleError(error: unknown): { message: string; code: string; statusCode: number } {
  // Handle known application errors
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    }
  }

  // Handle Supabase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const dbError = error as { code: string; message: string }
    
    // Unique constraint violation
    if (dbError.code === '23505') {
      return {
        message: 'A record with this value already exists',
        code: 'DUPLICATE_ERROR',
        statusCode: 409,
      }
    }
    
    // Foreign key violation
    if (dbError.code === '23503') {
      return {
        message: 'Referenced record does not exist',
        code: 'REFERENCE_ERROR',
        statusCode: 400,
      }
    }
    
    // Not null violation
    if (dbError.code === '23502') {
      return {
        message: 'Required field is missing',
        code: 'REQUIRED_FIELD_ERROR',
        statusCode: 400,
      }
    }
  }

  // Log unexpected errors
  console.error('Unexpected error:', error)

  // Return generic error for unknown errors
  return {
    message: 'An unexpected error occurred. Please try again later.',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
  }
}

/**
 * Formats validation errors for API responses
 */
export function formatValidationErrors(errors: Record<string, string>): {
  message: string
  code: string
  statusCode: number
  errors: Record<string, string>
} {
  return {
    message: 'Validation failed',
    code: 'VALIDATION_ERROR',
    statusCode: 400,
    errors,
  }
}

/**
 * Checks if an error is a specific type of AppError
 */
export function isErrorType(error: unknown, errorClass: typeof AppError): boolean {
  return error instanceof errorClass
}
