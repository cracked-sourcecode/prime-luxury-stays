import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { sql } from '@/lib/db'
import { verifyAdminSession } from '@/lib/admin'
import CRMClient from './CRMClient'

interface Customer {
  id: number
  name: string
  email: string | null
  phone: string | null
  notes: string | null
  source: string
  status: string
  created_at: string
  updated_at: string
}

async function getAdminUser() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('admin_session')?.value
  if (!sessionToken) return null
  return verifyAdminSession(sessionToken)
}

async function getCustomers(): Promise<Customer[]> {
  const result = await sql`
    SELECT * FROM customers 
    ORDER BY created_at DESC
  `
  return result as Customer[]
}

async function getStats() {
  const totalCustomers = await sql`SELECT COUNT(*) as count FROM customers`
  const activeCustomers = await sql`SELECT COUNT(*) as count FROM customers WHERE status = 'active'`
  const recentInquiries = await sql`SELECT COUNT(*) as count FROM inquiries WHERE created_at > NOW() - INTERVAL '30 days'`
  
  return {
    totalCustomers: Number(totalCustomers[0]?.count || 0),
    activeCustomers: Number(activeCustomers[0]?.count || 0),
    recentInquiries: Number(recentInquiries[0]?.count || 0),
  }
}

export default async function CRMPage() {
  const user = await getAdminUser()
  if (!user) {
    redirect('/admin/login')
  }

  const [customers, stats] = await Promise.all([
    getCustomers(),
    getStats()
  ])

  return <CRMClient user={user} customers={customers} stats={stats} />
}

