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
      SELECT 
        id, name, slug, manufacturer, model, yacht_type, year_built,
        length_meters, beam_meters, draft_meters, guest_cabins, max_guests, crew_members,
        long_description AS description, short_description,
        cruising_speed_knots, max_speed_knots, has_stabilizers,
        water_toys_list,
        has_jacuzzi, has_gym, has_wifi, has_air_conditioning,
        amenities, featured_image,
        home_port, region, cruising_area,
        price_per_day, price_per_week, is_active, is_featured,
        has_jet_ski, has_tender, has_water_toys
      FROM yachts 
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
    
    // Fetch related properties (yacht add-ons)
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
    } catch (err) {
      // property_yacht_options table might not exist yet
      console.log('No related properties found')
    }
    
    return { ...yacht, images, relatedProperties }
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
        <YachtDetailClient yacht={yacht} />
      </main>
      <Footer />
    </>
  )
}
