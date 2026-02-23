'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Anchor, Plus, Pencil, Trash2, Search, Eye, EyeOff, Star, 
  Ship, Users, Ruler, ChevronRight, X, Save, Image as ImageIcon,
  Upload, Loader2, Languages, Sparkles, CloudUpload, ChevronUp, ChevronDown,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'
import { useAdminLocale } from '@/lib/adminLocale'

// Compress image before upload
async function compressImage(file: File, maxWidth = 1920, quality = 0.8): Promise<File> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/') || file.size < 500000) {
      resolve(file)
      return
    }

    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

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
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            resolve(compressedFile)
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

interface YachtImage {
  id: number
  yacht_id: number
  image_url: string
  caption?: string
  caption_de?: string
  display_order: number
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
  short_description_de: string
  long_description: string
  long_description_de: string
  cruising_speed_knots: number
  has_stabilizers: boolean
  water_toys_list: string[]
  featured_image: string
  region: string
  price_per_day: number
  price_per_week: number
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
  short_description_de: '',
  long_description: '',
  long_description_de: '',
  cruising_speed_knots: '',
  has_stabilizers: false,
  water_toys_list: [] as string[],
  featured_image: '',
  home_port: 'Palma de Mallorca',
  region: 'Mallorca',
  price_per_day: '',
  price_per_week: '',
  is_active: true,
  is_featured: false,
}

export default function YachtsAdminClient({ user, initialYachts, stats }: YachtsAdminClientProps) {
  const { t, locale } = useAdminLocale()
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
  const [activeTab, setActiveTab] = useState<'details' | 'images'>('details')
  
  // Image management state
  const [images, setImages] = useState<YachtImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set())
  const [deletingBulk, setDeletingBulk] = useState(false)
  const [draggedImageId, setDraggedImageId] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  
  // Translation state
  const [translating, setTranslating] = useState<string | null>(null)
  const translateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const filteredYachts = yachts.filter(yacht => 
    yacht.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    yacht.model?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Auto-translate function using OpenAI
  const translateText = async (
    text: string,
    targetLanguage: 'en' | 'de',
    fieldType: string
  ): Promise<string | null> => {
    if (!text?.trim()) return null

    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          targetLanguage,
          fieldType
        })
      })
      const data = await res.json()
      return data.translatedText || null
    } catch (err) {
      console.error('Translation error:', err)
      return null
    }
  }

  // Auto-translate when English field changes
  const handleTranslatableEnglishChange = (
    field: 'short_description' | 'long_description',
    value: string
  ) => {
    const germanField = field === 'long_description' ? 'long_description_de' : `${field}_de` as keyof typeof formData
    
    setFormData(prev => ({ ...prev, [field]: value }))

    if (translateTimeoutRef.current) {
      clearTimeout(translateTimeoutRef.current)
    }

    if (value.trim()) {
      translateTimeoutRef.current = setTimeout(async () => {
        setTranslating(germanField)
        const translated = await translateText(value, 'de', field)
        if (translated) {
          setFormData(prev => ({ ...prev, [germanField]: translated }))
        }
        setTranslating(null)
      }, 1000)
    }
  }

  // Translate all fields at once
  const translateAllToGerman = async () => {
    setTranslating('all_de')
    try {
      const fields = [
        { en: 'short_description', de: 'short_description_de' },
        { en: 'long_description', de: 'long_description_de' }
      ] as const
      for (const { en, de } of fields) {
        if (formData[en]) {
          const translated = await translateText(formData[en], 'de', en)
          if (translated) {
            setFormData(prev => ({ ...prev, [de]: translated }))
          }
        }
      }
    } finally {
      setTranslating(null)
    }
  }

  const translateAllToEnglish = async () => {
    setTranslating('all_en')
    try {
      const fields = [
        { de: 'short_description_de', en: 'short_description' },
        { de: 'long_description_de', en: 'long_description' }
      ] as const
      for (const { de, en } of fields) {
        if (formData[de]) {
          const translated = await translateText(formData[de], 'en', en)
          if (translated) {
            setFormData(prev => ({ ...prev, [en]: translated }))
          }
        }
      }
    } finally {
      setTranslating(null)
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (translateTimeoutRef.current) {
        clearTimeout(translateTimeoutRef.current)
      }
    }
  }, [])

  const openAddModal = () => {
    setEditingYacht(null)
    setFormData(emptyFormData)
    setImages([])
    setActiveTab('details')
    setIsModalOpen(true)
  }

  const openEditModal = async (yacht: Yacht) => {
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
      short_description_de: yacht.short_description_de || '',
      long_description: yacht.long_description || '',
      long_description_de: yacht.long_description_de || '',
      cruising_speed_knots: yacht.cruising_speed_knots?.toString() || '',
      has_stabilizers: yacht.has_stabilizers || false,
      water_toys_list: typeof yacht.water_toys_list === 'string' ? JSON.parse(yacht.water_toys_list) : yacht.water_toys_list || [],
      featured_image: yacht.featured_image || '',
      home_port: 'Palma de Mallorca',
      region: yacht.region || 'Mallorca',
      price_per_day: yacht.price_per_day?.toString() || '',
      price_per_week: yacht.price_per_week?.toString() || '',
      is_active: yacht.is_active,
      is_featured: yacht.is_featured,
    })
    setActiveTab('details')
    setIsModalOpen(true)
    
    // Load images
    try {
      const res = await fetch(`/api/admin/yachts/${yacht.id}/images`)
      const data = await res.json()
      setImages(data.images || [])
    } catch (err) {
      console.error('Failed to load yacht images:', err)
      setImages([])
    }
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
        price_per_day: formData.price_per_day ? parseFloat(formData.price_per_day) : null,
        price_per_week: formData.price_per_week ? parseFloat(formData.price_per_week) : null,
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

  // Image Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !editingYacht?.id) return

    setUploading(true)
    setError('')

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setUploadProgress(`Compressing ${i + 1}/${files.length}: ${file.name}`)

      try {
        const compressedFile = await compressImage(file, 1920, 0.8)
        setUploadProgress(`Uploading ${i + 1}/${files.length}: ${file.name}`)

        // Upload to GCS
        const uploadFormData = new FormData()
        uploadFormData.append('file', compressedFile)
        uploadFormData.append('yachtSlug', editingYacht.slug || `yacht-${editingYacht.id}`)
        uploadFormData.append('yachtId', editingYacht.id.toString())

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        const uploadData = await uploadRes.json()

        if (!uploadData.success) {
          setError(`Failed to upload ${file.name}: ${uploadData.error}`)
          continue
        }

        // Add to yacht images
        const res = await fetch(`/api/admin/yachts/${editingYacht.id}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            image_url: uploadData.url,
            storage_bucket: 'primeluxurystays-rpr',
            storage_path: uploadData.storagePath,
          }),
        })

        const data = await res.json()
        if (data.success) {
          setImages(prev => [...prev, data.image])
        }
      } catch (err) {
        setError(`Failed to upload ${file.name}`)
      }
    }

    setUploading(false)
    setUploadProgress('')
    e.target.value = ''
  }

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Delete this image?') || !editingYacht) return

    try {
      await fetch(`/api/admin/yachts/${editingYacht.id}/images?imageId=${imageId}`, {
        method: 'DELETE',
      })
      setImages(prev => prev.filter(img => img.id !== imageId))
      setSelectedImages(prev => {
        const next = new Set(prev)
        next.delete(imageId)
        return next
      })
    } catch (err) {
      setError('Failed to delete image')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedImages.size === 0 || !editingYacht) return
    if (!confirm(`Delete ${selectedImages.size} selected image${selectedImages.size > 1 ? 's' : ''}?`)) return

    setDeletingBulk(true)
    setError('')

    try {
      const deletePromises = Array.from(selectedImages).map(imageId =>
        fetch(`/api/admin/yachts/${editingYacht.id}/images?imageId=${imageId}`, {
          method: 'DELETE',
        })
      )
      await Promise.all(deletePromises)
      setImages(prev => prev.filter(img => !selectedImages.has(img.id)))
      setSelectedImages(new Set())
    } catch (err) {
      setError('Failed to delete some images')
    } finally {
      setDeletingBulk(false)
    }
  }

  const toggleImageSelection = (imageId: number) => {
    setSelectedImages(prev => {
      const next = new Set(prev)
      if (next.has(imageId)) {
        next.delete(imageId)
      } else {
        next.add(imageId)
      }
      return next
    })
  }

  const selectAllImages = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set())
    } else {
      setSelectedImages(new Set(images.map(img => img.id)))
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, imageId: number) => {
    setDraggedImageId(imageId)
    e.dataTransfer.effectAllowed = 'move'
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5'
    }
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedImageId(null)
    setDragOverIndex(null)
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1'
    }
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    setDragOverIndex(null)
    
    if (draggedImageId === null) return
    
    const draggedIndex = images.findIndex(img => img.id === draggedImageId)
    if (draggedIndex === -1 || draggedIndex === targetIndex) return
    
    const newImages = [...images]
    const [draggedImage] = newImages.splice(draggedIndex, 1)
    newImages.splice(targetIndex, 0, draggedImage)
    
    const reorderedImages = newImages.map((img, idx) => ({
      ...img,
      display_order: idx + 1
    }))
    
    setImages(reorderedImages)
    setDraggedImageId(null)
    
    // TODO: Add reorder API endpoint for yachts if needed
    setSuccess('Images reordered!')
  }

  const handleMoveImage = (imageId: number, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex(img => img.id === imageId)
    if (currentIndex === -1) return
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= images.length) return

    const newImages = [...images]
    const temp = newImages[currentIndex]
    newImages[currentIndex] = newImages[newIndex]
    newImages[newIndex] = temp

    const reorderedImages = newImages.map((img, idx) => ({
      ...img,
      display_order: idx + 1
    }))
    
    setImages(reorderedImages)
  }

  const handleSetFeatured = async (imageId: number) => {
    if (!editingYacht) return
    
    const image = images.find(img => img.id === imageId)
    if (!image) return

    try {
      // Update yacht's featured image
      await fetch(`/api/admin/yachts/${editingYacht.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured_image: image.image_url }),
      })

      setFormData(prev => ({ ...prev, featured_image: image.image_url }))
      setImages(prev => prev.map(img => ({
        ...img,
        is_featured: img.id === imageId
      })))
      setSuccess('Featured image updated!')
    } catch (err) {
      setError('Failed to set featured image')
    }
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
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

            {/* Tabs */}
            {editingYacht && (
              <div className="px-6 pt-4">
                <div className="flex items-center gap-1 bg-cream-100 rounded-xl p-1">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                      activeTab === 'details' 
                        ? 'bg-white text-charcoal-900 shadow-sm' 
                        : 'text-charcoal-500 hover:text-charcoal-700'
                    }`}
                  >
                    <Ship className="w-5 h-5" />
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab('images')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                      activeTab === 'images' 
                        ? 'bg-white text-charcoal-900 shadow-sm' 
                        : 'text-charcoal-500 hover:text-charcoal-700'
                    }`}
                  >
                    <ImageIcon className="w-5 h-5" />
                    Images ({images.length})
                  </button>
                </div>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Details Tab */}
              {activeTab === 'details' && (
                <>
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

                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">Manufacturer</label>
                      <input
                        type="text"
                        value={formData.manufacturer}
                        onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                        className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                        placeholder="e.g., RIVA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">Model</label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                        className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                        placeholder="e.g., Argo 90"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">Yacht Type *</label>
                      <select
                        value={formData.yacht_type}
                        onChange={(e) => setFormData(prev => ({ ...prev, yacht_type: e.target.value }))}
                        className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none bg-white"
                      >
                        <option value="Motor Yacht">⚡ Motor Yacht</option>
                        <option value="Sailing Yacht">⛵ Sailing Yacht</option>
                        <option value="Catamaran">🛥️ Catamaran</option>
                        <option value="Gulet">🚢 Gulet</option>
                        <option value="Explorer">🧭 Explorer</option>
                      </select>
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

                  {/* Descriptions - Bilingual */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-charcoal-700 flex items-center gap-2">
                        <Languages className="w-5 h-5 text-gold-500" />
                        Descriptions (EN / DE)
                      </h3>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={translateAllToGerman}
                          disabled={translating !== null}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 disabled:opacity-50 transition-colors"
                        >
                          {translating === 'all_de' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <span>🇬🇧 → 🇩🇪</span>
                          )}
                          Translate All
                        </button>
                        <button
                          type="button"
                          onClick={translateAllToEnglish}
                          disabled={translating !== null}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 disabled:opacity-50 transition-colors"
                        >
                          {translating === 'all_en' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <span>🇩🇪 → 🇬🇧</span>
                          )}
                          Translate All
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      Text auto-translates as you type
                    </div>

                    {/* Short Description */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal-700 mb-2">
                          🇬🇧 Short Description (English)
                        </label>
                        <textarea
                          value={formData.short_description}
                          onChange={(e) => handleTranslatableEnglishChange('short_description', e.target.value)}
                          className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none resize-none"
                          rows={3}
                          placeholder="Brief description for listings..."
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-charcoal-700">
                            🇩🇪 Kurzbeschreibung (Deutsch)
                            {translating === 'short_description_de' && (
                              <span className="ml-2 text-blue-600 text-xs inline-flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Translating...
                              </span>
                            )}
                          </label>
                        </div>
                        <textarea
                          value={formData.short_description_de}
                          onChange={(e) => setFormData(prev => ({ ...prev, short_description_de: e.target.value }))}
                          className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none resize-none"
                          rows={3}
                          placeholder="Auto-translates from English"
                        />
                      </div>
                    </div>

                    {/* Full Description */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal-700 mb-2">
                          🇬🇧 Full Description (English)
                        </label>
                        <textarea
                          value={formData.long_description}
                          onChange={(e) => handleTranslatableEnglishChange('long_description', e.target.value)}
                          className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none resize-none"
                          rows={5}
                          placeholder="Detailed yacht description..."
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-charcoal-700">
                            🇩🇪 Vollständige Beschreibung (Deutsch)
                            {translating === 'long_description_de' && (
                              <span className="ml-2 text-blue-600 text-xs inline-flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Translating...
                              </span>
                            )}
                          </label>
                        </div>
                        <textarea
                          value={formData.long_description_de}
                          onChange={(e) => setFormData(prev => ({ ...prev, long_description_de: e.target.value }))}
                          className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none resize-none"
                          rows={5}
                          placeholder="Auto-translates from English"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-cream-50 p-5 rounded-xl">
                    <h3 className="font-medium text-charcoal-700 mb-4 flex items-center gap-2">
                      💰 Charter Pricing (EUR)
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-charcoal-600 mb-1">Price per Day (€)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400 font-medium">€</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price_per_day}
                            onChange={(e) => setFormData(prev => ({ ...prev, price_per_day: e.target.value }))}
                            className="w-full pl-8 pr-3 py-2 border border-cream-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                            placeholder="e.g., 5000"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-charcoal-600 mb-1">Price per Week (€)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400 font-medium">€</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price_per_week}
                            onChange={(e) => setFormData(prev => ({ ...prev, price_per_week: e.target.value }))}
                            className="w-full pl-8 pr-3 py-2 border border-cream-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                            placeholder="e.g., 30000"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Featured Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Featured Image URL</label>
                    <input
                      type="url"
                      value={formData.featured_image}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                      className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder="https://storage.googleapis.com/..."
                    />
                    {formData.featured_image && (
                      <div className="mt-3">
                        <img src={formData.featured_image} alt="Featured" className="w-48 h-32 object-cover rounded-lg" />
                      </div>
                    )}
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
                </>
              )}

              {/* Images Tab */}
              {activeTab === 'images' && editingYacht && (
                <>
                  {/* Upload Section */}
                  <div className="border-2 border-dashed border-gold-200 rounded-xl p-8 bg-gold-50/30 hover:bg-gold-50/50 transition-colors">
                    <input
                      type="file"
                      id="yacht-image-upload"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <label 
                      htmlFor="yacht-image-upload"
                      className={`flex flex-col items-center justify-center cursor-pointer ${uploading ? 'opacity-50' : ''}`}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
                          <p className="text-charcoal-700 font-medium">{uploadProgress}</p>
                        </>
                      ) : (
                        <>
                          <CloudUpload className="w-12 h-12 text-gold-500 mb-4" />
                          <p className="text-charcoal-700 font-medium mb-1">Click to upload images</p>
                          <p className="text-charcoal-400 text-sm">PNG, JPG, WEBP - uploaded to GCS</p>
                        </>
                      )}
                    </label>
                  </div>

                  {/* Images Grid */}
                  <div className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <h3 className="font-semibold text-charcoal-900">Yacht Images ({images.length})</h3>
                        {images.length > 0 && (
                          <button
                            onClick={selectAllImages}
                            className="text-sm text-gold-600 hover:text-gold-700 font-medium"
                          >
                            {selectedImages.size === images.length ? 'Deselect all' : 'Select all'}
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-charcoal-400">Drag to reorder. Click star to set as featured.</p>
                    </div>

                    {/* Bulk action bar */}
                    {selectedImages.size > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-center justify-between">
                        <span className="text-red-700 font-medium">
                          {selectedImages.size} image{selectedImages.size > 1 ? 's' : ''} selected
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedImages(new Set())}
                            className="px-4 py-2 text-charcoal-600 hover:text-charcoal-900 font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleBulkDelete}
                            disabled={deletingBulk}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                            {deletingBulk ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                Delete Selected
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {images.length === 0 ? (
                      <div className="text-center py-12 text-charcoal-400">
                        <ImageIcon className="w-12 h-12 mx-auto mb-4" />
                        <p>No images yet. Upload your first image above.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <div 
                            key={image.id} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, image.id)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            className={`relative group rounded-xl overflow-hidden cursor-grab active:cursor-grabbing transition-all ${
                              selectedImages.has(image.id) 
                                ? 'ring-4 ring-gold-400 ring-offset-2' 
                                : dragOverIndex === index
                                  ? 'ring-4 ring-blue-400 ring-offset-2 scale-105'
                                  : draggedImageId === image.id
                                    ? 'opacity-50 scale-95'
                                    : 'hover:ring-2 hover:ring-gold-200'
                            }`}
                          >
                            <div className="aspect-square">
                              <img
                                src={image.image_url}
                                alt={image.caption || 'Yacht image'}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Position badge */}
                            <div className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                              index === 0 ? 'bg-gold-500 text-white' : 'bg-white text-charcoal-900'
                            }`}>
                              {index + 1}
                            </div>

                            {/* Checkbox */}
                            <div className="absolute top-2 right-2">
                              <input
                                type="checkbox"
                                checked={selectedImages.has(image.id)}
                                onChange={() => toggleImageSelection(image.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-5 h-5 rounded border-2 border-white text-gold-500 focus:ring-gold-500 cursor-pointer shadow-lg"
                              />
                            </div>

                            {/* Featured badge */}
                            {image.is_featured && (
                              <div className="absolute bottom-2 left-2 bg-gold-500 text-white text-[10px] px-2 py-1 rounded-full font-semibold shadow-lg">
                                FEATURED
                              </div>
                            )}

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleMoveImage(image.id, 'up')}
                                disabled={index === 0}
                                className="p-2 bg-white rounded-lg text-charcoal-700 hover:bg-gold-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Move left"
                              >
                                <ChevronUp className="w-5 h-5 -rotate-90" />
                              </button>
                              <button
                                onClick={() => handleSetFeatured(image.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                  image.is_featured 
                                    ? 'bg-gold-500 text-white' 
                                    : 'bg-white text-charcoal-700 hover:bg-gold-100'
                                }`}
                                title="Set as featured"
                              >
                                <Star className={`w-5 h-5 ${image.is_featured ? 'fill-current' : ''}`} />
                              </button>
                              <button
                                onClick={() => handleDeleteImage(image.id)}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleMoveImage(image.id, 'down')}
                                disabled={index === images.length - 1}
                                className="p-2 bg-white rounded-lg text-charcoal-700 hover:bg-gold-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Move right"
                              >
                                <ChevronDown className="w-5 h-5 -rotate-90" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
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
