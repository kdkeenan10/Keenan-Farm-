import Link from 'next/link';
import { farm } from '@/lib/content';

export function Header() {
  return (
    <header>
      <Link className="brand" href="/">{farm.name}</Link>
      <nav>
        <Link href="/#how">How it works</Link>
        <Link href="/#availability">Availability &amp; pricing</Link>
        <Link className="reserve" href="/request">Request a share</Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <span>© {new Date().getFullYear()} {farm.legalName} · {farm.town}</span>
        <span>Organically raised · Grass &amp; grain fed · Processed by a local custom butcher</span>
      </div>
    </footer>
  );
}
