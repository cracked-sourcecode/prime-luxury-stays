import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

interface Props {
  params: Promise<{ slug: string }>;
}

// GET - Fetch availability for a property (public endpoint)
export async function GET(request: NextRequest, { params }: Props) {
  const { slug } = await params;

  try {
    // First get the property ID from slug
    const properties = await sql`
      SELECT id FROM properties WHERE slug = ${slug} AND is_active = true LIMIT 1
    `;

    if (properties.length === 0) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    const propertyId = properties[0].id;

    // Fetch availability periods (only future dates)
    const availability = await sql`
      SELECT 
        id,
        start_date,
        end_date,
        price_per_week,
        price_per_night,
        min_nights,
        status
      FROM property_availability 
      WHERE property_id = ${propertyId}
        AND end_date >= CURRENT_DATE
      ORDER BY start_date ASC
    `;

    return NextResponse.json({ 
      success: true, 
      availability: availability.map((a: any) => ({
        ...a,
        start_date: a.start_date.toISOString().split('T')[0],
        end_date: a.end_date.toISOString().split('T')[0],
      }))
    });
  } catch (error) {
    console.error('Fetch availability error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch availability' }, { status: 500 });
  }
}

