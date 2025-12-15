'use client'

import { motion } from 'framer-motion'
import { Search, MapPin, Calendar, Users, Star, Shield, Clock, Crown } from 'lucide-react'
import Link from 'next/link'
import type { Property } from '@/lib/properties'

const featuredDestinations = [
  { name: 'Mallorca', href: '/mallorca', image: 'https://storage.googleapis.com/primeluxurystays/Mallorca%20Global%20Hero%20Section%20Image' },
  { name: 'South of France', href: '/destinations', image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=600&q=80' },
]

interface HeroProps {
  heroProperty: Property | null
}

export default function Hero({ heroProperty }: HeroProps) {
  // Use hero property data
  const heroImage = heroProperty?.featured_image || ''
  const heroName = heroProperty?.name || ''
  const heroSlug = heroProperty?.slug || ''
  const heroCity = heroProperty?.city || ''
  return (
    <section className="relative min-h-screen bg-cream-50 pt-28 lg:pt-32 pb-16 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-gold-100 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-gold-50 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-200px)]">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gold-100 text-gold-700 px-4 py-2 rounded-full mb-6"
            >
              <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
              <span className="text-sm font-semibold">Exclusive Collection</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-merriweather text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-charcoal-900 leading-[1.1] mb-6"
            >
              Find your next
              <br />
              <span className="text-gold-600">luxury escape</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-charcoal-500 text-lg lg:text-xl max-w-lg mb-10 leading-relaxed"
            >
              Discover handpicked villas and estates in the world's most 
              extraordinary destinations. Your private paradise awaits.
            </motion.p>

            {/* Search Box - Airbnb Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-white rounded-2xl p-2 shadow-xl border border-gray-100 max-w-xl"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Where */}
                <div className="flex-1 p-4 border-b sm:border-b-0 sm:border-r border-gray-100 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center group-hover:bg-gold-200 transition-colors">
                      <MapPin className="w-5 h-5 text-gold-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-charcoal-400 uppercase tracking-wide">Where</p>
                      <p className="text-charcoal-900 font-medium">Search destinations</p>
                    </div>
                  </div>
                </div>

                {/* When */}
                <div className="flex-1 p-4 border-b sm:border-b-0 sm:border-r border-gray-100 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center group-hover:bg-gold-200 transition-colors">
                      <Calendar className="w-5 h-5 text-gold-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-charcoal-400 uppercase tracking-wide">When</p>
                      <p className="text-charcoal-900 font-medium">Add dates</p>
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <div className="p-2 flex items-center">
<a
                  href="/destinations"
                  className="w-full sm:w-auto btn-gold flex items-center justify-center gap-2 !rounded-xl !py-4 !px-8"
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </a>
                </div>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap items-center gap-4 md:gap-6 mt-6 md:mt-10"
            >
              <div className="flex items-center gap-2 text-charcoal-600">
                <Shield className="w-4 h-4 md:w-5 md:h-5 text-gold-500" />
                <span className="text-xs md:text-sm font-medium">Verified Properties</span>
              </div>
              <div className="flex items-center gap-2 text-charcoal-600">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-gold-500" />
                <span className="text-xs md:text-sm font-medium">24/7 Concierge</span>
              </div>
              <div className="flex items-center gap-2 text-charcoal-600">
                <Star className="w-4 h-4 md:w-5 md:h-5 text-gold-500" />
                <span className="text-xs md:text-sm font-medium">5-Star Service</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2"
          >
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              {/* Main Hero Featured Property */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="col-span-2 relative aspect-[4/3] md:aspect-[16/10] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
              >
                {heroImage ? (
                  <Link href={heroSlug ? `/properties/${heroSlug}` : '/destinations'} className="block w-full h-full">
                    <img
                      src={heroImage}
                      alt={heroName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    {/* Hero Featured Badge */}
                    <div className="absolute top-3 left-3 md:top-4 md:left-4">
                      <div className="flex items-center gap-1 md:gap-1.5 bg-gold-500 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-lg">
                        <Crown className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-xs md:text-sm font-semibold">Featured</span>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                      <div className="flex items-center gap-2 mb-1 md:mb-2">
                        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                          <Star className="w-3 h-3 md:w-4 md:h-4 fill-gold-500 text-gold-500" />
                          <span className="text-xs md:text-sm font-semibold text-charcoal-900">5.0</span>
                        </div>
                        {heroCity && <span className="text-white/90 text-xs md:text-sm">{heroCity}</span>}
                      </div>
                      <h3 className="font-merriweather text-base md:text-xl lg:text-2xl text-white line-clamp-1">{heroName}</h3>
                    </div>
                  </Link>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gold-100 to-cream-200 flex items-center justify-center">
                    <p className="text-charcoal-400 text-sm md:text-base">Set a Hero Featured property in admin</p>
                  </div>
                )}
              </motion.div>

              {/* Secondary destination cards - hidden on very small screens */}
              {featuredDestinations.map((dest, index) => (
                <motion.div
                  key={dest.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="relative aspect-[4/3] md:aspect-square rounded-xl md:rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
                >
                  <Link href={dest.href} className="block w-full h-full">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4">
                      <p className="text-white font-semibold text-sm md:text-lg">{dest.name}</p>
                      <p className="text-white/80 text-xs md:text-sm">Explore →</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Floating Stats Card - Smaller on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="hidden md:flex absolute -bottom-4 left-1/2 lg:left-auto lg:right-12 transform -translate-x-1/2 lg:translate-x-0 bg-white rounded-2xl shadow-xl p-4 md:p-6 items-center gap-4 md:gap-8"
            >
              <div className="text-center">
                <div className="font-merriweather text-2xl md:text-3xl text-gold-600">200+</div>
                <div className="text-xs text-charcoal-500 font-medium">Properties</div>
              </div>
              <div className="w-px h-10 md:h-12 bg-gray-200" />
              <div className="text-center">
                <div className="font-merriweather text-2xl md:text-3xl text-gold-600">15+</div>
                <div className="text-xs text-charcoal-500 font-medium">Destinations</div>
              </div>
              <div className="w-px h-10 md:h-12 bg-gray-200" />
              <div className="text-center">
                <div className="font-merriweather text-2xl md:text-3xl text-gold-600">98%</div>
                <div className="text-xs text-charcoal-500 font-medium">Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
