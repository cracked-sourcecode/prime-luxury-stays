'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Home, Mail, Phone, Search } from 'lucide-react'
import type { AdminUser } from '@/lib/admin'
import type { Inquiry } from '@/lib/inquiries'
import { AdminBrand } from '@/components/admin/AdminBrand'

export default function AdminInquiries({
  user,
  inquiries,
}: {
  user: AdminUser
  inquiries: Inquiry[]
}) {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    if (!qq) return inquiries
    return inquiries.filter((i) => {
      return (
        i.full_name.toLowerCase().includes(qq) ||
        i.email.toLowerCase().includes(qq) ||
        (i.phone ?? '').toLowerCase().includes(qq) ||
        (i.property_name ?? '').toLowerCase().includes(qq) ||
        (i.property_slug ?? '').toLowerCase().includes(qq)
      )
    })
  }, [inquiries, q])

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="sticky top-0 z-50 border-b border-cream-200/70 bg-white/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <AdminBrand subtitle="Admin" />
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-2 rounded-xl text-charcoal-700 hover:text-gold-700 hover:bg-gold-50 transition-colors flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">View site</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-merriweather text-3xl text-charcoal-900">Inquiries</h1>
            <p className="text-charcoal-500 mt-1">
              New leads submitted from the booking inquiry page.
            </p>
          </div>
          <div className="text-sm text-charcoal-500">
            Signed in as <span className="font-semibold">{user.name || user.email}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-cream-200 bg-cream-50/60">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, email, phone, property…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-200 bg-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-10 text-center text-charcoal-500">No inquiries found.</div>
          ) : (
            <div className="divide-y divide-cream-200">
              {filtered.map((i) => (
                <div key={i.id} className="p-6 hover:bg-cream-50/70 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-semibold text-charcoal-900 text-lg truncate">
                          {i.full_name}
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-gold-50 border border-gold-100 text-gold-700 font-semibold">
                          {i.status}
                        </span>
                        {i.property_name ? (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-cream-100 border border-cream-200 text-charcoal-700 font-semibold">
                            {i.property_name}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-charcoal-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gold-600" />
                          <a className="hover:text-gold-700" href={`mailto:${i.email}`}>
                            {i.email}
                          </a>
                        </div>
                        {i.phone ? (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gold-600" />
                            <a className="hover:text-gold-700" href={`tel:${i.phone}`}>
                              {i.phone}
                            </a>
                          </div>
                        ) : null}
                      </div>

                      {(i.check_in || i.check_out || i.guests) && (
                        <div className="mt-3 text-sm text-charcoal-500">
                          {i.check_in ? <span>Check-in: {i.check_in} </span> : null}
                          {i.check_out ? <span> • Check-out: {i.check_out} </span> : null}
                          {i.guests ? <span> • Guests: {i.guests}</span> : null}
                        </div>
                      )}

                      {i.message ? (
                        <div className="mt-4 rounded-2xl bg-cream-50 border border-cream-200 p-4 text-charcoal-700">
                          {i.message}
                        </div>
                      ) : null}
                    </div>

                    <div className="text-xs text-charcoal-400 whitespace-nowrap">
                      {new Date(i.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


