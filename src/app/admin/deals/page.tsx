'use client'

import { useEffect, useState } from 'react'
import { 
  Plus, 
  LayoutGrid,
  List,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Copy,
  ArrowRight,
  Mail,
  ExternalLink,
  X,
  Calendar,
  User,
  Home,
  DollarSign,
  Check
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
  { id: 'lead', name: 'Lead', color: '#94a3b8', bgColor: 'bg-slate-50', borderColor: 'border-slate-200' },
  { id: 'qualified', name: 'Qualified', color: '#3b82f6', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { id: 'proposal', name: 'Proposal Sent', color: '#f59e0b', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  { id: 'negotiation', name: 'Negotiations Started', color: '#8b5cf6', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  { id: 'won', name: 'Deal Won', color: '#10b981', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  { id: 'lost', name: 'Deal Lost', color: '#ef4444', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
]

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'kanban' | 'table'>('kanban')
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDeals, setSelectedDeals] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [collapsedColumns, setCollapsedColumns] = useState<string[]>([])
  const itemsPerPage = 25

  // Form state for new deal
  const [newDeal, setNewDeal] = useState({
    title: '',
    value: '',
    stage: 'lead',
    customer_name: '',
    customer_email: '',
    property_name: '',
    notes: ''
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

  async function createDeal() {
    try {
      const res = await fetch('/api/admin/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newDeal.title,
          value: newDeal.value ? parseFloat(newDeal.value) : null,
          stage: newDeal.stage,
          customer_name: newDeal.customer_name || null,
          customer_email: newDeal.customer_email || null,
          property_name: newDeal.property_name || null,
          notes: newDeal.notes || null
        })
      })
      if (res.ok) {
        setShowAddModal(false)
        setNewDeal({ title: '', value: '', stage: 'lead', customer_name: '', customer_email: '', property_name: '', notes: '' })
        fetchDeals()
      }
    } catch (error) {
      console.error('Error creating deal:', error)
    }
  }

  async function updateDealStage(dealId: number, newStage: string) {
    try {
      await fetch(`/api/admin/deals/${dealId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage })
      })
      setDeals(deals.map(d => d.id === dealId ? { ...d, stage: newStage } : d))
    } catch (error) {
      console.error('Error updating deal:', error)
    }
  }

  async function deleteDeal(dealId: number) {
    if (!confirm('Delete this deal?')) return
    try {
      await fetch(`/api/admin/deals/${dealId}`, { method: 'DELETE' })
      setDeals(deals.filter(d => d.id !== dealId))
    } catch (error) {
      console.error('Error deleting deal:', error)
    }
  }

  const filteredDeals = deals.filter(d => 
    d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.customer_email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStageDeals = (stageId: string) => filteredDeals.filter(d => d.stage === stageId)
  const getStageTotal = (stageId: string) => getStageDeals(stageId).reduce((sum, d) => sum + (d.value || 0), 0)
  const totalPipelineValue = deals.filter(d => d.stage !== 'lost').reduce((sum, d) => sum + (d.value || 0), 0)

  const toggleColumn = (stageId: string) => {
    setCollapsedColumns(prev => 
      prev.includes(stageId) ? prev.filter(s => s !== stageId) : [...prev, stageId]
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Pagination for table view
  const paginatedDeals = filteredDeals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage)

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">Deals</span>
              <span className="bg-gray-800 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                {deals.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-md w-64 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center border border-gray-200 rounded-md">
              <button
                onClick={() => setView('kanban')}
                className={`px-3 py-2 text-sm flex items-center gap-1.5 ${
                  view === 'kanban' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Board view
              </button>
              <button
                onClick={() => setView('table')}
                className={`px-3 py-2 text-sm flex items-center gap-1.5 border-l border-gray-200 ${
                  view === 'table' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
                Table view
              </button>
            </div>

            {/* Filters */}
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* Add Deal */}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#ff5c35] hover:bg-[#e54e2b] text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors"
            >
              Add deals
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3 mt-3 text-sm">
          <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
            Deal owner <ChevronDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
            Create date <ChevronDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
            Last activity date <ChevronDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
            Close date <ChevronDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
            <Plus className="w-3 h-3" /> More
          </button>
          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 ml-4">
            <SlidersHorizontal className="w-3 h-3" /> Advanced filters
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        {view === 'kanban' ? (
          /* Kanban View */
          <div className="flex gap-0 h-full overflow-x-auto">
            {STAGES.map((stage) => {
              const stageDeals = getStageDeals(stage.id)
              const stageTotal = getStageTotal(stage.id)
              const isCollapsed = collapsedColumns.includes(stage.id)
              
              return (
                <div 
                  key={stage.id} 
                  className={`flex-shrink-0 ${isCollapsed ? 'w-12' : 'w-72'} border-r border-gray-200 bg-gray-50 flex flex-col transition-all`}
                >
                  {/* Column Header */}
                  <div 
                    className="px-3 py-3 bg-white border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleColumn(stage.id)}
                  >
                    {isCollapsed ? (
                      <div className="flex flex-col items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-medium text-gray-700 writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>
                          {stage.name}
                        </span>
                        <span className="text-xs text-gray-500">{stageDeals.length}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 text-sm">{stage.name}</span>
                          <span className="text-gray-500 text-sm">{stageDeals.length}</span>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                      </>
                    )}
                  </div>

                  {/* Cards */}
                  {!isCollapsed && (
                    <>
                      <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {stageDeals.map((deal) => (
                          <div 
                            key={deal.id} 
                            className={`bg-white rounded-md border ${stage.borderColor} p-3 hover:shadow-md transition-shadow cursor-pointer`}
                          >
                            {/* Deal Title */}
                            <a 
                              href="#" 
                              className="font-medium text-[#0091ae] hover:underline text-sm block mb-2"
                              onClick={(e) => e.preventDefault()}
                            >
                              {deal.title}
                            </a>

                            {/* Deal Details */}
                            <div className="text-xs text-gray-600 space-y-1">
                              <p>Amount: {deal.value ? formatCurrency(deal.value) : '—'}</p>
                              <p className="truncate">Deal stage: {stage.name}</p>
                              {deal.property_name && (
                                <p className="truncate">Property: {deal.property_name}</p>
                              )}
                            </div>

                            {/* Contact */}
                            {deal.customer_name && (
                              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                  {deal.customer_name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs text-gray-700 truncate">{deal.customer_name}</span>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-1 mt-3 pt-2 border-t border-gray-100">
                              <button 
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                title="Copy"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                title="Move"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                              {deal.customer_email && (
                                <a 
                                  href={`mailto:${deal.customer_email}`}
                                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                  title="Email"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button 
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                title="Open"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Column Footer */}
                      <div className="px-3 py-2 bg-white border-t border-gray-200 text-xs text-gray-600">
                        <p><strong>{formatCurrency(stageTotal)}</strong> | Total amount</p>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          /* Table View */
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="w-10 px-3 py-2">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDeals(paginatedDeals.map(d => d.id))
                          } else {
                            setSelectedDeals([])
                          }
                        }}
                      />
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Deal Name
                        <MoreHorizontal className="w-3 h-3 text-gray-400" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Deal → Contacts
                        <MoreHorizontal className="w-3 h-3 text-gray-400" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Deal Stage
                        <MoreHorizontal className="w-3 h-3 text-gray-400" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Property
                        <MoreHorizontal className="w-3 h-3 text-gray-400" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-1 justify-end">
                        Amount
                        <MoreHorizontal className="w-3 h-3 text-gray-400" />
                      </div>
                    </th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedDeals.map((deal) => {
                    const stage = STAGES.find(s => s.id === deal.stage)
                    return (
                      <tr key={deal.id} className="hover:bg-blue-50/30">
                        <td className="px-3 py-3">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={selectedDeals.includes(deal.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDeals([...selectedDeals, deal.id])
                              } else {
                                setSelectedDeals(selectedDeals.filter(id => id !== deal.id))
                              }
                            }}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <a href="#" className="text-[#0091ae] hover:underline font-medium text-sm">
                            {deal.title}
                          </a>
                        </td>
                        <td className="px-3 py-3">
                          {deal.customer_name && (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                                {deal.customer_name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <a href="#" className="text-[#0091ae] hover:underline text-sm">
                                  {deal.customer_name}
                                </a>
                                {deal.customer_email && (
                                  <p className="text-xs text-gray-500 truncate max-w-[150px]">{deal.customer_email}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-sm text-gray-700">{stage?.name || deal.stage}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-sm text-gray-600">{deal.property_name || '—'}</span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className="text-sm font-medium text-gray-900">
                            {deal.value ? formatCurrency(deal.value) : '—'}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded ${
                      currentPage === page 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{itemsPerPage} per page</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Deal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Create Deal</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deal Name *</label>
                <input
                  type="text"
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g., Villa Rental - Summer 2025"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    <input
                      type="number"
                      value={newDeal.value}
                      onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                      className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                  <select
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {STAGES.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={newDeal.customer_name}
                  onChange={(e) => setNewDeal({ ...newDeal, customer_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Contact name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={newDeal.customer_email}
                  onChange={(e) => setNewDeal({ ...newDeal, customer_email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                <input
                  type="text"
                  value={newDeal.property_name}
                  onChange={(e) => setNewDeal({ ...newDeal, property_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Property name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newDeal.notes}
                  onChange={(e) => setNewDeal({ ...newDeal, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium"
              >
                Cancel
              </button>
              <button
                onClick={createDeal}
                disabled={!newDeal.title}
                className="px-4 py-2 bg-[#ff5c35] hover:bg-[#e54e2b] text-white rounded-md font-medium disabled:opacity-50"
              >
                Create deal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
