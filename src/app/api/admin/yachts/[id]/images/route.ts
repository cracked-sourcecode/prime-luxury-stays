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

// GET - Fetch images for a yacht
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
    const images = await sql`
      SELECT * FROM yacht_images 
      WHERE yacht_id = ${parseInt(id)}
      ORDER BY display_order ASC
    `
    
    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error fetching yacht images:', error)
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}

// POST - Add image to yacht
export async function POST(
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
      image_url,
      storage_bucket,
      storage_path,
      caption,
      caption_de,
      alt_text,
      alt_text_de,
      display_order,
      is_featured,
      image_type
    } = body

    if (!image_url) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    // Get the max display order if not provided
    let order = display_order
    if (order === undefined) {
      const maxOrder = await sql`
        SELECT COALESCE(MAX(display_order), 0) + 1 as next_order 
        FROM yacht_images WHERE yacht_id = ${parseInt(id)}
      `
      order = maxOrder[0]?.next_order || 0
    }

    // If this is a featured image, unset any existing featured image
    if (is_featured) {
      await sql`
        UPDATE yacht_images SET is_featured = false 
        WHERE yacht_id = ${parseInt(id)}
      `
      
      // Also update the yacht's featured_image field
      await sql`
        UPDATE yachts SET featured_image = ${image_url}, updated_at = NOW()
        WHERE id = ${parseInt(id)}
      `
    }

    const result = await sql`
      INSERT INTO yacht_images (
        yacht_id, image_url, storage_bucket, storage_path,
        caption, caption_de, alt_text, alt_text_de,
        display_order, is_featured, image_type
      ) VALUES (
        ${parseInt(id)}, ${image_url}, ${storage_bucket || null}, ${storage_path || null},
        ${caption || null}, ${caption_de || null}, ${alt_text || null}, ${alt_text_de || null},
        ${order}, ${is_featured || false}, ${image_type || 'gallery'}
      )
      RETURNING *
    `

    return NextResponse.json({ success: true, image: result[0] })
  } catch (error) {
    console.error('Error adding yacht image:', error)
    return NextResponse.json({ error: 'Failed to add image' }, { status: 500 })
  }
}

// DELETE - Remove all images from yacht (for bulk operations)
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
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')
    
    if (imageId) {
      // Delete specific image
      await sql`DELETE FROM yacht_images WHERE id = ${parseInt(imageId)} AND yacht_id = ${parseInt(id)}`
    } else {
      // Delete all images for this yacht
      await sql`DELETE FROM yacht_images WHERE yacht_id = ${parseInt(id)}`
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting yacht images:', error)
    return NextResponse.json({ error: 'Failed to delete images' }, { status: 500 })
  }
}
