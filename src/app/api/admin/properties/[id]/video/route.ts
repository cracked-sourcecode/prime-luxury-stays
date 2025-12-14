import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/admin';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || '');

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return null;
  return await validateSession(token);
}

// PUT - Update property video
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const propertyId = parseInt(id);
    const { video_url } = await request.json();

    await sql`
      UPDATE properties 
      SET video_url = ${video_url || null}
      WHERE id = ${propertyId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json({ success: false, error: 'Failed to update video' }, { status: 500 });
  }
}

// DELETE - Remove property video
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const propertyId = parseInt(id);

    await sql`
      UPDATE properties 
      SET video_url = NULL
      WHERE id = ${propertyId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing video:', error);
    return NextResponse.json({ success: false, error: 'Failed to remove video' }, { status: 500 });
  }
}

