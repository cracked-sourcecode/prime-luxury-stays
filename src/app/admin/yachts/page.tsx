import { sql } from '@/lib/db'
import { validateSession } from '@/lib/admin'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import YachtsAdminClient from './YachtsAdminClient'

export const dynamic = 'force-dynamic'

async function checkAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  if (!token) return null
  return await validateSession(token)
}

async function getYachts() {
  try {
    const yachts = await sql`
      SELECT * FROM yachts 
      ORDER BY created_at DESC
    `
    
    // Fetch images for each yacht
    const yachtsWithImages = await Promise.all(
      yachts.map(async (yacht: any) => {
        const images = await sql`
          SELECT * FROM yacht_images 
          WHERE yacht_id = ${yacht.id}
          ORDER BY display_order ASC
        `
        return { ...yacht, images }
      })
    )
    
    return yachtsWithImages
  } catch (error) {
    console.error('Error fetching yachts:', error)
    return []
  }
}

export default async function YachtsAdminPage() {
  const user = await checkAuth()
  if (!user) {
    redirect('/admin/login')
  }

  const yachts = await getYachts()

  const stats = {
    total: yachts.length,
    active: yachts.filter((y: any) => y.is_active).length,
    featured: yachts.filter((y: any) => y.is_featured).length,
  }

  return <YachtsAdminClient user={user} initialYachts={yachts} stats={stats} />
}
