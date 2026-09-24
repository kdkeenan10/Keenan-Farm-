import Link from 'next/link';
import { Header, Footer } from '@/components/Chrome';
import { farm, shares, fmtMoney } from '@/lib/content';

export const metadata = {
  title: 'Quarter, Half & Whole Beef Shares — What You Get',
  description: 'What a quarter, half, and whole beef share includes from Keenan Land & Cattle in Caledonia, NY: typical cuts, take-home weight, freezer space, the two separate payments, and pickup.',
  alternates: { canonical: 'https://keenanfarm.com/beef-shares' },
};

// Per-share facts. Take-home is 60–65% of hanging weight; freezer rule is ~35–40 lb per cubic foot.
const detail = {
  Quarter: { hanging: '~210 lb', takeHome: '~125–135 lb', freezer: '5 cu ft (a small chest freezer)', who: 'A household of 1–2, or a first share to see how you like it.', cuts: 'A little of everything from one side of the animal: some steaks (T-bone and porterhouse, ribeye, sirloin), a few roasts (chuck, round, rump, sirloin tip), short ribs, brisket or flank when available, stew meat, soup bones, and 45–60% ground beef.' },
  Half:    { hanging: '~420 lb', takeHome: '~250–270 lb', freezer: '8–10 cu ft', who: 'A family of 3–5 eating beef a few times a week, or two households splitting.', cuts: 'One full side: the same range of cuts as a quarter, in double the quantity, with full control over every choice — including boneless loin (NY strip and filet) if you want it, and cube steak or patties.' },
  Whole:   { hanging: '~840 lb', takeHome: '~500–550 lb', freezer: '15–20 cu ft (a large chest freezer, or two)', who: 'A big family, or three or four households going in together.', cuts: 'Both sides, cut exactly how you specify. Best price per pound. Every cut on the animal is yours to keep or grind.' },
};

export default function BeefShares() {
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'ItemList', name: 'Beef shares from Keenan Land & Cattle',
    itemListElement: shares.map((s, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Product', name: `${s.label} beef share`, description: detail[s.key].cuts, brand: { '@type': 'Brand', name: farm.legalName }, offers: { '@type': 'Offer', priceCurrency: 'USD', price: s.pricePerLb, priceSpecification: { '@type': 'UnitPriceSpecification', price: s.pricePerLb, priceCurrency: 'USD', unitText: 'per pound hanging weight' }, availability: 'https://schema.org/PreOrder', url: 'https://keenanfarm.com/request' } } })),
  };
  return (
    <div className="form-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <section className="page">
        <div className="wrap">
          <h1>Quarter, half, or whole: what a beef share actually gets you</h1>
          <p className="lede">Everything here is from a small family farm in {farm.town}. Cattle raised on our own organic pasture and hay, with certified organic grain every day, processed by a local custom butcher and cut to your order. Prices are per pound of hanging weight; processing is a separate bill paid to the butcher.</p>

          <div className="share-grid">
            {shares.map((s) => { const d = detail[s.key]; return (
              <div className="share" key={s.key}>
                <h3>{s.label}</h3>
                <div className="price">{fmtMoney(s.pricePerLb)} / lb hanging weight</div>
                <dl>
                  <dt>Hanging weight</dt><dd>{d.hanging}</dd>
                  <dt>Take-home beef</dt><dd>{d.takeHome}</dd>
                  <dt>Freezer space</dt><dd>{d.freezer}</dd>
                  <dt>Good fit for</dt><dd>{d.who}</dd>
                  <dt>What's in it</dt><dd>{d.cuts}</dd>
                </dl>
                <Link className="btn btn-barn cta" href={`/request?portion=${s.key}`}>Request a {s.label.toLowerCase()}</Link>
              </div>
            ); })}
          </div>
          <p className="fine">Hanging weight is the carcass weight at the butcher after slaughter; you take home roughly 60–65% of it as packaged beef, depending on your cut sheet — more bone-in cuts and roasts mean a higher percentage, more boneless steaks and ground mean lower. Freezer rule of thumb: 35–40 lb of packaged beef per cubic foot.</p>

          <h2>How a quarter differs from a half</h2>
          <p>A quarter is one half of a side, and the butcher cuts each side one way. So the two quarter customers on an animal share a few decisions: steak thickness, packs per package, and roast size. The first to fill out a cut sheet sets them; the second sees them already chosen. You still decide what you keep and what becomes ground beef. On a quarter the loin comes bone-in as T-bones and porterhouse (no filet or strip), and cube steak and patties aren't offered. Halves and wholes have none of these limits.</p>

          <h2>Two separate payments</h2>
          <p><strong>1. You pay us for the share</strong> — per pound of hanging weight, at the price above. A deposit holds your share when you reserve. The balance to us is due once the animal is at the butcher and the hanging weight is known; that's the first moment the real number exists, and we'll email it to you.</p>
          <p><strong>2. You pay the butcher for processing</strong> — cutting, wrapping, and freezing, billed by the butcher and paid to them directly when you pick up. It's on top of the hanging-weight price. Ask us for their current rate.</p>
          <p>Why it works this way: in New York, a farm can't sell beef by the cut without a USDA-inspected plant. What we sell is a share of a live animal; a licensed custom butcher processes your share for you. It's the standard way small farms sell direct here.</p>

          <h2>Pickup</h2>
          <p>About two weeks after the butcher date, the butcher calls you: your beef is paper-wrapped, labeled, and frozen. You pay them for processing, load up your coolers, and drive home. A quarter fits in two large coolers; bring more for a half or whole.</p>

          <h2>Timing</h2>
          <p>Our cattle come to us as calves from neighboring farms and finish about a year later. The <Link href="/#availability">availability list</Link> shows which months have shares open. A deposit holds your spot; we'll email when the butcher date is set and again when the hanging weight is in.</p>

          <p style={{ marginTop: '2.5rem' }}>
            <Link className="btn btn-barn" href="/request">Request a share</Link>
            <span style={{ display: 'inline-block', marginLeft: '1rem', color: 'var(--muted)' }}>or call or text <a href={farm.phoneHref}>{farm.phone}</a></span>
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
