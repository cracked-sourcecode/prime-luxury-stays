'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Bed, Bath, Users, Star, Waves, Mountain } from 'lucide-react'
import type { Property } from '@/lib/properties'

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export default function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/properties/${property.slug}`} className="group block">
        {/* Image */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-lg">
          <img
            src={property.featured_image || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'}
            alt={property.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Featured badge */}
          {property.is_featured && (
            <div className="absolute top-4 left-4 bg-gold-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" />
              Featured
            </div>
          )}

          {/* Property type badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-charcoal-900 px-3 py-1 rounded-full text-xs font-semibold">
            {property.house_type}
          </div>

          {/* Amenity badges */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            {property.has_sea_view && (
              <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full">
                <Waves className="w-4 h-4 text-blue-500" />
              </div>
            )}
            {property.has_pool && (
              <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full">
                <span className="text-blue-500 text-xs font-bold">🏊</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-charcoal-500 text-sm mb-1">
            <MapPin className="w-4 h-4 text-gold-500" />
            <span>{property.city}, {property.region}</span>
          </div>

          {/* Name */}
          <h3 className="font-merriweather text-xl text-charcoal-900 mb-2 group-hover:text-gold-600 transition-colors">
            {property.name}
          </h3>

          {/* Short description */}
          <p className="text-charcoal-500 text-sm mb-3 line-clamp-2">
            {property.short_description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-charcoal-600 text-sm">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms} beds</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms} baths</span>
              </div>
            )}
            {property.max_guests && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{property.max_guests} guests</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

