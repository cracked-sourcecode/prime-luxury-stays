'use client'

import { motion } from 'framer-motion'
import { Anchor, Users, Ruler, Ship, ChevronRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from '@/lib/locale'

interface Yacht {
  id: number
  name: string
  slug: string
  manufacturer: string
  model: string
  year_built: number
  length_meters: number
  max_guests: number
  guest_cabins: number
  short_description: string
  featured_image: string
  is_featured: boolean
}

interface YachtWidgetProps {
  yachts: Yacht[]
  destination?: string
  variant?: 'light' | 'dark'
  showTitle?: boolean
}

export default function YachtWidget({ 
  yachts, 
  destination = 'Mallorca',
  variant = 'dark',
  showTitle = true 
}: YachtWidgetProps) {
  const { locale } = useLocale()

  if (!yachts || yachts.length === 0) return null

  const isDark = variant === 'dark'

  return (
    <section className={`py-16 md:py-24 ${isDark ? 'bg-charcoal-900' : 'bg-cream-50'}`}>
      <div className="max-w-7xl mx-auto px-6">
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className={`inline-flex items-center gap-2 ${isDark ? 'text-gold-400' : 'text-gold-600'} mb-4`}>
              <Anchor className="w-5 h-5" />
              <span className="text-sm font-medium tracking-widest uppercase">
                {locale === 'de' ? 'Yachtcharter' : 'Yacht Charter'}
              </span>
            </div>
            <h2 className={`font-merriweather text-3xl md:text-4xl ${isDark ? 'text-white' : 'text-charcoal-800'} mb-4`}>
              {locale === 'de' 
                ? `Erleben Sie ${destination} vom Wasser` 
                : `Experience ${destination} by Sea`
              }
            </h2>
            <p className={`${isDark ? 'text-white/70' : 'text-charcoal-600'} text-lg max-w-2xl mx-auto`}>
              {locale === 'de'
                ? 'Kombinieren Sie Ihren Villenaufenthalt mit einem exklusiven Yachtcharter.'
                : 'Combine your villa stay with an exclusive yacht charter experience.'
              }
            </p>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {yachts.slice(0, 3).map((yacht, index) => (
            <motion.div
              key={yacht.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/yachts/${yacht.slug}`}>
                <div className={`group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${isDark ? 'bg-white/5 border border-white/10 hover:bg-white/10' : 'bg-white'}`}>
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={yacht.featured_image || 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800'}
                      alt={yacht.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {yacht.is_featured && (
                      <div className="absolute top-4 left-4 bg-gold-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {locale === 'de' ? 'Empfohlen' : 'Featured'}
                      </div>
                    )}

                    {/* View button on hover */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span className="bg-white text-charcoal-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                        {locale === 'de' ? 'Details' : 'View'}
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className={`font-merriweather text-lg ${isDark ? 'text-white group-hover:text-gold-400' : 'text-charcoal-800 group-hover:text-gold-600'} transition-colors`}>
                          {yacht.name}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-white/60' : 'text-charcoal-500'}`}>
                          {yacht.manufacturer} {yacht.model}
                        </p>
                      </div>
                      {yacht.year_built && (
                        <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-white/10 text-white/70' : 'bg-cream-100 text-charcoal-600'}`}>
                          {yacht.year_built}
                        </span>
                      )}
                    </div>
                    
                    {/* Specs */}
                    <div className={`flex items-center gap-4 text-sm pt-3 border-t ${isDark ? 'border-white/10 text-white/60' : 'border-cream-200 text-charcoal-500'}`}>
                      <div className="flex items-center gap-1.5">
                        <Ruler className={`w-4 h-4 ${isDark ? 'text-gold-400' : 'text-gold-500'}`} />
                        <span>{yacht.length_meters}m</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className={`w-4 h-4 ${isDark ? 'text-gold-400' : 'text-gold-500'}`} />
                        <span>{yacht.max_guests} {locale === 'de' ? 'Gäste' : 'guests'}</span>
                      </div>
                      {yacht.guest_cabins && (
                        <div className="flex items-center gap-1.5">
                          <Ship className={`w-4 h-4 ${isDark ? 'text-gold-400' : 'text-gold-500'}`} />
                          <span>{yacht.guest_cabins}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            href="/yachts"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
              isDark 
                ? 'bg-gold-500 hover:bg-gold-600 text-white' 
                : 'bg-charcoal-800 hover:bg-charcoal-900 text-white'
            }`}
          >
            {locale === 'de' ? 'Alle Yachten ansehen' : 'View All Yachts'}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
