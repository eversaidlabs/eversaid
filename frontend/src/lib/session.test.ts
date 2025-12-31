import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  hasSessionCookie,
  getSessionInfo,
  isSessionExpired,
  clearSession,
  handleSessionExpired,
  getSessionStatusMessage,
  getTimeUntilExpiry,
  formatExpiryTime,
} from './session'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  }
})()

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
})

describe('Session Utilities', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  // ==========================================================================
  // Cookie Detection
  // ==========================================================================

  describe('hasSessionCookie', () => {
    it('returns false for empty cookie string', () => {
      expect(hasSessionCookie('')).toBe(false)
    })

    it('returns true when session_id cookie exists', () => {
      expect(hasSessionCookie('session_id=abc123; other=value')).toBe(true)
    })

    it('returns false when session_id cookie does not exist', () => {
      expect(hasSessionCookie('other=value; another=test')).toBe(false)
    })

    it('handles cookie string with spaces', () => {
      expect(hasSessionCookie('  session_id=abc123  ;  other=value  ')).toBe(true)
    })

    it('returns false for similar but different cookie names', () => {
      expect(hasSessionCookie('session_id_old=value; my_session_id=test')).toBe(false)
    })
  })

  // ==========================================================================
  // Session Info from Response
  // ==========================================================================

  describe('getSessionInfo', () => {
    it('returns session info with expiry when header present', () => {
      const timestamp = Math.floor(Date.now() / 1000) + 86400 // 24 hours from now
      const response = new Response(null, {
        status: 200,
        headers: {
          'X-Session-Expires': String(timestamp),
        },
      })

      const info = getSessionInfo(response)

      expect(info).not.toBeNull()
      expect(info!.hasSession).toBe(true)
      expect(info!.expiresAt).toBeInstanceOf(Date)
    })

    it('returns session info without expiry for successful response', () => {
      const response = new Response(null, { status: 200 })

      const info = getSessionInfo(response)

      expect(info).not.toBeNull()
      expect(info!.hasSession).toBe(true)
      expect(info!.expiresAt).toBeUndefined()
    })

    it('returns null for error response without session header', () => {
      const response = new Response(null, { status: 400 })

      const info = getSessionInfo(response)

      expect(info).toBeNull()
    })
  })

  // ==========================================================================
  // Session Expiration Detection
  // ==========================================================================

  describe('isSessionExpired', () => {
    it('returns true for 401 response', () => {
      const response = new Response(null, { status: 401 })

      expect(isSessionExpired(response)).toBe(true)
    })

    it('returns false for 200 response', () => {
      const response = new Response(null, { status: 200 })

      expect(isSessionExpired(response)).toBe(false)
    })

    it('returns false for 403 response', () => {
      const response = new Response(null, { status: 403 })

      expect(isSessionExpired(response)).toBe(false)
    })

    it('returns false for 500 response', () => {
      const response = new Response(null, { status: 500 })

      expect(isSessionExpired(response)).toBe(false)
    })
  })

  // ==========================================================================
  // Session Clearing
  // ==========================================================================

  describe('clearSession', () => {
    it('clears all eversaid_ prefixed keys from localStorage', () => {
      localStorageMock.setItem('eversaid_entry_ids', '["id1", "id2"]')
      localStorageMock.setItem('eversaid_entry_id1', '{}')
      localStorageMock.setItem('other_key', 'value')

      clearSession()

      expect(localStorageMock.getItem('eversaid_entry_ids')).toBeNull()
      expect(localStorageMock.getItem('eversaid_entry_id1')).toBeNull()
      expect(localStorageMock.getItem('other_key')).toBe('value')
    })
  })

  describe('handleSessionExpired', () => {
    it('clears session data', () => {
      localStorageMock.setItem('eversaid_entry_ids', '["id1"]')

      handleSessionExpired()

      expect(localStorageMock.getItem('eversaid_entry_ids')).toBeNull()
    })
  })

  // ==========================================================================
  // Status Messages
  // ==========================================================================

  describe('getSessionStatusMessage', () => {
    it('returns message for 401 response', () => {
      const response = new Response(null, { status: 401 })

      const message = getSessionStatusMessage(response)

      expect(message).toBe('Session expired. A new session has been created.')
    })

    it('returns null for 200 response', () => {
      const response = new Response(null, { status: 200 })

      const message = getSessionStatusMessage(response)

      expect(message).toBeNull()
    })
  })

  // ==========================================================================
  // Expiry Time Calculations
  // ==========================================================================

  describe('getTimeUntilExpiry', () => {
    it('returns correct time for future date', () => {
      const now = new Date()
      const future = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 30 * 60 * 1000)

      const result = getTimeUntilExpiry(future)

      expect(result.days).toBe(2)
      expect(result.hours).toBe(3)
      expect(result.minutes).toBe(30)
      expect(result.isExpired).toBe(false)
    })

    it('returns isExpired true for past date', () => {
      const past = new Date(Date.now() - 1000)

      const result = getTimeUntilExpiry(past)

      expect(result.isExpired).toBe(true)
      expect(result.days).toBe(0)
      expect(result.hours).toBe(0)
      expect(result.minutes).toBe(0)
    })

    it('handles edge case of exactly now', () => {
      const now = new Date()

      const result = getTimeUntilExpiry(now)

      expect(result.isExpired).toBe(true)
    })
  })

  describe('formatExpiryTime', () => {
    it('formats days correctly', () => {
      const future = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)

      expect(formatExpiryTime(future)).toBe('3 days')
    })

    it('formats single day correctly', () => {
      const future = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 1000)

      expect(formatExpiryTime(future)).toBe('1 day')
    })

    it('formats hours when less than a day', () => {
      const future = new Date(Date.now() + 5 * 60 * 60 * 1000)

      expect(formatExpiryTime(future)).toBe('5 hours')
    })

    it('formats single hour correctly', () => {
      const future = new Date(Date.now() + 1 * 60 * 60 * 1000 + 1000)

      expect(formatExpiryTime(future)).toBe('1 hour')
    })

    it('formats minutes when less than an hour', () => {
      const future = new Date(Date.now() + 45 * 60 * 1000)

      expect(formatExpiryTime(future)).toBe('45 minutes')
    })

    it('formats single minute correctly', () => {
      const future = new Date(Date.now() + 1 * 60 * 1000 + 1000)

      expect(formatExpiryTime(future)).toBe('1 minute')
    })

    it('returns Expired for past date', () => {
      const past = new Date(Date.now() - 1000)

      expect(formatExpiryTime(past)).toBe('Expired')
    })
  })
})
