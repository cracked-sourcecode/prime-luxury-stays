'use client'

import { motion } from 'framer-motion'
import { Anchor, Users, Ruler, Ship, ChevronRight, Sparkles, ArrowRight, Waves } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from '@/i18n/LocaleProvider'

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
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900 via-[#0f1729] to-charcoal-900" />
      
      {/* Decorative glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[100px] translate-y-1/2" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gold-600/5 rounded-full blur-[80px] -translate-x-1/2" />
      
      {/* Wave pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%23B8954C' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        backgroundSize: '100px 20px'
      }} />
      
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
