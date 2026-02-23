'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Anchor, Users, Ruler, Calendar, ChevronLeft, ChevronRight, Ship, 
  Waves, Sparkles, ArrowRight, X, Check, Gauge, Settings, Droplets,
  Grid3X3, Maximize, Phone, Mail, Shield, Clock, Star
} from 'lucide-react'
import Link from 'next/link'
import { useLocale } from '@/i18n/LocaleProvider'

interface YachtImage {
  id: number
  image_url: string
  caption?: string
  caption_de?: string
  is_featured: boolean
  image_type: string
}

interface RelatedProperty {
  id: number
  name: string
  slug: string
  featured_image: string
  short_description: string
  short_description_de: string
  bedrooms: number
  max_guests: number
  region: string
  city: string
  price_per_week?: number
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
  draft_meters: number
  guest_cabins: number
  max_guests: number
  crew_members: number
  short_description: string
  short_description_de?: string
  long_description: string
  long_description_de?: string
  cruising_speed_knots: number
  max_speed_knots: number
  has_stabilizers: boolean
  stabilizer_type?: string
  engines?: string
  has_jet_ski: boolean
  has_tender: boolean
  has_water_toys: boolean
  water_toys_list: string[]
  has_jacuzzi: boolean
  has_gym: boolean
  has_wifi: boolean
  has_air_conditioning: boolean
  amenities: string[]
  extras?: string
  featured_image: string
  home_port: string
  region: string
  cruising_area: string
  price_per_day: number
  price_per_week: number
  images: YachtImage[]
  relatedProperties: RelatedProperty[]
}

interface YachtDetailClientProps {
  yacht: Yacht
}

export default function YachtDetailClient({ yacht }: YachtDetailClientProps) {
  const { locale } = useLocale()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<RelatedProperty | null>(null)

  // Localized field helper
  const getLocalizedField = (field: 'short_description' | 'long_description'): string => {
    if (locale === 'de') {
      const deField = yacht[`${field}_de` as keyof Yacht] as string | undefined
      if (deField) return deField
    }
    return (yacht[field] as string) || ''
  }

  const allImages = yacht.images?.length > 0 
    ? yacht.images.map(img => img.image_url)
    : [yacht.featured_image || 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1200']

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)

  // Parse water toys if it's a string
  const waterToys = typeof yacht.water_toys_list === 'string' 
    ? JSON.parse(yacht.water_toys_list || '[]') 
    : yacht.water_toys_list || []

  const amenities = typeof yacht.amenities === 'string'
    ? JSON.parse(yacht.amenities || '[]')
    : yacht.amenities || []

  // Calculate combined price if property selected
  const combinedWeeklyPrice = selectedProperty?.price_per_week && yacht.price_per_week
    ? Number(selectedProperty.price_per_week) + Number(yacht.price_per_week)
    : null

  // German labels for specs table
  const specsLabels = {
    length: locale === 'de' ? 'Länge' : 'Length',
    beam: locale === 'de' ? 'Breite' : 'Beam',
    yearBuilt: locale === 'de' ? 'Baujahr' : 'Year Built',
    cabins: locale === 'de' ? 'Gästekabinen' : 'Guest Cabins',
    engines: locale === 'de' ? 'Motoren' : 'Engines',
    cruisingSpeed: locale === 'de' ? 'Reisegeschwindigkeit' : 'Cruising Speed',
    maxSpeed: locale === 'de' ? 'Höchstgeschwindigkeit' : 'Max Speed',
    stabilizers: locale === 'de' ? 'Stabilisatoren' : 'Stabilizers',
    crew: locale === 'de' ? 'Crew' : 'Crew Members',
    guests: locale === 'de' ? 'Gäste' : 'Guests',
    type: locale === 'de' ? 'Typ' : 'Type',
    homePort: locale === 'de' ? 'Heimathafen' : 'Home Port',
    cruisingArea: locale === 'de' ? 'Fahrtgebiet' : 'Cruising Area',
  }

  return (
    <div className="bg-cream-50 min-h-screen">
      {/* ========== HERO SECTION - Single Image Like Properties ========== */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src={allImages[0]}
            alt={yacht.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/30 to-transparent" />
        </motion.div>

        {/* Fixed Navigation Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white py-4 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3">
                <img
                  src="https://storage.googleapis.com/primeluxurystays-rpr/Logo%20no%20text%20(global%20header).png"
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
                href="/yachts"
                className="hidden md:flex items-center gap-2 text-charcoal-600 hover:text-gold-600 transition-colors text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{locale === 'de' ? 'Alle Yachten' : 'All Yachts'}</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Link 
                href={`/inquire?type=yacht&yacht=${yacht.slug}`}
                className="hidden sm:block bg-gold-500 text-charcoal-900 px-5 py-2.5 rounded-lg font-semibold hover:bg-gold-400 transition-colors text-sm"
              >
                {locale === 'de' ? 'Charter anfragen' : 'Request Charter'}
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
                <div className="bg-gold-500/90 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  <Anchor className="w-4 h-4" />
                  {yacht.manufacturer} {yacht.model}
                </div>
                <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                  {yacht.yacht_type || (locale === 'de' ? 'Motoryacht' : 'Motor Yacht')}
                </div>
                {yacht.year_built && (
                  <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                    {yacht.year_built}
                  </div>
                )}
              </div>

              {/* Title & Location */}
              <div className="flex items-center gap-2 text-gold-400 mb-3">
                <Ship className="w-5 h-5" />
                <span className="text-lg font-medium">{yacht.home_port || yacht.region}</span>
              </div>
              
              <h1 className="font-merriweather text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                {yacht.name}
              </h1>

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center gap-6 md:gap-10 text-white/90 mb-8">
                <div className="flex items-center gap-3">
                  <Ruler className="w-6 h-6" />
                  <span className="text-lg">{yacht.length_meters}m {specsLabels.length}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6" />
                  <span className="text-lg">{yacht.max_guests} {specsLabels.guests}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Ship className="w-6 h-6" />
                  <span className="text-lg">{yacht.guest_cabins} {locale === 'de' ? 'Kabinen' : 'Cabins'}</span>
                </div>
                {yacht.crew_members && (
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6" />
                    <span className="text-lg">{yacht.crew_members} Crew</span>
                  </div>
                )}
              </div>

              {/* View Gallery Button */}
              <button
                onClick={() => setShowGallery(true)}
                className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-xl font-medium hover:bg-white/30 transition-all flex items-center gap-3 border border-white/30"
              >
                <Grid3X3 className="w-5 h-5" />
                {locale === 'de' ? 'Alle Fotos ansehen' : 'View All Photos'}
                <span className="bg-white/20 px-2 py-1 rounded-md text-sm">{allImages.length}</span>
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
            
            {/* ===== PHOTO GRID - Like Properties ===== */}
            {allImages.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-merriweather text-2xl md:text-3xl text-charcoal-900 mb-4 md:mb-6">
                  {locale === 'de' ? 'Fotogalerie' : 'Photo Gallery'}
                </h2>
                <div className="grid grid-cols-3 gap-3 h-[500px]">
                  {/* Large main image */}
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
                    <img
                      src={allImages[0]}
                      alt={`${yacht.name} - Photo 1`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <Maximize className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.div>
                  
                  {/* Right column - stacked images */}
                  <div className="col-span-1 flex flex-col gap-3">
                    {allImages.length > 1 && (
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
                        <img
                          src={allImages[1]}
                          alt={`${yacht.name} - Photo 2`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Maximize className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </motion.div>
                    )}
                    
                    {allImages.length > 2 && (
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
                        <img
                          src={allImages[2]}
                          alt={`${yacht.name} - Photo 3`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Maximize className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {allImages.length > 3 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                            <div className="text-center text-white">
                              <Grid3X3 className="w-8 h-8 mx-auto mb-2" />
                              <span className="text-lg font-semibold">+{allImages.length - 3}</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.section>
            )}

            {/* ===== ABOUT ===== */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-gold-500" />
                <span className="text-gold-600 font-semibold tracking-wide uppercase text-sm">
                  {locale === 'de' ? 'Exklusiver Charter' : 'Exclusive Charter'}
                </span>
              </div>
              
              <h2 className="font-merriweather text-3xl md:text-4xl text-charcoal-900 mb-6 leading-tight">
                {locale === 'de' ? 'Über diese Yacht' : 'About This Yacht'}
              </h2>
              
              <p className="text-charcoal-600 text-lg leading-relaxed whitespace-pre-wrap">
                {getLocalizedField('long_description')}
              </p>
            </motion.section>

            {/* ===== TECHNICAL SPECIFICATIONS ===== */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-xl"
            >
              <h3 className="font-merriweather text-2xl text-charcoal-900 mb-8 flex items-center gap-3">
                <Settings className="w-6 h-6 text-gold-500" />
                {locale === 'de' ? 'Technische Daten' : 'Technical Specifications'}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-cream-200">
                    <span className="text-charcoal-500">{specsLabels.length}</span>
                    <span className="font-medium text-charcoal-800">{yacht.length_meters}m</span>
                  </div>
                  {yacht.beam_meters && (
                    <div className="flex justify-between py-3 border-b border-cream-200">
                      <span className="text-charcoal-500">{specsLabels.beam}</span>
                      <span className="font-medium text-charcoal-800">{yacht.beam_meters}m</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 border-b border-cream-200">
                    <span className="text-charcoal-500">{specsLabels.yearBuilt}</span>
                    <span className="font-medium text-charcoal-800">{yacht.year_built}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-cream-200">
                    <span className="text-charcoal-500">{specsLabels.cabins}</span>
                    <span className="font-medium text-charcoal-800">{yacht.guest_cabins} en-suite</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-cream-200">
                    <span className="text-charcoal-500">{specsLabels.guests}</span>
                    <span className="font-medium text-charcoal-800">{yacht.max_guests}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {yacht.engines && (
                    <div className="flex justify-between py-3 border-b border-cream-200">
                      <span className="text-charcoal-500">{specsLabels.engines}</span>
                      <span className="font-medium text-charcoal-800">{yacht.engines}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 border-b border-cream-200">
                    <span className="text-charcoal-500">{specsLabels.cruisingSpeed}</span>
                    <span className="font-medium text-charcoal-800">{yacht.cruising_speed_knots} {locale === 'de' ? 'Knoten' : 'knots'}</span>
                  </div>
                  {yacht.max_speed_knots && (
                    <div className="flex justify-between py-3 border-b border-cream-200">
                      <span className="text-charcoal-500">{specsLabels.maxSpeed}</span>
                      <span className="font-medium text-charcoal-800">{yacht.max_speed_knots} {locale === 'de' ? 'Knoten' : 'knots'}</span>
                    </div>
                  )}
                  {yacht.has_stabilizers && (
                    <div className="flex justify-between py-3 border-b border-cream-200">
                      <span className="text-charcoal-500">{specsLabels.stabilizers}</span>
                      <span className="font-medium text-charcoal-800">{yacht.stabilizer_type || (locale === 'de' ? 'Ja' : 'Yes')}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 border-b border-cream-200">
                    <span className="text-charcoal-500">{specsLabels.crew}</span>
                    <span className="font-medium text-charcoal-800">{yacht.crew_members}</span>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* ===== WATER TOYS ===== */}
            {waterToys.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 md:p-12 shadow-xl"
              >
                <h3 className="font-merriweather text-2xl text-charcoal-900 mb-6 flex items-center gap-3">
                  <Droplets className="w-6 h-6 text-gold-500" />
                  {locale === 'de' ? 'Wassersport' : 'Water Toys'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {waterToys.map((toy: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-cream-50 rounded-xl">
                      <Check className="w-5 h-5 text-gold-500 flex-shrink-0" />
                      <span className="text-charcoal-700">{toy}</span>
                    </div>
                  ))}
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
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-8">
                {locale === 'de' ? 'Ausstattung' : 'Amenities'}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {yacht.has_wifi && (
                  <div className="flex items-center gap-5 p-5 bg-cream-50 rounded-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
                      <Check className="w-7 h-7 text-gold-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal-900 text-lg">WiFi</h4>
                      <p className="text-charcoal-500 text-sm">{locale === 'de' ? 'Highspeed-Internet an Bord' : 'High-speed internet onboard'}</p>
                    </div>
                  </div>
                )}
                {yacht.has_air_conditioning && (
                  <div className="flex items-center gap-5 p-5 bg-cream-50 rounded-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
                      <Check className="w-7 h-7 text-gold-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal-900 text-lg">{locale === 'de' ? 'Klimaanlage' : 'Air Conditioning'}</h4>
                      <p className="text-charcoal-500 text-sm">{locale === 'de' ? 'Vollständig klimatisiert' : 'Fully climate controlled'}</p>
                    </div>
                  </div>
                )}
                {yacht.has_jacuzzi && (
                  <div className="flex items-center gap-5 p-5 bg-cream-50 rounded-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
                      <Check className="w-7 h-7 text-gold-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal-900 text-lg">Jacuzzi</h4>
                      <p className="text-charcoal-500 text-sm">{locale === 'de' ? 'Whirlpool an Deck' : 'On-deck hot tub'}</p>
                    </div>
                  </div>
                )}
                {yacht.has_gym && (
                  <div className="flex items-center gap-5 p-5 bg-cream-50 rounded-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
                      <Check className="w-7 h-7 text-gold-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal-900 text-lg">{locale === 'de' ? 'Fitnessbereich' : 'Gym'}</h4>
                      <p className="text-charcoal-500 text-sm">{locale === 'de' ? 'Trainingsgeräte an Bord' : 'Fitness equipment onboard'}</p>
                    </div>
                  </div>
                )}
                {yacht.has_stabilizers && (
                  <div className="flex items-center gap-5 p-5 bg-cream-50 rounded-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
                      <Check className="w-7 h-7 text-gold-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal-900 text-lg">{locale === 'de' ? 'Stabilisatoren' : 'Stabilizers'}</h4>
                      <p className="text-charcoal-500 text-sm">{locale === 'de' ? 'Für maximalen Komfort' : 'For maximum comfort'}</p>
                    </div>
                  </div>
                )}
                {yacht.has_tender && (
                  <div className="flex items-center gap-5 p-5 bg-cream-50 rounded-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
                      <Check className="w-7 h-7 text-gold-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal-900 text-lg">Tender</h4>
                      <p className="text-charcoal-500 text-sm">{locale === 'de' ? 'Beiboot inklusive' : 'Tender boat included'}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>

            {/* ===== EXTRAS & ADD-ONS ===== */}
            {yacht.extras && yacht.extras.trim() && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 md:p-12 shadow-xl"
              >
                <h2 className="font-merriweather text-2xl text-charcoal-900 mb-6 flex items-center gap-3">
                  <Star className="w-6 h-6 text-gold-500" />
                  {locale === 'de' ? 'Extras & Ausstattung' : 'Extras & Equipment'}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {yacht.extras.split('\n').filter((line: string) => line.trim()).map((extra: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-cream-50 rounded-xl">
                      <Check className="w-5 h-5 text-gold-500 flex-shrink-0" />
                      <span className="text-charcoal-700">{extra.trim()}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

          </div>

          {/* ===== STICKY SIDEBAR ===== */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="sticky top-28 space-y-6"
            >
              {/* Main Booking Card */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                <div className="text-center mb-6 pb-6 border-b border-gray-100">
                  <div className="inline-flex items-center gap-2 text-gold-600 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-medium">{locale === 'de' ? 'Exklusiver Charter' : 'Exclusive Charter'}</span>
                  </div>
                  <h3 className="font-merriweather text-2xl text-charcoal-900">{yacht.name}</h3>
                  <p className="text-charcoal-500">{yacht.model}</p>
                </div>

                {/* Quick Specs */}
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-cream-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-2xl font-merriweather text-charcoal-800">{yacht.max_guests}</div>
                    <div className="text-xs text-charcoal-500">{locale === 'de' ? 'Max Gäste' : 'Max Guests'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-merriweather text-charcoal-800">{yacht.guest_cabins}</div>
                    <div className="text-xs text-charcoal-500">{locale === 'de' ? 'Kabinen' : 'Cabins'}</div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-charcoal-700">{locale === 'de' ? 'Professionelle Crew inklusive' : 'Professional crew included'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-charcoal-700">{locale === 'de' ? 'Persönlicher Concierge-Service' : 'Dedicated concierge support'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-charcoal-700">{locale === 'de' ? 'Flexible Routen' : 'Flexible itineraries'}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/inquire?type=yacht&yacht=${yacht.slug}`}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-white py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {locale === 'de' ? 'Charter anfragen' : 'Request Charter'}
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <p className="text-center text-charcoal-500 text-sm mt-4">
                  {locale === 'de' 
                    ? 'Persönliche Beratung & maßgeschneiderte Erlebnisse'
                    : 'Personal consultation & bespoke experiences'
                  }
                </p>

                <div className="border-t border-gray-100 pt-6 mt-6 space-y-3">
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
                  {locale === 'de' ? 'Mit Vertrauen chartern' : 'Charter with Confidence'}
                </p>
                <p className="text-white/60 text-sm">
                  {locale === 'de' ? 'Verifizierte Yacht & Crew' : 'Verified Yacht & Crew'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ========== PAIR WITH A VILLA SECTION ========== */}
      {yacht.relatedProperties?.length > 0 && (
        <section className="py-16 bg-charcoal-900">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-merriweather text-3xl text-white mb-3">
                {locale === 'de' ? 'Villa + Yacht Paket' : 'Pair With a Villa'}
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                {locale === 'de' 
                  ? 'Kombinieren Sie Ihren Yachtcharter mit einem luxuriösen Villenaufenthalt für das ultimative Erlebnis.'
                  : 'Combine your yacht charter with a luxury villa stay for the ultimate experience.'}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {yacht.relatedProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => setSelectedProperty(selectedProperty?.id === property.id ? null : property)}
                    className={`w-full text-left group rounded-xl overflow-hidden transition-all ${
                      selectedProperty?.id === property.id 
                        ? 'ring-2 ring-gold-500 bg-white/10' 
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={property.featured_image}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {selectedProperty?.id === property.id && (
                        <div className="absolute top-2 right-2 w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-merriweather text-lg text-white group-hover:text-gold-400 transition-colors">
                        {property.name}
                      </h3>
                      <p className="text-white/60 text-sm">{property.city}, {property.region}</p>
                      <div className="mt-2 flex items-center gap-3 text-white/50 text-xs">
                        <span>{property.bedrooms} {locale === 'de' ? 'Schlafzimmer' : 'bedrooms'}</span>
                        <span>•</span>
                        <span>{property.max_guests} {locale === 'de' ? 'Gäste' : 'guests'}</span>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Combined Inquiry CTA */}
            {selectedProperty && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gold-500/10 border border-gold-500/30 rounded-2xl p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <h3 className="text-white font-semibold text-xl mb-2">
                      {yacht.name} + {selectedProperty.name}
                    </h3>
                    <p className="text-white/70">
                      {locale === 'de' 
                        ? 'Das perfekte Kombinationspaket für Ihren Luxusurlaub'
                        : 'The perfect combination for your luxury vacation'}
                    </p>
                  </div>
                  <Link
                    href={`/inquire?type=combined&yacht=${yacht.slug}&property=${selectedProperty.slug}`}
                    className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    {locale === 'de' ? 'Kombianfrage stellen' : 'Request Combined Package'}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            )}

            {!selectedProperty && (
              <div className="text-center">
                <p className="text-white/50 text-sm mb-4">
                  {locale === 'de' 
                    ? 'Wählen Sie eine Villa oben aus, um ein Kombinationspaket anzufragen'
                    : 'Select a villa above to request a combined package'}
                </p>
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all border border-white/20"
                >
                  {locale === 'de' ? 'Alle Villen ansehen' : 'View All Villas'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========== MOBILE STICKY CTA ========== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-200 p-4 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-merriweather text-charcoal-900 font-semibold truncate">
              {yacht.name}
            </p>
            <p className="text-charcoal-500 text-sm">
              {yacht.manufacturer} {yacht.model}
            </p>
          </div>
          <Link
            href={`/inquire?type=yacht&yacht=${yacht.slug}`}
            className="btn-gold flex-shrink-0 flex items-center gap-2 !py-3 !px-6"
          >
            <Anchor className="w-4 h-4" />
            <span>{locale === 'de' ? 'Anfragen' : 'Inquire'}</span>
          </Link>
        </div>
      </div>

      {/* Spacer for mobile sticky bar */}
      <div className="h-20 lg:hidden" />

      {/* ========== FULLSCREEN GALLERY MODAL ========== */}
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
              {currentImageIndex + 1} / {allImages.length}
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
                  src={allImages[currentImageIndex]}
                  alt={`${yacht.name} - Photo ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain rounded-lg"
                />
              </motion.div>
            </div>

            {/* Thumbnails */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 max-w-[90vw] overflow-x-auto pb-2 px-4">
              {allImages.slice(0, 12).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`relative w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    i === currentImageIndex ? 'border-gold-500 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              {allImages.length > 12 && (
                <div className="flex-shrink-0 w-16 h-12 rounded-lg bg-white/20 flex items-center justify-center text-white text-sm font-medium">
                  +{allImages.length - 12}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
