import { Suspense } from 'react';
import { Header, Footer } from '@/components/Chrome';
import { getAvailability } from '@/lib/availability';
import RequestForm from './RequestForm';

export const metadata = {
  title: 'Request a Beef Share',
  description: 'Request a quarter, half, or whole beef share from Keenan Land & Cattle in Caledonia, NY. Pick the month and size; we confirm within a day or two and nothing is charged until you hear from us.',
  alternates: { canonical: 'https://keenanfarm.com/request' },
};
export const revalidate = 300;

export default async function RequestPage() {
  const { ok, slots } = await getAvailability();
  return (
    <div className="form-page">
      <Header />
      <section style={{ paddingTop: '2rem' }}>
        <div className="wrap">
          <h2>Request a share</h2>
          <p className="lede">
            Tell us what you&apos;d like and how to reach you. We confirm within a day or two,
            and nothing is charged until you hear from us.
          </p>
          <Suspense fallback={null}>
            <RequestForm slots={ok ? slots.filter((s) => s.level !== 'full') : []} liveData={ok} />
          </Suspense>
        </div>
      </section>
      <Footer />
    </div>
  );
}
