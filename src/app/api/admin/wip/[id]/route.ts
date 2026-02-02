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

// GET - Fetch single WIP task
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
    const result = await sql`
      SELECT * FROM wip_tasks WHERE id = ${parseInt(id)}
    `
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    
    return NextResponse.json({ task: result[0] })
  } catch (error) {
    console.error('Error fetching WIP task:', error)
    return NextResponse.json({ error: 'Failed to fetch WIP task' }, { status: 500 })
  }
}

// PUT - Update WIP task
export async function PUT(
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
    const { title, title_de, next_step, next_step_de, priority, assigned_to, category, notes, notes_de } = body

    // Get the current task to check if assignee changed
    const currentTask = await sql`
      SELECT assigned_to FROM wip_tasks WHERE id = ${parseInt(id)}
    `
    const previousAssignee = currentTask[0]?.assigned_to

    const result = await sql`
      UPDATE wip_tasks 
      SET 
        title = COALESCE(${title}, title),
        title_de = ${title_de ?? null},
        next_step = ${next_step ?? null},
        next_step_de = ${next_step_de ?? null},
        priority = COALESCE(${priority}, priority),
        assigned_to = ${assigned_to ?? null},
        category = ${category ?? null},
        notes = ${notes ?? null},
        notes_de = ${notes_de ?? null},
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const task = result[0]
    
    // Send email notification if assignee changed to someone new
    if (assigned_to && assigned_to !== previousAssignee) {
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
    console.error('Error updating WIP task:', error)
    return NextResponse.json({ error: 'Failed to update WIP task' }, { status: 500 })
  }
}

// DELETE - Delete WIP task
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
    await sql`DELETE FROM wip_tasks WHERE id = ${parseInt(id)}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting WIP task:', error)
    return NextResponse.json({ error: 'Failed to delete WIP task' }, { status: 500 })
  }
}
