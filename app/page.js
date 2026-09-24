import Image from 'next/image';
import Link from 'next/link';
import { Header, Footer } from '@/components/Chrome';
import Availability from '@/components/Availability';
import { farm, hero, organic, steps, faq, contact, shares } from '@/lib/content';

export const metadata = {
  title: 'Organically Raised Beef Shares in Caledonia, NY | Keenan Land & Cattle',
  description: 'Quarter, half, and whole beef shares from a small family farm in Caledonia, NY. Cattle raised on our own organic pasture and hay with certified organic grain. See what\'s available and request a share.',
  alternates: { canonical: 'https://keenanfarm.com/' },
};

export const revalidate = 300;

export default function Home() {
  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': 'https://keenanfarm.com/#business',
      name: farm.legalName, url: 'https://keenanfarm.com', telephone: '+1-585-734-6458',
      image: 'https://keenanfarm.com/images/hero.jpg', logo: 'https://keenanfarm.com/images/logo.png',
      description: 'Small family farm in Caledonia, NY selling quarter, half, and whole beef shares. Cattle raised on organic pasture and hay with certified organic grain.',
      address: { '@type': 'PostalAddress', addressLocality: 'Caledonia', addressRegion: 'NY', addressCountry: 'US' },
      areaServed: ['Caledonia NY', 'Livingston County NY', 'Monroe County NY', 'Genesee County NY', 'Rochester NY'],
      makesOffer: shares.map((s) => ({ '@type': 'Offer', name: `${s.label} beef share`, priceSpecification: { '@type': 'UnitPriceSpecification', price: s.pricePerLb, priceCurrency: 'USD', unitText: 'per pound hanging weight' }, url: 'https://keenanfarm.com/beef-shares' })),
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />

      <section className="hero">
        <Image
          src="/images/hero.jpg"
          alt={`The herd on spring pasture at ${farm.name}, ${farm.town}`}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 68%' }}
        />
        <div className="wrap">
          <h1>Organically Raised Beef Shares<br />in Caledonia, NY</h1>
          <div className="creed">
            <p>{hero.sub}</p>
            <p className="sub2">{hero.sub2}</p>
          </div>
          <div className="actions">
            <Link className="btn btn-barn" href="/request">Request a share</Link>
            <a className="btn btn-ghost" href="#how">See how it works</a>
          </div>
        </div>
      </section>

      <section className="intro">
        <div className="wrap grid">
          <div>
            <h2>{organic.heading}</h2>
            <p className="lede">{organic.p1}</p>
            <p className="lede">{organic.p2}</p>
          </div>
          <div className="photo" style={{ position: 'relative' }}>
            <Image src="/images/backlit.jpg" alt="Two steers in evening light on pasture" fill sizes="(max-width: 820px) 100vw, 45vw" style={{ objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      <section className="how" id="how">
        <div className="wrap">
          <h2>How a beef share works</h2>
          <p className="lede">
            You&apos;re buying a share of a live animal from our farm, and a local custom butcher
            processes it for you. Four steps, and we walk you through each one.
          </p>
          <div className="steps">
            {steps.map((s, i) => (
              <div className="step" key={s.title}>
                <div className="n">{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Availability />


      <section className="gallery">
        <div className="wrap strip">
          <div style={{ position: 'relative', gridColumn: 'span 2', aspectRatio: '2/1' }}>
            <Image src="/images/farmwide.jpg" alt={`Looking out over the pastures at ${farm.name}`} fill sizes="(max-width: 700px) 100vw, 50vw" style={{ objectFit: 'cover', borderRadius: '.3rem' }} />
          </div>
          <div style={{ position: 'relative', aspectRatio: '1/1' }}>
            <Image src="/images/feeder.jpg" alt="Steers at the bunk feeder in the barn" fill sizes="(max-width: 700px) 50vw, 25vw" style={{ objectFit: 'cover', borderRadius: '.3rem' }} />
          </div>
          <div style={{ position: 'relative', aspectRatio: '1/1' }}>
            <Image src="/images/calf.jpg" alt="A curious young steer" fill sizes="(max-width: 700px) 50vw, 25vw" style={{ objectFit: 'cover', borderRadius: '.3rem' }} />
          </div>
        </div>
      </section>


      <section className="faq" id="faq">
        <div className="wrap">
          <h2>Questions people ask</h2>
          <div className="faq-list">
            {faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="contact" id="reserve">
        <Image src="/images/dusk.jpg" alt="" aria-hidden fill sizes="100vw" style={{ objectFit: 'cover', opacity: 0.55 }} />
        <div className="wrap">
          <h2>{contact.heading}</h2>
          <div className="ways">
            <div className="way"><b>Call or text</b><a href={farm.phoneHref}>{farm.phone}</a></div>
            {farm.email && <div className="way"><b>Email</b><a href={`mailto:${farm.email}`}>{farm.email}</a></div>}
            <div className="way"><b>Find us</b><span style={{ fontSize: '1.35rem', fontWeight: 700 }}>{farm.town}</span></div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
