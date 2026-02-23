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

// GET - Fetch all yachts (admin)
export async function GET(request: NextRequest) {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'
    
    let yachts
    if (includeInactive) {
      yachts = await sql`SELECT * FROM yachts ORDER BY created_at DESC`
    } else {
      yachts = await sql`SELECT * FROM yachts WHERE is_active = true ORDER BY name ASC`
    }
    
    // Fetch images for each yacht
    const yachtsWithImages = await Promise.all(
      yachts.map(async (yacht: any) => {
        const images = await sql`
          SELECT * FROM yacht_images 
          WHERE yacht_id = ${yacht.id}
          ORDER BY display_order ASC
        `
        return { ...yacht, images }
      })
    )
    
    return NextResponse.json({ yachts: yachtsWithImages })
  } catch (error) {
    console.error('Error fetching yachts:', error)
    return NextResponse.json({ error: 'Failed to fetch yachts' }, { status: 500 })
  }
}

// POST - Create new yacht
export async function POST(request: NextRequest) {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
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
      long_description_de,
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
      extras,
      featured_image,
      home_port,
      region,
      cruising_area,
      price_per_day,
      price_per_week,
      is_active,
      is_featured
    } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO yachts (
        name, slug, manufacturer, model, yacht_type, year_built,
        length_meters, beam_meters, guest_cabins, max_guests, crew_members,
        short_description, short_description_de,
        long_description, long_description_de,
        cruising_speed_knots, max_speed_knots,
        has_stabilizers, has_jet_ski, has_tender, has_water_toys, water_toys_list,
        has_jacuzzi, has_gym, has_wifi, has_air_conditioning, amenities,
        extras, featured_image, home_port, region, cruising_area,
        price_per_day, price_per_week, is_active, is_featured
      ) VALUES (
        ${name}, ${slug}, ${manufacturer || null}, ${model || null}, ${yacht_type || 'Motor Yacht'}, ${year_built || null},
        ${length_meters || null}, ${beam_meters || null}, ${guest_cabins || null}, ${max_guests || null}, ${crew_members || null},
        ${short_description || null}, ${short_description_de || null},
        ${long_description || null}, ${long_description_de || null},
        ${cruising_speed_knots || null}, ${max_speed_knots || null},
        ${has_stabilizers || false}, ${has_jet_ski || false}, ${has_tender || false}, ${has_water_toys || false}, ${water_toys_list ? JSON.stringify(water_toys_list) : '[]'}::jsonb,
        ${has_jacuzzi || false}, ${has_gym || false}, ${has_wifi !== false}, ${has_air_conditioning !== false}, ${amenities ? JSON.stringify(amenities) : '[]'}::jsonb,
        ${extras || null},
        ${featured_image || null}, ${home_port || null}, ${region || 'Mallorca'}, ${cruising_area || null},
        ${price_per_day || null}, ${price_per_week || null}, ${is_active !== false}, ${is_featured || false}
      )
      RETURNING *
    `

    return NextResponse.json({ success: true, yacht: result[0] })
  } catch (error: any) {
    console.error('Error creating yacht:', error)
    if (error.message?.includes('unique constraint')) {
      return NextResponse.json({ error: 'A yacht with this slug already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create yacht' }, { status: 500 })
  }
}
