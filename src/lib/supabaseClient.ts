import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: any = url && anon
  ? createClient(url, anon)
  : {
      auth: {
        signUp: async () => ({ error: { message: "Supabase not configured" }, data: { user: null } }),
        signInWithPassword: async () => ({ error: { message: "Supabase not configured" }, data: { user: null } }),
      },
      from: () => ({ upsert: async () => ({}) }),
    };

