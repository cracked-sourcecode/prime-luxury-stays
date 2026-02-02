import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { validateSession } from '@/lib/admin'
import { sql } from '@/lib/db'
import WIPClient from './WIPClient'

export const dynamic = 'force-dynamic'

export default async function WIPPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  
  if (!token) {
    redirect('/admin/login')
  }
  
  const user = await validateSession(token)
  if (!user) {
    redirect('/admin/login')
  }

  // Fetch active tasks
  const activeTasks = await sql`
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

  // Fetch completed tasks
  const completedTasks = await sql`
    SELECT * FROM wip_tasks 
    WHERE is_complete = true 
    ORDER BY completed_at DESC
    LIMIT 20
  `

  // Get stats
  const stats = await sql`
    SELECT 
      COUNT(*) FILTER (WHERE is_complete = false) as active_count,
      COUNT(*) FILTER (WHERE is_complete = true) as completed_count,
      COUNT(*) FILTER (WHERE priority = 'high' AND is_complete = false) as high_priority_count,
      COUNT(*) FILTER (WHERE priority = 'critical' AND is_complete = false) as critical_count
    FROM wip_tasks
  `

  return (
    <WIPClient 
      user={user}
      initialActiveTasks={activeTasks as any[]}
      initialCompletedTasks={completedTasks as any[]}
      stats={{
        activeCount: parseInt(stats[0]?.active_count || '0'),
        completedCount: parseInt(stats[0]?.completed_count || '0'),
        highPriorityCount: parseInt(stats[0]?.high_priority_count || '0'),
        criticalCount: parseInt(stats[0]?.critical_count || '0')
      }}
    />
  )
}
