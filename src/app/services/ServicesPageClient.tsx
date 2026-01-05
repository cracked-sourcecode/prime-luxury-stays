'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight, 
  Plane, 
  Utensils, 
  Car, 
  Shield, 
  Ship, 
  Navigation,
  Phone,
  Mail,
  Building
} from 'lucide-react'
import { useLocale } from '@/i18n/LocaleProvider'

export default function ServicesPageClient() {
  const { t, locale } = useLocale()

  const serviceCategories = [
    {
      title: locale === 'de' ? 'Concierge' : 'Concierge',
      subtitle: locale === 'de' ? 'Persönliches Luxus-Management' : 'Personal Luxury Management',
      description: locale === 'de' 
        ? 'Ihr engagiertes Team kümmert sich um jedes Detail Ihres Aufenthalts.'
        : 'Your dedicated team handling every detail of your stay.',
      services: [
        {
          icon: Utensils,
          title: locale === 'de' ? 'Privatkoch' : 'Private Chef',
          description: locale === 'de'
            ? 'Weltklasse-Köche kreieren maßgeschneiderte kulinarische Erlebnisse in Ihrer Residenz.'
            : 'World-class chefs creating bespoke culinary experiences in your residence.',
          slug: 'private-chef',
        },
        {
          icon: Shield,
          title: locale === 'de' ? 'Privatsphäre & Sicherheit' : 'Privacy & Security',
          description: locale === 'de'
            ? 'Diskrete Sicherheitsvorkehrungen und vollständige Vertraulichkeit garantiert.'
            : 'Discreet security arrangements and complete confidentiality guaranteed.',
          slug: 'privacy-security',
        },
      ],
    },
    {
      title: locale === 'de' ? 'Erlebnisse' : 'Experiences',
      subtitle: locale === 'de' ? 'Gastronomie & Reisen' : 'Dining & Travel',
      description: locale === 'de'
        ? 'Außergewöhnliche Gastronomie und nahtlose Reiseorganisation.'
        : 'Exceptional dining and seamless travel arrangements.',
      services: [
        {
          icon: Utensils,
          title: locale === 'de' ? 'Tischreservierungen' : 'Table Reservations',
          description: locale === 'de'
            ? 'Prioritätsbuchungen in den besten Restaurants und exklusiven Dinner-Locations.'
            : 'Priority bookings at the finest restaurants and exclusive dining venues.',
          slug: 'table-reservations',
        },
        {
          icon: Building,
          title: locale === 'de' ? 'Reisebuchungen' : 'Travel Bookings',
          description: locale === 'de'
            ? 'Luxushotel-Arrangements und Reisekoordination über Ihren Villenaufenthalt hinaus.'
            : 'Luxury hotel arrangements and travel coordination beyond your villa stay.',
          slug: 'travel-bookings',
        },
      ],
    },
    {
      title: locale === 'de' ? 'Privatflüge' : 'Private Aviation',
      subtitle: locale === 'de' ? 'Flugreisen auf höchstem Niveau' : 'Air Travel Excellence',
      description: locale === 'de'
        ? 'Nahtlose Reisen in der Luft, ganz nach Ihren Wünschen.'
        : 'Seamless journeys by air, your way.',
      services: [
        {
          icon: Plane,
          title: locale === 'de' ? 'Privatflüge' : 'Private Aviation',
          description: locale === 'de'
            ? 'Nahtlose Privatjet-Arrangements zu und von Ihrem Reiseziel.'
            : 'Seamless private jet arrangements to and from your destination.',
          slug: 'private-aviation',
        },
        {
          icon: Navigation,
          title: locale === 'de' ? 'Helikoptertransfer' : 'Helicopter Transport',
          description: locale === 'de'
            ? 'Schnelle Helikoptertransfers und malerische Touren über die Inseln.'
            : 'Swift helicopter transfers and scenic tours across the islands.',
          slug: 'helicopter',
        },
      ],
    },
    {
      title: locale === 'de' ? 'Transport' : 'Transportation',
      subtitle: locale === 'de' ? 'Land & See' : 'Ground & Sea',
      description: locale === 'de'
        ? 'Premium-Reisen zu Wasser und zu Land.'
        : 'Premium travel by land and water.',
      services: [
        {
          icon: Car,
          title: locale === 'de' ? 'Luxustransport' : 'Luxury Transport',
          description: locale === 'de'
            ? 'Premium-Fahrzeugflotte inklusive Supersportwagen und Chauffeurservice.'
            : 'Premium vehicle fleet including supercars and chauffeur services.',
          slug: 'luxury-transport',
        },
        {
          icon: Ship,
          title: locale === 'de' ? 'Yachtcharter' : 'Yacht Charter',
          description: locale === 'de'
            ? 'Luxus-Yachterlebnisse von intimen Tagesausflügen bis zu mehrtägigen Mittelmeerreisen.'
            : 'Luxury yacht experiences from intimate day sails to multi-day Mediterranean voyages.',
          slug: 'yacht-charter',
        },
      ],
    },
  ]
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[75vh] min-h-[550px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://storage.googleapis.com/primeluxurystays/eden-roc/images/1766935948675-MR20230606066_result_12.38.51.webp"
            alt={locale === 'de' ? 'Luxus-Services' : 'Luxury Services'}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-charcoal-900" />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <p className="text-gold-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              {locale === 'de' ? 'Unsere Services' : 'Our Services'}
            </p>
            <h1 className="font-merriweather text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              {locale === 'de' ? 'Exklusive Concierge-Services' : 'Exclusive Concierge Services'}
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
              {locale === 'de' 
                ? 'Von Privatköchen bis hin zu Yachtcharter – wir gestalten Ihren perfekten Aufenthalt.'
                : 'From private chefs to yacht charters, we craft your perfect stay.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Categories */}
      {serviceCategories.map((category, categoryIndex) => (
        <section 
          key={category.title}
          className={`py-20 ${categoryIndex % 2 === 0 ? 'bg-white' : 'bg-cream-50'}`}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Category Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <p className="text-gold-600 text-sm font-semibold tracking-[0.2em] uppercase mb-3">
                {category.subtitle}
              </p>
              <h2 className="font-merriweather text-3xl md:text-4xl text-charcoal-900 mb-4">
                {category.title}
              </h2>
              <p className="text-charcoal-500 text-lg max-w-xl">
                {category.description}
              </p>
            </motion.div>

            {/* Services Grid */}
            <div className={`grid gap-8 ${category.services.length === 1 ? 'md:grid-cols-1 max-w-2xl' : category.services.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
              {category.services.map((service, serviceIndex) => (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: serviceIndex * 0.1 }}
                >
                  <Link 
                    href={`/services/${service.slug}`}
                    className="group block h-full"
                  >
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100 group-hover:border-gold-200">
                      {/* Icon */}
                      <div className="mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-100 to-gold-50 flex items-center justify-center group-hover:from-gold-200 group-hover:to-gold-100 transition-all duration-500">
                          <service.icon className="w-8 h-8 text-gold-600" />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="font-merriweather text-xl text-charcoal-900 mb-3 group-hover:text-gold-700 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-charcoal-500 text-sm leading-relaxed mb-6">
                        {service.description}
                      </p>

                      {/* Link */}
                      <div className="flex items-center gap-2 text-gold-600 font-medium text-sm group-hover:text-gold-700 transition-colors">
                        {locale === 'de' ? 'Mehr erfahren' : 'Learn More'}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-20 bg-charcoal-900">
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
              {locale === 'de' ? 'Der Prime Luxury Unterschied?' : 'The Prime Luxury Difference?'}
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
              {locale === 'de' 
                ? 'Kontaktieren Sie unser Concierge-Team, um Ihre Anforderungen zu besprechen. Wir gestalten ein maßgeschneidertes Erlebnis für jeden Ihrer Wünsche.'
                : 'Contact our concierge team to discuss your requirements. We\'ll craft a bespoke experience tailored to your every need.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/inquire"
                className="inline-flex items-center gap-2 bg-gold-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gold-600 transition-colors w-full sm:w-auto justify-center"
              >
                {locale === 'de' ? 'Planung starten' : 'Start Planning'}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors w-full sm:w-auto justify-center"
              >
                {locale === 'de' ? 'Immobilien ansehen' : 'View Properties'}
              </Link>
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
    </div>
  )
}
