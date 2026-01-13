'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Mail,
  Phone,
  Shield,
  Sparkles,
  Star,
  User,
  Users,
} from 'lucide-react'
import type { Property } from '@/lib/properties'
import DatePickerModal from '@/components/DatePickerModal'
import { useLocale } from '@/i18n/LocaleProvider'

export default function InquireClient({
  property,
  prefill,
}: {
  property: Property | null
  prefill: {
    property_slug: string | null
    check_in: string | null
    check_out: string | null
    guests: number | null
  }
}) {
  const { t, locale } = useLocale()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [checkIn, setCheckIn] = useState(prefill.check_in ?? '')
  const [checkOut, setCheckOut] = useState(prefill.check_out ?? '')
  const [guests, setGuests] = useState(prefill.guests ?? (property?.max_guests ?? 2))
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return locale === 'de' ? 'Datum wählen' : 'Select date'
    const date = new Date(dateStr)
    return date.toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const heroImage = useMemo(() => {
    return (
      property?.featured_image ||
      'https://storage.googleapis.com/primeluxurystays/Mallorca%20page%20Hero%20Section.png'
    )
  }, [property])

  const benefits = locale === 'de' ? [
    { icon: Shield, title: 'Geprüfte Villen', desc: 'Jede Immobilie persönlich besichtigt.' },
    { icon: Clock, title: 'Schnelle Antwort', desc: 'Unser Team antwortet umgehend.' },
    { icon: Sparkles, title: 'Concierge-Service', desc: 'Köche, Yachten, Transfers & mehr.' },
    { icon: Star, title: 'Bester Preis direkt', desc: 'Keine Buchungsplattform-Gebühren.' },
  ] : [
    { icon: Shield, title: 'Verified homes', desc: 'Every property is personally vetted.' },
    { icon: Clock, title: 'Fast response', desc: 'Our team responds promptly.' },
    { icon: Sparkles, title: 'Concierge service', desc: 'Chefs, yachts, transfers & more.' },
    { icon: Star, title: 'Best value direct', desc: 'No booking platform fees.' },
  ]

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '')
    return cleaned.length >= 7 && /^[\+]?[0-9]+$/.test(cleaned)
  }

  async function submit() {
    setError(null)

    // Validate email
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    // Validate phone
    if (!phone || !validatePhone(phone)) {
      setError('Please enter a valid phone number.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_slug: property?.slug ?? prefill.property_slug,
          check_in: checkIn || null,
          check_out: checkOut || null,
          guests: guests ? Number(guests) : null,
          full_name: fullName,
          email,
          phone: phone,
          message: message || null,
          source_url: typeof window !== 'undefined' ? window.location.href : null,
          locale: locale,
        }),
      })
      const data = await res.json()
      if (!data?.success) {
        setError(data?.error || 'Could not submit. Please try again.')
        return
      }
      setDone(true)
    } catch {
      setError('Could not submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-cream-50 min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-cream-200">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-charcoal-900/80" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-16">
          <div className="flex items-center justify-between mb-10">
            <Link
              href={property ? `/properties/${property.slug}` : '/mallorca'}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">
                {property 
                  ? (locale === 'de' ? 'Zurück zur Villa' : 'Back to villa')
                  : (locale === 'de' ? 'Zurück zu Mallorca' : 'Back to Mallorca')}
              </span>
            </Link>
            <a
              href="tel:+12039797309"
              className="hidden sm:inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white px-4 py-2 rounded-xl hover:bg-white/15 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-semibold">{locale === 'de' ? 'Concierge anrufen' : 'Call concierge'}</span>
            </a>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-gold-500/15 border border-gold-400/25 px-5 py-2 text-gold-200 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">
                {locale === 'de' ? 'Direktanfrage • Exklusiver Service' : 'Direct inquiry • White-glove service'}
              </span>
            </div>

            <h1 className="font-merriweather text-4xl md:text-5xl text-white leading-tight">
              {locale === 'de' ? 'Buchungsanfrage' : 'Request to Book'}
              {property ? (
                <>
                  {' '}
                  <span className="text-gold-300">{property.name}</span>
                </>
              ) : null}
            </h1>

            <p className="text-white/70 text-lg mt-4 max-w-2xl">
              {locale === 'de' 
                ? 'Senden Sie uns Ihre Wunschdaten und Präferenzen. Wir bestätigen die Verfügbarkeit, erstellen ein individuelles Angebot und finalisieren die Details direkt mit Ihnen.'
                : "Send your dates and preferences. We'll confirm availability, share a tailored quote, and finalize details with you directly."}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl border border-cream-200 p-7 md:p-10">
              <div className="flex items-start justify-between gap-6 mb-8">
                <div>
                  <h2 className="font-merriweather text-3xl text-charcoal-900">
                    {locale === 'de' ? 'Ihre Anfrage-Details' : 'Your inquiry details'}
                  </h2>
                  <p className="text-charcoal-500 mt-2">
                    {locale === 'de' 
                      ? 'Je mehr Sie uns mitteilen, desto besser können wir Ihren Aufenthalt gestalten.'
                      : 'The more you share, the better we can tailor your stay.'}
                  </p>
                </div>
                <div className="hidden md:block text-right">
                  <div className="text-xs tracking-[0.2em] uppercase text-gold-600 font-semibold">
                    {locale === 'de' ? 'Concierge-Service' : 'Concierge Service'}
                  </div>
                  <div className="text-charcoal-900 font-semibold mt-1 inline-flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold-600" />
                    {locale === 'de' ? 'Persönliche Betreuung' : 'Personal attention'}
                  </div>
                </div>
              </div>

              {done ? (
                <div className="rounded-3xl border border-gold-200 bg-gold-50 p-8">
                  <div className="flex items-center gap-3 text-gold-700 font-semibold">
                    <Check className="w-5 h-5" />
                    {locale === 'de' ? 'Anfrage gesendet' : 'Inquiry submitted'}
                  </div>
                  <p className="text-charcoal-700 mt-3">
                    {locale === 'de' 
                      ? 'Wir melden uns in Kürze bei Ihnen, um die Verfügbarkeit zu bestätigen und die nächsten Schritte zu besprechen.'
                      : "We'll reach out shortly to confirm availability and next steps."}
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <a
                      href="tel:+12039797309"
                      className="bg-charcoal-900 text-white px-6 py-3 rounded-2xl font-semibold inline-flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      {locale === 'de' ? 'Jetzt anrufen' : 'Call now'}
                    </a>
                    <Link
                      href={property ? `/properties/${property.slug}` : '/mallorca'}
                      className="border border-cream-200 px-6 py-3 rounded-2xl font-semibold text-charcoal-700 hover:bg-cream-50 transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      {locale === 'de' ? 'Zurück' : 'Back'}
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 mb-6">
                      {error}
                    </div>
                  ) : null}

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-800 mb-2">
                        {locale === 'de' ? 'Vollständiger Name*' : 'Full name*'}
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                        <input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-cream-200 bg-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                          placeholder={locale === 'de' ? 'Ihr Name' : 'Your name'}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal-800 mb-2">
                        E-Mail*
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-cream-200 bg-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                          placeholder="you@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal-800 mb-2">
                        {locale === 'de' ? 'Telefon*' : 'Phone*'}
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-cream-200 bg-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                          placeholder="+49 89 123 456 78"
                          pattern="[\+]?[0-9\s\-\(\)]{7,20}"
                          title={locale === 'de' ? 'Bitte geben Sie eine gültige Telefonnummer ein' : 'Please enter a valid phone number'}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal-800 mb-2">
                        {locale === 'de' ? 'Gäste' : 'Guests'}
                      </label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                        <input
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                          type="number"
                          min={1}
                          max={property?.max_guests ?? 20}
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-cream-200 bg-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal-800 mb-2">
                        Check-in
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowDatePicker(true)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-cream-200 bg-white hover:border-gold-400 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none text-left relative transition-colors"
                      >
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                        <span className={checkIn ? 'text-charcoal-900' : 'text-charcoal-400'}>
                          {formatDisplayDate(checkIn)}
                        </span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal-800 mb-2">
                        Check-out
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowDatePicker(true)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-cream-200 bg-white hover:border-gold-400 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none text-left relative transition-colors"
                      >
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                        <span className={checkOut ? 'text-charcoal-900' : 'text-charcoal-400'}>
                          {formatDisplayDate(checkOut)}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-charcoal-800 mb-2">
                      {locale === 'de' ? 'Notizen / Wünsche' : 'Notes / requests'}
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3.5 rounded-2xl border border-cream-200 bg-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none resize-none"
                      placeholder={locale === 'de' 
                        ? 'Gibt es etwas, das wir wissen sollten? (Feierlichkeiten, Koch, Yacht, bevorzugte Gegend, flexible Daten...)'
                        : 'Anything we should know? (celebrations, chef, yacht, preferred area, flexible dates...)'}
                    />
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={submit}
                      disabled={submitting || !fullName || !email}
                      className="btn-gold !rounded-2xl !py-4 !px-8 w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting 
                        ? (locale === 'de' ? 'Wird gesendet…' : 'Sending…') 
                        : (locale === 'de' ? 'Anfrage senden' : 'Submit inquiry')}
                    </button>
                    <div className="text-sm text-charcoal-500">
                      {locale === 'de' ? 'Lieber telefonieren? Rufen Sie an:' : 'Prefer to talk? Call'}{' '}
                      <a className="text-gold-700 font-semibold" href="tel:+4989899300​46">
                        +49 89 899 300 46
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right rail */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-cream-200 shadow-xl overflow-hidden">
              <div className="relative aspect-[16/10]">
                <img src={heroImage} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {property ? (
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="font-merriweather text-2xl">{property.name}</div>
                    <div className="text-white/80 mt-1">
                      {property.city}, Mallorca • {property.house_type}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {property?.bedrooms ? (
                    <div className="rounded-2xl bg-cream-50 border border-cream-200 px-4 py-3">
                      <div className="text-charcoal-500">{locale === 'de' ? 'Schlafzimmer' : 'Bedrooms'}</div>
                      <div className="font-semibold text-charcoal-900">{property.bedrooms}</div>
                    </div>
                  ) : null}
                  {property?.max_guests ? (
                    <div className="rounded-2xl bg-cream-50 border border-cream-200 px-4 py-3">
                      <div className="text-charcoal-500">{locale === 'de' ? 'Gäste' : 'Guests'}</div>
                      <div className="font-semibold text-charcoal-900">{locale === 'de' ? `Bis zu ${property.max_guests}` : `Up to ${property.max_guests}`}</div>
                    </div>
                  ) : null}
                  <div className="rounded-2xl bg-cream-50 border border-cream-200 px-4 py-3">
                    <div className="text-charcoal-500">{locale === 'de' ? 'Buchung' : 'Booking'}</div>
                    <div className="font-semibold text-charcoal-900">{locale === 'de' ? 'Direktanfrage' : 'Direct inquiry'}</div>
                  </div>
                  <div className="rounded-2xl bg-cream-50 border border-cream-200 px-4 py-3">
                    <div className="text-charcoal-500">{locale === 'de' ? 'Betreuung' : 'Support'}</div>
                    <div className="font-semibold text-charcoal-900">{locale === 'de' ? 'Persönlicher Concierge' : 'Dedicated concierge'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-charcoal-900 rounded-3xl p-7 text-white relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-gold-500/20 rounded-full blur-[90px]" />
              <div className="relative">
                <div className="text-gold-300 text-xs tracking-[0.25em] uppercase font-semibold">
                  {locale === 'de' ? 'Warum bei uns buchen' : 'Why book with us'}
                </div>
                <h3 className="font-merriweather text-2xl mt-3">
                  {locale === 'de' ? 'Ein persönliches Buchungserlebnis' : 'A concierge-led booking experience'}
                </h3>
                <p className="text-white/70 mt-3">
                  {locale === 'de' 
                    ? 'Keine Call-Center. Keine Standardantworten. Wir gestalten Ihren Aufenthalt nach Ihren Wünschen.'
                    : 'No call centers. No generic responses. We build your stay around your preferences.'}
                </p>

                <div className="mt-6 space-y-4">
                  {benefits.map((b) => (
                    <div key={b.title} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                        <b.icon className="w-5 h-5 text-gold-300" />
                      </div>
                      <div>
                        <div className="font-semibold">{b.title}</div>
                        <div className="text-white/60 text-sm">{b.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Date Picker Modal */}
      <DatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelectDates={(newCheckIn, newCheckOut) => {
          setCheckIn(newCheckIn)
          setCheckOut(newCheckOut)
        }}
        initialCheckIn={checkIn}
        initialCheckOut={checkOut}
        title={locale === 'de' ? 'Wählen Sie Ihre Daten' : 'Select your dates'}
      />
    </div>
  )
}


