'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { 
  MapPin, 
  Sun, 
  Waves, 
  Music,
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
import type { Property } from '@/lib/properties'
import { useLocale } from '@/i18n/LocaleProvider'
import OtherDestinations from '@/components/OtherDestinations'
import PropertyMap from '@/components/PropertyMap'
import { useState } from 'react'

interface IbizaClientProps {
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

export default function IbizaClient({ properties }: IbizaClientProps) {
  const { t, locale } = useLocale()
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const hasProperties = properties.length > 0

  return (
    <div className="overflow-hidden">
      {/* ========== CINEMATIC HERO ========== */}
      <section ref={heroRef} className="relative h-screen min-h-[800px]">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          {/* Background image */}
          <img
            src="https://storage.googleapis.com/primeluxurystays/Ibiza%20Photo.png"
            alt="Ibiza"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
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
              <span className="text-sm font-medium tracking-wide">{t('pages.ibiza.badge')}</span>
            </motion.div>
            
            <h1 className="font-merriweather text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-[0.95]">
              Ibiza
            </h1>
            
            <p className="text-white/80 text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              {t('pages.ibiza.heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              {hasProperties ? (
                <a href="#villas" className="btn-gold text-base px-10 py-5 flex items-center gap-2">
                  <span>{t('pages.ibiza.exploreVillas')}</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              ) : (
                <Link href="/#contact" className="btn-gold text-base px-10 py-5 flex items-center gap-2">
                  <span>{t('pages.ibiza.registerInterest')}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
              <Link href="/#contact" className="bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20">
                {t('pages.ibiza.requestInfo')}
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
              <span className="text-xs tracking-[0.3em] uppercase">{t('pages.ibiza.discoverMore')}</span>
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ========== THE PROMISE - WHAT WE OFFER ========== */}
      <section className="relative z-20 py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-gold-600 text-sm font-semibold tracking-[0.3em] uppercase mb-5">
                {t('pages.ibiza.difference')}
              </p>
              <h2 className="font-merriweather text-3xl md:text-4xl lg:text-5xl text-charcoal-900 mb-8 leading-tight">
                {t('pages.ibiza.diffTitle1')}
                <br />
                <span className="text-gold-600">{t('pages.ibiza.diffTitle2')}</span>
              </h2>
              <p className="text-charcoal-500 text-xl mb-10 leading-relaxed">
                {t('pages.ibiza.diffDesc')}
              </p>

              <div className="space-y-6">
                {[
                  { 
                    icon: Shield, 
                    title: locale === 'de' ? 'Geprüfte Exzellenz' : 'Verified Excellence', 
                    desc: locale === 'de' ? 'Jede Villa persönlich von unserem Team inspiziert' : 'Every villa personally inspected by our team' 
                  },
                  { 
                    icon: Clock, 
                    title: locale === 'de' ? 'Persönlicher Concierge' : 'Dedicated Concierge', 
                    desc: locale === 'de' ? 'VIP-Zugang, Yachtcharter, Privatköche' : 'VIP access, yacht charters, private chefs' 
                  },
                  { 
                    icon: Heart, 
                    title: locale === 'de' ? 'Kuratierte Erlebnisse' : 'Curated Experiences', 
                    desc: locale === 'de' ? 'Geheime Strände, exklusive Events, Wellness-Retreats' : 'Secret beaches, exclusive events, wellness retreats' 
                  },
                  { 
                    icon: Star, 
                    title: locale === 'de' ? 'Bestpreis-Garantie' : 'Best Price Guarantee', 
                    desc: locale === 'de' ? 'Direktbuchung ohne Vermittlergebühren' : 'Direct booking means no middleman markups' 
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-5">
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
                  src="https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1000&q=80"
                  alt="Luxury Villa Ibiza"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== WHY IBIZA - VISUAL STORY ========== */}
      <section className="relative z-20 py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-gold-600 text-sm font-semibold tracking-[0.3em] uppercase mb-5">
              {locale === 'de' ? 'Die Insel' : 'The Island'}
            </p>
            <h2 className="font-merriweather text-4xl md:text-5xl lg:text-6xl text-charcoal-900 mb-6">
              {locale === 'de' ? 'Warum Ibiza' : 'Why Ibiza Captivates'}
              <br />
              <span className="text-gold-600">{locale === 'de' ? 'Die Weltelite Begeistert' : "The World's Elite"}</span>
            </h2>
          </div>

          {/* Immersive Bento Grid */}
          <div className="grid grid-cols-12 gap-5 auto-rows-[200px]">
            {/* Large Feature - Beaches */}
            <div className="col-span-12 md:col-span-8 row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80"
                alt="Ibiza Beach"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <div className="flex items-center gap-3 text-gold-400 mb-4">
                  <Waves className="w-6 h-6" />
                  <span className="text-sm font-semibold tracking-[0.2em] uppercase">{locale === 'de' ? '80+ Strände' : '80+ Beaches'}</span>
                </div>
                <h3 className="font-merriweather text-3xl md:text-4xl text-white mb-4">
                  {locale === 'de' ? 'Versteckte Buchten & Kristallklares Wasser' : 'Hidden Coves & Crystal Waters'}
                </h3>
                <p className="text-white/70 text-lg max-w-xl">
                  {locale === 'de' 
                    ? 'Von den berühmten Ses Salines bis zu geheimen Orten, die nur Einheimische kennen. Entdecken Sie Strände, die sich wie Ihr eigenes privates Paradies anfühlen.'
                    : 'From the famous Ses Salines to secret spots only locals know. Discover beaches that feel like your own private paradise.'}
                </p>
              </div>
            </div>

            {/* Nightlife */}
            <div className="col-span-12 md:col-span-4 row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80"
                alt="Ibiza Nightlife"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-gold-400 mb-2">
                  <Music className="w-5 h-5" />
                  <span className="text-xs font-semibold tracking-[0.15em] uppercase">{locale === 'de' ? 'Legendär' : 'Legendary'}</span>
                </div>
                <h3 className="font-merriweather text-xl text-white">
                  {locale === 'de' ? 'Weltberühmtes Nachtleben' : 'World-Famous Nightlife'}
                </h3>
              </div>
            </div>

            {/* Gastronomy */}
            <div className="col-span-6 md:col-span-4 row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
                alt="Fine Dining"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-gold-400 mb-2">
                  <Wine className="w-5 h-5" />
                  <span className="text-xs font-semibold tracking-[0.15em] uppercase">Beach Clubs</span>
                </div>
                <h3 className="font-merriweather text-xl text-white">
                  {locale === 'de' ? 'Gourmet-Erlebnisse' : 'Gourmet Experiences'}
                </h3>
              </div>
            </div>

            {/* Yachts */}
            <div className="col-span-6 md:col-span-4 row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80"
                alt="Yacht"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-gold-400 mb-2">
                  <Anchor className="w-5 h-5" />
                  <span className="text-xs font-semibold tracking-[0.15em] uppercase">{locale === 'de' ? 'Nautisch' : 'Nautical'}</span>
                </div>
                <h3 className="font-merriweather text-xl text-white">
                  {locale === 'de' ? 'Yacht & Segeln' : 'Yacht & Sailing'}
                </h3>
              </div>
            </div>

            {/* Sunshine */}
            <div className="col-span-12 md:col-span-4 row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80"
                alt="Sunset"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-gold-400 mb-2">
                  <Sun className="w-5 h-5" />
                  <span className="text-xs font-semibold tracking-[0.15em] uppercase">{locale === 'de' ? 'Legendär' : 'Legendary'}</span>
                </div>
                <h3 className="font-merriweather text-xl text-white">
                  {locale === 'de' ? 'Ikonische Sonnenuntergänge' : 'Iconic Sunsets'}
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
              {hasProperties 
                ? (locale === 'de' ? 'Exklusive Ibiza Villen' : 'Exclusive Ibiza Villas')
                : (locale === 'de' ? 'Demnächst auf Ibiza' : 'Coming Soon to Ibiza')}
            </h2>
            <p className="text-charcoal-500 text-xl max-w-3xl mx-auto">
              {hasProperties 
                ? (locale === 'de' 
                    ? 'Jede Immobilie wird persönlich geprüft, um sicherzustellen, dass sie unseren hohen Standards entspricht. Dies sind nicht nur Häuser – es sind Erlebnisse, die darauf warten, entdeckt zu werden.'
                    : 'Each property personally vetted to ensure it meets our exacting standards. These aren\'t just houses—they\'re experiences waiting to unfold.')
                : (locale === 'de'
                    ? 'Wir erweitern unsere Kollektion auf Ibiza. Registrieren Sie Ihr Interesse, um als Erster zu erfahren, wann unsere exklusiven Ibiza-Immobilien verfügbar sind.'
                    : 'We\'re expanding our collection to Ibiza. Register your interest to be the first to know when our exclusive Ibiza properties become available.')
              }
            </p>
          </div>

          {hasProperties ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {properties.map((property) => (
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
                      <span>{property.city}, Ibiza</span>
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
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl mx-auto border border-gold-100">
                <Sparkles className="w-16 h-16 text-gold-500 mx-auto mb-6" />
                <h3 className="font-merriweather text-2xl text-charcoal-900 mb-4">
                  {locale === 'de' ? 'Seien Sie der Erste' : 'Be the First to Know'}
                </h3>
                <p className="text-charcoal-500 mb-8">
                  {locale === 'de' 
                    ? 'Unsere Ibiza-Kollektion kommt bald. Registrieren Sie Ihr Interesse und wir benachrichtigen Sie, wenn exklusive Immobilien verfügbar werden.'
                    : 'Our Ibiza collection is coming soon. Register your interest and we\'ll notify you when exclusive properties become available.'}
                </p>
                <Link 
                  href="/#contact"
                  className="btn-gold inline-flex items-center gap-2"
                >
                  <span>{locale === 'de' ? 'Interesse Registrieren' : 'Register Interest'}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========== PROPERTIES MAP SECTION ========== */}
      {properties.length > 0 && (
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
                  center={[38.98, 1.43]}
                  zoom={11}
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
      )}

      {/* ========== OTHER DESTINATIONS ========== */}
      <OtherDestinations currentDestination="ibiza" />

      {/* ========== FINAL CTA ========== */}
      <section className="relative py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-charcoal-900/85" />
        
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Sparkles className="w-10 h-10 text-gold-400 mx-auto mb-8" />
            
            <h2 className="font-merriweather text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
              {t('pages.ibiza.ctaTitle')}
              <br />
              <span className="text-gold-400">{t('pages.ibiza.ctaHighlight')}</span>
            </h2>
            <p className="text-white/70 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('pages.ibiza.ctaDesc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link 
                href="/#contact" 
                className="btn-gold text-lg px-12 py-5 flex items-center gap-3"
              >
                <Calendar className="w-5 h-5" />
                {hasProperties ? t('pages.ibiza.requestVilla') : t('pages.ibiza.registerInterest')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

