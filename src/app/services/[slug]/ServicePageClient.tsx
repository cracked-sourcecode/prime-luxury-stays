'use client'

import { motion } from 'framer-motion'
import { Check, ArrowRight, Phone, Mail, Plane, Utensils, Car, Shield, Ship, Navigation, Sparkles, Building } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from '@/i18n/LocaleProvider'

interface ServicePageClientProps {
  service: {
    title: string
    titleDe?: string
    subtitle: string
    subtitleDe?: string
    description: string
    descriptionDe?: string
    heroImage: string
    features: string[]
    featuresDe?: string[]
    benefits: { title: string; titleDe?: string; description: string; descriptionDe?: string }[]
  }
}

export default function ServicePageClient({ service }: ServicePageClientProps) {
  const { locale } = useLocale()

  const title = locale === 'de' && service.titleDe ? service.titleDe : service.title
  const subtitle = locale === 'de' && service.subtitleDe ? service.subtitleDe : service.subtitle
  const description = locale === 'de' && service.descriptionDe ? service.descriptionDe : service.description
  const features = locale === 'de' && service.featuresDe ? service.featuresDe : service.features

  const otherServices = [
    { name: locale === 'de' ? 'Privatflüge' : 'Private Aviation', slug: 'private-aviation', icon: Plane },
    { name: locale === 'de' ? 'Privatkoch' : 'Private Chef', slug: 'private-chef', icon: Utensils },
    { name: locale === 'de' ? 'Yachtcharter' : 'Yacht Charter', slug: 'yacht-charter', icon: Ship },
    { name: locale === 'de' ? 'Luxustransport' : 'Luxury Transport', slug: 'luxury-transport', icon: Car },
    { name: locale === 'de' ? 'Helikopter' : 'Helicopter', slug: 'helicopter', icon: Navigation },
    { name: locale === 'de' ? 'Privatsphäre & Sicherheit' : 'Privacy & Security', slug: 'privacy-security', icon: Shield },
    { name: locale === 'de' ? 'Tischreservierungen' : 'Table Reservations', slug: 'table-reservations', icon: Sparkles },
    { name: locale === 'de' ? 'Reisebuchungen' : 'Travel Bookings', slug: 'travel-bookings', icon: Building },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={service.heroImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-charcoal-900" />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <p className="text-gold-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              {locale === 'de' ? 'Premium Service' : 'Premium Service'}
            </p>
            <h1 className="font-merriweather text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              {title}
            </h1>
            <p className="text-white/80 text-xl md:text-2xl max-w-2xl mx-auto mb-8">
              {subtitle}
            </p>
            <a
              href="#inquire"
              className="inline-flex items-center gap-2 bg-gold-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gold-600 transition-colors"
            >
              {locale === 'de' ? 'Diesen Service anfragen' : 'Request This Service'}
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Description & Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left - Description */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-merriweather text-3xl md:text-4xl text-charcoal-900 mb-6">
                {locale === 'de' ? 'Das Erlebnis' : 'The Experience'}
              </h2>
              <p className="text-charcoal-600 text-lg leading-relaxed mb-8">
                {description}
              </p>

              {/* Benefits */}
              <div className="space-y-6">
                {service.benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gold-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-6 h-6 text-gold-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal-900 mb-1">
                        {locale === 'de' && benefit.titleDe ? benefit.titleDe : benefit.title}
                      </h4>
                      <p className="text-charcoal-500 text-sm">
                        {locale === 'de' && benefit.descriptionDe ? benefit.descriptionDe : benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Features List */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-cream-50 rounded-3xl p-8 lg:p-10"
            >
              <h3 className="font-merriweather text-2xl text-charcoal-900 mb-6">
                {locale === 'de' ? 'Was enthalten ist' : 'What\'s Included'}
              </h3>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-charcoal-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="inquire" className="py-20 bg-charcoal-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              {locale === 'de' ? 'Bereit zu erleben' : 'Ready to Experience'}
            </p>
            <h2 className="font-merriweather text-3xl md:text-4xl text-white mb-6">
              {title}?
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
              {locale === 'de' 
                ? 'Kontaktieren Sie unser Concierge-Team, um diesen Service für Ihren Aufenthalt zu arrangieren. Wir kümmern uns um jedes Detail für ein perfektes Erlebnis.'
                : 'Contact our concierge team to arrange this service for your stay. We\'ll handle every detail to ensure a flawless experience.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/inquire"
                className="inline-flex items-center gap-2 bg-gold-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gold-600 transition-colors w-full sm:w-auto justify-center"
              >
                {locale === 'de' ? 'Diesen Service anfragen' : 'Request This Service'}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:+34661539553"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors w-full sm:w-auto justify-center"
              >
                <Phone className="w-5 h-5" />
                {locale === 'de' ? 'Jetzt anrufen' : 'Call Us Now'}
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/60 text-sm">
              <a href="tel:+12039797309" className="flex items-center gap-2 hover:text-gold-400 transition-colors">
                <Phone className="w-4 h-4" />
                🇺🇸 +1 (203) 979-7309
              </a>
              <a href="tel:+34661539553" className="flex items-center gap-2 hover:text-gold-400 transition-colors">
                <Phone className="w-4 h-4" />
                🇪🇸 +34 661 53 95 53
              </a>
              <a href="mailto:info@primeluxurystays.com" className="flex items-center gap-2 hover:text-gold-400 transition-colors">
                <Mail className="w-4 h-4" />
                info@primeluxurystays.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Other Services */}
      <section className="py-20 bg-gradient-to-b from-cream-50 to-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-gold-600 text-sm font-semibold tracking-[0.2em] uppercase mb-3">
              {locale === 'de' ? 'Unsere Services' : 'Our Services'}
            </p>
            <h2 className="font-merriweather text-3xl md:text-4xl text-charcoal-900 mb-4">
              {locale === 'de' ? 'Weitere Services entdecken' : 'Explore More Services'}
            </h2>
            <p className="text-charcoal-500 max-w-xl mx-auto">
              {locale === 'de' 
                ? 'Entdecken Sie unser gesamtes Angebot an exklusiven Luxus-Services' 
                : 'Discover our complete range of exclusive luxury services'}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {otherServices.map((s, index) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-100 hover:border-gold-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-100 to-gold-50 flex items-center justify-center mb-4 group-hover:from-gold-200 group-hover:to-gold-100 transition-all">
                    <s.icon className="w-7 h-7 text-gold-600" />
                  </div>
                  <span className="text-charcoal-800 font-medium text-center text-sm group-hover:text-gold-700 transition-colors">
                    {s.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-14"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-charcoal-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-charcoal-800 transition-colors"
            >
              {locale === 'de' ? 'Alle Services ansehen' : 'View All Services'}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-gold-600 font-semibold hover:text-gold-700 transition-colors"
            >
              {locale === 'de' ? 'Unsere Immobilien' : 'Our Properties'}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
