'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  RefreshCw, 
  ExternalLink, 
  X, 
  Check, 
  ChevronLeft,
  ChevronRight
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
}

interface Filters {
  regions: string[]
  properties: string[]
  statuses: string[]
}

const STATUS_COLORS: Record<string, string> = {
  available: 'bg-emerald-500 hover:bg-emerald-600',
  on_request: 'bg-amber-400 hover:bg-amber-500',
  owner: 'bg-rose-500 hover:bg-rose-600',
  booked: 'bg-violet-500 hover:bg-violet-600',
  unknown: 'bg-slate-300 hover:bg-slate-400',
}

const STATUS_LABELS: Record<string, string> = {
  available: 'Available',
  on_request: 'On Request',
  owner: 'Owner',
  booked: 'Booked',
  unknown: '?',
}

const STATUS_SHORT: Record<string, string> = {
  available: 'Avail',
  on_request: 'a.A.',
  owner: 'Owner',
  booked: 'Book',
  unknown: '-',
}

export default function AvailabilityClient() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AvailabilityRecord[]>([])
  const [filters, setFilters] = useState<Filters | null>(null)
  const [activeRegion, setActiveRegion] = useState<string>('')
  const [editingCell, setEditingCell] = useState<number | null>(null)
  const [editStatus, setEditStatus] = useState<string>('')
  const [saving, setSaving] = useState(false)

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
          // Set first region as active if not set
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
    }
  }, [activeRegion])

  const handleCellClick = (record: AvailabilityRecord) => {
    setEditingCell(record.id)
    setEditStatus(record.status)
  }

  const handleSave = async () => {
    if (!editingCell) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingCell, status: editStatus })
      })
      
      if (res.ok) {
        setEditingCell(null)
        fetchData(activeRegion)
      }
    } catch (e) {
      console.error('Error saving:', e)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingCell(null)
    setEditStatus('')
  }

  // Build matrix: get unique weeks and properties for current region
  const regionData = data.filter(d => d.region === activeRegion)
  
  const weeks = [...new Set(regionData.map(d => d.week_label))].sort((a, b) => {
    // Sort by week_start if available
    const recordA = regionData.find(r => r.week_label === a)
    const recordB = regionData.find(r => r.week_label === b)
    if (recordA?.week_start && recordB?.week_start) {
      return new Date(recordA.week_start).getTime() - new Date(recordB.week_start).getTime()
    }
    return 0
  })
  
  const properties = [...new Set(regionData.map(d => d.property_name))].sort()
  
  // Create lookup map for quick cell access
  const cellMap = new Map<string, AvailabilityRecord>()
  regionData.forEach(record => {
    cellMap.set(`${record.week_label}|${record.property_name}`, record)
  })

  // Get property details
  const propertyDetails = properties.map(p => {
    const record = regionData.find(r => r.property_name === p)
    return {
      name: p,
      capacity: record?.property_capacity,
      location: record?.property_location
    }
  })

  return (
    <div className="p-4 lg:p-6 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Calendar className="w-7 h-7 text-gold-600" />
            Property Availability
          </h1>
          <p className="text-slate-500 mt-1">
            {regionData.length} weeks across {properties.length} properties
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchData(activeRegion)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <a
            href={SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Google Sheet
          </a>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-slate-600">Legend:</span>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${STATUS_COLORS[key]}`}></div>
              <span className="text-sm text-slate-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Region Tabs */}
      <div className="bg-white rounded-t-xl border border-b-0 border-slate-200 shadow-sm">
        <div className="flex overflow-x-auto">
          {filters?.regions.map(region => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeRegion === region
                  ? 'border-gold-600 text-gold-700 bg-gold-50'
                  : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="bg-white rounded-b-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 text-gold-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading availability...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="px-3 py-3 text-left font-semibold sticky left-0 bg-slate-800 z-10 min-w-[120px]">
                    Week
                  </th>
                  {propertyDetails.map(prop => (
                    <th 
                      key={prop.name} 
                      className="px-2 py-3 text-center font-semibold min-w-[100px]"
                    >
                      <div className="text-xs leading-tight">
                        <div className="font-bold">{prop.name}</div>
                        {prop.capacity && (
                          <div className="text-slate-400 font-normal">({prop.capacity})</div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, weekIdx) => (
                  <tr 
                    key={week}
                    className={weekIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                  >
                    <td className="px-3 py-2 font-medium text-slate-700 sticky left-0 bg-inherit z-10 border-r border-slate-200">
                      {week}
                    </td>
                    {properties.map(property => {
                      const record = cellMap.get(`${week}|${property}`)
                      if (!record) return <td key={property} className="px-1 py-1">-</td>
                      
                      const isEditing = editingCell === record.id
                      
                      return (
                        <td key={property} className="px-1 py-1">
                          {isEditing ? (
                            <div className="flex items-center gap-1 p-1 bg-white border-2 border-gold-500 rounded">
                              <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                className="flex-1 text-xs px-1 py-1 border-0 focus:ring-0"
                                autoFocus
                              >
                                {filters?.statuses.map(s => (
                                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                                ))}
                              </select>
                              <button
                                onClick={handleSave}
                                disabled={saving}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={handleCancel}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleCellClick(record)}
                              className={`w-full px-2 py-2 rounded text-white text-xs font-medium transition-colors ${STATUS_COLORS[record.status]}`}
                              title={`${STATUS_LABELS[record.status]}${record.notes ? ` - ${record.notes}` : ''}`}
                            >
                              {STATUS_SHORT[record.status] || record.status}
                            </button>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Stats */}
        {!loading && regionData.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500"></div>
                <span className="text-slate-600">
                  Available: {regionData.filter(r => r.status === 'available').length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-400"></div>
                <span className="text-slate-600">
                  On Request: {regionData.filter(r => r.status === 'on_request').length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-rose-500"></div>
                <span className="text-slate-600">
                  Owner: {regionData.filter(r => r.status === 'owner').length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-violet-500"></div>
                <span className="text-slate-600">
                  Booked: {regionData.filter(r => r.status === 'booked').length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
