import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n/config'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
})

export const config = {
  // Match all pathnames except for:
  // - API routes
  // - _next (Next.js internals)
  // - Static files (files with extensions)
  matcher: ['/', '/(en|sl)/:path*', '/((?!api|_next|.*\\..*).*)']
}
