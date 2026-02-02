'use client'

import { motion } from 'framer-motion'
import { Anchor, Users, Ruler, Ship, ChevronRight, Sparkles, ArrowRight, Waves } from 'lucide-react'
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

interface YachtsSectionProps {
  yachts: Yacht[]
}

export default function YachtsSection({ yachts }: YachtsSectionProps) {
  const { locale } = useLocale()

  if (!yachts || yachts.length === 0) return null

  return (
    <section className="py-24 md:py-32 bg-charcoal-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-gold-400 mb-4">
            <Anchor className="w-5 h-5" />
            <span className="text-sm font-medium tracking-widest uppercase">
              {locale === 'de' ? 'Exklusiver Yachtcharter' : 'Exclusive Yacht Charter'}
            </span>
          </div>
          
          <h2 className="font-merriweather text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            {locale === 'de' ? (
              <>Erleben Sie das <span className="text-gold-400">Mittelmeer</span></>
            ) : (
              <>Experience the <span className="text-gold-400">Mediterranean</span></>
            )}
          </h2>
          
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            {locale === 'de'
              ? 'Kombinieren Sie Ihren Villenaufenthalt mit einem unvergesslichen Tag auf See. Luxusyachten mit professioneller Crew.'
              : 'Combine your villa stay with an unforgettable day at sea. Luxury yachts with professional crew at your service.'
            }
          </p>
        </motion.div>

        {/* Yacht Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {yachts.map((yacht, index) => (
            <motion.div
              key={yacht.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Link href={`/yachts/${yacht.slug}`}>
                <div className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-gold-500/50 transition-all duration-500">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={yacht.featured_image || 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800'}
                      alt={yacht.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/20 to-transparent" />
                    
                    {yacht.is_featured && (
                      <div className="absolute top-4 left-4 bg-gold-500 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg">
                        <Sparkles className="w-3.5 h-3.5" />
                        {locale === 'de' ? 'Empfohlen' : 'Featured'}
                      </div>
                    )}

                    {/* Specs overlay on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center justify-center gap-6 text-white/90 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Ruler className="w-4 h-4 text-gold-400" />
                          <span>{yacht.length_meters}m</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-gold-400" />
                          <span>{yacht.max_guests}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Ship className="w-4 h-4 text-gold-400" />
                          <span>{yacht.guest_cabins} {locale === 'de' ? 'Kabinen' : 'cabins'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-merriweather text-xl text-white group-hover:text-gold-400 transition-colors mb-1">
                          {yacht.name}
                        </h3>
                        <p className="text-white/50 text-sm">
                          {yacht.manufacturer} {yacht.model} · {yacht.year_built}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center group-hover:bg-gold-500 transition-all">
                        <ArrowRight className="w-5 h-5 text-gold-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    
                    <p className="text-white/60 text-sm line-clamp-2">
                      {yacht.short_description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/yachts"
            className="inline-flex items-center gap-3 bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg hover:shadow-xl group"
          >
            <Waves className="w-5 h-5" />
            {locale === 'de' ? 'Alle Yachten entdecken' : 'Explore All Yachts'}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
