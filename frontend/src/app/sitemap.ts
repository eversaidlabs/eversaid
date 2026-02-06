import type { MetadataRoute } from 'next'
import { locales, defaultLocale } from '@/i18n/config'
import { BASE_URL } from '@/lib/seo'

/**
 * Public pages to include in the sitemap.
 * Add new pages here as they become available.
 */
const pages = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries([
          ...locales.map((loc) => [loc, `${BASE_URL}/${loc}${page.path}`]),
          ['x-default', `${BASE_URL}/${defaultLocale}${page.path}`],
        ]),
      },
    }))
  )
}
