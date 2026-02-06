'use client'

import { useEffect, useState, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && posthog.__loaded) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url += '?' + searchParams.toString()
      }
      posthog.capture('$pageview', { $current_url: url })
    }
  }, [pathname, searchParams])

  return null
}

interface PostHogProviderProps {
  children: React.ReactNode
}

/**
 * PostHog analytics provider.
 *
 * Fetches config from /api/config at runtime to support the single Docker
 * image pattern (same build across staging/production with different env vars).
 */
export function PostHogProvider({ children }: PostHogProviderProps) {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Fetch runtime config and initialize PostHog
    fetch('/api/config')
      .then((res) => res.json())
      .then((config) => {
        if (config.posthog?.key) {
          posthog.init(config.posthog.key, {
            api_host: config.posthog.host,
            ui_host: 'https://eu.posthog.com',
            capture_pageview: false,
            capture_pageleave: true,
            person_profiles: 'identified_only',
          })
          setInitialized(true)
        }
      })
      .catch((err) => {
        console.warn('Failed to load PostHog config:', err)
      })
  }, [])

  return (
    <>
      {initialized && (
        <Suspense fallback={null}>
          <PostHogPageView />
        </Suspense>
      )}
      {children}
    </>
  )
}
