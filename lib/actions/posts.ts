'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Post, CreatePostInput, UpdatePostInput, PostStatus } from '@/lib/types/database'
import { validatePostInputs } from '@/lib/utils/validation'
import { generateSlugFromTitle } from '@/lib/utils/slugify'
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  handleError,
} from '@/lib/utils/errors'

export interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string>
}

/**
 * Creates a new post
 */
export async function createPost(formData: FormData): Promise<ActionResult<Post>> {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new AuthenticationError('Please log in to create posts')
    }
    
    // Extract form data
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string | null
    
    // Validate inputs
    const validation = validatePostInputs(title, slug, content)
    if (!validation.isValid) {
      return { success: false, errors: validation.errors }
    }
    
    // Create post
    const postData: CreatePostInput = {
      user_id: user.id,
      title: title.trim(),
      slug: slug.trim(),
      content: content?.trim() || null,
      status: 'draft',
    }
    
    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single()
    
    if (error) {
      // Check for unique constraint violation
      if (error.code === '23505' && error.message.includes('slug')) {
        return { 
          success: false, 
          errors: { slug: 'This URL slug is already in use. Please choose a different one.' }
        }
      }
      console.error('Database error creating post:', error)
      throw new DatabaseError('Failed to create post. Please try again.')
    }
    
    revalidatePath('/dashboard')
    return { success: true, data }
  } catch (error) {
    const errorResponse = handleError(error)
    console.error('Create post error:', errorResponse)
    return { success: false, error: errorResponse.message }
  }
}

/**
 * Updates an existing post
 */
export async function updatePost(
  postId: string,
  formData: FormData
): Promise<ActionResult<Post>> {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new AuthenticationError('Please log in to edit posts')
    }
    
    // Verify post ownership
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single()
    
    if (fetchError || !existingPost) {
      throw new NotFoundError('Post')
    }
    
    if (existingPost.user_id !== user.id) {
      throw new AuthorizationError('You can only edit your own posts')
    }
    
    // Extract form data
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string | null
    
    // Validate inputs
    const validation = validatePostInputs(title, slug, content)
    if (!validation.isValid) {
      return { success: false, errors: validation.errors }
    }
    
    // Update post
    const updateData: UpdatePostInput = {
      title: title.trim(),
      slug: slug.trim(),
      content: content?.trim() || null,
    }
    
    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', postId)
      .select()
      .single()
    
    if (error) {
      // Check for unique constraint violation
      if (error.code === '23505' && error.message.includes('slug')) {
        return { 
          success: false, 
          errors: { slug: 'This URL slug is already in use. Please choose a different one.' }
        }
      }
      console.error('Database error updating post:', error)
      throw new DatabaseError('Failed to update post. Please try again.')
    }
    
    revalidatePath('/dashboard')
    revalidatePath(`/blog/${data.slug}`)
    return { success: true, data }
  } catch (error) {
    const errorResponse = handleError(error)
    console.error('Update post error:', errorResponse)
    return { success: false, error: errorResponse.message }
  }
}

/**
 * Deletes a post
 */
export async function deletePost(postId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new AuthenticationError('Please log in to delete posts')
    }
    
    // Verify post ownership
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single()
    
    if (fetchError || !existingPost) {
      throw new NotFoundError('Post')
    }
    
    if (existingPost.user_id !== user.id) {
      throw new AuthorizationError('You can only delete your own posts')
    }
    
    // Delete post
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
    
    if (error) {
      console.error('Database error deleting post:', error)
      throw new DatabaseError('Failed to delete post. Please try again.')
    }
    
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    const errorResponse = handleError(error)
    console.error('Delete post error:', errorResponse)
    return { success: false, error: errorResponse.message }
  }
}

/**
 * Updates post status (publish/unpublish)
 */
export async function updatePostStatus(
  postId: string,
  status: PostStatus
): Promise<ActionResult<Post>> {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new AuthenticationError('Please log in to modify posts')
    }
    
    // Verify post ownership
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single()
    
    if (fetchError || !existingPost) {
      throw new NotFoundError('Post')
    }
    
    if (existingPost.user_id !== user.id) {
      throw new AuthorizationError('You can only modify your own posts')
    }
    
    // Update status
    const { data, error } = await supabase
      .from('posts')
      .update({ status })
      .eq('id', postId)
      .select()
      .single()
    
    if (error) {
      console.error('Database error updating post status:', error)
      throw new DatabaseError('Failed to update post status. Please try again.')
    }
    
    revalidatePath('/dashboard')
    revalidatePath('/blog')
    if (data.slug) {
      revalidatePath(`/blog/${data.slug}`)
    }
    
    return { success: true, data }
  } catch (error) {
    const errorResponse = handleError(error)
    console.error('Update post status error:', errorResponse)
    return { success: false, error: errorResponse.message }
  }
}

/**
 * Fetches all posts for the current user
 */
export async function getUserPosts(): Promise<ActionResult<Post[]>> {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new AuthenticationError('Please log in to view your posts')
    }
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    
    if (error) {
      console.error('Database error fetching posts:', error)
      throw new DatabaseError('Failed to fetch posts. Please try again.')
    }
    
    return { success: true, data: data || [] }
  } catch (error) {
    const errorResponse = handleError(error)
    console.error('Get user posts error:', errorResponse)
    return { success: false, error: errorResponse.message }
  }
}

/**
 * Fetches a single post by ID
 */
export async function getPostById(postId: string): Promise<ActionResult<Post>> {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new AuthenticationError('Please log in to view this post')
    }
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .eq('user_id', user.id)
      .single()
    
    if (error || !data) {
      throw new NotFoundError('Post')
    }
    
    return { success: true, data }
  } catch (error) {
    const errorResponse = handleError(error)
    console.error('Get post by ID error:', errorResponse)
    return { success: false, error: errorResponse.message }
  }
}

/**
 * Generates a slug from a title
 */
export async function generateSlug(title: string): Promise<ActionResult<string>> {
  if (!title || title.trim().length === 0) {
    return { success: false, error: 'Title is required' }
  }
  
  const slug = generateSlugFromTitle(title)
  return { success: true, data: slug }
}
