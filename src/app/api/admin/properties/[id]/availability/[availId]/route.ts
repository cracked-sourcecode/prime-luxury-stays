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
  params: Promise<{ id: string; availId: string }>;
}

// PUT - Update availability
export async function PUT(request: NextRequest, { params }: Props) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id, availId } = await params;
  const propertyId = parseInt(id, 10);
  const avId = parseInt(availId, 10);
  if (isNaN(avId)) {
    return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const data = await request.json();

    await sql`
      UPDATE property_availability SET
        start_date = ${data.start_date},
        end_date = ${data.end_date},
        price_per_week = ${data.price_per_week},
        price_per_night = ${data.price_per_night || null},
        min_nights = ${data.min_nights || 7},
        status = ${data.status || 'available'},
        notes = ${data.notes || null},
        updated_at = NOW()
      WHERE id = ${avId}
    `;

    // Get property slug for revalidation
    const propertyData = await sql`SELECT slug FROM properties WHERE id = ${propertyId}`;
    const slug = propertyData[0]?.slug;
    
    // Revalidate affected pages
    revalidatePath('/properties');
    if (slug) revalidatePath(`/properties/${slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update availability error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
  }
}

// DELETE - Delete availability
export async function DELETE(request: NextRequest, { params }: Props) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id, availId } = await params;
  const propertyId = parseInt(id, 10);
  const avId = parseInt(availId, 10);
  if (isNaN(avId)) {
    return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
  }

  try {
    // Get property slug before deletion for revalidation
    const propertyData = await sql`SELECT slug FROM properties WHERE id = ${propertyId}`;
    const slug = propertyData[0]?.slug;
    
    await sql`DELETE FROM property_availability WHERE id = ${avId}`;
    
    // Revalidate affected pages
    revalidatePath('/properties');
    if (slug) revalidatePath(`/properties/${slug}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete availability error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}
