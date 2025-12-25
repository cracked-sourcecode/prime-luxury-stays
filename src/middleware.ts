import { NextRequest, NextResponse } from 'next/server'

export default function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  
  // If .de domain, set a cookie to indicate German locale
  if (hostname.includes('primeluxurystays.de')) {
    const response = NextResponse.next()
    response.cookies.set('locale', 'de', { path: '/' })
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  // Only run on page routes, not API or static files
  matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)']
}
