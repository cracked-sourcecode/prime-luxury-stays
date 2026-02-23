import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// GET - Fetch all active yachts (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const destination = searchParams.get('destination')
    const featured = searchParams.get('featured')
    
    let yachts
    if (featured === 'true') {
      yachts = await sql`
        SELECT 
          id, name, slug, manufacturer, model, yacht_type, year_built,
          length_meters, beam_meters, draft_meters, guest_cabins, max_guests, crew_members,
          long_description AS description, short_description, short_description_de, long_description_de,
          cruising_speed_knots, max_speed_knots, has_stabilizers,
          water_toys_list, has_jacuzzi, has_gym, has_wifi, has_air_conditioning,
          amenities, featured_image, home_port, region, cruising_area,
          price_per_day, price_per_week, is_active, is_featured,
          has_jet_ski, has_tender, has_water_toys
        FROM yachts 
        WHERE is_active = true AND is_featured = true
        ORDER BY name ASC
      `
    } else if (destination) {
      yachts = await sql`
        SELECT 
          id, name, slug, manufacturer, model, yacht_type, year_built,
          length_meters, beam_meters, draft_meters, guest_cabins, max_guests, crew_members,
          long_description AS description, short_description, short_description_de, long_description_de,
          cruising_speed_knots, max_speed_knots, has_stabilizers,
          water_toys_list, has_jacuzzi, has_gym, has_wifi, has_air_conditioning,
          amenities, featured_image, home_port, region, cruising_area,
          price_per_day, price_per_week, is_active, is_featured,
          has_jet_ski, has_tender, has_water_toys
        FROM yachts 
        WHERE is_active = true AND region = ${destination}
        ORDER BY name ASC
      `
    } else {
      yachts = await sql`
        SELECT 
          id, name, slug, manufacturer, model, yacht_type, year_built,
          length_meters, beam_meters, draft_meters, guest_cabins, max_guests, crew_members,
          long_description AS description, short_description, short_description_de, long_description_de,
          cruising_speed_knots, max_speed_knots, has_stabilizers,
          water_toys_list, has_jacuzzi, has_gym, has_wifi, has_air_conditioning,
          amenities, featured_image, home_port, region, cruising_area,
          price_per_day, price_per_week, is_active, is_featured,
          has_jet_ski, has_tender, has_water_toys
        FROM yachts 
        WHERE is_active = true
        ORDER BY name ASC
      `
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
