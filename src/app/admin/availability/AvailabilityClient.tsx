'use client'

import { useState, useEffect } from 'react'
import { Calendar, RefreshCw, ExternalLink, ChevronDown, AlertCircle, CheckCircle } from 'lucide-react'

interface SheetData {
  sheetName: string
  headers: string[]
  rows: string[][]
}

interface SpreadsheetData {
  spreadsheetId: string
  title: string
  sheets: SheetData[]
}

// Color coding for cell values
function getCellStyle(value: string): string {
  const v = value?.toLowerCase()?.trim() || ''
  
  // Booked/blocked
  if (v.includes('owner') || v.includes('blocked') || v.includes('booked') || v.includes('reserviert')) {
    return 'bg-red-100 text-red-800 border-red-200'
  }
  // On request
  if (v.includes('a.a') || v.includes('anfrage') || v.includes('request')) {
    return 'bg-amber-50 text-amber-700 border-amber-200'
  }
  // Available (numbers usually mean price/week number)
  if (/^\d+$/.test(v)) {
    return 'bg-green-50 text-green-700 border-green-200'
  }
  // URLs or links
  if (v.includes('http') || v.includes('www.')) {
    return 'bg-blue-50 text-blue-700 border-blue-200'
  }
  
  return 'bg-white text-charcoal-700 border-gray-200'
}

export default function AvailabilityClient() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<SpreadsheetData | null>(null)
  const [activeTab, setActiveTab] = useState<string>('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1GnBbMXftJT1kdH_VNCyyz-OU0yOvP6iG/edit'

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch(`/api/admin/availability?url=${encodeURIComponent(SHEET_URL)}`)
      const json = await res.json()
      
      if (!res.ok) {
        throw new Error(json.message || json.error || 'Failed to fetch')
      }
      
      setData(json.data)
      setLastUpdated(new Date())
      
      // Set first tab as active
      if (json.data?.sheets?.length > 0 && !activeTab) {
        setActiveTab(json.data.sheets[0].sheetName)
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const activeSheet = data?.sheets?.find(s => s.sheetName === activeTab)

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
            Live booking calendar from Google Sheets
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-sm text-charcoal-400">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
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
            Open in Sheets
          </a>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Sheet</h3>
              <p className="text-red-700 mt-1">{error}</p>
              {error.includes('Access denied') && (
                <div className="mt-3 p-3 bg-red-100 rounded-lg">
                  <p className="text-sm text-red-800 font-medium">Share the spreadsheet with:</p>
                  <code className="text-xs bg-white px-2 py-1 rounded mt-1 block">
                    rubicon-storage@ecstatic-valve-465521-v6.iam.gserviceaccount.com
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !data && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <RefreshCw className="w-8 h-8 text-gold-600 animate-spin mx-auto mb-4" />
          <p className="text-charcoal-600">Loading availability data...</p>
        </div>
      )}

      {/* Data View */}
      {data && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Sheet Tabs */}
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 overflow-x-auto">
            <div className="flex gap-1">
              {data.sheets.map((sheet) => (
                <button
                  key={sheet.sheetName}
                  onClick={() => setActiveTab(sheet.sheetName)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === sheet.sheetName
                      ? 'bg-gold-600 text-white'
                      : 'bg-white text-charcoal-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {sheet.sheetName}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-green-100 border border-green-300"></span>
                <span className="text-charcoal-600">Available / Week #</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-amber-100 border border-amber-300"></span>
                <span className="text-charcoal-600">On Request (a.A.)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-red-100 border border-red-300"></span>
                <span className="text-charcoal-600">Booked / Owner</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></span>
                <span className="text-charcoal-600">Link / Info</span>
              </div>
            </div>
          </div>

          {/* Table */}
          {activeSheet && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-charcoal-800 text-white">
                    {activeSheet.headers.map((header, i) => (
                      <th
                        key={i}
                        className="px-3 py-3 text-left font-semibold whitespace-nowrap border-r border-charcoal-700 last:border-r-0"
                      >
                        {header || '-'}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeSheet.rows.map((row, rowIdx) => (
                    <tr 
                      key={rowIdx}
                      className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      {row.map((cell, cellIdx) => {
                        // First column (dates) gets special styling
                        if (cellIdx === 0) {
                          return (
                            <td
                              key={cellIdx}
                              className="px-3 py-2 font-medium text-charcoal-900 whitespace-nowrap border-r border-gray-200 bg-gray-100"
                            >
                              {cell || '-'}
                            </td>
                          )
                        }
                        
                        const cellStyle = getCellStyle(cell)
                        const isLink = cell?.includes('http') || cell?.includes('www.')
                        
                        return (
                          <td
                            key={cellIdx}
                            className={`px-3 py-2 border-r border-gray-200 last:border-r-0 ${cellStyle}`}
                          >
                            {isLink ? (
                              <a 
                                href={cell.startsWith('http') ? cell : `https://${cell}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline truncate block max-w-[150px]"
                                title={cell}
                              >
                                Link
                              </a>
                            ) : (
                              <span className="block truncate max-w-[150px]" title={cell}>
                                {cell || '-'}
                              </span>
                            )}
                          </td>
                        )
                      })}
                      {/* Fill remaining cells if row is shorter than header */}
                      {Array.from({ length: Math.max(0, activeSheet.headers.length - row.length) }).map((_, i) => (
                        <td key={`empty-${i}`} className="px-3 py-2 border-r border-gray-200 last:border-r-0">
                          -
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-sm text-charcoal-500">
            <div className="flex items-center justify-between">
              <span>
                {activeSheet?.rows.length || 0} weeks × {activeSheet?.headers.length || 0} properties
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Connected to Google Sheets
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
