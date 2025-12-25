import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const deals = await sql`
      SELECT * FROM deals ORDER BY created_at DESC
    `
    return NextResponse.json({ deals })
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title, value, stage, customer_id, customer_name, customer_email,
      property_id, property_name, check_in, check_out, guests, notes,
      probability, expected_close_date, owner, source
    } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO deals (
        title, value, stage, customer_id, customer_name, customer_email,
        property_id, property_name, check_in, check_out, guests, notes,
        probability, expected_close_date, owner, source
      ) VALUES (
        ${title},
        ${value || null},
        ${stage || 'lead'},
        ${customer_id || null},
        ${customer_name || null},
        ${customer_email || null},
        ${property_id || null},
        ${property_name || null},
        ${check_in || null},
        ${check_out || null},
        ${guests || null},
        ${notes || null},
        ${probability || 10},
        ${expected_close_date || null},
        ${owner || null},
        ${source || null}
      )
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error('Error creating deal:', error)
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 })
  }
}

