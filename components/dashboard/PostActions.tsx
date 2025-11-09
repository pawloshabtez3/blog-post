'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Post } from '@/lib/types/database'
import { deletePost, updatePostStatus } from '@/lib/actions/posts'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface PostActionsProps {
  post: Post
  onUpdate?: () => void
}

export default function PostActions({ post, onUpdate }: PostActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEdit = () => {
    router.push(`/dashboard/edit/${post.id}`)
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    setError(null)

    const result = await deletePost(post.id)

    if (result.success) {
      setShowDeleteDialog(false)
      if (onUpdate) {
        onUpdate()
      } else {
        router.refresh()
      }
    } else {
      setError(result.error || 'Failed to delete post')
      setIsDeleting(false)
    }
  }

  const handleToggleStatus = async () => {
    setIsUpdatingStatus(true)
    setError(null)

    const newStatus = post.status === 'published' ? 'draft' : 'published'
    const result = await updatePostStatus(post.id, newStatus)

    if (result.success) {
      if (onUpdate) {
        onUpdate()
      } else {
        router.refresh()
      }
    } else {
      setError(result.error || 'Failed to update post status')
    }
    
    setIsUpdatingStatus(false)
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="text-sm text-red-600 mb-2">
          {error}
        </div>
      )}
      
      <div className="flex gap-2">
        <button
          onClick={handleEdit}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          Edit
        </button>
        
        <button
          onClick={handleToggleStatus}
          disabled={isUpdatingStatus}
          className={`px-3 py-1 text-sm rounded focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${
            post.status === 'published'
              ? 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500'
              : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
          }`}
        >
          {isUpdatingStatus
            ? 'Updating...'
            : post.status === 'published'
            ? 'Unpublish'
            : 'Publish'}
        </button>
        
        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
        isDestructive
      />
    </div>
  )
}
