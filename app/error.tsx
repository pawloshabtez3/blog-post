'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          
          <h2 className="mt-6 text-2xl font-bold text-gray-900 text-center">
            Something went wrong
          </h2>
          
          <p className="mt-4 text-gray-600 text-center">
            We encountered an unexpected error. This has been logged and we'll look into it.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-xs font-semibold text-gray-700 mb-2">
                Error details (development only):
              </p>
              <p className="text-xs text-gray-600 break-words">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={reset}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
