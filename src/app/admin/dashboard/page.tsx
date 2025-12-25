'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Home, 
  Users, 
  Calendar, 
  Mail, 
  TrendingUp, 
  Building2, 
  DollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Activity
} from 'lucide-react'

interface DashboardStats {
  totalProperties: number
  activeProperties: number
  totalCustomers: number
  totalInquiries: number
  recentInquiries: number
  pendingInquiries: number
}

interface RecentInquiry {
  id: number
  full_name: string
  email: string
  property_name: string | null
  created_at: string
  status: string
}

interface RecentCustomer {
  id: number
  name: string
  email: string
  phone: string | null
  created_at: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([])
  const [recentCustomers, setRecentCustomers] = useState<RecentCustomer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/admin/dashboard')
        const data = await res.json()
        setStats(data.stats)
        setRecentInquiries(data.recentInquiries || [])
        setRecentCustomers(data.recentCustomers || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  const statCards = [
    {
      title: 'Total Properties',
      value: stats?.totalProperties || 0,
      icon: Building2,
      color: 'bg-blue-500',
      link: '/admin/properties'
    },
    {
      title: 'Active Listings',
      value: stats?.activeProperties || 0,
      icon: Home,
      color: 'bg-green-500',
      link: '/admin/properties'
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'bg-purple-500',
      link: '/admin/customers'
    },
    {
      title: 'Total Inquiries',
      value: stats?.totalInquiries || 0,
      icon: Mail,
      color: 'bg-orange-500',
      link: '/admin/inquiries'
    },
    {
      title: 'This Month',
      value: stats?.recentInquiries || 0,
      icon: TrendingUp,
      color: 'bg-teal-500',
      link: '/admin/inquiries'
    },
    {
      title: 'Pending',
      value: stats?.pendingInquiries || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      link: '/admin/inquiries'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back! Here's your business overview.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                href="/admin/customers" 
                className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                View CRM
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((stat) => (
            <Link
              key={stat.title}
              href={stat.link}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</div>
              <div className="text-sm text-gray-500">{stat.title}</div>
            </Link>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Inquiries */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Recent Inquiries</h2>
                  <p className="text-sm text-gray-500">Latest booking requests</p>
                </div>
              </div>
              <Link href="/admin/inquiries" className="text-sm text-gold-600 hover:text-gold-700 font-medium">
                View all →
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentInquiries.length > 0 ? (
                recentInquiries.slice(0, 5).map((inquiry) => (
                  <div key={inquiry.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{inquiry.full_name}</div>
                        <div className="text-sm text-gray-500">{inquiry.email}</div>
                        {inquiry.property_name && (
                          <div className="text-sm text-gold-600 mt-1">{inquiry.property_name}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          inquiry.status === 'new' 
                            ? 'bg-green-100 text-green-700' 
                            : inquiry.status === 'contacted'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {inquiry.status || 'new'}
                        </span>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No inquiries yet
                </div>
              )}
            </div>
          </div>

          {/* Recent Customers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Customer Database</h2>
                  <p className="text-sm text-gray-500">{stats?.totalCustomers?.toLocaleString()} total contacts</p>
                </div>
              </div>
              <Link href="/admin/customers" className="text-sm text-gold-600 hover:text-gold-700 font-medium">
                Open CRM →
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentCustomers.length > 0 ? (
                recentCustomers.slice(0, 5).map((customer) => (
                  <div key={customer.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email || 'No email'}</div>
                      </div>
                      <div className="text-right">
                        {customer.phone && (
                          <div className="text-sm text-gray-600">{customer.phone}</div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          Added {new Date(customer.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No customers yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/properties"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-gold-300 hover:bg-gold-50 transition-colors"
            >
              <Building2 className="w-5 h-5 text-gold-600" />
              <span className="font-medium text-gray-900">Manage Properties</span>
            </Link>
            <Link
              href="/admin/customers"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-gold-300 hover:bg-gold-50 transition-colors"
            >
              <Users className="w-5 h-5 text-gold-600" />
              <span className="font-medium text-gray-900">Sales CRM</span>
            </Link>
            <Link
              href="/admin/inquiries"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-gold-300 hover:bg-gold-50 transition-colors"
            >
              <Mail className="w-5 h-5 text-gold-600" />
              <span className="font-medium text-gray-900">View Inquiries</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-gold-300 hover:bg-gold-50 transition-colors"
            >
              <Activity className="w-5 h-5 text-gold-600" />
              <span className="font-medium text-gray-900">View Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

