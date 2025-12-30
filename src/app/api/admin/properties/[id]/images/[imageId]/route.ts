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
  params: Promise<{ id: string; imageId: string }>;
}

// DELETE - Delete image
export async function DELETE(request: NextRequest, { params }: Props) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id, imageId } = await params;
  const propertyId = parseInt(id, 10);
  const imgId = parseInt(imageId, 10);
  if (isNaN(imgId)) {
    return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
  }

  try {
    // Get property slug before deletion for revalidation
    const propertyData = await sql`SELECT slug FROM properties WHERE id = ${propertyId}`;
    const slug = propertyData[0]?.slug;
    
    await sql`DELETE FROM property_images WHERE id = ${imgId}`;
    
    // Revalidate affected pages
    revalidatePath('/');
    revalidatePath('/properties');
    if (slug) revalidatePath(`/properties/${slug}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete image' }, { status: 500 });
  }
}

