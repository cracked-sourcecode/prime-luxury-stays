import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const customers = await sql`
      SELECT id, name, email, phone, notes, source, status, created_at
      FROM customers
      ORDER BY name ASC
    `
    
    return NextResponse.json({ customers })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, notes } = body
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    
    const result = await sql`
      INSERT INTO customers (name, email, phone, notes, source)
      VALUES (${name}, ${email || null}, ${phone || null}, ${notes || null}, 'manual')
      RETURNING id
    `
    
    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}
