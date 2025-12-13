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
  MapPin,
  Bed,
  Image,
  Building2,
  Star,
  Filter,
  Sparkles,
  ShieldCheck
} from 'lucide-react'
import type { AdminUser } from '@/lib/admin'
import type { Property } from '@/lib/properties'
import { AdminBrand } from '@/components/admin/AdminBrand'

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
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-cream-200/70 bg-white/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <AdminBrand subtitle="Admin" />
            <div className="hidden md:flex items-center gap-3 text-xs">
              <div className="inline-flex items-center gap-2 rounded-full bg-gold-50 border border-gold-100 px-3 py-1.5 text-gold-700">
                <ShieldCheck className="w-4 h-4" />
                Signed in as <span className="font-semibold">{user.name || user.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              href="/" 
              target="_blank"
              className="px-3 py-2 rounded-xl text-charcoal-700 hover:text-gold-700 hover:bg-gold-50 transition-colors flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">View site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl text-charcoal-700 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-charcoal-900 to-charcoal-700 flex items-center justify-center shadow-sm">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-charcoal-900">{stats.total}</p>
                <p className="text-charcoal-500 text-sm">Total properties</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center shadow-gold">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-charcoal-900">{stats.active}</p>
                <p className="text-charcoal-500 text-sm">Active listings</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gold-100 flex items-center justify-center">
                <Star className="w-6 h-6 text-gold-700" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-charcoal-900">{stats.featured}</p>
                <p className="text-charcoal-500 text-sm">Featured</p>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-cream-200 overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-cream-200 bg-cream-50/60">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-merriweather text-2xl text-charcoal-900">Properties</h2>
                <p className="text-sm text-charcoal-500 mt-1">
                  Manage listings, featured images, and availability.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-cream-200 rounded-xl w-full sm:w-64 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none bg-white"
                  />
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-charcoal-400" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="border border-cream-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none bg-white"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Add New */}
                <Link
                  href="/admin/properties/new"
                  className="bg-gradient-to-r from-gold-500 to-gold-400 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-gold-400 hover:to-gold-300 transition-all flex items-center justify-center gap-2 shadow-gold"
                >
                  <Plus className="w-5 h-5" />
                  Add Property
                </Link>
              </div>
            </div>
          </div>

          {/* Properties List */}
          <div className="divide-y divide-cream-200">
            {filteredProperties.length === 0 ? (
              <div className="p-12 text-center">
                <Building2 className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
                <p className="text-charcoal-500">No properties found</p>
              </div>
            ) : (
              filteredProperties.map((property) => (
                <div key={property.id} className="p-6 hover:bg-cream-50/70 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                    {/* Image */}
                    <div className="w-full lg:w-28 h-40 lg:h-20 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
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
                        <h3 className="font-semibold text-charcoal-900 truncate text-lg">
                          {property.name}
                        </h3>
                        {property.is_featured && (
                          <span className="bg-gold-100 text-gold-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                            Featured
                          </span>
                        )}
                        {!property.is_active && (
                          <span className="bg-cream-100 text-charcoal-600 text-xs px-2.5 py-1 rounded-full font-semibold">
                            Inactive
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-charcoal-500">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {property.city}, {property.region}
                        </span>
                        {property.bedrooms && (
                          <span className="flex items-center gap-1.5">
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
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/properties/${property.id}`}
                        className="bg-charcoal-900 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-charcoal-800 transition-colors flex items-center gap-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </Link>
                      <Link
                        href={`/properties/${property.slug}`}
                        target="_blank"
                        className="border border-cream-200 text-charcoal-700 px-4 py-2.5 rounded-xl hover:bg-cream-50 transition-colors flex items-center gap-2 font-semibold"
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

