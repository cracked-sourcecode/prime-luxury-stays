import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Script from 'next/script'
import { unstable_noStore as noStore } from 'next/cache'
import { getPropertyBySlug, getAllPropertySlugs } from '@/lib/properties'
import { sql } from '@/lib/db'
import PropertyDetailClient from './PropertyDetailClient'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

// Disable all caching - always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

const SITE_URL = 'https://primeluxurystays.com'

interface PropertyPageProps {
  params: Promise<{ slug: string }>
}

// Fetch property images from database
async function getPropertyImages(propertyId: number) {
  noStore(); // Opt out of caching
  const images = await sql`
    SELECT * FROM property_images 
    WHERE property_id = ${propertyId}
    ORDER BY display_order ASC, id ASC
  `
  return images
}

// Fetch yachts for the region (currently all yachts are in Mallorca)
async function getYachtsForRegion() {
  noStore();
  const yachts = await sql`
    SELECT 
      id, name, slug, manufacturer, model, yacht_type,
      year_built, length_meters, max_guests, guest_cabins,
      short_description, featured_image, is_featured, region
    FROM yachts 
    WHERE is_active = true
    ORDER BY is_featured DESC, name ASC
    LIMIT 3
  `
  return yachts
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params
  const property = await getPropertyBySlug(slug)
  
  if (!property) {
    return { title: 'Property Not Found | Prime Luxury Stays' }
  }

  const description = property.short_description || property.description || `Experience luxury at ${property.name}`
  const propertyUrl = `${SITE_URL}/properties/${property.slug}`
  const images = property.featured_image ? [property.featured_image] : []

  return {
    title: `${property.name} | Prime Luxury Stays`,
    description,
    openGraph: {
      title: `${property.name} | Prime Luxury Stays`,
      description,
      url: propertyUrl,
      siteName: 'Prime Luxury Stays',
      images: images.map(img => ({
        url: img,
        width: 1200,
        height: 630,
        alt: property.name,
      })),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${property.name} | Prime Luxury Stays`,
      description,
      images,
    },
  }
}

// Generate structured data for the property
function generatePropertySchema(property: any, images: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: property.name,
    description: property.short_description || property.description,
    url: `${SITE_URL}/properties/${property.slug}`,
    image: images,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.destination,
      addressCountry: property.country || 'US',
    },
    priceRange: '$$$$$',
    amenityFeature: property.amenities?.map((amenity: string) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
      value: true,
    })) || [],
    numberOfRooms: property.bedrooms,
    petsAllowed: false,
    starRating: {
      '@type': 'Rating',
      ratingValue: property.rating || 5,
      bestRating: 5,
    },
    offers: {
      '@type': 'Offer',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: property.price_per_night,
        priceCurrency: 'USD',
        unitText: 'night',
      },
    },
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
  
  // Fetch yachts for the region
  const yachts = await getYachtsForRegion()

  // Map and filter out any with missing URLs
  const mappedImages = galleryImages
    .filter((img: any) => img.image_url && img.image_url.length > 0)
    .map((img: any) => ({
      id: img.id,
      url: img.image_url,
      caption: img.caption,
      is_featured: img.is_featured
    }))

  // Get all image URLs for structured data
  const allImageUrls = [
    property.featured_image,
    ...mappedImages.map((img: any) => img.url)
  ].filter(Boolean)

  // Generate property schema
  const propertySchema = generatePropertySchema(property, allImageUrls)

  return (
    <>
      <Script
        id="property-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
      />
      <Navigation />
      <main className="min-h-screen bg-cream-50 pt-20">
        <PropertyDetailClient 
          property={property} 
          galleryImages={mappedImages}
          yachts={yachts as any[]}
        />
      </main>
      <Footer />
    </>
  )
}
