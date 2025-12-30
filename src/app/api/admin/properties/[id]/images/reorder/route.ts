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

// POST - Reorder images
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
    // Expect array of { id: number, display_order: number }
    const { images } = await request.json();

    if (!Array.isArray(images)) {
      return NextResponse.json({ success: false, error: 'Images array required' }, { status: 400 });
    }

    // Update each image's display_order
    for (const img of images) {
      await sql`
        UPDATE property_images 
        SET display_order = ${img.display_order}
        WHERE id = ${img.id} AND property_id = ${propertyId}
      `;
    }

    // Get property slug for revalidation
    const propertyData = await sql`SELECT slug FROM properties WHERE id = ${propertyId}`;
    const slug = propertyData[0]?.slug;
    
    // Revalidate affected pages
    revalidatePath('/');
    revalidatePath('/properties');
    if (slug) revalidatePath(`/properties/${slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reorder images error:', error);
    return NextResponse.json({ success: false, error: 'Failed to reorder images' }, { status: 500 });
  }
}

