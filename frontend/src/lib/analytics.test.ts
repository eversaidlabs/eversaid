import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import posthog from 'posthog-js'
import { capture } from './analytics'

vi.mock('posthog-js', () => ({
  default: {
    __loaded: false,
    capture: vi.fn(),
  },
}))

describe('capture', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    posthog.__loaded = false
  })

  it('calls posthog.capture when loaded', () => {
    posthog.__loaded = true
    capture('file_selected', { file_format: 'mp3' })
    expect(posthog.capture).toHaveBeenCalledWith('file_selected', { file_format: 'mp3' })
  })

  it('does not call posthog.capture when not loaded', () => {
    posthog.__loaded = false
    capture('file_selected', { file_format: 'mp3' })
    expect(posthog.capture).not.toHaveBeenCalled()
  })

  it('works with events that have no properties', () => {
    posthog.__loaded = true
    capture('diff_view_opened')
    expect(posthog.capture).toHaveBeenCalledWith('diff_view_opened', undefined)
  })

  it('swallows errors from posthog', () => {
    posthog.__loaded = true
    vi.mocked(posthog.capture).mockImplementation(() => { throw new Error('network error') })
    expect(() => capture('diff_view_opened')).not.toThrow()
  })
})
