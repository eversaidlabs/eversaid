import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useNetworkStatus } from './useNetworkStatus'

describe('useNetworkStatus', () => {
  let originalNavigator: typeof navigator.onLine
  let onlineHandler: (() => void) | null = null
  let offlineHandler: (() => void) | null = null

  beforeEach(() => {
    // Store original value
    originalNavigator = navigator.onLine

    // Mock addEventListener to capture handlers
    vi.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
      if (event === 'online') {
        onlineHandler = handler as () => void
      } else if (event === 'offline') {
        offlineHandler = handler as () => void
      }
    })

    vi.spyOn(window, 'removeEventListener').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore
    Object.defineProperty(navigator, 'onLine', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    })
    vi.restoreAllMocks()
    onlineHandler = null
    offlineHandler = null
  })

  it('should return isOnline: true when navigator.onLine is true', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useNetworkStatus())

    expect(result.current.isOnline).toBe(true)
    expect(result.current.isOffline).toBe(false)
  })

  it('should return isOnline: false when navigator.onLine is false', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useNetworkStatus())

    expect(result.current.isOnline).toBe(false)
    expect(result.current.isOffline).toBe(true)
  })

  it('should update to offline when offline event fires', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useNetworkStatus())

    expect(result.current.isOnline).toBe(true)

    // Simulate offline event
    act(() => {
      if (offlineHandler) offlineHandler()
    })

    expect(result.current.isOnline).toBe(false)
    expect(result.current.isOffline).toBe(true)
  })

  it('should update to online when online event fires', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useNetworkStatus())

    expect(result.current.isOnline).toBe(false)

    // Simulate online event
    act(() => {
      if (onlineHandler) onlineHandler()
    })

    expect(result.current.isOnline).toBe(true)
    expect(result.current.isOffline).toBe(false)
  })

  it('should add event listeners on mount', () => {
    renderHook(() => useNetworkStatus())

    expect(window.addEventListener).toHaveBeenCalledWith('online', expect.any(Function))
    expect(window.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function))
  })

  it('should remove event listeners on unmount', () => {
    const { unmount } = renderHook(() => useNetworkStatus())

    unmount()

    expect(window.removeEventListener).toHaveBeenCalledWith('online', expect.any(Function))
    expect(window.removeEventListener).toHaveBeenCalledWith('offline', expect.any(Function))
  })
})
