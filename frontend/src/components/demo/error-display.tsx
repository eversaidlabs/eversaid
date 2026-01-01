'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'

export interface ErrorDisplayProps {
  error: string | null
  onRetry?: () => void
  retryLabel?: string
}

/**
 * Error display component with optional retry button.
 * Shows a red-tinted alert with error message and action button.
 */
export function ErrorDisplay({ error, onRetry, retryLabel = 'Try Again' }: ErrorDisplayProps) {
  if (!error) {
    return null
  }

  return (
    <div
      className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
      role="alert"
    >
      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
      <p className="flex-1 text-sm text-red-800">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          {retryLabel}
        </button>
      )}
    </div>
  )
}
