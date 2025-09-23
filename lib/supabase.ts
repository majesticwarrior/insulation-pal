import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Client-side supabase instance
export const createClientComponentClient = () =>
  createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side supabase instance
export const createServerClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_service_role_key'
  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}
