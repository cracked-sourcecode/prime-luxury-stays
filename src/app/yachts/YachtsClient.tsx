'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  Anchor, Users, Ruler, Calendar, ChevronRight, Ship, 
  Waves, Sparkles, Play, Volume2, VolumeX, ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { useLocale } from '@/i18n/LocaleProvider'

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
  guest_cabins: number
  max_guests: number
  crew_members: number
  short_description: string
  long_description: string
  cruising_speed_knots: number
  has_stabilizers: boolean
  water_toys_list: string[]
  featured_image: string
  region: string
  price_per_day: number
  is_featured: boolean
  images: { id: number; image_url: string; is_featured: boolean }[]
}

interface YachtsClientProps {
  yachts: Yacht[]
}

const HERO_VIDEO_URL = 'https://storage.googleapis.com/primeluxurystays/YACHTS/www.yates-mallorca.com-ym-video%20(1).mp4'

export default function YachtsClient({ yachts }: YachtsClientProps) {
  const { t, locale } = useLocale()
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const heroRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  const getLocalizedField = (yacht: Yacht, field: 'long_description' | 'short_description') => {
    // For now, yacht descriptions are in English only
    return yacht[field] || ''
  }

  const featuredYachts = yachts.filter(y => y.is_featured)
  const allYachts = yachts

  return (
    <div className="overflow-hidden">
      {/* ========== CINEMATIC VIDEO HERO ========== */}
      <section ref={heroRef} className="relative h-screen min-h-[700px]">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          {/* Video Background */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="https://storage.googleapis.com/primeluxurystays/YACHTS/yacht-poster.jpg"
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-charcoal-900" />
        </motion.div>
        
        {/* Video Controls */}
        <div className="absolute bottom-8 right-8 z-20 flex gap-3">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
          >
            {isVideoPlaying ? (
              <div className="w-3 h-3 border-l-2 border-r-2 border-white" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
          <button
            onClick={toggleMute}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
        
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="max-w-4xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-5 py-2.5 rounded-full mb-8 border border-white/20"
            >
              <Anchor className="w-4 h-4 text-gold-400" />
              <span className="text-sm font-medium tracking-wide">
                {locale === 'de' ? 'Exklusive Yachtcharter' : 'Exclusive Yacht Charters'}
              </span>
            </motion.div>
            
            {/* Heading */}
            <h1 className="font-merriweather text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight">
              {locale === 'de' ? (
                <>Erleben Sie das <span className="text-gold-400">Mittelmeer</span></>
              ) : (
                <>Experience the <span className="text-gold-400">Mediterranean</span></>
              )}
            </h1>
            
            <p className="text-white/80 text-xl md:text-2xl max-w-2xl mx-auto mb-10 font-light">
              {locale === 'de' 
                ? 'Entdecken Sie unsere exklusive Auswahl an Luxusyachten für unvergessliche Erlebnisse auf See.'
                : 'Discover our exclusive collection of luxury yachts for unforgettable experiences at sea.'
              }
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#yachts"
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
              >
                <Ship className="w-5 h-5" />
                {locale === 'de' ? 'Unsere Yachten' : 'View Our Fleet'}
              </a>
              <Link
                href="/inquire?type=yacht"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-8 py-4 rounded-full font-medium transition-all border border-white/30"
              >
                {locale === 'de' ? 'Anfrage stellen' : 'Make an Inquiry'}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ========== STATS BAR ========== */}
      <section className="bg-charcoal-900 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-merriweather text-gold-400 mb-2">
                {yachts.length}+
              </div>
              <div className="text-white/60 text-sm">
                {locale === 'de' ? 'Luxusyachten' : 'Luxury Yachts'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-merriweather text-gold-400 mb-2">
                8-12
              </div>
              <div className="text-white/60 text-sm">
                {locale === 'de' ? 'Gäste pro Yacht' : 'Guests per Yacht'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-merriweather text-gold-400 mb-2">
                24/7
              </div>
              <div className="text-white/60 text-sm">
                {locale === 'de' ? 'Crew-Service' : 'Crew Service'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-merriweather text-gold-400 mb-2">
                100%
              </div>
              <div className="text-white/60 text-sm">
                {locale === 'de' ? 'Maßgeschneidert' : 'Bespoke Experience'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== YACHT LISTINGS ========== */}
      <section id="yachts" className="py-20 md:py-32 bg-cream-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 text-gold-600 mb-4">
              <Waves className="w-5 h-5" />
              <span className="text-sm font-medium tracking-widest uppercase">
                {locale === 'de' ? 'Unsere Flotte' : 'Our Fleet'}
              </span>
            </div>
            <h2 className="font-merriweather text-4xl md:text-5xl text-charcoal-800 mb-4">
              {locale === 'de' ? 'Exklusive Yachten' : 'Exclusive Yachts'}
            </h2>
            <p className="text-charcoal-600 text-lg max-w-2xl mx-auto">
              {locale === 'de'
                ? 'Handverlesene Luxusyachten für unvergessliche Momente auf dem Mittelmeer.'
                : 'Hand-selected luxury yachts for unforgettable moments on the Mediterranean.'
              }
            </p>
          </motion.div>

          {/* Yacht Grid */}
          {yachts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {yachts.map((yacht, index) => (
                <motion.div
                  key={yacht.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/yachts/${yacht.slug}`}>
                    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={yacht.featured_image || yacht.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800'}
                          alt={yacht.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Featured Badge */}
                        {yacht.is_featured && (
                          <div className="absolute top-4 left-4 bg-gold-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {locale === 'de' ? 'Empfohlen' : 'Featured'}
                          </div>
                        )}
                        
                        {/* View Button */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <span className="bg-white text-charcoal-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                            {locale === 'de' ? 'Details ansehen' : 'View Details'}
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-merriweather text-xl text-charcoal-800 group-hover:text-gold-600 transition-colors">
                              {yacht.name}
                            </h3>
                            <p className="text-charcoal-500 text-sm">{yacht.manufacturer} {yacht.model}</p>
                          </div>
                          {yacht.year_built && (
                            <span className="text-xs bg-cream-100 text-charcoal-600 px-2 py-1 rounded">
                              {yacht.year_built}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-charcoal-600 text-sm mb-4 line-clamp-2">
                          {getLocalizedField(yacht, 'short_description')}
                        </p>
                        
                        {/* Specs */}
                        <div className="flex items-center gap-4 text-charcoal-500 text-sm border-t border-cream-200 pt-4">
                          <div className="flex items-center gap-1.5">
                            <Ruler className="w-4 h-4 text-gold-500" />
                            <span>{yacht.length_meters}m</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-gold-500" />
                            <span>{yacht.max_guests} {locale === 'de' ? 'Gäste' : 'guests'}</span>
                          </div>
                          {yacht.guest_cabins && (
                            <div className="flex items-center gap-1.5">
                              <Ship className="w-4 h-4 text-gold-500" />
                              <span>{yacht.guest_cabins} {locale === 'de' ? 'Kabinen' : 'cabins'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-white rounded-2xl shadow-lg"
            >
              <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Anchor className="w-10 h-10 text-gold-500" />
              </div>
              <h3 className="font-merriweather text-2xl text-charcoal-800 mb-3">
                {locale === 'de' ? 'Neue Yachten kommen bald' : 'New Yachts Coming Soon'}
              </h3>
              <p className="text-charcoal-600 max-w-md mx-auto mb-6">
                {locale === 'de'
                  ? 'Wir erweitern unsere Flotte. Kontaktieren Sie uns für persönliche Empfehlungen.'
                  : "We're expanding our fleet. Contact us for personalized recommendations."
                }
              </p>
              <Link
                href="/inquire?type=yacht"
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-full font-medium transition-all"
              >
                {locale === 'de' ? 'Kontaktieren Sie uns' : 'Get in Touch'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* ========== WHY CHARTER WITH US ========== */}
      <section className="py-20 md:py-32 bg-charcoal-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-merriweather text-4xl md:text-5xl text-white mb-4">
              {locale === 'de' ? 'Warum mit uns chartern?' : 'Why Charter With Us?'}
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              {locale === 'de'
                ? 'Erstklassiger Service und unvergessliche Erlebnisse auf dem Wasser.'
                : 'First-class service and unforgettable experiences on the water.'
              }
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Anchor className="w-8 h-8" />,
                title: locale === 'de' ? 'Handverlesene Flotte' : 'Curated Fleet',
                description: locale === 'de' 
                  ? 'Jede Yacht wird sorgfältig auf Qualität und Luxus geprüft.'
                  : 'Every yacht is carefully vetted for quality and luxury.'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: locale === 'de' ? 'Professionelle Crew' : 'Professional Crew',
                description: locale === 'de'
                  ? 'Erfahrene Kapitäne und aufmerksames Personal für Ihren Komfort.'
                  : 'Experienced captains and attentive staff for your comfort.'
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: locale === 'de' ? 'Maßgeschneiderte Erlebnisse' : 'Bespoke Experiences',
                description: locale === 'de'
                  ? 'Von Tagesausflügen bis zu Wochencharter, alles nach Ihren Wünschen.'
                  : 'From day trips to week-long charters, tailored to your desires.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all"
              >
                <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-gold-400">
                  {item.icon}
                </div>
                <h3 className="font-merriweather text-xl text-white mb-3">{item.title}</h3>
                <p className="text-white/60">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="py-20 bg-gold-500">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-merriweather text-3xl md:text-4xl text-white mb-4">
              {locale === 'de' 
                ? 'Bereit für Ihr nächstes Abenteuer?' 
                : 'Ready for Your Next Adventure?'
              }
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              {locale === 'de'
                ? 'Kontaktieren Sie uns für eine persönliche Beratung und maßgeschneiderte Yachtcharter.'
                : 'Contact us for personalized consultation and bespoke yacht charter experiences.'
              }
            </p>
            <Link
              href="/inquire?type=yacht"
              className="inline-flex items-center gap-2 bg-white hover:bg-cream-50 text-gold-600 px-8 py-4 rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
            >
              {locale === 'de' ? 'Jetzt anfragen' : 'Inquire Now'}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
