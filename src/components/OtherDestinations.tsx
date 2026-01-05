'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleProvider'

interface OtherDestinationsProps {
  currentDestination: 'mallorca' | 'ibiza' | 'south-of-france'
}

const destinations = [
  {
    id: 'mallorca',
    name: 'Mallorca',
    image: 'https://storage.googleapis.com/primeluxurystays/Mallorca%20page%20Hero%20Section.png',
    href: '/mallorca',
  },
  {
    id: 'ibiza',
    name: 'Ibiza',
    image: 'https://storage.googleapis.com/primeluxurystays/Ibiza%20Photo.png',
    href: '/ibiza',
  },
  {
    id: 'south-of-france',
    name: 'South of France',
    nameDe: 'Südfrankreich',
    image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80',
    href: '/south-of-france',
  },
]

export default function OtherDestinations({ currentDestination }: OtherDestinationsProps) {
  const { t, locale } = useLocale()
  
  const otherDestinations = destinations.filter(d => d.id !== currentDestination)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold-600 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            {locale === 'de' ? 'Mehr Entdecken' : 'Explore More'}
          </p>
          <h2 className="font-merriweather text-3xl md:text-4xl text-charcoal-900 mb-4">
            {locale === 'de' ? 'Weitere Reiseziele' : 'Other Destinations'}
          </h2>
          <p className="text-charcoal-500 text-lg max-w-2xl mx-auto">
            {locale === 'de' 
              ? 'Entdecken Sie unsere exklusiven Luxusimmobilien an weiteren traumhaften Standorten' 
              : 'Discover our exclusive luxury properties in other stunning locations'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {otherDestinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={destination.href} className="group block">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 text-gold-400 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {locale === 'de' ? 'Luxusimmobilien' : 'Luxury Properties'}
                      </span>
                    </div>
                    <h3 className="font-merriweather text-2xl md:text-3xl text-white mb-3">
                      {locale === 'de' && destination.nameDe ? destination.nameDe : destination.name}
                    </h3>
                    <div className="flex items-center gap-2 text-white/80 group-hover:text-gold-400 transition-colors">
                      <span className="text-sm font-medium">
                        {locale === 'de' ? 'Erkunden' : 'Explore'}
                      </span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Destinations Button */}
        <div className="text-center">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-3 bg-charcoal-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-charcoal-800 transition-colors"
          >
            {locale === 'de' ? 'Alle Reiseziele Ansehen' : 'View All Destinations'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

