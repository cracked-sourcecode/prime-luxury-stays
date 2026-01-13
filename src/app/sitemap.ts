import { MetadataRoute } from 'next'
import { sql } from '@/lib/db'

const SITE_URL = 'https://primeluxurystays.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all properties for dynamic sitemap
  let properties: any[] = []
  let destinations: any[] = []
  
  try {
    properties = await sql`
      SELECT slug, updated_at, created_at, featured_image FROM properties WHERE is_active = true OR is_active IS NULL
    `
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error)
  }

  try {
    // Get unique destinations from properties
    destinations = await sql`
      SELECT DISTINCT region FROM properties WHERE (is_active = true OR is_active IS NULL) AND region IS NOT NULL
    `
  } catch (error) {
    console.error('Error fetching destinations for sitemap:', error)
  }

  // Service slugs
  const servicesSlugs = [
    'private-aviation',
    'private-chef',
    'yacht-charter',
    'luxury-transport',
    'helicopter',
    'privacy-security',
    'table-reservations',
    'travel-bookings',
  ]

  // Static pages - Core site pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/destinations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/mallorca`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/ibiza`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/south-of-france`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/inquire`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/inquire/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/legal-notice`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Service pages
  const servicePages: MetadataRoute.Sitemap = servicesSlugs.map((slug) => ({
    url: `${SITE_URL}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Dynamic property pages - High priority as main content
  const propertyPages: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${SITE_URL}/properties/${property.slug}`,
    lastModified: property.updated_at || property.created_at || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Destination pages
  const destinationPages: MetadataRoute.Sitemap = destinations.map((dest) => ({
    url: `${SITE_URL}/destinations/${dest.region?.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }))

  return [...staticPages, ...propertyPages, ...servicePages, ...destinationPages]
}

