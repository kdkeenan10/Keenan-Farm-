import { serverClient } from './supabase';

// Turns rows from public_availability() into what the site shows.
// Everything is keyed to the PICKUP month, because that's the date a customer
// actually cares about. Pickup = butcher date + 10 business days (same rule
// as the KLC app); for an estimated finish we allow a week to get a butcher slot.
// Animals landing in the same pickup month are grouped into one line.
// The site never shows animal counts or tag numbers.
const ESTIMATE_BUFFER_DAYS = 7;

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
    const scheduled = !!r.kill_date;
    const base = r.kill_date || r.estimated_finish_date || null;
    const pickup = base ? pickupDate(base, scheduled ? 0 : ESTIMATE_BUFFER_DAYS) : null;
    const key = pickup ? pickup.toISOString().slice(0, 7) + (scheduled ? '-k' : '-e') : 'tbd';
    const g = groups.get(key) || {
      id: r.slot_id, bestQ: -1, maxQ: 0, count: 0, sumQ: 0,
      when: pickup ? monthLabel(pickup) : 'Date to be set',
      ready: pickup ? partLabel(pickup) : null,
      scheduled,
      sortKey: pickup ? pickup.toISOString().slice(0, 10) : '9999-12-31',
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
    ready: g.ready,
    scheduled: g.scheduled,
    sortKey: g.sortKey,
    quartersOpen: g.sumQ,
    quartersTotal: g.count * 4,
    open: { Quarter: g.maxQ >= 1, Half: g.maxQ >= 2, Whole: g.maxQ >= 4 },
    level: g.maxQ >= 4 ? 'open' : g.maxQ >= 1 ? 'limited' : 'full',
  }));
  slots.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  return { ok: true, slots };
}

function pickupDate(iso, extraDays) {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + extraDays);
  let biz = 0;
  while (biz < 10) { d.setDate(d.getDate() + 1); const w = d.getDay(); if (w !== 0 && w !== 6) biz++; }
  return d;
}

function monthLabel(d) {
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function partLabel(d) {
  const day = d.getDate();
  const part = day <= 10 ? 'early' : day <= 20 ? 'mid' : 'late';
  return `${part} ${d.toLocaleDateString('en-US', { month: 'long' })}`;
}
