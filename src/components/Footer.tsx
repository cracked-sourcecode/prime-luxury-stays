'use client'

import { motion } from 'framer-motion'
import { Instagram, Facebook, ArrowUp } from 'lucide-react'

const socialLinks = [
  { Icon: Instagram, href: 'https://www.instagram.com/primeluxurystays/', label: 'Instagram' },
  { Icon: Facebook, href: 'https://www.facebook.com/primeluxurystays', label: 'Facebook' },
]
import { useLocale } from '@/i18n/LocaleProvider'

const LOGO_URL = 'https://storage.googleapis.com/primeluxurystays-rpr/Logo%20no%20text%20(global%20header).png'

// Footer links with translation keys
const getFooterLinks = (t: (key: string) => string) => ({
  destinations: [
    { name: 'Ibiza', href: '/ibiza' },
    { name: 'Mallorca', href: '/mallorca' },
    { name: t('footer.links.southOfFrance'), href: '/south-of-france' },
  ],
  services: [
    { name: t('footer.links.concierge'), href: '/services/table-reservations' },
    { name: t('footer.links.experiences'), href: '/services/private-chef' },
    { name: t('footer.links.privateAviation'), href: '/services/private-aviation' },
    { name: t('footer.links.yachtCharter'), href: '/services/yacht-charter' },
  ],
  company: [
    { name: t('footer.links.aboutUs'), href: '/#about' },
    { name: t('footer.links.contact'), href: '/#contact' },
  ],
})

export default function Footer() {
  const { t } = useLocale()
  const currentYear = new Date().getFullYear()
  const footerLinks = getFooterLinks(t)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-8 md:py-16 lg:py-20">
          
          {/* Mobile: Brand & Contact first, left-aligned */}
          <div className="md:hidden mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12">
                <img src={LOGO_URL} alt="Prime Luxury Stays" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-merriweather text-charcoal-900 text-base">Prime Luxury Stays</h3>
                <p className="font-merriweather text-[9px] tracking-[0.15em] text-gold-600 uppercase">{t('nav.tagline')}</p>
              </div>
            </div>
            <p className="text-charcoal-500 text-sm leading-relaxed mb-4">
              {t('footer.tagline')}
            </p>
            <div className="text-sm text-charcoal-500 space-y-1 mb-4">
              <p>
                <span className="text-charcoal-400">🇺🇸 US:</span>{' '}
                <a href="tel:+12039797309" className="hover:text-gold-600">+1 (203) 979-7309</a>
              </p>
              <p>
                <span className="text-charcoal-400">🇩🇪 DE:</span>{' '}
                <a href="tel:+498989930046" className="hover:text-gold-600">+49 89 899 300 46</a>
              </p>
              <p>
                <span className="text-charcoal-400">🇪🇸 ES:</span>{' '}
                <a href="tel:+34634306076" className="hover:text-gold-600">+34 634 306 076</a>
              </p>
              <p><a href="mailto:info@primeluxurystays.com" className="hover:text-gold-600">info@primeluxurystays.com</a></p>
              <p className="text-charcoal-400">Miami / Munich / Mallorca</p>
              <p className="text-charcoal-400">{t('footer.registered')}</p>
            </div>
            <div className="flex items-center gap-3 mb-8">
              {socialLinks.map((social) => (
                <a 
                  key={social.label} 
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center text-charcoal-600 hover:bg-gold-100 hover:text-gold-700 transition-all"
                >
                  <social.Icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Mobile: Links below in horizontal grid */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
              <div>
                <h4 className="font-semibold text-charcoal-900 text-sm mb-3">{t('footer.destinations')}</h4>
                <ul className="space-y-2">
                  {footerLinks.destinations.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className="text-charcoal-500 hover:text-gold-600 transition-colors text-sm">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-charcoal-900 text-sm mb-3">{t('footer.services')}</h4>
                <ul className="space-y-2">
                  {footerLinks.services.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className="text-charcoal-500 hover:text-gold-600 transition-colors text-sm">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-charcoal-900 text-sm mb-3">{t('footer.company')}</h4>
                <ul className="space-y-2">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className="text-charcoal-500 hover:text-gold-600 transition-colors text-sm">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
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
                  <p className="font-merriweather text-xs tracking-[0.2em] text-gold-600 uppercase">{t('nav.tagline')}</p>
                </div>
              </div>
              <p className="text-charcoal-500 leading-relaxed mb-4 max-w-sm">
                {t('footer.tagline')}
              </p>
              <div className="text-charcoal-500 text-sm mb-4 space-y-1">
                <p>
                  <span className="text-charcoal-400 text-xs">🇺🇸 US:</span>{' '}
                  <a href="tel:+12039797309" className="hover:text-gold-600 transition-colors">+1 (203) 979-7309</a>
                </p>
                <p>
                  <span className="text-charcoal-400 text-xs">🇩🇪 DE:</span>{' '}
                  <a href="tel:+498989930046" className="hover:text-gold-600 transition-colors">+49 89 899 300 46</a>
                </p>
                <p>
                  <span className="text-charcoal-400 text-xs">🇪🇸 ES:</span>{' '}
                  <a href="tel:+34634306076" className="hover:text-gold-600 transition-colors">+34 634 306 076</a>
                </p>
                <p><a href="mailto:info@primeluxurystays.com" className="hover:text-gold-600 transition-colors">info@primeluxurystays.com</a></p>
              </div>
              <p className="text-charcoal-500 text-sm mb-4">Miami / Munich / Mallorca</p>
              <p className="text-xs text-charcoal-400 mb-6">{t('footer.registered')}</p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <motion.a 
                    key={social.label} 
                    href={social.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-xl bg-cream-100 flex items-center justify-center text-charcoal-600 hover:bg-gold-100 hover:text-gold-700 transition-all"
                  >
                    <social.Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-semibold text-charcoal-900 mb-5">{t('footer.destinations')}</h4>
              <ul className="space-y-3">
                {footerLinks.destinations.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-charcoal-500 hover:text-gold-600 transition-colors text-sm">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal-900 mb-5">{t('footer.services')}</h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-charcoal-500 hover:text-gold-600 transition-colors text-sm">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal-900 mb-5">{t('footer.company')}</h4>
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <div>
              <p className="text-charcoal-400 text-sm">
                {t('footer.copyright').replace('{year}', currentYear.toString())}
              </p>
              <p className="text-charcoal-400 text-xs mt-1">
                USt-IdNr. / VAT ID: DE460001928
              </p>
            </div>
            <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center md:justify-end">
              <a href="/privacy" className="text-charcoal-400 hover:text-gold-600 text-sm transition-colors">{t('footer.privacy')}</a>
              <a href="/terms" className="text-charcoal-400 hover:text-gold-600 text-sm transition-colors">{t('footer.terms')}</a>
              <a href="/cookies" className="text-charcoal-400 hover:text-gold-600 text-sm transition-colors">{t('footer.cookies')}</a>
              <a href="/legal-notice" className="text-charcoal-400 hover:text-gold-600 text-sm transition-colors">{t('footer.legal')}</a>
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
