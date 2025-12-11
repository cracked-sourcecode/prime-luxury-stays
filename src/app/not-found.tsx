'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-merriweather text-6xl text-charcoal-900 mb-4">404</h1>
        <h2 className="font-merriweather text-2xl text-charcoal-700 mb-6">Page Not Found</h2>
        <p className="text-charcoal-500 mb-8">The page you're looking for doesn't exist.</p>
        <Link 
          href="/"
          className="bg-gold-500 text-charcoal-900 px-8 py-4 rounded-xl font-semibold hover:bg-gold-400 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}

