'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Post, CreatePostInput, UpdatePostInput, PostStatus } from '@/lib/types/database'
import { validatePostInputs } from '@/lib/utils/validation'
import { generateSlugFromTitle } from '@/lib/utils/slugify'

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
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { success: false, error: 'Authentication required' }
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
    return { success: false, error: 'Failed to create post' }
  }
  
  revalidatePath('/dashboard')
  return { success: true, data }
}

/**
 * Updates an existing post
 */
export async function updatePost(
  postId: string,
  formData: FormData
): Promise<ActionResult<Post>> {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { success: false, error: 'Authentication required' }
  }
  
  // Verify post ownership
  const { data: existingPost, error: fetchError } = await supabase
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single()
  
  if (fetchError || !existingPost) {
    return { success: false, error: 'Post not found' }
  }
  
  if (existingPost.user_id !== user.id) {
    return { success: false, error: 'Unauthorized to edit this post' }
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
    return { success: false, error: 'Failed to update post' }
  }
  
  revalidatePath('/dashboard')
  revalidatePath(`/blog/${data.slug}`)
  return { success: true, data }
}

/**
 * Deletes a post
 */
export async function deletePost(postId: string): Promise<ActionResult> {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { success: false, error: 'Authentication required' }
  }
  
  // Verify post ownership
  const { data: existingPost, error: fetchError } = await supabase
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single()
  
  if (fetchError || !existingPost) {
    return { success: false, error: 'Post not found' }
  }
  
  if (existingPost.user_id !== user.id) {
    return { success: false, error: 'Unauthorized to delete this post' }
  }
  
  // Delete post
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
  
  if (error) {
    return { success: false, error: 'Failed to delete post' }
  }
  
  revalidatePath('/dashboard')
  return { success: true }
}

/**
 * Updates post status (publish/unpublish)
 */
export async function updatePostStatus(
  postId: string,
  status: PostStatus
): Promise<ActionResult<Post>> {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { success: false, error: 'Authentication required' }
  }
  
  // Verify post ownership
  const { data: existingPost, error: fetchError } = await supabase
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single()
  
  if (fetchError || !existingPost) {
    return { success: false, error: 'Post not found' }
  }
  
  if (existingPost.user_id !== user.id) {
    return { success: false, error: 'Unauthorized to modify this post' }
  }
  
  // Update status
  const { data, error } = await supabase
    .from('posts')
    .update({ status })
    .eq('id', postId)
    .select()
    .single()
  
  if (error) {
    return { success: false, error: 'Failed to update post status' }
  }
  
  revalidatePath('/dashboard')
  revalidatePath('/blog')
  if (data.slug) {
    revalidatePath(`/blog/${data.slug}`)
  }
  
  return { success: true, data }
}

/**
 * Fetches all posts for the current user
 */
export async function getUserPosts(): Promise<ActionResult<Post[]>> {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { success: false, error: 'Authentication required' }
  }
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
  
  if (error) {
    return { success: false, error: 'Failed to fetch posts' }
  }
  
  return { success: true, data: data || [] }
}

/**
 * Fetches a single post by ID
 */
export async function getPostById(postId: string): Promise<ActionResult<Post>> {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { success: false, error: 'Authentication required' }
  }
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .eq('user_id', user.id)
    .single()
  
  if (error || !data) {
    return { success: false, error: 'Post not found' }
  }
  
  return { success: true, data }
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
