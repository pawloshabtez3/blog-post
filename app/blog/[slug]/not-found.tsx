import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Post Not Found
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            The post you're looking for doesn't exist or is not published yet.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              View All Posts
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
