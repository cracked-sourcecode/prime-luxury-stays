import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { validateSession, createProperty } from '@/lib/admin';
import { sql } from '@/lib/db';

// Middleware to check auth
async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return null;
  return await validateSession(token);
}

// POST - Create new property
export async function POST(request: NextRequest) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.slug) {
      return NextResponse.json({ success: false, error: 'Name and slug are required' }, { status: 400 });
    }

    // Check if slug already exists
    const existing = await sql`SELECT id FROM properties WHERE slug = ${data.slug}`;
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 400 });
    }

    // Create property
    const result = await sql`
      INSERT INTO properties (
        name, slug, house_type, license_number, registry_number,
        address, city, region, country, latitude, longitude,
        bedrooms, bathrooms, max_guests, description, short_description,
        featured_image, website_url, price_per_week, price_per_week_high,
        has_pool, has_sea_view, has_ac,
        has_heating, has_wifi, is_beachfront, is_active, is_featured, min_stay_nights,
        distance_beach, distance_restaurants, distance_old_town, distance_airport,
        name_de, short_description_de, description_de, house_type_de
      ) VALUES (
        ${data.name}, ${data.slug}, ${data.house_type || 'Villa'}, ${data.license_number || null}, ${data.registry_number || null},
        ${data.address || null}, ${data.city || null}, ${data.region || 'Mallorca'}, ${data.country || 'Spain'},
        ${data.latitude || null}, ${data.longitude || null},
        ${data.bedrooms || null}, ${data.bathrooms || null}, ${data.max_guests || null},
        ${data.description || null}, ${data.short_description || null},
        ${data.featured_image || null}, ${data.website_url || null},
        ${data.price_per_week || null}, ${data.price_per_week_high || null},
        ${data.has_pool || false}, ${data.has_sea_view || false}, ${data.has_ac || false},
        ${data.has_heating || false}, ${data.has_wifi || false}, ${data.is_beachfront || false},
        ${data.is_active ?? true}, ${data.is_featured || false}, ${data.min_stay_nights || 7},
        ${data.distance_beach || null}, ${data.distance_restaurants || null}, ${data.distance_old_town || null}, ${data.distance_airport || null},
        ${data.name_de || null}, ${data.short_description_de || null}, ${data.description_de || null}, ${data.house_type_de || null}
      )
      RETURNING id
    `;

    // Revalidate all affected pages
    revalidatePath('/');
    revalidatePath('/properties');
    revalidatePath('/mallorca');
    revalidatePath('/ibiza');
    revalidatePath('/south-of-france');

    return NextResponse.json({ success: true, id: result[0]?.id });
  } catch (error) {
    console.error('Create property error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create property' }, { status: 500 });
  }
}

