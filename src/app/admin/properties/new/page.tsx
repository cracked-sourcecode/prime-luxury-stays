'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Save, 
  MapPin,
  Bed,
  Bath,
  Users,
  Euro,
  Home,
  Loader2,
  Check
} from 'lucide-react'

export default function NewPropertyPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    house_type: 'Villa',
    region: 'Mallorca',
    city: '',
    country: 'Spain',
    bedrooms: '',
    bathrooms: '',
    max_guests: '',
    price_per_week: '',
    price_per_week_high: '',
    description: '',
    short_description: '',
    has_pool: false,
    has_sea_view: false,
    has_ac: true,
    has_wifi: true,
    is_active: true,
  })

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('Property name is required')
      return
    }

    setSaving(true)
    setError('')

    try {
      const payload = {
        ...formData,
        slug: generateSlug(formData.name),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        max_guests: formData.max_guests ? parseInt(formData.max_guests) : null,
        price_per_week: formData.price_per_week ? parseFloat(formData.price_per_week) : null,
        price_per_week_high: formData.price_per_week_high ? parseFloat(formData.price_per_week_high) : null,
      }

      const res = await fetch('/api/admin/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success && data.id) {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/admin/properties/${data.id}`)
        }, 1000)
      } else {
        setError(data.error || 'Failed to create property')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (success) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Created!</h2>
          <p className="text-gray-500">Redirecting to add images and details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/properties" 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Add New Property</h1>
          <p className="text-gray-500">Create a new listing - you can add images after saving</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Home className="w-5 h-5 text-gold-600" />
            Basic Information
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                placeholder="e.g., Villa Son Vida"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                value={formData.house_type}
                onChange={(e) => setFormData({ ...formData, house_type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
              >
                <option value="Villa">Villa</option>
                <option value="Finca">Finca</option>
                <option value="Apartment">Apartment</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Estate">Estate</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region *
              </label>
              <select
                required
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
              >
                <option value="Mallorca">Mallorca, Spain</option>
                <option value="Ibiza">Ibiza, Spain</option>
                <option value="South of France">South of France</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City / Area
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                placeholder="e.g., Palma, Port d'Andratx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                placeholder="Spain"
              />
            </div>
          </div>
        </div>

        {/* Capacity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-gold-600" />
            Capacity
          </h2>
          
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Bed className="w-4 h-4" /> Bedrooms
              </label>
              <input
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                placeholder="5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Bath className="w-4 h-4" /> Bathrooms
              </label>
              <input
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                placeholder="4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Users className="w-4 h-4" /> Max Guests
              </label>
              <input
                type="number"
                min="1"
                value={formData.max_guests}
                onChange={(e) => setFormData({ ...formData, max_guests: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                placeholder="10"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Euro className="w-5 h-5 text-gold-600" />
            Pricing
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Low Season (per week)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                <input
                  type="number"
                  min="0"
                  value={formData.price_per_week}
                  onChange={(e) => setFormData({ ...formData, price_per_week: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  placeholder="5000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                High Season (per week)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                <input
                  type="number"
                  min="0"
                  value={formData.price_per_week_high}
                  onChange={(e) => setFormData({ ...formData, price_per_week_high: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  placeholder="12000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'has_pool', label: 'Pool' },
              { key: 'has_sea_view', label: 'Sea View' },
              { key: 'has_ac', label: 'Air Conditioning' },
              { key: 'has_wifi', label: 'WiFi' },
            ].map(amenity => (
              <label 
                key={amenity.key} 
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  (formData as any)[amenity.key] 
                    ? 'border-gold-500 bg-gold-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={(formData as any)[amenity.key]}
                  onChange={(e) => setFormData({ ...formData, [amenity.key]: e.target.checked })}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                  (formData as any)[amenity.key] 
                    ? 'bg-gold-500 border-gold-500' 
                    : 'border-gray-300'
                }`}>
                  {(formData as any)[amenity.key] && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm font-medium text-gray-700">{amenity.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <input
                type="text"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                placeholder="A brief tagline for the property"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Description
              </label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                placeholder="Describe the property in detail..."
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <Link 
            href="/admin/properties"
            className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
          >
            Cancel
          </Link>
          
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Create Property
              </>
            )}
          </button>
        </div>

        <p className="text-sm text-gray-500 text-center">
          After creating, you'll be able to add images, set availability, and configure more options.
        </p>
      </form>
    </div>
  )
}

