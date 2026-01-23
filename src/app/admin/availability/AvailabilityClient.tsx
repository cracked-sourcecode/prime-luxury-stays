'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Search,
  RefreshCw, 
  ExternalLink, 
  Edit2,
  Check,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAdminLocale } from '@/lib/adminLocale'

interface AvailabilityRecord {
  id: number
  region: string
  week_label: string
  week_start: string | null
  week_end: string | null
  property_name: string
  property_capacity: number | null
  property_location: string | null
  status: string
  raw_value: string | null
  notes: string | null
}

interface Filters {
  regions: string[]
  properties: string[]
  statuses: string[]
}

const STATUS_STYLES: Record<string, string> = {
  available: 'bg-green-100 text-green-700',
  on_request: 'bg-amber-100 text-amber-700',
  owner: 'bg-red-100 text-red-700',
  booked: 'bg-purple-100 text-purple-700',
  unknown: 'bg-gray-100 text-gray-600',
}

const STATUS_LABELS: Record<string, string> = {
  available: 'Available',
  on_request: 'On Request',
  owner: 'Owner',
  booked: 'Booked',
  unknown: 'Unknown',
}

export default function AvailabilityClient() {
  const { t, locale } = useAdminLocale()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AvailabilityRecord[]>([])
  const [filters, setFilters] = useState<Filters | null>(null)
  const [activeRegion, setActiveRegion] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editStatus, setEditStatus] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50

  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1TLIQU2HXq9okBaBNN12ntfVirCg4sFzkatRMZhR-cvI/edit'

  const fetchData = async (region?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (region) params.set('region', region)
      
      const res = await fetch(`/api/admin/availability?${params}`)
      const json = await res.json()
      
      if (json.success) {
        setData(json.data)
        if (json.filters) {
          setFilters(json.filters)
          if (!activeRegion && json.filters.regions.length > 0) {
            setActiveRegion(json.filters.regions[0])
          }
        }
      }
    } catch (e) {
      console.error('Error fetching:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (activeRegion) {
      fetchData(activeRegion)
      setCurrentPage(1)
    }
  }, [activeRegion])

  const handleEdit = (record: AvailabilityRecord) => {
    setEditingId(record.id)
    setEditStatus(record.status)
  }

  const handleSave = async (id: number) => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: editStatus })
      })
      
      if (res.ok) {
        setEditingId(null)
        fetchData(activeRegion)
      }
    } catch (e) {
      console.error('Error saving:', e)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditStatus('')
  }

  // Filter by search
  const filteredData = data.filter(record => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      record.property_name.toLowerCase().includes(q) ||
      record.week_label.toLowerCase().includes(q) ||
      record.property_location?.toLowerCase().includes(q)
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (loading && !data.length) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal-900">
            {locale === 'de' ? 'Verfügbarkeit' : 'Availability'}
          </h1>
          <p className="text-charcoal-500">
            {filteredData.length.toLocaleString()} {locale === 'de' ? 'Einträge' : 'records'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchData(activeRegion)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {locale === 'de' ? 'Aktualisieren' : 'Refresh'}
          </button>
          <a
            href={SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Google Sheet
          </a>
        </div>
      </div>

      {/* Region Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex overflow-x-auto border-b border-gray-100">
          {filters?.regions.map(region => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                activeRegion === region
                  ? 'border-gold-500 text-gold-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-4 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={locale === 'de' ? 'Suche nach Immobilie oder Woche...' : 'Search by property or week...'}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
            />
          </div>
          <div className="text-sm text-gray-500">
            {paginatedData.length} of {filteredData.length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {locale === 'de' ? 'Woche' : 'Week'}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {locale === 'de' ? 'Immobilie' : 'Property'}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {locale === 'de' ? 'Standort' : 'Location'}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {locale === 'de' ? 'Originalwert' : 'Original'}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {locale === 'de' ? 'Aktionen' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedData.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{record.week_label}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{record.property_name}</div>
                    {record.property_capacity && (
                      <div className="text-sm text-gray-500">{record.property_capacity} guests</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {record.property_location || '—'}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === record.id ? (
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-gold-500"
                        autoFocus
                      >
                        {filters?.statuses.map(s => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_STYLES[record.status] || STATUS_STYLES.unknown}`}>
                        {STATUS_LABELS[record.status] || record.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate" title={record.raw_value || ''}>
                    {record.raw_value || '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === record.id ? (
                        <>
                          <button
                            onClick={() => handleSave(record.id)}
                            disabled={saving}
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(record)}
                          className="p-2 text-gray-400 hover:text-gold-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {paginatedData.length === 0 && !loading && (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-700 mb-2">
              {locale === 'de' ? 'Keine Daten gefunden' : 'No data found'}
            </h3>
            <p className="text-gray-500">
              {locale === 'de' ? 'Versuchen Sie eine andere Suche' : 'Try a different search'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
