'use client'

import { motion } from 'framer-motion'
import { Instagram, Linkedin, Facebook, ArrowUp } from 'lucide-react'

const LOGO_URL = 'https://storage.googleapis.com/primeluxurystays/Logo%20no%20text%20(global%20header).png'

const footerLinks = {
  destinations: [
    { name: 'Ibiza', href: '/ibiza' },
    { name: 'Mallorca', href: '/mallorca' },
    { name: 'South of France', href: '/south-of-france' },
  ],
  services: [
    { name: 'Concierge', href: '#' },
    { name: 'Experiences', href: '#' },
    { name: 'Private Aviation', href: '#' },
    { name: 'Yacht Charter', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
  ],
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-8 md:py-16 lg:py-20">
          
          {/* Mobile: Links first in horizontal grid */}
          <div className="md:hidden grid grid-cols-3 gap-4 mb-8 pb-6 border-b border-gray-100">
            <div>
              <h4 className="font-semibold text-charcoal-900 text-xs mb-2">Destinations</h4>
              <ul className="space-y-1">
                {footerLinks.destinations.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-charcoal-500 hover:text-gold-600 transition-colors text-xs">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal-900 text-xs mb-2">Services</h4>
              <ul className="space-y-1">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-charcoal-500 hover:text-gold-600 transition-colors text-xs">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal-900 text-xs mb-2">Company</h4>
              <ul className="space-y-1">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-charcoal-500 hover:text-gold-600 transition-colors text-xs">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mobile: Brand & Contact compact */}
          <div className="md:hidden text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-10 h-10">
                <img src={LOGO_URL} alt="Prime Luxury Stays" className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <h3 className="font-merriweather text-charcoal-900 text-sm">Prime Luxury Stays</h3>
                <p className="font-merriweather text-[8px] tracking-[0.15em] text-gold-600 uppercase">Property Management</p>
              </div>
            </div>
            <p className="text-charcoal-500 text-xs leading-relaxed mb-3 max-w-xs mx-auto">
              Curating extraordinary experiences in the world's most exceptional private residences.
            </p>
            <div className="text-xs text-charcoal-500 space-y-0.5 mb-3">
              <p>
                <span className="text-charcoal-400">US:</span>{' '}
                <a href="tel:+12039797309" className="hover:text-gold-600">+1 (203) 979-7309</a>
                {' · '}
                <span className="text-charcoal-400">EU:</span>{' '}
                <a href="tel:+498989930046" className="hover:text-gold-600">+49 89 899 300 46</a>
              </p>
              <p><a href="mailto:info@primeluxurystays.com" className="hover:text-gold-600">info@primeluxurystays.com</a></p>
              <p className="text-charcoal-400">Miami, Florida / Munich, Germany · EU & US Registered</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              {[Instagram, Linkedin, Facebook].map((Icon, index) => (
                <a key={index} href="#" className="w-8 h-8 rounded-lg bg-cream-100 flex items-center justify-center text-charcoal-600 hover:bg-gold-100 hover:text-gold-700 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-16 h-16">
                  <img src={LOGO_URL} alt="Prime Luxury Stays" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-merriweather text-charcoal-900 text-xl">Prime Luxury Stays</h3>
                  <p className="font-merriweather text-xs tracking-[0.2em] text-gold-600 uppercase">Property Management</p>
                </div>
              </div>
              <p className="text-charcoal-500 leading-relaxed mb-4 max-w-sm">
                Curating extraordinary experiences in the world's most exceptional private residences. Where luxury meets legacy.
              </p>
              <div className="text-charcoal-500 text-sm mb-4 space-y-1">
                <p>
                  <span className="text-charcoal-400 text-xs">US:</span>{' '}
                  <a href="tel:+12039797309" className="hover:text-gold-600 transition-colors">+1 (203) 979-7309</a>
                </p>
                <p>
                  <span className="text-charcoal-400 text-xs">EU:</span>{' '}
                  <a href="tel:+498989930046" className="hover:text-gold-600 transition-colors">+49 89 899 300 46</a>
                </p>
                <p><a href="mailto:info@primeluxurystays.com" className="hover:text-gold-600 transition-colors">info@primeluxurystays.com</a></p>
              </div>
              <p className="text-charcoal-500 text-sm mb-4">Miami, Florida / Munich, Germany</p>
              <p className="text-xs text-charcoal-400 mb-6">EU & US Registered Business</p>
              <div className="flex items-center gap-3">
                {[Instagram, Linkedin, Facebook].map((Icon, index) => (
                  <motion.a key={index} href="#" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-xl bg-cream-100 flex items-center justify-center text-charcoal-600 hover:bg-gold-100 hover:text-gold-700 transition-all">
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-semibold text-charcoal-900 mb-5">Destinations</h4>
              <ul className="space-y-3">
                {footerLinks.destinations.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-charcoal-500 hover:text-gold-600 transition-colors text-sm">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal-900 mb-5">Services</h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-charcoal-500 hover:text-gold-600 transition-colors text-sm">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal-900 mb-5">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-charcoal-500 hover:text-gold-600 transition-colors text-sm">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 md:py-6 border-t border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-charcoal-400 text-xs md:text-sm text-center md:text-left">
              © {currentYear} Prime Luxury Stays. All rights reserved.
            </p>
            <div className="flex items-center gap-3 md:gap-6 flex-wrap justify-center">
              <a href="#" className="text-charcoal-400 hover:text-gold-600 text-xs md:text-sm transition-colors">Privacy</a>
              <a href="#" className="text-charcoal-400 hover:text-gold-600 text-xs md:text-sm transition-colors">Terms</a>
              <a href="#" className="text-charcoal-400 hover:text-gold-600 text-xs md:text-sm transition-colors">Cookies</a>
              <a href="/legal-notice" className="text-charcoal-400 hover:text-gold-600 text-xs md:text-sm transition-colors">Legal</a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gold-500 text-white shadow-gold flex items-center justify-center hover:bg-gold-600 transition-colors z-40"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  )
}
