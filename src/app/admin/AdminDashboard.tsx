'use client'

import Link from 'next/link'
import { 
  Building2, 
  Users, 
  MessageSquare, 
  Briefcase,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Activity,
  Mail,
  Phone,
  Calendar
} from 'lucide-react'

interface DashboardStats {
  totalCustomers: number
  totalProperties: number
  activeProperties: number
  totalInquiries: number
  recentInquiries: number
  pendingInquiries: number
  totalDeals: number
  dealsByStage: { stage: string; count: number }[]
  totalDealValue: number
  recentActivity: any[]
}

interface AdminDashboardProps {
  user: { email: string }
  properties: any[]
  stats: DashboardStats
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const stageColors: Record<string, string> = {
  'lead': 'bg-gray-100 text-gray-700',
  'qualified': 'bg-blue-100 text-blue-700',
  'proposal': 'bg-purple-100 text-purple-700',
  'negotiation': 'bg-amber-100 text-amber-700',
  'won': 'bg-green-100 text-green-700',
  'lost': 'bg-red-100 text-red-700',
}

export default function AdminDashboard({ user, properties, stats }: AdminDashboardProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-semibold text-charcoal-900">
          {getGreeting()}, {user.email.split('@')[0]}
        </h1>
        <p className="text-charcoal-500 mt-1">Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {/* Total Customers */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              Active
            </span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-charcoal-900">{stats.totalCustomers.toLocaleString()}</p>
          <p className="text-sm text-charcoal-500">Total Contacts</p>
        </div>

        {/* Properties */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gold-50 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-gold-600" />
            </div>
            <span className="text-xs font-medium text-charcoal-600 bg-gray-100 px-2 py-1 rounded-full">
              {stats.activeProperties} active
            </span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-charcoal-900">{stats.totalProperties}</p>
          <p className="text-sm text-charcoal-500">Properties</p>
        </div>

        {/* Inquiries */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            {stats.pendingInquiries > 0 && (
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {stats.pendingInquiries} new
              </span>
            )}
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-charcoal-900">{stats.totalInquiries}</p>
          <p className="text-sm text-charcoal-500">Total Inquiries</p>
        </div>

        {/* Deal Value */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs font-medium text-charcoal-600 bg-gray-100 px-2 py-1 rounded-full">
              {stats.totalDeals} deals
            </span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-charcoal-900">{formatCurrency(stats.totalDealValue)}</p>
          <p className="text-sm text-charcoal-500">Pipeline Value</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-charcoal-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-gold-600" />
              Recent Inquiries
            </h2>
            <Link href="/admin/inquiries" className="text-sm text-gold-600 hover:text-gold-700 font-medium">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentActivity.length === 0 ? (
              <div className="px-6 py-12 text-center text-charcoal-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No recent inquiries</p>
              </div>
            ) : (
              stats.recentActivity.slice(0, 5).map((item, i) => (
                <div key={i} className="px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center text-gold-700 font-semibold text-sm">
                      {item.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-900">{item.name || 'Unknown'}</p>
                      <p className="text-sm text-charcoal-500">{item.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'new' || !item.status
                        ? 'bg-amber-50 text-amber-700'
                        : item.status === 'responded'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status || 'new'}
                    </span>
                    <p className="text-xs text-charcoal-400 mt-1">{formatDate(item.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Deal Pipeline Summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-charcoal-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-gold-600" />
              Deal Pipeline
            </h2>
            <Link href="/admin/deals" className="text-sm text-gold-600 hover:text-gold-700 font-medium">
              View →
            </Link>
          </div>
          <div className="p-6">
            {stats.dealsByStage.length === 0 ? (
              <div className="text-center text-charcoal-400 py-8">
                <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No deals yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'].map(stage => {
                  const stageData = stats.dealsByStage.find(s => s.stage === stage)
                  const count = Number(stageData?.count || 0)
                  return (
                    <div key={stage} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          stage === 'lead' ? 'bg-gray-400' :
                          stage === 'qualified' ? 'bg-blue-500' :
                          stage === 'proposal' ? 'bg-purple-500' :
                          stage === 'negotiation' ? 'bg-amber-500' :
                          stage === 'won' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="text-sm text-charcoal-700 capitalize">{stage}</span>
                      </div>
                      <span className="text-sm font-medium text-charcoal-900">{count}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-charcoal-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/admin/properties/new"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-gold-300 hover:bg-gold-50 transition-colors text-center"
          >
            <Building2 className="w-6 h-6 text-gold-600" />
            <span className="text-sm font-medium text-charcoal-700">Add Property</span>
          </Link>
          <Link 
            href="/admin/customers"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-gold-300 hover:bg-gold-50 transition-colors text-center"
          >
            <Users className="w-6 h-6 text-gold-600" />
            <span className="text-sm font-medium text-charcoal-700">View Contacts</span>
          </Link>
          <Link 
            href="/admin/deals"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-gold-300 hover:bg-gold-50 transition-colors text-center"
          >
            <Briefcase className="w-6 h-6 text-gold-600" />
            <span className="text-sm font-medium text-charcoal-700">Deal Pipeline</span>
          </Link>
          <Link 
            href="/admin/inquiries"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-gold-300 hover:bg-gold-50 transition-colors text-center"
          >
            <MessageSquare className="w-6 h-6 text-gold-600" />
            <span className="text-sm font-medium text-charcoal-700">Inquiries</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
