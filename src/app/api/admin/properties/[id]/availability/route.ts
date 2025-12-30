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

// POST - Add availability period
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
    const data = await request.json();

    if (!data.start_date || !data.end_date || !data.price_per_week) {
      return NextResponse.json({ success: false, error: 'Start date, end date, and price are required' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO property_availability (
        property_id, start_date, end_date, price_per_week,
        price_per_night, min_nights, status, notes
      )
      VALUES (
        ${propertyId}, ${data.start_date}, ${data.end_date}, ${data.price_per_week},
        ${data.price_per_night || null}, ${data.min_nights || 7}, ${data.status || 'available'}, ${data.notes || null}
      )
      RETURNING id
    `;

    // Get property slug for revalidation
    const propertyData = await sql`SELECT slug FROM properties WHERE id = ${propertyId}`;
    const slug = propertyData[0]?.slug;
    
    // Revalidate affected pages
    revalidatePath('/properties');
    if (slug) revalidatePath(`/properties/${slug}`);

    return NextResponse.json({ success: true, id: result[0]?.id });
  } catch (error) {
    console.error('Add availability error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add availability' }, { status: 500 });
  }
}

