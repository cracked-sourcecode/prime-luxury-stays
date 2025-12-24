'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Send, Phone, Mail, MapPin, Check, Loader2 } from 'lucide-react'

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formState.name,
          email: formState.email,
          phone: formState.phone || null,
          message: formState.message || null,
          source_url: typeof window !== 'undefined' ? window.location.href : null,
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
            Begin Your Journey
          </p>
          <h2 className="font-merriweather text-3xl md:text-4xl lg:text-5xl text-charcoal-900 mb-6">
            Private Inquiry
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-gold-500 to-gold-300 rounded-full mx-auto mb-6" />
          <p className="text-charcoal-500 text-lg max-w-2xl mx-auto">
            Our portfolio is available exclusively to qualified clients. 
            Submit your inquiry for a personal consultation.
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
                Connect With Us
              </h3>
              <p className="text-charcoal-500 leading-relaxed">
                Whether you're seeking a Mediterranean villa, an alpine retreat, 
                or a beachfront estate, our team is ready to curate your 
                perfect experience.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <div className="glass-card rounded-xl p-4 flex items-center gap-4 float-card cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <div className="text-charcoal-400 text-xs font-medium uppercase tracking-wide">Phone</div>
                  <div className="text-charcoal-900 font-semibold">+1 (888) LUXURY-0</div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4 flex items-center gap-4 float-card cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <div className="text-charcoal-400 text-xs font-medium uppercase tracking-wide">Email</div>
                  <div className="text-charcoal-900 font-semibold">concierge@primeluxurystays.com</div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4 flex items-center gap-4 float-card cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <div className="text-charcoal-400 text-xs font-medium uppercase tracking-wide">Headquarters</div>
                  <div className="text-charcoal-900 font-semibold">Miami, Florida</div>
                </div>
              </div>
            </div>

            {/* Availability Note */}
            <div className="glass-gold rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-charcoal-900 font-semibold">Available 24/7</span>
              </div>
              <p className="text-charcoal-600 text-sm">
                Our concierge team responds to all inquiries within 2 hours.
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
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="input-luxury w-full"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-charcoal-700 text-sm font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="input-luxury w-full"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-charcoal-700 text-sm font-semibold mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                  className="input-luxury w-full"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="mb-8">
                <label className="block text-charcoal-700 text-sm font-semibold mb-2">
                  Tell Us About Your Ideal Stay
                </label>
                <textarea
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="input-luxury w-full resize-none"
                  placeholder="Destination preferences, dates, group size, special requirements..."
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
                  <h4 className="font-merriweather text-xl text-charcoal-900 mb-2">Thank You!</h4>
                  <p className="text-charcoal-500">We've received your inquiry and will be in touch within 2 hours.</p>
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
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}

              <p className="text-charcoal-400 text-xs text-center mt-6">
                By submitting this form, you agree to our privacy policy. 
                Your information will be kept strictly confidential.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
