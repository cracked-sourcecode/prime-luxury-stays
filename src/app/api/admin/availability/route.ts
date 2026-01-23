import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateSession } from '@/lib/admin'
import { sql } from '@/lib/db'

// GET - Fetch availability data from database
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_session')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = await validateSession(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const region = searchParams.get('region')
    const property = searchParams.get('property')
    const status = searchParams.get('status')
    
    // Get all data with optional filters
    let data
    if (region && status) {
      data = await sql`
        SELECT * FROM sheet_availability 
        WHERE region = ${region} AND status = ${status}
        ORDER BY week_start ASC, property_name ASC
      `
    } else if (region) {
      data = await sql`
        SELECT * FROM sheet_availability 
        WHERE region = ${region}
        ORDER BY week_start ASC, property_name ASC
      `
    } else if (property) {
      data = await sql`
        SELECT * FROM sheet_availability 
        WHERE property_name = ${property}
        ORDER BY region ASC, week_start ASC
      `
    } else if (status) {
      data = await sql`
        SELECT * FROM sheet_availability 
        WHERE status = ${status}
        ORDER BY region ASC, week_start ASC, property_name ASC
      `
    } else {
      data = await sql`
        SELECT * FROM sheet_availability 
        ORDER BY region ASC, week_start ASC, property_name ASC
      `
    }
    
    // Get unique regions and properties for filters
    const regions = await sql`SELECT DISTINCT region FROM sheet_availability ORDER BY region`
    const properties = await sql`SELECT DISTINCT property_name FROM sheet_availability ORDER BY property_name`
    
    return NextResponse.json({ 
      success: true, 
      data,
      filters: {
        regions: regions.map((r: any) => r.region),
        properties: properties.map((p: any) => p.property_name),
        statuses: ['available', 'on_request', 'owner', 'booked', 'unknown']
      }
    })
  } catch (error: any) {
    console.error('Error fetching availability:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch availability data',
      message: error?.message 
    }, { status: 500 })
  }
}

// PUT - Update an availability record
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_session')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = await validateSession(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }
    
    const body = await request.json()
    const { id, status, notes, raw_value } = body
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    
    const result = await sql`
      UPDATE sheet_availability 
      SET 
        status = COALESCE(${status}, status),
        notes = COALESCE(${notes}, notes),
        raw_value = COALESCE(${raw_value}, raw_value),
        imported_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: result[0] })
  } catch (error: any) {
    console.error('Error updating availability:', error)
    return NextResponse.json({ 
      error: 'Failed to update record',
      message: error?.message 
    }, { status: 500 })
  }
}

// POST - Create a new availability record
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_session')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = await validateSession(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }
    
    const body = await request.json()
    const { 
      region, 
      week_label, 
      week_start, 
      week_end, 
      property_name, 
      property_capacity,
      property_location,
      status = 'unknown',
      raw_value,
      notes 
    } = body
    
    if (!region || !week_label || !property_name) {
      return NextResponse.json({ 
        error: 'Region, week_label, and property_name are required' 
      }, { status: 400 })
    }
    
    const result = await sql`
      INSERT INTO sheet_availability (
        region, week_label, week_start, week_end, 
        property_name, property_capacity, property_location,
        status, raw_value, notes
      ) VALUES (
        ${region}, ${week_label}, ${week_start || null}, ${week_end || null},
        ${property_name}, ${property_capacity || null}, ${property_location || null},
        ${status}, ${raw_value || null}, ${notes || null}
      )
      ON CONFLICT (region, week_label, property_name) 
      DO UPDATE SET
        status = EXCLUDED.status,
        raw_value = EXCLUDED.raw_value,
        notes = EXCLUDED.notes,
        imported_at = CURRENT_TIMESTAMP
      RETURNING *
    `
    
    return NextResponse.json({ success: true, data: result[0] })
  } catch (error: any) {
    console.error('Error creating availability:', error)
    return NextResponse.json({ 
      error: 'Failed to create record',
      message: error?.message 
    }, { status: 500 })
  }
}

// DELETE - Remove an availability record
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_session')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = await validateSession(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    
    await sql`DELETE FROM sheet_availability WHERE id = ${id}`
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting availability:', error)
    return NextResponse.json({ 
      error: 'Failed to delete record',
      message: error?.message 
    }, { status: 500 })
  }
}
