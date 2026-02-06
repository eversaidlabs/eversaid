import { locales, defaultLocale } from '@/i18n/config'

export const BASE_URL = 'https://eversaid.ai'

/**
 * Generates canonical and hreflang alternates for a given page.
 * Each locale gets a self-referencing canonical, with x-default pointing to English.
 */
export function getAlternates(locale: string, path: string = '') {
  const languages: Record<string, string> = {}

  for (const loc of locales) {
    languages[loc] = `${BASE_URL}/${loc}${path}`
  }
  languages['x-default'] = `${BASE_URL}/${defaultLocale}${path}`

  return {
    canonical: `${BASE_URL}/${locale}${path}`,
    languages,
  }
}
