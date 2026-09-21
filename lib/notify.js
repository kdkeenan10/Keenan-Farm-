// Notifies Kevin when a share request lands. Runs AFTER the request is saved and
// never blocks or fails it — a notification hiccup must not lose a customer.
//
// One service (Resend) does both jobs: a real email, and a text via the carrier's
// email-to-SMS gateway (e.g. 5857346458@vtext.com). Env vars, all optional:
//   RESEND_API_KEY   — from resend.com
//   NOTIFY_FROM      — verified sender, e.g. "Keenan Farm <requests@keenanfarm.com>"
//   NOTIFY_EMAIL     — where the full email goes
//   NOTIFY_SMS       — carrier gateway address for the text (comma-separate for several)
export async function notifyRequest({ name, phone, email, portion, when, note, waitlist }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFY_FROM;
  if (!key || !from) return;

  const who = [name, phone, email].filter(Boolean).join(' · ');
  const what = waitlist ? `WAITLIST — ${portion}` : `${portion} share, animal ${when || 'TBD'}`;

  const sends = [];
  if (process.env.NOTIFY_SMS) {
    // Text: short, plain, under 160 chars where possible. Gateways strip formatting.
    const text = `Keenan Farm: ${what}. ${name}${phone ? ' ' + phone : ''}.`;
    sends.push(send(key, { from, to: split(process.env.NOTIFY_SMS), subject: '', text }));
  }
  if (process.env.NOTIFY_EMAIL) {
    const lines = [
      `New share request from keenanfarm.com`,
      ``,
      `Who:     ${who}`,
      `Wants:   ${what}`,
      note ? `Note:    ${note}` : null,
      ``,
      `It's already in the KLC app under Prospects — open the app and hit "Convert to order".`,
    ].filter((l) => l !== null).join('\n');
    sends.push(send(key, {
      from,
      to: split(process.env.NOTIFY_EMAIL),
      reply_to: email || undefined,
      subject: `Share request: ${what} — ${name}`,
      text: lines,
    }));
  }
  const results = await Promise.allSettled(sends);
  results.forEach((r) => { if (r.status === 'rejected') console.error('notify failed', r.reason?.message || r.reason); });
}

const split = (s) => String(s).split(',').map((x) => x.trim()).filter(Boolean);

async function send(key, body) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
