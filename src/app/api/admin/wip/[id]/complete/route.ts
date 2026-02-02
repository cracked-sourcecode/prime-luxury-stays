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

// POST - Mark task as complete
export async function POST(
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
      UPDATE wip_tasks 
      SET 
        is_complete = true,
        status = 'complete',
        completed_at = NOW(),
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, task: result[0] })
  } catch (error) {
    console.error('Error completing WIP task:', error)
    return NextResponse.json({ error: 'Failed to complete WIP task' }, { status: 500 })
  }
}
