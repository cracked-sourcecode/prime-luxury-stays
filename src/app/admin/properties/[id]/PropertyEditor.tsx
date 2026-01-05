'use client'

import { useState, useRef, useEffect } from 'react'
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
  Loader2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Crown,
  Upload,
  CloudUpload,
  Languages,
  Sparkles
} from 'lucide-react'
import type { Property } from '@/lib/properties'
import type { PropertyImage, PropertyAvailability } from '@/lib/admin'
import { useAdminLocale } from '@/lib/adminLocale'

// Compress image before upload
async function compressImage(file: File, maxWidth = 1920, quality = 0.8): Promise<File> {
  return new Promise((resolve) => {
    // Skip compression for non-image files or small files
    if (!file.type.startsWith('image/') || file.size < 500000) {
      resolve(file)
      return
    }

    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      // Calculate new dimensions
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

interface PropertyEditorProps {
  property: Property | null;
  images: PropertyImage[];
  availability: PropertyAvailability[];
  isNew: boolean;
}

export default function PropertyEditor({ property, images: initialImages, availability: initialAvailability, isNew }: PropertyEditorProps) {
  const router = useRouter()
  const { t, locale } = useAdminLocale()
  const [activeTab, setActiveTab] = useState<'details' | 'images' | 'availability'>('details')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [translating, setTranslating] = useState<string | null>(null)

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
    price_per_week: (property as any)?.price_per_week?.toString() || '',
    price_per_week_high: (property as any)?.price_per_week_high?.toString() || '',
    has_pool: property?.has_pool || false,
    has_sea_view: property?.has_sea_view || false,
    has_ac: property?.has_ac || false,
    has_heating: property?.has_heating || false,
    has_wifi: property?.has_wifi || false,
    is_beachfront: property?.is_beachfront || false,
    is_active: property?.is_active ?? true,
    is_featured: property?.is_featured || false,
    min_stay_nights: property?.min_stay_nights?.toString() || '7',
    // Distances
    distance_beach: property?.distance_beach || '',
    distance_restaurants: property?.distance_restaurants || '',
    distance_old_town: property?.distance_old_town || '',
    distance_airport: property?.distance_airport || '',
    // German translations
    name_de: property?.name_de || '',
    short_description_de: property?.short_description_de || '',
    description_de: property?.description_de || '',
    house_type_de: property?.house_type_de || '',
  })

  const translateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  // Auto-translate when English field changes (with debounce)
  const handleTranslatableEnglishChange = (
    field: 'name' | 'short_description' | 'description',
    value: string
  ) => {
    const germanField = `${field}_de` as keyof typeof formData
    const fieldType = field
    
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear previous timeout
    if (translateTimeoutRef.current) {
      clearTimeout(translateTimeoutRef.current)
    }

    // Auto-translate after user stops typing
    if (value.trim()) {
      translateTimeoutRef.current = setTimeout(async () => {
        setTranslating(germanField)
        const translated = await translateText(value, 'de', fieldType)
        if (translated) {
          setFormData(prev => ({ ...prev, [germanField]: translated }))
        }
        setTranslating(null)
      }, 1000)
    }
  }

  // Auto-translate when German field changes (with debounce)
  const handleTranslatableGermanChange = (
    field: 'name_de' | 'short_description_de' | 'description_de',
    value: string
  ) => {
    const englishField = field.replace('_de', '') as 'name' | 'short_description' | 'description'
    const fieldType = englishField
    
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear previous timeout
    if (translateTimeoutRef.current) {
      clearTimeout(translateTimeoutRef.current)
    }

    // Only auto-translate if English field is empty
    if (value.trim() && !formData[englishField]) {
      translateTimeoutRef.current = setTimeout(async () => {
        setTranslating(englishField)
        const translated = await translateText(value, 'en', fieldType)
        if (translated) {
          setFormData(prev => ({ ...prev, [englishField]: translated }))
        }
        setTranslating(null)
      }, 1000)
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

  // Translate all fields at once
  const translateAllToGerman = async () => {
    setTranslating('all_de')
    try {
      const fields = ['name', 'short_description', 'description'] as const
      for (const field of fields) {
        if (formData[field]) {
          const translated = await translateText(formData[field], 'de', field)
          if (translated) {
            setFormData(prev => ({ ...prev, [`${field}_de`]: translated }))
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
      const fields = ['name_de', 'short_description_de', 'description_de'] as const
      for (const field of fields) {
        if (formData[field]) {
          const englishField = field.replace('_de', '') as 'name' | 'short_description' | 'description'
          const translated = await translateText(formData[field], 'en', englishField)
          if (translated) {
            setFormData(prev => ({ ...prev, [englishField]: translated }))
          }
        }
      }
    } finally {
      setTranslating(null)
    }
  }

  // Images state
  const [images, setImages] = useState<PropertyImage[]>(initialImages)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newImageCaption, setNewImageCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set())
  const [deletingBulk, setDeletingBulk] = useState(false)
  const [draggedImageId, setDraggedImageId] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // Video state
  const [videoUrl, setVideoUrl] = useState(property?.video_url || '')
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [videoUploadProgress, setVideoUploadProgress] = useState('')

  // Availability state
  const [availability, setAvailability] = useState<PropertyAvailability[]>(initialAvailability)
  const [isHeroFeatured, setIsHeroFeatured] = useState(property?.is_hero_featured || false)
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

    // Auto-translate name to German
    if (translateTimeoutRef.current) {
      clearTimeout(translateTimeoutRef.current)
    }
    if (name.trim()) {
      translateTimeoutRef.current = setTimeout(async () => {
        setTranslating('name_de')
        const translated = await translateText(name, 'de', 'name')
        if (translated) {
          setFormData(prev => ({ ...prev, name_de: translated }))
        }
        setTranslating(null)
      }, 1000)
    }
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
        price_per_week: formData.price_per_week ? parseFloat(formData.price_per_week) : null,
        price_per_week_high: formData.price_per_week_high ? parseFloat(formData.price_per_week_high) : null,
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !property?.id) return

    setUploading(true)
    setError('')

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setUploadProgress(`Compressing ${i + 1}/${files.length}: ${file.name}`)

      try {
        // Compress image before upload (max 1920px, 80% quality)
        const compressedFile = await compressImage(file, 1920, 0.8)
        const sizeSaved = file.size - compressedFile.size
        if (sizeSaved > 0) {
          console.log(`Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`)
        }

        setUploadProgress(`Uploading ${i + 1}/${files.length}: ${file.name}`)

        // Upload to GCS
        const uploadFormData = new FormData()
        uploadFormData.append('file', compressedFile)
        uploadFormData.append('propertySlug', property.slug || `property-${property.id}`)
        uploadFormData.append('propertyId', property.id.toString())

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        const uploadData = await uploadRes.json()

        if (!uploadData.success) {
          setError(`Failed to upload ${file.name}: ${uploadData.error}`)
          continue
        }

        // Add to property images
        const res = await fetch(`/api/admin/properties/${property.id}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            image_url: uploadData.url,
            caption: null
          }),
        })

        const data = await res.json()
        if (data.success) {
          setImages(prev => [...prev, { 
            id: data.id, 
            property_id: property.id, 
            image_url: uploadData.url,
            caption: null,
            display_order: images.length + i,
            is_featured: false
          }])
        }
      } catch (err) {
        setError(`Failed to upload ${file.name}`)
      }
    }

    setUploading(false)
    setUploadProgress('')
    // Reset file input
    e.target.value = ''
  }

  // Video upload handler
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !property?.id) return

    setUploadingVideo(true)
    setError('')
    setVideoUploadProgress(`Uploading video: ${file.name}`)

    try {
      // Upload to GCS
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('propertySlug', property.slug || `property-${property.id}`)
      uploadFormData.append('propertyId', property.id.toString())
      uploadFormData.append('fileType', 'video')

      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const uploadData = await uploadRes.json()

      if (!uploadData.success) {
        throw new Error(uploadData.error || 'Upload failed')
      }

      // Save video URL to property
      const saveRes = await fetch(`/api/admin/properties/${property.id}/video`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: uploadData.url }),
      })

      if (!saveRes.ok) {
        throw new Error('Failed to save video')
      }

      setVideoUrl(uploadData.url)
      setSuccess('Video uploaded successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload video')
    } finally {
      setUploadingVideo(false)
      setVideoUploadProgress('')
      e.target.value = ''
    }
  }

  // Remove video handler
  const handleRemoveVideo = async () => {
    if (!property?.id) return

    try {
      const res = await fetch(`/api/admin/properties/${property.id}/video`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to remove video')
      }

      setVideoUrl('')
      setSuccess('Video removed successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove video')
    }
  }

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Delete this image?')) return

    try {
      await fetch(`/api/admin/properties/${property?.id}/images/${imageId}`, {
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
    if (selectedImages.size === 0) return
    if (!confirm(`Delete ${selectedImages.size} selected image${selectedImages.size > 1 ? 's' : ''}?`)) return

    setDeletingBulk(true)
    setError('')

    try {
      const deletePromises = Array.from(selectedImages).map(imageId =>
        fetch(`/api/admin/properties/${property?.id}/images/${imageId}`, {
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

  const handleMoveImage = async (imageId: number, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex(img => img.id === imageId)
    if (currentIndex === -1) return
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= images.length) return

    // Swap images in local state
    const newImages = [...images]
    const temp = newImages[currentIndex]
    newImages[currentIndex] = newImages[newIndex]
    newImages[newIndex] = temp

    // Update display_order for all images
    const reorderedImages = newImages.map((img, idx) => ({
      ...img,
      display_order: idx + 1
    }))
    
    setImages(reorderedImages)

    // Save to server
    try {
      await fetch(`/api/admin/properties/${property?.id}/images/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: reorderedImages.map(img => ({ id: img.id, display_order: img.display_order }))
        }),
      })
    } catch (err) {
      setError('Failed to reorder images')
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, imageId: number) => {
    setDraggedImageId(imageId)
    e.dataTransfer.effectAllowed = 'move'
    // Add some visual feedback
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
    
    // Reorder images
    const newImages = [...images]
    const [draggedImage] = newImages.splice(draggedIndex, 1)
    newImages.splice(targetIndex, 0, draggedImage)
    
    // Update display_order
    const reorderedImages = newImages.map((img, idx) => ({
      ...img,
      display_order: idx + 1
    }))
    
    setImages(reorderedImages)
    setDraggedImageId(null)
    
    // Save to server
    try {
      await fetch(`/api/admin/properties/${property?.id}/images/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: reorderedImages.map(img => ({ id: img.id, display_order: img.display_order }))
        }),
      })
      setSuccess('Images reordered successfully!')
    } catch (err) {
      setError('Failed to reorder images')
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

  const handleSetHeroFeatured = async () => {
    if (!property?.id) return
    
    try {
      const res = await fetch(`/api/admin/properties/${property.id}/hero-featured`, {
        method: 'POST',
      })
      const data = await res.json()
      if (data.success) {
        setIsHeroFeatured(true)
        setSuccess('This property is now the Hero Featured property on the homepage!')
      } else {
        setError(data.error || 'Failed to set hero featured')
      }
    } catch (err) {
      setError('Failed to set hero featured')
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
                  {isNew ? t('newProperty') : `${t('editProperty')}: ${property?.name}`}
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
                  <span className="hidden sm:inline">{t('viewLive')}</span>
                </Link>
              )}
              
              {!isNew && (
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="hidden sm:inline">{t('deleteProperty')}</span>
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
            { id: 'details', label: t('details'), icon: Bed },
            { id: 'images', label: t('images'), icon: ImageIcon, disabled: isNew },
            { id: 'availability', label: t('availability'), icon: Calendar, disabled: isNew },
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
                <h3 className="font-semibold text-charcoal-900 mb-4">{t('basicInfo')}</h3>
                <div className="grid md:grid-cols-2 gap-6">
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
                    <p className="text-xs text-charcoal-400 mt-1">Used in the property URL (auto-generated from name)</p>
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
                <h3 className="font-semibold text-charcoal-900 mb-4">{t('licenseInfo')}</h3>
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
                <h3 className="font-semibold text-charcoal-900 mb-4">{t('location')}</h3>
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
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Region / Destination</label>
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                    >
                      <option value="Mallorca">Mallorca, Spain</option>
                      <option value="Ibiza">Ibiza, Spain</option>
                      <option value="South of France">South of France</option>
                    </select>
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
                <h3 className="font-semibold text-charcoal-900 mb-4">{t('propertyDetails')}</h3>
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

              {/* Pricing */}
              <section>
                <h3 className="font-semibold text-charcoal-900 mb-4">{t('pricing')}</h3>
                <p className="text-sm text-charcoal-500 mb-4">Set the weekly price range to display on property cards. Use low/high for seasonal variation.</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Price Per Week (Low) €</label>
                    <input
                      type="number"
                      value={formData.price_per_week}
                      onChange={(e) => setFormData(prev => ({ ...prev, price_per_week: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder="e.g. 4200"
                      min="0"
                      step="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Price Per Week (High) €</label>
                    <input
                      type="number"
                      value={formData.price_per_week_high}
                      onChange={(e) => setFormData(prev => ({ ...prev, price_per_week_high: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder="e.g. 10675"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
              </section>

              {/* Description - Both Languages Side by Side */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-charcoal-900">{t('propertyContent')}</h3>
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
                      {locale === 'de' ? 'Alles übersetzen' : 'Translate All'}
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
                      {locale === 'de' ? 'Alles übersetzen' : 'Translate All'}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  {locale === 'de' 
                    ? 'Texte werden automatisch übersetzt während Sie tippen' 
                    : 'Text auto-translates as you type'}
                </div>
                
                {/* Property Name - Both Languages */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                      🇬🇧 Property Name (English) *
                    </label>
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
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-charcoal-700">
                        🇩🇪 Immobilienname (Deutsch)
                        {translating === 'name_de' && (
                          <span className="ml-2 text-blue-600 text-xs inline-flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            {locale === 'de' ? 'Übersetze...' : 'Translating...'}
                          </span>
                        )}
                      </label>
                    </div>
                    <input
                      type="text"
                      value={formData.name_de}
                      onChange={(e) => handleTranslatableGermanChange('name_de', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder={locale === 'de' ? 'Wird automatisch übersetzt' : 'Auto-translates from English'}
                    />
                  </div>
                </div>

                {/* House Type - Both Languages */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                      🇬🇧 House Type (English)
                    </label>
                    <select
                      value={formData.house_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, house_type: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                    >
                      <option value="Villa">Villa</option>
                      <option value="Finca">Finca</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="House">House</option>
                      <option value="Penthouse">Penthouse</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                      🇩🇪 Haustyp (Deutsch)
                    </label>
                    <select
                      value={formData.house_type_de}
                      onChange={(e) => setFormData(prev => ({ ...prev, house_type_de: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                    >
                      <option value="">— Englisch verwenden —</option>
                      <option value="Villa">Villa</option>
                      <option value="Finca">Finca</option>
                      <option value="Wohnung">Wohnung</option>
                      <option value="Stadthaus">Stadthaus</option>
                      <option value="Haus">Haus</option>
                      <option value="Penthouse">Penthouse</option>
                    </select>
                  </div>
                </div>

                {/* Short Description - Both Languages */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                      🇬🇧 Short Description (English)
                    </label>
                    <input
                      type="text"
                      value={formData.short_description}
                      onChange={(e) => handleTranslatableEnglishChange('short_description', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder="A brief tagline for the property"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-charcoal-700">
                        🇩🇪 Kurzbeschreibung (Deutsch)
                        {translating === 'short_description_de' && (
                          <span className="ml-2 text-blue-600 text-xs inline-flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            {locale === 'de' ? 'Übersetze...' : 'Translating...'}
                          </span>
                        )}
                      </label>
                    </div>
                    <input
                      type="text"
                      value={formData.short_description_de}
                      onChange={(e) => handleTranslatableGermanChange('short_description_de', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder={locale === 'de' ? 'Wird automatisch übersetzt' : 'Auto-translates from English'}
                    />
                  </div>
                </div>

                {/* Full Description - Both Languages */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                      🇬🇧 Full Description (English)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleTranslatableEnglishChange('description', e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none resize-none"
                      placeholder="Detailed description of the property..."
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-charcoal-700">
                        🇩🇪 Vollständige Beschreibung (Deutsch)
                        {translating === 'description_de' && (
                          <span className="ml-2 text-blue-600 text-xs inline-flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            {locale === 'de' ? 'Übersetze...' : 'Translating...'}
                          </span>
                        )}
                      </label>
                    </div>
                    <textarea
                      value={formData.description_de}
                      onChange={(e) => handleTranslatableGermanChange('description_de', e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none resize-none"
                      placeholder={locale === 'de' ? 'Wird automatisch übersetzt' : 'Auto-translates from English'}
                    />
                  </div>
                </div>
              </section>

              {/* Amenities */}
              <section>
                <h3 className="font-semibold text-charcoal-900 mb-4">{t('amenities')}</h3>
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

              {/* Distances */}
              <section>
                <h3 className="font-semibold text-charcoal-900 mb-4">{t('nearbyDistances')}</h3>
                <p className="text-sm text-charcoal-500 mb-4">Distance/time to key locations (e.g. "5 min", "10 min", "2 km")</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">🏖️ Beach</label>
                    <input
                      type="text"
                      value={formData.distance_beach}
                      onChange={(e) => setFormData(prev => ({ ...prev, distance_beach: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder="e.g. 5 min"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">🍽️ Restaurants</label>
                    <input
                      type="text"
                      value={formData.distance_restaurants}
                      onChange={(e) => setFormData(prev => ({ ...prev, distance_restaurants: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder="e.g. 10 min"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">🏛️ Old Town</label>
                    <input
                      type="text"
                      value={formData.distance_old_town}
                      onChange={(e) => setFormData(prev => ({ ...prev, distance_old_town: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder="e.g. 15 min"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">✈️ Airport</label>
                    <input
                      type="text"
                      value={formData.distance_airport}
                      onChange={(e) => setFormData(prev => ({ ...prev, distance_airport: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      placeholder="e.g. 25 min"
                    />
                  </div>
                </div>
              </section>

              {/* Status */}
              <section>
                <h3 className="font-semibold text-charcoal-900 mb-4">Status</h3>
                <div className="flex flex-wrap gap-6 mb-6">
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
                
                {/* Hero Featured - Only one property can have this */}
                {!isNew && (
                  <div className="p-4 rounded-xl border-2 border-dashed border-gold-200 bg-gold-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isHeroFeatured ? 'bg-gold-500' : 'bg-gray-200'}`}>
                          <Crown className={`w-5 h-5 ${isHeroFeatured ? 'text-white' : 'text-gray-500'}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-charcoal-900">Homepage Hero Featured</p>
                          <p className="text-sm text-charcoal-500">
                            {isHeroFeatured 
                              ? 'This property is shown in the main hero section on the homepage'
                              : 'Set this property as the main featured property on the homepage'}
                          </p>
                        </div>
                      </div>
                      {isHeroFeatured ? (
                        <span className="px-4 py-2 bg-gold-500 text-white rounded-lg font-semibold flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          Hero Featured
                        </span>
                      ) : (
                        <button
                          onClick={handleSetHeroFeatured}
                          className="px-4 py-2 bg-charcoal-900 text-white rounded-lg font-semibold hover:bg-charcoal-800 transition-colors flex items-center gap-2"
                        >
                          <Crown className="w-4 h-4" />
                          Set as Hero Featured
                        </button>
                      )}
                    </div>
                  </div>
                )}
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
                      {t('saving')}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {t('saveProperty')}
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
            {/* Direct Upload Section */}
            <div className="mb-8">
              <h3 className="font-semibold text-charcoal-900 mb-4 flex items-center gap-2">
                <CloudUpload className="w-5 h-5 text-gold-500" />
                Upload Images
              </h3>
              <div className="border-2 border-dashed border-gold-200 rounded-xl p-8 bg-gold-50/30 hover:bg-gold-50/50 transition-colors">
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <label 
                  htmlFor="image-upload"
                  className={`flex flex-col items-center justify-center cursor-pointer ${uploading ? 'opacity-50' : ''}`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
                      <p className="text-charcoal-700 font-medium">{uploadProgress}</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gold-500 mb-4" />
                      <p className="text-charcoal-700 font-medium mb-1">Click to upload images</p>
                      <p className="text-charcoal-400 text-sm">or drag and drop (PNG, JPG, WEBP)</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Manual URL Section (collapsed) */}
            <details className="mb-8">
              <summary className="cursor-pointer text-charcoal-500 text-sm hover:text-charcoal-700 mb-4">
                Or paste image URL manually...
              </summary>
              <div className="flex flex-col md:flex-row gap-4 mt-4">
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
            </details>

            <div className="border-t border-gray-100 pt-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-charcoal-900">Property Images ({images.length})</h3>
                  {images.length > 0 && (
                    <button
                      onClick={selectAllImages}
                      className="text-sm text-gold-600 hover:text-gold-700 font-medium"
                    >
                      {selectedImages.size === images.length ? 'Deselect all' : 'Select all'}
                    </button>
                  )}
                </div>
                <p className="text-sm text-charcoal-400">Drag images to reorder, or use arrows. First image shows on property cards.</p>
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
                  <p>No images yet. Add your first image above.</p>
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
                      {/* Image */}
                      <div className="aspect-square">
                        <img
                          src={image.image_url}
                          alt={image.caption || 'Property image'}
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
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-gold-500 text-white text-[10px] px-2 py-1 rounded-full font-semibold shadow-lg">
                          COVER
                        </div>
                      )}

                      {/* Hover overlay with actions */}
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

            {/* Video Section */}
            <div className="border-t border-gray-100 pt-8 mt-8">
              <h3 className="font-semibold text-charcoal-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Property Video
              </h3>
              <p className="text-sm text-charcoal-400 mb-4">
                Upload a showcase video for this property. Video will appear on the property page if added.
              </p>

              {videoUrl ? (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <video 
                        src={videoUrl} 
                        controls 
                        className="w-full max-w-lg rounded-lg"
                      >
                        Your browser does not support the video tag.
                      </video>
                      <p className="text-sm text-charcoal-500 mt-2 break-all">{videoUrl}</p>
                    </div>
                    <button
                      onClick={handleRemoveVideo}
                      className="p-2 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove video"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gold-300 rounded-xl p-8 text-center bg-gold-50/30 hover:bg-gold-50/50 transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    id="video-upload"
                    onChange={handleVideoUpload}
                    disabled={uploadingVideo}
                    className="hidden"
                  />
                  <label 
                    htmlFor="video-upload"
                    className={`flex flex-col items-center justify-center cursor-pointer ${uploadingVideo ? 'opacity-50' : ''}`}
                  >
                    {uploadingVideo ? (
                      <>
                        <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
                        <p className="text-charcoal-700 font-medium">{videoUploadProgress}</p>
                      </>
                    ) : (
                      <>
                        <svg className="w-12 h-12 text-gold-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="text-charcoal-700 font-medium mb-1">Click to upload video</p>
                        <p className="text-charcoal-400 text-sm">MP4, MOV, WebM (max 100MB recommended)</p>
                      </>
                    )}
                  </label>
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

      {/* Sticky Save Bar - Shows on all tabs */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {error && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-5 h-5" />
                <span className="text-sm">{success}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleSaveDetails}
            disabled={saving}
            className="bg-gold-500 text-charcoal-900 px-8 py-3 rounded-xl font-semibold hover:bg-gold-400 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-lg"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('saving')}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {t('saveProperty')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Spacer for sticky bar */}
      <div className="h-20" />
    </div>
  )
}

