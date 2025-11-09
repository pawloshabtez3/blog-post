'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MarkdownEditor from '@/components/editor/MarkdownEditor'
import { createPost, generateSlug } from '@/lib/actions/posts'
import { validateField } from '@/lib/utils/validation'

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !isSlugManuallyEdited) {
      generateSlug(title).then((result) => {
        if (result.success && result.data) {
          setSlug(result.data)
        }
      })
    }
  }, [title, isSlugManuallyEdited])

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = e.target.value
    setSlug(newSlug)
    setIsSlugManuallyEdited(true)
    
    // Clear slug error on change
    if (errors.slug) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.slug
        return newErrors
      })
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    
    // Clear title error on change
    if (errors.title) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.title
        return newErrors
      })
    }
  }

  const handleTitleBlur = () => {
    const validation = validateField('title', title)
    if (!validation.isValid && validation.error) {
      setErrors((prev) => ({ ...prev, title: validation.error! }))
    }
  }

  const handleSlugBlur = () => {
    const validation = validateField('slug', slug)
    if (!validation.isValid && validation.error) {
      setErrors((prev) => ({ ...prev, slug: validation.error! }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Client-side validation
    const titleValidation = validateField('title', title)
    const slugValidation = validateField('slug', slug)
    const contentValidation = validateField('content', content)

    const validationErrors: Record<string, string> = {}
    if (!titleValidation.isValid && titleValidation.error) {
      validationErrors.title = titleValidation.error
    }
    if (!slugValidation.isValid && slugValidation.error) {
      validationErrors.slug = slugValidation.error
    }
    if (!contentValidation.isValid && contentValidation.error) {
      validationErrors.content = contentValidation.error
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setIsSubmitting(false)
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('slug', slug)
    formData.append('content', content)

    const result = await createPost(formData)

    if (result.success) {
      router.push('/dashboard')
    } else {
      if (result.errors) {
        setErrors(result.errors)
      } else if (result.error) {
        setErrors({ general: result.error })
      }
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
        <p className="mt-2 text-gray-600">Write and save your blog post as a draft</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {errors.general}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Enter your post title"
            required
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            URL Slug
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={slug}
            onChange={handleSlugChange}
            onBlur={handleSlugBlur}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.slug ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder="url-friendly-slug"
            required
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Auto-generated from title. You can edit it manually.
          </p>
        </div>

        <MarkdownEditor
          initialContent={content}
          onChange={setContent}
          onTitleChange={setTitle}
        />

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
