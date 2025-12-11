import { Suspense } from 'react'
import { getActiveProperties } from '@/lib/properties'
import PropertiesClient from './PropertiesClient'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Properties | Prime Luxury Stays',
  description: 'Browse our exclusive collection of luxury villas and estates in Mallorca.',
}

export const dynamic = 'force-dynamic'

export default async function PropertiesPage() {
  const properties = await getActiveProperties()

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-cream-50 pt-24">
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

