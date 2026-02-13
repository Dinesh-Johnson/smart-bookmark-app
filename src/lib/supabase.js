import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Initialize lazily to avoid errors during build
let supabaseInstance = null

export const supabase = (() => {
  if (typeof window === 'undefined' && !supabaseUrl && !supabaseAnonKey) {
    return null
  }

  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseInstance || createClient(supabaseUrl || 'http://localhost', supabaseAnonKey || 'key')
})()
