import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
import './globals.css'

const SITE_URL = 'https://primeluxurystays.com'
// Used for link previews (iMessage/SMS/social)
const SHARE_IMAGE = 'https://storage.googleapis.com/primeluxurystays/Company%20Logo'
// Used for browser tab / search bar icon
const FAVICON_IMAGE =
  'https://storage.googleapis.com/primeluxurystays/Logo%20no%20text%20(global%20header).png'

export const metadata: Metadata = {
  title: 'Prime Luxury Stays | Exclusive Villas & Estates',
  description: 'Experience unparalleled luxury with our curated collection of exclusive villas, estates, and private residences across the world\'s most coveted destinations.',
  keywords: 'luxury villas, exclusive estates, private residences, luxury rentals, premium vacation homes',
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [{ url: FAVICON_IMAGE }],
    apple: [{ url: FAVICON_IMAGE }],
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Prime Luxury Stays',
    title: 'Prime Luxury Stays | Exclusive Villas & Estates',
    description:
      'Experience unparalleled luxury with our curated collection of exclusive villas, estates, and private residences across the world\'s most coveted destinations.',
    images: [
      {
        url: SHARE_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Prime Luxury Stays',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prime Luxury Stays | Exclusive Villas & Estates',
    description:
      'Experience unparalleled luxury with our curated collection of exclusive villas, estates, and private residences across the world\'s most coveted destinations.',
    images: [SHARE_IMAGE],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}

