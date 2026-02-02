import { Suspense } from 'react'
import { Metadata } from 'next'
import { getPropertyBySlug } from '@/lib/properties'
import { sql } from '@/lib/db'
import InquireClient from './InquireClient'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

// Fetch yacht by slug
async function getYachtBySlug(slug: string) {
  const yachts = await sql`
    SELECT 
      id, name, slug, manufacturer, model, yacht_type,
      year_built, length_meters, max_guests, guest_cabins,
      short_description, featured_image, region
    FROM yachts 
    WHERE slug = ${slug} AND is_active = true
    LIMIT 1
  `
  return yachts[0] || null
}

const SITE_URL = 'https://primeluxurystays.com'

export const metadata: Metadata = {
  title: 'Book Your Luxury Stay | Request a Quote | Prime Luxury Stays',
  description: 'Submit your dates and preferences for your luxury villa rental. Our dedicated concierge team will confirm availability and craft a personalized quote for your dream vacation.',
  keywords: 'book luxury villa, request quote, vacation rental booking, concierge service, luxury stay reservation',
  openGraph: {
    title: 'Book Your Luxury Stay | Prime Luxury Stays',
    description: 'Submit your dates and preferences. Our concierge team will confirm availability and craft a tailored quote.',
    url: `${SITE_URL}/inquire`,
    siteName: 'Prime Luxury Stays',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Book Your Luxury Stay | Prime Luxury Stays',
    description: 'Submit your dates and preferences. Our concierge team will confirm availability and craft a tailored quote.',
  },
  alternates: {
    canonical: `${SITE_URL}/inquire`,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const dynamic = 'force-dynamic'

export default async function InquirePage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const propertySlugRaw = searchParams?.property
  const propertySlug = Array.isArray(propertySlugRaw) ? propertySlugRaw[0] : propertySlugRaw

  const yachtSlugRaw = searchParams?.yacht
  const yachtSlug = Array.isArray(yachtSlugRaw) ? yachtSlugRaw[0] : yachtSlugRaw

  const typeRaw = searchParams?.type
  const inquiryType = Array.isArray(typeRaw) ? typeRaw[0] : typeRaw

  const checkInRaw = searchParams?.checkIn
  const checkOutRaw = searchParams?.checkOut
  const guestsRaw = searchParams?.guests
  const addYachtRaw = searchParams?.addYacht

  const check_in = Array.isArray(checkInRaw) ? checkInRaw[0] : checkInRaw
  const check_out = Array.isArray(checkOutRaw) ? checkOutRaw[0] : checkOutRaw
  const guestsStr = Array.isArray(guestsRaw) ? guestsRaw[0] : guestsRaw
  const guests = guestsStr ? Number(guestsStr) : null
  const addYacht = Array.isArray(addYachtRaw) ? addYachtRaw[0] === 'true' : addYachtRaw === 'true'

  const property = propertySlug ? await getPropertyBySlug(propertySlug) : null
  const yacht = yachtSlug ? await getYachtBySlug(yachtSlug) : null

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-cream-50 pt-20">
        <Suspense fallback={<div className="py-24 text-center">Loading…</div>}>
          <InquireClient
            property={property}
            yacht={yacht as any}
            inquiryType={inquiryType || (yacht ? 'yacht' : undefined)}
            prefill={{
              property_slug: propertySlug ?? null,
              yacht_slug: yachtSlug ?? null,
              check_in: check_in ?? null,
              check_out: check_out ?? null,
              guests: Number.isFinite(guests as number) ? (guests as number) : null,
              add_yacht: addYacht || !!yacht,
            }}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}


