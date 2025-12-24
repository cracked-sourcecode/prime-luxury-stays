'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Compass, 
  Shield, 
  Sparkles, 
  Clock, 
  Car, 
  Plane,
  Utensils,
  HeartHandshake
} from 'lucide-react'

const services = [
  {
    icon: Sparkles,
    title: 'Personal Concierge',
    description: 'Dedicated luxury lifestyle managers available around the clock to fulfill every request.',
  },
  {
    icon: Plane,
    title: 'Private Aviation',
    description: 'Seamless private jet and helicopter arrangements to and from your destination.',
  },
  {
    icon: Utensils,
    title: 'Private Chef',
    description: 'World-class chefs creating bespoke culinary experiences in your residence.',
  },
  {
    icon: Car,
    title: 'Luxury Transport',
    description: 'Premium vehicle fleet including supercars, yachts, and chauffeur services.',
  },
  {
    icon: Compass,
    title: 'Curated Experiences',
    description: 'Exclusive access to events, reservations, and experiences unavailable elsewhere.',
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    description: 'Discreet security arrangements and complete confidentiality guaranteed.',
  },
  {
    icon: Clock,
    title: 'Priority Support',
    description: 'Dedicated assistance ensuring a seamless, worry-free experience.',
  },
  {
    icon: HeartHandshake,
    title: 'Family Services',
    description: 'Childcare, tutoring, and family-focused amenities for multigenerational stays.',
  },
]

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="services" ref={ref} className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-gold-600 text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Bespoke Services
          </p>
          <h2 className="font-merriweather text-3xl md:text-4xl lg:text-5xl text-charcoal-900 mb-6">
            Beyond Accommodation
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-gold-500 to-gold-300 rounded-full mx-auto mb-6" />
          <p className="text-charcoal-500 text-lg max-w-2xl mx-auto">
            Every detail meticulously orchestrated to create an experience 
            that transcends expectations.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative p-8 rounded-airbnb-lg glass-card float-card service-glow cursor-pointer"
            >
              {/* Icon */}
              <div className="mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-100 to-gold-50 flex items-center justify-center group-hover:from-gold-200 group-hover:to-gold-100 transition-all duration-500 shadow-sm">
                  <service.icon className="w-7 h-7 text-gold-600" />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-merriweather text-xl text-charcoal-900 mb-3 group-hover:text-gold-700 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-charcoal-500 text-sm leading-relaxed">
                {service.description}
              </p>

              {/* Hover accent */}
              <div className="absolute bottom-0 left-4 right-4 h-1 bg-gradient-to-r from-gold-400 to-gold-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
