import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateSession, getAllPropertiesAdmin } from '@/lib/admin';
import { sql } from '@/lib/db';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

async function getStats() {
  try {
    const totalCustomers = await sql`SELECT COUNT(*) as count FROM customers`
    const recentInquiries = await sql`SELECT COUNT(*) as count FROM inquiries WHERE created_at > NOW() - INTERVAL '30 days'`
    
    return {
      totalCustomers: Number(totalCustomers[0]?.count || 0),
      recentInquiries: Number(recentInquiries[0]?.count || 0),
    }
  } catch {
    return { totalCustomers: 0, recentInquiries: 0 }
  }
}

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

  const [properties, stats] = await Promise.all([
    getAllPropertiesAdmin(),
    getStats()
  ]);

  return <AdminDashboard user={user} properties={properties as any} stats={stats} />;
}

