-- ═══════════════════════════════════════════════════════════════════
-- keenanfarm.com — public site access
-- Run this in the Keenan Land & Cattle Supabase project (SQL editor).
--
-- The public site never touches animals / orders / customers directly.
-- It gets exactly two doors:
--   1. public_availability()  — read-only, four non-sensitive fields
--   2. request_share(...)     — insert-only into prospects
--
-- Column names below come from the KLC app code. If a column is named
-- differently in the actual table, Postgres will tell you on the first
-- run — nothing is written until both functions compile.
-- ═══════════════════════════════════════════════════════════════════

-- 1. AVAILABILITY --------------------------------------------------
create or replace function public.public_availability()
returns table (
  slot_id               text,
  kill_date             date,
  estimated_finish_date date,
  quarters_available    integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    -- opaque per-animal id so the site can pass it back on a request
    -- without ever exposing the real uuid or tag number
    left(md5(a.id::text), 8)                                        as slot_id,
    a.kill_date,
    a.estimated_finish_date,
    (4 - coalesce((select sum(o.quarters_sold)
                     from public.orders o
                    where o.animal_id = a.id), 0))::integer         as quarters_available
  from public.animals a
  where coalesce(a.archived, false) = false
    and coalesce(a.status, '') <> 'Processed'
    and (a.kill_date is null or a.kill_date >= current_date)
  order by coalesce(a.kill_date, a.estimated_finish_date) nulls last;
$$;

revoke all on function public.public_availability() from public;
grant execute on function public.public_availability() to anon, authenticated;

-- 2. REQUEST A SHARE ------------------------------------------------
-- Inserts a prospect. Kevin turns prospects into orders in the KLC app,
-- which already creates the customer, order, and cut sheet.
create or replace function public.request_share(
  p_name    text,
  p_phone   text,
  p_email   text,
  p_portion text,
  p_slot    text,     -- slot_id from public_availability(), or null for waitlist
  p_note    text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_when text;
begin
  if p_name is null or length(trim(p_name)) < 2 then
    raise exception 'Name is required';
  end if;
  if coalesce(trim(p_phone), '') = '' and coalesce(trim(p_email), '') = '' then
    raise exception 'Phone or email is required';
  end if;
  if p_portion not in ('Quarter', 'Half', 'Whole') then
    raise exception 'Portion must be Quarter, Half, or Whole';
  end if;

  -- Resolve the slot back to a human-readable date for the note
  if p_slot is not null then
    select coalesce(to_char(a.kill_date, 'Mon DD, YYYY'),
                    'est. ' || to_char(a.estimated_finish_date, 'Mon YYYY'),
                    'date TBD')
      into v_when
      from public.animals a
     where left(md5(a.id::text), 8) = p_slot
     limit 1;
  end if;

  insert into public.prospects (name, phone, email, preferred_purchase, notes)
  values (
    left(trim(p_name), 120),
    left(coalesce(trim(p_phone), ''), 40),
    left(coalesce(trim(p_email), ''), 160),
    p_portion,
    left(
      'keenanfarm.com request · ' || to_char(now() at time zone 'America/New_York', 'Mon DD, YYYY HH12:MI AM')
      || case when v_when is not null then ' · wants animal processing ' || v_when
              else ' · WAITLIST (no open share)' end
      || case when coalesce(trim(p_note), '') <> '' then E'\n' || trim(p_note) else '' end,
      1000)
  );
end;
$$;

revoke all on function public.request_share(text, text, text, text, text, text) from public;
grant execute on function public.request_share(text, text, text, text, text, text) to anon, authenticated;

-- 3. (RECOMMENDED, NOT REQUIRED FOR LAUNCH) -----------------------
-- Once the cut sheet page is moved behind a by-token function, lock
-- anon out of the raw tables entirely:
--
--   drop policy if exists "anon read animals"   on public.animals;   -- use your real policy names
--   drop policy if exists "anon read orders"    on public.orders;
--   drop policy if exists "anon read customers" on public.customers;
--
-- Check current policies first:
--   select tablename, policyname, roles, cmd from pg_policies where schemaname = 'public';
