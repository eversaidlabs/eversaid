/**
 * useTurnstile - Cloudflare Turnstile CAPTCHA state management hook
 *
 * Manages the Turnstile widget token lifecycle: solving, success, expiry, reset.
 * Disabled (no-op) when NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set.
 */

import { useState, useCallback, useRef } from "react"

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""

export interface UseTurnstileReturn {
  /** Whether Turnstile is enabled (site key is configured) */
  isEnabled: boolean
  /** The Turnstile site key */
  siteKey: string
  /** Current token (null if not yet solved or expired) */
  token: string | null
  /** Whether the widget is currently resolving */
  isResolving: boolean
  /** Callback for widget success */
  onSuccess: (token: string) => void
  /** Callback for widget error */
  onError: () => void
  /** Callback for widget token expiry */
  onExpire: () => void
  /** Get current token value */
  getToken: () => string | null
  /** Reset the widget (clears token and calls widget reset) */
  resetWidget: () => void
  /** Ref for the widget component to register its reset function */
  widgetResetRef: React.MutableRefObject<(() => void) | null>
}

export function useTurnstile(): UseTurnstileReturn {
  const [token, setToken] = useState<string | null>(null)
  const [isResolving, setIsResolving] = useState(false)
  const widgetResetRef = useRef<(() => void) | null>(null)

  const isEnabled = !!SITE_KEY

  const onSuccess = useCallback((newToken: string) => {
    setToken(newToken)
    setIsResolving(false)
  }, [])

  const onError = useCallback(() => {
    setToken(null)
    setIsResolving(false)
  }, [])

  const onExpire = useCallback(() => {
    setToken(null)
    setIsResolving(false)
  }, [])

  const getToken = useCallback(() => token, [token])

  const resetWidget = useCallback(() => {
    setToken(null)
    setIsResolving(false)
    widgetResetRef.current?.()
  }, [])

  return {
    isEnabled,
    siteKey: SITE_KEY,
    token,
    isResolving,
    onSuccess,
    onError,
    onExpire,
    getToken,
    resetWidget,
    widgetResetRef,
  }
}
