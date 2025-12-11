import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/admin';
import { sql } from '@/lib/db';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return null;
  return await validateSession(token);
}

interface Props {
  params: Promise<{ id: string; imageId: string }>;
}

// POST - Set featured image
export async function POST(request: NextRequest, { params }: Props) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id, imageId } = await params;
  const propertyId = parseInt(id, 10);
  const imgId = parseInt(imageId, 10);
  
  if (isNaN(propertyId) || isNaN(imgId)) {
    return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
  }

  try {
    // Unset all featured for this property
    await sql`UPDATE property_images SET is_featured = false WHERE property_id = ${propertyId}`;
    
    // Set new featured
    const images = await sql`
      UPDATE property_images SET is_featured = true WHERE id = ${imgId}
      RETURNING image_url
    `;
    
    // Update property featured_image
    if (images[0]) {
      await sql`UPDATE properties SET featured_image = ${images[0].image_url} WHERE id = ${propertyId}`;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Set featured error:', error);
    return NextResponse.json({ success: false, error: 'Failed to set featured' }, { status: 500 });
  }
}

