'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { farm, shares, fmtMoney } from '@/lib/content';

export default function RequestForm({ slots, liveData }) {
  const params = useSearchParams();
  const waitlist = params.get('waitlist') === '1' || (liveData && slots.length === 0);
  const [portion, setPortion] = useState(params.get('portion') || 'Half');
  const [slot, setSlot] = useState(params.get('slot') || (slots[0]?.id ?? ''));
  const [state, setState] = useState({ busy: false, err: '', done: false });

  const chosen = slots.find((s) => s.id === slot);
  const portionOpen = !chosen || chosen.open[portion];

  async function submit(e) {
    e.preventDefault();
    setState({ busy: true, err: '', done: false });
    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get('name'),
      phone: fd.get('phone'),
      email: fd.get('email'),
      portion,
      slot: waitlist ? null : slot || null,
      note: fd.get('note'),
      website: fd.get('website'), // honeypot
    };
    const res = await fetch('/api/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) { setState({ busy: false, err: j.error || 'Something went wrong. Call or text us instead.', done: false }); return; }
    setState({ busy: false, err: '', done: true });
  }

  if (state.done) {
    return (
      <div className="done">
        <h2>Got it.</h2>
        <p>
          We&apos;ll be in touch within a day or two to confirm your {portion.toLowerCase()} share
          and send a deposit link. If you don&apos;t hear from us, call or text{' '}
          <a href={farm.phoneHref}>{farm.phone}</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit}>
      <label>Share size</label>
      <div className="choices">
        {shares.map((s) => (
          <label className="choice" key={s.key}>
            <input type="radio" name="portion" value={s.key} checked={portion === s.key} onChange={() => setPortion(s.key)} />
            <b>{s.label}</b>
            <span>{fmtMoney(s.pricePerLb)} / lb hanging</span>
          </label>
        ))}
      </div>

      {!waitlist && slots.length > 0 && (
        <>
          <label htmlFor="slot">Which animal</label>
          <select id="slot" value={slot} onChange={(e) => setSlot(e.target.value)}>
            {slots.map((s) => (
              <option key={s.id} value={s.id}>
                {s.when}{s.scheduled ? '' : ' (estimated)'} — {['Quarter', 'Half', 'Whole'].filter((k) => s.open[k]).join(', ')} open
              </option>
            ))}
          </select>
          {!portionOpen && (
            <div className="err">
              A {portion.toLowerCase()} isn&apos;t open on that animal. Pick a different size or a different date, or send it anyway and we&apos;ll put you on the waitlist for the next one.
            </div>
          )}
        </>
      )}
      {waitlist && (
        <div className="err" style={{ background: 'rgba(30,58,43,.08)', borderColor: 'var(--pasture)', color: 'inherit' }}>
          You&apos;re joining the waitlist. We&apos;ll reach out as soon as a {portion.toLowerCase()} opens up.
        </div>
      )}

      <div className="row">
        <div><label htmlFor="name">Your name</label><input id="name" name="name" required autoComplete="name" /></div>
        <div><label htmlFor="phone">Phone</label><input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="Best for texting" /></div>
      </div>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" autoComplete="email" />
      <label htmlFor="note">Anything we should know? <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span></label>
      <textarea id="note" name="note" placeholder="First time buying a share, splitting with my sister, need it before Thanksgiving…" />
      <div className="hp" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>

      {state.err && <div className="err">{state.err}</div>}
      <button className="btn btn-barn submit" type="submit" disabled={state.busy}>
        {state.busy ? 'Sending…' : waitlist ? 'Join the waitlist' : 'Send request'}
      </button>
      <p className="note">Give us a phone number or an email — one is enough. We never share either.</p>
    </form>
  );
}
