import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sql } from '@/lib/db'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import YachtDetailClient from './YachtDetailClient'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

interface YachtPageProps {
  params: Promise<{ slug: string }>
}

async function getYacht(slug: string) {
  try {
    const result = await sql`
      SELECT * FROM yachts 
      WHERE slug = ${slug} AND is_active = true
    `
    
    if (result.length === 0) return null
    
    const yacht = result[0]
    
    // Fetch images
    const images = await sql`
      SELECT * FROM yacht_images 
      WHERE yacht_id = ${yacht.id}
      ORDER BY display_order ASC
    `
    
    // Fetch related properties (paired villas); fallback to 3 featured villas so widget always has options
    let relatedProperties: any[] = []
    try {
      relatedProperties = await sql`
        SELECT p.id, p.name, p.slug, p.featured_image, p.short_description, p.short_description_de, 
               p.bedrooms, p.max_guests, p.region, p.city
        FROM properties p
        INNER JOIN property_yacht_options pyo ON p.id = pyo.property_id
        WHERE pyo.yacht_id = ${yacht.id} AND p.is_active = true
        ORDER BY pyo.is_recommended DESC
        LIMIT 4
      `
    } catch (_) {}
    if (relatedProperties.length === 0) {
      const fallback = await sql`
        SELECT id, name, slug, featured_image, short_description, short_description_de,
               bedrooms, max_guests, region, city
        FROM properties
        WHERE is_active = true
        ORDER BY is_featured DESC, name ASC
        LIMIT 3
      `
      relatedProperties = fallback as any[]
    }
    
    return { ...yacht, images, relatedProperties } as typeof yacht & { images: typeof images; relatedProperties: typeof relatedProperties }
  } catch (error) {
    console.error('Error fetching yacht:', error)
    return null
  }
}

export async function generateMetadata({ params }: YachtPageProps): Promise<Metadata> {
  const { slug } = await params
  const yacht = await getYacht(slug)
  
  if (!yacht) {
    return {
      title: 'Yacht Not Found | Prime Luxury Stays',
    }
  }
  
  return {
    title: `${yacht.name} | Luxury Yacht Charter | Prime Luxury Stays`,
    description: yacht.short_description || `Charter the ${yacht.name}, a stunning ${yacht.model} with ${yacht.max_guests} guest capacity. Experience luxury yachting in ${yacht.destination}.`,
    openGraph: {
      title: `${yacht.name} | Prime Luxury Stays`,
      description: yacht.short_description || `Luxury ${yacht.model} charter in ${yacht.destination}`,
      images: [yacht.featured_image || yacht.images?.[0]?.image_url],
    },
  }
}

export default async function YachtPage({ params }: YachtPageProps) {
  const { slug } = await params
  const yacht = await getYacht(slug)
  
  if (!yacht) {
    notFound()
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-cream-50">
        <YachtDetailClient yacht={yacht as any} />
      </main>
      <Footer />
    </>
  )
}
