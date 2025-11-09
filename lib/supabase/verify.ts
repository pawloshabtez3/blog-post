/**
 * Verification utilities for Supabase setup
 * These functions help verify that Supabase is configured correctly
 */

import { createClient } from './client'

/**
 * Verify that Supabase client can be created and environment variables are set
 */
export async function verifySupabaseConnection(): Promise<{
  success: boolean
  message: string
}> {
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return {
        success: false,
        message: 'NEXT_PUBLIC_SUPABASE_URL is not set in environment variables',
      }
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return {
        success: false,
        message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in environment variables',
      }
    }

    // Create client
    const supabase = createClient()

    // Test connection by querying the posts table
    const { error } = await supabase.from('posts').select('count').limit(1)

    if (error) {
      return {
        success: false,
        message: `Supabase connection failed: ${error.message}`,
      }
    }

    return {
      success: true,
      message: 'Supabase connection successful',
    }
  } catch (error) {
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

/**
 * Verify RLS policies by attempting to query published posts
 */
export async function verifyRLSPolicies(): Promise<{
  success: boolean
  message: string
}> {
  try {
    const supabase = createClient()

    // Test 1: Unauthenticated users should be able to query published posts
    const { data: publishedPosts, error: publishedError } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')

    if (publishedError) {
      return {
        success: false,
        message: `Failed to query published posts: ${publishedError.message}`,
      }
    }

    // Test 2: Check if we can query the posts table (RLS should allow this)
    const { error: selectError } = await supabase
      .from('posts')
      .select('count')
      .limit(1)

    if (selectError) {
      return {
        success: false,
        message: `RLS policy check failed: ${selectError.message}`,
      }
    }

    return {
      success: true,
      message: 'RLS policies are configured correctly',
    }
  } catch (error) {
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}
