import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/admin';
import { sql } from '@/lib/db';

// Middleware to check auth
async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return null;
  return await validateSession(token);
}

// GET - Fetch all properties for dropdown selection
export async function GET() {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const properties = await sql`
      SELECT 
        id, 
        name, 
        slug, 
        region,
        price_per_week,
        price_per_week_high
      FROM properties 
      WHERE is_active = true
      ORDER BY name ASC
    `;

    return NextResponse.json({ 
      success: true, 
      properties 
    });
  } catch (error) {
    console.error('Error fetching properties list:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch properties' }, { status: 500 });
  }
}
