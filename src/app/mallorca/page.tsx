import { Suspense } from 'react'
import { Metadata } from 'next'
import Script from 'next/script'
import { getActiveProperties } from '@/lib/properties'
import MallorcaClient from './MallorcaClient'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const SITE_URL = 'https://primeluxurystays.com'
const MALLORCA_IMAGE = 'https://storage.googleapis.com/primeluxurystays/Mallorca%20Global%20Hero%20Section%20Image'

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

export const dynamic = 'force-dynamic'

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

export default async function MallorcaPage() {
  const properties = await getMallorcaProperties()

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
          <MallorcaClient properties={properties} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
