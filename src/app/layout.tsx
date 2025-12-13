import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
import './globals.css'

const SITE_URL = 'https://primeluxurystays.com'
const OG_IMAGE =
  'https://storage.googleapis.com/primeluxurystays/Logo%20no%20text%20(global%20header).png'

export const metadata: Metadata = {
  title: 'Prime Luxury Stays | Exclusive Villas & Estates',
  description: 'Experience unparalleled luxury with our curated collection of exclusive villas, estates, and private residences across the world\'s most coveted destinations.',
  keywords: 'luxury villas, exclusive estates, private residences, luxury rentals, premium vacation homes',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Prime Luxury Stays',
    title: 'Prime Luxury Stays | Exclusive Villas & Estates',
    description:
      'Experience unparalleled luxury with our curated collection of exclusive villas, estates, and private residences across the world\'s most coveted destinations.',
    images: [
      {
        url: OG_IMAGE,
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
    images: [OG_IMAGE],
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

