import { NextRequest, NextResponse } from 'next/server'

const locales = ['en', 'de']

export default function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const { searchParams } = request.nextUrl
  
  // Get lang from query param
  const langParam = searchParams.get('lang')
  
  // Determine locale: query param > cookie > domain > default
  let locale = 'en'
  
  if (langParam && locales.includes(langParam)) {
    locale = langParam
  } else {
    const cookieLocale = request.cookies.get('locale')?.value
    if (cookieLocale && locales.includes(cookieLocale)) {
      locale = cookieLocale
    } else if (hostname.includes('primeluxurystays.de')) {
      locale = 'de'
    }
  }
  
  // Set cookie for locale persistence
  const response = NextResponse.next()
  response.cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 })
  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
