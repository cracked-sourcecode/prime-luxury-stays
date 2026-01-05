'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import type { Property } from '@/lib/properties'
import { MapPin, Bed, Bath, Users, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
  locale?: string;
}

// Dynamically import the map to avoid SSR issues
const MapComponent = dynamic(() => import('./MapInner'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="animate-pulse text-charcoal-400">Loading map...</div>
    </div>
  )
})

export default function PropertyMap(props: PropertyMapProps) {
  return <MapComponent {...props} />
}
