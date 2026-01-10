import { sql } from './db';
import { unstable_noStore as noStore } from 'next/cache';

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
  price_per_week: number | null;
  price_per_week_high: number | null;
  has_pool: boolean;
  has_sea_view: boolean;
  has_ac: boolean;
  has_heating: boolean;
  has_wifi: boolean;
  is_beachfront: boolean;
  is_active: boolean;
  is_featured: boolean;
  is_hero_featured: boolean;
  video_url: string | null;
  min_stay_nights: number;
  // Distances
  distance_beach: string | null;
  distance_restaurants: string | null;
  distance_old_town: string | null;
  distance_airport: string | null;
  // German translations
  name_de: string | null;
  short_description_de: string | null;
  description_de: string | null;
  house_type_de: string | null;
  // Rental type
  is_monthly_rental: boolean;
  // Region zone for Mallorca categorization
  region_zone: string | null;
}

export async function getActiveProperties(): Promise<Property[]> {
  noStore(); // Opt out of caching
  // TEMPORARILY showing ALL properties to debug sync issue
  const properties = await sql`
    SELECT * FROM properties 
    ORDER BY is_featured DESC, name ASC
  `;
  return properties as Property[];
}

export async function getFeaturedProperties(): Promise<Property[]> {
  noStore(); // Opt out of caching
  const properties = await sql`
    SELECT * FROM properties 
    WHERE is_active = true AND is_featured = true 
    ORDER BY name ASC
    LIMIT 6
  `;
  return properties as Property[];
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  noStore(); // Opt out of caching
  // TEMPORARILY removed is_active filter to debug sync issue
  const properties = await sql`
    SELECT * FROM properties 
    WHERE slug = ${slug}
    LIMIT 1
  `;
  return properties[0] as Property || null;
}

export async function getAllPropertySlugs(): Promise<string[]> {
  noStore(); // Opt out of caching
  // TEMPORARILY showing all to debug sync issue
  const properties = await sql`
    SELECT slug FROM properties
  `;
  return properties.map((p: any) => p.slug);
}

export async function getHeroFeaturedProperty(): Promise<Property | null> {
  noStore(); // Opt out of caching
  // TEMPORARILY removed is_active filter to debug sync issue
  const properties = await sql`
    SELECT * FROM properties 
    WHERE is_hero_featured = true
    LIMIT 1
  `;
  return properties[0] as Property || null;
}

