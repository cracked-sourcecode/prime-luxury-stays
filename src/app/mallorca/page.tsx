import { Suspense } from 'react'
import { Metadata } from 'next'
import Script from 'next/script'
import { getActiveProperties } from '@/lib/properties'
import { sql } from '@/lib/db'
import MallorcaClient from './MallorcaClient'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const SITE_URL = 'https://primeluxurystays.com'
const MALLORCA_IMAGE = 'https://storage.googleapis.com/primeluxurystays-rpr/Mallorca%20Global%20Hero%20Section%20Image'

export const metadata: Metadata = {
  title: 'Luxury Villas in Mallorca | Private Fincas & Estates | Prime Luxury Stays',
  description: 'Discover our exclusive collection of luxury villas and historic fincas across Mallorca, Spain. The jewel of the Mediterranean awaits with stunning beachfront properties and mountain retreats.',
  keywords: 'Mallorca luxury villas, Mallorca fincas, Balearic Islands vacation, Spain luxury rentals, Mediterranean villas, Palma villas',
  openGraph: {
    title: 'Luxury Villas in Mallorca | Prime Luxury Stays',
    description: 'Discover our exclusive collection of luxury villas and historic fincas across Mallorca, Spain. The jewel of the Mediterranean awaits.',
    url: `${SITE_URL}/mallorca`,
    siteName: 'Prime Luxury Stays',
    type: 'website',
    images: [
      {
        url: MALLORCA_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Luxury Villas in Mallorca',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxury Villas in Mallorca | Prime Luxury Stays',
    description: 'Discover our exclusive collection of luxury villas and historic fincas across Mallorca, Spain.',
    images: [MALLORCA_IMAGE],
  },
  alternates: {
    canonical: `${SITE_URL}/mallorca`,
  },
}

// Disable all caching - always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

// Mallorca destination schema
const mallorcaSchema = {
  '@context': 'https://schema.org',
  '@type': 'TouristDestination',
  name: 'Mallorca',
  description: 'The jewel of the Mediterranean. Discover stunning luxury villas, historic fincas, and exclusive beachfront properties.',
  url: `${SITE_URL}/mallorca`,
  image: MALLORCA_IMAGE,
  containedInPlace: {
    '@type': 'Country',
    name: 'Spain',
  },
  touristType: ['Luxury Travelers', 'Beach Vacationers', 'Cultural Explorers'],
}

// Get Mallorca properties only
async function getMallorcaProperties() {
  const allProperties = await getActiveProperties()
  return allProperties.filter(p => 
    !p.region || p.region.toLowerCase() === 'mallorca'
  )
}

// Get yachts available in Mallorca
async function getMallorcaYachts() {
  try {
    const yachts = await sql`
      SELECT id, name, slug, manufacturer, model, year_built, length_meters, 
             max_guests, guest_cabins, short_description, featured_image, is_featured
      FROM yachts 
      WHERE is_active = true AND region = 'Mallorca'
      ORDER BY is_featured DESC, name ASC
      LIMIT 6
    `
    return yachts
  } catch (error) {
    console.error('Error fetching yachts:', error)
    return []
  }
}

export default async function MallorcaPage() {
  const [properties, yachts] = await Promise.all([
    getMallorcaProperties(),
    getMallorcaYachts()
  ])

  return (
    <>
      <Script
        id="mallorca-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mallorcaSchema) }}
      />
      <Navigation />
      <main className="min-h-screen bg-cream-50">
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
          <MallorcaClient properties={properties} yachts={yachts as any} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
