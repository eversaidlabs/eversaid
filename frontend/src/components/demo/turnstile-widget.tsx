"use client"

import { useRef, useEffect } from "react"
import { Turnstile } from "@marsidev/react-turnstile"
import type { TurnstileInstance } from "@marsidev/react-turnstile"

interface TurnstileWidgetProps {
  siteKey: string
  onSuccess: (token: string) => void
  onError: () => void
  onExpire: () => void
  /** Ref for parent to register the reset function */
  resetRef: React.MutableRefObject<(() => void) | null>
}

export function TurnstileWidget({
  siteKey,
  onSuccess,
  onError,
  onExpire,
  resetRef,
}: TurnstileWidgetProps) {
  const turnstileRef = useRef<TurnstileInstance | null>(null)

  // Expose reset function to parent via resetRef
  useEffect(() => {
    resetRef.current = () => {
      turnstileRef.current?.reset()
    }
    return () => {
      resetRef.current = null
    }
  }, [resetRef])

  return (
    <Turnstile
      ref={turnstileRef}
      siteKey={siteKey}
      options={{
        size: "flexible",
        theme: "light",
        appearance: "interaction-only",
      }}
      onSuccess={onSuccess}
      onError={onError}
      onExpire={onExpire}
    />
  )
}
