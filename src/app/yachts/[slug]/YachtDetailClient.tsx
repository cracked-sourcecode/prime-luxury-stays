'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Anchor, Users, Ruler, Calendar, ChevronLeft, ChevronRight, Ship, 
  Waves, Sparkles, ArrowRight, X, Check, Gauge, Settings, Droplets
} from 'lucide-react'
import Link from 'next/link'
import { useLocale } from '@/lib/locale'

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
  long_description: string
  cruising_speed_knots: number
  max_speed_knots: number
  has_stabilizers: boolean
  has_jet_ski: boolean
  has_tender: boolean
  has_water_toys: boolean
  water_toys_list: string[]
  has_jacuzzi: boolean
  has_gym: boolean
  has_wifi: boolean
  has_air_conditioning: boolean
  amenities: string[]
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
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const getLocalizedField = <K extends keyof Yacht>(field: K): string => {
    // For now yacht content is English only
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

  return (
    <div className="bg-cream-50 min-h-screen pt-20">
      {/* ========== HERO GALLERY ========== */}
      <section className="relative h-[60vh] md:h-[75vh] overflow-hidden">
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img
            src={allImages[currentImageIndex]}
            alt={yacht.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/20 to-transparent" />
        </motion.div>

        {/* Navigation arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image counter & gallery button */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
          <button
            onClick={() => setIsGalleryOpen(true)}
            className="bg-white/10 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/20 transition-all flex items-center gap-2 border border-white/20"
          >
            <span>{locale === 'de' ? 'Alle Fotos' : 'View All Photos'}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{allImages.length}</span>
          </button>
        </div>

        {/* Back button */}
        <Link
          href="/yachts"
          className="absolute top-24 left-6 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-all flex items-center gap-2 border border-white/20 z-10"
        >
          <ChevronLeft className="w-4 h-4" />
          {locale === 'de' ? 'Zurück' : 'Back'}
        </Link>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 bg-gold-500/90 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <Anchor className="w-4 h-4" />
                {yacht.manufacturer} {yacht.model}
              </div>
              <h1 className="font-merriweather text-4xl md:text-5xl lg:text-6xl text-white mb-2">
                {yacht.name}
              </h1>
              <p className="text-white/80 text-lg flex items-center gap-2">
                <Ship className="w-5 h-5" />
                {yacht.home_port || yacht.region}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== SPECS BAR ========== */}
      <section className="bg-charcoal-800 py-6 border-b border-charcoal-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center">
                <Ruler className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <div className="text-white font-medium">{yacht.length_meters}m</div>
                <div className="text-white/50 text-xs">{locale === 'de' ? 'Länge' : 'Length'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <div className="text-white font-medium">{yacht.max_guests}</div>
                <div className="text-white/50 text-xs">{locale === 'de' ? 'Gäste' : 'Guests'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center">
                <Ship className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <div className="text-white font-medium">{yacht.guest_cabins}</div>
                <div className="text-white/50 text-xs">{locale === 'de' ? 'Kabinen' : 'Cabins'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center">
                <Gauge className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <div className="text-white font-medium">{yacht.cruising_speed_knots} kn</div>
                <div className="text-white/50 text-xs">{locale === 'de' ? 'Geschwindigkeit' : 'Speed'}</div>
              </div>
            </div>
            {yacht.crew_members && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <div className="text-white font-medium">{yacht.crew_members}</div>
                  <div className="text-white/50 text-xs">{locale === 'de' ? 'Crew' : 'Crew'}</div>
                </div>
              </div>
            )}
            {yacht.year_built && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <div className="text-white font-medium">{yacht.year_built}</div>
                  <div className="text-white/50 text-xs">{locale === 'de' ? 'Baujahr' : 'Year'}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========== MAIN CONTENT ========== */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Description */}
            <div className="lg:col-span-2 space-y-12">
              {/* About */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-merriweather text-3xl text-charcoal-800 mb-6 flex items-center gap-3">
                  <Waves className="w-7 h-7 text-gold-500" />
                  {locale === 'de' ? 'Über diese Yacht' : 'About This Yacht'}
                </h2>
                <div className="prose prose-lg max-w-none text-charcoal-600">
                  <p className="whitespace-pre-wrap">{getLocalizedField('long_description')}</p>
                </div>
              </motion.div>

              {/* Technical Specs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h3 className="font-merriweather text-2xl text-charcoal-800 mb-6 flex items-center gap-3">
                  <Settings className="w-6 h-6 text-gold-500" />
                  {locale === 'de' ? 'Technische Daten' : 'Technical Specifications'}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-cream-200">
                      <span className="text-charcoal-500">{locale === 'de' ? 'Länge' : 'Length'}</span>
                      <span className="font-medium text-charcoal-800">{yacht.length_meters}m</span>
                    </div>
                    {yacht.beam_meters && (
                      <div className="flex justify-between py-2 border-b border-cream-200">
                        <span className="text-charcoal-500">{locale === 'de' ? 'Breite' : 'Beam'}</span>
                        <span className="font-medium text-charcoal-800">{yacht.beam_meters}m</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-cream-200">
                      <span className="text-charcoal-500">{locale === 'de' ? 'Baujahr' : 'Year Built'}</span>
                      <span className="font-medium text-charcoal-800">{yacht.year_built}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-cream-200">
                      <span className="text-charcoal-500">{locale === 'de' ? 'Gästekabinen' : 'Guest Cabins'}</span>
                      <span className="font-medium text-charcoal-800">{yacht.guest_cabins} en-suite</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {yacht.engines && (
                      <div className="flex justify-between py-2 border-b border-cream-200">
                        <span className="text-charcoal-500">{locale === 'de' ? 'Motoren' : 'Engines'}</span>
                        <span className="font-medium text-charcoal-800">{yacht.engines}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-cream-200">
                      <span className="text-charcoal-500">{locale === 'de' ? 'Reisegeschwindigkeit' : 'Cruising Speed'}</span>
                      <span className="font-medium text-charcoal-800">{yacht.cruising_speed_knots} knots</span>
                    </div>
                    {yacht.has_stabilizers && (
                      <div className="flex justify-between py-2 border-b border-cream-200">
                        <span className="text-charcoal-500">{locale === 'de' ? 'Stabilisatoren' : 'Stabilizers'}</span>
                        <span className="font-medium text-charcoal-800">{yacht.stabilizer_type || 'Yes'}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-cream-200">
                      <span className="text-charcoal-500">{locale === 'de' ? 'Crew' : 'Crew Members'}</span>
                      <span className="font-medium text-charcoal-800">{yacht.crew_members}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Water Toys */}
              {waterToys.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <h3 className="font-merriweather text-2xl text-charcoal-800 mb-6 flex items-center gap-3">
                    <Droplets className="w-6 h-6 text-gold-500" />
                    {locale === 'de' ? 'Wassersport' : 'Water Toys'}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {waterToys.map((toy: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-cream-50 rounded-xl">
                        <Check className="w-5 h-5 text-gold-500 flex-shrink-0" />
                        <span className="text-charcoal-700">{toy}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column - Inquiry Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-xl sticky top-28"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 text-gold-600 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-medium">{locale === 'de' ? 'Exklusiver Charter' : 'Exclusive Charter'}</span>
                  </div>
                  <h3 className="font-merriweather text-2xl text-charcoal-800">{yacht.name}</h3>
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

                {/* Amenities */}
                <div className="space-y-3 mb-6">
                  {yacht.has_wifi && (
                    <div className="flex items-center gap-2 text-charcoal-600">
                      <Check className="w-4 h-4 text-gold-500" />
                      <span className="text-sm">WiFi</span>
                    </div>
                  )}
                  {yacht.has_air_conditioning && (
                    <div className="flex items-center gap-2 text-charcoal-600">
                      <Check className="w-4 h-4 text-gold-500" />
                      <span className="text-sm">{locale === 'de' ? 'Klimaanlage' : 'Air Conditioning'}</span>
                    </div>
                  )}
                  {yacht.has_jacuzzi && (
                    <div className="flex items-center gap-2 text-charcoal-600">
                      <Check className="w-4 h-4 text-gold-500" />
                      <span className="text-sm">Jacuzzi</span>
                    </div>
                  )}
                  {yacht.has_stabilizers && (
                    <div className="flex items-center gap-2 text-charcoal-600">
                      <Check className="w-4 h-4 text-gold-500" />
                      <span className="text-sm">{locale === 'de' ? 'Stabilisatoren' : 'Stabilizers'}</span>
                    </div>
                  )}
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
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== RELATED PROPERTIES ========== */}
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
                {locale === 'de' ? 'Passende Villen' : 'Pair With a Villa'}
              </h2>
              <p className="text-white/70">
                {locale === 'de' 
                  ? 'Kombinieren Sie Ihren Yachtcharter mit einem luxuriösen Aufenthalt.'
                  : 'Combine your yacht charter with a luxurious stay.'
                }
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {yacht.relatedProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/properties/${property.slug}`}>
                    <div className="group bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={property.featured_image}
                          alt={property.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-merriweather text-lg text-white group-hover:text-gold-400 transition-colors">
                          {property.name}
                        </h3>
                        <p className="text-white/60 text-sm">{property.city}, {property.region}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== FULLSCREEN GALLERY MODAL ========== */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setIsGalleryOpen(false)}
          >
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prevImage() }}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage() }}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={allImages[currentImageIndex]}
              alt={`${yacht.name} - Image ${currentImageIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
