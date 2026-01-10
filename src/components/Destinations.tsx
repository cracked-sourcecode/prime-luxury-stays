'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useMemo } from 'react'
import { ArrowRight, MapPin, Star, Home } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from '@/i18n/LocaleProvider'
import type { Property } from '@/lib/properties'

interface DestinationsProps {
  properties?: Property[]
}

// Region zone definitions with static images
const regionZones = [
  {
    id: 'west-southwest',
    image: 'https://storage.googleapis.com/primeluxurystays/villa-del-mar/images/1767466932071-Kopie_von_2c3d6789-1a64-492e-895a-1d13fcbd9aea_result_22.48.41.webp',
  },
  {
    id: 'port-andratx',
    image: 'https://storage.googleapis.com/primeluxurystays/sunset-dreams/images/1767546840732-PROTEA32_result_22.48.12.webp',
  },
  {
    id: 'north-northwest',
    image: 'https://storage.googleapis.com/primeluxurystays/la-salve/images/1766937633626-ls17-602-marcgilsdorf_result_12.40.11.webp',
  },
  {
    id: 'east-southeast',
    image: 'https://storage.googleapis.com/primeluxurystays/eden-roc/images/1766935948675-MR20230606066_result_12.38.51.webp',
  },
]

// Mallorca regions with dynamic property counts
const getMallorcaRegions = (t: (key: string) => string, propertyCounts: Record<string, number>) => [
  {
    name: t('destinations.mallorca.regions.westSouthwest.name'),
    subtitle: t('destinations.mallorca.regions.westSouthwest.subtitle'),
    image: regionZones[0].image,
    description: t('destinations.mallorca.regions.westSouthwest.description'),
    properties: propertyCounts['west-southwest'] || 0,
    slug: 'west-southwest',
  },
  {
    name: t('destinations.mallorca.regions.portAndratx.name'),
    subtitle: t('destinations.mallorca.regions.portAndratx.subtitle'),
    image: regionZones[1].image,
    description: t('destinations.mallorca.regions.portAndratx.description'),
    properties: propertyCounts['port-andratx'] || 0,
    slug: 'port-andratx',
  },
  {
    name: t('destinations.mallorca.regions.northNorthwest.name'),
    subtitle: t('destinations.mallorca.regions.northNorthwest.subtitle'),
    image: regionZones[2].image,
    description: t('destinations.mallorca.regions.northNorthwest.description'),
    properties: propertyCounts['north-northwest'] || 0,
    slug: 'north-northwest',
  },
  {
    name: t('destinations.mallorca.regions.eastSoutheast.name'),
    subtitle: t('destinations.mallorca.regions.eastSoutheast.subtitle'),
    image: regionZones[3].image,
    description: t('destinations.mallorca.regions.eastSoutheast.description'),
    properties: propertyCounts['east-southeast'] || 0,
    slug: 'east-southeast',
  },
]

// Ibiza highlights - Es Cubells area + Villa Dos Torres property
const getIbizaHighlights = (t: (key: string) => string) => [
  {
    name: 'Es Cubells',
    subtitle: t('destinations.ibiza.highlights.esCubells.subtitle'),
    image: 'https://storage.googleapis.com/primeluxurystays/Ibiza%20Photo.png',
    description: t('destinations.ibiza.highlights.esCubells.description'),
    isArea: true,
  },
  {
    name: 'Villa Dos Torres',
    subtitle: t('destinations.ibiza.highlights.villaDostorres.subtitle'),
    image: 'https://storage.googleapis.com/primeluxurystays/villa-dos-torres/images/1766504261465-Outdoor1.jpg',
    description: t('destinations.ibiza.highlights.villaDostorres.description'),
    isArea: false,
    slug: 'villa-dos-torres',
  },
]

export default function Destinations({ properties = [] }: DestinationsProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useLocale()

  // Calculate property counts by region_zone
  const propertyCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    // Only count Mallorca properties
    const mallorcaProperties = properties.filter(p => p.region === 'Mallorca')
    mallorcaProperties.forEach(property => {
      if (property.region_zone) {
        counts[property.region_zone] = (counts[property.region_zone] || 0) + 1
      }
    })
    return counts
  }, [properties])

  return (
    <section id="destinations" ref={ref} className="py-16 lg:py-20 pattern-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-gold-500" />
                <p className="text-gold-600 text-sm font-semibold tracking-[0.2em] uppercase">
                  {t('destinations.mallorca.location')}
                </p>
              </div>
              <h2 className="font-merriweather text-3xl md:text-4xl lg:text-5xl text-charcoal-900">
                {t('destinations.mallorca.title')}
              </h2>
              <p className="text-charcoal-500 mt-3 max-w-xl">
                {t('destinations.mallorca.description')}
              </p>
            </div>
            <Link 
              href="/mallorca" 
              className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium transition-colors group"
            >
              {t('destinations.mallorca.viewAll')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* Regions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getMallorcaRegions(t, propertyCounts).map((region, index) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href="/mallorca" className="group block">
                {/* Image Container */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 shadow-lg">
                  <img
                    src={region.image}
                    alt={region.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Properties count badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-gold-600" />
                    <span className="text-charcoal-900 text-sm font-semibold">
                      {region.properties} {region.properties === 1 ? 'property' : 'properties'}
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-white/80 text-sm font-medium mb-1">
                      {region.subtitle}
                    </p>
                    <h3 className="font-merriweather text-2xl text-white mb-2">
                      {region.name}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {region.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mallorca CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-gold-500 to-gold-600 rounded-3xl p-8 md:p-12 text-center"
        >
          <h3 className="font-merriweather text-2xl md:text-3xl text-white mb-4">
            {t('destinations.mallorca.cta.title')}
          </h3>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            {t('destinations.mallorca.cta.description')}
          </p>
          <Link href="/mallorca" className="inline-flex items-center gap-2 bg-white text-gold-600 px-8 py-4 rounded-xl font-semibold hover:bg-cream-50 transition-colors">
            {t('destinations.mallorca.cta.button')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* ========== IBIZA SECTION ========== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24"
        >
          {/* Ibiza Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-gold-500" />
                <p className="text-gold-600 text-sm font-semibold tracking-[0.2em] uppercase">
                  {t('destinations.ibiza.location')}
                </p>
              </div>
              <h2 className="font-merriweather text-3xl md:text-4xl lg:text-5xl text-charcoal-900">
                {t('destinations.ibiza.title')}
              </h2>
              <p className="text-charcoal-500 mt-3 max-w-xl">
                {t('destinations.ibiza.description')}
              </p>
            </div>
            <Link 
              href="/ibiza" 
              className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium transition-colors group"
            >
              {t('destinations.ibiza.viewAll')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Ibiza Grid - Es Cubells area + Villa Dos Torres side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {getIbizaHighlights(t).map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
              >
                <Link href={item.isArea ? "/ibiza" : `/properties/${item.slug}`} className="group block">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-gold-400 text-sm font-semibold tracking-wider uppercase mb-1">
                        {item.subtitle}
                      </p>
                      <h3 className="font-merriweather text-2xl md:text-3xl text-white mb-2">
                        {item.name}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Ibiza CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-12 bg-charcoal-900 rounded-3xl p-8 md:p-12 text-center"
          >
            <h3 className="font-merriweather text-2xl md:text-3xl text-white mb-4">
              {t('destinations.ibiza.cta.title')}
            </h3>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              {t('destinations.ibiza.cta.description')}
            </p>
            <Link href="/ibiza" className="inline-flex items-center gap-2 bg-gold-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gold-600 transition-colors">
              {t('destinations.ibiza.cta.button')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
