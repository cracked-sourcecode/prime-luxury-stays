'use client'

import { useState } from 'react'
import { 
  Search, 
  Plus, 
  Filter,
  Users,
  Mail,
  Phone,
  MoreVertical,
  Edit3,
  Trash2,
  X,
  Save,
  UserPlus,
  Download,
  TrendingUp,
  MessageSquare
} from 'lucide-react'
import AdminNav from '@/components/admin/AdminNav'
import type { AdminUser } from '@/lib/admin'

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

interface Stats {
  totalCustomers: number
  activeCustomers: number
  recentInquiries: number
}

interface CRMClientProps {
  user: AdminUser
  customers: Customer[]
  stats: Stats
}

export default function CRMClient({ user, customers: initialCustomers, stats }: CRMClientProps) {
  const [customers, setCustomers] = useState(initialCustomers)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    status: 'active'
  })

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.includes(searchQuery)
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', notes: '', status: 'active' })
  }

  const openAddModal = () => {
    resetForm()
    setEditingCustomer(null)
    setShowAddModal(true)
  }

  const openEditModal = (customer: Customer) => {
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      notes: customer.notes || '',
      status: customer.status
    })
    setEditingCustomer(customer)
    setShowAddModal(true)
  }

  const closeModal = () => {
    setShowAddModal(false)
    setEditingCustomer(null)
    resetForm()
  }

  const handleSave = async () => {
    if (!formData.name.trim()) return
    setSaving(true)

    try {
      const endpoint = editingCustomer 
        ? `/api/admin/customers/${editingCustomer.id}`
        : '/api/admin/customers'
      
      const res = await fetch(endpoint, {
        method: editingCustomer ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      
      if (data.success) {
        if (editingCustomer) {
          setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? data.customer : c))
        } else {
          setCustomers(prev => [data.customer, ...prev])
        }
        closeModal()
      }
    } catch (error) {
      console.error('Error saving customer:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this customer?')) return

    try {
      const res = await fetch(`/api/admin/customers/${id}`, { method: 'DELETE' })
      const data = await res.json()
      
      if (data.success) {
        setCustomers(prev => prev.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Notes', 'Status', 'Created At']
    const rows = filteredCustomers.map(c => [
      c.name,
      c.email || '',
      c.phone || '',
      c.notes || '',
      c.status,
      new Date(c.created_at).toLocaleDateString()
    ])
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <AdminNav userName={user.name} userEmail={user.email} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-charcoal-900 to-charcoal-700 flex items-center justify-center shadow-sm">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-charcoal-900">{stats.totalCustomers}</p>
                <p className="text-charcoal-500 text-sm">Total Contacts</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center shadow-gold">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-charcoal-900">{stats.activeCustomers}</p>
                <p className="text-charcoal-500 text-sm">Active Contacts</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gold-100 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-gold-700" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-charcoal-900">{stats.recentInquiries}</p>
                <p className="text-charcoal-500 text-sm">Inquiries (30 days)</p>
              </div>
            </div>
          </div>
        </div>

        {/* CRM Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-cream-200 overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-cream-200 bg-cream-50/60">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-merriweather text-2xl text-charcoal-900">Sales CRM</h2>
                <p className="text-sm text-charcoal-500 mt-1">
                  Manage customer contacts, track leads, and grow relationships.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-cream-200 rounded-xl w-full sm:w-64 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none bg-white"
                  />
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-charcoal-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="border border-cream-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none bg-white"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Export */}
                <button
                  onClick={exportCSV}
                  className="border border-cream-200 text-charcoal-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-cream-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Export
                </button>

                {/* Add New */}
                <button
                  onClick={openAddModal}
                  className="bg-gradient-to-r from-gold-500 to-gold-400 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-gold-400 hover:to-gold-300 transition-all flex items-center justify-center gap-2 shadow-gold"
                >
                  <UserPlus className="w-5 h-5" />
                  Add Contact
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50 border-b border-cream-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal-700">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal-700">Email</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal-700">Phone</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal-700">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal-700">Added</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-charcoal-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Users className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
                      <p className="text-charcoal-500">No contacts found</p>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-cream-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-charcoal-900">{customer.name}</div>
                        {customer.notes && (
                          <div className="text-xs text-charcoal-500 mt-1 truncate max-w-xs">{customer.notes}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {customer.email ? (
                          <a href={`mailto:${customer.email}`} className="text-gold-600 hover:text-gold-700 flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {customer.email}
                          </a>
                        ) : (
                          <span className="text-charcoal-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {customer.phone ? (
                          <a href={`tel:${customer.phone}`} className="text-charcoal-700 hover:text-charcoal-900 flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {customer.phone}
                          </a>
                        ) : (
                          <span className="text-charcoal-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          customer.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-charcoal-500 text-sm">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(customer)}
                            className="p-2 text-charcoal-500 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="p-2 text-charcoal-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination info */}
          <div className="p-4 border-t border-cream-200 bg-cream-50/40 text-sm text-charcoal-500">
            Showing {filteredCustomers.length} of {customers.length} contacts
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
              <h2 className="font-merriweather text-xl text-charcoal-900">
                {editingCustomer ? 'Edit Contact' : 'Add Contact'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-cream-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-charcoal-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  placeholder="Contact name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-2">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  placeholder="+49 123 456 7890"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none resize-none"
                  placeholder="Any notes about this contact..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-cream-200 bg-cream-50 flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2.5 border border-cream-200 rounded-xl font-semibold text-charcoal-700 hover:bg-cream-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.name.trim()}
                className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Contact'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

