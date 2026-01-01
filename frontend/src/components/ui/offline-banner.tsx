'use client'

import { WifiOff } from 'lucide-react'
import { useNetworkStatus } from '@/lib/useNetworkStatus'

/**
 * A persistent banner that appears at the top of the viewport when the user is offline.
 * Automatically shows/hides based on network connectivity.
 */
export function OfflineBanner() {
  const { isOffline } = useNetworkStatus()

  if (!isOffline) {
    return null
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 px-4 py-3 bg-amber-100 text-amber-800 text-sm font-medium shadow-sm animate-in slide-in-from-top duration-300"
      role="alert"
      aria-live="polite"
    >
      <WifiOff className="h-4 w-4 flex-shrink-0" />
      <span>You&apos;re offline. Some features may not work.</span>
    </div>
  )
}
