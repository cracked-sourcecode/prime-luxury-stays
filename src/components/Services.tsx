'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { 
  Shield, 
  Sparkles, 
  Car, 
  Plane,
  Utensils,
  Ship,
  Navigation,
  Building
} from 'lucide-react'
import { useLocale } from '@/i18n/LocaleProvider'

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useLocale()

  const services = [
    {
      icon: Utensils,
      title: t('services.items.tableReservations.title'),
      description: t('services.items.tableReservations.description'),
      slug: 'table-reservations',
    },
    {
      icon: Plane,
      title: t('services.items.privateAviation.title'),
      description: t('services.items.privateAviation.description'),
      slug: 'private-aviation',
    },
    {
      icon: Sparkles,
      title: t('services.items.privateChef.title'),
      description: t('services.items.privateChef.description'),
      slug: 'private-chef',
    },
    {
      icon: Car,
      title: t('services.items.luxuryTransport.title'),
      description: t('services.items.luxuryTransport.description'),
      slug: 'luxury-transport',
    },
    {
      icon: Building,
      title: t('services.items.travelBookings.title'),
      description: t('services.items.travelBookings.description'),
      slug: 'travel-bookings',
    },
    {
      icon: Shield,
      title: t('services.items.privacySecurity.title'),
      description: t('services.items.privacySecurity.description'),
      slug: 'privacy-security',
    },
    {
      icon: Ship,
      title: t('services.items.yachtCharter.title'),
      description: t('services.items.yachtCharter.description'),
      slug: 'yacht-charter',
    },
    {
      icon: Navigation,
      title: t('services.items.helicopter.title'),
      description: t('services.items.helicopter.description'),
      slug: 'helicopter',
    },
  ]

  return (
    <section id="services" ref={ref} className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-gold-600 text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            {t('services.subtitle')}
          </p>
          <h2 className="font-merriweather text-3xl md:text-4xl lg:text-5xl text-charcoal-900 mb-6">
            {t('services.title')}
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-gold-500 to-gold-300 rounded-full mx-auto mb-6" />
          <p className="text-charcoal-500 text-lg max-w-2xl mx-auto">
            {t('services.description')}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link 
                href={`/services/${service.slug}`}
                className="group relative block p-8 rounded-airbnb-lg glass-card float-card service-glow cursor-pointer h-full"
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-100 to-gold-50 flex items-center justify-center group-hover:from-gold-200 group-hover:to-gold-100 transition-all duration-500 shadow-sm">
                    <service.icon className="w-7 h-7 text-gold-600" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-merriweather text-xl text-charcoal-900 mb-3 group-hover:text-gold-700 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-charcoal-500 text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Hover accent */}
                <div className="absolute bottom-0 left-4 right-4 h-1 bg-gradient-to-r from-gold-400 to-gold-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
