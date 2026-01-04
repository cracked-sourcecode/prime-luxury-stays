import { Metadata } from 'next'
import { unstable_noStore as noStore } from 'next/cache'
import { getActiveProperties } from '@/lib/properties'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import LocationsClient from './LocationsClient'

const SITE_URL = 'https://primeluxurystays.com'

export const metadata: Metadata = {
  title: 'Luxury Vacation Destinations | Mallorca, Ibiza & More | Prime Luxury Stays',
  description: 'Explore our exclusive collection of luxury properties across the world\'s most desirable destinations. From Mediterranean islands to the French Riviera, find your perfect escape.',
  keywords: 'luxury destinations, Mallorca villas, Ibiza properties, Mediterranean luxury, French Riviera, vacation rentals',
  openGraph: {
    title: 'Luxury Vacation Destinations | Prime Luxury Stays',
    description: 'Explore our exclusive collection of luxury properties across the world\'s most desirable destinations.',
    url: `${SITE_URL}/destinations`,
    siteName: 'Prime Luxury Stays',
    type: 'website',
    images: [
      {
        url: 'https://storage.googleapis.com/primeluxurystays/Mallorca%20Global%20Hero%20Section%20Image',
        width: 1200,
        height: 630,
        alt: 'Prime Luxury Stays Destinations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxury Vacation Destinations | Prime Luxury Stays',
    description: 'Explore our exclusive collection of luxury properties across the world\'s most desirable destinations.',
    images: ['https://storage.googleapis.com/primeluxurystays/Mallorca%20Global%20Hero%20Section%20Image'],
  },
  alternates: {
    canonical: `${SITE_URL}/destinations`,
  },
}

// Disable all caching - always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

// Define available locations with their details
const locationData: Record<string, { 
  name: string; 
  region: string;
  country: string;
  description: string; 
  image: string;
  comingSoon?: boolean;
}> = {
  'mallorca': {
    name: 'Mallorca',
    region: 'Balearic Islands',
    country: 'Spain',
    description: 'The jewel of the Mediterranean. Discover stunning villas, historic fincas, and exclusive beachfront properties on this beautiful island.',
    image: 'https://storage.googleapis.com/primeluxurystays/Mallorca%20Global%20Hero%20Section%20Image',
  },
  'ibiza': {
    name: 'Ibiza',
    region: 'Balearic Islands',
    country: 'Spain',
    description: 'Where luxury meets vibrant energy. Experience world-class properties on the island of endless summer.',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80',
    comingSoon: true,
  },
  'south-of-france': {
    name: 'South of France',
    region: 'Provence & Côte d\'Azur',
    country: 'France',
    description: 'The French Riviera awaits. Discover stunning villas, coastal estates, and Provençal charm.',
    image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80',
    comingSoon: true,
  },
}

// Map location keys to database region values (lowercase for matching)
const regionMapping: Record<string, string> = {
  'mallorca': 'mallorca',
  'ibiza': 'ibiza',
  'south-of-france': 'south of france',
}

export default async function LocationsPage() {
  const properties = await getActiveProperties()
  
  // Count properties by region dynamically (case-insensitive)
  const propertiesByRegion: Record<string, number> = {}
  properties.forEach(property => {
    const region = (property.region || 'Mallorca').toLowerCase()
    propertiesByRegion[region] = (propertiesByRegion[region] || 0) + 1
  })

  // Build locations array with property counts
  const locations = Object.entries(locationData).map(([key, data]) => {
    const dbRegion = regionMapping[key]
    const propertyCount = propertiesByRegion[dbRegion] || 0
    
    return {
      slug: key,
      ...data,
      propertyCount,
      // Mark as coming soon if no properties yet
      comingSoon: propertyCount === 0,
    }
  })

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-cream-50">
        <LocationsClient locations={locations} />
      </main>
      <Footer />
    </>
  )
}

