import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Destinations from '@/components/Destinations'
import Experience from '@/components/Experience'
import Services from '@/components/Services'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import { getHeroFeaturedProperty, getActiveProperties } from '@/lib/properties'

// Disable all caching - always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function Home() {
  const [heroProperty, properties] = await Promise.all([
    getHeroFeaturedProperty(),
    getActiveProperties()
  ])
  
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero heroProperty={heroProperty} />
      <Destinations properties={properties} />
      <Experience />
      <Services />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}

