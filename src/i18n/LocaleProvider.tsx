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
}

const LocaleContext = createContext<LocaleContextType | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Detect locale from domain
    const hostname = window.location.hostname
    if (hostname.includes('primeluxurystays.de')) {
      setLocaleState('de')
    } else {
      // Check localStorage for preference
      const saved = localStorage.getItem('locale') as Locale
      if (saved && locales.includes(saved)) {
        setLocaleState(saved)
      }
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
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

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, messages: messages[locale] }}>
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

