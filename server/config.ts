export const SUPABASE_URL = process.env.SUPABASE_URL || "";
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

export const SUPABASE_KEY = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

