import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { validateSession } from '@/lib/admin'
import { getInquiriesAdmin } from '@/lib/inquiries'
import AdminInquiries from './ui'

export const dynamic = 'force-dynamic'

export default async function AdminInquiriesPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value

  if (!token) redirect('/admin/login')

  const user = await validateSession(token)
  if (!user) redirect('/admin/login')

  const inquiries = await getInquiriesAdmin()

  return <AdminInquiries user={user} inquiries={inquiries} />
}


