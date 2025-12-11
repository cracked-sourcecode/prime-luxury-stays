'use client'

import type { Property } from '@/lib/properties'
import { MapPin, ExternalLink } from 'lucide-react'

interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
}

export default function PropertyMap({ properties, selectedProperty, onPropertySelect }: PropertyMapProps) {
  // Filter properties with valid coordinates
  const propertiesWithCoords = properties.filter(p => p.latitude && p.longitude);
  
  // Use Google Maps embed for simplicity
  const center = selectedProperty 
    ? { lat: selectedProperty.latitude!, lng: selectedProperty.longitude! }
    : { lat: 39.6, lng: 2.9 }; // Mallorca center

  const mapUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${center.lat},${center.lng}&zoom=10&maptype=roadmap`;

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden bg-cream-100">
      {/* Google Maps Embed */}
      <iframe
        src={mapUrl}
        className="w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      
      {/* Property List Overlay */}
      <div className="absolute bottom-4 left-4 right-4 max-h-48 overflow-y-auto">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {propertiesWithCoords.map((property) => (
            <button
              key={property.id}
              onClick={() => onPropertySelect?.(property)}
              className={`flex-shrink-0 bg-white rounded-xl p-3 shadow-lg transition-all hover:scale-105 ${
                selectedProperty?.id === property.id ? 'ring-2 ring-gold-500' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <img 
                  src={property.featured_image || ''} 
                  alt={property.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="text-left">
                  <h4 className="font-semibold text-charcoal-900 text-sm whitespace-nowrap">
                    {property.name}
                  </h4>
                  <p className="text-xs text-charcoal-500">{property.city}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* View on Google Maps Link */}
      {selectedProperty && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${selectedProperty.latitude},${selectedProperty.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 bg-white rounded-lg px-4 py-2 shadow-lg flex items-center gap-2 text-charcoal-700 hover:text-gold-600 transition-colors text-sm font-medium"
        >
          <ExternalLink className="w-4 h-4" />
          Open in Google Maps
        </a>
      )}
    </div>
  );
}
