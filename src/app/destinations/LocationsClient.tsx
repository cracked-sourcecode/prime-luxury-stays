'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Home, ArrowRight, Clock } from 'lucide-react'

interface Location {
  slug: string
  name: string
  region: string
  country: string
  description: string
  image: string
  propertyCount: number
  comingSoon?: boolean
}

interface LocationsClientProps {
  locations: Location[]
}

export default function LocationsClient({ locations }: LocationsClientProps) {
  // Separate active and coming soon locations
  const activeLocations = locations.filter(l => !l.comingSoon && l.propertyCount > 0)
  const comingSoonLocations = locations.filter(l => l.comingSoon || l.propertyCount === 0)

  return (
    <div className="pt-24 md:pt-32 pb-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-gold-100 text-gold-700 px-4 py-2 rounded-full mb-6">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-semibold">Where We Operate</span>
          </div>
          
          <h1 className="font-merriweather text-4xl md:text-5xl lg:text-6xl text-charcoal-900 mb-6">
            Explore Our
            <span className="text-gold-600"> Destinations</span>
          </h1>
          
          <p className="text-charcoal-500 text-lg md:text-xl leading-relaxed">
            Discover handpicked luxury properties in the world's most extraordinary destinations. 
            Each location offers a unique experience tailored to the discerning traveler.
          </p>
        </motion.div>
      </section>

      {/* Active Locations Grid */}
      {activeLocations.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {activeLocations.map((location, index) => (
              <motion.div
                key={location.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link 
                  href={location.slug === 'mallorca' ? '/mallorca' : `/destinations/${location.slug}`}
                  className="group block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Property Count Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                        <Home className="w-4 h-4 text-gold-600" />
                        <span className="text-sm font-semibold text-charcoal-900">
                          {location.propertyCount} {location.propertyCount === 1 ? 'Property' : 'Properties'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Location Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-white/80 text-sm mb-1">{location.region}, {location.country}</p>
                      <h2 className="font-merriweather text-2xl md:text-3xl text-white mb-2">
                        {location.name}
                      </h2>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <p className="text-charcoal-500 text-sm leading-relaxed mb-4 line-clamp-2">
                      {location.description}
                    </p>
                    
                    <div className="flex items-center text-gold-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                      <span>Explore Properties</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Coming Soon Locations */}
      {comingSoonLocations.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-charcoal-100 text-charcoal-600 px-4 py-2 rounded-full mb-4">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">Coming Soon</span>
            </div>
            <h2 className="font-merriweather text-2xl md:text-3xl text-charcoal-900">
              More Destinations Arriving
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comingSoonLocations.map((location, index) => (
              <motion.div
                key={location.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-white rounded-2xl overflow-hidden shadow-md opacity-75"
              >
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-full object-cover grayscale"
                  />
                  <div className="absolute inset-0 bg-charcoal-900/40" />
                  
                  {/* Coming Soon Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-charcoal-900 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Coming Soon
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white/70 text-xs mb-1">{location.region}, {location.country}</p>
                    <h3 className="font-merriweather text-xl text-white">{location.name}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-charcoal-900 rounded-3xl p-8 md:p-12 text-center"
        >
          <h2 className="font-merriweather text-2xl md:text-3xl text-white mb-4">
            Can't Find Your Destination?
          </h2>
          <p className="text-white/70 mb-8 max-w-lg mx-auto">
            We're constantly expanding our collection. Contact us to discuss your ideal location 
            and we'll help you find the perfect property.
          </p>
          <Link
            href="/inquire"
            className="inline-flex items-center gap-2 bg-gold-500 text-charcoal-900 px-8 py-4 rounded-xl font-semibold hover:bg-gold-400 transition-colors"
          >
            Get in Touch
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

