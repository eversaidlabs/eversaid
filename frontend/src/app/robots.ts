import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  const host = process.env.NEXT_PUBLIC_SITE_URL || BASE_URL
  const isProduction = process.env.NODE_ENV === 'production' && host === BASE_URL

  // Block all crawlers on non-production environments
  if (!isProduction) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/en/', '/sl/'],
        disallow: ['/demo/', '/api/', '/api-docs/', '/auth/', '/ingest/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
