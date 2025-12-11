import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateSession, getAllPropertiesAdmin } from '@/lib/admin';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const user = await validateSession(token);
  if (!user) {
    redirect('/admin/login');
  }

  const properties = await getAllPropertiesAdmin();

  return <AdminDashboard user={user} properties={properties as any} />;
}

