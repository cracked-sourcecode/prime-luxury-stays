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

// POST - Set this property as the hero featured (only one can be hero featured)
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
    // First, unset all hero featured
    await sql`UPDATE properties SET is_hero_featured = false`;
    
    // Then set this one as hero featured
    await sql`UPDATE properties SET is_hero_featured = true WHERE id = ${propertyId}`;

    // Revalidate homepage to show new hero property
    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Set hero featured error:', error);
    return NextResponse.json({ success: false, error: 'Failed to set hero featured' }, { status: 500 });
  }
}

