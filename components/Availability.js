import Link from 'next/link';
import { getAvailability } from '@/lib/availability';
import { farm, shares, sharesNote, fmtMoney } from '@/lib/content';

function statusLabel(slot) {
  if (slot.level === 'full') return 'Fully reserved';
  if (slot.quartersOpen === slot.quartersTotal) return 'All shares open';
  return 'Some shares reserved';
}

function dateLabel(slot) {
  if (!slot.ready) return 'Date to be set';
  return slot.scheduled
    ? `Butcher date set · pickup about ${slot.ready}`
    : `Estimated pickup ${slot.ready} · butcher date not set yet`;
}

export default async function Availability() {
  const { ok, slots } = await getAvailability();
  const anyOpen = slots.some((s) => s.level !== 'full');

  return (
    <section className="avail" id="availability">
      <div className="wrap">
        <h2>What&apos;s available, and when</h2>
        <p className="lede">
          Shares come as a quarter, half, or whole animal. Pick the month and size that fits, send a
          request, and we&apos;ll confirm within a day or two.
        </p>

        {!ok && (
          <div className="empty">
            <strong>Availability is updated by phone right now.</strong> Call or text{' '}
            <a href={farm.phoneHref}>{farm.phone}</a> for what&apos;s open, or{' '}
            <Link href="/request">send a request</Link> and we&apos;ll get back to you.
            <PriceList />
          </div>
        )}

        {ok && !anyOpen && (
          <div className="empty">
            <strong>Everything on feed right now is spoken for.</strong> Join the waitlist and
            you&apos;ll hear from us first when the next animal opens up.
            <PriceList />
            <div style={{ marginTop: '1rem' }}>
              <Link className="btn btn-barn" href="/request?waitlist=1">Join the waitlist</Link>
            </div>
          </div>
        )}

        {ok && anyOpen && (
          <div className="ledger">
            {slots.map((slot) => (
              <div className={`animal${slot.level === 'full' ? ' full' : ''}`} key={slot.id}>
                <div>
                  <div className="when">{slot.when}</div>
                  <div className="ready">
                    {dateLabel(slot)}
                    {' · '}<b>{statusLabel(slot)}</b>
                  </div>
                </div>
                <div className="stamps">
                  {shares.map((s) =>
                    slot.open[s.key] ? (
                      <div className="stamp" key={s.key}>
                        <b>{s.label}</b>
                        <small>{fmtMoney(s.pricePerLb)} / lb hanging</small>
                      </div>
                    ) : (
                      <div className="stamp taken" key={s.key}>
                        <b>{s.label}</b>
                        <small>reserved</small>
                      </div>
                    )
                  )}
                </div>
                {slot.level !== 'full' ? (
                  <Link className="btn btn-barn" href={`/request?slot=${slot.id}`}>Request a share</Link>
                ) : (
                  <Link className="btn btn-ghost" style={{ color: 'var(--fg)', borderColor: 'var(--rule)' }} href="/request?waitlist=1">Waitlist</Link>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="twobills">
          <div><i>1</i><div><b>You pay us for the share</b><span>Priced per pound of hanging weight — the figures above. A deposit holds your share; the balance is due at pickup.</span></div></div>
          <div><i>2</i><div><b>You pay the butcher for processing</b><span>Cutting, wrapping, and freezing are billed by the butcher and paid to them directly when you pick up. That&apos;s on top of the hanging-weight price. Ask us for their current rate.</span></div></div>
        </div>

        <p className="fine">
          A typical whole animal hangs around {shares[2].hangingLbs} lb; a half about {shares[1].hangingLbs}, a quarter about {shares[0].hangingLbs}.
          You take home roughly 60–65% of hanging weight as packaged beef, depending on your cut sheet.
        </p>
        <p className="fine">{sharesNote}</p>
      </div>
    </section>
  );
}

function PriceList() {
  return (
    <div style={{ marginTop: '.75rem', fontSize: '.95rem' }}>
      {shares.map((s) => (
        <div key={s.key}><b>{s.label}</b> — {fmtMoney(s.pricePerLb)} / lb hanging weight</div>
      ))}
    </div>
  );
}
