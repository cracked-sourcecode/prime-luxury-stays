'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, 
  LogOut, 
  Plus, 
  Search, 
  Edit3, 
  Eye, 
  EyeOff,
  MapPin,
  Bed,
  Image,
  Calendar,
  MoreVertical,
  ChevronRight,
  Building2,
  Star,
  Filter
} from 'lucide-react'
import type { AdminUser } from '@/lib/admin'
import type { Property } from '@/lib/properties'

interface AdminDashboardProps {
  user: AdminUser;
  properties: Property[];
}

export default function AdminDashboard({ user, properties }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.city?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' || 
                          (filter === 'active' && p.is_active) ||
                          (filter === 'inactive' && !p.is_active)
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: properties.length,
    active: properties.filter(p => p.is_active).length,
    featured: properties.filter(p => p.is_featured).length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="https://storage.googleapis.com/primeluxurystays/primeluxurylogo-notext.png" 
              alt="Logo" 
              className="h-10"
            />
            <div>
              <h1 className="font-semibold text-charcoal-900">Admin Dashboard</h1>
              <p className="text-sm text-charcoal-500">Welcome back, {user.name || user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              target="_blank"
              className="text-charcoal-600 hover:text-gold-600 transition-colors flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">View Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-charcoal-600 hover:text-red-600 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-charcoal-900">{stats.total}</p>
                <p className="text-charcoal-500 text-sm">Total Properties</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-charcoal-900">{stats.active}</p>
                <p className="text-charcoal-500 text-sm">Active Listings</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center">
                <Star className="w-6 h-6 text-gold-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-charcoal-900">{stats.featured}</p>
                <p className="text-charcoal-500 text-sm">Featured Properties</p>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-charcoal-900">Properties</h2>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  />
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-charcoal-400" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Add New */}
                <Link
                  href="/admin/properties/new"
                  className="bg-gold-500 text-charcoal-900 px-4 py-2 rounded-lg font-medium hover:bg-gold-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Property
                </Link>
              </div>
            </div>
          </div>

          {/* Properties List */}
          <div className="divide-y divide-gray-100">
            {filteredProperties.length === 0 ? (
              <div className="p-12 text-center">
                <Building2 className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
                <p className="text-charcoal-500">No properties found</p>
              </div>
            ) : (
              filteredProperties.map((property) => (
                <div key={property.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-6">
                    {/* Image */}
                    <div className="w-24 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {property.featured_image ? (
                        <img 
                          src={property.featured_image} 
                          alt={property.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-8 h-8 text-charcoal-300" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-charcoal-900 truncate">
                          {property.name}
                        </h3>
                        {property.is_featured && (
                          <span className="bg-gold-100 text-gold-700 text-xs px-2 py-1 rounded-full font-medium">
                            Featured
                          </span>
                        )}
                        {!property.is_active && (
                          <span className="bg-gray-100 text-charcoal-500 text-xs px-2 py-1 rounded-full font-medium">
                            Inactive
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-charcoal-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {property.city}, {property.region}
                        </span>
                        {property.bedrooms && (
                          <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            {property.bedrooms} beds
                          </span>
                        )}
                        <span className="text-charcoal-400">
                          {property.house_type}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/properties/${property.id}`}
                        className="bg-charcoal-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-charcoal-800 transition-colors flex items-center gap-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </Link>
                      <Link
                        href={`/properties/${property.slug}`}
                        target="_blank"
                        className="border border-gray-200 text-charcoal-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

