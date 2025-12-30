import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { validateSession } from '@/lib/admin';
import { sql } from '@/lib/db';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return null;
  return await validateSession(token);
}

interface Props {
  params: Promise<{ id: string }>;
}

// POST - Add image
export async function POST(request: NextRequest, { params }: Props) {
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
    const { image_url, caption, alt_text, is_featured, image_type } = await request.json();

    if (!image_url) {
      return NextResponse.json({ success: false, error: 'Image URL required' }, { status: 400 });
    }

    // Parse GCS URL for bucket/path
    let storageBucket = null;
    let storagePath = null;
    const match = image_url.match(/https:\/\/storage\.googleapis\.com\/([^\/]+)\/(.+)/);
    if (match) {
      storageBucket = match[1];
      storagePath = match[2];
    }

    // Get max display order
    const maxOrder = await sql`
      SELECT COALESCE(MAX(display_order), 0) as max_order 
      FROM property_images 
      WHERE property_id = ${propertyId}
    `;
    
    const displayOrder = (maxOrder[0]?.max_order || 0) + 1;

    const result = await sql`
      INSERT INTO property_images (
        property_id, image_url, storage_bucket, storage_path,
        caption, alt_text, display_order, is_featured, image_type
      )
      VALUES (
        ${propertyId}, ${image_url}, ${storageBucket}, ${storagePath},
        ${caption || null}, ${alt_text || null}, ${displayOrder}, 
        ${is_featured || false}, ${image_type || 'gallery'}
      )
      RETURNING id
    `;

    // If this is the first image or featured, update property's featured_image
    if (is_featured || displayOrder === 1) {
      await sql`UPDATE properties SET featured_image = ${image_url} WHERE id = ${propertyId}`;
    }

    // Get property slug for revalidation
    const propertyData = await sql`SELECT slug FROM properties WHERE id = ${propertyId}`;
    const slug = propertyData[0]?.slug;
    
    // Revalidate affected pages
    revalidatePath('/');
    revalidatePath('/properties');
    if (slug) revalidatePath(`/properties/${slug}`);
    revalidatePath('/mallorca');
    revalidatePath('/ibiza');
    revalidatePath('/south-of-france');

    return NextResponse.json({ success: true, id: result[0]?.id });
  } catch (error) {
    console.error('Add image error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add image' }, { status: 500 });
  }
}

