import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import PostContent from '@/components/blog/PostContent'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  // Fetch post by slug with published status check
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  // Handle non-existent or draft posts with 404
  if (error || !post) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to blog link */}
        <Link 
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Back to Blog
        </Link>

        {/* Post header */}
        <article className="bg-white rounded-lg shadow-sm border p-8 md:p-12">
          <header className="mb-8 border-b pb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <time className="text-gray-500">
              Published on {formatDate(post.created_at)}
            </time>
          </header>

          {/* Post content */}
          <div className="mt-8">
            {post.content ? (
              <PostContent content={post.content} />
            ) : (
              <p className="text-gray-500 italic">No content available</p>
            )}
          </div>
        </article>
      </main>
    </div>
  )
}
