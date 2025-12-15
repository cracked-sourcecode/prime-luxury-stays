import { notFound } from 'next/navigation'
import { getPropertyBySlug, getAllPropertySlugs } from '@/lib/properties'
import { sql } from '@/lib/db'
import PropertyDetailClient from './PropertyDetailClient'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

interface PropertyPageProps {
  params: Promise<{ slug: string }>
}

// Fetch property images from database
async function getPropertyImages(propertyId: number) {
  const images = await sql`
    SELECT * FROM property_images 
    WHERE property_id = ${propertyId}
    ORDER BY display_order ASC, id ASC
  `
  return images
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const { slug } = await params
  const property = await getPropertyBySlug(slug)
  
  if (!property) {
    return { title: 'Property Not Found | Prime Luxury Stays' }
  }

  return {
    title: `${property.name} | Prime Luxury Stays`,
    description: property.short_description || property.description,
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params
  const property = await getPropertyBySlug(slug)

  if (!property) {
    notFound()
  }

  // Fetch gallery images from database
  const galleryImages = await getPropertyImages(property.id)
  
  // Debug log
  console.log(`Property ${property.slug}: Found ${galleryImages.length} images`)

  // Map and filter out any with missing URLs
  const mappedImages = galleryImages
    .filter((img: any) => img.image_url && img.image_url.length > 0)
    .map((img: any) => ({
      id: img.id,
      url: img.image_url,
      caption: img.caption,
      is_featured: img.is_featured
    }))

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-cream-50 pt-20">
        <PropertyDetailClient 
          property={property} 
          galleryImages={mappedImages}
        />
      </main>
      <Footer />
    </>
  )
}
