import { NextRequest, NextResponse } from 'next/server'

const locales = ['en', 'de']
const defaultLocale = 'en'

function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split('/')
  const potentialLocale = segments[1]
  if (locales.includes(potentialLocale)) {
    return potentialLocale
  }
  return null
}

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const hostname = request.headers.get('host') || ''
  
  // Skip admin, API, static files
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }
  
  // Check if locale is already in the path
  const pathLocale = getLocaleFromPath(pathname)
  
  if (pathLocale) {
    // Rewrite to the actual path without the locale prefix
    // This allows /de/properties to serve /properties but keep /de/properties in the URL
    const actualPath = pathname.replace(`/${pathLocale}`, '') || '/'
    const url = request.nextUrl.clone()
    url.pathname = actualPath
    
    const response = NextResponse.rewrite(url)
    response.cookies.set('locale', pathLocale, { path: '/' })
    return response
  }
  
  // No locale in path - determine which one to use
  let locale = defaultLocale
  
  // Check cookie first
  const cookieLocale = request.cookies.get('locale')?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    locale = cookieLocale
  }
  
  // .de domain defaults to German
  if (hostname.includes('primeluxurystays.de')) {
    locale = 'de'
  }
  
  // Redirect to localized URL only for German (keep English URLs clean)
  if (locale === 'de') {
    const url = request.nextUrl.clone()
    url.pathname = `/de${pathname}`
    return NextResponse.redirect(url)
  }
  
  // English locale - set cookie and continue without redirect
  const response = NextResponse.next()
  response.cookies.set('locale', 'en', { path: '/' })
  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)']
}
