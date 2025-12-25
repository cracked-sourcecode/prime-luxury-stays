import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ServicePageClient from './ServicePageClient'

// Service data with full details
const servicesData: Record<string, {
  title: string
  subtitle: string
  description: string
  heroImage: string
  features: string[]
  benefits: { title: string; description: string }[]
}> = {
  'concierge': {
    title: 'Personal Concierge',
    subtitle: 'Your Dedicated Luxury Lifestyle Manager',
    description: 'Experience the ultimate in personalized service with our dedicated concierge team. Available around the clock, our luxury lifestyle managers anticipate your every need and transform the impossible into the effortless.',
    heroImage: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1920&q=80',
    features: [
      'Available 24/7 throughout your stay',
      'Pre-arrival planning and preparation',
      'Restaurant reservations at exclusive venues',
      'Event tickets and VIP access',
      'Personal shopping and gift sourcing',
      'Travel arrangements and itinerary planning',
    ],
    benefits: [
      { title: 'Dedicated Manager', description: 'One point of contact who knows your preferences' },
      { title: 'Local Expertise', description: 'Insider knowledge of the best experiences' },
      { title: 'Seamless Service', description: 'Everything arranged before you even ask' },
    ],
  },
  'private-aviation': {
    title: 'Private Aviation',
    subtitle: 'Seamless Private Jet Travel',
    description: 'Arrive in style with our private aviation services. From light jets for quick island hops to long-range aircraft for intercontinental travel, we arrange every detail of your journey.',
    heroImage: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1920&q=80',
    features: [
      'Access to 5,000+ private aircraft worldwide',
      'Flexible scheduling on your timeline',
      'VIP terminal and customs fast-track',
      'In-flight catering to your preferences',
      'Pet-friendly travel arrangements',
      'Multi-leg journey coordination',
    ],
    benefits: [
      { title: 'Time Efficiency', description: 'Skip commercial airports and fly direct' },
      { title: 'Complete Privacy', description: 'Travel with discretion and comfort' },
      { title: 'Flexible Scheduling', description: 'Depart when it suits you' },
    ],
  },
  'private-chef': {
    title: 'Private Chef',
    subtitle: 'Culinary Excellence at Your Residence',
    description: 'Indulge in world-class cuisine without leaving your villa. Our network of Michelin-trained private chefs create bespoke dining experiences tailored to your tastes and dietary requirements.',
    heroImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&q=80',
    features: [
      'Michelin-trained private chefs',
      'Customized menus to your preferences',
      'Local and seasonal ingredients',
      'Wine pairing consultation',
      'Special dietary accommodations',
      'Cooking classes available',
    ],
    benefits: [
      { title: 'Restaurant Quality', description: 'Fine dining in the comfort of your villa' },
      { title: 'Personalized Menus', description: 'Every meal crafted to your taste' },
      { title: 'Intimate Dining', description: 'Perfect for celebrations and gatherings' },
    ],
  },
  'luxury-transport': {
    title: 'Luxury Transport',
    subtitle: 'Premium Vehicles & Chauffeur Services',
    description: 'Travel in style with our fleet of luxury vehicles. From supercars for coastal drives to chauffeur-driven limousines for elegant arrivals, we ensure every journey is exceptional.',
    heroImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80',
    features: [
      'Ferrari, Lamborghini, Porsche available',
      'Professional chauffeur services',
      'Airport transfers in luxury vehicles',
      'Multi-day rentals available',
      'Child seats and accessibility options',
      'Full insurance coverage included',
    ],
    benefits: [
      { title: 'Prestigious Fleet', description: 'Access to the world\'s finest vehicles' },
      { title: 'Professional Drivers', description: 'Experienced, discreet chauffeurs' },
      { title: 'Flexibility', description: 'Self-drive or chauffeur-driven options' },
    ],
  },
  'experiences': {
    title: 'Curated Experiences',
    subtitle: 'Exclusive Access to the Extraordinary',
    description: 'Discover experiences that money alone cannot buy. From private gallery viewings to exclusive restaurant takeovers, we open doors to the world\'s most coveted experiences.',
    heroImage: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1920&q=80',
    features: [
      'Private museum and gallery tours',
      'Exclusive restaurant experiences',
      'VIP event and concert access',
      'Behind-the-scenes cultural tours',
      'Adventure and wellness retreats',
      'Local artisan encounters',
    ],
    benefits: [
      { title: 'Exclusive Access', description: 'Experiences unavailable to the public' },
      { title: 'Local Connections', description: 'Meet the people behind the places' },
      { title: 'Tailored Itineraries', description: 'Every experience matched to your interests' },
    ],
  },
  'privacy-security': {
    title: 'Privacy & Security',
    subtitle: 'Discreet Protection for Your Peace of Mind',
    description: 'Your privacy is paramount. Our security services ensure complete confidentiality and peace of mind, with discreet protection arrangements tailored to your requirements.',
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
    features: [
      'Vetted security personnel',
      'Secure transportation arrangements',
      'Privacy screening for properties',
      'Confidential travel coordination',
      'Emergency response protocols',
      'NDAs for all service staff',
    ],
    benefits: [
      { title: 'Complete Discretion', description: 'Your stay remains private' },
      { title: 'Professional Team', description: 'Experienced security specialists' },
      { title: 'Peace of Mind', description: 'Relax knowing you\'re protected' },
    ],
  },
  'yacht-charter': {
    title: 'Yacht Charter',
    subtitle: 'Luxury Sailing Experiences',
    description: 'Set sail on the Mediterranean aboard a luxury yacht. From intimate day sails to week-long voyages, explore hidden coves, pristine beaches, and coastal gems in ultimate style.',
    heroImage: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1920&q=80',
    features: [
      'Motor yachts and sailing vessels',
      'Professional captain and crew',
      'Onboard chef and catering',
      'Water toys and equipment included',
      'Custom itinerary planning',
      'Day trips or extended charters',
    ],
    benefits: [
      { title: 'Freedom to Explore', description: 'Access secluded bays and islands' },
      { title: 'Full Service', description: 'Captain, crew, and chef included' },
      { title: 'Bespoke Journeys', description: 'Every voyage tailored to you' },
    ],
  },
  'helicopter': {
    title: 'Helicopter Transport',
    subtitle: 'Swift Transfers & Scenic Tours',
    description: 'Experience the islands from above with our helicopter services. Whether for swift airport transfers or breathtaking scenic tours, see the Mediterranean from an exclusive perspective.',
    heroImage: 'https://images.unsplash.com/photo-1534321238895-da3ab632df3e?w=1920&q=80',
    features: [
      'Airport and inter-island transfers',
      'Scenic coastal and mountain tours',
      'Private helipads at select properties',
      'Photography and video flights',
      'Golf course transfers',
      'Emergency medical transport',
    ],
    benefits: [
      { title: 'Save Time', description: 'Skip traffic with aerial transfers' },
      { title: 'Stunning Views', description: 'See the islands from above' },
      { title: 'Exclusive Access', description: 'Reach remote locations with ease' },
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
      <ServicePageClient service={service} />
      <Footer />
    </main>
  )
}

