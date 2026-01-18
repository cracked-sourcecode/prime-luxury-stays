'use client'

import { useEffect, useState, DragEvent, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  Plus, 
  LayoutGrid,
  List,
  Search,
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
  GripVertical,
  Pencil,
  Trash2,
  Check,
  User,
  Home,
  DollarSign,
  Calendar
} from 'lucide-react'
import { useAdminLocale } from '@/lib/adminLocale'

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

const getStages = (locale: string) => [
  { id: 'interested', name: locale === 'de' ? 'Interessiert' : 'Interested', color: '#94a3b8', bgColor: 'bg-slate-50', borderColor: 'border-slate-200' },
  { id: 'demo', name: locale === 'de' ? 'Demo geplant' : 'Demo Scheduled', color: '#3b82f6', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { id: 'proposal', name: locale === 'de' ? 'Angebot gesendet' : 'Proposal Sent', color: '#f59e0b', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  { id: 'negotiation', name: locale === 'de' ? 'Verhandlung begonnen' : 'Negotiations Started', color: '#8b5cf6', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  { id: 'won', name: locale === 'de' ? 'Deal gewonnen' : 'Deal Won', color: '#10b981', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  { id: 'lost', name: locale === 'de' ? 'Deal verloren' : 'Deal Lost', color: '#ef4444', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
]

interface Contact {
  id: number
  name: string
  email: string | null
  phone: string | null
}

interface Property {
  id: number
  name: string
  slug: string
  price_per_week: number | null
  price_per_week_high: number | null
  region: string | null
}

// Wrapper component to handle Suspense for useSearchParams
export default function DealsPage() {
  return (
    <Suspense fallback={<div className="p-6 lg:p-8 flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
      <DealsPageContent />
    </Suspense>
  )
}

function DealsPageContent() {
  const { t, locale } = useAdminLocale()
  const searchParams = useSearchParams()
  const router = useRouter()
  const STAGES = getStages(locale)
  const [deals, setDeals] = useState<Deal[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'kanban' | 'table'>('kanban')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDeals, setSelectedDeals] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [collapsedColumns, setCollapsedColumns] = useState<string[]>([])
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null)
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)
  const itemsPerPage = 25

  // Form state for new deal
  const [newDeal, setNewDeal] = useState({
    title: '',
    value: '',
    stage: 'interested',
    customer_id: '' as string | number,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    property_id: '' as string | number,
    property_name: '',
    check_in: '',
    check_out: '',
    guests: '',
    notes: ''
  })
  const [contactMode, setContactMode] = useState<'existing' | 'new'>('existing')
  const [contactSearch, setContactSearch] = useState('')
  const [showContactDropdown, setShowContactDropdown] = useState(false)

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: '',
    value: '',
    stage: 'interested',
    customer_id: '' as string | number,
    customer_name: '',
    customer_email: '',
    property_id: '' as string | number,
    property_name: '',
    notes: '',
    check_in: '',
    check_out: '',
    guests: ''
  })
  const [editContactSearch, setEditContactSearch] = useState('')
  const [showEditContactDropdown, setShowEditContactDropdown] = useState(false)

  useEffect(() => {
    fetchDeals()
    fetchContacts()
    fetchProperties()
  }, [])

  // Check if we're creating a deal from an inquiry
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      const inquiryData = sessionStorage.getItem('createDealFromInquiry')
      if (inquiryData) {
        try {
          const data = JSON.parse(inquiryData)
          
          // Find matching property by slug or name
          let matchedPropertyId = ''
          if (data.property_slug && properties.length > 0) {
            const matchedProp = properties.find(p => p.slug === data.property_slug)
            if (matchedProp) {
              matchedPropertyId = matchedProp.id.toString()
            }
          }
          
          // Find matching customer by email
          let matchedCustomerId = ''
          if (data.customer_email && contacts.length > 0) {
            const matchedContact = contacts.find(c => c.email === data.customer_email)
            if (matchedContact) {
              matchedCustomerId = matchedContact.id.toString()
              setContactMode('existing')
              setContactSearch(matchedContact.name)
            } else {
              setContactMode('new')
            }
          }
          
          setNewDeal({
            title: data.title || '',
            value: '',
            stage: 'interested',
            customer_id: matchedCustomerId,
            customer_name: data.customer_name || '',
            customer_email: data.customer_email || '',
            customer_phone: data.customer_phone || '',
            property_id: matchedPropertyId,
            property_name: data.property_name || '',
            check_in: data.check_in ? data.check_in.split('T')[0] : '',
            check_out: data.check_out ? data.check_out.split('T')[0] : '',
            guests: data.guests || '',
            notes: data.notes || ''
          })
          
          setShowAddModal(true)
          
          // Clear the sessionStorage and URL param
          sessionStorage.removeItem('createDealFromInquiry')
          router.replace('/admin/deals', { scroll: false })
        } catch (e) {
          console.error('Error parsing inquiry data:', e)
        }
      } else {
        // No inquiry data, just open the modal
        setShowAddModal(true)
        router.replace('/admin/deals', { scroll: false })
      }
    }
  }, [searchParams, properties, contacts, router])

  async function fetchProperties() {
    try {
      const res = await fetch('/api/admin/properties/list')
      const data = await res.json()
      setProperties(data.properties || [])
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }

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

  async function fetchContacts() {
    try {
      const res = await fetch('/api/admin/customers')
      const data = await res.json()
      setContacts(data.customers || [])
    } catch (error) {
      console.error('Error fetching contacts:', error)
    }
  }

  async function createDeal() {
    try {
      let customerId = newDeal.customer_id
      let customerName = newDeal.customer_name
      let customerEmail = newDeal.customer_email

      // If creating new contact, add to CRM first
      if (contactMode === 'new' && newDeal.customer_name) {
        const contactRes = await fetch('/api/admin/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newDeal.customer_name,
            email: newDeal.customer_email || null,
            phone: newDeal.customer_phone || null,
            source: 'deal'
          })
        })
        const contactData = await contactRes.json()
        if (contactData.id) {
          customerId = contactData.id
          fetchContacts()
        }
      } else if (contactMode === 'existing' && newDeal.customer_id) {
        const selectedContact = contacts.find(c => c.id === Number(newDeal.customer_id))
        if (selectedContact) {
          customerName = selectedContact.name
          customerEmail = selectedContact.email || ''
        }
      }

      // Get property details if selected
      let propertyName = newDeal.property_name
      let propertyId = newDeal.property_id
      if (newDeal.property_id) {
        const selectedProperty = properties.find(p => p.id === Number(newDeal.property_id))
        if (selectedProperty) {
          propertyName = selectedProperty.name
          propertyId = selectedProperty.id
        }
      }

      const res = await fetch('/api/admin/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newDeal.title,
          value: newDeal.value ? parseFloat(newDeal.value) : null,
          stage: newDeal.stage,
          customer_id: customerId || null,
          customer_name: customerName || null,
          customer_email: customerEmail || null,
          property_id: propertyId || null,
          property_name: propertyName || null,
          check_in: newDeal.check_in || null,
          check_out: newDeal.check_out || null,
          guests: newDeal.guests ? parseInt(newDeal.guests) : null,
          notes: newDeal.notes || null
        })
      })
      if (res.ok) {
        setShowAddModal(false)
        setNewDeal({ title: '', value: '', stage: 'interested', customer_id: '', customer_name: '', customer_email: '', customer_phone: '', property_id: '', property_name: '', check_in: '', check_out: '', guests: '', notes: '' })
        setContactMode('existing')
        setContactSearch('')
        fetchDeals()
      }
    } catch (error) {
      console.error('Error creating deal:', error)
    }
  }

  // Open edit modal
  function openEditModal(deal: Deal) {
    setEditingDeal(deal)
    setEditForm({
      title: deal.title || '',
      value: deal.value?.toString() || '',
      stage: deal.stage || 'lead',
      customer_id: deal.customer_id || '',
      customer_name: deal.customer_name || '',
      customer_email: deal.customer_email || '',
      property_id: deal.property_id || '',
      property_name: deal.property_name || '',
      notes: deal.notes || '',
      check_in: deal.check_in ? deal.check_in.split('T')[0] : '',
      check_out: deal.check_out ? deal.check_out.split('T')[0] : '',
      guests: deal.guests?.toString() || ''
    })
    setEditContactSearch(deal.customer_name || '')
    setShowEditModal(true)
  }

  // Update deal
  async function updateDeal() {
    if (!editingDeal) return
    
    try {
      // Get customer details if changed
      let customerName = editForm.customer_name
      let customerEmail = editForm.customer_email
      
      if (editForm.customer_id) {
        const selectedContact = contacts.find(c => c.id === Number(editForm.customer_id))
        if (selectedContact) {
          customerName = selectedContact.name
          customerEmail = selectedContact.email || ''
        }
      }

      // Get property details if changed
      let propertyName = editForm.property_name
      let propertyId = editForm.property_id
      if (editForm.property_id) {
        const selectedProperty = properties.find(p => p.id === Number(editForm.property_id))
        if (selectedProperty) {
          propertyName = selectedProperty.name
          propertyId = selectedProperty.id
        }
      }

      const res = await fetch(`/api/admin/deals/${editingDeal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editForm.title,
          value: editForm.value ? parseFloat(editForm.value) : null,
          stage: editForm.stage,
          customer_id: editForm.customer_id || null,
          customer_name: customerName || null,
          customer_email: customerEmail || null,
          property_id: propertyId || null,
          property_name: propertyName || null,
          notes: editForm.notes || null,
          check_in: editForm.check_in || null,
          check_out: editForm.check_out || null,
          guests: editForm.guests ? parseInt(editForm.guests) : null
        })
      })
      
      if (res.ok) {
        setShowEditModal(false)
        setEditingDeal(null)
        fetchDeals()
      }
    } catch (error) {
      console.error('Error updating deal:', error)
    }
  }

  // Filter contacts for dropdown
  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(contactSearch.toLowerCase()))
  ).slice(0, 10)

  const editFilteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(editContactSearch.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(editContactSearch.toLowerCase()))
  ).slice(0, 10)

  // Drag and drop handlers for Kanban
  function handleDragStart(e: DragEvent<HTMLDivElement>, deal: Deal) {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', deal.id.toString())
    // Add visual feedback
    const target = e.target as HTMLElement
    setTimeout(() => target.classList.add('opacity-50'), 0)
  }

  function handleDragEnd(e: DragEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement
    target.classList.remove('opacity-50')
    setDraggedDeal(null)
    setDragOverStage(null)
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>, stageId: string) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverStage(stageId)
  }

  function handleDragLeave() {
    setDragOverStage(null)
  }

  async function handleDrop(e: DragEvent<HTMLDivElement>, newStage: string) {
    e.preventDefault()
    setDragOverStage(null)
    
    if (!draggedDeal || draggedDeal.stage === newStage) return
    
    // Optimistic update
    setDeals(deals.map(d => d.id === draggedDeal.id ? { ...d, stage: newStage } : d))
    
    try {
      await fetch(`/api/admin/deals/${draggedDeal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage })
      })
    } catch (error) {
      console.error('Error updating deal stage:', error)
      // Revert on error
      fetchDeals()
    }
    
    setDraggedDeal(null)
  }

  async function updateDealStage(dealId: number, newStage: string) {
    // Optimistic update
    setDeals(deals.map(d => d.id === dealId ? { ...d, stage: newStage } : d))
    
    try {
      await fetch(`/api/admin/deals/${dealId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage })
      })
    } catch (error) {
      console.error('Error updating deal:', error)
      fetchDeals()
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
              <span className="font-semibold text-gray-900">{t('dealsTitle')}</span>
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
                placeholder={t('search')}
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
                {t('boardView')}
              </button>
              <button
                onClick={() => setView('table')}
                className={`px-3 py-2 text-sm flex items-center gap-1.5 border-l border-gray-200 ${
                  view === 'table' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
                {t('tableView')}
              </button>
            </div>

            {/* Add Deal */}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#ff5c35] hover:bg-[#e54e2b] text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors"
            >
              {t('addDeals')}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        {view === 'kanban' ? (
          /* Kanban View with Drag & Drop */
          <div className="flex gap-0 h-full overflow-x-auto">
            {STAGES.map((stage) => {
              const stageDeals = getStageDeals(stage.id)
              const stageTotal = getStageTotal(stage.id)
              const isCollapsed = collapsedColumns.includes(stage.id)
              const isDragOver = dragOverStage === stage.id
              
              return (
                <div 
                  key={stage.id} 
                  className={`flex-shrink-0 ${isCollapsed ? 'w-12' : 'w-72'} border-r border-gray-200 bg-gray-50 flex flex-col transition-all ${
                    isDragOver ? 'bg-blue-50' : ''
                  }`}
                  onDragOver={(e) => handleDragOver(e, stage.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  {/* Column Header */}
                  <div 
                    className={`px-3 py-3 bg-white border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
                      isDragOver ? 'bg-blue-100' : ''
                    }`}
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
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
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
                      <div className={`flex-1 overflow-y-auto p-2 space-y-2 min-h-[200px] ${
                        isDragOver ? 'ring-2 ring-blue-400 ring-inset' : ''
                      }`}>
                        {stageDeals.map((deal) => (
                          <div 
                            key={deal.id} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, deal)}
                            onDragEnd={handleDragEnd}
                            className={`bg-white rounded-md border ${stage.borderColor} p-3 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group`}
                          >
                            {/* Drag Handle */}
                            <div className="flex items-start justify-between mb-2">
                              <GripVertical className="w-4 h-4 text-gray-300 group-hover:text-gray-400 flex-shrink-0 mt-0.5" />
                              <a 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); openEditModal(deal) }}
                                className="font-medium text-[#0091ae] hover:underline text-sm flex-1 ml-2"
                              >
                                {deal.title}
                              </a>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => openEditModal(deal)}
                                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                  title="Edit"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                                <button 
                                  onClick={() => deleteDeal(deal.id)}
                                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Deal Details */}
                            <div className="text-xs text-gray-600 space-y-1.5 ml-6">
                              <p className="font-semibold text-gray-900">{deal.value ? formatCurrency(deal.value) : '—'}</p>
                              {deal.property_name && (
                                <p className="truncate flex items-center gap-1">
                                  <Home className="w-3 h-3" /> {deal.property_name}
                                </p>
                              )}
                              {(deal.check_in || deal.check_out) && (
                                <p className="flex items-center gap-1 text-gray-500">
                                  <Calendar className="w-3 h-3" />
                                  {deal.check_in ? new Date(deal.check_in).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' }) : '?'}
                                  {' → '}
                                  {deal.check_out ? new Date(deal.check_out).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' }) : '?'}
                                </p>
                              )}
                            </div>

                            {/* Contact */}
                            {deal.customer_name && (
                              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 ml-6">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xs font-medium text-white">
                                  {deal.customer_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-xs text-gray-700 truncate block">{deal.customer_name}</span>
                                  {deal.customer_email && (
                                    <span className="text-xs text-gray-400 truncate block">{deal.customer_email}</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {/* Drop zone indicator when empty */}
                        {stageDeals.length === 0 && (
                          <div className={`h-32 border-2 border-dashed rounded-lg flex items-center justify-center text-sm text-gray-400 ${
                            isDragOver ? 'border-blue-400 bg-blue-50 text-blue-600' : 'border-gray-200'
                          }`}>
                            {isDragOver ? 'Drop here' : 'No deals'}
                          </div>
                        )}
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
          /* Table View with Inline Editing */
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
                      Deal Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="w-24 px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedDeals.map((deal) => {
                    const stage = STAGES.find(s => s.id === deal.stage)
                    return (
                      <tr key={deal.id} className="hover:bg-blue-50/30 group">
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
                          <button 
                            onClick={() => openEditModal(deal)}
                            className="text-[#0091ae] hover:underline font-medium text-sm text-left"
                          >
                            {deal.title}
                          </button>
                        </td>
                        <td className="px-3 py-3">
                          {deal.customer_name ? (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xs font-medium text-white">
                                {deal.customer_name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm text-gray-900">{deal.customer_name}</p>
                                {deal.customer_email && (
                                  <p className="text-xs text-gray-500 truncate max-w-[150px]">{deal.customer_email}</p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No contact</span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {/* Inline Stage Dropdown */}
                          <select
                            value={deal.stage}
                            onChange={(e) => updateDealStage(deal.id, e.target.value)}
                            className="text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                            style={{ color: stage?.color }}
                          >
                            {STAGES.map(s => (
                              <option key={s.id} value={s.id} style={{ color: s.color }}>
                                {s.name}
                              </option>
                            ))}
                          </select>
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
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              onClick={() => openEditModal(deal)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            {deal.customer_email && (
                              <a 
                                href={`mailto:${deal.customer_email}`}
                                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                                title="Email"
                              >
                                <Mail className="w-4 h-4" />
                              </a>
                            )}
                            <button 
                              onClick={() => deleteDeal(deal.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
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
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
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
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-sm text-gray-600">
                {filteredDeals.length} total deals
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Deal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
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

              {/* Contact Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => { setContactMode('existing'); setNewDeal({ ...newDeal, customer_name: '', customer_email: '', customer_phone: '' }) }}
                    className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                      contactMode === 'existing' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Select Existing
                  </button>
                  <button
                    type="button"
                    onClick={() => { setContactMode('new'); setNewDeal({ ...newDeal, customer_id: '' }) }}
                    className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                      contactMode === 'new' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    + New Contact
                  </button>
                </div>

                {contactMode === 'existing' ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={contactSearch}
                      onChange={(e) => { setContactSearch(e.target.value); setShowContactDropdown(true) }}
                      onFocus={() => setShowContactDropdown(true)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Search contacts..."
                    />
                    {showContactDropdown && filteredContacts.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filteredContacts.map(contact => (
                          <button
                            key={contact.id}
                            type="button"
                            onClick={() => {
                              setNewDeal({ ...newDeal, customer_id: contact.id, customer_name: contact.name, customer_email: contact.email || '' })
                              setContactSearch(contact.name)
                              setShowContactDropdown(false)
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                              {contact.email && <p className="text-xs text-gray-500">{contact.email}</p>}
                            </div>
                            {newDeal.customer_id === contact.id && <Check className="w-4 h-4 text-blue-600" />}
                          </button>
                        ))}
                      </div>
                    )}
                    {newDeal.customer_id && (
                      <p className="text-xs text-green-600 mt-1">✓ Selected: {contacts.find(c => c.id === Number(newDeal.customer_id))?.name}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 p-3 bg-gray-50 rounded-md">
                    <input
                      type="text"
                      value={newDeal.customer_name}
                      onChange={(e) => setNewDeal({ ...newDeal, customer_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                      placeholder="Name *"
                    />
                    <input
                      type="email"
                      value={newDeal.customer_email}
                      onChange={(e) => setNewDeal({ ...newDeal, customer_email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                      placeholder="Email"
                    />
                    <input
                      type="tel"
                      value={newDeal.customer_phone}
                      onChange={(e) => setNewDeal({ ...newDeal, customer_phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                      placeholder="Phone"
                    />
                    <p className="text-xs text-gray-500">This contact will be added to your CRM</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Home className="w-4 h-4 inline mr-1" />
                  Property
                </label>
                <select
                  value={newDeal.property_id}
                  onChange={(e) => {
                    const propId = e.target.value
                    const prop = properties.find(p => p.id === Number(propId))
                    setNewDeal({ 
                      ...newDeal, 
                      property_id: propId,
                      property_name: prop?.name || '',
                      // Auto-suggest deal value based on property price
                      value: newDeal.value || (prop?.price_per_week?.toString() || '')
                    })
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select a property...</option>
                  {properties.map(prop => (
                    <option key={prop.id} value={prop.id}>
                      {prop.name} ({prop.region}) {prop.price_per_week ? `· €${prop.price_per_week.toLocaleString()}/week` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Check-in/Check-out Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={newDeal.check_in}
                    onChange={(e) => setNewDeal({ ...newDeal, check_in: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={newDeal.check_out}
                    onChange={(e) => setNewDeal({ ...newDeal, check_out: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 inline mr-1" />
                  Guests
                </label>
                <input
                  type="number"
                  value={newDeal.guests}
                  onChange={(e) => setNewDeal({ ...newDeal, guests: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Number of guests"
                  min="1"
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

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
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

      {/* Edit Deal Modal */}
      {showEditModal && editingDeal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Edit Deal</h2>
              <button onClick={() => { setShowEditModal(false); setEditingDeal(null) }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deal Name *</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    <input
                      type="number"
                      value={editForm.value}
                      onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                      className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                  <select
                    value={editForm.stage}
                    onChange={(e) => setEditForm({ ...editForm, stage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {STAGES.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact Assignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Assign to Contact
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={editContactSearch}
                    onChange={(e) => { setEditContactSearch(e.target.value); setShowEditContactDropdown(true) }}
                    onFocus={() => setShowEditContactDropdown(true)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Search contacts..."
                  />
                  {showEditContactDropdown && editFilteredContacts.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {editFilteredContacts.map(contact => (
                        <button
                          key={contact.id}
                          type="button"
                          onClick={() => {
                            setEditForm({ 
                              ...editForm, 
                              customer_id: contact.id, 
                              customer_name: contact.name, 
                              customer_email: contact.email || '' 
                            })
                            setEditContactSearch(contact.name)
                            setShowEditContactDropdown(false)
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xs font-medium text-white">
                              {contact.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                              {contact.email && <p className="text-xs text-gray-500">{contact.email}</p>}
                            </div>
                          </div>
                          {editForm.customer_id === contact.id && <Check className="w-4 h-4 text-blue-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                  {editForm.customer_id && (
                    <div className="flex items-center justify-between mt-2 p-2 bg-blue-50 rounded-md">
                      <p className="text-sm text-blue-700">
                        ✓ Assigned to: <strong>{contacts.find(c => c.id === Number(editForm.customer_id))?.name || editForm.customer_name}</strong>
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setEditForm({ ...editForm, customer_id: '', customer_name: '', customer_email: '' })
                          setEditContactSearch('')
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Home className="w-4 h-4 inline mr-1" />
                  Property
                </label>
                <select
                  value={editForm.property_id}
                  onChange={(e) => {
                    const propId = e.target.value
                    const prop = properties.find(p => p.id === Number(propId))
                    setEditForm({ 
                      ...editForm, 
                      property_id: propId,
                      property_name: prop?.name || ''
                    })
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select a property...</option>
                  {properties.map(prop => (
                    <option key={prop.id} value={prop.id}>
                      {prop.name} ({prop.region}) {prop.price_per_week ? `· €${prop.price_per_week.toLocaleString()}/week` : ''}
                    </option>
                  ))}
                </select>
                {editForm.property_name && !editForm.property_id && (
                  <p className="text-xs text-amber-600 mt-1">Current: {editForm.property_name} (not linked)</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={editForm.check_in}
                    onChange={(e) => setEditForm({ ...editForm, check_in: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={editForm.check_out}
                    onChange={(e) => setEditForm({ ...editForm, check_out: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 inline mr-1" />
                  Guests
                </label>
                <input
                  type="number"
                  value={editForm.guests}
                  onChange={(e) => setEditForm({ ...editForm, guests: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Number of guests"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            <div className="flex justify-between gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
              <button
                onClick={() => deleteDeal(editingDeal.id)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowEditModal(false); setEditingDeal(null) }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={updateDeal}
                  disabled={!editForm.title}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
