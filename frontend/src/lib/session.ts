// Session management utilities
// Note: Session is managed server-side via httpOnly cookies.
// Frontend just needs to detect session presence and clear localStorage when session expires.

import { clearEntryIds } from './storage'

const SESSION_COOKIE_NAME = 'session_id'

/**
 * Session info extracted from response (if available)
 * Note: The actual session_id is httpOnly and not directly accessible
 */
export interface SessionInfo {
  hasSession: boolean
  expiresAt?: Date
}

/**
 * Check if a session cookie exists
 * Note: This only checks for cookie presence, not validity.
 * The cookie is httpOnly so we can't read its value.
 */
export function hasSession(): boolean {
  if (typeof document === 'undefined') return false

  // Check if any cookies exist that could indicate a session
  // Since session_id is httpOnly, we can't directly check for it
  // We rely on the API returning 401 to detect expired sessions
  const cookies = document.cookie
  return cookies.length > 0
}

/**
 * Check if the session cookie is present in the cookie string
 * This is a helper for testing - in production the cookie is httpOnly
 */
export function hasSessionCookie(cookieString: string): boolean {
  if (!cookieString) return false

  // Parse cookies to check for session_id
  const cookies = cookieString.split(';').map((c) => c.trim())

  for (const cookie of cookies) {
    const [name] = cookie.split('=')
    if (name === SESSION_COOKIE_NAME) {
      return true
    }
  }

  return false
}

/**
 * Get session info from a response
 * The backend may include session metadata in response headers
 */
export function getSessionInfo(response: Response): SessionInfo | null {
  // Check for session-related headers
  // The backend sets the session cookie, but we can check for expiry info
  const sessionExpiry = response.headers.get('X-Session-Expires')

  if (sessionExpiry) {
    const expiresAt = new Date(parseInt(sessionExpiry, 10) * 1000)
    return {
      hasSession: true,
      expiresAt,
    }
  }

  // If we got a successful response, we likely have a session
  if (response.ok) {
    return {
      hasSession: true,
    }
  }

  return null
}

/**
 * Check if a response indicates session expiration
 */
export function isSessionExpired(response: Response): boolean {
  return response.status === 401
}

/**
 * Clear all local session data
 * Called when session expires (on 401 response)
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return

  // Clear all cached entries from localStorage
  clearEntryIds()

  // Clear any other session-related localStorage items
  try {
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('eversaid_')) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key)
    })
  } catch {
    // Silently fail on localStorage errors
  }
}

/**
 * Handle session expiration
 * This should be called when a 401 response is received
 */
export function handleSessionExpired(): void {
  clearSession()
  // The API will automatically create a new session on the next request
  // via the credentials: 'include' setting
}

/**
 * Get the session status message for UI display
 */
export function getSessionStatusMessage(response: Response): string | null {
  if (response.status === 401) {
    return 'Session expired. A new session has been created.'
  }

  return null
}

/**
 * Calculate time until session expiry
 */
export function getTimeUntilExpiry(expiresAt: Date): {
  days: number
  hours: number
  minutes: number
  isExpired: boolean
} {
  const now = new Date()
  const diffMs = expiresAt.getTime() - now.getTime()

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, isExpired: true }
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  return { days, hours, minutes, isExpired: false }
}

/**
 * Format expiry time for display
 */
export function formatExpiryTime(expiresAt: Date): string {
  const { days, hours, minutes, isExpired } = getTimeUntilExpiry(expiresAt)

  if (isExpired) {
    return 'Expired'
  }

  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'}`
  }

  if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'}`
  }

  return `${minutes} minute${minutes === 1 ? '' : 's'}`
}
