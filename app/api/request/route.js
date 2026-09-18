import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { publicConfig } from '@/lib/supabase';

// Cheap in-memory throttle per IP. Vercel functions are ephemeral so this is
// best-effort, but it stops a single tight loop cold.
const hits = new Map();
function throttled(ip) {
  const now = Date.now();
  const rec = hits.get(ip) || [];
  const recent = rec.filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(req) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (throttled(ip)) return NextResponse.json({ error: 'Too many requests. Try again in a minute.' }, { status: 429 });

  let b;
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }); }

  // Honeypot filled → pretend success, save nothing.
  if (b.website) return NextResponse.json({ ok: true });

  const name = String(b.name || '').trim();
  const phone = String(b.phone || '').trim();
  const email = String(b.email || '').trim();
  const portion = String(b.portion || '');
  const slot = b.slot ? String(b.slot).slice(0, 8) : null;
  const note = String(b.note || '').trim().slice(0, 800);

  if (name.length < 2) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  if (!phone && !email) return NextResponse.json({ error: 'Please give us a phone number or email.' }, { status: 400 });
  if (!['Quarter', 'Half', 'Whole'].includes(portion)) return NextResponse.json({ error: 'Pick a share size.' }, { status: 400 });

  const cfg = publicConfig();
  if (!cfg) return NextResponse.json({ error: 'Requests are offline right now. Please call or text.' }, { status: 503 });

  const sb = createClient(cfg.url, cfg.key, { auth: { persistSession: false } });

  // Server-side check: the chosen animal must still have room for this share.
  // Two people racing for the same half can't both get a "got it".
  if (slot) {
    const need = portion === 'Whole' ? 4 : portion === 'Half' ? 2 : 1;
    const { data: avail } = await sb.rpc('public_availability');
    const row = (avail || []).find((r) => r.slot_id === slot);
    if (!row) return NextResponse.json({ error: 'That animal is no longer listed. Please pick another.' }, { status: 409 });
    if (Number(row.quarters_available) < need) {
      return NextResponse.json({ error: `A ${portion.toLowerCase()} is no longer open on that animal. Pick a different size or date.` }, { status: 409 });
    }
  }

  const { error } = await sb.rpc('request_share', {
    p_name: name, p_phone: phone, p_email: email, p_portion: portion, p_slot: slot, p_note: note,
  });
  if (error) {
    console.error('request_share failed', error.message);
    return NextResponse.json({ error: 'Could not save your request. Please call or text.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
