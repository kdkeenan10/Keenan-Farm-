import { serverClient } from './supabase';

// Turns rows from public_availability() into what the site shows.
// Animals are GROUPED BY MONTH (butcher date if set, else estimated finish),
// so two steers finishing the same week become one line in the ledger.
// The site never shows animal counts or tag numbers — only open quarters.
// A share size is open for the month if ANY animal in it can hold that share.
// Requests carry the slot_id of the animal in that month with the most room.
export async function getAvailability() {
  let data;
  try {
    const sb = serverClient();
    if (!sb) return { ok: false, slots: [] };
    const res = await sb.rpc('public_availability');
    if (res.error || !res.data) return { ok: false, slots: [] };
    data = res.data;
  } catch (e) {
    console.error('availability failed', e?.message);
    return { ok: false, slots: [] };
  }

  const groups = new Map();
  for (const r of data) {
    const q = Number(r.quarters_available) || 0;
    const date = r.kill_date || r.estimated_finish_date || null;
    const key = date ? date.slice(0, 7) + (r.kill_date ? '-k' : '-e') : 'tbd';
    const g = groups.get(key) || {
      id: r.slot_id, bestQ: -1, maxQ: 0, count: 0, sumQ: 0,
      when: date ? monthLabel(date) : 'Date to be set',
      scheduled: !!r.kill_date,
      sortKey: date || '9999-12-31',
      ready: r.kill_date ? readyLabel(r.kill_date) : (r.estimated_finish_date ? readyLabel(r.estimated_finish_date, 21) : null),
    };
    g.count += 1;
    g.sumQ += q;
    g.maxQ = Math.max(g.maxQ, q);
    if (q > g.bestQ) { g.bestQ = q; g.id = r.slot_id; }
    groups.set(key, g);
  }

  const slots = [...groups.values()].map((g) => ({
    id: g.id,
    when: g.when,
    scheduled: g.scheduled,
    sortKey: g.sortKey,
    ready: g.ready,
    quartersOpen: g.sumQ,
    quartersTotal: g.count * 4,
    open: { Quarter: g.maxQ >= 1, Half: g.maxQ >= 2, Whole: g.maxQ >= 4 },
    level: g.maxQ >= 4 ? 'open' : g.maxQ >= 1 ? 'limited' : 'full',
  }));
  slots.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  return { ok: true, slots };
}

function monthLabel(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// Same rule the KLC app uses: butcher date + 10 business days.
// For an estimated finish, allow ~3 weeks to get a butcher slot first.
function readyLabel(iso, extraDays = 0) {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + extraDays);
  let biz = 0;
  while (biz < 10) { d.setDate(d.getDate() + 1); const w = d.getDay(); if (w !== 0 && w !== 6) biz++; }
  const day = d.getDate();
  const part = day <= 10 ? 'early' : day <= 20 ? 'mid' : 'late';
  return `${part} ${d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
}
