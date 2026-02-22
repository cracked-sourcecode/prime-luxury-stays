'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search, Globe } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleProvider'

const LOGO_URL = 'https://storage.googleapis.com/primeluxurystays-rpr/Logo%20no%20text%20(global%20header).png'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const { locale, setLocale, t, localizeHref } = useLocale()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: t('nav.about'), href: localizeHref('/#about') },
    { name: t('nav.contact'), href: localizeHref('/#contact') },
    { name: t('nav.destinations'), href: localizeHref('/destinations') },
    { name: t('nav.properties'), href: localizeHref('/properties') },
    { name: locale === 'de' ? 'Yachten' : 'Yachts', href: localizeHref('/yachts') },
    { name: t('nav.services'), href: localizeHref('/services') },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white py-2.5 md:py-3 shadow-lg' 
            : 'py-3.5 md:py-5 bg-white shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href={localizeHref('/')} className="flex items-center gap-2.5 md:gap-3 group">
              <div className="relative w-11 h-11 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-shrink-0">
                <img
                  src={LOGO_URL}
                  alt="Prime Luxury Stays"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="font-merriweather text-charcoal-900 text-[15px] md:text-lg lg:text-xl tracking-wide leading-tight">
                  Prime Luxury Stays
                </h1>
                <p className="font-merriweather text-[9px] md:text-[10px] tracking-[0.12em] md:tracking-[0.2em] text-gold-500 uppercase">
                  {t('nav.tagline')}
                </p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="link-underline text-charcoal-700 hover:text-gold-600 text-[13px] font-medium tracking-wide transition-colors duration-300 py-2 relative z-10 whitespace-nowrap"
                >
                  {link.name}
                </a>
              ))}
              
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-1 text-charcoal-700 hover:text-gold-600 transition-colors py-2 px-1"
                >
                  <Globe size={16} />
                  <span className="text-[13px] font-medium uppercase">{locale}</span>
                </button>
                
                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden min-w-[120px]"
                    >
                      <button
                        onClick={() => { setLocale('en'); setShowLangMenu(false) }}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-cream-50 transition-colors ${locale === 'en' ? 'text-gold-600 font-medium' : 'text-charcoal-700'}`}
                      >
                        <span className="text-lg">🇬🇧</span>
                        English
                      </button>
                      <button
                        onClick={() => { setLocale('de'); setShowLangMenu(false) }}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-cream-50 transition-colors ${locale === 'de' ? 'text-gold-600 font-medium' : 'text-charcoal-700'}`}
                      >
                        <span className="text-lg">🇩🇪</span>
                        Deutsch
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* CTA Button - inline with nav */}
              <a href={localizeHref('/destinations')} className="btn-gold ml-2 relative z-10 text-[13px] px-4 py-2.5 whitespace-nowrap">
                {t('nav.viewDestinations')}
              </a>
            </div>
            
            {/* Mobile/Tablet Menu Button - show on everything below xl */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 text-charcoal-900 hover:text-gold-600 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 xl:hidden"
          >
            {/* Full screen white overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white"
            >
              {/* Header area with logo and close button */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                <a href={localizeHref('/')} className="flex items-center gap-2.5">
                  <div className="w-11 h-11">
                    <img
                      src={LOGO_URL}
                      alt="Prime Luxury Stays"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-merriweather text-charcoal-900 text-[15px] leading-tight">Prime Luxury Stays</h3>
                    <p className="font-merriweather text-[9px] tracking-[0.12em] text-gold-500 uppercase">{t('nav.tagline')}</p>
                  </div>
                </a>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-charcoal-900 hover:text-gold-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Menu content */}
              <div className="px-6 py-8">
                <div className="flex flex-col gap-6">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="font-merriweather text-2xl text-charcoal-900 hover:text-gold-600 transition-colors"
                    >
                      {link.name}
                    </motion.a>
                  ))}
                  {/* Language Switcher for Mobile */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-4 mt-4"
                  >
                    <button
                      onClick={() => setLocale('en')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                        locale === 'en' 
                          ? 'border-gold-500 bg-gold-50 text-gold-700' 
                          : 'border-gray-200 text-charcoal-600 hover:border-gold-300'
                      }`}
                    >
                      <span className="text-lg">🇬🇧</span>
                      <span className="text-sm font-medium">EN</span>
                    </button>
                    <button
                      onClick={() => setLocale('de')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                        locale === 'de' 
                          ? 'border-gold-500 bg-gold-50 text-gold-700' 
                          : 'border-gray-200 text-charcoal-600 hover:border-gold-300'
                      }`}
                    >
                      <span className="text-lg">🇩🇪</span>
                      <span className="text-sm font-medium">DE</span>
                    </button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8"
                  >
                    <a href={localizeHref('/destinations')} className="btn-gold block text-center">
                      {t('nav.viewDestinations')}
                    </a>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
