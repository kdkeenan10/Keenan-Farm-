import './globals.css';
import { Archivo, Newsreader } from 'next/font/google';
import { farm } from '@/lib/content';
import { Analytics } from '@vercel/analytics/next';

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-archivo',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-newsreader',
});

export const metadata = {
  title: { default: 'Keenan Land & Cattle — Beef Shares, Caledonia, NY', template: '%s | Keenan Land & Cattle' },
  description: 'Small family farm in Caledonia, NY. Quarter, half, and whole beef shares from cattle raised on organic pasture with certified organic grain.',
  metadataBase: new URL('https://keenanfarm.com'),
  applicationName: 'Keenan Land & Cattle',
  openGraph: { siteName: 'Keenan Land & Cattle', type: 'website', locale: 'en_US', images: ['/images/hero.jpg'] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivo.variable} ${newsreader.variable}`}>
      <body>{children}<Analytics /></body>
    </html>
  );
}
