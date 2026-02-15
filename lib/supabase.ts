import { createClient as supabaseCreateClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Use service role key to bypass RLS (app uses Clerk for auth, not Supabase Auth)
export const supabase = supabaseCreateClient(supabaseUrl, supabaseServiceKey)

// Export factory function for creating new clients
export function createClient() {
  return supabaseCreateClient(supabaseUrl, supabaseServiceKey)
}

// Database types will be generated once schema is created
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      audio_items: {
        Row: {
          id: string
          user_id: string
          title: string
          source_url: string | null
          source_text: string | null
          audio_url: string | null
          duration: number | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          source_url?: string | null
          source_text?: string | null
          audio_url?: string | null
          duration?: number | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          source_url?: string | null
          source_text?: string | null
          audio_url?: string | null
          duration?: number | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
      }
      playback_positions: {
        Row: {
          id: string
          user_id: string
          audio_item_id: string
          position: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          audio_item_id: string
          position: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          audio_item_id?: string
          position?: number
          updated_at?: string
        }
      }
    }
  }
}
