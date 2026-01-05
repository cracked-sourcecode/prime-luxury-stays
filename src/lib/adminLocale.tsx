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
    logout: 'Sign Out',
    adminPortal: 'Admin Portal',
    adminConsole: 'Admin Console',
    viewWebsite: 'View Website',
    loggedInAs: 'Logged in as',
    
    // Dashboard
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    welcomeMessage: "Here's what's happening with your business today.",
    totalContacts: 'Total Contacts',
    propertiesCount: 'Properties',
    totalInquiries: 'Total Inquiries',
    pipelineValue: 'Pipeline Value',
    active: 'Active',
    newLabel: 'new',
    deals: 'deals',
    recentInquiries: 'Recent Inquiries',
    viewAll: 'View all',
    dealPipeline: 'Deal Pipeline',
    view: 'View',
    lead: 'Lead',
    qualified: 'Qualified',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    won: 'Won',
    lost: 'Lost',
    quickActions: 'Quick Actions',
    addProperty: 'Add Property',
    viewContacts: 'View Contacts',
    
    // Property List
    allProperties: 'All Properties',
    searchProperties: 'Search properties...',
    addNewProperty: 'Add Property',
    
    // Property Editor
    editProperty: 'Edit Property',
    newProperty: 'New Property',
    backToProperties: 'Back to Properties',
    viewLive: 'View Live',
    deleteProperty: 'Delete',
    saveProperty: 'Save Property',
    saving: 'Saving...',
    
    // Tabs
    details: 'Details',
    images: 'Images',
    availability: 'Availability & Pricing',
    
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
    featuredImageUrl: 'Featured Image URL',
    
    // Images
    uploadImages: 'Upload Images',
    dragDropImages: 'Drag and drop images here, or click to browse',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    deleteSelected: 'Delete Selected',
    setAsFeatured: 'Set as Featured',
    propertyImages: 'Property Images',
    
    // Availability
    addPeriod: 'Add Period',
    startDate: 'Start Date',
    endDate: 'End Date',
    pricePerWeek: 'Price/Week',
    delete: 'Delete',
    addAvailabilityPeriod: 'Add Availability Period',
    availabilityCalendar: 'Availability Calendar',
    periods: 'periods',
    
    // Messages
    propertyCreated: 'Property created successfully!',
    propertySaved: 'Property saved successfully!',
    propertyDeleted: 'Property deleted successfully!',
    errorSaving: 'Error saving property',
    confirmDelete: 'Are you sure you want to delete this property?',
    
    // Inquiries Page
    allInquiries: 'All Inquiries',
    newInquiry: 'New',
    contacted: 'Contacted',
    closed: 'Closed',
    booked: 'Booked',
    noInquiries: 'No inquiries yet',
    totalBookingRequests: 'total booking requests',
    all: 'All',
    
    // Customers/CRM
    allCustomers: 'All Customers',
    addCustomer: 'Add Customer',
    noCustomers: 'No customers yet',
    contacts: 'Contacts',
    dealsPipeline: 'Deals Pipeline',
    crm: 'CRM',
    totalContactsLabel: 'total contacts',
    exportCsv: 'Export CSV',
    searchByNameEmailPhone: 'Search by name, email, or phone...',
    showingResults: 'Showing',
    ofResults: 'of',
    results: 'results',
    
    // Add Customer Modal
    fullName: 'Full name',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    notes: 'Notes',
    anyNotesAboutCustomer: 'Any notes about this customer...',
    cancel: 'Cancel',
    
    // Deals Page
    dealsTitle: 'Deals',
    boardView: 'Board view',
    tableView: 'Table view',
    filters: 'Filters',
    addDeals: 'Add deals',
    dealOwner: 'Deal owner',
    createDate: 'Create date',
    lastActivityDate: 'Last activity date',
    closeDate: 'Close date',
    more: '+ More',
    advancedFilters: 'Advanced filters',
    proposalSent: 'Proposal Sent',
    negotiationsStarted: 'Negotiations Started',
    dealWon: 'Deal Won',
    dealLost: 'Deal Lost',
    amount: 'Amount',
    dealStage: 'Deal stage',
    property: 'Property',
    totalAmount: 'Total amount',
    search: 'Search',
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
    adminConsole: 'Admin-Konsole',
    viewWebsite: 'Website ansehen',
    loggedInAs: 'Angemeldet als',
    
    // Dashboard
    goodMorning: 'Guten Morgen',
    goodAfternoon: 'Guten Tag',
    goodEvening: 'Guten Abend',
    welcomeMessage: 'Hier ist, was heute in Ihrem Geschäft passiert.',
    totalContacts: 'Kontakte gesamt',
    propertiesCount: 'Immobilien',
    totalInquiries: 'Anfragen gesamt',
    pipelineValue: 'Pipeline-Wert',
    active: 'Aktiv',
    newLabel: 'neu',
    deals: 'Deals',
    recentInquiries: 'Neueste Anfragen',
    viewAll: 'Alle anzeigen',
    dealPipeline: 'Deal Pipeline',
    view: 'Ansehen',
    lead: 'Lead',
    qualified: 'Qualifiziert',
    proposal: 'Angebot',
    negotiation: 'Verhandlung',
    won: 'Gewonnen',
    lost: 'Verloren',
    quickActions: 'Schnellaktionen',
    addProperty: 'Immobilie hinzufügen',
    viewContacts: 'Kontakte anzeigen',
    
    // Property List
    allProperties: 'Alle Immobilien',
    searchProperties: 'Immobilien suchen...',
    addNewProperty: 'Immobilie hinzufügen',
    
    // Property Editor
    editProperty: 'Immobilie bearbeiten',
    newProperty: 'Neue Immobilie',
    backToProperties: 'Zurück zu Immobilien',
    viewLive: 'Live ansehen',
    deleteProperty: 'Löschen',
    saveProperty: 'Immobilie speichern',
    saving: 'Speichern...',
    
    // Tabs
    details: 'Details',
    images: 'Bilder',
    availability: 'Verfügbarkeit & Preise',
    
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
    featuredImageUrl: 'Titelbild-URL',
    
    // Images
    uploadImages: 'Bilder hochladen',
    dragDropImages: 'Bilder hierher ziehen oder klicken zum Durchsuchen',
    selectAll: 'Alle auswählen',
    deselectAll: 'Auswahl aufheben',
    deleteSelected: 'Ausgewählte löschen',
    setAsFeatured: 'Als Titelbild setzen',
    propertyImages: 'Immobilienbilder',
    
    // Availability
    addPeriod: 'Zeitraum hinzufügen',
    startDate: 'Startdatum',
    endDate: 'Enddatum',
    pricePerWeek: 'Preis/Woche',
    delete: 'Löschen',
    addAvailabilityPeriod: 'Verfügbarkeitszeitraum hinzufügen',
    availabilityCalendar: 'Verfügbarkeitskalender',
    periods: 'Zeiträume',
    
    // Messages
    propertyCreated: 'Immobilie erfolgreich erstellt!',
    propertySaved: 'Immobilie erfolgreich gespeichert!',
    propertyDeleted: 'Immobilie erfolgreich gelöscht!',
    errorSaving: 'Fehler beim Speichern der Immobilie',
    confirmDelete: 'Sind Sie sicher, dass Sie diese Immobilie löschen möchten?',
    
    // Inquiries Page
    allInquiries: 'Alle Anfragen',
    newInquiry: 'Neu',
    contacted: 'Kontaktiert',
    closed: 'Geschlossen',
    booked: 'Gebucht',
    noInquiries: 'Noch keine Anfragen',
    totalBookingRequests: 'Buchungsanfragen gesamt',
    all: 'Alle',
    
    // Customers/CRM
    allCustomers: 'Alle Kunden',
    addCustomer: 'Kontakt hinzufügen',
    noCustomers: 'Noch keine Kunden',
    contacts: 'Kontakte',
    totalContactsLabel: 'Kontakte gesamt',
    exportCsv: 'CSV exportieren',
    searchByNameEmailPhone: 'Nach Name, E-Mail oder Telefon suchen...',
    showingResults: 'Zeige',
    ofResults: 'von',
    results: 'Ergebnissen',
    
    // Add Customer Modal
    fullName: 'Vollständiger Name',
    name: 'Name',
    email: 'E-Mail',
    phone: 'Telefon',
    notes: 'Notizen',
    anyNotesAboutCustomer: 'Notizen zu diesem Kunden...',
    cancel: 'Abbrechen',
    
    // Deals Page
    dealsTitle: 'Deals',
    boardView: 'Board-Ansicht',
    tableView: 'Tabellenansicht',
    filters: 'Filter',
    addDeals: 'Deal hinzufügen',
    dealOwner: 'Deal-Inhaber',
    createDate: 'Erstellungsdatum',
    lastActivityDate: 'Letzte Aktivität',
    closeDate: 'Abschlussdatum',
    more: '+ Mehr',
    advancedFilters: 'Erweiterte Filter',
    proposalSent: 'Angebot gesendet',
    negotiationsStarted: 'Verhandlung begonnen',
    dealWon: 'Deal gewonnen',
    dealLost: 'Deal verloren',
    amount: 'Betrag',
    dealStage: 'Deal-Phase',
    property: 'Immobilie',
    totalAmount: 'Gesamtbetrag',
    search: 'Suchen',
    dealsPipeline: 'Deals Pipeline',
    crm: 'CRM',
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
  const [mounted, setMounted] = useState(false)

  // Load saved locale from URL param > localStorage on mount
  useEffect(() => {
    setMounted(true)
    
    // Check URL parameter first (like frontend does)
    const urlParams = new URLSearchParams(window.location.search)
    const langParam = urlParams.get('lang') as AdminLocale
    
    if (langParam && (langParam === 'en' || langParam === 'de')) {
      setLocaleState(langParam)
      localStorage.setItem('admin_locale', langParam)
      return
    }
    
    // Fallback to localStorage
    const saved = localStorage.getItem('admin_locale') as AdminLocale
    if (saved && (saved === 'en' || saved === 'de')) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (newLocale: AdminLocale) => {
    setLocaleState(newLocale)
    localStorage.setItem('admin_locale', newLocale)
    
    // Update URL with lang parameter (like frontend)
    const url = new URL(window.location.href)
    url.searchParams.set('lang', newLocale)
    window.history.pushState({}, '', url.toString())
  }

  const t = (key: AdminTranslationKey): string => {
    return adminTranslations[locale][key] || adminTranslations.en[key] || key
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
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
    // Return default if not in provider
    return {
      locale: 'en' as AdminLocale,
      setLocale: () => {},
      t: (key: AdminTranslationKey) => adminTranslations.en[key] || key,
    }
  }
  return context
}
