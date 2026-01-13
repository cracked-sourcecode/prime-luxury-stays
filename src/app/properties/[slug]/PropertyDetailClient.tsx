'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Users, 
  Star,
  Waves,
  Wind,
  Flame,
  Wifi,
  Car,
  TreePine,
  Share2,
  Globe,
  Calendar,
  Shield,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  Phone,
  Mail,
  Mountain,
  Utensils,
  Wine,
  Anchor,
  Sun,
  Coffee,
  Home,
  Maximize,
  Grid3X3,
  ImageOff
} from 'lucide-react'
import type { Property } from '@/lib/properties'
import BookingCalendar from '@/components/BookingCalendar'
import ShareModal from '@/components/ShareModal'
import { useLocale } from '@/i18n/LocaleProvider'

// Simple image component with loading state and error handling
function OptimizedImage({ 
  src, 
  alt, 
  className = "", 
  fill = false 
}: { 
  src: string; 
  alt: string; 
  className?: string; 
  priority?: boolean;
  fill?: boolean;
}) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Handle missing src
  if (!src || hasError) {
    return (
      <div className={`bg-cream-100 flex items-center justify-center ${fill ? 'absolute inset-0' : ''} ${className}`}>
        <ImageOff className="w-12 h-12 text-charcoal-300" />
      </div>
    )
  }
  
  // Decode URL if it's double-encoded (contains %25 which is encoded %)
  let decodedSrc = src
  try {
    if (src.includes('%25')) {
      decodedSrc = decodeURIComponent(src)
    }
  } catch (e) {
    // If decoding fails, use original
  }
  
  return (
    <>
      {isLoading && fill && (
        <div className="absolute inset-0 bg-cream-100 animate-pulse" />
      )}
      <img
        src={decodedSrc}
        alt={alt}
        className={`${fill ? 'absolute inset-0 w-full h-full object-cover' : ''} ${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => { setHasError(true); setIsLoading(false) }}
      />
    </>
  )
}

// Dynamically import the map to avoid SSR issues
const PropertyMap = dynamic(() => import('@/components/PropertyMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-cream-100 animate-pulse rounded-2xl flex items-center justify-center">
      <MapPin className="w-8 h-8 text-gold-400" />
    </div>
  )
})

interface GalleryImage {
  id: number;
  url: string;
  caption: string | null;
  is_featured: boolean;
}

interface PropertyDetailClientProps {
  property: Property;
  galleryImages: GalleryImage[];
}

// Helper to get localized property field
function getLocalizedField(property: Property, field: 'name' | 'short_description' | 'description' | 'house_type', locale: string): string {
  if (locale === 'de') {
    const deField = property[`${field}_de` as keyof Property] as string | null
    if (deField) return deField
  }
  return (property[field] as string) || ''
}

export default function PropertyDetailClient({ property, galleryImages: dbImages }: PropertyDetailClientProps) {
  const { t, locale, setLocale } = useLocale()
  const [showShareModal, setShowShareModal] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDates, setSelectedDates] = useState<{ checkIn: string; checkOut: string; price: number | null } | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  
  // Use database images if available, otherwise use featured image
  // Filter out any null/undefined/empty URLs
  const galleryImages = dbImages.length > 0 
    ? dbImages.map(img => img.url).filter((url): url is string => !!url && url.length > 0)
    : [property.featured_image || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80']

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const amenities = [
    { icon: Waves, label: locale === 'de' ? 'Meerblick' : 'Sea View', available: property.has_sea_view, description: locale === 'de' ? 'Atemberaubender Mittelmeerblick' : 'Stunning Mediterranean views' },
    { icon: TreePine, label: locale === 'de' ? 'Privatpool' : 'Private Pool', available: property.has_pool, description: locale === 'de' ? 'Ihre eigene Oase' : 'Your own oasis' },
    { icon: Wind, label: locale === 'de' ? 'Klimaanlage' : 'Air Conditioning', available: property.has_ac, description: locale === 'de' ? 'Klimatisiert in allen Räumen' : 'Climate controlled throughout' },
    { icon: Flame, label: locale === 'de' ? 'Heizung' : 'Heating', available: property.has_heating, description: locale === 'de' ? 'Gemütliche Winterwärme' : 'Cozy winter warmth' },
    { icon: Wifi, label: locale === 'de' ? 'Highspeed-WLAN' : 'High-Speed WiFi', available: property.has_wifi, description: locale === 'de' ? 'Arbeiten Sie remote im Paradies' : 'Work remotely in paradise' },
    { icon: Car, label: locale === 'de' ? 'Privater Parkplatz' : 'Private Parking', available: property.has_parking, description: locale === 'de' ? 'Sicherer Parkplatz inklusive' : 'Secure parking included' },
    { icon: Coffee, label: locale === 'de' ? 'Voll ausgestattete Küche' : 'Fully Equipped Kitchen', available: property.has_kitchen, description: locale === 'de' ? 'Alles was Sie brauchen' : 'Everything you need' },
    { icon: Home, label: locale === 'de' ? 'Smart Home' : 'Smart Home', available: property.has_smart_home, description: locale === 'de' ? 'Moderner Komfort' : 'Modern conveniences' },
  ].filter(a => a.available)

  const highlights = [
    { icon: Shield, title: locale === 'de' ? 'Geprüfte Exzellenz' : 'Verified Excellence', desc: locale === 'de' ? 'Persönlich von unserem Team inspiziert' : 'Personally inspected by our team' },
    { icon: Clock, title: locale === 'de' ? 'Persönlicher Concierge' : 'Dedicated Concierge', desc: locale === 'de' ? 'Persönliche Betreuung während Ihres Aufenthalts' : 'Personal support throughout your stay' },
    { icon: Star, title: locale === 'de' ? 'Bestpreis-Garantie' : 'Best Price Direct', desc: locale === 'de' ? 'Keine Buchungsgebühren' : 'No booking fees, ever' },
  ]

  const experiences = [
    { icon: Car, title: locale === 'de' ? 'Luxus-Transport' : 'Luxury Transport', desc: locale === 'de' ? 'Premium-Fahrzeugservice' : 'Premium vehicle service', href: '/services/luxury-transport' },
    { icon: Anchor, title: locale === 'de' ? 'Yachtcharter' : 'Yacht Charter', desc: locale === 'de' ? 'Entdecken Sie das Mittelmeer' : 'Explore the Mediterranean', href: '/services/yacht-charter' },
    { icon: Wine, title: locale === 'de' ? 'Tischreservierungen' : 'Table Reservations', desc: locale === 'de' ? 'Exklusiver Zugang zu Restaurants' : 'Exclusive dining access', href: '/services/table-reservations' },
    { icon: Utensils, title: locale === 'de' ? 'Privatkoch' : 'Private Chef', desc: locale === 'de' ? 'Sterne-Küche zu Hause' : 'Michelin-quality dining', href: '/services/private-chef' },
  ]

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)

  return (
    <div className="bg-cream-50 min-h-screen">
      {/* ========== IMMERSIVE HERO ========== */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        {/* Main Hero Image */}
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <OptimizedImage
            src={galleryImages[0]}
            alt={getLocalizedField(property, 'name', locale)}
            className="w-full h-full object-cover"
            fill
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/30 to-transparent" />
        </motion.div>
        
        {/* Navigation Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white py-4 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            {/* Logo & Back */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3">
                <img
                  src="https://storage.googleapis.com/primeluxurystays/Logo%20no%20text%20(global%20header).png"
                  alt="Prime Luxury Stays"
                  className="w-14 h-14 lg:w-16 lg:h-16 object-contain"
                />
                <div className="hidden sm:block">
                  <h1 className="font-merriweather text-charcoal-900 text-lg tracking-wide">
                    Prime Luxury Stays
                  </h1>
                  <p className="font-merriweather text-[10px] tracking-[0.2em] text-gold-500 uppercase">
                    Property Management
                  </p>
                </div>
              </Link>
              
              <div className="hidden md:block h-8 w-px bg-gray-200" />
              
              <Link 
                href="/properties"
                className="hidden md:flex items-center gap-2 text-charcoal-600 hover:text-gold-600 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Properties</span>
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Language Switcher - Same as Navigation */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-1.5 text-charcoal-700 hover:text-gold-600 transition-colors py-2 px-2"
                >
                  <Globe className="w-[18px] h-[18px]" />
                  <span className="text-sm font-medium uppercase">{locale}</span>
                </button>
                
                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden min-w-[120px] z-50"
                    >
                      <button
                        onClick={() => { setLocale('en'); setShowLangMenu(false) }}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-cream-50 transition-colors ${locale === 'en' ? 'text-gold-600 font-medium' : 'text-charcoal-700'}`}
                      >
                        <span className="text-lg">🇬🇧</span>
                        English
                      </button>
                      <button
                        onClick={() => { setLocale('de'); setShowLangMenu(false) }}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-cream-50 transition-colors ${locale === 'de' ? 'text-gold-600 font-medium' : 'text-charcoal-700'}`}
                      >
                        <span className="text-lg">🇩🇪</span>
                        Deutsch
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Share Button */}
              <button 
                onClick={() => setShowShareModal(true)}
                className="p-2.5 rounded-full hover:bg-gray-100 transition-all"
                title={locale === 'de' ? 'Teilen' : 'Share'}
              >
                <Share2 className="w-5 h-5 text-charcoal-600" />
              </button>
              
              <Link 
                href={`/inquire?property=${property.slug}`}
                className="hidden sm:block bg-gold-500 text-charcoal-900 px-5 py-2.5 rounded-lg font-semibold hover:bg-gold-400 transition-colors text-sm"
              >
                {locale === 'de' ? 'Anfragen' : 'Inquire Now'}
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {property.is_monthly_rental && (
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {locale === 'de' ? 'Monatliche Vermietung' : 'Monthly Rental'}
                  </div>
                )}
                {property.is_featured && (
                  <div className="bg-gold-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Star className="w-4 h-4 fill-white" />
                    Featured
                  </div>
                )}
                <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                  {getLocalizedField(property, 'house_type', locale)}
                </div>
                {property.license_number && (
                  <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    {locale === 'de' ? 'Lizenziert' : 'Licensed'}: {property.license_number}
                  </div>
                )}
              </div>

              {/* Title & Location */}
              <div className="flex items-center gap-2 text-gold-400 mb-3">
                <MapPin className="w-5 h-5" />
                <span className="text-lg font-medium">{property.city}, Mallorca</span>
              </div>
              
              <h1 className="font-merriweather text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                {getLocalizedField(property, 'name', locale)}
              </h1>

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center gap-6 md:gap-10 text-white/90 mb-8">
                {property.bedrooms && (
                  <div className="flex items-center gap-3">
                    <Bed className="w-6 h-6" />
                    <span className="text-lg">{property.bedrooms} {t('pages.propertyDetail.bedrooms')}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-3">
                    <Bath className="w-6 h-6" />
                    <span className="text-lg">{property.bathrooms} {t('pages.propertyDetail.bathrooms')}</span>
                  </div>
                )}
                {property.max_guests && (
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6" />
                    <span className="text-lg">{property.max_guests} {t('pages.propertyDetail.guests')}</span>
                  </div>
                )}
              </div>

              {/* View Gallery Button */}
              <button
                onClick={() => setShowGallery(true)}
                className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-xl font-medium hover:bg-white/30 transition-all flex items-center gap-3 border border-white/30"
              >
                <Grid3X3 className="w-5 h-5" />
                {t('pages.propertyDetail.viewAllPhotos')}
                <span className="bg-white/20 px-2 py-1 rounded-md text-sm">{galleryImages.length}</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== MONTHLY RENTAL BANNER ========== */}
      {property.is_monthly_rental && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {locale === 'de' ? 'Monatliche Vermietung' : 'Monthly Rental Only'}
                  </h3>
                  <p className="text-blue-100 text-sm">
                    {locale === 'de' 
                      ? 'Diese Immobilie ist ausschließlich für Langzeitmieten ab 1 Monat verfügbar.'
                      : 'This property is available exclusively for long-term rentals of 1 month or more.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right text-sm">
                  <p className="text-blue-100">
                    {locale === 'de' ? 'Kontaktieren Sie uns für' : 'Contact us for'}
                  </p>
                  <p className="font-semibold">
                    {locale === 'de' ? 'Monatliche Preise' : 'Monthly Rates'}
                  </p>
                </div>
                <Link 
                  href={`/inquire?property=${property.slug}&type=monthly`}
                  className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  {locale === 'de' ? 'Anfrage senden' : 'Inquire Now'}
                  <Calendar className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== MAIN CONTENT ========== */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* ===== OPENING STATEMENT ===== */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-gold-500" />
                <span className="text-gold-600 font-semibold tracking-wide uppercase text-sm">
                  {locale === 'de' ? 'Ihr Privates Refugium' : 'Your Private Escape'}
                </span>
              </div>
              
              <h2 className="font-merriweather text-3xl md:text-4xl text-charcoal-900 mb-6 leading-tight">
                {locale === 'de' ? 'Mediterranes Wohnen in Perfektion' : 'Experience Mediterranean Living at Its Finest'}
              </h2>
              
              <p className="text-charcoal-600 text-lg leading-relaxed mb-8">
                {getLocalizedField(property, 'description', locale) || `Welcome to ${getLocalizedField(property, 'name', locale)}, where every detail has been carefully curated to create an unforgettable Mallorcan experience. This stunning ${getLocalizedField(property, 'house_type', locale)?.toLowerCase()} offers the perfect blend of luxury, comfort, and authentic island charm.`}
              </p>

              {/* Highlights Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {highlights.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-100 to-gold-50 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-gold-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal-900 mb-1">{item.title}</h4>
                      <p className="text-charcoal-500 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ===== PHOTO GRID ===== */}
            {galleryImages.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-merriweather text-2xl md:text-3xl text-charcoal-900 mb-4 md:mb-6">
                  {t('pages.propertyDetail.photoGallery')}
                </h2>
                {/* Photo Grid - show first 3 images: 1 large left, 2 stacked right */}
                <div className="grid grid-cols-3 gap-3 h-[500px]">
                  {/* Large main image - spans 2 cols */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    onClick={() => {
                      setCurrentImageIndex(0)
                      setShowGallery(true)
                    }}
                    className="relative col-span-2 rounded-2xl overflow-hidden cursor-pointer group bg-cream-100"
                  >
                    <OptimizedImage 
                      src={galleryImages[0]} 
                      alt={`${getLocalizedField(property, 'name', locale)} - Photo 1`}
                      className="transition-transform duration-700 group-hover:scale-110"
                      fill
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <Maximize className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.div>
                  
                  {/* Right column - stacked images */}
                  <div className="col-span-1 flex flex-col gap-3">
                    {/* Second image */}
                    {galleryImages.length > 1 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        onClick={() => {
                          setCurrentImageIndex(1)
                          setShowGallery(true)
                        }}
                        className="relative flex-1 rounded-2xl overflow-hidden cursor-pointer group bg-cream-100"
                      >
                        <OptimizedImage 
                          src={galleryImages[1]} 
                          alt={`${getLocalizedField(property, 'name', locale)} - Photo 2`}
                          className="transition-transform duration-700 group-hover:scale-110"
                          fill
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Maximize className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Third image with +X overlay */}
                    {galleryImages.length > 2 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        onClick={() => {
                          setCurrentImageIndex(2)
                          setShowGallery(true)
                        }}
                        className="relative flex-1 rounded-2xl overflow-hidden cursor-pointer group bg-cream-100"
                      >
                        <OptimizedImage 
                          src={galleryImages[2]} 
                          alt={`${getLocalizedField(property, 'name', locale)} - Photo 3`}
                          className="transition-transform duration-700 group-hover:scale-110"
                          fill
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Maximize className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {galleryImages.length > 3 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                            <div className="text-center text-white">
                              <Grid3X3 className="w-8 h-8 mx-auto mb-2" />
                              <span className="text-lg font-semibold">+{galleryImages.length - 3}</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.section>
            )}

            {/* ===== VIDEO TOUR ===== */}
            {property.video_url && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden"
              >
                <div className="aspect-video w-full">
                  <video 
                    controls 
                    className="w-full h-full object-cover"
                    poster={property.featured_image || undefined}
                  >
                    <source src={property.video_url} type="video/mp4" />
                    <source src={property.video_url} type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-charcoal-900 font-medium">Virtual Tour</p>
                    <p className="text-charcoal-500 text-sm">Experience {getLocalizedField(property, 'name', locale)} from anywhere</p>
                  </div>
                  <div className="flex items-center gap-2 text-gold-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <span className="text-sm font-medium">Play Video</span>
                  </div>
                </div>
              </motion.section>
            )}

            {/* ===== AMENITIES ===== */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-xl"
            >
              <h2 className="font-merriweather text-3xl text-charcoal-900 mb-8">
                {t('pages.propertyDetail.amenities')}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {amenities.map((amenity, i) => (
                  <motion.div 
                    key={amenity.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-5 p-5 bg-cream-50 rounded-2xl hover:bg-gold-50 transition-colors group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center group-hover:bg-gold-100 transition-colors">
                      <amenity.icon className="w-7 h-7 text-gold-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal-900 text-lg">{amenity.label}</h4>
                      <p className="text-charcoal-500 text-sm">{amenity.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ===== EXPERIENCES ===== */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-charcoal-900 rounded-3xl p-8 md:p-12 relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500 rounded-full blur-[150px]" />
              </div>
              
              <div className="relative">
                <span className="text-gold-400 font-semibold tracking-wide uppercase text-sm mb-4 block">
                  {locale === 'de' ? 'Concierge-Services' : 'Concierge Services'}
                </span>
                <h2 className="font-merriweather text-3xl text-white mb-4">
                  {locale === 'de' ? 'Exklusive Erlebnisse' : 'Curated Experiences'}
                </h2>
                <p className="text-white/60 text-lg mb-10 max-w-2xl">
                  {locale === 'de' 
                    ? 'Unser Concierge-Team kann exklusive Erlebnisse arrangieren, um Ihren Aufenthalt unvergesslich zu machen.'
                    : 'Our concierge team can arrange exclusive experiences to make your stay truly unforgettable.'}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {experiences.map((exp, i) => (
                    <motion.div
                      key={exp.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link 
                        href={exp.href}
                        className="text-center block group/exp cursor-pointer"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4 group-hover/exp:bg-gold-500/30 transition-colors">
                          <exp.icon className="w-8 h-8 text-gold-400 group-hover/exp:text-gold-300 transition-colors" />
                        </div>
                        <h4 className="font-semibold text-white mb-1 group-hover/exp:text-gold-300 transition-colors">{exp.title}</h4>
                        <p className="text-white/50 text-sm">{exp.desc}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* ===== LOCATION ===== */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-xl"
            >
              <h2 className="font-merriweather text-3xl text-charcoal-900 mb-4">
                {t('pages.propertyDetail.location')}
              </h2>
              <div className="flex items-center gap-2 text-charcoal-500 mb-8">
                <MapPin className="w-5 h-5 text-gold-500" />
                <span>{property.city}{property.region ? `, ${property.region}` : ', Mallorca'}</span>
              </div>
              
              {property.latitude && property.longitude ? (
                <div className="h-[400px] rounded-2xl overflow-hidden shadow-lg">
                  <PropertyMap 
                    properties={[property]}
                    selectedProperty={property}
                    onPropertySelect={() => {}}
                  />
                </div>
              ) : (
                <div className="h-[400px] rounded-2xl bg-cream-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-gold-400 mx-auto mb-4" />
                    <p className="text-charcoal-600 font-merriweather text-xl">{property.city}, Mallorca</p>
                    <p className="text-charcoal-400 mt-2">Exact location provided upon booking</p>
                  </div>
                </div>
              )}

              {/* Nearby */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Waves, label: locale === 'de' ? 'Strand' : 'Beach', time: property.distance_beach || '5 min' },
                  { icon: Utensils, label: locale === 'de' ? 'Restaurants' : 'Restaurants', time: property.distance_restaurants || '10 min' },
                  { icon: Wine, label: locale === 'de' ? 'Hauptstadt Palma' : 'Palma Capital', time: property.distance_old_town || '15 min' },
                  { icon: Sun, label: locale === 'de' ? 'Flughafen' : 'Airport', time: property.distance_airport || '25 min' },
                ].map((item) => (
                  <div key={item.label} className="bg-cream-50 rounded-xl p-4 text-center">
                    <item.icon className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                    <p className="font-medium text-charcoal-900">{item.label}</p>
                    <p className="text-charcoal-400 text-sm">{item.time} {locale === 'de' ? 'mit Auto' : 'by car'}</p>
                  </div>
                ))}
              </div>
            </motion.section>

          </div>

          {/* ===== STICKY SIDEBAR (Hidden on mobile) ===== */}
          <div className="hidden lg:block lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="sticky top-28 space-y-6"
            >
              {/* Main Booking Card */}
              <div className={`rounded-3xl p-8 shadow-2xl border ${property.is_monthly_rental ? 'bg-gradient-to-b from-blue-50 to-white border-blue-200' : 'bg-white border-gray-100'}`}>
                
                {/* Monthly Rental Header */}
                {property.is_monthly_rental ? (
                  <div className="text-center mb-6 pb-6 border-b border-blue-200">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                      <Calendar className="w-4 h-4" />
                      {locale === 'de' ? 'Nur Monatsvermietung' : 'Monthly Rental Only'}
                    </div>
                    <h3 className="font-merriweather text-2xl text-charcoal-900 mb-2">
                      {locale === 'de' ? 'Langzeitvermietung' : 'Long-Term Rental'}
                    </h3>
                    <p className="text-charcoal-500 text-sm">
                      {locale === 'de' 
                        ? 'Mindestaufenthalt: 1 Monat'
                        : 'Minimum stay: 1 month'}
                    </p>
                  </div>
                ) : (
                  /* Price Display for short-term */
                  property.price_per_week && (
                    <div className="text-center mb-6 pb-6 border-b border-gray-100">
                      <p className="text-charcoal-500 text-sm mb-1">{locale === 'de' ? 'Ab' : 'From'}</p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="font-merriweather text-3xl text-charcoal-900">
                          €{Number(property.price_per_week).toLocaleString()}
                        </span>
                        <span className="text-charcoal-500">{locale === 'de' ? '/Woche' : '/week'}</span>
                      </div>
                      {property.price_per_week_high && (
                        <p className="text-charcoal-400 text-sm mt-1">
                          {locale === 'de' 
                            ? `Bis zu €${Number(property.price_per_week_high).toLocaleString()}/Woche in der Hochsaison`
                            : `Up to €${Number(property.price_per_week_high).toLocaleString()}/week in peak season`}
                        </p>
                      )}
                    </div>
                  )
                )}

                {/* Selected Dates Display - only for short-term */}
                {!property.is_monthly_rental && selectedDates && (
                  <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-charcoal-600 text-sm">{locale === 'de' ? 'Anreise' : 'Check-in'}</span>
                      <span className="font-semibold text-charcoal-900">
                        {new Date(selectedDates.checkIn).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-charcoal-600 text-sm">{locale === 'de' ? 'Abreise' : 'Check-out'}</span>
                      <span className="font-semibold text-charcoal-900">
                        {new Date(selectedDates.checkOut).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    {selectedDates.price && (
                      <div className="flex items-center justify-between pt-2 border-t border-gold-200">
                        <span className="font-semibold text-gold-700">{locale === 'de' ? 'Geschätzter Gesamtpreis' : 'Estimated Total'}</span>
                        <span className="font-bold text-gold-700 text-lg">€{selectedDates.price.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Calendar Button - only for short-term */}
                {!property.is_monthly_rental && (
                  <button
                    onClick={() => setShowCalendar(true)}
                    className="w-full bg-cream-100 border-2 border-cream-200 rounded-xl p-4 mb-4 hover:border-gold-300 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gold-600" />
                      <div>
                        <p className="font-medium text-charcoal-900">
                          {selectedDates 
                            ? (locale === 'de' ? 'Datum ändern' : 'Change Dates') 
                            : (locale === 'de' ? 'Datum wählen' : 'Select Dates')}
                        </p>
                        <p className="text-charcoal-500 text-sm">
                          {locale === 'de' ? 'Verfügbarkeitskalender prüfen' : 'Check availability calendar'}
                        </p>
                      </div>
                    </div>
                  </button>
                )}

                {/* Monthly Rental Info */}
                {property.is_monthly_rental && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800 mb-1">
                          {locale === 'de' ? 'Spanisches Mietrecht' : 'Spanish Rental Law'}
                        </p>
                        <p className="text-blue-600 text-sm">
                          {locale === 'de' 
                            ? 'Diese Immobilie unterliegt den spanischen Langzeitmietvorschriften und ist nur für Aufenthalte von 1 Monat oder länger verfügbar.'
                            : 'This property is subject to Spanish long-term rental regulations and is only available for stays of 1 month or longer.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Min Stay - only for short-term */}
                {!property.is_monthly_rental && property.min_stay_nights && property.min_stay_nights > 7 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-amber-800">{locale === 'de' ? 'Mindestaufenthalt' : 'Minimum Stay'}</p>
                      <p className="text-amber-600 text-sm">{property.min_stay_nights} {locale === 'de' ? 'Nächte' : 'nights'}</p>
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {(property.is_monthly_rental ? [
                    locale === 'de' ? 'Verifizierte Luxusimmobilie' : 'Verified Luxury Property',
                    locale === 'de' ? 'Langzeitvertrag verfügbar' : 'Long-Term Contract Available',
                    locale === 'de' ? 'Monatliche Zahlungsoptionen' : 'Monthly Payment Options',
                    locale === 'de' ? 'Persönlicher Ansprechpartner' : 'Dedicated Account Manager',
                  ] : [
                    locale === 'de' ? 'Verifizierte Luxusimmobilie' : 'Verified Luxury Property',
                    locale === 'de' ? 'Persönlicher Concierge-Service' : 'Dedicated Concierge Support',
                    locale === 'de' ? 'Flexible Buchungsoptionen' : 'Flexible Booking Options',
                    locale === 'de' ? 'Keine versteckten Gebühren' : 'No Hidden Fees',
                  ]).map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${property.is_monthly_rental ? 'bg-blue-100' : 'bg-green-100'}`}>
                        <Check className={`w-4 h-4 ${property.is_monthly_rental ? 'text-blue-600' : 'text-green-600'}`} />
                      </div>
                      <span className="text-charcoal-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={`/inquire?property=${property.slug}${property.is_monthly_rental ? '&type=monthly' : (selectedDates ? `&checkIn=${selectedDates.checkIn}&checkOut=${selectedDates.checkOut}` : '')}`}
                  className={`w-full flex items-center justify-center gap-3 text-lg py-5 mb-4 rounded-xl font-semibold transition-colors ${property.is_monthly_rental ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'btn-gold'}`}
                >
                  <Calendar className="w-5 h-5" />
                  {property.is_monthly_rental 
                    ? (locale === 'de' ? 'Monatsmiete anfragen' : 'Inquire for Monthly Rental')
                    : (selectedDates ? t('pages.propertyDetail.requestToBook') : t('pages.propertyDetail.checkAvailability'))}
                </Link>

                <p className="text-center text-charcoal-400 text-sm mb-6">
                  {property.is_monthly_rental 
                    ? (locale === 'de' ? 'Wir senden Ihnen Details zu Preisen und Verfügbarkeit' : 'We\'ll send you pricing and availability details')
                    : (locale === 'de' ? 'Unser Team meldet sich in Kürze' : 'Our team will respond shortly')}
                </p>

                <div className="border-t border-gray-100 pt-6 space-y-3">
                  <a href="tel:+34634306076" className="flex items-center gap-3 text-charcoal-600 hover:text-gold-600 transition-colors">
                    <Phone className="w-5 h-5" />
                    <span>+34 634 306 076</span>
                  </a>
                  <a href="mailto:info@primeluxurystays.com" className="flex items-center gap-3 text-charcoal-600 hover:text-gold-600 transition-colors">
                    <Mail className="w-5 h-5" />
                    <span>info@primeluxurystays.com</span>
                  </a>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-charcoal-900 rounded-2xl p-6 text-center">
                <Shield className="w-10 h-10 text-gold-400 mx-auto mb-3" />
                <p className="text-white font-semibold mb-1">
                  {locale === 'de' ? 'Mit Vertrauen buchen' : 'Book with Confidence'}
                </p>
                <p className="text-white/60 text-sm">
                  {locale === 'de' ? 'Lizenzierte & verifizierte Immobilie' : 'Licensed & Verified Property'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ========== FULLSCREEN GALLERY ========== */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-6 right-6 z-10 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-6 left-6 z-10 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>

            {/* Navigation */}
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm p-4 rounded-full hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm p-4 rounded-full hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>

            {/* Main Image */}
            <div className="w-full h-full flex items-center justify-center p-4 md:p-12">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full h-full max-w-[90vw] max-h-[80vh]"
              >
                <img
                  src={galleryImages[currentImageIndex]?.includes('%25') 
                    ? decodeURIComponent(galleryImages[currentImageIndex]) 
                    : galleryImages[currentImageIndex]}
                  alt={`${getLocalizedField(property, 'name', locale)} - Photo ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain rounded-lg"
                />
              </motion.div>
            </div>

            {/* Thumbnails */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 max-w-[90vw] overflow-x-auto pb-2 px-4">
              {galleryImages.slice(0, 12).map((img, i) => {
                const decodedImg = img?.includes('%25') ? decodeURIComponent(img) : img
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`relative w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      i === currentImageIndex ? 'border-gold-500 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={decodedImg} alt="" className="w-full h-full object-cover" />
                  </button>
                )
              })}
              {galleryImages.length > 12 && (
                <div className="flex-shrink-0 w-16 h-12 rounded-lg bg-white/20 flex items-center justify-center text-white text-sm font-medium">
                  +{galleryImages.length - 12}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== MOBILE STICKY CTA BAR ========== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-200 p-4 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-merriweather text-charcoal-900 font-semibold truncate">
              {getLocalizedField(property, 'name', locale)}
            </p>
            <p className="text-charcoal-500 text-sm">
              {property.city}, Mallorca
            </p>
          </div>
          <Link
            href={`/inquire?property=${property.slug}`}
            className="btn-gold flex-shrink-0 flex items-center gap-2 !py-3 !px-6"
          >
            <Calendar className="w-4 h-4" />
            <span>{locale === 'de' ? 'Anfragen' : 'Inquire'}</span>
          </Link>
        </div>
      </div>

      {/* Spacer for mobile sticky bar */}
      <div className="h-20 lg:hidden" />

      {/* Booking Calendar Modal */}
      <BookingCalendar
        propertySlug={property.slug}
        propertyName={getLocalizedField(property, 'name', locale)}
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        onSelect={(checkIn, checkOut, price) => {
          setSelectedDates({ checkIn, checkOut, price })
        }}
        initialCheckIn={selectedDates?.checkIn}
        initialCheckOut={selectedDates?.checkOut}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        property={{
          name: getLocalizedField(property, 'name', locale),
          shortDescription: getLocalizedField(property, 'short_description', locale),
          image: property.featured_image || '',
          url: typeof window !== 'undefined' 
            ? `${window.location.origin}/properties/${property.slug}?lang=${locale}`
            : `/properties/${property.slug}?lang=${locale}`,
        }}
        locale={locale}
      />
    </div>
  )
}
