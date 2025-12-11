import { Suspense } from 'react'
import { getActiveProperties } from '@/lib/properties'
import MallorcaClient from './MallorcaClient'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Mallorca | Prime Luxury Stays',
  description: 'Discover our exclusive collection of luxury villas and fincas across Mallorca, the jewel of the Mediterranean.',
}

export const dynamic = 'force-dynamic'

export default async function MallorcaPage() {
  const properties = await getActiveProperties()

  return (
    <>
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
