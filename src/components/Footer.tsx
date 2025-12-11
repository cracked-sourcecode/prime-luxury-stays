'use client'

import { motion } from 'framer-motion'
import { Instagram, Linkedin, Facebook, ArrowUp } from 'lucide-react'

const LOGO_URL = 'https://storage.googleapis.com/primeluxurystays/Logo%20no%20text%20(global%20header).png'

const footerLinks = {
  destinations: [
    { name: 'Mediterranean', href: '#' },
    { name: 'Alpine', href: '#' },
    { name: 'Caribbean', href: '#' },
    { name: 'African Safari', href: '#' },
  ],
  services: [
    { name: 'Concierge', href: '#' },
    { name: 'Private Aviation', href: '#' },
    { name: 'Yacht Charter', href: '#' },
    { name: 'Experiences', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' },
    { name: 'Careers', href: '#' },
    { name: 'Press', href: '#' },
  ],
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-16 h-16">
                  <img
                    src={LOGO_URL}
                    alt="Prime Luxury Stays"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-merriweather text-charcoal-900 text-xl">
                    Prime Luxury Stays
                  </h3>
                  <p className="font-merriweather text-xs tracking-[0.2em] text-gold-600 uppercase">
                    Property Management
                  </p>
                </div>
              </div>
              <p className="text-charcoal-500 leading-relaxed mb-8 max-w-sm">
                Curating extraordinary experiences in the world's most 
                exceptional private residences. Where luxury meets legacy.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {[Instagram, Linkedin, Facebook].map((Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-xl bg-cream-100 flex items-center justify-center text-charcoal-600 hover:bg-gold-100 hover:text-gold-700 transition-all"
                  >
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
                    <a
                      href={link.href}
                      className="text-charcoal-500 hover:text-gold-600 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-charcoal-900 mb-5">Services</h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-charcoal-500 hover:text-gold-600 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-charcoal-900 mb-5">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-charcoal-500 hover:text-gold-600 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-charcoal-400 text-sm">
              © {currentYear} Prime Luxury Stays Management. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-charcoal-400 hover:text-gold-600 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-charcoal-400 hover:text-gold-600 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-charcoal-400 hover:text-gold-600 text-sm transition-colors">
                Cookie Policy
              </a>
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
