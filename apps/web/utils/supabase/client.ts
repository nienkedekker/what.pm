import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types";

export const createClientForBrowser = (): SupabaseClient<Database> => {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL === undefined)
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === undefined)
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined");
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
};
