import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ServicePageClient from './ServicePageClient'

// Service data with full details including German translations
const servicesData: Record<string, {
  title: string
  titleDe: string
  subtitle: string
  subtitleDe: string
  description: string
  descriptionDe: string
  heroImage: string
  features: string[]
  featuresDe: string[]
  benefits: { title: string; titleDe: string; description: string; descriptionDe: string }[]
}> = {
  'private-aviation': {
    title: 'Private Aviation',
    titleDe: 'Privatflüge',
    subtitle: 'Seamless Private Jet Travel',
    subtitleDe: 'Nahtlose Privatjet-Reisen',
    description: 'Arrive in style with our private aviation services. From light jets for quick island hops to long-range aircraft for intercontinental travel, we arrange every detail of your journey.',
    descriptionDe: 'Kommen Sie mit Stil an mit unseren Privatflug-Services. Von leichten Jets für schnelle Inselsprünge bis hin zu Langstreckenflugzeugen für interkontinentale Reisen – wir arrangieren jedes Detail Ihrer Reise.',
    heroImage: 'https://storage.googleapis.com/primeluxurystays/4-elements/images/1766934297408-New_built_villa_Alcudia_ref_7724_-_night_shots_-_-21_result_12.32.15.webp',
    features: [
      'Access to 5,000+ private aircraft worldwide',
      'Flexible scheduling on your timeline',
      'VIP terminal and customs fast-track',
      'In-flight catering to your preferences',
      'Pet-friendly travel arrangements',
      'Multi-leg journey coordination',
    ],
    featuresDe: [
      'Zugang zu über 5.000 Privatflugzeugen weltweit',
      'Flexible Terminplanung nach Ihrem Zeitplan',
      'VIP-Terminal und beschleunigte Zollabfertigung',
      'Bordverpflegung nach Ihren Wünschen',
      'Haustierfreundliche Reiseorganisation',
      'Koordination von Mehretappen-Reisen',
    ],
    benefits: [
      { title: 'Time Efficiency', titleDe: 'Zeiteffizienz', description: 'Skip commercial airports and fly direct', descriptionDe: 'Umgehen Sie kommerzielle Flughäfen und fliegen Sie direkt' },
      { title: 'Complete Privacy', titleDe: 'Vollständige Privatsphäre', description: 'Travel with discretion and comfort', descriptionDe: 'Reisen Sie diskret und komfortabel' },
      { title: 'Flexible Scheduling', titleDe: 'Flexible Terminplanung', description: 'Depart when it suits you', descriptionDe: 'Abflug, wann es Ihnen passt' },
    ],
  },
  'private-chef': {
    title: 'Private Chef',
    titleDe: 'Privatkoch',
    subtitle: 'Culinary Excellence at Your Residence',
    subtitleDe: 'Kulinarische Exzellenz in Ihrer Residenz',
    description: 'Indulge in world-class cuisine without leaving your villa. Our network of Michelin-trained private chefs create bespoke dining experiences tailored to your tastes and dietary requirements.',
    descriptionDe: 'Genießen Sie Weltklasse-Küche, ohne Ihre Villa zu verlassen. Unser Netzwerk von Michelin-ausgebildeten Privatköchen kreiert maßgeschneiderte Genusserlebnisse, abgestimmt auf Ihren Geschmack und Ihre Ernährungsanforderungen.',
    heroImage: 'https://storage.googleapis.com/primeluxurystays/la-salve/images/1766937633626-ls17-602-marcgilsdorf_result_12.40.11.webp',
    features: [
      'Michelin-trained private chefs',
      'Customized menus to your preferences',
      'Local and seasonal ingredients',
      'Wine pairing consultation',
      'Special dietary accommodations',
      'Cooking classes available',
    ],
    featuresDe: [
      'Michelin-ausgebildete Privatköche',
      'Maßgeschneiderte Menüs nach Ihren Wünschen',
      'Lokale und saisonale Zutaten',
      'Weinberatung und Paarungsempfehlungen',
      'Berücksichtigung spezieller Ernährungsanforderungen',
      'Kochkurse verfügbar',
    ],
    benefits: [
      { title: 'Restaurant Quality', titleDe: 'Restaurantqualität', description: 'Fine dining in the comfort of your villa', descriptionDe: 'Gehobene Küche im Komfort Ihrer Villa' },
      { title: 'Personalized Menus', titleDe: 'Personalisierte Menüs', description: 'Every meal crafted to your taste', descriptionDe: 'Jede Mahlzeit nach Ihrem Geschmack zubereitet' },
      { title: 'Intimate Dining', titleDe: 'Intimes Dinner', description: 'Perfect for celebrations and gatherings', descriptionDe: 'Perfekt für Feiern und Zusammenkünfte' },
    ],
  },
  'luxury-transport': {
    title: 'Luxury Transport',
    titleDe: 'Luxustransport',
    subtitle: 'Premium Vehicles & Chauffeur Services',
    subtitleDe: 'Premium-Fahrzeuge & Chauffeurservice',
    description: 'Travel in style with our fleet of luxury vehicles. From supercars for coastal drives to chauffeur-driven limousines for elegant arrivals, we ensure every journey is exceptional.',
    descriptionDe: 'Reisen Sie stilvoll mit unserer Flotte von Luxusfahrzeugen. Von Supersportwagen für Küstenfahrten bis hin zu Limousinen mit Chauffeur für elegante Ankünfte – wir sorgen dafür, dass jede Fahrt außergewöhnlich ist.',
    heroImage: 'https://storage.googleapis.com/primeluxurystays/villa-del-mar/images/1767466932071-Kopie_von_2c3d6789-1a64-492e-895a-1d13fcbd9aea_result_22.48.41.webp',
    features: [
      'Ferrari, Lamborghini, Porsche available',
      'Professional chauffeur services',
      'Airport transfers in luxury vehicles',
      'Multi-day rentals available',
      'Child seats and accessibility options',
      'Full insurance coverage included',
    ],
    featuresDe: [
      'Ferrari, Lamborghini, Porsche verfügbar',
      'Professioneller Chauffeurservice',
      'Flughafentransfers in Luxusfahrzeugen',
      'Mehrtägige Vermietungen möglich',
      'Kindersitze und Barrierefreiheitsoptionen',
      'Vollständiger Versicherungsschutz inklusive',
    ],
    benefits: [
      { title: 'Prestigious Fleet', titleDe: 'Prestigeträchtige Flotte', description: 'Access to the world\'s finest vehicles', descriptionDe: 'Zugang zu den besten Fahrzeugen der Welt' },
      { title: 'Professional Drivers', titleDe: 'Professionelle Fahrer', description: 'Experienced, discreet chauffeurs', descriptionDe: 'Erfahrene, diskrete Chauffeure' },
      { title: 'Flexibility', titleDe: 'Flexibilität', description: 'Self-drive or chauffeur-driven options', descriptionDe: 'Selbstfahrer- oder Chauffeur-Optionen' },
    ],
  },
  'privacy-security': {
    title: 'Privacy & Security',
    titleDe: 'Privatsphäre & Sicherheit',
    subtitle: 'Discreet Protection for Your Peace of Mind',
    subtitleDe: 'Diskrete Sicherheit für Ihren Seelenfrieden',
    description: 'Your privacy is paramount. Our security services ensure complete confidentiality and peace of mind, with discreet protection arrangements tailored to your requirements.',
    descriptionDe: 'Ihre Privatsphäre ist uns wichtig. Unsere Sicherheitsdienste gewährleisten vollständige Vertraulichkeit und Seelenfrieden mit diskreten Schutzarrangements, die auf Ihre Anforderungen zugeschnitten sind.',
    heroImage: 'https://storage.googleapis.com/primeluxurystays/sunset-dreams/images/1767546840732-PROTEA32_result_22.48.12.webp',
    features: [
      'Vetted security personnel',
      'Secure transportation arrangements',
      'Privacy screening for properties',
      'Confidential travel coordination',
      'Emergency response protocols',
      'NDAs for all service staff',
    ],
    featuresDe: [
      'Überprüftes Sicherheitspersonal',
      'Sichere Transportarrangements',
      'Privatsphäre-Screening für Immobilien',
      'Vertrauliche Reisekoordination',
      'Notfall-Reaktionsprotokolle',
      'Geheimhaltungsvereinbarungen für alle Servicemitarbeiter',
    ],
    benefits: [
      { title: 'Complete Discretion', titleDe: 'Vollständige Diskretion', description: 'Your stay remains private', descriptionDe: 'Ihr Aufenthalt bleibt privat' },
      { title: 'Professional Team', titleDe: 'Professionelles Team', description: 'Experienced security specialists', descriptionDe: 'Erfahrene Sicherheitsspezialisten' },
      { title: 'Peace of Mind', titleDe: 'Seelenfrieden', description: 'Relax knowing you\'re protected', descriptionDe: 'Entspannen Sie in dem Wissen, dass Sie geschützt sind' },
    ],
  },
  'yacht-charter': {
    title: 'Yacht Charter',
    titleDe: 'Yachtcharter',
    subtitle: 'Luxury Sailing Experiences',
    subtitleDe: 'Luxuriöse Segelerlebnisse',
    description: 'Set sail on the Mediterranean aboard a luxury yacht. From intimate day sails to week-long voyages, explore hidden coves, pristine beaches, and coastal gems in ultimate style.',
    descriptionDe: 'Setzen Sie die Segel auf dem Mittelmeer an Bord einer Luxusyacht. Von intimen Tagesausflügen bis hin zu wochenlangen Reisen – erkunden Sie versteckte Buchten, unberührte Strände und Küstenjuwelen im ultimativen Stil.',
    heroImage: 'https://storage.googleapis.com/primeluxurystays/villa-dos-torres/images/1766504261465-Outdoor1.jpg',
    features: [
      'Motor yachts and sailing vessels',
      'Professional captain and crew',
      'Onboard chef and catering',
      'Water toys and equipment included',
      'Custom itinerary planning',
      'Day trips or extended charters',
    ],
    featuresDe: [
      'Motoryachten und Segelschiffe',
      'Professioneller Kapitän und Crew',
      'Koch an Bord und Catering',
      'Wassersportgeräte und Ausrüstung inklusive',
      'Individuelle Routenplanung',
      'Tagesausflüge oder mehrtägige Charter',
    ],
    benefits: [
      { title: 'Freedom to Explore', titleDe: 'Freiheit zu erkunden', description: 'Access secluded bays and islands', descriptionDe: 'Zugang zu abgelegenen Buchten und Inseln' },
      { title: 'Full Service', titleDe: 'Vollständiger Service', description: 'Captain, crew, and chef included', descriptionDe: 'Kapitän, Crew und Koch inklusive' },
      { title: 'Bespoke Journeys', titleDe: 'Maßgeschneiderte Reisen', description: 'Every voyage tailored to you', descriptionDe: 'Jede Reise auf Sie zugeschnitten' },
    ],
  },
  'helicopter': {
    title: 'Helicopter Transport',
    titleDe: 'Helikoptertransfer',
    subtitle: 'Swift Transfers & Scenic Tours',
    subtitleDe: 'Schnelle Transfers & malerische Touren',
    description: 'Experience the islands from above with our helicopter services. Whether for swift airport transfers or breathtaking scenic tours, see the Mediterranean from an exclusive perspective.',
    descriptionDe: 'Erleben Sie die Inseln von oben mit unserem Helikopterservice. Ob für schnelle Flughafentransfers oder atemberaubende Panoramaflüge – sehen Sie das Mittelmeer aus einer exklusiven Perspektive.',
    heroImage: 'https://storage.googleapis.com/primeluxurystays/vista-malgrat/images/1765716787066-_DSC4726.jpg',
    features: [
      'Airport and inter-island transfers',
      'Scenic coastal and mountain tours',
      'Private helipads at select properties',
      'Photography and video flights',
      'Golf course transfers',
      'Emergency medical transport',
    ],
    featuresDe: [
      'Flughafen- und Inseltransfers',
      'Malerische Küsten- und Bergtouren',
      'Private Hubschrauberlandeplätze bei ausgewählten Immobilien',
      'Foto- und Videoflüge',
      'Transfers zu Golfplätzen',
      'Medizinischer Notfalltransport',
    ],
    benefits: [
      { title: 'Save Time', titleDe: 'Zeit sparen', description: 'Skip traffic with aerial transfers', descriptionDe: 'Umgehen Sie Verkehr mit Lufttransfers' },
      { title: 'Stunning Views', titleDe: 'Atemberaubende Aussichten', description: 'See the islands from above', descriptionDe: 'Sehen Sie die Inseln von oben' },
      { title: 'Exclusive Access', titleDe: 'Exklusiver Zugang', description: 'Reach remote locations with ease', descriptionDe: 'Erreichen Sie abgelegene Orte mit Leichtigkeit' },
    ],
  },
  'table-reservations': {
    title: 'Table Reservations',
    titleDe: 'Tischreservierungen',
    subtitle: 'Priority Access to the Finest Dining',
    subtitleDe: 'Prioritätszugang zu den besten Restaurants',
    description: 'Secure tables at the most sought-after restaurants and exclusive dining venues. Our relationships with top establishments ensure priority bookings, even at fully-booked locations.',
    descriptionDe: 'Sichern Sie sich Tische in den gefragtesten Restaurants und exklusiven Dinner-Locations. Unsere Beziehungen zu Top-Restaurants gewährleisten Prioritätsbuchungen, auch bei ausgebuchten Locations.',
    heroImage: 'https://storage.googleapis.com/primeluxurystays/eden-roc/images/1766935867677-MR20230606017_result_12.38.51.webp',
    features: [
      'Priority bookings at Michelin-starred restaurants',
      'Exclusive chef\'s table experiences',
      'Private dining room arrangements',
      'Special occasion celebrations',
      'Dietary requirements coordinated in advance',
      'Last-minute reservation assistance',
    ],
    featuresDe: [
      'Prioritätsbuchungen in Michelin-Sternerestaurants',
      'Exklusive Chef\'s Table Erlebnisse',
      'Arrangements für private Speiseräume',
      'Feiern besonderer Anlässe',
      'Vorabkoordination von Ernährungsanforderungen',
      'Unterstützung bei kurzfristigen Reservierungen',
    ],
    benefits: [
      { title: 'VIP Access', titleDe: 'VIP-Zugang', description: 'Tables at fully-booked restaurants', descriptionDe: 'Tische in ausgebuchten Restaurants' },
      { title: 'Local Connections', titleDe: 'Lokale Verbindungen', description: 'Insider relationships with top venues', descriptionDe: 'Insider-Beziehungen zu Top-Locations' },
      { title: 'Seamless Planning', titleDe: 'Nahtlose Planung', description: 'All details handled for you', descriptionDe: 'Alle Details werden für Sie erledigt' },
    ],
  },
  'travel-bookings': {
    title: 'Travel Bookings',
    titleDe: 'Reisebuchungen',
    subtitle: 'Luxury Accommodations Beyond Your Villa',
    subtitleDe: 'Luxusunterkünfte über Ihre Villa hinaus',
    description: 'Extend your journey with seamless hotel and travel arrangements. Whether you\'re island hopping or exploring the mainland, we coordinate luxury accommodations and travel logistics worldwide.',
    descriptionDe: 'Verlängern Sie Ihre Reise mit nahtlosen Hotel- und Reisearrangements. Ob Inselhopping oder Erkundung des Festlands – wir koordinieren Luxusunterkünfte und Reiselogistik weltweit.',
    heroImage: 'https://storage.googleapis.com/primeluxurystays/sa-vinya/images/1765721341526-Sa_Vinya.jpg',
    features: [
      'Luxury hotel reservations worldwide',
      'Multi-destination itinerary planning',
      'Boutique and five-star properties',
      'Suite upgrades and VIP amenities',
      'Travel insurance coordination',
      'Complete trip logistics management',
    ],
    featuresDe: [
      'Luxushotelreservierungen weltweit',
      'Mehrziel-Reiseplanung',
      'Boutique- und Fünf-Sterne-Hotels',
      'Suite-Upgrades und VIP-Annehmlichkeiten',
      'Koordination der Reiseversicherung',
      'Vollständiges Reiselogistik-Management',
    ],
    benefits: [
      { title: 'Global Network', titleDe: 'Globales Netzwerk', description: 'Access to the world\'s finest hotels', descriptionDe: 'Zugang zu den besten Hotels der Welt' },
      { title: 'Preferred Rates', titleDe: 'Vorzugspreise', description: 'Exclusive pricing and upgrades', descriptionDe: 'Exklusive Preise und Upgrades' },
      { title: 'End-to-End Service', titleDe: 'Rundum-Service', description: 'Your entire journey coordinated', descriptionDe: 'Ihre gesamte Reise wird koordiniert' },
    ],
  },
}

export async function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = servicesData[params.slug]
  if (!service) return { title: 'Service Not Found' }

  return {
    title: `${service.title} | Prime Luxury Stays`,
    description: service.description,
    openGraph: {
      title: `${service.title} | Prime Luxury Stays`,
      description: service.description,
      images: [service.heroImage],
    },
  }
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = servicesData[params.slug]

  if (!service) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <ServicePageClient service={service} slug={slug} />
      <Footer />
    </main>
  )
}
