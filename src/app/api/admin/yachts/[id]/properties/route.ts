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

// GET - Fetch properties list and which are linked to this yacht
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
    const yachtId = parseInt(id)
    if (isNaN(yachtId)) {
      return NextResponse.json({ error: 'Invalid yacht ID' }, { status: 400 })
    }

    const [linkedRows, propertiesRows] = await Promise.all([
      sql`
        SELECT property_id FROM property_yacht_options
        WHERE yacht_id = ${yachtId}
      `,
      sql`
        SELECT id, name, slug, region, price_per_week
        FROM properties
        WHERE is_active = true
        ORDER BY name ASC
      `,
    ])

    const linkedPropertyIds = (linkedRows as { property_id: number }[]).map((r) => r.property_id)
    const properties = propertiesRows as { id: number; name: string; slug: string; region: string; price_per_week?: number }[]

    return NextResponse.json({
      linkedPropertyIds,
      properties,
    })
  } catch (error) {
    console.error('Error fetching yacht properties:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

// PUT - Update which properties are paired with this yacht
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
    const yachtId = parseInt(id)
    if (isNaN(yachtId)) {
      return NextResponse.json({ error: 'Invalid yacht ID' }, { status: 400 })
    }

    const body = await request.json()
    const propertyIds = Array.isArray(body.propertyIds) ? body.propertyIds.map((id: unknown) => parseInt(String(id))).filter((n: number) => !isNaN(n)) : []

    await sql`DELETE FROM property_yacht_options WHERE yacht_id = ${yachtId}`

    if (propertyIds.length > 0) {
      for (const propertyId of propertyIds) {
        await sql`
          INSERT INTO property_yacht_options (property_id, yacht_id, is_recommended)
          VALUES (${propertyId}, ${yachtId}, true)
          ON CONFLICT (property_id, yacht_id) DO NOTHING
        `
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating yacht properties:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
