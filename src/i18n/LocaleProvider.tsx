'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Locale, defaultLocale, locales } from './config'
import enMessages from './messages/en.json'
import deMessages from './messages/de.json'

type Messages = typeof enMessages

const messages: Record<Locale, Messages> = {
  en: enMessages,
  de: deMessages,
}

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  messages: Messages
  localizeHref: (href: string) => string
}

const LocaleContext = createContext<LocaleContextType | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Priority: URL param > cookie > domain > localStorage > default
    const urlParams = new URLSearchParams(window.location.search)
    const langParam = urlParams.get('lang') as Locale
    
    if (langParam && locales.includes(langParam)) {
      setLocaleState(langParam)
      localStorage.setItem('locale', langParam)
      return
    }
    
    // Check cookie (set by middleware)
    const cookieLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='))
      ?.split('=')[1] as Locale
    
    if (cookieLocale && locales.includes(cookieLocale)) {
      setLocaleState(cookieLocale)
      return
    }
    
    // Fallback to domain detection
    const hostname = window.location.hostname
    if (hostname.includes('primeluxurystays.de')) {
      setLocaleState('de')
      return
    }
    
    // Check localStorage for preference
    const saved = localStorage.getItem('locale') as Locale
    if (saved && locales.includes(saved)) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    
    // Update URL with lang parameter
    const url = new URL(window.location.href)
    url.searchParams.set('lang', newLocale)
    window.location.href = url.toString()
  }

  // Translation function with dot notation support
  const t = (key: string): string => {
    const keys = key.split('.')
    let result: unknown = messages[locale]
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = (result as Record<string, unknown>)[k]
      } else {
        // Fallback to English
        result = messages.en
        for (const fallbackKey of keys) {
          if (result && typeof result === 'object' && fallbackKey in result) {
            result = (result as Record<string, unknown>)[fallbackKey]
          } else {
            return key // Return key if translation not found
          }
        }
        break
      }
    }
    
    return typeof result === 'string' ? result : key
  }

  // Helper to create locale-aware links with ?lang= parameter
  const localizeHref = (href: string): string => {
    if (locale === 'de') {
      // Add lang=de parameter to preserve language across navigation
      if (href.includes('?')) {
        return `${href}&lang=de`
      } else if (href.includes('#')) {
        // Handle anchor links like /#about
        const [path, hash] = href.split('#')
        return `${path}?lang=de#${hash}`
      }
      return `${href}?lang=de`
    }
    return href
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, messages: messages[locale], localizeHref }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    // Return default values if not wrapped in provider
    return {
      locale: defaultLocale,
      setLocale: () => {},
      t: (key: string) => key,
      messages: messages[defaultLocale],
      localizeHref: (href: string) => href,
    }
  }
  return context
}

export function useTranslations(namespace?: string) {
  const { t, locale, messages } = useLocale()
  
  return (key: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key
    return t(fullKey)
  }
}

