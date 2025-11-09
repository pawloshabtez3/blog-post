import { createClient } from '@/lib/supabase/server'
import PostList from '@/components/blog/PostList'
import Navigation from '@/components/Navigation'
import { Post } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const supabase = await createClient()
  
  // Fetch published posts ordered by creation date (newest first)
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Blog
            </h1>
            <p className="text-lg text-gray-600">
              Discover stories, insights, and ideas from our community
            </p>
          </div>
          
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">Unable to load posts</p>
            <p className="text-sm mt-1">
              We're having trouble loading the blog posts. Please try again later.
            </p>
          </div>
        </main>
      </div>
    )
  }

  const publishedPosts: Post[] = posts || []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Blog
          </h1>
          <p className="text-lg text-gray-600">
            Discover stories, insights, and ideas from our community
          </p>
        </div>
        
        <PostList posts={publishedPosts} />
      </main>
    </div>
  )
}
