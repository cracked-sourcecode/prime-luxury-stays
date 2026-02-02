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

// GET - Fetch all WIP tasks
export async function GET(request: NextRequest) {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'
    
    let tasks
    if (status === 'all') {
      tasks = await sql`
        SELECT * FROM wip_tasks 
        ORDER BY 
          CASE priority 
            WHEN 'critical' THEN 0 
            WHEN 'high' THEN 1 
            WHEN 'medium' THEN 2 
            WHEN 'low' THEN 3 
          END,
          sort_order,
          created_at DESC
      `
    } else if (status === 'completed') {
      tasks = await sql`
        SELECT * FROM wip_tasks 
        WHERE is_complete = true 
        ORDER BY completed_at DESC
      `
    } else {
      tasks = await sql`
        SELECT * FROM wip_tasks 
        WHERE is_complete = false 
        ORDER BY 
          CASE priority 
            WHEN 'critical' THEN 0 
            WHEN 'high' THEN 1 
            WHEN 'medium' THEN 2 
            WHEN 'low' THEN 3 
          END,
          sort_order,
          created_at DESC
      `
    }
    
    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Error fetching WIP tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch WIP tasks' }, { status: 500 })
  }
}

// POST - Create new WIP task
export async function POST(request: NextRequest) {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, next_step, priority, assigned_to, category, notes } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO wip_tasks (
        title, next_step, priority, assigned_to, category, notes
      ) VALUES (
        ${title},
        ${next_step || null},
        ${priority || 'medium'},
        ${assigned_to || null},
        ${category || null},
        ${notes || null}
      )
      RETURNING *
    `

    return NextResponse.json({ success: true, task: result[0] })
  } catch (error) {
    console.error('Error creating WIP task:', error)
    return NextResponse.json({ error: 'Failed to create WIP task' }, { status: 500 })
  }
}
