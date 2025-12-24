import { MetadataRoute } from 'next'
import { sql } from '@/lib/db'

const SITE_URL = 'https://primeluxurystays.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all properties for dynamic sitemap
  let properties: any[] = []
  try {
    properties = await sql`
      SELECT slug, updated_at, created_at FROM properties WHERE status = 'active'
    `
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error)
  }

  // Static pages
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
      priority: 0.9,
    },
  ]

  // Dynamic property pages
  const propertyPages: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${SITE_URL}/properties/${property.slug}`,
    lastModified: property.updated_at || property.created_at || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...propertyPages]
}

