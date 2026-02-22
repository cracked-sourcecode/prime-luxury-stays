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

// Normalize DB row to client-expected field names
function normalizeYacht(row: any) {
  if (!row) return row
  const { long_description, ...rest } = row
  return { ...rest, description: long_description ?? rest.description }
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
      SELECT 
        id, name, slug, manufacturer, model, yacht_type, year_built,
        length_meters, beam_meters, draft_meters, guest_cabins, max_guests, crew_members,
        long_description AS description, short_description,
        cruising_speed_knots, max_speed_knots, has_stabilizers,
        water_toys_list, has_jacuzzi, has_gym, has_wifi, has_air_conditioning,
        amenities, featured_image, home_port, region, cruising_area,
        price_per_day, price_per_week, is_active, is_featured,
        has_jet_ski, has_tender, has_water_toys,
        created_at, updated_at
      FROM yachts WHERE id = ${parseInt(id)}
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
      short_description_de,
      long_description,
      description_de,
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
        manufacturer = COALESCE(${manufacturer}, manufacturer),
        model = COALESCE(${model}, model),
        yacht_type = COALESCE(${yacht_type}, yacht_type),
        year_built = COALESCE(${year_built}, year_built),
        length_meters = COALESCE(${length_meters}, length_meters),
        beam_meters = COALESCE(${beam_meters}, beam_meters),
        guest_cabins = COALESCE(${guest_cabins}, guest_cabins),
        max_guests = COALESCE(${max_guests}, max_guests),
        crew_members = COALESCE(${crew_members}, crew_members),
        short_description = COALESCE(${short_description}, short_description),
        long_description = COALESCE(${long_description}, long_description),
        cruising_speed_knots = COALESCE(${cruising_speed_knots}, cruising_speed_knots),
        max_speed_knots = COALESCE(${max_speed_knots}, max_speed_knots),
        has_stabilizers = COALESCE(${has_stabilizers}, has_stabilizers),
        has_jet_ski = COALESCE(${has_jet_ski}, has_jet_ski),
        has_tender = COALESCE(${has_tender}, has_tender),
        has_water_toys = COALESCE(${has_water_toys}, has_water_toys),
        water_toys_list = COALESCE(${water_toys_list ? JSON.stringify(water_toys_list) : null}::jsonb, water_toys_list),
        has_jacuzzi = COALESCE(${has_jacuzzi}, has_jacuzzi),
        has_gym = COALESCE(${has_gym}, has_gym),
        has_wifi = COALESCE(${has_wifi}, has_wifi),
        has_air_conditioning = COALESCE(${has_air_conditioning}, has_air_conditioning),
        amenities = COALESCE(${amenities ? JSON.stringify(amenities) : null}::jsonb, amenities),
        featured_image = COALESCE(NULLIF(${featured_image}, ''), featured_image),
        home_port = COALESCE(${home_port}, home_port),
        region = COALESCE(${region}, region),
        cruising_area = COALESCE(${cruising_area}, cruising_area),
        price_per_day = COALESCE(${price_per_day}, price_per_day),
        price_per_week = COALESCE(${price_per_week}, price_per_week),
        is_active = COALESCE(${is_active}, is_active),
        is_featured = COALESCE(${is_featured}, is_featured),
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Yacht not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, yacht: normalizeYacht(result[0]) })
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
