import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateSession } from '@/lib/admin'
import { sql } from '@/lib/db'
import { sendWipTaskNotification } from '@/lib/email'

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
    const { title, title_de, next_step, next_step_de, priority, assigned_to, category, notes, notes_de } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO wip_tasks (
        title, title_de, next_step, next_step_de, priority, assigned_to, category, notes, notes_de
      ) VALUES (
        ${title},
        ${title_de || null},
        ${next_step || null},
        ${next_step_de || null},
        ${priority || 'medium'},
        ${assigned_to || null},
        ${category || null},
        ${notes || null},
        ${notes_de || null}
      )
      RETURNING *
    `

    const task = result[0]

    // Send email notification if task is assigned to someone
    if (assigned_to) {
      sendWipTaskNotification({
        taskId: task.id,
        title: task.title,
        title_de: task.title_de,
        nextStep: task.next_step,
        nextStep_de: task.next_step_de,
        priority: task.priority,
        assignedTo: task.assigned_to,
        notes: task.notes,
        notes_de: task.notes_de,
        createdBy: user.name || user.email
      }).catch(err => console.error('Failed to send WIP notification:', err))
    }

    return NextResponse.json({ success: true, task })
  } catch (error) {
    console.error('Error creating WIP task:', error)
    return NextResponse.json({ error: 'Failed to create WIP task' }, { status: 500 })
  }
}
