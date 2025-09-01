import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

console.log('🔧 Supabase config:', { 
  url: supabaseUrl?.substring(0, 30) + '...', 
  hasKey: !!supabaseAnonKey 
});

// Supabase client configured for project: hrtdbvwocrlqkmxttqox

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})