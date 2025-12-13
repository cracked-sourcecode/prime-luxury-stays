import { Suspense } from 'react'
import { getPropertyBySlug } from '@/lib/properties'
import InquireClient from './InquireClient'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Request to Book | Prime Luxury Stays',
  description:
    'Submit your dates and preferences. Our concierge team will confirm availability and craft a tailored quote.',
}

export const dynamic = 'force-dynamic'

export default async function InquirePage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const propertySlugRaw = searchParams?.property
  const propertySlug = Array.isArray(propertySlugRaw) ? propertySlugRaw[0] : propertySlugRaw

  const checkInRaw = searchParams?.checkIn
  const checkOutRaw = searchParams?.checkOut
  const guestsRaw = searchParams?.guests

  const check_in = Array.isArray(checkInRaw) ? checkInRaw[0] : checkInRaw
  const check_out = Array.isArray(checkOutRaw) ? checkOutRaw[0] : checkOutRaw
  const guestsStr = Array.isArray(guestsRaw) ? guestsRaw[0] : guestsRaw
  const guests = guestsStr ? Number(guestsStr) : null

  const property = propertySlug ? await getPropertyBySlug(propertySlug) : null

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-cream-50 pt-20">
        <Suspense fallback={<div className="py-24 text-center">Loading…</div>}>
          <InquireClient
            property={property}
            prefill={{
              property_slug: propertySlug ?? null,
              check_in: check_in ?? null,
              check_out: check_out ?? null,
              guests: Number.isFinite(guests as number) ? (guests as number) : null,
            }}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}


