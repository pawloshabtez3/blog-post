import Navigation from '@/components/Navigation'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">Inkflow</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create, manage, and publish beautiful blog posts with the power of AI assistance.
            Write better, faster, and smarter.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Get Started
            </Link>
            <Link
              href="/blog"
              className="bg-white text-gray-700 px-8 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-lg font-medium"
            >
              View Blog
            </Link>
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-3xl mb-3">✍️</div>
              <h3 className="text-lg font-semibold mb-2">Write with Ease</h3>
              <p className="text-gray-600">
                Markdown editor with real-time preview and formatting
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-600">
                Enhance your writing with Google Gemini AI assistance
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-semibold mb-2">Manage Posts</h3>
              <p className="text-gray-600">
                Dashboard to create, edit, and publish your content
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
