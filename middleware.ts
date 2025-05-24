import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'vi'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  // Check if locale is in pathname
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    // Try to get locale from Accept-Language header
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
      const preferredLocale = acceptLanguage
        .split(',')[0]
        .split('-')[0]
        .toLowerCase();
      
      if (locales.includes(preferredLocale)) {
        return preferredLocale;
      }
    }
    
    return defaultLocale;
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const url = request.nextUrl.clone();
  
  // Legacy version paths should be accessed directly without any redirects
  // They don't have localization support so we just serve them as-is
  if (pathname.startsWith('/v1.0') || pathname.startsWith('/v2.0')) {
    // Don't redirect, let the request pass through to serve static files
    return;
  }
  
  // Check if pathname already has a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale and it's not a static asset or API route
  if (pathnameIsMissingLocale && 
      !pathname.startsWith('/_next') && 
      !pathname.startsWith('/api') &&
      !pathname.includes('.')) {
    const locale = getLocale(request);
    
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next), static assets, and legacy versions
    '/((?!_next|api|favicon.ico|assets|v1.0|v2.0).*)',
  ],
};
