import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-9xl font-bold text-gray-200">404</h1>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              Page Not Found
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-md">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Go Home
              </Link>
              <Link
                href="/blog"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                View Blog
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
