'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Anchor,
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Home,
  Mail,
  Phone,
  Ruler,
  Shield,
  Ship,
  Sparkles,
  Star,
  User,
  Users,
} from 'lucide-react'
import type { Property } from '@/lib/properties'

interface Yacht {
  id: number
  name: string
  slug: string
  manufacturer: string
  model: string
  yacht_type: string
  year_built: number
  length_meters: number
  max_guests: number
  guest_cabins: number
  short_description: string
  short_description_de?: string
  featured_image: string
  region: string
  price_per_week?: number
  price_per_day?: number
}
import DatePickerModal from '@/components/DatePickerModal'
import { useLocale } from '@/i18n/LocaleProvider'

export default function InquireClient({
  property,
  yacht,
  inquiryType,
  prefill,
}: {
  property: Property | null
  yacht?: Yacht | null
  inquiryType?: string
  prefill: {
    property_slug: string | null
    yacht_slug?: string | null
    check_in: string | null
    check_out: string | null
    guests: number | null
    add_yacht?: boolean
  }
}) {
  const { t, locale } = useLocale()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [checkIn, setCheckIn] = useState(prefill.check_in ?? '')
  const [checkOut, setCheckOut] = useState(prefill.check_out ?? '')
  const [guests, setGuests] = useState(prefill.guests ?? (property?.max_guests ?? yacht?.max_guests ?? 2))
  const [message, setMessage] = useState('')
  const [wantsYacht, setWantsYacht] = useState(prefill.add_yacht ?? false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return locale === 'de' ? 'Datum wählen' : 'Select date'
    const date = new Date(dateStr)
    return date.toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Determine inquiry type
  const isCombinedInquiry = inquiryType === 'combined' || (!!property && !!yacht)
  const isYachtOnlyInquiry = (inquiryType === 'yacht' && !property) || (!!yacht && !property)
  const isPropertyOnlyInquiry = !!property && !yacht && !wantsYacht

  const heroImage = useMemo(() => {
    if (isCombinedInquiry) {
      return property?.featured_image || yacht?.featured_image || 'https://storage.googleapis.com/primeluxurystays-rpr/Mallorca%20page%20Hero%20Section.png'
    }
    return (
      yacht?.featured_image ||
      property?.featured_image ||
      'https://storage.googleapis.com/primeluxurystays-rpr/Mallorca%20page%20Hero%20Section.png'
    )
  }, [property, yacht, isCombinedInquiry])

  // Calculate number of days for pricing estimate
  const dayCount = useMemo(() => {
    if (!checkIn || !checkOut) return 7 // Default to 1 week
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 7
  }, [checkIn, checkOut])

  const benefits = locale === 'de' ? [
    { icon: Shield, title: 'Geprüfte Immobilien & Yachten', desc: 'Jede Immobilie und Yacht persönlich besichtigt.' },
    { icon: Clock, title: 'Schnelle Antwort', desc: 'Unser Team antwortet umgehend.' },
    { icon: Sparkles, title: 'Concierge-Service', desc: 'Köche, Transfers & mehr.' },
    { icon: Star, title: 'Bester Preis direkt', desc: 'Keine Buchungsplattform-Gebühren.' },
  ] : [
    { icon: Shield, title: 'Verified Properties & Yachts', desc: 'Every listing personally vetted.' },
    { icon: Clock, title: 'Fast response', desc: 'Our team responds promptly.' },
    { icon: Sparkles, title: 'Concierge service', desc: 'Chefs, transfers & more.' },
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

    if (!validateEmail(email)) {
      setError(locale === 'de' ? 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' : 'Please enter a valid email address.')
      return
    }

    if (!phone || !validatePhone(phone)) {
      setError(locale === 'de' ? 'Bitte geben Sie eine gültige Telefonnummer ein.' : 'Please enter a valid phone number.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_slug: property?.slug ?? prefill.property_slug,
          yacht_slug: yacht?.slug ?? prefill.yacht_slug,
          inquiry_type: isCombinedInquiry ? 'combined' : (isYachtOnlyInquiry ? 'yacht' : 'property'),
          check_in: checkIn || null,
          check_out: checkOut || null,
          guests: guests ? Number(guests) : null,
          full_name: fullName,
          email,
          phone: phone,
          message: message || null,
          source_url: typeof window !== 'undefined' ? window.location.href : null,
          locale: locale,
          wants_yacht: wantsYacht || !!yacht,
        }),
      })
      const data = await res.json()
      if (!data?.success) {
        setError(data?.error || (locale === 'de' ? 'Anfrage konnte nicht gesendet werden.' : 'Could not submit. Please try again.'))
        return
      }
      setDone(true)
    } catch {
      setError(locale === 'de' ? 'Anfrage konnte nicht gesendet werden.' : 'Could not submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Get page title based on inquiry type
  const getPageTitle = () => {
    if (isCombinedInquiry) {
      return locale === 'de' ? 'Villa + Yacht Paket' : 'Villa + Yacht Package'
    }
    if (isYachtOnlyInquiry) {
      return locale === 'de' ? 'Yachtcharter-Anfrage' : 'Yacht Charter Inquiry'
    }
    return locale === 'de' ? 'Buchungsanfrage' : 'Request to Book'
  }

  // Get back link
  const getBackLink = () => {
    if (isCombinedInquiry && yacht) {
      return `/yachts/${yacht.slug}`
    }
    if (yacht && !property) {
      return `/yachts/${yacht.slug}`
    }
    if (property) {
      return `/properties/${property.slug}`
    }
    return '/mallorca'
  }

  const getBackLabel = () => {
    if (isCombinedInquiry && yacht) {
      return locale === 'de' ? 'Zurück zur Yacht' : 'Back to yacht'
    }
    if (yacht && !property) {
      return locale === 'de' ? 'Zurück zur Yacht' : 'Back to yacht'
    }
    if (property) {
      return locale === 'de' ? 'Zurück zur Villa' : 'Back to villa'
    }
    return locale === 'de' ? 'Zurück' : 'Back'
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
              href={getBackLink()}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">{getBackLabel()}</span>
            </Link>
            <a
              href={locale === 'de' ? 'tel:+4989899300​46' : 'tel:+12039797309'}
              className="hidden sm:inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white px-4 py-2 rounded-xl hover:bg-white/15 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-semibold">{locale === 'de' ? 'Concierge anrufen' : 'Call concierge'}</span>
            </a>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-gold-500/15 border border-gold-400/25 px-5 py-2 text-gold-200 mb-6">
              {isCombinedInquiry ? (
                <>
                  <Home className="w-4 h-4" />
                  <span className="mx-1">+</span>
                  <Anchor className="w-4 h-4" />
                </>
              ) : isYachtOnlyInquiry ? (
                <Anchor className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span className="text-sm font-medium tracking-wide">
                {locale === 'de' ? 'Direktanfrage • Persönlicher Service' : 'Direct inquiry • Personal service'}
              </span>
            </div>

            <h1 className="font-merriweather text-4xl md:text-5xl text-white leading-tight">
              {getPageTitle()}
            </h1>

            {/* Show names of selected items */}
            {(property || yacht) && (
              <div className="mt-4 space-y-2">
                {property && (
                  <div className="flex items-center gap-2 text-gold-300">
                    <Home className="w-5 h-5" />
                    <span className="text-lg font-medium">{property.name}</span>
                  </div>
                )}
                {yacht && (
                  <div className="flex items-center gap-2 text-gold-300">
                    <Ship className="w-5 h-5" />
                    <span className="text-lg font-medium">{yacht.name}</span>
                  </div>
                )}
              </div>
            )}

            <p className="text-white/70 text-lg mt-4 max-w-2xl">
              {isCombinedInquiry 
                ? (locale === 'de' 
                    ? 'Genießen Sie das ultimative Luxuserlebnis: Ihre Traumvilla kombiniert mit einer exklusiven Yacht. Wir erstellen ein maßgeschneidertes Angebot für Sie.'
                    : "Enjoy the ultimate luxury experience: your dream villa combined with an exclusive yacht. We'll create a bespoke quote for you.")
                : (locale === 'de' 
                    ? 'Senden Sie uns Ihre Wunschdaten und Präferenzen. Wir bestätigen die Verfügbarkeit, erstellen ein individuelles Angebot und finalisieren die Details direkt mit Ihnen.'
                    : "Send your dates and preferences. We'll confirm availability, share a tailored quote, and finalize details with you directly.")}
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
              <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex-1 min-w-0">
                  <h2 className="font-merriweather text-3xl text-charcoal-900">
                    {locale === 'de' ? 'Ihre Anfrage-Details' : 'Your inquiry details'}
                  </h2>
                  <p className="text-charcoal-500 mt-2">
                    {locale === 'de' 
                      ? 'Je mehr Sie uns mitteilen, desto besser können wir Ihren Aufenthalt gestalten.'
                      : 'The more you share, the better we can tailor your stay.'}
                  </p>
                </div>
                <div className="hidden lg:block text-right flex-shrink-0">
                  <div className="text-xs tracking-[0.15em] uppercase text-gold-600 font-semibold">
                    Concierge Service
                  </div>
                  <div className="text-charcoal-900 font-semibold mt-1 flex items-center justify-end gap-2">
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
                    {isCombinedInquiry 
                      ? (locale === 'de' 
                          ? 'Wir melden uns in Kürze bei Ihnen mit einem maßgeschneiderten Angebot für Ihr Villa + Yacht Paket.'
                          : "We'll reach out shortly with a bespoke quote for your Villa + Yacht package.")
                      : (locale === 'de' 
                          ? 'Wir melden uns in Kürze bei Ihnen, um die Verfügbarkeit zu bestätigen und die nächsten Schritte zu besprechen.'
                          : "We'll reach out shortly to confirm availability and next steps.")}
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <a
                      href={locale === 'de' ? 'tel:+4989899300​46' : 'tel:+12039797309'}
                      className="bg-charcoal-900 text-white px-6 py-3 rounded-2xl font-semibold inline-flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      {locale === 'de' ? 'Jetzt anrufen' : 'Call now'}
                    </a>
                    <Link
                      href={getBackLink()}
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
                          max={property?.max_guests ?? yacht?.max_guests ?? 20}
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-cream-200 bg-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Yacht Add-on Option - Only show if property-only inquiry */}
                    {!yacht && property && (
                      <div className="md:col-span-2">
                        <button
                          type="button"
                          onClick={() => setWantsYacht(!wantsYacht)}
                          className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                            wantsYacht 
                              ? 'border-gold-500 bg-gold-50' 
                              : 'border-cream-200 bg-white hover:border-gold-300'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            wantsYacht ? 'bg-gold-500 text-white' : 'bg-cream-100 text-charcoal-400'
                          }`}>
                            <Anchor className="w-6 h-6" />
                          </div>
                          <div className="text-left flex-1">
                            <div className="font-semibold text-charcoal-900">
                              {locale === 'de' ? 'Yacht-Charter hinzufügen' : 'Add Yacht Charter'}
                            </div>
                            <div className="text-sm text-charcoal-500">
                              {locale === 'de' 
                                ? 'Erkunden Sie die Küste mit einer Luxusyacht'
                                : 'Explore the coast with a luxury yacht'}
                            </div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            wantsYacht 
                              ? 'border-gold-500 bg-gold-500' 
                              : 'border-charcoal-300'
                          }`}>
                            {wantsYacht && <Check className="w-4 h-4 text-white" />}
                          </div>
                        </button>
                      </div>
                    )}

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
                      placeholder={isCombinedInquiry
                        ? (locale === 'de' 
                            ? 'Besondere Wünsche für Villa oder Yacht, Feierlichkeiten, Koch, bevorzugte Routen...'
                            : 'Special requests for villa or yacht, celebrations, chef, preferred routes...')
                        : (locale === 'de' 
                            ? 'Gibt es etwas, das wir wissen sollten? (Feierlichkeiten, Koch, Yacht, bevorzugte Gegend, flexible Daten...)'
                            : 'Anything we should know? (celebrations, chef, yacht, preferred area, flexible dates...)')}
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
                        : isCombinedInquiry
                          ? (locale === 'de' ? 'Paketanfrage senden' : 'Submit Package Inquiry')
                          : (locale === 'de' ? 'Anfrage senden' : 'Submit inquiry')}
                    </button>
                    <div className="text-sm text-charcoal-500">
                      {locale === 'de' ? 'Lieber telefonieren? Rufen Sie an:' : 'Prefer to talk? Call'}{' '}
                      {locale === 'de' ? (
                        <a className="text-gold-700 font-semibold" href="tel:+498989930046">
                          +49 89 8993 0046
                        </a>
                      ) : (
                        <a className="text-gold-700 font-semibold" href="tel:+34634306076">
                          +34 634 306 076
                        </a>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right rail */}
          <div className="lg:col-span-2 space-y-6">
            {/* Combined Package Summary Card */}
            {isCombinedInquiry && property && yacht ? (
              <div className="bg-white rounded-3xl border border-cream-200 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-4">
                  <div className="flex items-center gap-2 text-white">
                    <Home className="w-5 h-5" />
                    <span className="mx-1 text-white/70">+</span>
                    <Ship className="w-5 h-5" />
                    <span className="ml-2 font-semibold">
                      {locale === 'de' ? 'Villa + Yacht Paket' : 'Villa + Yacht Package'}
                    </span>
                  </div>
                </div>
                
                {/* Villa Card */}
                <div className="p-4 border-b border-cream-200">
                  <div className="flex gap-4">
                    <div className="w-24 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={property.featured_image || ''} alt={property.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-gold-600 text-xs font-medium mb-1">
                        <Home className="w-3 h-3" />
                        {locale === 'de' ? 'Villa' : 'Villa'}
                      </div>
                      <h4 className="font-merriweather text-charcoal-900 truncate">{property.name}</h4>
                      <p className="text-charcoal-500 text-sm">{property.city}, {property.region}</p>
                      <div className="flex items-center gap-3 mt-1 text-charcoal-400 text-xs">
                        <span>{property.bedrooms} {locale === 'de' ? 'Schlafz.' : 'bed'}</span>
                        <span>•</span>
                        <span>{property.max_guests} {locale === 'de' ? 'Gäste' : 'guests'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Yacht Card */}
                <div className="p-4 border-b border-cream-200">
                  <div className="flex gap-4">
                    <div className="w-24 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={yacht.featured_image || ''} alt={yacht.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-gold-600 text-xs font-medium mb-1">
                        <Anchor className="w-3 h-3" />
                        {locale === 'de' ? 'Yacht' : 'Yacht'}
                      </div>
                      <h4 className="font-merriweather text-charcoal-900 truncate">{yacht.name}</h4>
                      <p className="text-charcoal-500 text-sm">{yacht.manufacturer} {yacht.model}</p>
                      <div className="flex items-center gap-3 mt-1 text-charcoal-400 text-xs">
                        <span>{yacht.length_meters}m</span>
                        <span>•</span>
                        <span>{yacht.max_guests} {locale === 'de' ? 'Gäste' : 'guests'}</span>
                        <span>•</span>
                        <span>{yacht.guest_cabins} {locale === 'de' ? 'Kabinen' : 'cabins'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Package Info */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div className="rounded-2xl bg-cream-50 border border-cream-200 px-4 py-3">
                      <div className="text-charcoal-500">{locale === 'de' ? 'Buchung' : 'Booking'}</div>
                      <div className="font-semibold text-charcoal-900">{locale === 'de' ? 'Kombipaket' : 'Combined'}</div>
                    </div>
                    <div className="rounded-2xl bg-cream-50 border border-cream-200 px-4 py-3">
                      <div className="text-charcoal-500">{locale === 'de' ? 'Betreuung' : 'Support'}</div>
                      <div className="font-semibold text-charcoal-900">{locale === 'de' ? 'Concierge' : 'Concierge'}</div>
                    </div>
                  </div>
                  <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 text-center">
                    <p className="text-gold-800 font-medium">
                      {locale === 'de' 
                        ? 'Unser Team erstellt ein maßgeschneidertes Angebot für Ihr Paket'
                        : "Our team will create a bespoke quote for your package"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Single item card - yacht or property */
              <div className="bg-white rounded-3xl border border-cream-200 shadow-xl overflow-hidden">
                <div className="relative aspect-[16/10]">
                  <img src={heroImage} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {yacht && !property ? (
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <Anchor className="w-4 h-4 text-gold-400" />
                        <span className="text-gold-300 text-sm font-medium">
                          {locale === 'de' ? 'Yachtcharter' : 'Yacht Charter'}
                        </span>
                      </div>
                      <div className="font-merriweather text-2xl">{yacht.name}</div>
                      <div className="text-white/80 mt-1">
                        {yacht.manufacturer} {yacht.model} • {yacht.year_built}
                      </div>
                    </div>
                  ) : property ? (
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
                    {/* Yacht-specific stats */}
                    {yacht && !property ? (
                      <>
                        <div className="rounded-2xl bg-cream-50 border border-cream-200 px-4 py-3">
                          <div className="text-charcoal-500 flex items-center gap-1">
                            <Ruler className="w-3 h-3" />
                            {locale === 'de' ? 'Länge' : 'Length'}
                          </div>
                          <div className="font-semibold text-charcoal-900">{yacht.length_meters}m</div>
                        </div>
                        <div className="rounded-2xl bg-cream-50 border border-cream-200 px-4 py-3">
                          <div className="text-charcoal-500 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {locale === 'de' ? 'Gäste' : 'Guests'}
                          </div>
                          <div className="font-semibold text-charcoal-900">{locale === 'de' ? `Bis zu ${yacht.max_guests}` : `Up to ${yacht.max_guests}`}</div>
                        </div>
                        <div className="rounded-2xl bg-cream-50 border border-cream-200 px-4 py-3">
                          <div className="text-charcoal-500 flex items-center gap-1">
                            <Ship className="w-3 h-3" />
                            {locale === 'de' ? 'Kabinen' : 'Cabins'}
                          </div>
                          <div className="font-semibold text-charcoal-900">{yacht.guest_cabins} en-suite</div>
                        </div>
                        <div className="rounded-2xl bg-cream-50 border border-cream-200 px-4 py-3">
                          <div className="text-charcoal-500">{locale === 'de' ? 'Region' : 'Region'}</div>
                          <div className="font-semibold text-charcoal-900">{yacht.region || 'Mallorca'}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Property-specific stats */}
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
                      </>
                    )}
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
            )}

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
