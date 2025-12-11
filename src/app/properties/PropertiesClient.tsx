'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Map, Grid3X3, Filter, X, Bed, Bath, Waves, Home } from 'lucide-react'
import PropertyCard from '@/components/PropertyCard'
import PropertyMap from '@/components/PropertyMap'
import type { Property } from '@/lib/properties'

interface PropertiesClientProps {
  properties: Property[];
}

export default function PropertiesClient({ properties }: PropertiesClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [filters, setFilters] = useState({
    type: 'all',
    bedrooms: 'any',
    seaView: false,
    pool: false,
  })
  const [showFilters, setShowFilters] = useState(false)

  // Filter properties
  const filteredProperties = properties.filter(property => {
    if (filters.type !== 'all' && property.house_type.toLowerCase() !== filters.type) return false
    if (filters.bedrooms !== 'any' && property.bedrooms !== parseInt(filters.bedrooms)) return false
    if (filters.seaView && !property.has_sea_view) return false
    if (filters.pool && !property.has_pool) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-merriweather text-3xl md:text-4xl text-charcoal-900 mb-2">
          Luxury Properties in Mallorca
        </h1>
        <p className="text-charcoal-500 text-lg">
          {filteredProperties.length} exclusive {filteredProperties.length === 1 ? 'property' : 'properties'} available
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
              showFilters 
                ? 'bg-gold-500 text-white border-gold-500' 
                : 'bg-white text-charcoal-700 border-gray-200 hover:border-gold-300'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          {/* Quick filter pills */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setFilters(f => ({ ...f, seaView: !f.seaView }))}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                filters.seaView 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'bg-white text-charcoal-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              <Waves className="w-4 h-4" />
              Sea View
            </button>
            <button
              onClick={() => setFilters(f => ({ ...f, pool: !f.pool }))}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                filters.pool 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'bg-white text-charcoal-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              🏊 Pool
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              viewMode === 'grid' 
                ? 'bg-gold-500 text-white' 
                : 'text-charcoal-600 hover:bg-gray-50'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              viewMode === 'map' 
                ? 'bg-gold-500 text-white' 
                : 'text-charcoal-600 hover:bg-gray-50'
            }`}
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">Map</span>
          </button>
        </div>
      </div>

      {/* Extended Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-charcoal-900">Filter Properties</h3>
            <button
              onClick={() => setFilters({ type: 'all', bedrooms: 'any', seaView: false, pool: false })}
              className="text-sm text-gold-600 hover:text-gold-700"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Property Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-charcoal-900"
              >
                <option value="all">All Types</option>
                <option value="villa">Villa</option>
                <option value="finca">Finca</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Bedrooms
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => setFilters(f => ({ ...f, bedrooms: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-charcoal-900"
              >
                <option value="any">Any</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Amenities */}
            <div className="col-span-2 flex items-end gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.seaView}
                  onChange={(e) => setFilters(f => ({ ...f, seaView: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-300 text-gold-500 focus:ring-gold-500"
                />
                <span className="text-charcoal-700">Sea View</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.pool}
                  onChange={(e) => setFilters(f => ({ ...f, pool: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-300 text-gold-500 focus:ring-gold-500"
                />
                <span className="text-charcoal-700">Pool</span>
              </label>
            </div>
          </div>
        </motion.div>
      )}

      {/* Content */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>
      ) : (
        /* Map View */
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-300px)] min-h-[600px]">
          {/* Map */}
          <div className="order-2 lg:order-1 h-full rounded-2xl overflow-hidden shadow-lg">
            <PropertyMap 
              properties={filteredProperties} 
              selectedProperty={selectedProperty}
              onPropertySelect={setSelectedProperty}
            />
          </div>

          {/* Property List */}
          <div className="order-1 lg:order-2 overflow-y-auto space-y-4 pr-2">
            {filteredProperties.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`bg-white rounded-xl p-4 border transition-all cursor-pointer ${
                  selectedProperty?.id === property.id 
                    ? 'border-gold-500 shadow-lg' 
                    : 'border-gray-100 hover:border-gold-200 hover:shadow-md'
                }`}
                onClick={() => setSelectedProperty(property)}
              >
                <div className="flex gap-4">
                  <img
                    src={property.featured_image || ''}
                    alt={property.name}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-merriweather text-lg text-charcoal-900 mb-1">
                      {property.name}
                    </h3>
                    <p className="text-sm text-charcoal-500 mb-2">{property.city}</p>
                    <div className="flex items-center gap-3 text-sm text-charcoal-600">
                      <span className="flex items-center gap-1">
                        <Bed className="w-4 h-4" /> {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-4 h-4" /> {property.bathrooms}
                      </span>
                      <span className="px-2 py-0.5 bg-gold-100 text-gold-700 rounded-full text-xs">
                        {property.house_type}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredProperties.length === 0 && (
        <div className="text-center py-16">
          <Home className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
          <h3 className="font-merriweather text-xl text-charcoal-900 mb-2">
            No properties found
          </h3>
          <p className="text-charcoal-500 mb-6">
            Try adjusting your filters to see more results.
          </p>
          <button
            onClick={() => setFilters({ type: 'all', bedrooms: 'any', seaView: false, pool: false })}
            className="btn-outline"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}

