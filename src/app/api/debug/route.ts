import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// DEBUG endpoint - shows all properties and their is_active status
export async function GET() {
  try {
    // Get ALL properties regardless of is_active status
    const allProperties = await sql`
      SELECT id, name, slug, is_active, is_featured, region, 
             (SELECT COUNT(*) FROM property_images WHERE property_id = properties.id) as image_count
      FROM properties 
      ORDER BY id ASC
    `
    
    // Get count of properties that WOULD show on website
    const activeProperties = await sql`
      SELECT id, name FROM properties 
      WHERE is_active = true OR is_active IS NULL
    `
    
    // Get all images
    const allImages = await sql`
      SELECT id, property_id, image_url, display_order FROM property_images 
      ORDER BY property_id, display_order LIMIT 50
    `
    
    return NextResponse.json({
      total_in_database: allProperties.length,
      showing_on_website: activeProperties.length,
      properties: allProperties,
      sample_images: allImages,
      filter_query: "WHERE is_active = true OR is_active IS NULL"
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

