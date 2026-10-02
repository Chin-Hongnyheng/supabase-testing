import { createClient } from "@supabase/supabase-js"

// ─── Supabase client (Expo / React Native) ───────────────────────────────────
// Uses the public anon key — safe to include in the app bundle.
// SECURITY: Supabase RLS policies on the habits table enforce row-level access.
// The service_role key is NEVER used here.

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? ""
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? ""

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "[Supabase] Missing env vars. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in expo-app/.env"
  )
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
