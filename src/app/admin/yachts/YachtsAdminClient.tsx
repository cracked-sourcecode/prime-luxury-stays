'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Anchor, Plus, Pencil, Trash2, Search, Eye, EyeOff, Star, 
  Ship, Users, Ruler, ChevronRight, X, Save, Image as ImageIcon,
  Upload, Loader2, Languages, Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'
import { useAdminLocale } from '@/lib/adminLocale'

interface YachtImage {
  id: number
  image_url: string
  is_featured: boolean
}

interface Yacht {
  id: number
  name: string
  slug: string
  manufacturer: string
  model: string
  yacht_type: string
  year_built: number
  length_meters: number
  beam_meters: number
  guest_cabins: number
  max_guests: number
  crew_members: number
  short_description: string
  long_description: string
  cruising_speed_knots: number
  has_stabilizers: boolean
  water_toys_list: string[]
  featured_image: string
  region: string
  is_active: boolean
  is_featured: boolean
  images: YachtImage[]
}

interface YachtsAdminClientProps {
  user: any
  initialYachts: Yacht[]
  stats: { total: number; active: number; featured: number }
}

const emptyFormData = {
  name: '',
  slug: '',
  manufacturer: '',
  model: '',
  yacht_type: 'Motor Yacht',
  year_built: new Date().getFullYear(),
  length_meters: '',
  beam_meters: '',
  guest_cabins: '',
  max_guests: '',
  crew_members: '',
  short_description: '',
  long_description: '',
  cruising_speed_knots: '',
  has_stabilizers: false,
  water_toys_list: [] as string[],
  featured_image: '',
  home_port: 'Palma de Mallorca',
  region: 'Mallorca',
  is_active: true,
  is_featured: false,
}

export default function YachtsAdminClient({ user, initialYachts, stats }: YachtsAdminClientProps) {
  const { t } = useAdminLocale()
  const router = useRouter()
  const [yachts, setYachts] = useState(initialYachts)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingYacht, setEditingYacht] = useState<Yacht | null>(null)
  const [formData, setFormData] = useState(emptyFormData)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [waterToyInput, setWaterToyInput] = useState('')

  const filteredYachts = yachts.filter(yacht => 
    yacht.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    yacht.model?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const openAddModal = () => {
    setEditingYacht(null)
    setFormData(emptyFormData)
    setIsModalOpen(true)
  }

  const openEditModal = (yacht: Yacht) => {
    setEditingYacht(yacht)
    setFormData({
      name: yacht.name || '',
      slug: yacht.slug || '',
      manufacturer: yacht.manufacturer || '',
      model: yacht.model || '',
      yacht_type: yacht.yacht_type || 'Motor Yacht',
      year_built: yacht.year_built || new Date().getFullYear(),
      length_meters: yacht.length_meters?.toString() || '',
      beam_meters: yacht.beam_meters?.toString() || '',
      guest_cabins: yacht.guest_cabins?.toString() || '',
      max_guests: yacht.max_guests?.toString() || '',
      crew_members: yacht.crew_members?.toString() || '',
      short_description: yacht.short_description || '',
      long_description: yacht.long_description || '',
      cruising_speed_knots: yacht.cruising_speed_knots?.toString() || '',
      has_stabilizers: yacht.has_stabilizers || false,
      water_toys_list: typeof yacht.water_toys_list === 'string' ? JSON.parse(yacht.water_toys_list) : yacht.water_toys_list || [],
      featured_image: yacht.featured_image || '',
      home_port: 'Palma de Mallorca',
      region: yacht.region || 'Mallorca',
      is_active: yacht.is_active,
      is_featured: yacht.is_featured,
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      setError('Name and slug are required')
      return
    }

    setSaving(true)
    setError('')

    try {
      const payload = {
        ...formData,
        length_meters: formData.length_meters ? parseFloat(formData.length_meters) : null,
        beam_meters: formData.beam_meters ? parseFloat(formData.beam_meters) : null,
        guest_cabins: formData.guest_cabins ? parseInt(formData.guest_cabins) : null,
        max_guests: formData.max_guests ? parseInt(formData.max_guests) : null,
        crew_members: formData.crew_members ? parseInt(formData.crew_members) : null,
        cruising_speed_knots: formData.cruising_speed_knots ? parseFloat(formData.cruising_speed_knots) : null,
      }

      const url = editingYacht 
        ? `/api/admin/yachts/${editingYacht.id}`
        : '/api/admin/yachts'
      
      const res = await fetch(url, {
        method: editingYacht ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        setSuccess(editingYacht ? 'Yacht updated!' : 'Yacht created!')
        setIsModalOpen(false)
        router.refresh()
        
        // Update local state
        if (editingYacht) {
          setYachts(prev => prev.map(y => y.id === editingYacht.id ? data.yacht : y))
        } else {
          setYachts(prev => [data.yacht, ...prev])
        }
      } else {
        setError(data.error || 'Failed to save yacht')
      }
    } catch (err) {
      setError('Failed to save yacht')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (yacht: Yacht) => {
    if (!confirm(`Are you sure you want to delete "${yacht.name}"?`)) return

    try {
      const res = await fetch(`/api/admin/yachts/${yacht.id}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        setSuccess('Yacht deleted!')
        setYachts(prev => prev.filter(y => y.id !== yacht.id))
      } else {
        setError(data.error || 'Failed to delete yacht')
      }
    } catch (err) {
      setError('Failed to delete yacht')
    }
  }

  const toggleActive = async (yacht: Yacht) => {
    try {
      const res = await fetch(`/api/admin/yachts/${yacht.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !yacht.is_active }),
      })
      const data = await res.json()

      if (data.success) {
        setYachts(prev => prev.map(y => y.id === yacht.id ? { ...y, is_active: !y.is_active } : y))
      }
    } catch (err) {
      setError('Failed to update yacht')
    }
  }

  const toggleFeatured = async (yacht: Yacht) => {
    try {
      const res = await fetch(`/api/admin/yachts/${yacht.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: !yacht.is_featured }),
      })
      const data = await res.json()

      if (data.success) {
        setYachts(prev => prev.map(y => y.id === yacht.id ? { ...y, is_featured: !y.is_featured } : y))
      }
    } catch (err) {
      setError('Failed to update yacht')
    }
  }

  const addWaterToy = () => {
    if (waterToyInput.trim()) {
      setFormData(prev => ({
        ...prev,
        water_toys_list: [...prev.water_toys_list, waterToyInput.trim()]
      }))
      setWaterToyInput('')
    }
  }

  const removeWaterToy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      water_toys_list: prev.water_toys_list.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <AdminNav userName={user.name} userEmail={user.email} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-merriweather text-charcoal-800 flex items-center gap-3">
              <Anchor className="w-8 h-8 text-gold-500" />
              Yachts Management
            </h1>
            <p className="text-charcoal-600 mt-1">Manage your luxury yacht fleet</p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-5 py-3 rounded-xl font-medium transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Yacht
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-cream-200">
            <div className="text-3xl font-merriweather text-charcoal-800">{stats.total}</div>
            <div className="text-charcoal-500 text-sm">Total Yachts</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-cream-200">
            <div className="text-3xl font-merriweather text-green-600">{stats.active}</div>
            <div className="text-charcoal-500 text-sm">Active</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-cream-200">
            <div className="text-3xl font-merriweather text-gold-500">{stats.featured}</div>
            <div className="text-charcoal-500 text-sm">Featured</div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center justify-between">
            <span>{success}</span>
            <button onClick={() => setSuccess('')}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-cream-200 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search yachts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
            />
          </div>
        </div>

        {/* Yachts Grid */}
        {filteredYachts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredYachts.map((yacht) => (
              <motion.div
                key={yacht.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-cream-200 group"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
                  {yacht.featured_image || yacht.images?.[0]?.image_url ? (
                    <img
                      src={yacht.featured_image || yacht.images[0].image_url}
                      alt={yacht.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Ship className="w-16 h-16 text-cream-300" />
                    </div>
                  )}
                  
                  {/* Status badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {yacht.is_featured && (
                      <span className="bg-gold-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3" /> Featured
                      </span>
                    )}
                    {!yacht.is_active && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => openEditModal(yacht)}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-charcoal-800 hover:bg-gold-500 hover:text-white transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleActive(yacht)}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-charcoal-800 hover:bg-blue-500 hover:text-white transition-all"
                    >
                      {yacht.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => toggleFeatured(yacht)}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-charcoal-800 hover:bg-gold-500 hover:text-white transition-all"
                    >
                      <Star className={`w-4 h-4 ${yacht.is_featured ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleDelete(yacht)}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-charcoal-800 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-merriweather text-lg text-charcoal-800 mb-1">{yacht.name}</h3>
                  <p className="text-charcoal-500 text-sm mb-3">{yacht.manufacturer} {yacht.model}</p>
                  
                  <div className="flex items-center gap-4 text-charcoal-500 text-sm">
                    <span className="flex items-center gap-1">
                      <Ruler className="w-4 h-4" /> {yacht.length_meters}m
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" /> {yacht.max_guests}
                    </span>
                    <span className="flex items-center gap-1">
                      <Ship className="w-4 h-4" /> {yacht.guest_cabins}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-cream-200">
            <Ship className="w-16 h-16 text-cream-300 mx-auto mb-4" />
            <h3 className="text-xl text-charcoal-800 mb-2">No yachts yet</h3>
            <p className="text-charcoal-500 mb-6">Add your first yacht to get started</p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-5 py-3 rounded-xl font-medium transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Yacht
            </button>
          </div>
        )}

        {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-cream-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-merriweather text-charcoal-800">
                {editingYacht ? 'Edit Yacht' : 'Add New Yacht'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-cream-100 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        name: e.target.value,
                        slug: editingYacht ? prev.slug : generateSlug(e.target.value)
                      }))
                    }}
                    className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                    placeholder="e.g., Barracuda III"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                    placeholder="barracuda-iii"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">Model</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                    placeholder="e.g., RIVA Argo 90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">Year Built</label>
                  <input
                    type="number"
                    value={formData.year_built}
                    onChange={(e) => setFormData(prev => ({ ...prev, year_built: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  />
                </div>
              </div>

              {/* Specs */}
              <div className="bg-cream-50 p-5 rounded-xl">
                <h3 className="font-medium text-charcoal-700 mb-4 flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-gold-500" /> Specifications
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm text-charcoal-600 mb-1">Length (m)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.length_meters}
                      onChange={(e) => setFormData(prev => ({ ...prev, length_meters: e.target.value }))}
                      className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-charcoal-600 mb-1">Beam (m)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.beam_meters}
                      onChange={(e) => setFormData(prev => ({ ...prev, beam_meters: e.target.value }))}
                      className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-charcoal-600 mb-1">Guest Cabins</label>
                    <input
                      type="number"
                      value={formData.guest_cabins}
                      onChange={(e) => setFormData(prev => ({ ...prev, guest_cabins: e.target.value }))}
                      className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-charcoal-600 mb-1">Max Guests</label>
                    <input
                      type="number"
                      value={formData.max_guests}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_guests: e.target.value }))}
                      className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-charcoal-600 mb-1">Crew</label>
                    <input
                      type="number"
                      value={formData.crew_members}
                      onChange={(e) => setFormData(prev => ({ ...prev, crew_members: e.target.value }))}
                      className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-charcoal-600 mb-1">Engines</label>
                    <input
                      type="text"
                      value={formData.engines}
                      onChange={(e) => setFormData(prev => ({ ...prev, engines: e.target.value }))}
                      className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                      placeholder="2 x MTU 2000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-charcoal-600 mb-1">Cruising Speed (kn)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.cruising_speed_knots}
                      onChange={(e) => setFormData(prev => ({ ...prev, cruising_speed_knots: e.target.value }))}
                      className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>
                  <div className="flex items-end gap-3">
                    <label className="flex items-center gap-2 text-sm text-charcoal-600">
                      <input
                        type="checkbox"
                        checked={formData.has_stabilizers}
                        onChange={(e) => setFormData(prev => ({ ...prev, has_stabilizers: e.target.checked }))}
                        className="w-4 h-4 rounded border-cream-300 text-gold-500 focus:ring-gold-500"
                      />
                      Stabilizers
                    </label>
                  </div>
                </div>
                {formData.has_stabilizers && (
                  <div className="mt-4">
                    <label className="block text-sm text-charcoal-600 mb-1">Stabilizer Type</label>
                    <input
                      type="text"
                      value={formData.stabilizer_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, stabilizer_type: e.target.value }))}
                      className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                      placeholder="e.g., 0-Speed Stabilizer"
                    />
                  </div>
                )}
              </div>

              {/* Water Toys */}
              <div className="bg-cream-50 p-5 rounded-xl">
                <h3 className="font-medium text-charcoal-700 mb-4">Water Toys</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={waterToyInput}
                    onChange={(e) => setWaterToyInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addWaterToy())}
                    className="flex-1 px-3 py-2 border border-cream-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                    placeholder="Add water toy (e.g., Jet Ski, Seabob)"
                  />
                  <button
                    type="button"
                    onClick={addWaterToy}
                    className="px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.water_toys_list.map((toy, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-white px-3 py-1.5 rounded-full text-sm border border-cream-200"
                    >
                      {toy}
                      <button onClick={() => removeWaterToy(index)} className="text-charcoal-400 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Languages className="w-5 h-5 text-gold-500" />
                  <h3 className="font-medium text-charcoal-700">Descriptions (EN / DE)</h3>
                </div>
                
                <div>
                  <label className="block text-sm text-charcoal-600 mb-1">Short Description</label>
                  <textarea
                    value={formData.short_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                    className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none resize-none"
                    rows={2}
                    placeholder="Brief description for listings..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-charcoal-600 mb-1">Full Description</label>
                  <textarea
                    value={formData.long_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, long_description: e.target.value }))}
                    className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none resize-none"
                    rows={4}
                    placeholder="Detailed yacht description..."
                  />
                </div>
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">Featured Image URL</label>
                <input
                  type="url"
                  value={formData.featured_image}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                  className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  placeholder="https://storage.googleapis.com/..."
                />
              </div>

              {/* Status */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-charcoal-600">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 rounded border-cream-300 text-gold-500 focus:ring-gold-500"
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm text-charcoal-600">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="w-4 h-4 rounded border-cream-300 text-gold-500 focus:ring-gold-500"
                  />
                  Featured
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-cream-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-charcoal-600 hover:bg-cream-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editingYacht ? 'Update Yacht' : 'Create Yacht'}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </main>
    </div>
  )
}
