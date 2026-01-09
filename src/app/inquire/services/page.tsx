import { Suspense } from 'react'
import { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ServicesInquireClient from './ServicesInquireClient'

export const metadata: Metadata = {
  title: 'Inquire About Services | Prime Luxury Stays',
  description: 'Request our luxury concierge services including private chefs, yacht charters, luxury transport, and more.',
}

export const dynamic = 'force-dynamic'

export default function ServicesInquirePage({
  searchParams,
}: {
  searchParams: { service?: string }
}) {
  const selectedService = searchParams.service || null

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-cream-50 pt-20">
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
          <ServicesInquireClient selectedService={selectedService} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

