'use client'

import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Check } from 'lucide-react'

const stats = [
  { value: '800+', label: 'Happy Guests' },
  { value: '14', label: 'Exclusive Villas' },
  { value: 'Direct', label: 'Best Rate Guarantee' },
  { value: 'EU & US', label: 'Operations' },
]

const features = [
  'Personally vetted luxury properties',
  'White-glove concierge service',
  'Bespoke travel experiences',
  'Complete privacy guaranteed',
]

export default function Experience() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])

  return (
    <section id="experience" ref={containerRef} className="relative py-16 lg:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream-100 via-white to-cream-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gold-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-100/40 rounded-full blur-3xl" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold-600 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              The Experience
            </p>
            <h2 className="font-merriweather text-3xl md:text-4xl lg:text-5xl text-charcoal-900 mb-6 leading-tight">
              Redefining
              <br />
              <span className="text-gold-gradient">Luxury Living</span>
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-gold-500 to-gold-300 rounded-full mb-8" />
            <p className="text-charcoal-600 text-lg leading-relaxed mb-6">
              At Prime Luxury Stays, we curate more than accommodations—we craft 
              unforgettable experiences. Each property in our portfolio is 
              handpicked for its exceptional character, premium amenities, and 
              unparalleled locations.
            </p>
            <p className="text-charcoal-500 leading-relaxed mb-10">
              Our dedicated concierge team ensures every aspect of your stay 
              exceeds expectations, from private chef arrangements to exclusive 
              local experiences that money can't normally buy.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-6 h-6 rounded-full bg-gold-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-gold-600" />
                  </div>
                  <span className="text-charcoal-700 font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-heavy rounded-airbnb-lg p-8 lg:p-12">
              <div className="grid grid-cols-2 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="font-merriweather text-4xl lg:text-5xl text-gold-600 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-charcoal-500 text-sm font-medium tracking-wide">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Divider */}
              <div className="divider-gold my-10" />

              {/* Quote */}
              <div className="text-center">
                <p className="font-merriweather text-xl text-charcoal-700 italic mb-4">
                  "Excellence is not a destination but a continuous journey."
                </p>
                <p className="text-gold-600 text-sm font-semibold tracking-wide">
                  — Our Philosophy
                </p>
              </div>
            </div>

            {/* Floating accent card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute -bottom-16 -left-6 glass-gold rounded-2xl p-6 hidden lg:block"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center">
                  <span className="text-white font-merriweather text-xl">P</span>
                </div>
                <div>
                  <div className="text-charcoal-900 font-semibold">Trusted by</div>
                  <div className="text-gold-700 text-sm">Elite Travelers Worldwide</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
