import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// GET - Fetch single yacht by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const result = await sql`
      SELECT * FROM yachts 
      WHERE slug = ${slug} AND is_active = true
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
    
    // Fetch recommended properties for this yacht's destination
    const recommendedProperties = await sql`
      SELECT p.id, p.name, p.slug, p.featured_image, p.short_description, p.bedrooms, p.max_guests, p.region
      FROM properties p
      INNER JOIN property_yacht_options pyo ON p.id = pyo.property_id
      WHERE pyo.yacht_id = ${yacht.id} AND p.is_active = true
      ORDER BY pyo.is_recommended DESC
      LIMIT 4
    `
    
    return NextResponse.json({ 
      yacht: { ...yacht, images },
      recommendedProperties
    })
  } catch (error) {
    console.error('Error fetching yacht:', error)
    return NextResponse.json({ error: 'Failed to fetch yacht' }, { status: 500 })
  }
}
