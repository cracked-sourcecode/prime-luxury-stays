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
        SELECT * FROM yachts 
        WHERE is_active = true AND is_featured = true
        ORDER BY name ASC
      `
    } else if (destination) {
      yachts = await sql`
        SELECT * FROM yachts 
        WHERE is_active = true 
        AND (destination = ${destination} OR available_destinations ? ${destination})
        ORDER BY name ASC
      `
    } else {
      yachts = await sql`
        SELECT * FROM yachts 
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
