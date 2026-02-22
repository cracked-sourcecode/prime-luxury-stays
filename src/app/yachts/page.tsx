import { Metadata } from 'next'
import { sql } from '@/lib/db'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import YachtsClient from './YachtsClient'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export const metadata: Metadata = {
  title: 'Luxury Yacht Charters | Prime Luxury Stays',
  description: 'Experience the Mediterranean in style with our exclusive yacht charter collection. From sleek motor yachts to elegant sailing vessels, discover the perfect vessel for your Mallorca adventure.',
  openGraph: {
    title: 'Luxury Yacht Charters | Prime Luxury Stays',
    description: 'Exclusive yacht charters in Mallorca. Day trips, week-long adventures, and bespoke experiences.',
    images: ['https://storage.googleapis.com/primeluxurystays-rpr/Company%20Logo'],
  },
}

async function getYachts() {
  try {
    const yachts = await sql`
      SELECT * FROM yachts 
      WHERE is_active = true
      ORDER BY is_featured DESC, name ASC
    `
    
    // Fetch images for each yacht
    const yachtsWithImages = await Promise.all(
      yachts.map(async (yacht: any) => {
        const images = await sql`
          SELECT * FROM yacht_images 
          WHERE yacht_id = ${yacht.id}
          ORDER BY display_order ASC
        `
        return { ...yacht, images }
      })
    )
    
    return yachtsWithImages
  } catch (error) {
    console.error('Error fetching yachts:', error)
    return []
  }
}

export default async function YachtsPage() {
  const yachts = await getYachts()

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-cream-50">
        <YachtsClient yachts={yachts} />
      </main>
      <Footer />
    </>
  )
}
