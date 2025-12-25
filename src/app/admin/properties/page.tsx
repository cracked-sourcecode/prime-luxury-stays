import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { validateSession, getAllPropertiesAdmin } from '@/lib/admin'
import PropertiesListClient from './PropertiesListClient'

export const dynamic = 'force-dynamic'

export default async function PropertiesPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value

  if (!token) {
    redirect('/admin/login')
  }

  const user = await validateSession(token)
  if (!user) {
    redirect('/admin/login')
  }

  const properties = await getAllPropertiesAdmin()

  return <PropertiesListClient user={user} properties={properties as any} />
}

