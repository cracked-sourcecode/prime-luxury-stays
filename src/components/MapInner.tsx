'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Property } from '@/lib/properties'
import { MapPin, Bed, Bath, Users } from 'lucide-react'
import Link from 'next/link'
import 'leaflet/dist/leaflet.css'

interface MapInnerProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
  locale?: string;
}

// Custom price marker icon creator
function createPriceIcon(price: string, isSelected: boolean) {
  return L.divIcon({
    className: 'custom-price-marker',
    html: `
      <div class="price-marker ${isSelected ? 'selected' : ''}">
        ${price}
      </div>
    `,
    iconSize: [70, 35],
    iconAnchor: [35, 17],
  })
}

// Component to fly to selected property
function FlyToProperty({ property }: { property: Property | null }) {
  const map = useMap()
  
  useEffect(() => {
    if (property && property.latitude && property.longitude) {
      map.flyTo([property.latitude, property.longitude], 13, {
        duration: 1.5
      })
    }
  }, [property, map])
  
  return null
}

export default function MapInner({ 
  properties, 
  selectedProperty, 
  onPropertySelect,
  locale = 'en' 
}: MapInnerProps) {
  const [activeProperty, setActiveProperty] = useState<Property | null>(null)
  
  // Filter properties with valid coordinates
  const propertiesWithCoords = properties.filter(p => p.latitude && p.longitude)

  // Center of Mallorca - focused on main property areas
  const center: [number, number] = [39.58, 2.65]

  useEffect(() => {
    if (selectedProperty) {
      setActiveProperty(selectedProperty)
    }
  }, [selectedProperty])

  const handleMarkerClick = (property: Property) => {
    setActiveProperty(property)
    onPropertySelect?.(property)
  }

  const formatPrice = (property: Property) => {
    if (!property.price_per_week) return '—'
    const num = Number(property.price_per_week)
    if (num >= 10000) return `€${Math.round(num / 1000)}k`
    return `€${num.toLocaleString()}`
  }

  return (
    <div className="relative w-full h-full">
      {/* Leaflet Map */}
      <MapContainer
        center={center}
        zoom={10.5}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        {/* Beautiful light map tiles - CartoDB Voyager (Airbnb-like style) */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <FlyToProperty property={selectedProperty || null} />

        {/* Property Markers */}
        {propertiesWithCoords.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude!, property.longitude!]}
            icon={createPriceIcon(formatPrice(property), activeProperty?.id === property.id)}
            eventHandlers={{
              click: () => handleMarkerClick(property),
            }}
          >
            <Popup className="property-popup" closeButton={false}>
              <div className="w-64">
                <Link href={`/properties/${property.slug}`}>
                  <div className="relative h-32 -mx-3 -mt-3 mb-3 overflow-hidden rounded-t-lg">
                    <img
                      src={property.featured_image || ''}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                    {property.is_featured && (
                      <div className="absolute top-2 left-2 bg-gold-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Featured
                      </div>
                    )}
                  </div>
                </Link>
                <Link href={`/properties/${property.slug}`}>
                  <h3 className="font-semibold text-charcoal-900 text-sm mb-1 hover:text-gold-600 transition-colors">
                    {property.name}
                  </h3>
                </Link>
                <p className="text-charcoal-500 text-xs mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {property.city}, Mallorca
                </p>
                <div className="flex items-center gap-3 text-charcoal-500 text-xs mb-3">
                  <span className="flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5" /> {property.bedrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5" /> {property.bathrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {property.max_guests}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 -mx-3 px-3">
                  {property.price_per_week && (
                    <div>
                      <span className="text-charcoal-900 font-bold">
                        €{Number(property.price_per_week).toLocaleString()}
                      </span>
                      <span className="text-charcoal-400 text-xs"> /{locale === 'de' ? 'Woche' : 'week'}</span>
                    </div>
                  )}
                  <Link
                    href={`/properties/${property.slug}`}
                    className="bg-charcoal-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-charcoal-800 transition-colors"
                  >
                    {locale === 'de' ? 'Details' : 'View'}
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Property count badge */}
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-full px-4 py-2 shadow-lg border border-gray-100">
        <span className="font-bold text-charcoal-900">{propertiesWithCoords.length}</span>
        <span className="text-charcoal-500 ml-1.5 text-sm">
          {locale === 'de' ? 'Immobilien auf der Karte' : 'properties on map'}
        </span>
      </div>

      {/* Zoom controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-1">
        <button 
          onClick={() => {
            const map = document.querySelector('.leaflet-container') as any
            if (map?._leaflet_map) map._leaflet_map.zoomIn()
          }}
          className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-100 flex items-center justify-center text-charcoal-600 hover:text-charcoal-900 transition-colors text-xl font-light"
        >
          +
        </button>
        <button 
          onClick={() => {
            const map = document.querySelector('.leaflet-container') as any
            if (map?._leaflet_map) map._leaflet_map.zoomOut()
          }}
          className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-100 flex items-center justify-center text-charcoal-600 hover:text-charcoal-900 transition-colors text-xl font-light"
        >
          −
        </button>
      </div>


      {/* Custom marker styles */}
      <style jsx global>{`
        .custom-price-marker {
          background: transparent;
        }
        .price-marker {
          background: white;
          color: #1a1a1a;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 13px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          border: 2px solid white;
          white-space: nowrap;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .price-marker:hover {
          transform: scale(1.08);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .price-marker.selected {
          background: #1a1a1a;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 12px;
          overflow: hidden;
        }
        .leaflet-popup-content {
          margin: 12px;
          width: auto !important;
        }
        .leaflet-popup-tip {
          background: white;
        }
        .leaflet-container {
          font-family: inherit;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

