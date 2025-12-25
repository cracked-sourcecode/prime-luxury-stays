'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Award, Users, Globe, Heart } from 'lucide-react'

const LOGO_URL = 'https://storage.googleapis.com/primeluxurystays/Logo%20no%20text%20(global%20header).png'

const highlights = [
  { icon: Award, label: 'Excellence', value: 'Award-Winning Service' },
  { icon: Users, label: 'Team', value: 'Expert Curators' },
  { icon: Globe, label: 'Reach', value: 'Global Presence' },
  { icon: Heart, label: 'Care', value: 'Personal Touch' },
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" ref={ref} className="py-16 lg:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-cream-50 to-white" />
      
      {/* Decorative blobs */}
      <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-gold-100/50 rounded-full blur-3xl -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative aspect-[4/5] rounded-airbnb-lg overflow-hidden image-shadow">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2940&auto=format&fit=crop')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
              </div>

              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute -bottom-6 -right-6 glass-heavy rounded-2xl p-6 max-w-xs hidden lg:block"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 rounded-full bg-cream-100 flex items-center justify-center p-2">
                    <img
                      src={LOGO_URL}
                      alt="Prime Luxury Stays"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-charcoal-900 font-semibold">Est. 2024</div>
                    <div className="text-gold-600 text-sm">New Era of Luxury</div>
                  </div>
                </div>
                <p className="text-charcoal-500 text-sm">
                  Building on decades of industry expertise under a new vision.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <p className="text-gold-600 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              About Us
            </p>
            <h2 className="font-merriweather text-3xl md:text-4xl lg:text-5xl text-charcoal-900 mb-6" style={{ lineHeight: '1.3' }}>
              A Legacy of
              <br />
              <span className="text-gold-gradient">Excellence</span>
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-gold-500 to-gold-300 rounded-full mb-8" />

            <div className="space-y-5 text-charcoal-600 leading-relaxed">
              <p>
                Prime Luxury Stays represents the next evolution in luxury 
                property management. We've assembled a team of industry veterans 
                who share a singular vision: to deliver experiences that redefine 
                what it means to travel in luxury.
              </p>
              <p>
                Our portfolio is carefully curated to include only the most 
                exceptional properties—estates that offer not just accommodation, 
                but transformation. Each residence tells its own story of 
                architectural brilliance, breathtaking locations, and uncompromising 
                attention to detail.
              </p>
            </div>

            {/* Highlights Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-2 gap-4 mt-10"
            >
              {highlights.map((item, index) => (
                <div 
                  key={item.label}
                  className="glass-card rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <div className="text-charcoal-900 font-semibold text-sm">{item.label}</div>
                    <div className="text-charcoal-500 text-xs">{item.value}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
