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
    const { title, next_step, priority, assigned_to, category, notes } = body

    const result = await sql`
      UPDATE wip_tasks 
      SET 
        title = COALESCE(${title}, title),
        next_step = ${next_step ?? null},
        priority = COALESCE(${priority}, priority),
        assigned_to = ${assigned_to ?? null},
        category = ${category ?? null},
        notes = ${notes ?? null},
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, task: result[0] })
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
