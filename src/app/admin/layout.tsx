import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { validateSession } from '@/lib/admin'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
  title: 'Admin | Prime Luxury Stays',
  robots: 'noindex, nofollow',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if we're on login page - don't show sidebar
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  const user = token ? await validateSession(token) : null
  const isLoginPage = !user

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-cream-50">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar userName={user?.email} userEmail={user?.email} />
      <main className="admin-main min-h-screen transition-all duration-300">
        {children}
      </main>
    </div>
  )
}

