'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  RefreshCw, 
  ExternalLink, 
  Filter, 
  X, 
  Check, 
  Edit2, 
  Save,
  ChevronDown,
  Home,
  MapPin,
  Users
} from 'lucide-react'

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
  imported_at: string
}

interface Filters {
  regions: string[]
  properties: string[]
  statuses: string[]
}

const STATUS_COLORS: Record<string, string> = {
  available: 'bg-green-100 text-green-800 border-green-300',
  on_request: 'bg-amber-100 text-amber-800 border-amber-300',
  owner: 'bg-red-100 text-red-800 border-red-300',
  booked: 'bg-purple-100 text-purple-800 border-purple-300',
  unknown: 'bg-gray-100 text-gray-600 border-gray-300',
}

const STATUS_LABELS: Record<string, string> = {
  available: 'Available',
  on_request: 'On Request',
  owner: 'Owner/Blocked',
  booked: 'Booked',
  unknown: 'Unknown',
}

export default function AvailabilityClient() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AvailabilityRecord[]>([])
  const [filters, setFilters] = useState<Filters | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string>('')
  const [selectedProperty, setSelectedProperty] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editStatus, setEditStatus] = useState<string>('')
  const [editNotes, setEditNotes] = useState<string>('')
  const [saving, setSaving] = useState(false)

  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1TLIQU2HXq9okBaBNN12ntfVirCg4sFzkatRMZhR-cvI/edit'

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedRegion) params.set('region', selectedRegion)
      if (selectedProperty) params.set('property', selectedProperty)
      if (selectedStatus) params.set('status', selectedStatus)
      
      const res = await fetch(`/api/admin/availability?${params}`)
      const json = await res.json()
      
      if (json.success) {
        setData(json.data)
        if (json.filters) setFilters(json.filters)
      }
    } catch (e) {
      console.error('Error fetching:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedRegion, selectedProperty, selectedStatus])

  const handleEdit = (record: AvailabilityRecord) => {
    setEditingId(record.id)
    setEditStatus(record.status)
    setEditNotes(record.notes || '')
  }

  const handleSave = async (id: number) => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: editStatus, notes: editNotes })
      })
      
      if (res.ok) {
        setEditingId(null)
        fetchData()
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
    setEditNotes('')
  }

  const clearFilters = () => {
    setSelectedRegion('')
    setSelectedProperty('')
    setSelectedStatus('')
  }

  // Group data by property for a better view
  const groupedByProperty = data.reduce((acc, record) => {
    if (!acc[record.property_name]) {
      acc[record.property_name] = {
        property: record.property_name,
        capacity: record.property_capacity,
        location: record.property_location,
        region: record.region,
        weeks: []
      }
    }
    acc[record.property_name].weeks.push(record)
    return acc
  }, {} as Record<string, { property: string; capacity: number | null; location: string | null; region: string; weeks: AvailabilityRecord[] }>)

  const properties = Object.values(groupedByProperty)

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900 flex items-center gap-3">
            <Calendar className="w-7 h-7 text-gold-600" />
            Property Availability
          </h1>
          <p className="text-charcoal-500 mt-1">
            {data.length} records across {properties.length} properties
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <a
            href={SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Google Sheet
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-charcoal-500" />
          <span className="font-medium text-charcoal-700">Filters</span>
          {(selectedRegion || selectedProperty || selectedStatus) && (
            <button 
              onClick={clearFilters}
              className="ml-auto text-sm text-gold-600 hover:text-gold-700"
            >
              Clear all
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Region Filter */}
          <div>
            <label className="block text-sm text-charcoal-500 mb-1">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="">All Regions</option>
              {filters?.regions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          
          {/* Property Filter */}
          <div>
            <label className="block text-sm text-charcoal-500 mb-1">Property</label>
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="">All Properties</option>
              {filters?.properties.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          
          {/* Status Filter */}
          <div>
            <label className="block text-sm text-charcoal-500 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              {filters?.statuses.map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <RefreshCw className="w-8 h-8 text-gold-600 animate-spin mx-auto mb-4" />
          <p className="text-charcoal-600">Loading availability data...</p>
        </div>
      )}

      {/* Properties Grid */}
      {!loading && properties.length > 0 && (
        <div className="space-y-6">
          {properties.map(prop => (
            <div key={prop.property} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Property Header */}
              <div className="bg-charcoal-800 text-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Home className="w-5 h-5 text-gold-400" />
                    <div>
                      <h3 className="font-semibold text-lg">{prop.property}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {prop.location || 'Unknown location'}
                        </span>
                        {prop.capacity && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {prop.capacity} guests
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-charcoal-700 rounded text-xs">
                          {prop.region}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Weeks Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-medium text-charcoal-600">Week</th>
                      <th className="px-4 py-3 text-left font-medium text-charcoal-600">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-charcoal-600">Original Value</th>
                      <th className="px-4 py-3 text-left font-medium text-charcoal-600">Notes</th>
                      <th className="px-4 py-3 text-right font-medium text-charcoal-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prop.weeks.map((week, idx) => (
                      <tr 
                        key={week.id}
                        className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="px-4 py-3 font-medium text-charcoal-900">
                          {week.week_label}
                        </td>
                        <td className="px-4 py-3">
                          {editingId === week.id ? (
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              {filters?.statuses.map(s => (
                                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                              ))}
                            </select>
                          ) : (
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[week.status] || STATUS_COLORS.unknown}`}>
                              {STATUS_LABELS[week.status] || week.status}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-charcoal-600 max-w-[200px] truncate" title={week.raw_value || ''}>
                          {week.raw_value || '-'}
                        </td>
                        <td className="px-4 py-3">
                          {editingId === week.id ? (
                            <input
                              type="text"
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              placeholder="Add notes..."
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          ) : (
                            <span className="text-charcoal-500">{week.notes || '-'}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {editingId === week.id ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleSave(week.id)}
                                disabled={saving}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancel}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEdit(week)}
                              className="p-1 text-charcoal-400 hover:text-gold-600 hover:bg-gold-50 rounded"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && data.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-medium text-charcoal-700 mb-2">No availability data found</h3>
          <p className="text-charcoal-500">Try adjusting your filters or run the migration script.</p>
        </div>
      )}
    </div>
  )
}
