import { Post } from '@/lib/types/database'
import PostCard from './PostCard'

interface PostListProps {
  posts: Post[]
}

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <div className="text-5xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No posts yet
        </h3>
        <p className="text-gray-600">
          Check back soon for new content!
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
