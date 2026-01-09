'use client'

import { useState } from 'react'
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
  Plane,
  Ship,
  UtensilsCrossed,
  Car,
  ChefHat,
  Lock,
  Globe,
} from 'lucide-react'
import { useLocale } from '@/i18n/LocaleProvider'

// Services that match the actual service pages
const serviceOptions = [
  { value: 'private-aviation', label: 'Private Aviation', labelDe: 'Privatflüge', icon: Plane },
  { value: 'private-chef', label: 'Private Chef', labelDe: 'Privatkoch', icon: ChefHat },
  { value: 'yacht-charter', label: 'Yacht Charter', labelDe: 'Yachtcharter', icon: Ship },
  { value: 'luxury-transport', label: 'Luxury Transport', labelDe: 'Luxustransport', icon: Car },
  { value: 'helicopter', label: 'Helicopter', labelDe: 'Helikopter', icon: Plane },
  { value: 'privacy-security', label: 'Privacy & Security', labelDe: 'Privatsphäre & Sicherheit', icon: Lock },
  { value: 'table-reservations', label: 'Table Reservations', labelDe: 'Tischreservierungen', icon: UtensilsCrossed },
  { value: 'travel-bookings', label: 'Travel Bookings', labelDe: 'Reisebuchungen', icon: Globe },
]

export default function ServicesInquireClient({
  selectedService,
}: {
  selectedService: string | null
}) {
  const { locale } = useLocale()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState(selectedService || '')
  const [preferredDate, setPreferredDate] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const heroImage = 'https://storage.googleapis.com/primeluxurystays/eden-roc/images/1766935948675-MR20230606066_result_12.38.51.webp'

  const benefits = [
    { 
      icon: Shield, 
      title: locale === 'de' ? 'Verifizierte Partner' : 'Verified Partners', 
      desc: locale === 'de' ? 'Alle Dienstleister sind persönlich geprüft.' : 'Every service provider is personally vetted.' 
    },
    { 
      icon: Clock, 
      title: locale === 'de' ? 'Schnelle Antwort' : 'Fast Response', 
      desc: locale === 'de' ? 'Unser Team antwortet umgehend.' : 'Our team responds promptly.' 
    },
    { 
      icon: Sparkles, 
      title: locale === 'de' ? 'Maßgeschneidert' : 'Tailored Experience', 
      desc: locale === 'de' ? 'Jeder Service wird nach Ihren Wünschen angepasst.' : 'Every service customized to your preferences.' 
    },
    { 
      icon: Star, 
      title: locale === 'de' ? 'Premium Qualität' : 'Premium Quality', 
      desc: locale === 'de' ? 'Nur die besten Anbieter der Region.' : 'Only the finest providers in the region.' 
    },
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

    if (!fullName.trim()) {
      setError(locale === 'de' ? 'Bitte geben Sie Ihren Namen ein.' : 'Please enter your name.')
      return
    }

    if (!validateEmail(email)) {
      setError(locale === 'de' ? 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' : 'Please enter a valid email address.')
      return
    }

    if (!phone || !validatePhone(phone)) {
      setError(locale === 'de' ? 'Bitte geben Sie eine gültige Telefonnummer ein.' : 'Please enter a valid phone number.')
      return
    }

    if (!service) {
      setError(locale === 'de' ? 'Bitte wählen Sie einen Service aus.' : 'Please select a service.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_slug: null, // No property for service inquiries
          check_in: preferredDate || null,
          check_out: null,
          guests: null,
          full_name: fullName,
          email,
          phone,
          message: `[SERVICE INQUIRY: ${service}]\n\n${message}`,
          locale,
        }),
      })
      if (!res.ok) throw new Error('Failed to submit')
      setDone(true)
    } catch (err) {
      setError(locale === 'de' ? 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.' : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-merriweather text-3xl text-charcoal-900 mb-4">
            {locale === 'de' ? 'Anfrage Erhalten!' : 'Request Received!'}
          </h1>
          <p className="text-charcoal-600 mb-8">
            {locale === 'de' 
              ? 'Vielen Dank für Ihre Service-Anfrage. Unser Concierge-Team wird sich in Kürze bei Ihnen melden.'
              : 'Thank you for your service request. Our concierge team will be in touch shortly to arrange everything.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 bg-gold-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gold-600 transition-colors"
            >
              {locale === 'de' ? 'Mehr Services Entdecken' : 'Explore More Services'}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-charcoal-100 text-charcoal-700 px-6 py-3 rounded-xl font-semibold hover:bg-charcoal-200 transition-colors"
            >
              {locale === 'de' ? 'Zurück zur Startseite' : 'Back to Home'}
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[300px]">
        <img
          src={heroImage}
          alt="Luxury Services"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6">
            <p className="text-gold-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
              {locale === 'de' ? 'Concierge Services' : 'Concierge Services'}
            </p>
            <h1 className="font-merriweather text-4xl md:text-5xl text-white mb-4">
              {locale === 'de' ? 'Service Anfragen' : 'Request a Service'}
            </h1>
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              {locale === 'de' 
                ? 'Lassen Sie uns Ihren perfekten Aufenthalt gestalten'
                : 'Let us craft your perfect experience'}
            </p>
          </div>
        </div>
        <Link
          href="/services"
          className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{locale === 'de' ? 'Alle Services' : 'All Services'}</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8 md:p-10"
          >
            <h2 className="font-merriweather text-2xl text-charcoal-900 mb-6">
              {locale === 'de' ? 'Ihre Anfrage' : 'Your Request'}
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  {locale === 'de' ? 'Service Auswählen' : 'Select Service'} *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {serviceOptions.map((opt) => {
                    const Icon = opt.icon
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setService(opt.value)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          service === opt.value
                            ? 'border-gold-500 bg-gold-50'
                            : 'border-gray-200 hover:border-gold-300'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-2 ${service === opt.value ? 'text-gold-600' : 'text-charcoal-400'}`} />
                        <span className={`text-sm font-medium ${service === opt.value ? 'text-gold-700' : 'text-charcoal-700'}`}>
                          {locale === 'de' ? opt.labelDe : opt.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    {locale === 'de' ? 'Vollständiger Name' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    placeholder={locale === 'de' ? 'Max Mustermann' : 'John Smith'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    {locale === 'de' ? 'E-Mail' : 'Email'} *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Phone & Date */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    {locale === 'de' ? 'Telefon' : 'Phone'} *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    {locale === 'de' ? 'Gewünschtes Datum' : 'Preferred Date'}
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  {locale === 'de' ? 'Ihre Nachricht / Besondere Wünsche' : 'Your Message / Special Requests'}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
                  placeholder={locale === 'de' 
                    ? 'Erzählen Sie uns von Ihren Vorstellungen...'
                    : 'Tell us about your requirements...'}
                />
              </div>

              {/* Submit */}
              <button
                onClick={submit}
                disabled={submitting}
                className="w-full bg-gold-500 text-white py-4 rounded-xl font-semibold hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting 
                  ? (locale === 'de' ? 'Wird gesendet...' : 'Submitting...') 
                  : (locale === 'de' ? 'Anfrage Senden' : 'Submit Request')}
              </button>
            </div>
          </motion.div>

          {/* Benefits Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h3 className="font-merriweather text-xl text-charcoal-900 mb-4">
                {locale === 'de' ? 'Warum Prime Luxury Stays?' : 'Why Prime Luxury Stays?'}
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-gold-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal-900 text-sm">{benefit.title}</p>
                      <p className="text-charcoal-500 text-xs">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-charcoal-900 rounded-3xl p-6 text-white">
              <h3 className="font-merriweather text-lg mb-3">
                {locale === 'de' ? 'Direkter Kontakt' : 'Direct Contact'}
              </h3>
              <p className="text-white/70 text-sm mb-4">
                {locale === 'de' 
                  ? 'Bevorzugen Sie ein Gespräch? Rufen Sie uns direkt an.'
                  : 'Prefer to talk? Call us directly.'}
              </p>
              <a
                href="tel:+34634306076"
                className="flex items-center gap-2 text-gold-400 font-semibold hover:text-gold-300 transition-colors"
              >
                <Phone className="w-4 h-4" />
                +34 634 306 076
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

