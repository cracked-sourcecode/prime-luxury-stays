'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Admin translations
const adminTranslations = {
  en: {
    // Navigation & Header
    dashboard: 'Dashboard',
    properties: 'Properties',
    inquiries: 'Inquiries',
    customers: 'Customers',
    settings: 'Settings',
    logout: 'Logout',
    adminPortal: 'Admin Portal',
    
    // Property Editor
    editProperty: 'Edit Property',
    newProperty: 'New Property',
    backToProperties: 'Back to Properties',
    viewLive: 'View Live',
    deleteProperty: 'Delete Property',
    saveProperty: 'Save Property',
    saving: 'Saving...',
    
    // Tabs
    details: 'Details',
    images: 'Images',
    availability: 'Availability',
    
    // Property Content Section
    propertyContent: 'Property Content (Both Languages)',
    contentHint: 'Enter content in both English and German. German fields will be shown to German-speaking visitors.',
    propertyNameEn: 'Property Name (English)',
    propertyNameDe: 'Immobilienname (Deutsch)',
    leaveEmptyForEnglish: 'Leave empty to use English',
    houseTypeEn: 'House Type (English)',
    houseTypeDe: 'Haustyp (Deutsch)',
    useEnglish: '— Use English —',
    shortDescEn: 'Short Description (English)',
    shortDescDe: 'Kurzbeschreibung (Deutsch)',
    fullDescEn: 'Full Description (English)',
    fullDescDe: 'Vollständige Beschreibung (Deutsch)',
    
    // Basic Info
    basicInfo: 'Basic Information',
    urlSlug: 'URL Slug',
    urlSlugHint: 'Used in the property URL (auto-generated from name)',
    websiteUrl: 'Website URL',
    
    // License
    licenseInfo: 'License Information',
    licenseNumber: 'License Number',
    registryNumber: 'Registry Number',
    
    // Location
    location: 'Location',
    address: 'Address',
    city: 'City',
    region: 'Region',
    country: 'Country',
    latitude: 'Latitude',
    longitude: 'Longitude',
    
    // Property Details
    propertyDetails: 'Property Details',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    maxGuests: 'Max Guests',
    minStay: 'Minimum Stay (nights)',
    
    // Pricing
    pricing: 'Pricing',
    pricePerWeekLow: 'Price/Week (Low Season)',
    pricePerWeekHigh: 'Price/Week (High Season)',
    
    // Amenities
    amenities: 'Amenities',
    privatePool: 'Private Pool',
    seaView: 'Sea View',
    airConditioning: 'Air Conditioning',
    heating: 'Heating',
    wifi: 'WiFi',
    beachfront: 'Beachfront',
    
    // Distances
    nearbyDistances: 'Nearby Distances',
    distanceHint: 'Distance/time to key locations (e.g. "5 min", "10 min", "2 km")',
    beach: 'Beach',
    restaurants: 'Restaurants',
    oldTown: 'Old Town',
    airport: 'Airport',
    
    // Status
    status: 'Status',
    activeVisible: 'Active (Visible on website)',
    featured: 'Featured Property',
    
    // Images
    uploadImages: 'Upload Images',
    dragDropImages: 'Drag and drop images here, or click to browse',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    deleteSelected: 'Delete Selected',
    setAsFeatured: 'Set as Featured',
    
    // Availability
    addPeriod: 'Add Period',
    startDate: 'Start Date',
    endDate: 'End Date',
    pricePerWeek: 'Price/Week',
    delete: 'Delete',
    
    // Messages
    propertyCreated: 'Property created successfully!',
    propertySaved: 'Property saved successfully!',
    propertyDeleted: 'Property deleted successfully!',
    errorSaving: 'Error saving property',
    confirmDelete: 'Are you sure you want to delete this property?',
    
    // Inquiries
    allInquiries: 'All Inquiries',
    newInquiry: 'New',
    contacted: 'Contacted',
    closed: 'Closed',
    noInquiries: 'No inquiries yet',
    
    // Customers
    allCustomers: 'All Customers',
    addCustomer: 'Add Customer',
    noCustomers: 'No customers yet',
  },
  de: {
    // Navigation & Header
    dashboard: 'Dashboard',
    properties: 'Immobilien',
    inquiries: 'Anfragen',
    customers: 'Kunden',
    settings: 'Einstellungen',
    logout: 'Abmelden',
    adminPortal: 'Admin-Portal',
    
    // Property Editor
    editProperty: 'Immobilie bearbeiten',
    newProperty: 'Neue Immobilie',
    backToProperties: 'Zurück zu Immobilien',
    viewLive: 'Live ansehen',
    deleteProperty: 'Immobilie löschen',
    saveProperty: 'Immobilie speichern',
    saving: 'Speichern...',
    
    // Tabs
    details: 'Details',
    images: 'Bilder',
    availability: 'Verfügbarkeit',
    
    // Property Content Section
    propertyContent: 'Immobilieninhalt (Beide Sprachen)',
    contentHint: 'Geben Sie Inhalte in Englisch und Deutsch ein. Deutsche Felder werden deutschsprachigen Besuchern angezeigt.',
    propertyNameEn: 'Immobilienname (Englisch)',
    propertyNameDe: 'Immobilienname (Deutsch)',
    leaveEmptyForEnglish: 'Leer lassen für englischen Namen',
    houseTypeEn: 'Haustyp (Englisch)',
    houseTypeDe: 'Haustyp (Deutsch)',
    useEnglish: '— Englisch verwenden —',
    shortDescEn: 'Kurzbeschreibung (Englisch)',
    shortDescDe: 'Kurzbeschreibung (Deutsch)',
    fullDescEn: 'Vollständige Beschreibung (Englisch)',
    fullDescDe: 'Vollständige Beschreibung (Deutsch)',
    
    // Basic Info
    basicInfo: 'Grundinformationen',
    urlSlug: 'URL-Slug',
    urlSlugHint: 'Verwendet in der Immobilien-URL (automatisch aus Name generiert)',
    websiteUrl: 'Website-URL',
    
    // License
    licenseInfo: 'Lizenzinformationen',
    licenseNumber: 'Lizenznummer',
    registryNumber: 'Registernummer',
    
    // Location
    location: 'Standort',
    address: 'Adresse',
    city: 'Stadt',
    region: 'Region',
    country: 'Land',
    latitude: 'Breitengrad',
    longitude: 'Längengrad',
    
    // Property Details
    propertyDetails: 'Immobiliendetails',
    bedrooms: 'Schlafzimmer',
    bathrooms: 'Badezimmer',
    maxGuests: 'Max. Gäste',
    minStay: 'Mindestaufenthalt (Nächte)',
    
    // Pricing
    pricing: 'Preise',
    pricePerWeekLow: 'Preis/Woche (Nebensaison)',
    pricePerWeekHigh: 'Preis/Woche (Hauptsaison)',
    
    // Amenities
    amenities: 'Ausstattung',
    privatePool: 'Privater Pool',
    seaView: 'Meerblick',
    airConditioning: 'Klimaanlage',
    heating: 'Heizung',
    wifi: 'WLAN',
    beachfront: 'Strandlage',
    
    // Distances
    nearbyDistances: 'Entfernungen',
    distanceHint: 'Entfernung/Zeit zu wichtigen Orten (z.B. "5 min", "10 min", "2 km")',
    beach: 'Strand',
    restaurants: 'Restaurants',
    oldTown: 'Altstadt',
    airport: 'Flughafen',
    
    // Status
    status: 'Status',
    activeVisible: 'Aktiv (Auf Website sichtbar)',
    featured: 'Empfohlene Immobilie',
    
    // Images
    uploadImages: 'Bilder hochladen',
    dragDropImages: 'Bilder hierher ziehen oder klicken zum Durchsuchen',
    selectAll: 'Alle auswählen',
    deselectAll: 'Auswahl aufheben',
    deleteSelected: 'Ausgewählte löschen',
    setAsFeatured: 'Als Titelbild setzen',
    
    // Availability
    addPeriod: 'Zeitraum hinzufügen',
    startDate: 'Startdatum',
    endDate: 'Enddatum',
    pricePerWeek: 'Preis/Woche',
    delete: 'Löschen',
    
    // Messages
    propertyCreated: 'Immobilie erfolgreich erstellt!',
    propertySaved: 'Immobilie erfolgreich gespeichert!',
    propertyDeleted: 'Immobilie erfolgreich gelöscht!',
    errorSaving: 'Fehler beim Speichern der Immobilie',
    confirmDelete: 'Sind Sie sicher, dass Sie diese Immobilie löschen möchten?',
    
    // Inquiries
    allInquiries: 'Alle Anfragen',
    newInquiry: 'Neu',
    contacted: 'Kontaktiert',
    closed: 'Geschlossen',
    noInquiries: 'Noch keine Anfragen',
    
    // Customers
    allCustomers: 'Alle Kunden',
    addCustomer: 'Kunde hinzufügen',
    noCustomers: 'Noch keine Kunden',
  }
}

type AdminLocale = 'en' | 'de'
type AdminTranslationKey = keyof typeof adminTranslations.en

interface AdminLocaleContextType {
  locale: AdminLocale
  setLocale: (locale: AdminLocale) => void
  t: (key: AdminTranslationKey) => string
}

const AdminLocaleContext = createContext<AdminLocaleContextType | null>(null)

export function AdminLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>('en')

  // Load saved locale from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('admin_locale') as AdminLocale
    if (saved && (saved === 'en' || saved === 'de')) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (newLocale: AdminLocale) => {
    setLocaleState(newLocale)
    localStorage.setItem('admin_locale', newLocale)
  }

  const t = (key: AdminTranslationKey): string => {
    return adminTranslations[locale][key] || adminTranslations.en[key] || key
  }

  return (
    <AdminLocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </AdminLocaleContext.Provider>
  )
}

export function useAdminLocale() {
  const context = useContext(AdminLocaleContext)
  if (!context) {
    throw new Error('useAdminLocale must be used within AdminLocaleProvider')
  }
  return context
}

