import { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ServicesPageClient from './ServicesPageClient'

export const metadata: Metadata = {
  title: 'Luxury Services | Prime Luxury Stays',
  description: 'Discover our premium concierge services including private aviation, yacht charter, personal chef, luxury transport, and curated experiences.',
  openGraph: {
    title: 'Luxury Services | Prime Luxury Stays',
    description: 'Discover our premium concierge services including private aviation, yacht charter, personal chef, luxury transport, and curated experiences.',
  },
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <ServicesPageClient />
      <Footer />
    </main>
  )
}

