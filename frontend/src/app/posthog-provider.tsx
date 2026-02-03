'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import type { PostHogConfig } from '@/lib/app-config'

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
  config: PostHogConfig
  children: React.ReactNode
}

export function PostHogProvider({ config, children }: PostHogProviderProps) {
  useEffect(() => {
    if (config.key) {
      posthog.init(config.key, {
        api_host: config.host,
        ui_host: 'https://eu.posthog.com',
        capture_pageview: false,
        capture_pageleave: true,
        person_profiles: 'identified_only',
      })
    }
  }, [config.key, config.host])

  if (!config.key) {
    return <>{children}</>
  }

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </>
  )
}
