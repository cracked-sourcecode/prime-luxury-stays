import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { validateSession } from '@/lib/admin';
import { sql } from '@/lib/db';

// Middleware to check auth
async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return null;
  return await validateSession(token);
}

interface Props {
  params: Promise<{ id: string }>;
}

// PUT - Update property
export async function PUT(request: NextRequest, { params }: Props) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const propertyId = parseInt(id, 10);
  if (isNaN(propertyId)) {
    return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const data = await request.json();

    await sql`
      UPDATE properties SET
        name = ${data.name},
        slug = ${data.slug},
        house_type = ${data.house_type || 'Villa'},
        license_number = ${data.license_number || null},
        registry_number = ${data.registry_number || null},
        address = ${data.address || null},
        city = ${data.city || null},
        region = ${data.region || 'Mallorca'},
        country = ${data.country || 'Spain'},
        latitude = ${data.latitude || null},
        longitude = ${data.longitude || null},
        bedrooms = ${data.bedrooms || null},
        bathrooms = ${data.bathrooms || null},
        max_guests = ${data.max_guests || null},
        description = ${data.description || null},
        short_description = ${data.short_description || null},
        featured_image = ${data.featured_image || null},
        website_url = ${data.website_url || null},
        price_per_week = ${data.price_per_week || null},
        price_per_week_high = ${data.price_per_week_high || null},
        has_pool = ${data.has_pool || false},
        has_sea_view = ${data.has_sea_view || false},
        has_ac = ${data.has_ac || false},
        has_heating = ${data.has_heating || false},
        has_wifi = ${data.has_wifi || false},
        has_parking = ${data.has_parking ?? true},
        has_smart_home = ${data.has_smart_home ?? true},
        has_kitchen = ${data.has_kitchen ?? true},
        is_beachfront = ${data.is_beachfront || false},
        is_active = ${data.is_active ?? true},
        is_featured = ${data.is_featured || false},
        is_monthly_rental = ${data.is_monthly_rental || false},
        region_zone = ${data.region_zone || null},
        min_stay_nights = ${data.min_stay_nights || 7},
        distance_beach = ${data.distance_beach || null},
        distance_restaurants = ${data.distance_restaurants || null},
        distance_old_town = ${data.distance_old_town || null},
        distance_airport = ${data.distance_airport || null},
        name_de = ${data.name_de || null},
        short_description_de = ${data.short_description_de || null},
        description_de = ${data.description_de || null},
        house_type_de = ${data.house_type_de || null},
        cleaning_fee = ${data.cleaning_fee || null},
        deposit_amount = ${data.deposit_amount || null},
        pool_heating_fee = ${data.pool_heating_fee || null},
        notes = ${data.notes || null},
        notes_de = ${data.notes_de || null},
        key_features = ${data.key_features || null},
        key_features_de = ${data.key_features_de || null},
        updated_at = NOW()
      WHERE id = ${propertyId}
    `;

    // Revalidate all affected pages
    revalidatePath('/');
    revalidatePath('/properties');
    revalidatePath(`/properties/${data.slug}`);
    revalidatePath('/mallorca');
    revalidatePath('/ibiza');
    revalidatePath('/south-of-france');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update property error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update property' }, { status: 500 });
  }
}

// DELETE - Delete property
export async function DELETE(request: NextRequest, { params }: Props) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const propertyId = parseInt(id, 10);
  if (isNaN(propertyId)) {
    return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
  }

  try {
    await sql`DELETE FROM properties WHERE id = ${propertyId}`;
    
    // Revalidate all affected pages
    revalidatePath('/');
    revalidatePath('/properties');
    revalidatePath('/mallorca');
    revalidatePath('/ibiza');
    revalidatePath('/south-of-france');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete property error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete property' }, { status: 500 });
  }
}

