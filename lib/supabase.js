import { createClient } from '@supabase/supabase-js';

// Server-only client. The public site NEVER reads animals/orders/customers
// directly — it only calls the two functions in supabase/migrations/001_public_site.sql.
export function serverClient({ revalidate = 300 } = {}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate } }),
    },
  });
}
