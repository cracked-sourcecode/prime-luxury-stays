'use client'

import type { Property } from '@/lib/properties'
import { ExternalLink, Navigation, MapPin, Bed, Bath, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'

interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
  locale?: string;
}

export default function PropertyMap({ properties, selectedProperty, onPropertySelect, locale = 'en' }: PropertyMapProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Use Google Maps embed - zoom in if property selected, otherwise show island
  const center = selectedProperty 
    ? { lat: selectedProperty.latitude!, lng: selectedProperty.longitude! }
    : { lat: 39.6, lng: 2.9 }; // Mallorca center
  
  const zoom = selectedProperty ? 14 : 10;

  // Use Places mode to show actual markers if we have a selected property
  const mapUrl = selectedProperty && selectedProperty.latitude && selectedProperty.longitude
    ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${center.lat},${center.lng}&zoom=${zoom}&maptype=roadmap`
    : `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${center.lat},${center.lng}&zoom=${zoom}&maptype=roadmap`;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden bg-gray-100">
      {/* Google Maps Embed */}
      <iframe
        src={mapUrl}
        className="w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* Selected Property Info Overlay - Top */}
      {selectedProperty && (
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start gap-4">
          {/* Property Name Badge */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold-500 flex items-center justify-center flex-shrink-0">
              <Navigation className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-charcoal-900 text-sm">
                {selectedProperty.name}
              </h4>
              <p className="text-xs text-charcoal-500">{selectedProperty.city}, Mallorca</p>
            </div>
          </div>
          
          {/* Google Maps Link */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${selectedProperty.latitude},${selectedProperty.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg flex items-center gap-2 text-charcoal-700 hover:text-gold-600 transition-colors text-sm font-medium flex-shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">{locale === 'de' ? 'In Maps öffnen' : 'Open in Maps'}</span>
          </a>
        </div>
      )}

      {/* Property List Overlay - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-8 pb-4 px-4">
        {/* Scroll Arrows */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-charcoal-600 hover:text-gold-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-charcoal-600 hover:text-gold-600 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-8"
        >
          {properties.map((property) => (
            <button
              key={property.id}
              onClick={() => onPropertySelect?.(property)}
              className={`flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-lg transition-all hover:scale-[1.02] w-[200px] text-left ${
                selectedProperty?.id === property.id ? 'ring-2 ring-gold-500' : ''
              }`}
            >
              <img 
                src={property.featured_image || ''} 
                alt={property.name}
                className="w-full h-24 object-cover"
              />
              <div className="p-3">
                <h4 className="font-semibold text-charcoal-900 text-sm truncate">
                  {property.name}
                </h4>
                <p className="text-xs text-charcoal-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {property.city}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 text-charcoal-400 text-xs">
                    <span className="flex items-center gap-0.5">
                      <Bed className="w-3 h-3" /> {property.bedrooms}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Bath className="w-3 h-3" /> {property.bathrooms}
                    </span>
                  </div>
                  {property.price_per_week && (
                    <span className="text-gold-600 text-xs font-semibold">
                      €{Number(property.price_per_week).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
