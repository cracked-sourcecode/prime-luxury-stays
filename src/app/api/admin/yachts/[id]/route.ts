import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateSession } from '@/lib/admin'
import { sql } from '@/lib/db'

// Auth check
async function checkAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  if (!token) return null
  return await validateSession(token)
}

// GET - Fetch single yacht
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const result = await sql`
      SELECT * FROM yachts WHERE id = ${parseInt(id)}
    `
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Yacht not found' }, { status: 404 })
    }
    
    const yacht = result[0]
    
    // Fetch images
    const images = await sql`
      SELECT * FROM yacht_images 
      WHERE yacht_id = ${yacht.id}
      ORDER BY display_order ASC
    `
    
    return NextResponse.json({ yacht: { ...yacht, images } })
  } catch (error) {
    console.error('Error fetching yacht:', error)
    return NextResponse.json({ error: 'Failed to fetch yacht' }, { status: 500 })
  }
}

// PUT - Update yacht
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
    const body = await request.json()
    const {
      name,
      slug,
      manufacturer,
      model,
      yacht_type,
      year_built,
      length_meters,
      beam_meters,
      guest_cabins,
      max_guests,
      crew_members,
      short_description,
      long_description,
      cruising_speed_knots,
      max_speed_knots,
      has_stabilizers,
      has_jet_ski,
      has_tender,
      has_water_toys,
      water_toys_list,
      has_jacuzzi,
      has_gym,
      has_wifi,
      has_air_conditioning,
      amenities,
      featured_image,
      home_port,
      region,
      cruising_area,
      price_per_day,
      price_per_week,
      is_active,
      is_featured
    } = body

    const result = await sql`
      UPDATE yachts SET
        name = COALESCE(${name}, name),
        slug = COALESCE(${slug}, slug),
        manufacturer = ${manufacturer ?? null},
        model = ${model ?? null},
        yacht_type = COALESCE(${yacht_type}, yacht_type),
        year_built = ${year_built ?? null},
        length_meters = ${length_meters ?? null},
        beam_meters = ${beam_meters ?? null},
        guest_cabins = ${guest_cabins ?? null},
        max_guests = ${max_guests ?? null},
        crew_members = ${crew_members ?? null},
        short_description = ${short_description ?? null},
        long_description = ${long_description ?? null},
        cruising_speed_knots = ${cruising_speed_knots ?? null},
        max_speed_knots = ${max_speed_knots ?? null},
        has_stabilizers = COALESCE(${has_stabilizers}, has_stabilizers),
        has_jet_ski = COALESCE(${has_jet_ski}, has_jet_ski),
        has_tender = COALESCE(${has_tender}, has_tender),
        has_water_toys = COALESCE(${has_water_toys}, has_water_toys),
        water_toys_list = ${water_toys_list ? JSON.stringify(water_toys_list) : null}::jsonb,
        has_jacuzzi = COALESCE(${has_jacuzzi}, has_jacuzzi),
        has_gym = COALESCE(${has_gym}, has_gym),
        has_wifi = COALESCE(${has_wifi}, has_wifi),
        has_air_conditioning = COALESCE(${has_air_conditioning}, has_air_conditioning),
        amenities = ${amenities ? JSON.stringify(amenities) : null}::jsonb,
        featured_image = ${featured_image ?? null},
        home_port = ${home_port ?? null},
        region = COALESCE(${region}, region),
        cruising_area = ${cruising_area ?? null},
        price_per_day = ${price_per_day ?? null},
        price_per_week = ${price_per_week ?? null},
        is_active = COALESCE(${is_active}, is_active),
        is_featured = COALESCE(${is_featured}, is_featured),
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Yacht not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, yacht: result[0] })
  } catch (error: any) {
    console.error('Error updating yacht:', error)
    if (error.message?.includes('unique constraint')) {
      return NextResponse.json({ error: 'A yacht with this slug already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update yacht' }, { status: 500 })
  }
}

// DELETE - Delete yacht
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    await sql`DELETE FROM yachts WHERE id = ${parseInt(id)}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting yacht:', error)
    return NextResponse.json({ error: 'Failed to delete yacht' }, { status: 500 })
  }
}
