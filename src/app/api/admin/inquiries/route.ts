import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const inquiries = await sql`
      SELECT id, full_name, email, phone, property_slug, property_name, 
             check_in, check_out, guests, message, status, created_at
      FROM inquiries
      ORDER BY created_at DESC
    `
    
    return NextResponse.json({ inquiries })
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 })
  }
}

