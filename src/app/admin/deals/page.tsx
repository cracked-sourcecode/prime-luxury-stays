'use client'

import { useEffect, useState } from 'react'
import { 
  Plus, 
  Table, 
  Kanban, 
  Search,
  Filter,
  DollarSign,
  Calendar,
  User,
  Home,
  MoreHorizontal,
  Edit2,
  Trash2,
  X,
  ChevronDown,
  ArrowUpDown,
  GripVertical
} from 'lucide-react'

interface Deal {
  id: number
  title: string
  value: number | null
  currency: string
  stage: string
  customer_id: number | null
  customer_name: string | null
  customer_email: string | null
  property_id: number | null
  property_name: string | null
  check_in: string | null
  check_out: string | null
  guests: number | null
  notes: string | null
  probability: number
  expected_close_date: string | null
  owner: string | null
  source: string | null
  created_at: string
}

const STAGES = [
  { id: 'lead', name: 'Lead', color: 'bg-gray-100 text-gray-700', bgColor: 'bg-gray-50' },
  { id: 'qualified', name: 'Qualified', color: 'bg-blue-100 text-blue-700', bgColor: 'bg-blue-50' },
  { id: 'proposal', name: 'Proposal Sent', color: 'bg-yellow-100 text-yellow-700', bgColor: 'bg-yellow-50' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-purple-100 text-purple-700', bgColor: 'bg-purple-50' },
  { id: 'won', name: 'Won', color: 'bg-green-100 text-green-700', bgColor: 'bg-green-50' },
  { id: 'lost', name: 'Lost', color: 'bg-red-100 text-red-700', bgColor: 'bg-red-50' },
]

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'kanban' | 'table'>('kanban')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [newDeal, setNewDeal] = useState({
    title: '',
    value: '',
    stage: 'lead',
    customer_name: '',
    customer_email: '',
    property_name: '',
    check_in: '',
    check_out: '',
    guests: '',
    notes: '',
    probability: 10,
    expected_close_date: '',
    owner: '',
    source: ''
  })

  useEffect(() => {
    fetchDeals()
  }, [])

  async function fetchDeals() {
    try {
      const res = await fetch('/api/admin/deals')
      const data = await res.json()
      setDeals(data.deals || [])
    } catch (error) {
      console.error('Error fetching deals:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateDeal() {
    try {
      const res = await fetch('/api/admin/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDeal,
          value: newDeal.value ? parseFloat(newDeal.value) : null,
          guests: newDeal.guests ? parseInt(newDeal.guests) : null
        })
      })
      if (res.ok) {
        setShowAddModal(false)
        setNewDeal({
          title: '', value: '', stage: 'lead', customer_name: '', customer_email: '',
          property_name: '', check_in: '', check_out: '', guests: '', notes: '',
          probability: 10, expected_close_date: '', owner: '', source: ''
        })
        fetchDeals()
      }
    } catch (error) {
      console.error('Error creating deal:', error)
    }
  }

  async function handleUpdateStage(dealId: number, newStage: string) {
    try {
      await fetch(`/api/admin/deals/${dealId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage })
      })
      fetchDeals()
    } catch (error) {
      console.error('Error updating deal:', error)
    }
  }

  async function handleDeleteDeal(id: number) {
    if (!confirm('Delete this deal?')) return
    try {
      await fetch(`/api/admin/deals/${id}`, { method: 'DELETE' })
      fetchDeals()
    } catch (error) {
      console.error('Error deleting deal:', error)
    }
  }

  const filteredDeals = deals.filter(d => 
    d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.property_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStageDeals = (stageId: string) => filteredDeals.filter(d => d.stage === stageId)

  const getStageTotal = (stageId: string) => 
    getStageDeals(stageId).reduce((sum, d) => sum + (d.value || 0), 0)

  const totalPipelineValue = deals.filter(d => !['won', 'lost'].includes(d.stage))
    .reduce((sum, d) => sum + (d.value || 0), 0)

  const wonValue = deals.filter(d => d.stage === 'won')
    .reduce((sum, d) => sum + (d.value || 0), 0)

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal-900">Deals Pipeline</h1>
          <p className="text-charcoal-500">{deals.length} deals • €{totalPipelineValue.toLocaleString()} in pipeline • €{wonValue.toLocaleString()} won</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg w-48 lg:w-64 text-sm focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                view === 'kanban' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Kanban className="w-4 h-4" />
              Board
            </button>
            <button
              onClick={() => setView('table')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                view === 'table' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Table className="w-4 h-4" />
              Table
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Deal
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {view === 'kanban' ? (
          /* Kanban View */
          <div className="flex gap-4 overflow-x-auto pb-4">
            {STAGES.map((stage) => {
              const stageDeals = getStageDeals(stage.id)
              const stageTotal = getStageTotal(stage.id)
              
              return (
                <div 
                  key={stage.id} 
                  className={`flex-shrink-0 w-80 ${stage.bgColor} rounded-xl`}
                >
                  {/* Column Header */}
                  <div className="p-4 border-b border-gray-200/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${stage.color}`}>
                          {stage.name}
                        </span>
                        <span className="text-gray-500 text-sm">{stageDeals.length}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        €{stageTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="p-2 space-y-2 min-h-[200px]">
                    {stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('dealId', deal.id.toString())}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault()
                          const dealId = parseInt(e.dataTransfer.getData('dealId'))
                          if (dealId) handleUpdateStage(dealId, stage.id)
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm">{deal.title}</h4>
                          <div className="relative group">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-lg border border-gray-100 py-1 hidden group-hover:block z-10">
                              <button 
                                onClick={() => setEditingDeal(deal)}
                                className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Edit2 className="w-3 h-3" /> Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteDeal(deal.id)}
                                className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                              >
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>

                        {deal.value && (
                          <div className="text-lg font-bold text-gold-600 mb-2">
                            €{deal.value.toLocaleString()}
                          </div>
                        )}

                        {deal.customer_name && (
                          <div className="flex items-center gap-1.5 text-gray-600 text-xs mb-1">
                            <User className="w-3 h-3" />
                            {deal.customer_name}
                          </div>
                        )}

                        {deal.property_name && (
                          <div className="flex items-center gap-1.5 text-gray-600 text-xs mb-1">
                            <Home className="w-3 h-3" />
                            {deal.property_name}
                          </div>
                        )}

                        {deal.check_in && (
                          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                            <Calendar className="w-3 h-3" />
                            {new Date(deal.check_in).toLocaleDateString()}
                            {deal.check_out && ` → ${new Date(deal.check_out).toLocaleDateString()}`}
                          </div>
                        )}

                        {/* Probability Bar */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Probability</span>
                            <span>{deal.probability}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gold-500 rounded-full transition-all"
                              style={{ width: `${deal.probability}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Drop Zone */}
                    <div
                      className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center text-gray-400 text-sm"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault()
                        const dealId = parseInt(e.dataTransfer.getData('dealId'))
                        if (dealId) handleUpdateStage(dealId, stage.id)
                      }}
                    >
                      Drop here
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Deal</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stage</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dates</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Probability</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredDeals.map((deal) => {
                    const stage = STAGES.find(s => s.id === deal.stage)
                    return (
                      <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{deal.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {new Date(deal.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gold-600">
                            €{(deal.value || 0).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={deal.stage}
                            onChange={(e) => handleUpdateStage(deal.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${stage?.color}`}
                          >
                            {STAGES.map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900">{deal.customer_name || '—'}</div>
                          {deal.customer_email && (
                            <div className="text-xs text-gray-500">{deal.customer_email}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{deal.property_name || '—'}</td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {deal.check_in ? (
                            <>
                              {new Date(deal.check_in).toLocaleDateString()}
                              {deal.check_out && <span className="text-gray-400"> → </span>}
                              {deal.check_out && new Date(deal.check_out).toLocaleDateString()}
                            </>
                          ) : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gold-500 rounded-full"
                                style={{ width: `${deal.probability}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">{deal.probability}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setEditingDeal(deal)}
                              className="p-2 text-gray-400 hover:text-gold-600 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDeal(deal.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {filteredDeals.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  No deals found. Create your first deal to get started.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Deal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Create Deal</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deal Title *</label>
                <input
                  type="text"
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  placeholder="e.g., Villa Serena - Summer 2025"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value (€)</label>
                  <input
                    type="number"
                    value={newDeal.value}
                    onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                  <select
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  >
                    {STAGES.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={newDeal.customer_name}
                    onChange={(e) => setNewDeal({ ...newDeal, customer_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                  <input
                    type="email"
                    value={newDeal.customer_email}
                    onChange={(e) => setNewDeal({ ...newDeal, customer_email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                <input
                  type="text"
                  value={newDeal.property_name}
                  onChange={(e) => setNewDeal({ ...newDeal, property_name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  placeholder="Property name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                  <input
                    type="date"
                    value={newDeal.check_in}
                    onChange={(e) => setNewDeal({ ...newDeal, check_in: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                  <input
                    type="date"
                    value={newDeal.check_out}
                    onChange={(e) => setNewDeal({ ...newDeal, check_out: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <input
                    type="number"
                    value={newDeal.guests}
                    onChange={(e) => setNewDeal({ ...newDeal, guests: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Probability (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newDeal.probability}
                    onChange={(e) => setNewDeal({ ...newDeal, probability: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newDeal.notes}
                  onChange={(e) => setNewDeal({ ...newDeal, notes: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDeal}
                disabled={!newDeal.title}
                className="flex-1 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Create Deal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

