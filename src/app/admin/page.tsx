import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateSession, getAllPropertiesAdmin } from '@/lib/admin';
import { sql } from '@/lib/db';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

async function getDashboardStats() {
  try {
    const [
      totalCustomers,
      totalProperties,
      activeProperties,
      totalInquiries,
      recentInquiries,
      pendingInquiries,
      totalDeals,
      dealsByStage,
      recentActivity
    ] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM customers`,
      sql`SELECT COUNT(*) as count FROM properties`,
      sql`SELECT COUNT(*) as count FROM properties WHERE is_active = true`,
      sql`SELECT COUNT(*) as count FROM inquiries`,
      sql`SELECT COUNT(*) as count FROM inquiries WHERE created_at > NOW() - INTERVAL '7 days'`,
      sql`SELECT COUNT(*) as count FROM inquiries WHERE status = 'new' OR status IS NULL`,
      sql`SELECT COUNT(*) as count FROM deals`,
      sql`SELECT stage, COUNT(*) as count FROM deals GROUP BY stage`,
      sql`SELECT 
            'inquiry' as type, 
            full_name as name, 
            email,
            created_at,
            status
          FROM inquiries 
          ORDER BY created_at DESC 
          LIMIT 10`
    ])

    // Calculate deal value
    const dealValueResult = await sql`SELECT COALESCE(SUM(value), 0) as total FROM deals WHERE stage != 'lost'`
    
    return {
      totalCustomers: Number(totalCustomers[0]?.count || 0),
      totalProperties: Number(totalProperties[0]?.count || 0),
      activeProperties: Number(activeProperties[0]?.count || 0),
      totalInquiries: Number(totalInquiries[0]?.count || 0),
      recentInquiries: Number(recentInquiries[0]?.count || 0),
      pendingInquiries: Number(pendingInquiries[0]?.count || 0),
      totalDeals: Number(totalDeals[0]?.count || 0),
      dealsByStage: dealsByStage as { stage: string; count: number }[],
      totalDealValue: Number(dealValueResult[0]?.total || 0),
      recentActivity: recentActivity as any[],
    }
  } catch (e) {
    console.error('Dashboard stats error:', e)
    return { 
      totalCustomers: 0, 
      totalProperties: 0,
      activeProperties: 0,
      totalInquiries: 0,
      recentInquiries: 0,
      pendingInquiries: 0,
      totalDeals: 0,
      dealsByStage: [],
      totalDealValue: 0,
      recentActivity: []
    }
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
    getDashboardStats()
  ]);

  return <AdminDashboard user={user} properties={properties as any} stats={stats} />;
}

