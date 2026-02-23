import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateSession } from '@/lib/admin'
import { sql } from '@/lib/db'

async function checkAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  if (!token) return null
  return await validateSession(token)
}

// GET - Fetch yachts list and which are linked to this property
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const propertyId = parseInt(id, 10)
    if (isNaN(propertyId)) {
      return NextResponse.json({ error: 'Invalid property ID' }, { status: 400 })
    }

    const [linkedRows, yachtsRows] = await Promise.all([
      sql`
        SELECT yacht_id FROM property_yacht_options
        WHERE property_id = ${propertyId}
      `,
      sql`
        SELECT id, name, slug, manufacturer, model, year_built, length_meters, max_guests, region
        FROM yachts
        WHERE is_active = true
        ORDER BY name ASC
      `,
    ])

    const linkedYachtIds = (linkedRows as { yacht_id: number }[]).map((r) => r.yacht_id)
    const yachts = yachtsRows as { id: number; name: string; slug: string; manufacturer?: string; model?: string; year_built?: number; length_meters?: number; max_guests?: number; region?: string }[]

    return NextResponse.json({
      linkedYachtIds,
      yachts,
    })
  } catch (error) {
    console.error('Error fetching property yachts:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

// PUT - Update which yachts are paired with this property
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const propertyId = parseInt(id, 10)
    if (isNaN(propertyId)) {
      return NextResponse.json({ error: 'Invalid property ID' }, { status: 400 })
    }

    const body = await request.json()
    const yachtIds = Array.isArray(body.yachtIds) ? body.yachtIds.map((id: unknown) => parseInt(String(id))).filter((n: number) => !isNaN(n)) : []

    await sql`DELETE FROM property_yacht_options WHERE property_id = ${propertyId}`

    if (yachtIds.length > 0) {
      for (const yachtId of yachtIds) {
        await sql`
          INSERT INTO property_yacht_options (property_id, yacht_id, is_recommended)
          VALUES (${propertyId}, ${yachtId}, true)
          ON CONFLICT (property_id, yacht_id) DO NOTHING
        `
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating property yachts:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
