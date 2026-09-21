import { createClient } from '@supabase/supabase-js';

// Reads the two public env vars and refuses anything that isn't usable, so a
// mistyped variable degrades to the "call or text" fallback instead of
// failing the whole build.
export function publicConfig() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url)) return null;
  if (key.length < 40) return null;
  return { url: url.replace(/\/$/, ''), key };
}

// Server-only client. The public site NEVER reads animals/orders/customers
// directly — it only calls the two functions in supabase/migrations/001_public_site.sql.
export function serverClient({ revalidate = 300 } = {}) {
  const cfg = publicConfig();
  if (!cfg) return null;
  return createClient(cfg.url, cfg.key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate } }),
    },
  });
}
