'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { 
  MapPin, 
  Sun, 
  Waves, 
  Mountain, 
  Wine, 
  Anchor,
  Star,
  ArrowRight,
  Bed,
  Bath,
  Users,
  Calendar,
  ChevronDown,
  Sparkles,
  Shield,
  Clock,
  Heart
} from 'lucide-react'
import PropertyMap from '@/components/PropertyMap'
import OtherDestinations from '@/components/OtherDestinations'
import type { Property } from '@/lib/properties'
import { useLocale } from '@/i18n/LocaleProvider'

interface MallorcaClientProps {
  properties: Property[];
}

// Helper to get localized property field
function getLocalizedField(property: Property, field: 'name' | 'short_description' | 'description' | 'house_type', locale: string): string {
  if (locale === 'de') {
    const deField = property[`${field}_de` as keyof Property] as string | null
    if (deField) return deField
  }
  return (property[field] as string) || ''
}

export default function MallorcaClient({ properties }: MallorcaClientProps) {
  const { t, locale } = useLocale()
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  
  // Separate short-term and monthly rentals
  const shortTermProperties = properties.filter(p => !p.is_monthly_rental)
  const monthlyRentals = properties.filter(p => p.is_monthly_rental)
  const heroCandidates = [
    'https://storage.googleapis.com/primeluxurystays/Mallorca%20page%20Hero%20Section.png',
  ]
  const [heroImageUrl, setHeroImageUrl] = useState(heroCandidates[0])
  const [heroTryIndex, setHeroTryIndex] = useState(0)

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    // Reset hero image if the candidates ever change
    setHeroImageUrl(heroCandidates[0])
    setHeroTryIndex(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleHeroImageError = () => {
    const nextIndex = heroTryIndex + 1
    if (nextIndex < heroCandidates.length) {
      setHeroTryIndex(nextIndex)
      setHeroImageUrl(heroCandidates[nextIndex])
    }
  }

  return (
    <div className="overflow-hidden">
      {/* ========== CINEMATIC HERO ========== */}
      <section ref={heroRef} className="relative h-screen min-h-[800px]">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          {/* Background image */}
          <img
            key={heroImageUrl}
            src={heroImageUrl}
            alt="Mallorca"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            onError={handleHeroImageError}
          />
          {/* Contrast overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-charcoal-900" />
        </motion.div>
        
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="max-w-5xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="inline-flex items-center gap-2 bg-gold-500/20 backdrop-blur-md text-gold-300 px-6 py-3 rounded-full mb-8 border border-gold-400/30"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">{t('pages.mallorca.badge')}</span>
            </motion.div>
            
            <h1 className="font-merriweather text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-[0.95]">
              Mallorca
            </h1>
            
            <p className="text-white/80 text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              {t('pages.mallorca.heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <a href="#villas" className="btn-gold text-base px-10 py-5 flex items-center gap-2">
                <span>{t('pages.mallorca.exploreVillas')}</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <Link href="/#contact" className="bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20">
                {t('pages.mallorca.requestInfo')}
              </Link>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-12"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-3 text-white/60"
            >
              <span className="text-xs tracking-[0.3em] uppercase">{t('pages.mallorca.discoverMore')}</span>
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ========== BROWSE BY REGION ========== */}
      <section className="relative z-20 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-gold-600 text-sm font-semibold tracking-[0.3em] uppercase mb-5">
              {locale === 'de' ? 'Nach Region Entdecken' : 'Explore by Region'}
            </p>
            <h2 className="font-merriweather text-3xl md:text-4xl lg:text-5xl text-charcoal-900 mb-6">
              {locale === 'de' ? 'Finden Sie Ihre Perfekte Lage' : 'Find Your Perfect Location'}
            </h2>
            <p className="text-charcoal-500 text-lg max-w-2xl mx-auto">
              {locale === 'de' 
                ? 'Von der dramatischen Westküste bis zu den ruhigen Stränden des Nordens – jede Region Mallorcas hat ihren eigenen Charakter.' 
                : 'From the dramatic west coast to the tranquil beaches of the north, each region of Mallorca has its own distinct character.'}
            </p>
          </motion.div>

          {/* Region Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                name: locale === 'de' ? 'West / Südwest' : 'West / Southwest',
                subtitle: 'Santa Ponsa, Calvià, Bendinat',
                image: 'https://storage.googleapis.com/primeluxurystays/villa-del-mar/images/1767466932071-Kopie_von_2c3d6789-1a64-492e-895a-1d13fcbd9aea_result_22.48.41.webp',
                zone: 'west-southwest',
                count: properties.filter(p => p.region_zone === 'west-southwest').length
              },
              {
                name: "Port d'Andratx",
                subtitle: locale === 'de' ? 'Luxuriöse Hafenstadt' : 'Luxury Marina Town',
                image: 'https://storage.googleapis.com/primeluxurystays/sunset-dreams/images/1767546840732-PROTEA32_result_22.48.12.webp',
                zone: 'port-andratx',
                count: properties.filter(p => p.region_zone === 'port-andratx').length
              },
              {
                name: locale === 'de' ? 'Nord / Nordwest' : 'North / Northwest',
                subtitle: 'Pollensa, Alcudia, Sa Pobla',
                image: 'https://storage.googleapis.com/primeluxurystays/la-salve/images/1766937633626-ls17-602-marcgilsdorf_result_12.40.11.webp',
                zone: 'north-northwest',
                count: properties.filter(p => p.region_zone === 'north-northwest').length
              },
              {
                name: locale === 'de' ? 'Ost / Südost' : 'East / Southeast',
                subtitle: 'Canyamel, Ses Salines, S\'Horta',
                image: 'https://storage.googleapis.com/primeluxurystays/eden-roc/images/1766935948675-MR20230606066_result_12.38.51.webp',
                zone: 'east-southeast',
                count: properties.filter(p => p.region_zone === 'east-southeast').length
              },
            ].map((region, index) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => {
                  const villasSection = document.getElementById('villas')
                  villasSection?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={region.image}
                    alt={region.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Property Count Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-charcoal-900 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                    <MapPin className="w-4 h-4 text-gold-500" />
                    {region.count} {region.count === 1 ? (locale === 'de' ? 'Immobilie' : 'property') : (locale === 'de' ? 'Immobilien' : 'properties')}
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-gold-400 text-xs font-semibold tracking-[0.15em] uppercase mb-2">
                      {region.subtitle}
                    </p>
                    <h3 className="font-merriweather text-xl text-white mb-2">
                      {region.name}
                    </h3>
                    <div className="flex items-center gap-2 text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>{locale === 'de' ? 'Immobilien ansehen' : 'View properties'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { value: properties.length, label: locale === 'de' ? 'Luxusimmobilien' : 'Luxury Properties' },
              { value: '4', label: locale === 'de' ? 'Regionen' : 'Regions' },
              { value: '300+', label: locale === 'de' ? 'Sonnentage/Jahr' : 'Sunny Days/Year' },
              { value: '24/7', label: locale === 'de' ? 'Concierge-Service' : 'Concierge Support' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-6 bg-cream-50 rounded-2xl">
                <div className="font-merriweather text-3xl md:text-4xl text-gold-600 mb-2">{stat.value}</div>
                <div className="text-charcoal-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== THE PROMISE - WHAT WE OFFER ========== */}
      <section className="relative z-20 py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-gold-600 text-sm font-semibold tracking-[0.3em] uppercase mb-5">
                {t('pages.mallorca.difference')}
              </p>
              <h2 className="font-merriweather text-3xl md:text-4xl lg:text-5xl text-charcoal-900 mb-8 leading-tight">
                {t('pages.mallorca.diffTitle1')}
                <br />
                <span className="text-gold-600">{t('pages.mallorca.diffTitle2')}</span>
              </h2>
              <p className="text-charcoal-500 text-xl mb-10 leading-relaxed">
                {t('pages.mallorca.diffDesc')}
              </p>

              <div className="space-y-6">
                {[
                  { icon: Shield, title: 'Verified Excellence', desc: 'Every villa personally inspected by our team' },
                  { icon: Clock, title: 'Dedicated Concierge', desc: 'Personal support from booking to checkout' },
                  { icon: Heart, title: 'Curated Experiences', desc: 'Private chefs, yacht charters, exclusive access' },
                  { icon: Star, title: 'Best Price Guarantee', desc: 'Direct booking means no middleman markups' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-5"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-100 to-gold-50 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-7 h-7 text-gold-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal-900 text-lg mb-1">{item.title}</h4>
                      <p className="text-charcoal-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80"
                  alt="Luxury Villa"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== WHY MALLORCA - VISUAL STORY ========== */}
      <section className="relative z-20 py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-gold-600 text-sm font-semibold tracking-[0.3em] uppercase mb-5">
              {locale === 'de' ? 'Die Insel' : 'The Island'}
            </p>
            <h2 className="font-merriweather text-4xl md:text-5xl lg:text-6xl text-charcoal-900 mb-6">
              {locale === 'de' ? 'Warum die Elite der Welt' : "Why the World's Elite"}
              <br />
              <span className="text-gold-600">{locale === 'de' ? 'Mallorca wählt' : 'Choose Mallorca'}</span>
            </h2>
          </div>

          {/* Immersive Bento Grid */}
          <div className="grid grid-cols-12 gap-5 auto-rows-[200px]">
            {/* Large Feature - Beaches */}
            <div className="col-span-12 md:col-span-8 row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer">
              <img 
                src="https://storage.googleapis.com/primeluxurystays/eden-roc/images/1766935948675-MR20230606066_result_12.38.51.webp"
                alt="Luxury Villa with Mediterranean Views"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <div className="flex items-center gap-3 text-gold-400 mb-4">
                  <Waves className="w-6 h-6" />
                  <span className="text-sm font-semibold tracking-[0.2em] uppercase">{locale === 'de' ? '262 Strände' : '262 Beaches'}</span>
                </div>
                <h3 className="font-merriweather text-3xl md:text-4xl text-white mb-4">
                  {locale === 'de' ? 'Kristallklares Mittelmeer' : 'Crystal Clear Mediterranean'}
                </h3>
                <p className="text-white/70 text-lg max-w-xl">
                  {locale === 'de' 
                    ? 'Von versteckten Buchten bis zu unberührten Sandstränden – entdecken Sie Wasser so klar, dass Sie 30 Meter tief sehen können.'
                    : 'From hidden coves to pristine sandy beaches, discover waters so clear you\'ll see the bottom 30 meters down.'}
                </p>
              </div>
            </div>

            {/* Mountains */}
            <div className="col-span-12 md:col-span-4 row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer">
              <img 
                src="https://storage.googleapis.com/primeluxurystays/la-salve/images/1766937633626-ls17-602-marcgilsdorf_result_12.40.11.webp"
                alt="Serra de Tramuntana Views"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-gold-400 mb-2">
                  <Mountain className="w-5 h-5" />
                  <span className="text-xs font-semibold tracking-[0.15em] uppercase">UNESCO {locale === 'de' ? 'Welterbe' : 'Heritage'}</span>
                </div>
                <h3 className="font-merriweather text-xl text-white">
                  Serra de Tramuntana
                </h3>
              </div>
            </div>

            {/* Gastronomy */}
            <div className="col-span-6 md:col-span-4 row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer">
              <img 
                src="https://storage.googleapis.com/primeluxurystays/finca-es-boscarro/images/1767026970427-Finca_Can_Lau_Santa_Margalida_Web-47.jpg"
                alt="Outdoor Dining Experience"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-gold-400 mb-2">
                  <Wine className="w-5 h-5" />
                  <span className="text-xs font-semibold tracking-[0.15em] uppercase">{locale === 'de' ? 'Michelin Sterne' : 'Michelin Stars'}</span>
                </div>
                <h3 className="font-merriweather text-xl text-white">
                  {locale === 'de' ? 'Weltklasse Gastronomie' : 'World-Class Dining'}
                </h3>
              </div>
            </div>

            {/* Yachts */}
            <div className="col-span-6 md:col-span-4 row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer">
              <img 
                src="https://storage.googleapis.com/primeluxurystays/vista-malgrat/images/1765716769743-_DSC4663.jpg"
                alt="Coastal Living"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-gold-400 mb-2">
                  <Anchor className="w-5 h-5" />
                  <span className="text-xs font-semibold tracking-[0.15em] uppercase">{locale === 'de' ? 'Nautisches Paradies' : 'Nautical Paradise'}</span>
                </div>
                <h3 className="font-merriweather text-xl text-white">
                  {locale === 'de' ? 'Erstklassige Yachthäfen' : 'Premier Marinas'}
                </h3>
              </div>
            </div>

            {/* Sunshine */}
            <div className="col-span-12 md:col-span-4 row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer">
              <img 
                src="https://storage.googleapis.com/primeluxurystays/4-elements/images/1766934271401-New_built_villa_Alcudia_ref_7724_-_night_shots_-_-2_result_12.32.15.webp"
                alt="Villa at Sunset"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-gold-400 mb-2">
                  <Sun className="w-5 h-5" />
                  <span className="text-xs font-semibold tracking-[0.15em] uppercase">{locale === 'de' ? '300+ Tage / Jahr' : '300+ Days / Year'}</span>
                </div>
                <h3 className="font-merriweather text-xl text-white">
                  {locale === 'de' ? 'Endloser Sonnenschein' : 'Endless Sunshine'}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PROPERTIES SHOWCASE ========== */}
      <section id="villas" className="relative z-20 bg-cream-50 pt-32 pb-28 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-gold-600 text-sm font-semibold tracking-[0.3em] uppercase mb-5">
              {locale === 'de' ? 'Unsere Kollektion' : 'Our Collection'}
            </p>
            <h2 className="font-merriweather text-4xl md:text-5xl lg:text-6xl text-charcoal-900 mb-6">
              {locale === 'de' ? 'Handverlesene Luxusvillen' : 'Handpicked Luxury Villas'}
            </h2>
            <p className="text-charcoal-500 text-xl max-w-3xl mx-auto">
              {locale === 'de' 
                ? 'Jede Immobilie wird persönlich geprüft, um sicherzustellen, dass sie unseren hohen Standards entspricht. Dies sind nicht nur Häuser – es sind Erlebnisse, die darauf warten, entdeckt zu werden.'
                : 'Each property personally vetted to ensure it meets our exacting standards. These aren\'t just houses—they\'re experiences waiting to unfold.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {shortTermProperties.map((property) => (
              <div key={property.id}>
                <Link href={`/properties/${property.slug}`} className="group block">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-xl">
                    <img
                      src={property.featured_image || ''}
                      alt={getLocalizedField(property, 'name', locale)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {property.is_featured && (
                      <div className="absolute top-5 left-5 bg-gold-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                        <Star className="w-4 h-4 fill-white" />
                        {locale === 'de' ? 'Empfohlen' : 'Featured'}
                      </div>
                    )}

                    <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-sm text-charcoal-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      {getLocalizedField(property, 'house_type', locale)}
                    </div>

                    {/* Quick stats on hover */}
                    <div className="absolute bottom-5 left-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl px-5 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-5 text-charcoal-700">
                          <span className="flex items-center gap-2">
                            <Bed className="w-5 h-5" /> {property.bedrooms}
                          </span>
                          <span className="flex items-center gap-2">
                            <Bath className="w-5 h-5" /> {property.bathrooms}
                          </span>
                          <span className="flex items-center gap-2">
                            <Users className="w-5 h-5" /> {property.max_guests}
                          </span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gold-500" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-charcoal-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 text-gold-500" />
                    <span>{property.city}, Mallorca</span>
                  </div>

                  <h3 className="font-merriweather text-2xl text-charcoal-900 mb-3 group-hover:text-gold-600 transition-colors">
                    {getLocalizedField(property, 'name', locale)}
                  </h3>

                  <p className="text-charcoal-500 leading-relaxed mb-3">
                    {getLocalizedField(property, 'short_description', locale)}
                  </p>

                  {/* Price */}
                  {(property as any).price_per_week && (
                    <div className="inline-flex items-baseline gap-1 bg-cream-100 border border-cream-200 rounded-lg px-3 py-1.5">
                      <span className="text-gold-700 font-semibold">
                        €{Number((property as any).price_per_week).toLocaleString()}
                        {(property as any).price_per_week_high && (
                          <span> - €{Number((property as any).price_per_week_high).toLocaleString()}</span>
                        )}
                      </span>
                      <span className="text-charcoal-500 text-sm">{locale === 'de' ? '/Woche' : '/week'}</span>
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== MONTHLY RENTALS SECTION ========== */}
      {monthlyRentals.length > 0 && (
        <section className="relative z-20 bg-white py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Calendar className="w-4 h-4" />
                {locale === 'de' ? 'Langzeitvermietung' : 'Long-Term Rentals'}
              </div>
              <h2 className="font-merriweather text-4xl md:text-5xl text-charcoal-900 mb-6">
                {locale === 'de' ? 'Monatliche Vermietungen' : 'Monthly Rentals'}
              </h2>
              <p className="text-charcoal-500 text-xl max-w-3xl mx-auto">
                {locale === 'de' 
                  ? 'Perfekt für längere Aufenthalte. Diese Immobilien sind ausschließlich für monatliche Vermietungen verfügbar.'
                  : 'Perfect for extended stays. These properties are available exclusively for monthly rentals.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {monthlyRentals.map((property) => (
                <motion.div 
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/properties/${property.slug}`} className="group block">
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 shadow-xl">
                      <img
                        src={property.featured_image || ''}
                        alt={getLocalizedField(property, 'name', locale)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="absolute top-5 left-5 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                        <Calendar className="w-4 h-4" />
                        {locale === 'de' ? 'Monatlich' : 'Monthly'}
                      </div>

                      <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-sm text-charcoal-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        {getLocalizedField(property, 'house_type', locale)}
                      </div>

                      {/* Quick stats on hover */}
                      <div className="absolute bottom-5 left-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl px-5 py-4 flex items-center justify-between">
                          <div className="flex items-center gap-5 text-charcoal-700">
                            <span className="flex items-center gap-2">
                              <Bed className="w-5 h-5" /> {property.bedrooms}
                            </span>
                            <span className="flex items-center gap-2">
                              <Bath className="w-5 h-5" /> {property.bathrooms}
                            </span>
                            <span className="flex items-center gap-2">
                              <Users className="w-5 h-5" /> {property.max_guests}
                            </span>
                          </div>
                          <ArrowRight className="w-5 h-5 text-blue-500" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-charcoal-500 text-sm mb-3">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>{property.city}, Mallorca</span>
                    </div>

                    <h3 className="font-merriweather text-2xl text-charcoal-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {getLocalizedField(property, 'name', locale)}
                    </h3>

                    <p className="text-charcoal-500 leading-relaxed mb-4">
                      {getLocalizedField(property, 'short_description', locale)}
                    </p>

                    <div className="inline-flex items-center gap-2 text-blue-600 font-semibold">
                      {locale === 'de' ? 'Anfrage für monatliche Vermietung' : 'Inquire for Monthly Rates'}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-charcoal-500 text-sm">
                {locale === 'de' 
                  ? '* Monatliche Vermietungen unterliegen den spanischen Langzeitmietgesetzen.'
                  : '* Monthly rentals are subject to Spanish long-term rental regulations.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ========== PROPERTIES MAP SECTION ========== */}
      <section className="py-20 bg-cream-50 relative z-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-gold-600 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
              {locale === 'de' ? 'Interaktive Karte' : 'Interactive Map'}
            </p>
            <h2 className="font-merriweather text-3xl md:text-4xl text-charcoal-900 mb-4">
              {locale === 'de' ? 'Entdecken Sie Unsere Standorte' : 'Discover Our Locations'}
            </h2>
            <p className="text-charcoal-500 text-lg max-w-2xl mx-auto">
              {locale === 'de' 
                ? 'Wählen Sie eine Immobilie aus der Liste, um den Standort zu sehen' 
                : 'Select a property from the list to view its location'}
            </p>
          </motion.div>

          {/* Map Container */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="h-[600px]">
              <PropertyMap 
                properties={properties}
                selectedProperty={selectedProperty}
                onPropertySelect={setSelectedProperty}
                locale={locale}
                center={[39.6, 2.9]}
                zoom={9}
              />
            </div>
          </div>

          {/* Selected Property CTA */}
          {selectedProperty && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex justify-center"
            >
              <Link 
                href={`/properties/${selectedProperty.slug}`}
                className="bg-gold-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gold-600 transition-colors inline-flex items-center gap-3 shadow-lg"
              >
                {locale === 'de' ? 'Details ansehen:' : 'View Details:'} {getLocalizedField(selectedProperty, 'name', locale)}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* ========== OTHER DESTINATIONS ========== */}
      <OtherDestinations currentDestination="mallorca" />

      {/* ========== FINAL CTA ========== */}
      <section className="relative py-28 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://storage.googleapis.com/primeluxurystays/Mallorca%20page%20Hero%20Section.png')`,
          }}
        />
        <div className="absolute inset-0 bg-charcoal-900/80" />
        
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Sparkles className="w-10 h-10 text-gold-400 mx-auto mb-8" />
            
            <h2 className="font-merriweather text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
              {locale === 'de' ? 'Ihr Mediterraner Traum' : 'Your Mediterranean Dream'}
              <br />
              <span className="text-gold-400">{locale === 'de' ? 'Beginnt Hier' : 'Starts Here'}</span>
            </h2>
            <p className="text-white/70 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
              {locale === 'de' 
                ? 'Lassen Sie unser Concierge-Team den perfekten mallorquinischen Urlaub für Sie gestalten. Direktbuchung. Exklusive Immobilien. Unvergessliche Erlebnisse.' 
                : 'Let our concierge team craft the perfect Mallorcan escape. Direct booking. Exclusive properties. Unforgettable experiences.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link 
                href="/#contact" 
                className="btn-gold text-lg px-12 py-5 flex items-center gap-3"
              >
                <Calendar className="w-5 h-5" />
                {locale === 'de' ? 'Ihre Villa Anfragen' : 'Request Your Villa'}
              </Link>
              <a href="tel:+34634306076" className="text-white/70 hover:text-white transition-colors text-lg">
                {locale === 'de' ? 'oder anrufen' : 'or call'} <span className="text-gold-400 font-semibold">+34 634 306 076</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
