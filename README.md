# keenanfarm.com

Public site for Keenan Land & Cattle. Next.js 15, plain CSS, reads live availability
from the same Supabase project as the KLC app and drops share requests into `prospects`.

## First-time setup (about 15 minutes)

**1. Run the migration** in the KLC Supabase project → SQL Editor:
paste `supabase/migrations/001_public_site.sql` and run. It creates two functions
(`public_availability`, `request_share`) and grants `anon` execute on them. Nothing else
changes. If a column name doesn't match your table, Postgres will say so and nothing is written.

**2. Push this repo to GitHub** (new repo, e.g. `kdkeenan10/keenanfarm-site`).

**3. Import into Vercel** → Add New Project → pick the repo → Framework: Next.js (auto-detected).
Add two environment variables (Settings → Environment Variables), values from the KLC
Supabase project → Settings → API:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Deploy.

**4. Attach the domain**: Vercel → Domains → `keenanfarm.com` → **Connect an existing project**
→ pick this one. Since the domain was bought through Vercel, DNS and SSL are automatic.

## Editing the site

Almost everything a customer reads is in **`lib/content.js`** — prices, hanging weights,
phone number, every paragraph. Edit it on GitHub, commit, and Vercel redeploys in ~1 minute.

Photos live in `public/images/`. Replace a file with the same name to swap a photo.

## How requests flow

Customer submits the form → `/api/request` → `request_share()` → new row in `prospects`
with a note like *"keenanfarm.com request · Sep 17, 2026 · wants animal processing Oct 12, 2026"*.
Convert it to an order in the KLC app's Prospects/Orders tabs exactly as you do today; that
creates the customer, order, and cut sheet link.

## Security notes

The site never queries `animals`, `orders`, or `customers`. It only has execute on the two
functions above. Section 3 of the migration lists the follow-up to lock `anon` out of those
tables entirely once the cut sheet page reads through a by-token function.
