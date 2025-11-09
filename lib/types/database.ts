export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PostStatus = 'draft' | 'published'

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          user_id: string
          title: string
          slug: string
          content: string | null
          status: PostStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          slug: string
          content?: string | null
          status?: PostStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          slug?: string
          content?: string | null
          status?: PostStatus
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Post = Database['public']['Tables']['posts']['Row']
export type CreatePostInput = Database['public']['Tables']['posts']['Insert']
export type UpdatePostInput = Database['public']['Tables']['posts']['Update']
