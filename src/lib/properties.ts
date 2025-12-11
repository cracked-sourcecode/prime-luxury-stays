import { sql } from './db';

export interface Property {
  id: number;
  name: string;
  slug: string;
  house_type: string;
  license_number: string | null;
  registry_number: string | null;
  address: string | null;
  city: string | null;
  region: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  max_guests: number | null;
  description: string | null;
  short_description: string | null;
  featured_image: string | null;
  images: string[] | null;
  website_url: string | null;
  has_pool: boolean;
  has_sea_view: boolean;
  has_ac: boolean;
  has_heating: boolean;
  has_wifi: boolean;
  is_beachfront: boolean;
  is_active: boolean;
  is_featured: boolean;
  min_stay_nights: number;
}

export async function getActiveProperties(): Promise<Property[]> {
  const properties = await sql`
    SELECT * FROM properties 
    WHERE is_active = true 
    ORDER BY is_featured DESC, name ASC
  `;
  return properties as Property[];
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const properties = await sql`
    SELECT * FROM properties 
    WHERE is_active = true AND is_featured = true 
    ORDER BY name ASC
    LIMIT 6
  `;
  return properties as Property[];
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const properties = await sql`
    SELECT * FROM properties 
    WHERE slug = ${slug} AND is_active = true
    LIMIT 1
  `;
  return properties[0] as Property || null;
}

export async function getAllPropertySlugs(): Promise<string[]> {
  const properties = await sql`
    SELECT slug FROM properties WHERE is_active = true
  `;
  return properties.map((p: any) => p.slug);
}

