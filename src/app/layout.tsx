import type { Metadata } from 'next'
import Script from 'next/script'
import { LocaleProvider } from '@/i18n/LocaleProvider'

export const dynamic = 'force-dynamic'
import './globals.css'

const SITE_URL = 'https://primeluxurystays.com'
// Used for link previews (iMessage/SMS/social)
const SHARE_IMAGE = 'https://storage.googleapis.com/primeluxurystays/Company%20Logo'
// Logo URL for structured data (favicon handled by icon.png in src/app/)
const LOGO_IMAGE = 'https://storage.googleapis.com/primeluxurystays/Logo%20no%20text%20(global%20header).png'
// Hero image for structured data
const HERO_IMAGE = 'https://storage.googleapis.com/primeluxurystays/hero-luxury-villa.jpg'

export const metadata: Metadata = {
  title: 'Prime Luxury Stays | Exclusive Villas & Estates',
  description: 'Find your next luxury escape. Discover handpicked villas and estates in the world\'s most extraordinary destinations. Your private paradise awaits.',
  keywords: 'luxury villas, exclusive estates, private residences, luxury rentals, premium vacation homes, luxury vacation rentals, private villas',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Prime Luxury Stays',
    title: 'Prime Luxury Stays | Exclusive Villas & Estates',
    description:
      'Find your next luxury escape. Discover handpicked villas and estates in the world\'s most extraordinary destinations. Your private paradise awaits.',
    images: [
      {
        url: SHARE_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Prime Luxury Stays - Luxury Villas & Estates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prime Luxury Stays | Exclusive Villas & Estates',
    description:
      'Find your next luxury escape. Discover handpicked villas and estates in the world\'s most extraordinary destinations. Your private paradise awaits.',
    images: [SHARE_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// Schema.org structured data for rich Google search results
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Prime Luxury Stays',
  url: SITE_URL,
  logo: LOGO_IMAGE,
  image: SHARE_IMAGE,
  description: 'Find your next luxury escape. Discover handpicked villas and estates in the world\'s most extraordinary destinations.',
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: 'English',
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Prime Luxury Stays',
  url: SITE_URL,
  description: 'Find your next luxury escape. Discover handpicked villas and estates in the world\'s most extraordinary destinations.',
  publisher: {
    '@type': 'Organization',
    name: 'Prime Luxury Stays',
    logo: {
      '@type': 'ImageObject',
      url: LOGO_IMAGE,
    },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/properties?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

const travelAgencySchema = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Prime Luxury Stays',
  url: SITE_URL,
  logo: LOGO_IMAGE,
  image: [
    SHARE_IMAGE,
    HERO_IMAGE,
  ],
  description: 'Find your next luxury escape. Discover handpicked villas and estates in the world\'s most extraordinary destinations. Your private paradise awaits.',
  priceRange: '$$$$$',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '127',
    bestRating: '5',
    worstRating: '1',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script
          id="travel-agency-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(travelAgencySchema) }}
        />
      </head>
      <body className="antialiased">
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}

