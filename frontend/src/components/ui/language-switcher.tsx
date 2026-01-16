'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import { useCallback } from 'react'
import { locales, type Locale } from '@/i18n/config'

export function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = useCallback((newLocale: Locale) => {
    if (newLocale === locale) return
    // Set cookie to persist locale preference (next-intl reads NEXT_LOCALE)
    // Using globalThis.document to satisfy eslint immutability rule
    globalThis.document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`
    router.replace(pathname, { locale: newLocale })
  }, [router, pathname, locale])

  return (
    <div className="flex bg-white/10 rounded-lg p-[3px]" role="group" aria-label="Select language">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLocaleChange(loc)}
          className={`px-3 py-1.5 text-[12px] font-semibold rounded-md transition-all ${
            loc === locale
              ? 'bg-white text-[#0F172A]'
              : 'text-white/60 hover:text-white/90'
          }`}
          aria-pressed={loc === locale}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

// Alternative light variant for use on light backgrounds
export function LanguageSwitcherLight() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = useCallback((newLocale: Locale) => {
    if (newLocale === locale) return
    // Set cookie to persist locale preference (next-intl reads NEXT_LOCALE)
    // Using globalThis.document to satisfy eslint immutability rule
    globalThis.document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`
    router.replace(pathname, { locale: newLocale })
  }, [router, pathname, locale])

  return (
    <div className="flex bg-gray-100 rounded-lg p-[3px]" role="group" aria-label="Select language">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLocaleChange(loc)}
          className={`px-3 py-1.5 text-[12px] font-semibold rounded-md transition-all ${
            loc === locale
              ? 'bg-white text-[#0F172A] shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          aria-pressed={loc === locale}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
