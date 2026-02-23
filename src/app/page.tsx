import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Destinations from '@/components/Destinations'
import Experience from '@/components/Experience'
import YachtsSection from '@/components/YachtsSection'
import Services from '@/components/Services'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import { getHeroFeaturedProperty, getActiveProperties } from '@/lib/properties'
import { sql } from '@/lib/db'

// Disable all caching - always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

async function getFeaturedYachts() {
  try {
    const yachts = await sql`
      SELECT id, name, slug, manufacturer, model, year_built, length_meters, 
             max_guests, guest_cabins, short_description, short_description_de, featured_image, is_featured
      FROM yachts 
      WHERE is_active = true
      ORDER BY is_featured DESC, name ASC
      LIMIT 3
    `
    return yachts
  } catch (error) {
    console.error('Error fetching yachts:', error)
    return []
  }
}

export default async function Home() {
  const [heroProperty, properties, yachts] = await Promise.all([
    getHeroFeaturedProperty(),
    getActiveProperties(),
    getFeaturedYachts()
  ])
  
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero heroProperty={heroProperty} />
      <Destinations properties={properties} />
      <Experience />
      <YachtsSection yachts={yachts as any} />
      <Services />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}

