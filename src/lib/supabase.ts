import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

const createSafeClient = (url: string, key: string, options = {}) => {
    if (!url || !key) {
        console.warn("Supabase credentials missing. Supabase features will not work.")
        // Return a dummy client to prevent crash on import
        return createClient("https://placeholder.supabase.co", "placeholder", options)
    }
    return createClient(url, key, options)
}

export const supabase = createSafeClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key (for admin operations)
export const supabaseAdmin = createSafeClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)
