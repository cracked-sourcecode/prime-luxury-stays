'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { 
  Search,
  Filter, 
  Bed, 
  Bath, 
  Waves, 
  Home, 
  Users, 
  MapPin, 
  Star, 
  Shield,
  Clock,
  ChevronDown,
  X,
  ImageOff,
  ArrowRight,
  Sparkles,
  Grid3X3,
  Map
} from 'lucide-react'
import PropertyMap from '@/components/PropertyMap'
import DatePickerModal from '@/components/DatePickerModal'
import type { Property } from '@/lib/properties'

interface PropertiesClientProps {
  properties: Property[];
}

// Image component with error handling
function PropertyImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Decode potentially double-encoded URLs
  const decodedSrc = src?.includes('%25') ? decodeURIComponent(src) : src
  
  if (error || !src) {
    return (
      <div className={`bg-cream-100 flex items-center justify-center ${className}`}>
        <ImageOff className="w-8 h-8 text-charcoal-300" />
      </div>
    )
  }
  
  return (
    <img
      src={decodedSrc}
      alt={alt}
      className={`${className} transition-opacity duration-300`}
      onLoad={() => setLoading(false)}
      onError={() => setError(true)}
    />
  )
}

export default function PropertiesClient({ properties }: PropertiesClientProps) {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  
  // Format date for display
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return 'Select'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  // Guest-focused search filters - initialized from URL params
  const [filters, setFilters] = useState({
    destination: searchParams.get('destination') || 'all',
    guests: 'any',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    priceRange: 'any',
    bedrooms: 'any',
    seaView: false,
    pool: false,
  })

  // Scroll to properties section if coming from home page search
  useEffect(() => {
    if (searchParams.get('destination') || searchParams.get('checkIn')) {
      setTimeout(() => {
        document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }, [searchParams])

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Use regions as destinations (not cities)
  const availableDestinations = ['Mallorca', 'Ibiza', 'South of France']

  // Filter properties based on guest-focused criteria
  const filteredProperties = properties.filter(property => {
    // Filter by region (destination)
    if (filters.destination !== 'all') {
      const propertyRegion = property.region?.toLowerCase() || 'mallorca'
      const filterRegion = filters.destination.toLowerCase().replace(/-/g, ' ')
      if (propertyRegion !== filterRegion) return false
    }
    if (filters.guests !== 'any' && (property.max_guests || 0) < parseInt(filters.guests)) return false
    if (filters.bedrooms !== 'any' && (property.bedrooms || 0) < parseInt(filters.bedrooms)) return false
    if (filters.seaView && !property.has_sea_view) return false
    if (filters.pool && !property.has_pool) return false
    return true
  })

  // Sort: featured first
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1
    if (!a.is_featured && b.is_featured) return 1
    return 0
  })

  // Get unique property types
  const propertyTypes = [...new Set(properties.map(p => p.house_type?.toLowerCase()).filter(Boolean))]

  // Featured properties for showcase
  const featuredProperties = properties.filter(p => p.is_featured).slice(0, 3)

  // Group properties by region for organized display
  const propertiesByRegion: Record<string, Property[]> = {}
  sortedProperties.forEach(property => {
    const region = property.region || 'Mallorca'
    if (!propertiesByRegion[region]) {
      propertiesByRegion[region] = []
    }
    propertiesByRegion[region].push(property)
  })

  // Define region display order and metadata
  const regionInfo: Record<string, { name: string; slug: string; tagline: string }> = {
    'Mallorca': { 
      name: 'Mallorca', 
      slug: '/mallorca', 
      tagline: 'The Jewel of the Mediterranean' 
    },
    'Ibiza': { 
      name: 'Ibiza', 
      slug: '/ibiza', 
      tagline: 'The White Isle' 
    },
    'South of France': { 
      name: 'South of France', 
      slug: '/south-of-france', 
      tagline: 'The French Riviera' 
    },
  }

  // Get ordered regions that have properties
  const orderedRegions = ['Mallorca', 'Ibiza', 'South of France'].filter(r => propertiesByRegion[r]?.length > 0)

  return (
    <div>
      {/* ========== HERO WITH SEARCH ========== */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px] overflow-hidden z-0">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
            alt="Luxury Properties"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-charcoal-900" />
        </motion.div>
        
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl w-full"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-5 py-2.5 rounded-full mb-6 border border-white/20"
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="text-sm font-medium">{properties.length} Exclusive Properties</span>
            </motion.div>
            
            <h1 className="font-merriweather text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Find Your Dream Villa
            </h1>
            
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Search our collection of handpicked luxury properties
            </p>

            {/* Guest-Focused Search Bar */}
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl mx-auto overflow-hidden">
              {/* Desktop Layout */}
              <div className="hidden md:grid md:grid-cols-5">
                {/* Destination */}
                <div className="p-4 border-r border-gray-100">
                  <label className="block text-left text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider mb-1">
                    Destination
                  </label>
                  <select
                    value={filters.destination}
                    onChange={(e) => setFilters(f => ({ ...f, destination: e.target.value }))}
                    className="w-full bg-transparent text-charcoal-900 font-medium focus:outline-none cursor-pointer text-base text-left"
                  >
                    <option value="all">All Destinations</option>
                    {availableDestinations.map(d => (
                      <option key={d} value={d.toLowerCase().replace(/ /g, '-')}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Dates */}
                <div 
                  className="p-4 border-r border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setShowDatePicker(true)}
                >
                  <label className="block text-left text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider mb-1">
                    Dates
                  </label>
                  <div className="text-left text-charcoal-900 font-medium text-base">
                    {filters.checkIn && filters.checkOut ? (
                      <span>{formatDisplayDate(filters.checkIn)} – {formatDisplayDate(filters.checkOut)}</span>
                    ) : (
                      <span className="text-charcoal-400">Select dates</span>
                    )}
                  </div>
                </div>

                {/* Guests */}
                <div className="p-4 border-r border-gray-100">
                  <label className="block text-left text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider mb-1">
                    Guests
                  </label>
                  <select
                    value={filters.guests}
                    onChange={(e) => setFilters(f => ({ ...f, guests: e.target.value }))}
                    className="w-full bg-transparent text-charcoal-900 font-medium focus:outline-none cursor-pointer text-base text-left"
                  >
                    <option value="any">Any</option>
                    <option value="2">2+</option>
                    <option value="4">4+</option>
                    <option value="6">6+</option>
                    <option value="8">8+</option>
                    <option value="10">10+</option>
                  </select>
                </div>

                {/* Bedrooms */}
                <div className="p-4 border-r border-gray-100">
                  <label className="block text-left text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider mb-1">
                    Bedrooms
                  </label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => setFilters(f => ({ ...f, bedrooms: e.target.value }))}
                    className="w-full bg-transparent text-charcoal-900 font-medium focus:outline-none cursor-pointer text-base text-left"
                  >
                    <option value="any">Any</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                {/* Search Button */}
                <a
                  href="#properties"
                  className="flex items-center justify-center gap-2 bg-gold-500 text-white font-semibold hover:bg-gold-600 transition-colors m-3 rounded-xl"
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </a>
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden p-4 space-y-4">
                {/* Row 1: Destination & Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-left text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider mb-1">
                      Destination
                    </label>
                    <select
                      value={filters.destination}
                      onChange={(e) => setFilters(f => ({ ...f, destination: e.target.value }))}
                      className="w-full bg-gray-50 text-charcoal-900 font-medium focus:outline-none cursor-pointer text-sm text-left px-3 py-2.5 rounded-lg border border-gray-200"
                    >
                      <option value="all">All</option>
                      {availableDestinations.map(d => (
                        <option key={d} value={d.toLowerCase().replace(/ /g, '-')}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div 
                    className="cursor-pointer"
                    onClick={() => setShowDatePicker(true)}
                  >
                    <label className="block text-left text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider mb-1">
                      Dates
                    </label>
                    <div className="bg-gray-50 text-charcoal-900 font-medium text-sm text-left px-3 py-2.5 rounded-lg border border-gray-200">
                      {filters.checkIn && filters.checkOut ? (
                        <span>{formatDisplayDate(filters.checkIn)} – {formatDisplayDate(filters.checkOut)}</span>
                      ) : (
                        <span className="text-charcoal-400">Select</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Row 2: Guests & Bedrooms */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-left text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider mb-1">
                      Guests
                    </label>
                    <select
                      value={filters.guests}
                      onChange={(e) => setFilters(f => ({ ...f, guests: e.target.value }))}
                      className="w-full bg-gray-50 text-charcoal-900 font-medium focus:outline-none cursor-pointer text-sm text-left px-3 py-2.5 rounded-lg border border-gray-200"
                    >
                      <option value="any">Any</option>
                      <option value="2">2+</option>
                      <option value="4">4+</option>
                      <option value="6">6+</option>
                      <option value="8">8+</option>
                      <option value="10">10+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-left text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider mb-1">
                      Bedrooms
                    </label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => setFilters(f => ({ ...f, bedrooms: e.target.value }))}
                      className="w-full bg-gray-50 text-charcoal-900 font-medium focus:outline-none cursor-pointer text-sm text-left px-3 py-2.5 rounded-lg border border-gray-200"
                    >
                      <option value="any">Any</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>
                </div>

                {/* Search Button - Full Width */}
                <a
                  href="#properties"
                  className="flex items-center justify-center gap-2 bg-gold-500 text-white font-semibold hover:bg-gold-600 transition-colors py-3 rounded-xl w-full"
                >
                  <Search className="w-5 h-5" />
                  <span>Search Properties</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-white/60"
            >
              <span className="text-xs tracking-widest uppercase">Explore</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ========== FEATURED PROPERTIES SHOWCASE ========== */}
      {featuredProperties.length > 0 && (
        <section className="py-20 bg-white relative z-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p className="text-gold-600 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
                Handpicked For You
              </p>
              <h2 className="font-merriweather text-3xl md:text-4xl text-charcoal-900">
                Featured Properties
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/properties/${property.slug}`} className="group block">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                      <PropertyImage
                        src={property.featured_image || ''}
                        alt={property.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-4 left-4 bg-gold-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" />
                        Featured
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-merriweather text-xl text-white mb-1">{property.name}</h3>
                        <p className="text-white/80 text-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {property.city}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-charcoal-600 text-sm">
                      <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {property.bedrooms}</span>
                      <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.bathrooms}</span>
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {property.max_guests}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== WHY BOOK WITH US ========== */}
      <section className="py-20 bg-cream-50 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-gold-600 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
                Why Choose Us
              </p>
              <h2 className="font-merriweather text-3xl md:text-4xl text-charcoal-900 mb-6">
                More Than Just Properties
              </h2>
              <p className="text-charcoal-600 text-lg mb-8">
                We don't just offer luxury accommodations – we create unforgettable experiences. 
                Every property is personally vetted, and our concierge team ensures your stay is perfect.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-gold-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal-900 mb-1">Verified Properties</h4>
                    <p className="text-charcoal-500 text-sm">Every property personally inspected by our team</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-gold-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal-900 mb-1">Dedicated Concierge</h4>
                    <p className="text-charcoal-500 text-sm">Round-the-clock support for anything you need</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold-100 flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-gold-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal-900 mb-1">Best Price Direct</h4>
                    <p className="text-charcoal-500 text-sm">Book direct for guaranteed best rates, no hidden fees</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80"
                  alt="Luxury villa experience"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="font-merriweather text-3xl text-gold-600">{properties.length}+</div>
                    <div className="text-xs text-charcoal-500">Properties</div>
                  </div>
                  <div className="w-px h-12 bg-gray-200" />
                  <div className="text-center">
                    <div className="font-merriweather text-3xl text-gold-600">5★</div>
                    <div className="text-xs text-charcoal-500">Service</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== ALL PROPERTIES ========== */}
      <section id="properties" className="py-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
          >
            <div>
              <p className="text-gold-600 text-sm font-semibold tracking-[0.2em] uppercase mb-3">
                Browse Collection
              </p>
              <h2 className="font-merriweather text-3xl md:text-4xl text-charcoal-900">
                All Properties
              </h2>
              <p className="text-charcoal-500 mt-2">
                {sortedProperties.length} properties available
              </p>
            </div>

            {/* View Toggle & Filters */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                  showFilters 
                    ? 'bg-charcoal-900 text-white border-charcoal-900' 
                    : 'bg-white text-charcoal-700 border-gray-200 hover:border-charcoal-300'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-charcoal-500'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    viewMode === 'map' ? 'bg-white shadow-sm' : 'text-charcoal-500'
                  }`}
                >
                  <Map className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-cream-50 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-charcoal-900">Refine Your Search</h3>
                <button
                  onClick={() => setFilters({ destination: 'all', guests: 'any', checkIn: '', checkOut: '', priceRange: 'any', bedrooms: 'any', seaView: false, pool: false })}
                  className="text-sm text-gold-600 hover:text-gold-700"
                >
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal-500 mb-1.5 uppercase">Bedrooms</label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => setFilters(f => ({ ...f, bedrooms: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
                  >
                    <option value="any">Any</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                    <option value="6">6+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal-500 mb-1.5 uppercase">Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters(f => ({ ...f, priceRange: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
                  >
                    <option value="any">Any Price</option>
                    <option value="budget">Budget-Friendly</option>
                    <option value="mid">Mid-Range</option>
                    <option value="luxury">Luxury</option>
                    <option value="ultra">Ultra-Luxury</option>
                  </select>
                </div>
                <div className="col-span-2 flex items-end gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.seaView}
                      onChange={(e) => setFilters(f => ({ ...f, seaView: e.target.checked }))}
                      className="w-5 h-5 rounded border-gray-300 text-gold-500"
                    />
                    <span className="text-sm text-charcoal-700">Sea View</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.pool}
                      onChange={(e) => setFilters(f => ({ ...f, pool: e.target.checked }))}
                      className="w-5 h-5 rounded border-gray-300 text-gold-500"
                    />
                    <span className="text-sm text-charcoal-700">Private Pool</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* Properties Grid or Map */}
          {viewMode === 'grid' ? (
            <div className="space-y-16">
              {orderedRegions.map((region, regionIndex) => {
                const info = regionInfo[region]
                const regionProperties = propertiesByRegion[region] || []
                
                return (
                  <div key={region}>
                    {/* Region Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-2 h-2 rounded-full bg-gold-500" />
                          <span className="text-gold-600 text-sm font-semibold tracking-wide uppercase">
                            {info?.tagline || region}
                          </span>
                        </div>
                        <h3 className="font-merriweather text-2xl md:text-3xl text-charcoal-900">
                          {info?.name || region} Collection
                        </h3>
                        <p className="text-charcoal-500 mt-1">
                          {regionProperties.length} {regionProperties.length === 1 ? 'property' : 'properties'} available
                        </p>
                      </div>
                      <Link 
                        href={info?.slug || '#'} 
                        className="inline-flex items-center gap-2 text-gold-600 font-semibold hover:text-gold-700 transition-colors"
                      >
                        <span>Explore {info?.name || region}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    {/* Region Properties Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {regionProperties.map((property, index) => (
                        <motion.div
                          key={property.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link href={`/properties/${property.slug}`} className="group block">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-lg">
                              <PropertyImage
                                src={property.featured_image || ''}
                                alt={property.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              
                              {property.is_featured && (
                                <div className="absolute top-4 left-4 bg-gold-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-white" /> Featured
                                </div>
                              )}
                              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                                {property.house_type}
                              </div>
                              <div className="absolute bottom-4 left-4 flex gap-2">
                                {property.has_sea_view && (
                                  <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full">
                                    <Waves className="w-4 h-4 text-blue-500" />
                                  </div>
                                )}
                                {property.has_pool && (
                                  <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-xs">🏊</div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-charcoal-500 text-sm mb-1">
                              <MapPin className="w-4 h-4 text-gold-500" />
                              <span>{property.city}{property.city ? ', ' : ''}{property.region}</span>
                            </div>
                            <h3 className="font-merriweather text-xl text-charcoal-900 mb-2 group-hover:text-gold-600 transition-colors">
                              {property.name}
                            </h3>
                            <p className="text-charcoal-500 text-sm mb-3 line-clamp-2">{property.short_description}</p>
                            <div className="flex items-center gap-4 text-charcoal-600 text-sm mb-3">
                              <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {property.bedrooms}</span>
                              <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.bathrooms}</span>
                              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {property.max_guests}</span>
                            </div>
                            {/* Price */}
                            {property.price_per_week && (
                              <div className="inline-flex items-baseline gap-1 bg-cream-100 border border-cream-200 rounded-lg px-3 py-1.5">
                                <span className="text-gold-700 font-semibold">
                                  €{Number(property.price_per_week).toLocaleString()}
                                  {property.price_per_week_high && (
                                    <span> - €{Number(property.price_per_week_high).toLocaleString()}</span>
                                  )}
                                </span>
                                <span className="text-charcoal-500 text-sm">/week</span>
                              </div>
                            )}
                          </Link>
                        </motion.div>
                      ))}
                    </div>

                    {/* Divider between regions */}
                    {regionIndex < orderedRegions.length - 1 && (
                      <div className="mt-16 border-b border-gray-200" />
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6 h-[600px]">
              <div className="h-full rounded-2xl overflow-hidden shadow-lg">
                <PropertyMap 
                  properties={sortedProperties} 
                  selectedProperty={selectedProperty}
                  onPropertySelect={setSelectedProperty}
                />
              </div>
              <div className="overflow-y-auto space-y-4">
                {sortedProperties.map((property) => (
                  <div
                    key={property.id}
                    className={`bg-white rounded-xl p-4 border cursor-pointer transition-all ${
                      selectedProperty?.id === property.id ? 'border-gold-500 shadow-lg' : 'border-gray-100 hover:border-gold-200'
                    }`}
                    onClick={() => setSelectedProperty(property)}
                  >
                    <div className="flex gap-4">
                      <div className="relative w-28 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <PropertyImage src={property.featured_image || ''} alt={property.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-charcoal-900 truncate">{property.name}</h3>
                        <p className="text-sm text-charcoal-500">{property.city}</p>
                        <div className="flex items-center gap-3 text-sm text-charcoal-600 mt-1">
                          <span><Bed className="w-3 h-3 inline" /> {property.bedrooms}</span>
                          <span><Users className="w-3 h-3 inline" /> {property.max_guests}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {sortedProperties.length === 0 && (
            <div className="text-center py-16">
              <Home className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
              <h3 className="font-merriweather text-xl text-charcoal-900 mb-2">No properties found</h3>
              <p className="text-charcoal-500 mb-6">Try adjusting your search or filters</p>
              <button
                onClick={() => { setSearchQuery(''); setFilters({ type: 'all', bedrooms: 'any', guests: 'any', seaView: false, pool: false }) }}
                className="btn-gold"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-20 bg-charcoal-900 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-merriweather text-3xl md:text-4xl text-white mb-6">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Tell us your requirements and we'll help you find the perfect property for your stay.
          </p>
          <Link href="/inquire" className="btn-gold inline-flex items-center gap-2">
            Contact Our Team
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Date Picker Modal */}
      <DatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelectDates={(checkIn, checkOut) => {
          setFilters(f => ({ ...f, checkIn, checkOut }))
        }}
        initialCheckIn={filters.checkIn}
        initialCheckOut={filters.checkOut}
        title="Select your travel dates"
      />
    </div>
  )
}
