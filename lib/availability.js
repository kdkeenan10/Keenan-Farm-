import { serverClient } from './supabase';

// Turns rows from public_availability() into what the site shows:
// one entry per upcoming animal, month-level date, and which share sizes are open.
// No tag numbers, no exact counts.
export async function getAvailability() {
  const sb = serverClient();
  if (!sb) return { ok: false, slots: [] };
  const { data, error } = await sb.rpc('public_availability');
  if (error || !data) return { ok: false, slots: [] };

  const slots = data.map((r) => {
    const q = Number(r.quarters_available) || 0;
    const date = r.kill_date || r.estimated_finish_date || null;
    return {
      id: r.slot_id,
      when: date ? monthLabel(date) : 'Date to be set',
      scheduled: !!r.kill_date,
      // Same rule the KLC app uses: butcher date + 10 business days.
      ready: r.kill_date ? readyLabel(r.kill_date) : (r.estimated_finish_date ? readyLabel(r.estimated_finish_date, 21) : null),
      sortKey: date || '9999-12-31',
      open: {
        Quarter: q >= 1,
        Half: q >= 2,
        Whole: q >= 4,
      },
      level: q >= 4 ? 'open' : q >= 1 ? 'limited' : 'full',
    };
  });
  slots.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  return { ok: true, slots };
}

function monthLabel(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function readyLabel(iso, extraDays = 0) {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + extraDays);
  let biz = 0;
  while (biz < 10) { d.setDate(d.getDate() + 1); const w = d.getDay(); if (w !== 0 && w !== 6) biz++; }
  const day = d.getDate();
  const part = day <= 10 ? 'early' : day <= 20 ? 'mid' : 'late';
  return `${part} ${d.toLocaleDateString('en-US', { month: 'long' })}`;
}
