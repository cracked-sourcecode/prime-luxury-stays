'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Send, Phone, Mail, MapPin, Check, Loader2 } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleProvider'

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t, locale } = useLocale()
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '')
    return cleaned.length >= 7 && /^[\+]?[0-9]+$/.test(cleaned)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    // Validate email
    if (!validateEmail(formState.email)) {
      setError('Please enter a valid email address.')
      setSubmitting(false)
      return
    }

    // Validate phone
    if (!formState.phone || !validatePhone(formState.phone)) {
      setError('Please enter a valid phone number.')
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formState.name,
          email: formState.email,
          phone: formState.phone,
          message: formState.message || null,
          source_url: typeof window !== 'undefined' ? window.location.href : null,
          locale: locale,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setSubmitted(true)
        setFormState({ name: '', email: '', phone: '', message: '' })
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={ref} className="py-16 lg:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream-50 to-white" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gold-200/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-gold-600 text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            {t('contact.subtitle')}
          </p>
          <h2 className="font-merriweather text-3xl md:text-4xl lg:text-5xl text-charcoal-900 mb-6">
            {t('contact.title')}
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-gold-500 to-gold-300 rounded-full mx-auto mb-6" />
          <p className="text-charcoal-500 text-lg max-w-2xl mx-auto">
            {t('contact.description')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h3 className="font-merriweather text-2xl text-charcoal-900 mb-4">
                {t('contact.connectTitle')}
              </h3>
              <p className="text-charcoal-500 leading-relaxed">
                {t('contact.connectDescription')}
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <div className="glass-card rounded-xl p-4 flex items-center gap-4 float-card cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <div className="text-charcoal-400 text-xs font-medium uppercase tracking-wide">{t('contact.info.phone')}</div>
                  <div className="text-charcoal-900 font-semibold">
                    <span className="text-charcoal-500 text-xs">US:</span> +1 (203) 979-7309
                  </div>
                  <div className="text-charcoal-900 font-semibold">
                    <span className="text-charcoal-500 text-xs">EU:</span> +49 89 899 300 46
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4 flex items-center gap-4 float-card cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <div className="text-charcoal-400 text-xs font-medium uppercase tracking-wide">{t('contact.info.email')}</div>
                  <div className="text-charcoal-900 font-semibold">info@primeluxurystays.com</div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4 flex items-center gap-4 float-card cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <div className="text-charcoal-400 text-xs font-medium uppercase tracking-wide">{t('contact.info.offices')}</div>
                  <div className="text-charcoal-900 font-semibold">Miami, Florida / Munich, Germany</div>
                </div>
              </div>
            </div>

            {/* Availability Note */}
            <div className="glass-gold rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-charcoal-900 font-semibold">{t('contact.info.response')}</span>
              </div>
              <p className="text-charcoal-600 text-sm">
                {t('contact.info.responseTime')}
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="glass-heavy rounded-airbnb-lg p-8 lg:p-10">
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-charcoal-700 text-sm font-semibold mb-2">
                    {t('contact.form.name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="input-luxury w-full"
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-charcoal-700 text-sm font-semibold mb-2">
                    {t('contact.form.email')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="input-luxury w-full"
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-charcoal-700 text-sm font-semibold mb-2">
                  {t('contact.form.phone')} *
                </label>
                <input
                  type="tel"
                  required
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                  className="input-luxury w-full"
                  placeholder="+1 (555) 000-0000"
                  pattern="[\+]?[0-9\s\-\(\)]{7,20}"
                  title="Please enter a valid phone number"
                />
              </div>

              <div className="mb-8">
                <label className="block text-charcoal-700 text-sm font-semibold mb-2">
                  {t('contact.form.messageLabel')}
                </label>
                <textarea
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="input-luxury w-full resize-none"
                  placeholder={t('contact.form.message')}
                />
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {error}
                </div>
              )}

              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-merriweather text-xl text-charcoal-900 mb-2">{t('contact.form.thankYou')}</h4>
                  <p className="text-charcoal-500">{t('contact.form.success')}</p>
                </div>
              ) : (
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-gold w-full flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t('contact.form.submitting')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('contact.form.submit')}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}

              <p className="text-charcoal-400 text-xs text-center mt-6">
                {t('contact.form.privacyNote')}
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
