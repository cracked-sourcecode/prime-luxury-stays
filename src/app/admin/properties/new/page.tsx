'use client'

import { useState, useRef } from 'react'
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
  Check,
  Upload,
  X,
  Image as ImageIcon,
  GripVertical,
  Languages,
  Sparkles
} from 'lucide-react'
import { useAdminLocale } from '@/lib/adminLocale'

// Compress image before upload
async function compressImage(file: File, maxWidth = 1920, quality = 0.8): Promise<File> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/') || file.size < 500000) {
      resolve(file)
      return
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }))
          } else {
            resolve(file)
          }
        },
        'image/jpeg',
        quality
      )
    }
    
    img.onerror = () => resolve(file)
    img.src = URL.createObjectURL(file)
  })
}

interface StagedImage {
  id: string
  file: File
  preview: string
}

export default function NewPropertyPage() {
  const router = useRouter()
  const { t, locale } = useAdminLocale()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [translating, setTranslating] = useState<string | null>(null)

  // Staged images for upload after property creation
  const [stagedImages, setStagedImages] = useState<StagedImage[]>([])

  // Auto-translate function using OpenAI
  const translateField = async (
    sourceField: keyof typeof formData,
    targetField: keyof typeof formData,
    targetLanguage: 'en' | 'de',
    fieldType: string
  ) => {
    const sourceText = formData[sourceField] as string
    if (!sourceText?.trim()) return

    setTranslating(targetField as string)
    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          targetLanguage,
          fieldType
        })
      })
      const data = await res.json()
      if (data.translatedText) {
        setFormData(prev => ({ ...prev, [targetField]: data.translatedText }))
      }
    } catch (err) {
      console.error('Translation error:', err)
    } finally {
      setTranslating(null)
    }
  }

  // Translate all fields at once
  const translateAllToGerman = async () => {
    setTranslating('all_de')
    try {
      const translations = [
        { source: 'name', target: 'name_de', type: 'name' },
        { source: 'short_description', target: 'short_description_de', type: 'short_description' },
        { source: 'description', target: 'description_de', type: 'description' },
      ]
      
      for (const t of translations) {
        if (formData[t.source as keyof typeof formData]) {
          await translateField(
            t.source as keyof typeof formData,
            t.target as keyof typeof formData,
            'de',
            t.type
          )
        }
      }
    } finally {
      setTranslating(null)
    }
  }

  const translateAllToEnglish = async () => {
    setTranslating('all_en')
    try {
      const translations = [
        { source: 'name_de', target: 'name', type: 'name' },
        { source: 'short_description_de', target: 'short_description', type: 'short_description' },
        { source: 'description_de', target: 'description', type: 'description' },
      ]
      
      for (const t of translations) {
        if (formData[t.source as keyof typeof formData]) {
          await translateField(
            t.source as keyof typeof formData,
            t.target as keyof typeof formData,
            'en',
            t.type
          )
        }
      }
    } finally {
      setTranslating(null)
    }
  }

  const [formData, setFormData] = useState({
    name: '',
    name_de: '',
    house_type: 'Villa',
    house_type_de: '',
    region: 'Mallorca',
    city: '',
    country: 'Spain',
    bedrooms: '',
    bathrooms: '',
    max_guests: '',
    price_per_week: '',
    price_per_week_high: '',
    description: '',
    description_de: '',
    short_description: '',
    short_description_de: '',
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

  // Handle image file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newImages: StagedImage[] = []
    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        const compressed = await compressImage(file)
        newImages.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file: compressed,
          preview: URL.createObjectURL(compressed)
        })
      }
    }
    
    setStagedImages(prev => [...prev, ...newImages])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Remove staged image
  const removeStagedImage = (id: string) => {
    setStagedImages(prev => {
      const image = prev.find(img => img.id === id)
      if (image) {
        URL.revokeObjectURL(image.preview)
      }
      return prev.filter(img => img.id !== id)
    })
  }

  // Upload images to a property
  const uploadImages = async (propertyId: string) => {
    for (let i = 0; i < stagedImages.length; i++) {
      const image = stagedImages[i]
      setUploadProgress(locale === 'de' 
        ? `Bild ${i + 1} von ${stagedImages.length} wird hochgeladen...`
        : `Uploading image ${i + 1} of ${stagedImages.length}...`)
      
      const formData = new FormData()
      formData.append('file', image.file)
      formData.append('order', String(i))
      
      await fetch(`/api/admin/properties/${propertyId}/images`, {
        method: 'POST',
        body: formData,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError(locale === 'de' ? 'Immobilienname ist erforderlich' : 'Property name is required')
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
        // Upload staged images if any
        if (stagedImages.length > 0) {
          await uploadImages(data.id)
        }
        
        setSuccess(true)
        setTimeout(() => {
          router.push(`/admin/properties/${data.id}`)
        }, 1000)
      } else {
        setError(data.error || (locale === 'de' ? 'Fehler beim Erstellen' : 'Failed to create property'))
      }
    } catch (err) {
      setError(locale === 'de' ? 'Etwas ist schiefgelaufen' : 'Something went wrong')
    } finally {
      setSaving(false)
      setUploadProgress('')
    }
  }

  if (success) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {locale === 'de' ? 'Immobilie erstellt!' : 'Property Created!'}
          </h2>
          <p className="text-gray-500">
            {locale === 'de' ? 'Weiterleitung zur Bearbeitung...' : 'Redirecting to edit details...'}
          </p>
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
          <h1 className="text-2xl font-semibold text-gray-900">{t('newProperty')}</h1>
          <p className="text-gray-500">
            {locale === 'de' 
              ? 'Erstellen Sie eine neue Immobilie mit Bildern' 
              : 'Create a new listing with images'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info with Both Languages */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Home className="w-5 h-5 text-gold-600" />
            {t('propertyContent')}
          </h2>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-amber-800">
              📝 {t('contentHint')}
            </p>
          </div>
          
          {/* Auto-Translate Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-blue-800 font-medium">
              <Sparkles className="w-4 h-4" />
              {locale === 'de' ? 'AI-Übersetzung:' : 'AI Translation:'}
            </div>
            <button
              type="button"
              onClick={translateAllToGerman}
              disabled={translating !== null || !formData.name}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {translating === 'all_de' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Languages className="w-4 h-4" />
              )}
              🇬🇧 → 🇩🇪 {locale === 'de' ? 'Ins Deutsche übersetzen' : 'Translate to German'}
            </button>
            <button
              type="button"
              onClick={translateAllToEnglish}
              disabled={translating !== null || !formData.name_de}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {translating === 'all_en' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Languages className="w-4 h-4" />
              )}
              🇩🇪 → 🇬🇧 {locale === 'de' ? 'Ins Englische übersetzen' : 'Translate to English'}
            </button>
          </div>
          
          {/* Property Name - Both Languages */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🇬🇧 Property Name (English) *
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  🇩🇪 Immobilienname (Deutsch)
                </label>
                <button
                  type="button"
                  onClick={() => translateField('name', 'name_de', 'de', 'name')}
                  disabled={translating !== null || !formData.name}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
                >
                  {translating === 'name_de' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Languages className="w-3 h-3" />}
                  {locale === 'de' ? 'Übersetzen' : 'Translate'}
                </button>
              </div>
              <input
                type="text"
                value={formData.name_de}
                onChange={(e) => setFormData({ ...formData, name_de: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                placeholder="Leer lassen für englischen Namen"
              />
            </div>
          </div>

          {/* Property Type - Both Languages */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🇬🇧 Property Type
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
                🇩🇪 Haustyp (Deutsch)
              </label>
              <select
                value={formData.house_type_de}
                onChange={(e) => setFormData({ ...formData, house_type_de: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
              >
                <option value="">— Englisch verwenden —</option>
                <option value="Villa">Villa</option>
                <option value="Finca">Finca</option>
                <option value="Wohnung">Wohnung</option>
                <option value="Stadthaus">Stadthaus</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Anwesen">Anwesen</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('region')} *
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
                {t('city')}
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                placeholder="e.g., Palma"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('country')}
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

        {/* Images Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-gold-600" />
            {t('images')}
          </h2>
          
          {/* Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-gold-400 hover:bg-gold-50/50 transition-colors mb-4"
          >
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">
              {locale === 'de' 
                ? 'Klicken Sie, um Bilder auszuwählen'
                : 'Click to select images'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {locale === 'de'
                ? 'JPG, PNG, WebP unterstützt'
                : 'JPG, PNG, WebP supported'}
            </p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Staged Images Preview */}
          {stagedImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-3">
                {stagedImages.length} {locale === 'de' ? 'Bilder ausgewählt' : 'images selected'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {stagedImages.map((image, index) => (
                  <div key={image.id} className="relative group aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={image.preview} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeStagedImage(image.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-gold-500 text-white text-xs rounded-full">
                        {locale === 'de' ? 'Titelbild' : 'Featured'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Capacity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-gold-600" />
            {t('propertyDetails')}
          </h2>
          
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Bed className="w-4 h-4" /> {t('bedrooms')}
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
                <Bath className="w-4 h-4" /> {t('bathrooms')}
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
                <Users className="w-4 h-4" /> {t('maxGuests')}
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
            {t('pricing')}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('pricePerWeekLow')}
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
                {t('pricePerWeekHigh')}
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('amenities')}</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'has_pool', label: t('privatePool') },
              { key: 'has_sea_view', label: t('seaView') },
              { key: 'has_ac', label: t('airConditioning') },
              { key: 'has_wifi', label: t('wifi') },
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

        {/* Description - Both Languages */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {locale === 'de' ? 'Beschreibungen' : 'Descriptions'}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🇬🇧 Short Description (English)
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  🇩🇪 Kurzbeschreibung (Deutsch)
                </label>
                <button
                  type="button"
                  onClick={() => translateField('short_description', 'short_description_de', 'de', 'short_description')}
                  disabled={translating !== null || !formData.short_description}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
                >
                  {translating === 'short_description_de' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Languages className="w-3 h-3" />}
                  {locale === 'de' ? 'Übersetzen' : 'Translate'}
                </button>
              </div>
              <input
                type="text"
                value={formData.short_description_de}
                onChange={(e) => setFormData({ ...formData, short_description_de: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                placeholder="Kurze Beschreibung"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🇬🇧 Full Description (English)
              </label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                placeholder="Describe the property in detail..."
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  🇩🇪 Vollständige Beschreibung (Deutsch)
                </label>
                <button
                  type="button"
                  onClick={() => translateField('description', 'description_de', 'de', 'description')}
                  disabled={translating !== null || !formData.description}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
                >
                  {translating === 'description_de' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Languages className="w-3 h-3" />}
                  {locale === 'de' ? 'Übersetzen' : 'Translate'}
                </button>
              </div>
              <textarea
                rows={5}
                value={formData.description_de}
                onChange={(e) => setFormData({ ...formData, description_de: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                placeholder="Ausführliche Beschreibung der Immobilie..."
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
            {locale === 'de' ? 'Abbrechen' : 'Cancel'}
          </Link>
          
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {uploadProgress || (locale === 'de' ? 'Erstellen...' : 'Creating...')}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {locale === 'de' ? 'Immobilie erstellen' : 'Create Property'}
                {stagedImages.length > 0 && ` (${stagedImages.length} ${locale === 'de' ? 'Bilder' : 'images'})`}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
