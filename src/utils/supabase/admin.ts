import { createClient } from '@supabase/supabase-js'

/**
 * WARNING: SECURITY CRITICAL
 * This admin client uses the SUPABASE_SERVICE_ROLE_KEY, which bypasses all Row Level Security (RLS) policies.
 * 
 * STRICT USAGE RULES:
 * - This file MUST ONLY be imported and used in secure server environments (e.g., Next.js API routes, Server Actions, Server Components).
 * - NEVER import this client in any client-side code (`"use client"` components), as it will leak the service role key and grant full database access to the public.
 * - Use standard `server.ts` or `client.ts` for regular authenticated user operations.
 */
export function createAdminClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing in environment variables.')
  }
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing in environment variables.')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
