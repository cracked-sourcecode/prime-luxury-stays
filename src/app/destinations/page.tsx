import { getActiveProperties } from '@/lib/properties'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import LocationsClient from './LocationsClient'

export const metadata = {
  title: 'Destinations | Prime Luxury Stays',
  description: 'Explore our exclusive collection of luxury properties across the world\'s most desirable destinations.',
}

export const dynamic = 'force-dynamic'

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

export default async function LocationsPage() {
  const properties = await getActiveProperties()
  
  // For now, all properties are in Mallorca
  // In the future, group by region field
  const mallorcaPropertyCount = properties.length

  // Build locations array with property counts
  const locations = Object.entries(locationData).map(([key, data]) => ({
    slug: key,
    ...data,
    // Mallorca gets all properties, others get 0 for now
    propertyCount: key === 'mallorca' ? mallorcaPropertyCount : 0,
  }))

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

