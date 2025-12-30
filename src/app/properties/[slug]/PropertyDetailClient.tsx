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
  Heart,
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
  Quote,
  ImageOff
} from 'lucide-react'
import type { Property } from '@/lib/properties'
import BookingCalendar from '@/components/BookingCalendar'
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

export default function PropertyDetailClient({ property, galleryImages: dbImages }: PropertyDetailClientProps) {
  const { t } = useLocale()
  const [isLiked, setIsLiked] = useState(false)
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
    { icon: Waves, label: 'Sea View', available: property.has_sea_view, description: 'Stunning Mediterranean views' },
    { icon: TreePine, label: 'Private Pool', available: property.has_pool, description: 'Your own oasis' },
    { icon: Wind, label: 'Air Conditioning', available: property.has_ac, description: 'Climate controlled throughout' },
    { icon: Flame, label: 'Heating', available: property.has_heating, description: 'Cozy winter warmth' },
    { icon: Wifi, label: 'High-Speed WiFi', available: property.has_wifi, description: 'Work remotely in paradise' },
    { icon: Car, label: 'Private Parking', available: true, description: 'Secure parking included' },
    { icon: Coffee, label: 'Fully Equipped Kitchen', available: true, description: 'Everything you need' },
    { icon: Home, label: 'Smart Home', available: true, description: 'Modern conveniences' },
  ].filter(a => a.available)

  const highlights = [
    { icon: Shield, title: 'Verified Excellence', desc: 'Personally inspected by our team' },
    { icon: Clock, title: 'Dedicated Concierge', desc: 'Personal support throughout your stay' },
    { icon: Star, title: 'Best Price Direct', desc: 'No booking fees, ever' },
  ]

  const experiences = [
    { icon: Anchor, title: 'Yacht Charters', desc: 'Explore hidden coves' },
    { icon: Utensils, title: 'Private Chef', desc: 'Michelin-quality dining' },
    { icon: Wine, title: 'Wine Tours', desc: 'Local vineyard experiences' },
    { icon: Mountain, title: 'Hiking Guides', desc: 'Tramuntana adventures' },
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
            alt={property.name}
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
            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-full hover:bg-gray-100 transition-all">
                <Share2 className="w-5 h-5 text-charcoal-600" />
              </button>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className="p-2.5 rounded-full hover:bg-gray-100 transition-all"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-charcoal-600'}`} />
              </button>
              <Link 
                href={`/inquire?property=${property.slug}`}
                className="hidden sm:block bg-gold-500 text-charcoal-900 px-5 py-2.5 rounded-lg font-semibold hover:bg-gold-400 transition-colors text-sm"
              >
                Inquire Now
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
                {property.is_featured && (
                  <div className="bg-gold-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Star className="w-4 h-4 fill-white" />
                    Featured
                  </div>
                )}
                <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                  {property.house_type}
                </div>
                {property.license_number && (
                  <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Licensed: {property.license_number}
                  </div>
                )}
              </div>

              {/* Title & Location */}
              <div className="flex items-center gap-2 text-gold-400 mb-3">
                <MapPin className="w-5 h-5" />
                <span className="text-lg font-medium">{property.city}, Mallorca</span>
              </div>
              
              <h1 className="font-merriweather text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                {property.name}
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
                <span className="text-gold-600 font-semibold tracking-wide uppercase text-sm">Your Private Escape</span>
              </div>
              
              <h2 className="font-merriweather text-3xl md:text-4xl text-charcoal-900 mb-6 leading-tight">
                Experience Mediterranean Living at Its Finest
              </h2>
              
              <p className="text-charcoal-600 text-lg leading-relaxed mb-8">
                {property.description || `Welcome to ${property.name}, where every detail has been carefully curated to create an unforgettable Mallorcan experience. This stunning ${property.house_type?.toLowerCase()} offers the perfect blend of luxury, comfort, and authentic island charm.`}
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
                      alt={`${property.name} - Photo 1`}
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
                          alt={`${property.name} - Photo 2`}
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
                          alt={`${property.name} - Photo 3`}
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
                    <p className="text-charcoal-500 text-sm">Experience {property.name} from anywhere</p>
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
                  Concierge Services
                </span>
                <h2 className="font-merriweather text-3xl text-white mb-4">
                  Curated Experiences
                </h2>
                <p className="text-white/60 text-lg mb-10 max-w-2xl">
                  Our concierge team can arrange exclusive experiences to make your stay truly unforgettable.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {experiences.map((exp, i) => (
                    <motion.div
                      key={exp.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500/20 transition-colors">
                        <exp.icon className="w-8 h-8 text-gold-400" />
                      </div>
                      <h4 className="font-semibold text-white mb-1">{exp.title}</h4>
                      <p className="text-white/50 text-sm">{exp.desc}</p>
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
                  { icon: Waves, label: 'Beach', time: '5 min' },
                  { icon: Utensils, label: 'Restaurants', time: '10 min' },
                  { icon: Wine, label: 'Old Town', time: '15 min' },
                  { icon: Sun, label: 'Airport', time: '25 min' },
                ].map((item) => (
                  <div key={item.label} className="bg-cream-50 rounded-xl p-4 text-center">
                    <item.icon className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                    <p className="font-medium text-charcoal-900">{item.label}</p>
                    <p className="text-charcoal-400 text-sm">{item.time}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ===== TESTIMONIAL ===== */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gold-50 to-cream-50 rounded-3xl p-8 md:p-12 border border-gold-100"
            >
              <Quote className="w-12 h-12 text-gold-400 mb-6" />
              <p className="font-merriweather text-2xl md:text-3xl text-charcoal-800 mb-8 leading-relaxed italic">
                "An absolutely stunning property. Every detail was perfect—from the breathtaking views to the impeccable service. 
                We didn't want to leave."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <div>
                  <p className="font-semibold text-charcoal-900 text-lg">Sarah & James</p>
                  <p className="text-charcoal-500">London, UK • August 2024</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-500 fill-gold-500" />
                  ))}
                </div>
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
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                {/* Price Display */}
                {property.price_per_week && (
                  <div className="text-center mb-6 pb-6 border-b border-gray-100">
                    <p className="text-charcoal-500 text-sm mb-1">From</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="font-merriweather text-3xl text-charcoal-900">
                        €{Number(property.price_per_week).toLocaleString()}
                      </span>
                      <span className="text-charcoal-500">/week</span>
                    </div>
                    {property.price_per_week_high && (
                      <p className="text-charcoal-400 text-sm mt-1">
                        Up to €{Number(property.price_per_week_high).toLocaleString()}/week in peak season
                      </p>
                    )}
                  </div>
                )}

                {/* Selected Dates Display */}
                {selectedDates && (
                  <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-charcoal-600 text-sm">Check-in</span>
                      <span className="font-semibold text-charcoal-900">
                        {new Date(selectedDates.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-charcoal-600 text-sm">Check-out</span>
                      <span className="font-semibold text-charcoal-900">
                        {new Date(selectedDates.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    {selectedDates.price && (
                      <div className="flex items-center justify-between pt-2 border-t border-gold-200">
                        <span className="font-semibold text-gold-700">Estimated Total</span>
                        <span className="font-bold text-gold-700 text-lg">€{selectedDates.price.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Calendar Button */}
                <button
                  onClick={() => setShowCalendar(true)}
                  className="w-full bg-cream-100 border-2 border-cream-200 rounded-xl p-4 mb-4 hover:border-gold-300 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gold-600" />
                    <div>
                      <p className="font-medium text-charcoal-900">
                        {selectedDates ? 'Change Dates' : 'Select Dates'}
                      </p>
                      <p className="text-charcoal-500 text-sm">Check availability calendar</p>
                    </div>
                  </div>
                </button>

                {/* Min Stay */}
                {property.min_stay_nights && property.min_stay_nights > 7 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-amber-800">Minimum Stay</p>
                      <p className="text-amber-600 text-sm">{property.min_stay_nights} nights</p>
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {[
                    'Verified Luxury Property',
                    'Dedicated Concierge Support',
                    'Flexible Booking Options',
                    'No Hidden Fees',
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-charcoal-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={`/inquire?property=${property.slug}${selectedDates ? `&checkIn=${selectedDates.checkIn}&checkOut=${selectedDates.checkOut}` : ''}`}
                  className="btn-gold w-full flex items-center justify-center gap-3 text-lg py-5 mb-4"
                >
                  <Calendar className="w-5 h-5" />
                  {selectedDates ? t('pages.propertyDetail.requestToBook') : t('pages.propertyDetail.checkAvailability')}
                </Link>

                <p className="text-center text-charcoal-400 text-sm mb-6">
                  Our team will respond shortly
                </p>

                <div className="border-t border-gray-100 pt-6 space-y-3">
                  <a href="tel:+12039797309" className="flex items-center gap-3 text-charcoal-600 hover:text-gold-600 transition-colors">
                    <Phone className="w-5 h-5" />
                    <span>+1 (203) 979-7309</span>
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
                <p className="text-white font-semibold mb-1">Book with Confidence</p>
                <p className="text-white/60 text-sm">Licensed & Verified Property</p>
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
                  alt={`${property.name} - Photo ${currentImageIndex + 1}`}
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
              {property.name}
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
            <span>Inquire</span>
          </Link>
        </div>
      </div>

      {/* Spacer for mobile sticky bar */}
      <div className="h-20 lg:hidden" />

      {/* Booking Calendar Modal */}
      <BookingCalendar
        propertySlug={property.slug}
        propertyName={property.name}
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        onSelect={(checkIn, checkOut, price) => {
          setSelectedDates({ checkIn, checkOut, price })
        }}
        initialCheckIn={selectedDates?.checkIn}
        initialCheckOut={selectedDates?.checkOut}
      />
    </div>
  )
}
