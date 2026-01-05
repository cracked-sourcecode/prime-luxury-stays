'use client'

import type { Property } from '@/lib/properties'
import { ExternalLink, Navigation } from 'lucide-react'

interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
}

export default function PropertyMap({ properties, selectedProperty, onPropertySelect }: PropertyMapProps) {
  // Use Google Maps embed - zoom in if property selected, otherwise show island
  const center = selectedProperty 
    ? { lat: selectedProperty.latitude!, lng: selectedProperty.longitude! }
    : { lat: 39.6, lng: 2.9 }; // Mallorca center
  
  const zoom = selectedProperty ? 14 : 10;

  // Use Places mode to show actual markers if we have a selected property
  const mapUrl = selectedProperty && selectedProperty.latitude && selectedProperty.longitude
    ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${center.lat},${center.lng}&zoom=${zoom}&maptype=roadmap`
    : `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${center.lat},${center.lng}&zoom=${zoom}&maptype=roadmap`;

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

      {/* Selected Property Info Overlay */}
      {selectedProperty && (
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start gap-4">
          {/* Property Name Badge */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold-500 flex items-center justify-center">
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
            className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg flex items-center gap-2 text-charcoal-700 hover:text-gold-600 transition-colors text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Open in Maps</span>
          </a>
        </div>
      )}
    </div>
  );
}
