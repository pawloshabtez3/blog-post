import Link from 'next/link'
import { Post } from '@/lib/types/database'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Extract first paragraph or first 150 characters as preview
  const getPreview = (content: string | null) => {
    if (!content) return 'No content available'
    
    const firstParagraph = content.split('\n\n')[0]
    const preview = firstParagraph.length > 150 
      ? firstParagraph.substring(0, 150) + '...'
      : firstParagraph
    
    // Remove markdown formatting for preview
    return preview.replace(/[#*_`]/g, '')
  }

  return (
    <article className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <Link href={`/blog/${post.slug}`} className="block p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
          {post.title}
        </h2>
        
        <time className="text-sm text-gray-500 mb-4 block">
          {formatDate(post.created_at)}
        </time>
        
        <p className="text-gray-600 line-clamp-3">
          {getPreview(post.content)}
        </p>
        
        <div className="mt-4 text-blue-600 font-medium hover:text-blue-700">
          Read more →
        </div>
      </Link>
    </article>
  )
}
