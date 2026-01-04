import { Suspense } from 'react'
import { Metadata } from 'next'
import Script from 'next/script'
import { unstable_noStore as noStore } from 'next/cache'
import { sql } from '@/lib/db'
import SouthOfFranceClient from './SouthOfFranceClient'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const SITE_URL = 'https://primeluxurystays.com'
const FRANCE_IMAGE = 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=1200&q=80'

export const metadata: Metadata = {
  title: 'Luxury Villas in South of France | Côte d\'Azur & Provence | Prime Luxury Stays',
  description: 'Discover exclusive luxury villas and private estates in the South of France. From the glamour of the Côte d\'Azur to the charm of Provence, experience French Riviera living at its finest.',
  keywords: 'South of France villas, French Riviera luxury, Côte d\'Azur rentals, Provence estates, Nice villas, Cannes luxury homes, Saint-Tropez',
  openGraph: {
    title: 'Luxury Villas in South of France | Prime Luxury Stays',
    description: 'Discover exclusive luxury villas and private estates in the South of France. Experience French Riviera living at its finest.',
    url: `${SITE_URL}/south-of-france`,
    siteName: 'Prime Luxury Stays',
    type: 'website',
    images: [
      {
        url: FRANCE_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Luxury Villas in South of France',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxury Villas in South of France | Prime Luxury Stays',
    description: 'Discover exclusive luxury villas and private estates in the South of France.',
    images: [FRANCE_IMAGE],
  },
  alternates: {
    canonical: `${SITE_URL}/south-of-france`,
  },
}

// Disable all caching - always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

// South of France destination schema
const franceSchema = {
  '@context': 'https://schema.org',
  '@type': 'TouristDestination',
  name: 'South of France',
  description: 'The French Riviera. Experience world-class luxury villas, Michelin-starred dining, and the glamour of the Côte d\'Azur.',
  url: `${SITE_URL}/south-of-france`,
  image: FRANCE_IMAGE,
  containedInPlace: {
    '@type': 'Country',
    name: 'France',
  },
  touristType: ['Luxury Travelers', 'Art & Culture Enthusiasts', 'Gastronomy Lovers'],
}

// Get South of France properties
async function getSouthOfFranceProperties() {
  noStore(); // Opt out of caching
  try {
    // TEMPORARILY removed is_active filter to debug sync issue
    const properties = await sql`
      SELECT * FROM properties 
      WHERE region = 'South of France'
      ORDER BY is_featured DESC, name ASC
    `
    return properties
  } catch (error) {
    console.error('Error fetching South of France properties:', error)
    return []
  }
}

export default async function SouthOfFrancePage() {
  const properties = await getSouthOfFranceProperties()

  return (
    <>
      <Script
        id="france-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(franceSchema) }}
      />
      <Navigation />
      <main className="min-h-screen bg-cream-50">
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
          <SouthOfFranceClient properties={properties as any} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

