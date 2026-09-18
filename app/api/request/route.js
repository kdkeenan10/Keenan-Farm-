import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ error: 'Requests are offline right now. Please call or text.' }, { status: 503 });

  const sb = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await sb.rpc('request_share', {
    p_name: name, p_phone: phone, p_email: email, p_portion: portion, p_slot: slot, p_note: note,
  });
  if (error) {
    console.error('request_share failed', error.message);
    return NextResponse.json({ error: 'Could not save your request. Please call or text.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
