'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Mail, ArrowRight, AlertCircle, Shield } from 'lucide-react'
import { AdminBrand } from '@/components/admin/AdminBrand'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (data.success) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-6 py-12 bg-charcoal-900 relative overflow-hidden">
      {/* ambient glow */}
      <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gold-500/20 blur-[120px]" />
      <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-gold-400/10 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-[440px]">
        <div className="flex items-center justify-between mb-10">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-[0.25em] uppercase text-white/70">
              <Shield className="h-4 w-4 text-gold-400" />
              Secure Admin
            </div>
          </div>
          <Link
            href="/"
            className="text-white/60 hover:text-white transition-colors text-sm"
          >
            View site
          </Link>
        </div>

        <div className="mb-8">
          <div className="inline-flex rounded-2xl bg-white px-4 py-3 shadow-2xl shadow-black/30">
            <AdminBrand subtitle="Property Management" compact />
          </div>
          <h1 className="font-merriweather text-3xl text-white mt-6">
            Admin Portal
          </h1>
          <p className="text-white/60 mt-2">
            Sign in to manage listings, photos, and availability.
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-heavy rounded-3xl shadow-glass-lg p-7 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-charcoal-800 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all bg-white/80"
                  placeholder="admin@primeluxurystays.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal-800 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all bg-white/80"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold-500 to-gold-400 text-white py-4 rounded-2xl font-semibold hover:from-gold-400 hover:to-gold-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-gold"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-xs text-charcoal-500">
              Need access? Email{' '}
              <a
                className="text-gold-700 hover:text-gold-800 font-semibold"
                href="mailto:info@primeluxurystays.com"
              >
                info@primeluxurystays.com
              </a>
            </div>
          </form>
        </div>

        <p className="text-center text-white/40 text-sm mt-7">
          Protected area. Authorized personnel only.
        </p>
      </div>
    </div>
  )
}

