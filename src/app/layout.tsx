import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prime Luxury Stays | Exclusive Villas & Estates',
  description: 'Experience unparalleled luxury with our curated collection of exclusive villas, estates, and private residences across the world\'s most coveted destinations.',
  keywords: 'luxury villas, exclusive estates, private residences, luxury rentals, premium vacation homes',
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

