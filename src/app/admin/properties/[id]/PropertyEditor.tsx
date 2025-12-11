'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  Calendar,
  MapPin,
  Bed,
  Bath,
  Users,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Check,
  X,
  ExternalLink,
  AlertCircle,
  Loader2
} from 'lucide-react'
import type { Property } from '@/lib/properties'
import type { PropertyImage, PropertyAvailability } from '@/lib/admin'

interface PropertyEditorProps {
  property: Property | null;
  images: PropertyImage[];
  availability: PropertyAvailability[];
  isNew: boolean;
}

export default function PropertyEditor({ property, images: initialImages, availability: initialAvailability, isNew }: PropertyEditorProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'details' | 'images' | 'availability'>('details')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    name: property?.name || '',
    slug: property?.slug || '',
    house_type: property?.house_type || 'Villa',
    license_number: property?.license_number || '',
    registry_number: property?.registry_number || '',
    address: property?.address || '',
    city: property?.city || '',
    region: property?.region || 'Mallorca',
    country: property?.country || 'Spain',
    latitude: property?.latitude?.toString() || '',
    longitude: property?.longitude?.toString() || '',
    bedrooms: property?.bedrooms?.toString() || '',
    bathrooms: property?.bathrooms?.toString() || '',
    max_guests: property?.max_guests?.toString() || '',
    description: property?.description || '',
    short_description: property?.short_description || '',
    featured_image: property?.featured_image || '',
    website_url: property?.website_url || '',
    has_pool: property?.has_pool || false,
    has_sea_view: property?.has_sea_view || false,
    has_ac: property?.has_ac || false,
    has_heating: property?.has_heating || false,
    has_wifi: property?.has_wifi || false,
    is_beachfront: property?.is_beachfront || false,
    is_active: property?.is_active ?? true,
    is_featured: property?.is_featured || false,
    min_stay_nights: property?.min_stay_nights?.toString() || '7',
  })

  // Images state
  const [images, setImages] = useState<PropertyImage[]>(initialImages)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newImageCaption, setNewImageCaption] = useState('')

  // Availability state
  const [availability, setAvailability] = useState<PropertyAvailability[]>(initialAvailability)
  const [newAvailability, setNewAvailability] = useState({
    start_date: '',
    end_date: '',
    price_per_week: '',
    price_per_night: '',
    min_nights: '7',
    status: 'available' as const,
    notes: '',
  })

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: isNew ? generateSlug(name) : prev.slug
    }))
  }

  const handleSaveDetails = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        max_guests: formData.max_guests ? parseInt(formData.max_guests) : null,
        min_stay_nights: parseInt(formData.min_stay_nights) || 7,
      }

      const res = await fetch(`/api/admin/properties${isNew ? '' : `/${property?.id}`}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        setSuccess('Property saved successfully!')
        if (isNew && data.id) {
          router.push(`/admin/properties/${data.id}`)
        } else {
          router.refresh()
        }
      } else {
        setError(data.error || 'Failed to save')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleAddImage = async () => {
    if (!newImageUrl.trim() || !property?.id) return

    try {
      const res = await fetch(`/api/admin/properties/${property.id}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image_url: newImageUrl.trim(),
          caption: newImageCaption.trim() || null
        }),
      })

      const data = await res.json()
      if (data.success) {
        setImages(prev => [...prev, { 
          id: data.id, 
          property_id: property.id, 
          image_url: newImageUrl.trim(),
          caption: newImageCaption.trim() || null,
          display_order: images.length,
          is_featured: false
        }])
        setNewImageUrl('')
        setNewImageCaption('')
      }
    } catch (err) {
      setError('Failed to add image')
    }
  }

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Delete this image?')) return

    try {
      await fetch(`/api/admin/properties/${property?.id}/images/${imageId}`, {
        method: 'DELETE',
      })
      setImages(prev => prev.filter(img => img.id !== imageId))
    } catch (err) {
      setError('Failed to delete image')
    }
  }

  const handleSetFeatured = async (imageId: number) => {
    try {
      await fetch(`/api/admin/properties/${property?.id}/images/${imageId}/featured`, {
        method: 'POST',
      })
      setImages(prev => prev.map(img => ({
        ...img,
        is_featured: img.id === imageId
      })))
      // Update form data with new featured image
      const featuredImg = images.find(img => img.id === imageId)
      if (featuredImg) {
        setFormData(prev => ({ ...prev, featured_image: featuredImg.image_url }))
      }
    } catch (err) {
      setError('Failed to set featured image')
    }
  }

  const handleAddAvailability = async () => {
    if (!newAvailability.start_date || !newAvailability.end_date || !newAvailability.price_per_week || !property?.id) return

    try {
      const res = await fetch(`/api/admin/properties/${property.id}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newAvailability,
          price_per_week: parseFloat(newAvailability.price_per_week),
          price_per_night: newAvailability.price_per_night ? parseFloat(newAvailability.price_per_night) : null,
          min_nights: parseInt(newAvailability.min_nights) || 7,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setAvailability(prev => [...prev, { 
          id: data.id,
          property_id: property.id,
          ...newAvailability,
          price_per_week: parseFloat(newAvailability.price_per_week),
          price_per_night: newAvailability.price_per_night ? parseFloat(newAvailability.price_per_night) : null,
          min_nights: parseInt(newAvailability.min_nights) || 7,
        } as PropertyAvailability])
        setNewAvailability({
          start_date: '',
          end_date: '',
          price_per_week: '',
          price_per_night: '',
          min_nights: '7',
          status: 'available',
          notes: '',
        })
      }
    } catch (err) {
      setError('Failed to add availability')
    }
  }

  const handleDeleteAvailability = async (availId: number) => {
    if (!confirm('Delete this availability period?')) return

    try {
      await fetch(`/api/admin/properties/${property?.id}/availability/${availId}`, {
        method: 'DELETE',
      })
      setAvailability(prev => prev.filter(a => a.id !== availId))
    } catch (err) {
      setError('Failed to delete availability')
    }
  }

  const handleDelete = async () => {
    if (!property?.id) return
    if (!confirm('Are you sure you want to delete this property? This cannot be undone.')) return

    try {
      await fetch(`/api/admin/properties/${property.id}`, {
        method: 'DELETE',
      })
      router.push('/admin')
    } catch (err) {
      setError('Failed to delete property')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin" 
                className="text-charcoal-500 hover:text-charcoal-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-semibold text-charcoal-900">
                  {isNew ? 'Add New Property' : `Edit: ${property?.name}`}
                </h1>
                {!isNew && (
                  <p className="text-sm text-charcoal-500">ID: {property?.id}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isNew && property?.slug && (
                <Link
                  href={`/properties/${property.slug}`}
                  target="_blank"
                  className="text-charcoal-600 hover:text-gold-600 transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span className="hidden sm:inline">View Live</span>
                </Link>
              )}
              
              {!isNew && (
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-green-700">
            <Check className="w-5 h-5 flex-shrink-0" />
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="ml-auto">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-8">
          {[
            { id: 'details', label: 'Details', icon: Bed },
            { id: 'images', label: 'Images', icon: ImageIcon, disabled: isNew },
            { id: 'availability', label: 'Availability & Pricing', icon: Calendar, disabled: isNew },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id as any)}
              disabled={tab.disabled}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-charcoal-900 shadow-sm' 
                  : tab.disabled
                    ? 'text-charcoal-300 cursor-not-allowed'
                    : 'text-charcoal-500 hover:text-charcoal-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="space-y-8">
              {/* Basic Info */}
              <section>
                <h3 className="font-semibold text-charcoal-900 mb-4">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Property Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder="Villa Vista Malgrat"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">URL Slug *</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder="villa-vista-malgrat"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">House Type</label>
                    <select
                      value={formData.house_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, house_type: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                    >
                      <option value="Villa">Villa</option>
                      <option value="Finca">Finca</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Townhouse">Townhouse</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Website URL</label>
                    <input
                      type="url"
                      value={formData.website_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </section>

              {/* License */}
              <section>
                <h3 className="font-semibold text-charcoal-900 mb-4">License Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">License Number</label>
                    <input
                      type="text"
                      value={formData.license_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder="ETV/1234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Registry Number</label>
                    <input
                      type="text"
                      value={formData.registry_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, registry_number: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder="ESFCTU..."
                    />
                  </div>
                </div>
              </section>

              {/* Location */}
              <section>
                <h3 className="font-semibold text-charcoal-900 mb-4">Location</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder="Calle Example 123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder="Santa Ponsa"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Region</label>
                    <input
                      type="text"
                      value={formData.region}
                      onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder="Mallorca"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Latitude</label>
                    <input
                      type="text"
                      value={formData.latitude}
                      onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder="39.5123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Longitude</label>
                    <input
                      type="text"
                      value={formData.longitude}
                      onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder="2.4567"
                    />
                  </div>
                </div>
              </section>

              {/* Property Details */}
              <section>
                <h3 className="font-semibold text-charcoal-900 mb-4">Property Details</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Bedrooms</label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Bathrooms</label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Max Guests</label>
                    <input
                      type="number"
                      value={formData.max_guests}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_guests: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Min Nights</label>
                    <input
                      type="number"
                      value={formData.min_stay_nights}
                      onChange={(e) => setFormData(prev => ({ ...prev, min_stay_nights: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      min="1"
                    />
                  </div>
                </div>
              </section>

              {/* Description */}
              <section>
                <h3 className="font-semibold text-charcoal-900 mb-4">Description</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Short Description</label>
                    <input
                      type="text"
                      value={formData.short_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder="A brief tagline for the property"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Full Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none resize-none"
                      placeholder="Detailed description of the property..."
                    />
                  </div>
                </div>
              </section>

              {/* Amenities */}
              <section>
                <h3 className="font-semibold text-charcoal-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'has_pool', label: 'Private Pool' },
                    { key: 'has_sea_view', label: 'Sea View' },
                    { key: 'has_ac', label: 'Air Conditioning' },
                    { key: 'has_heating', label: 'Heating' },
                    { key: 'has_wifi', label: 'WiFi' },
                    { key: 'is_beachfront', label: 'Beachfront' },
                  ].map((amenity) => (
                    <label key={amenity.key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData[amenity.key as keyof typeof formData] as boolean}
                        onChange={(e) => setFormData(prev => ({ ...prev, [amenity.key]: e.target.checked }))}
                        className="w-5 h-5 rounded border-gray-300 text-gold-500 focus:ring-gold-500"
                      />
                      <span className="text-charcoal-700">{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Status */}
              <section>
                <h3 className="font-semibold text-charcoal-900 mb-4">Status</h3>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="w-5 h-5 rounded border-gray-300 text-gold-500 focus:ring-gold-500"
                    />
                    <span className="text-charcoal-700 flex items-center gap-2">
                      {formData.is_active ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                      Active (visible on website)
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                      className="w-5 h-5 rounded border-gray-300 text-gold-500 focus:ring-gold-500"
                    />
                    <span className="text-charcoal-700 flex items-center gap-2">
                      {formData.is_featured ? <Star className="w-5 h-5 text-gold-500 fill-gold-500" /> : <StarOff className="w-5 h-5 text-gray-400" />}
                      Featured Property
                    </span>
                  </label>
                </div>
              </section>

              {/* Featured Image URL */}
              <section>
                <h3 className="font-semibold text-charcoal-900 mb-4">Featured Image URL</h3>
                <input
                  type="url"
                  value={formData.featured_image}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  placeholder="https://storage.googleapis.com/..."
                />
                {formData.featured_image && (
                  <div className="mt-4">
                    <img 
                      src={formData.featured_image} 
                      alt="Featured" 
                      className="w-48 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </section>

              {/* Save Button */}
              <div className="pt-6 border-t border-gray-100">
                <button
                  onClick={handleSaveDetails}
                  disabled={saving}
                  className="bg-gold-500 text-charcoal-900 px-8 py-4 rounded-xl font-semibold hover:bg-gold-400 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Property
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && !isNew && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="mb-8">
              <h3 className="font-semibold text-charcoal-900 mb-4">Add New Image</h3>
              <p className="text-charcoal-500 text-sm mb-4">
                Upload images to Google Cloud Storage first, then paste the URL here.
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  placeholder="https://storage.googleapis.com/primeluxurystays/..."
                />
                <input
                  type="text"
                  value={newImageCaption}
                  onChange={(e) => setNewImageCaption(e.target.value)}
                  className="md:w-64 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  placeholder="Caption (optional)"
                />
                <button
                  onClick={handleAddImage}
                  disabled={!newImageUrl.trim()}
                  className="bg-gold-500 text-charcoal-900 px-6 py-3 rounded-lg font-medium hover:bg-gold-400 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-5 h-5" />
                  Add
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <h3 className="font-semibold text-charcoal-900 mb-4">Property Images ({images.length})</h3>
              
              {images.length === 0 ? (
                <div className="text-center py-12 text-charcoal-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4" />
                  <p>No images yet. Add your first image above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.image_url}
                        alt={image.caption || 'Property image'}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      {image.is_featured && (
                        <div className="absolute top-2 left-2 bg-gold-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3 fill-white" />
                          Featured
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        {!image.is_featured && (
                          <button
                            onClick={() => handleSetFeatured(image.id)}
                            className="bg-white text-charcoal-900 p-2 rounded-lg hover:bg-gold-100 transition-colors"
                            title="Set as featured"
                          >
                            <Star className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="bg-white text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete image"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      {image.caption && (
                        <p className="mt-2 text-sm text-charcoal-500 truncate">{image.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Availability Tab */}
        {activeTab === 'availability' && !isNew && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="mb-8">
              <h3 className="font-semibold text-charcoal-900 mb-4">Add Availability Period</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={newAvailability.start_date}
                    onChange={(e) => setNewAvailability(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={newAvailability.end_date}
                    onChange={(e) => setNewAvailability(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">Price/Week (€)</label>
                  <input
                    type="number"
                    value={newAvailability.price_per_week}
                    onChange={(e) => setNewAvailability(prev => ({ ...prev, price_per_week: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                    placeholder="2500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">Price/Night (€)</label>
                  <input
                    type="number"
                    value={newAvailability.price_per_night}
                    onChange={(e) => setNewAvailability(prev => ({ ...prev, price_per_night: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                    placeholder="400"
                    min="0"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">Min Nights</label>
                  <input
                    type="number"
                    value={newAvailability.min_nights}
                    onChange={(e) => setNewAvailability(prev => ({ ...prev, min_nights: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">Status</label>
                  <select
                    value={newAvailability.status}
                    onChange={(e) => setNewAvailability(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">Notes</label>
                  <input
                    type="text"
                    value={newAvailability.notes}
                    onChange={(e) => setNewAvailability(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                    placeholder="Optional notes"
                  />
                </div>
              </div>
              <button
                onClick={handleAddAvailability}
                disabled={!newAvailability.start_date || !newAvailability.end_date || !newAvailability.price_per_week}
                className="bg-gold-500 text-charcoal-900 px-6 py-3 rounded-lg font-medium hover:bg-gold-400 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
                Add Period
              </button>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <h3 className="font-semibold text-charcoal-900 mb-4">Availability Calendar ({availability.length} periods)</h3>
              
              {availability.length === 0 ? (
                <div className="text-center py-12 text-charcoal-400">
                  <Calendar className="w-12 h-12 mx-auto mb-4" />
                  <p>No availability periods set. Add your first one above.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-4 font-medium text-charcoal-600">Period</th>
                        <th className="text-left py-3 px-4 font-medium text-charcoal-600">Price/Week</th>
                        <th className="text-left py-3 px-4 font-medium text-charcoal-600">Price/Night</th>
                        <th className="text-left py-3 px-4 font-medium text-charcoal-600">Min Nights</th>
                        <th className="text-left py-3 px-4 font-medium text-charcoal-600">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-charcoal-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availability.map((period) => (
                        <tr key={period.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="font-medium text-charcoal-900">
                              {new Date(period.start_date).toLocaleDateString()} - {new Date(period.end_date).toLocaleDateString()}
                            </div>
                            {period.notes && (
                              <div className="text-sm text-charcoal-400">{period.notes}</div>
                            )}
                          </td>
                          <td className="py-4 px-4 font-medium text-charcoal-900">€{period.price_per_week}</td>
                          <td className="py-4 px-4 text-charcoal-600">
                            {period.price_per_night ? `€${period.price_per_night}` : '-'}
                          </td>
                          <td className="py-4 px-4 text-charcoal-600">{period.min_nights}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              period.status === 'available' ? 'bg-green-100 text-green-700' :
                              period.status === 'booked' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {period.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => handleDeleteAvailability(period.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

