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
  title: `${farm.name} — Organically raised beef shares, ${farm.town}`,
  description:
    'Organically raised, grass and grain fed beef from a small family farm in Caledonia, NY. Request a quarter, half, or whole share.',
  metadataBase: new URL('https://keenanfarm.com'),
  openGraph: {
    title: `${farm.name} — Organically raised beef shares`,
    description: 'Small family farm in Caledonia, NY. Quarter, half, and whole shares.',
    images: ['/images/hero.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivo.variable} ${newsreader.variable}`}>
      <body>{children}<Analytics /></body>
    </html>
  );
}
