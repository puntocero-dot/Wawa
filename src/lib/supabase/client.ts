import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Supabase client for use in Client Components. Never import this from a
 * Server Component or Route Handler — use `lib/supabase/server.ts` there so
 * the user's session cookie is read/written correctly.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
