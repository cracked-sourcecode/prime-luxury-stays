import { Suspense } from 'react'
import { Metadata } from 'next'
import Script from 'next/script'
import { getActiveProperties } from '@/lib/properties'
import PropertiesClient from './PropertiesClient'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const SITE_URL = 'https://primeluxurystays.com'

export const metadata: Metadata = {
  title: 'Luxury Villas & Estates For Rent | Prime Luxury Stays',
  description: 'Browse our exclusive collection of luxury villas, private estates, and premium vacation rentals in the world\'s most sought-after destinations. Book your dream getaway today.',
  keywords: 'luxury villas for rent, private estates, vacation rentals, luxury homes, beachfront villas, mountain retreats, exclusive properties',
  openGraph: {
    title: 'Luxury Villas & Estates For Rent | Prime Luxury Stays',
    description: 'Browse our exclusive collection of luxury villas, private estates, and premium vacation rentals in the world\'s most sought-after destinations.',
    url: `${SITE_URL}/properties`,
    siteName: 'Prime Luxury Stays',
    type: 'website',
    images: [
      {
        url: 'https://storage.googleapis.com/primeluxurystays-rpr/Company%20Logo',
        width: 1200,
        height: 630,
        alt: 'Prime Luxury Stays Properties',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxury Villas & Estates For Rent | Prime Luxury Stays',
    description: 'Browse our exclusive collection of luxury villas and premium vacation rentals.',
    images: ['https://storage.googleapis.com/primeluxurystays-rpr/Company%20Logo'],
  },
  alternates: {
    canonical: `${SITE_URL}/properties`,
  },
}

// Disable all caching - always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

// Generate ItemList schema for properties page
function generatePropertiesListSchema(properties: any[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Luxury Properties',
    description: 'Browse our exclusive collection of luxury villas and estates',
    numberOfItems: properties.length,
    itemListElement: properties.slice(0, 10).map((property, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'LodgingBusiness',
        name: property.name,
        url: `${SITE_URL}/properties/${property.slug}`,
        image: property.featured_image,
        description: property.short_description,
        priceRange: '$$$$$',
      },
    })),
  }
}

export default async function PropertiesPage() {
  const properties = await getActiveProperties()
  const propertiesListSchema = generatePropertiesListSchema(properties)

  return (
    <>
      <Script
        id="properties-list-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertiesListSchema) }}
      />
      <Navigation />
      <main className="min-h-screen bg-cream-50 pt-20">
        <Suspense fallback={<PropertiesLoading />}>
          <PropertiesClient properties={properties} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

function PropertiesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-2xl h-80"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

