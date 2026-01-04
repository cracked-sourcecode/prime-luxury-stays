import { Suspense } from 'react'
import { Metadata } from 'next'
import Script from 'next/script'
import { unstable_noStore as noStore } from 'next/cache'
import { sql } from '@/lib/db'
import IbizaClient from './IbizaClient'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const SITE_URL = 'https://primeluxurystays.com'
const IBIZA_IMAGE = 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&q=80'

export const metadata: Metadata = {
  title: 'Luxury Villas in Ibiza | Private Estates & Beach Houses | Prime Luxury Stays',
  description: 'Discover exclusive luxury villas and private estates in Ibiza, Spain. Experience the magic of the White Isle with world-class properties, stunning sea views, and legendary sunsets.',
  keywords: 'Ibiza luxury villas, Ibiza private estates, Balearic Islands vacation, Spain luxury rentals, Ibiza beach houses, White Isle villas',
  openGraph: {
    title: 'Luxury Villas in Ibiza | Prime Luxury Stays',
    description: 'Discover exclusive luxury villas and private estates in Ibiza, Spain. Experience the magic of the White Isle.',
    url: `${SITE_URL}/ibiza`,
    siteName: 'Prime Luxury Stays',
    type: 'website',
    images: [
      {
        url: IBIZA_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Luxury Villas in Ibiza',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxury Villas in Ibiza | Prime Luxury Stays',
    description: 'Discover exclusive luxury villas and private estates in Ibiza, Spain.',
    images: [IBIZA_IMAGE],
  },
  alternates: {
    canonical: `${SITE_URL}/ibiza`,
  },
}

// Disable all caching - always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

// Ibiza destination schema
const ibizaSchema = {
  '@context': 'https://schema.org',
  '@type': 'TouristDestination',
  name: 'Ibiza',
  description: 'The White Isle. Experience world-class luxury villas, legendary nightlife, and stunning Mediterranean beaches.',
  url: `${SITE_URL}/ibiza`,
  image: IBIZA_IMAGE,
  containedInPlace: {
    '@type': 'Country',
    name: 'Spain',
  },
  touristType: ['Luxury Travelers', 'Beach Vacationers', 'Nightlife Enthusiasts'],
}

// Get Ibiza properties
async function getIbizaProperties() {
  noStore(); // Opt out of caching
  try {
    const properties = await sql`
      SELECT * FROM properties 
      WHERE (is_active = true OR is_active IS NULL)
      AND LOWER(region) = 'ibiza'
      ORDER BY is_featured DESC, name ASC
    `
    return properties
  } catch (error) {
    console.error('Error fetching Ibiza properties:', error)
    return []
  }
}

export default async function IbizaPage() {
  const properties = await getIbizaProperties()

  return (
    <>
      <Script
        id="ibiza-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ibizaSchema) }}
      />
      <Navigation />
      <main className="min-h-screen bg-cream-50">
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
          <IbizaClient properties={properties as any} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

