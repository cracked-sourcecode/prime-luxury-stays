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

export async function GET() {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
