'use client'

import { useEffect, useState } from 'react'
import type { Property } from '@/lib/properties'

// Dynamic import for Leaflet to avoid SSR issues
interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
}

export default function PropertyMap({ properties, selectedProperty, onPropertySelect }: PropertyMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [MapComponent, setMapComponent] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Dynamically import Leaflet components
    import('react-leaflet').then((mod) => {
      setMapComponent(() => mod);
    });

    // Add Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (!isClient || !MapComponent) {
    return (
      <div className="w-full h-full bg-cream-100 rounded-2xl flex items-center justify-center">
        <div className="text-charcoal-400">Loading map...</div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponent;

  // Center on Mallorca
  const mallorcaCenter: [number, number] = [39.6, 2.9];

  // Filter properties with valid coordinates
  const propertiesWithCoords = properties.filter(p => p.latitude && p.longitude);

  return (
    <MapContainer
      center={mallorcaCenter}
      zoom={9}
      style={{ width: '100%', height: '100%', borderRadius: '16px' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {propertiesWithCoords.map((property) => (
        <Marker
          key={property.id}
          position={[property.latitude!, property.longitude!]}
          eventHandlers={{
            click: () => onPropertySelect?.(property),
          }}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <img 
                src={property.featured_image || ''} 
                alt={property.name}
                className="w-full h-24 object-cover rounded-lg mb-2"
              />
              <h3 className="font-semibold text-charcoal-900">{property.name}</h3>
              <p className="text-sm text-charcoal-500">{property.city}</p>
              <p className="text-xs text-charcoal-400 mt-1">
                {property.bedrooms} beds · {property.bathrooms} baths
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

