export const locales = ['en', 'de'] as const
export const defaultLocale = 'en' as const

export type Locale = (typeof locales)[number]

// Domain to locale mapping
export const domainLocales: Record<string, Locale> = {
  'primeluxurystays.com': 'en',
  'primeluxurystays.de': 'de',
  'www.primeluxurystays.com': 'en',
  'www.primeluxurystays.de': 'de',
  'localhost': 'en',
}

export function getLocaleFromDomain(hostname: string): Locale {
  return domainLocales[hostname] || defaultLocale
}

