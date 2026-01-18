import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const result = await sql`SELECT * FROM deals WHERE id = ${id}`
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }
    
    return NextResponse.json({ deal: result[0] })
  } catch (error) {
    console.error('Error fetching deal:', error)
    return NextResponse.json({ error: 'Failed to fetch deal' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    
    const {
      title, value, stage, customer_id, customer_name, customer_email,
      property_id, property_name, check_in, check_out, guests, notes,
      probability, expected_close_date, owner, source
    } = body

    // Build dynamic update
    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (title !== undefined) { updates.push(`title = $${paramCount++}`); values.push(title) }
    if (value !== undefined) { updates.push(`value = $${paramCount++}`); values.push(value) }
    if (stage !== undefined) { 
      updates.push(`stage = $${paramCount++}`); 
      values.push(stage)
      // Set closed_at for won/lost
      if (stage === 'won' || stage === 'lost') {
        updates.push(`closed_at = NOW()`)
      }
    }
    if (customer_id !== undefined) { updates.push(`customer_id = $${paramCount++}`); values.push(customer_id) }
    if (customer_name !== undefined) { updates.push(`customer_name = $${paramCount++}`); values.push(customer_name) }
    if (customer_email !== undefined) { updates.push(`customer_email = $${paramCount++}`); values.push(customer_email) }
    if (property_id !== undefined) { updates.push(`property_id = $${paramCount++}`); values.push(property_id) }
    if (property_name !== undefined) { updates.push(`property_name = $${paramCount++}`); values.push(property_name) }
    if (check_in !== undefined) { updates.push(`check_in = $${paramCount++}`); values.push(check_in) }
    if (check_out !== undefined) { updates.push(`check_out = $${paramCount++}`); values.push(check_out) }
    if (guests !== undefined) { updates.push(`guests = $${paramCount++}`); values.push(guests) }
    if (notes !== undefined) { updates.push(`notes = $${paramCount++}`); values.push(notes) }
    if (probability !== undefined) { updates.push(`probability = $${paramCount++}`); values.push(probability) }
    if (expected_close_date !== undefined) { updates.push(`expected_close_date = $${paramCount++}`); values.push(expected_close_date) }
    if (owner !== undefined) { updates.push(`owner = $${paramCount++}`); values.push(owner) }
    if (source !== undefined) { updates.push(`source = $${paramCount++}`); values.push(source) }

    updates.push('updated_at = NOW()')

    // Simple update for stage changes (most common)
    if (stage !== undefined && Object.keys(body).length === 1) {
      if (stage === 'won' || stage === 'lost') {
        await sql`
          UPDATE deals 
          SET stage = ${stage}, updated_at = NOW(), closed_at = NOW()
          WHERE id = ${id}
        `
      } else {
        await sql`
          UPDATE deals 
          SET stage = ${stage}, updated_at = NOW()
          WHERE id = ${id}
        `
      }
    } else {
      // Full update - handle customer_id properly
      await sql`
        UPDATE deals SET
          title = COALESCE(${title}, title),
          value = ${value !== undefined ? value : null},
          stage = COALESCE(${stage}, stage),
          customer_id = ${customer_id !== undefined ? customer_id : null},
          customer_name = ${customer_name !== undefined ? customer_name : null},
          customer_email = ${customer_email !== undefined ? customer_email : null},
          property_name = ${property_name !== undefined ? property_name : null},
          check_in = ${check_in !== undefined ? check_in : null},
          check_out = ${check_out !== undefined ? check_out : null},
          guests = ${guests !== undefined ? guests : null},
          notes = ${notes !== undefined ? notes : null},
          probability = COALESCE(${probability}, probability),
          updated_at = NOW()
        WHERE id = ${id}
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating deal:', error)
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    await sql`DELETE FROM deals WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting deal:', error)
    return NextResponse.json({ error: 'Failed to delete deal' }, { status: 500 })
  }
}

