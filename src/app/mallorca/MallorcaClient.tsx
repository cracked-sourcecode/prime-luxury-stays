'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { 
  MapPin, 
  Sun, 
  Waves, 
  Mountain, 
  Wine, 
  Anchor,
  Star,
  ArrowRight,
  Bed,
  Bath,
  Users,
  Calendar,
  Quote,
  ChevronDown,
  Sparkles,
  Shield,
  Clock,
  Heart
} from 'lucide-react'
import PropertyMap from '@/components/PropertyMap'
import type { Property } from '@/lib/properties'

interface MallorcaClientProps {
  properties: Property[];
}

export default function MallorcaClient({ properties }: MallorcaClientProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const heroCandidates = [
    'https://storage.googleapis.com/primeluxurystays/Mallorca%20page%20Hero%20Section.png',
  ]
  const [heroImageUrl, setHeroImageUrl] = useState(heroCandidates[0])
  const [heroTryIndex, setHeroTryIndex] = useState(0)

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    // Reset hero image if the candidates ever change
    setHeroImageUrl(heroCandidates[0])
    setHeroTryIndex(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleHeroImageError = () => {
    const nextIndex = heroTryIndex + 1
    if (nextIndex < heroCandidates.length) {
      setHeroTryIndex(nextIndex)
      setHeroImageUrl(heroCandidates[nextIndex])
    }
  }

  return (
    <div className="overflow-hidden">
      {/* ========== CINEMATIC HERO ========== */}
      <section ref={heroRef} className="relative h-screen min-h-[800px]">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          {/* Background image */}
          <img
            key={heroImageUrl}
            src={heroImageUrl}
            alt="Mallorca"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            onError={handleHeroImageError}
          />
          {/* Contrast overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-charcoal-900" />
        </motion.div>
        
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="max-w-5xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="inline-flex items-center gap-2 bg-gold-500/20 backdrop-blur-md text-gold-300 px-6 py-3 rounded-full mb-8 border border-gold-400/30"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">The Mediterranean's Best Kept Secret</span>
            </motion.div>
            
            <h1 className="font-merriweather text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-[0.95]">
              Mallorca
            </h1>
            
            <p className="text-white/80 text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              Where turquoise waters meet ancient mountains. Where every sunset 
              feels like the first. Where your private paradise awaits.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <a href="#villas" className="btn-gold text-base px-10 py-5 flex items-center gap-2">
                <span>Explore Our Villas</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <Link href="/#contact" className="bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20">
                Request Information
              </Link>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-12"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-3 text-white/60"
            >
              <span className="text-xs tracking-[0.3em] uppercase">Discover More</span>
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ========== THE PROMISE - WHAT WE OFFER ========== */}
      <section className="relative z-20 py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-gold-600 text-sm font-semibold tracking-[0.3em] uppercase mb-5">
                The Prime Luxury Stays Difference
              </p>
              <h2 className="font-merriweather text-3xl md:text-4xl lg:text-5xl text-charcoal-900 mb-8 leading-tight">
                Not Just a Stay.
                <br />
                <span className="text-gold-600">An Experience.</span>
              </h2>
              <p className="text-charcoal-500 text-xl mb-10 leading-relaxed">
                Every property in our collection has been personally inspected and 
                approved. We don't just rent houses—we craft memories that last a lifetime.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Shield, title: 'Verified Excellence', desc: 'Every villa personally inspected by our team' },
                  { icon: Clock, title: 'Dedicated Concierge', desc: 'Personal support from booking to checkout' },
                  { icon: Heart, title: 'Curated Experiences', desc: 'Private chefs, yacht charters, exclusive access' },
                  { icon: Star, title: 'Best Price Guarantee', desc: 'Direct booking means no middleman markups' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-5"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-100 to-gold-50 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-7 h-7 text-gold-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal-900 text-lg mb-1">{item.title}</h4>
                      <p className="text-charcoal-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80"
                  alt="Luxury Villa"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating testimonial */}
              <div className="absolute -bottom-10 -left-10 bg-white rounded-2xl shadow-2xl p-8 max-w-sm border border-gray-100">
                <Quote className="w-10 h-10 text-gold-400 mb-4" />
                <p className="text-charcoal-700 text-lg italic mb-5 leading-relaxed">
                  "The villa exceeded every expectation. The concierge arranged everything 
                  perfectly. This is how luxury should feel."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">M</span>
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal-900">Marcus R.</p>
                    <p className="text-charcoal-400 text-sm">Vista Malgrat, July 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== WHY MALLORCA - VISUAL STORY ========== */}
      <section className="relative z-20 py-28 bg-cream-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-gold-600 text-sm font-semibold tracking-[0.3em] uppercase mb-5">
              The Island
            </p>
            <h2 className="font-merriweather text-4xl md:text-5xl lg:text-6xl text-charcoal-900 mb-6">
              Why the World's Elite
              <br />
              <span className="text-gold-600">Choose Mallorca</span>
            </h2>
          </div>

          {/* Immersive Bento Grid */}
          <div className="grid grid-cols-12 gap-5 auto-rows-[200px]">
            {/* Large Feature - Beaches */}
            <div className="col-span-12 md:col-span-8 row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&q=80"
                alt="Mallorca Coast"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <div className="flex items-center gap-3 text-gold-400 mb-4">
                  <Waves className="w-6 h-6" />
                  <span className="text-sm font-semibold tracking-[0.2em] uppercase">262 Beaches</span>
                </div>
                <h3 className="font-merriweather text-3xl md:text-4xl text-white mb-4">
                  Crystal Clear Mediterranean
                </h3>
                <p className="text-white/70 text-lg max-w-xl">
                  From hidden coves to pristine sandy beaches, discover waters so clear 
                  you'll see the bottom 30 meters down.
                </p>
              </div>
            </div>

            {/* Mountains */}
            <div className="col-span-12 md:col-span-4 row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                alt="Tramuntana Mountains"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-gold-400 mb-2">
                  <Mountain className="w-5 h-5" />
                  <span className="text-xs font-semibold tracking-[0.15em] uppercase">UNESCO Heritage</span>
                </div>
                <h3 className="font-merriweather text-xl text-white">
                  Serra de Tramuntana
                </h3>
              </div>
            </div>

            {/* Gastronomy */}
            <div className="col-span-6 md:col-span-4 row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
                alt="Fine Dining"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-gold-400 mb-2">
                  <Wine className="w-5 h-5" />
                  <span className="text-xs font-semibold tracking-[0.15em] uppercase">Michelin Stars</span>
                </div>
                <h3 className="font-merriweather text-xl text-white">
                  World-Class Dining
                </h3>
              </div>
            </div>

            {/* Yachts */}
            <div className="col-span-6 md:col-span-4 row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80"
                alt="Yacht Marina"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-gold-400 mb-2">
                  <Anchor className="w-5 h-5" />
                  <span className="text-xs font-semibold tracking-[0.15em] uppercase">Nautical Paradise</span>
                </div>
                <h3 className="font-merriweather text-xl text-white">
                  Premier Marinas
                </h3>
              </div>
            </div>

            {/* Sunshine */}
            <div className="col-span-12 md:col-span-4 row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80"
                alt="Sunny Days"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-gold-400 mb-2">
                  <Sun className="w-5 h-5" />
                  <span className="text-xs font-semibold tracking-[0.15em] uppercase">300+ Days / Year</span>
                </div>
                <h3 className="font-merriweather text-xl text-white">
                  Endless Sunshine
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PROPERTIES SHOWCASE ========== */}
      <section id="villas" className="relative z-20 bg-cream-50 pt-32 pb-28 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-gold-600 text-sm font-semibold tracking-[0.3em] uppercase mb-5">
              Our Collection
            </p>
            <h2 className="font-merriweather text-4xl md:text-5xl lg:text-6xl text-charcoal-900 mb-6">
              Handpicked Luxury Villas
            </h2>
            <p className="text-charcoal-500 text-xl max-w-3xl mx-auto">
              Each property personally vetted to ensure it meets our exacting standards. 
              These aren't just houses—they're experiences waiting to unfold.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {properties.map((property) => (
              <div key={property.id}>
                <Link href={`/properties/${property.slug}`} className="group block">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-xl">
                    <img
                      src={property.featured_image || ''}
                      alt={property.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {property.is_featured && (
                      <div className="absolute top-5 left-5 bg-gold-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                        <Star className="w-4 h-4 fill-white" />
                        Featured
                      </div>
                    )}

                    <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-sm text-charcoal-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      {property.house_type}
                    </div>

                    {/* Quick stats on hover */}
                    <div className="absolute bottom-5 left-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl px-5 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-5 text-charcoal-700">
                          <span className="flex items-center gap-2">
                            <Bed className="w-5 h-5" /> {property.bedrooms}
                          </span>
                          <span className="flex items-center gap-2">
                            <Bath className="w-5 h-5" /> {property.bathrooms}
                          </span>
                          <span className="flex items-center gap-2">
                            <Users className="w-5 h-5" /> {property.max_guests}
                          </span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gold-500" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-charcoal-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 text-gold-500" />
                    <span>{property.city}, Mallorca</span>
                  </div>

                  <h3 className="font-merriweather text-2xl text-charcoal-900 mb-3 group-hover:text-gold-600 transition-colors">
                    {property.name}
                  </h3>

                  <p className="text-charcoal-500 leading-relaxed">
                    {property.short_description}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PROPERTIES MAP SECTION ========== */}
      <section className="py-28 bg-charcoal-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(184,149,76,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-gold-400 text-sm font-semibold tracking-[0.3em] uppercase mb-5">
              Prime Locations
            </p>
            <h2 className="font-merriweather text-4xl md:text-5xl text-white mb-6">
              Our Properties Across the Island
            </h2>
            <p className="text-white/60 text-xl max-w-2xl mx-auto">
              Strategically located in Mallorca's most prestigious areas. 
              Each pin represents an opportunity for an unforgettable experience.
            </p>
          </motion.div>

          {/* Region Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {[
              { name: 'Santa Ponsa', count: 2 },
              { name: 'Calvià', count: 1 },
              { name: 'Port d\'Andratx', count: 2 },
              { name: 'Alcudia', count: 1 },
              { name: 'Cas Concos', count: 1 },
            ].map((region, i) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="text-gold-400 font-merriweather text-2xl mb-1">{region.count}</div>
                <div className="text-white/70 text-sm">{region.name}</div>
              </motion.div>
            ))}
                  </div>

          <div className="h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <PropertyMap 
              properties={properties}
              selectedProperty={selectedProperty}
              onPropertySelect={setSelectedProperty}
            />
                  </div>

          {selectedProperty && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex justify-center"
            >
              <Link 
                href={`/properties/${selectedProperty.slug}`}
                className="bg-gold-500 text-charcoal-900 px-10 py-5 rounded-xl font-semibold hover:bg-gold-400 transition-colors inline-flex items-center gap-3 text-lg"
              >
                View {selectedProperty.name}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          )}
                  </div>
      </section>

      {/* ========== URGENCY / SOCIAL PROOF ========== */}
      <section className="py-20 bg-gold-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: '98%', label: 'Guest Satisfaction' },
              { value: '500+', label: 'Happy Guests' },
              { value: '7', label: 'Exclusive Properties' },
              { value: '5★', label: 'Service Rating' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="font-merriweather text-4xl md:text-5xl text-white mb-2">{stat.value}</div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="relative py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-charcoal-900/85" />
        
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Sparkles className="w-10 h-10 text-gold-400 mx-auto mb-8" />
            
            <h2 className="font-merriweather text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
              Your Mediterranean Dream
              <br />
              <span className="text-gold-400">Starts Here</span>
            </h2>
            <p className="text-white/70 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
              Let our concierge team craft the perfect Mallorcan escape. 
              Direct booking. Exclusive properties. Unforgettable experiences.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link 
                href="/#contact" 
                className="btn-gold text-lg px-12 py-5 flex items-center gap-3"
              >
                <Calendar className="w-5 h-5" />
                Request Your Villa
            </Link>
              <a href="tel:+498989930046" className="text-white/70 hover:text-white transition-colors text-lg">
                or call <span className="text-gold-400 font-semibold">+49 89 899 300 46</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
