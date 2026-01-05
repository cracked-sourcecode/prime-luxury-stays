'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, MapPin, Star, Home } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from '@/i18n/LocaleProvider'

// Mallorca regions with our properties
const mallorcaRegions = [
  {
    name: 'Southwest Coast',
    subtitle: 'Santa Ponsa & Calvià',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    description: 'Prestigious villas with Malgrats Islands views',
    properties: 3,
    slug: 'southwest',
  },
  {
    name: 'Port d\'Andratx',
    subtitle: 'Luxury Marina Town',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    description: 'Exclusive harbour-front estates with sunset views',
    properties: 2,
    slug: 'port-andratx',
  },
  {
    name: 'Alcudia',
    subtitle: 'Northern Paradise',
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
    description: 'Modern luxury in the exclusive Bonaire area',
    properties: 1,
    slug: 'alcudia',
  },
  {
    name: 'East Coast',
    subtitle: 'Cas Concos & Canyamel',
    image: 'https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=800&q=80',
    description: 'Authentic fincas with first-line sea access',
    properties: 1,
    slug: 'east-coast',
  },
]

// Ibiza highlights
const ibizaHighlights = [
  {
    name: 'San José',
    subtitle: 'Bohemian Luxury',
    image: 'https://storage.googleapis.com/primeluxurystays/Ibiza%20Photo.png',
    description: 'Stunning sunset villas with panoramic sea views',
  },
  {
    name: 'Santa Eulalia',
    subtitle: 'Family Paradise',
    image: 'https://storage.googleapis.com/primeluxurystays/villa-dos-torres/images/1766504261465-Outdoor1.jpg',
    description: 'Elegant estates near pristine beaches',
  },
]

export default function Destinations() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useLocale()

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
          {mallorcaRegions.map((region, index) => (
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

          {/* Ibiza Grid - 2 column featured layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ibizaHighlights.map((area, index) => (
              <motion.div
                key={area.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
              >
                <Link href="/ibiza" className="group block">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={area.image}
                      alt={area.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-white/80 text-sm font-medium mb-1">
                        {area.subtitle}
                      </p>
                      <h3 className="font-merriweather text-2xl md:text-3xl text-white mb-2">
                        {area.name}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {area.description}
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
