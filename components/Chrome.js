import Link from 'next/link';
import Image from 'next/image';
import { farm } from '@/lib/content';

export function Header() {
  return (
    <header>
      <Link className="brand" href="/" aria-label={`${farm.legalName} — home`}>
        <Image src="/images/logo.png" alt={farm.legalName} width={289} height={198} priority className="brand-logo" />
      </Link>
      <nav>
        <Link href="/#how">How it works</Link>
        <Link href="/#availability">Availability &amp; pricing</Link>
        <Link href="/#faq">FAQ</Link>
        <Link className="reserve" href="/request">Request a share</Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <Image src="/images/logo.png" alt="" aria-hidden width={175} height={120} className="footer-logo" />
        <div className="lines">
          <span>© {new Date().getFullYear()} {farm.legalName} · {farm.town}</span>
          <span>Organically raised · Grass &amp; grain fed · Processed by a local custom butcher</span>
        </div>
      </div>
    </footer>
  );
}
