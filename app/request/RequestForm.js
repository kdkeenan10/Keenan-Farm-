'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { farm, shares, fmtMoney } from '@/lib/content';

export default function RequestForm({ slots, liveData }) {
  const params = useSearchParams();
  const waitlist = params.get('waitlist') === '1' || (liveData && slots.length === 0);
  const [slot, setSlot] = useState(params.get('slot') || (slots[0]?.id ?? ''));
  const chosen = slots.find((s) => s.id === slot);

  // Only sizes that are actually open on the chosen animal can be picked.
  const isOpen = (k) => waitlist || !chosen || chosen.open[k];
  const firstOpen = shares.find((s) => isOpen(s.key))?.key || 'Quarter';
  const requested = params.get('portion');
  const [portion, setPortion] = useState(requested && isOpen(requested) ? requested : firstOpen);
  const [state, setState] = useState({ busy: false, err: '', done: false });

  function changeSlot(id) {
    setSlot(id);
    const s = slots.find((x) => x.id === id);
    if (s && !s.open[portion]) setPortion(shares.find((sh) => s.open[sh.key])?.key || 'Quarter');
  }

  async function submit(e) {
    e.preventDefault();
    if (!isOpen(portion)) { setState({ busy: false, err: 'That share size is no longer open on this animal.', done: false }); return; }
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
      {!waitlist && slots.length > 0 && (
        <>
          <label htmlFor="slot">Which month</label>
          <select id="slot" value={slot} onChange={(e) => changeSlot(e.target.value)}>
            {slots.map((s) => (
              <option key={s.id} value={s.id}>
                {s.when}{s.scheduled ? '' : ' (estimated)'} — {shares.filter((sh) => s.open[sh.key]).map((sh) => sh.label).join(', ')} open
              </option>
            ))}
          </select>
        </>
      )}
      {waitlist && (
        <div className="err" style={{ background: 'rgba(62,86,56,.08)', borderColor: 'var(--pasture)', color: 'inherit' }}>
          You&apos;re joining the waitlist. We&apos;ll reach out as soon as a share opens up.
        </div>
      )}

      <label>Share size</label>
      <div className="choices">
        {shares.map((s) => {
          const open = isOpen(s.key);
          return (
            <label className="choice" key={s.key} style={open ? undefined : { opacity: .45, cursor: 'not-allowed' }} aria-disabled={!open}>
              <input type="radio" name="portion" value={s.key} checked={portion === s.key} disabled={!open} onChange={() => setPortion(s.key)} />
              <b>{s.label}</b>
              <span>{open ? `${fmtMoney(s.pricePerLb)} / lb hanging` : 'reserved'}</span>
            </label>
          );
        })}
      </div>

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
