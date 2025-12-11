'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-merriweather text-6xl text-charcoal-900 mb-4">Oops!</h1>
        <h2 className="font-merriweather text-2xl text-charcoal-700 mb-6">Something went wrong</h2>
        <p className="text-charcoal-500 mb-8">We're sorry, but something unexpected happened.</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-gold-500 text-charcoal-900 px-8 py-4 rounded-xl font-semibold hover:bg-gold-400 transition-colors"
          >
            Try Again
          </button>
          <Link 
            href="/"
            className="bg-charcoal-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-charcoal-800 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}

