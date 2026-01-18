'use client'

import { useEffect, useState } from 'react'
import { 
  Mail, 
  Phone, 
  Calendar,
  Home,
  User,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  ChevronDown,
  PlusCircle,
  ArrowRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAdminLocale } from '@/lib/adminLocale'

interface Inquiry {
  id: number
  full_name: string
  email: string
  phone: string | null
  property_slug: string | null
  property_name: string | null
  check_in: string | null
  check_out: string | null
  guests: number | null
  message: string | null
  status: string
  created_at: string
}

export default function InquiriesPage() {
  const { t, locale } = useAdminLocale()
  const router = useRouter()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'booked' | 'closed'>('all')

  // Create deal from inquiry - navigates to deals page with pre-filled data
  function createDealFromInquiry(inquiry: Inquiry) {
    // Store inquiry data in sessionStorage for the deals page to pick up
    // Title format: "Client Name, Villa Name" or just "Client Name" if no property
    const dealData = {
      title: inquiry.property_name 
        ? `${inquiry.full_name}, ${inquiry.property_name}` 
        : inquiry.full_name,
      customer_name: inquiry.full_name,
      customer_email: inquiry.email,
      customer_phone: inquiry.phone || '',
      property_name: inquiry.property_name || '',
      property_slug: inquiry.property_slug || '',
      check_in: inquiry.check_in || '',
      check_out: inquiry.check_out || '',
      guests: inquiry.guests?.toString() || '',
      notes: inquiry.message || '',
      source: 'website_inquiry',
      inquiry_id: inquiry.id
    }
    sessionStorage.setItem('createDealFromInquiry', JSON.stringify(dealData))
    router.push('/admin/deals?create=true')
  }

  useEffect(() => {
    fetchInquiries()
  }, [])

  async function fetchInquiries() {
    try {
      const res = await fetch('/api/admin/inquiries')
      const data = await res.json()
      setInquiries(data.inquiries || [])
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: number, status: string) {
    try {
      await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      fetchInquiries()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const filteredInquiries = inquiries.filter(i => {
    if (filter === 'all') return true
    return (i.status || 'new') === filter
  })

  const statusCounts = {
    all: inquiries.length,
    new: inquiries.filter(i => !i.status || i.status === 'new').length,
    contacted: inquiries.filter(i => i.status === 'contacted').length,
    booked: inquiries.filter(i => i.status === 'booked').length,
    closed: inquiries.filter(i => i.status === 'closed').length
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-charcoal-900">{t('inquiries')}</h1>
        <p className="text-charcoal-500">{inquiries.length} {t('totalBookingRequests')}</p>
      </div>

      {/* Status Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'new', 'contacted', 'booked', 'closed'] as const).map((status) => {
            const statusLabels: Record<string, string> = {
              all: t('all'),
              new: locale === 'de' ? 'Neu' : 'New',
              contacted: t('contacted'),
              booked: t('booked'),
              closed: t('closed')
            }
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  filter === status
                    ? 'bg-gold-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {statusLabels[status]}
                <span className="ml-2 text-xs opacity-75">({statusCounts[status]})</span>
              </button>
            )
          })}
        </div>

        {/* Inquiries List */}
        <div className="space-y-4">
          {filteredInquiries.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center text-gray-500">
              {t('noInquiries')}
            </div>
          ) : (
            filteredInquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{inquiry.full_name}</h3>
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                          (!inquiry.status || inquiry.status === 'new')
                            ? 'bg-green-100 text-green-700'
                            : inquiry.status === 'contacted'
                            ? 'bg-blue-100 text-blue-700'
                            : inquiry.status === 'booked'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {inquiry.status || 'new'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1.5 hover:text-gold-600">
                          <Mail className="w-4 h-4" />
                          {inquiry.email}
                        </a>
                        {inquiry.phone && (
                          <a href={`tel:${inquiry.phone}`} className="flex items-center gap-1.5 hover:text-gold-600">
                            <Phone className="w-4 h-4" />
                            {inquiry.phone}
                          </a>
                        )}
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <Clock className="w-4 h-4" />
                          {new Date(inquiry.created_at).toLocaleDateString()} at {new Date(inquiry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {inquiry.property_name && (
                        <div className="flex items-center gap-2 text-gold-700 font-medium mb-3">
                          <Home className="w-4 h-4" />
                          {inquiry.property_name}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {inquiry.check_in && (
                          <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            {new Date(inquiry.check_in).toLocaleDateString()} → {inquiry.check_out ? new Date(inquiry.check_out).toLocaleDateString() : '—'}
                          </span>
                        )}
                        {inquiry.guests && (
                          <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                            <User className="w-4 h-4 text-gray-500" />
                            {inquiry.guests} guests
                          </span>
                        )}
                      </div>

                      {inquiry.message && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <MessageSquare className="w-4 h-4" />
                            Message
                          </div>
                          <p className="text-gray-600 text-sm whitespace-pre-wrap">{inquiry.message}</p>
                        </div>
                      )}
                    </div>

                    {/* Status Actions */}
                    <div className="flex flex-col gap-2">
                      <select
                        value={inquiry.status || 'new'}
                        onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="booked">Booked</option>
                        <option value="closed">Closed</option>
                      </select>
                      <button
                        onClick={() => createDealFromInquiry(inquiry)}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Create Deal
                      </button>
                      <a
                        href={`mailto:${inquiry.email}?subject=Re: Your inquiry for ${inquiry.property_name || 'Prime Luxury Stays'}`}
                        className="px-3 py-2 bg-gold-500 hover:bg-gold-600 text-white text-sm font-medium rounded-lg text-center transition-colors"
                      >
                        Reply
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
    </div>
  )
}
