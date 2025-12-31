import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getStoredEntryIds,
  addEntryId,
  removeEntryId,
  clearEntryIds,
  getCachedEntry,
  cacheEntry,
  getAllCachedEntries,
  updateCachedEntryStatus,
  isStorageAvailable,
  getStorageUsage,
  type CachedEntry,
} from './storage'

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

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  // ==========================================================================
  // Entry IDs Storage
  // ==========================================================================

  describe('getStoredEntryIds', () => {
    it('returns empty array when no entries stored', () => {
      expect(getStoredEntryIds()).toEqual([])
    })

    it('returns stored entry IDs', () => {
      localStorageMock.setItem('eversaid_entry_ids', JSON.stringify(['id-1', 'id-2']))

      expect(getStoredEntryIds()).toEqual(['id-1', 'id-2'])
    })

    it('handles invalid JSON gracefully', () => {
      localStorageMock.setItem('eversaid_entry_ids', 'invalid json')

      expect(getStoredEntryIds()).toEqual([])
    })

    it('filters out non-string values', () => {
      localStorageMock.setItem('eversaid_entry_ids', JSON.stringify(['id-1', 123, null, 'id-2']))

      expect(getStoredEntryIds()).toEqual(['id-1', 'id-2'])
    })

    it('returns empty array when stored value is not an array', () => {
      localStorageMock.setItem('eversaid_entry_ids', JSON.stringify({ not: 'an array' }))

      expect(getStoredEntryIds()).toEqual([])
    })
  })

  describe('addEntryId', () => {
    it('adds entry ID to empty storage', () => {
      addEntryId('entry-1')

      const stored = JSON.parse(localStorageMock.getItem('eversaid_entry_ids')!)
      expect(stored).toEqual(['entry-1'])
    })

    it('adds entry ID at the beginning (most recent first)', () => {
      localStorageMock.setItem('eversaid_entry_ids', JSON.stringify(['old-entry']))

      addEntryId('new-entry')

      const stored = JSON.parse(localStorageMock.getItem('eversaid_entry_ids')!)
      expect(stored).toEqual(['new-entry', 'old-entry'])
    })

    it('does not add duplicate entry IDs', () => {
      localStorageMock.setItem('eversaid_entry_ids', JSON.stringify(['entry-1']))

      addEntryId('entry-1')

      const stored = JSON.parse(localStorageMock.getItem('eversaid_entry_ids')!)
      expect(stored).toEqual(['entry-1'])
    })
  })

  describe('removeEntryId', () => {
    it('removes entry ID from storage', () => {
      localStorageMock.setItem('eversaid_entry_ids', JSON.stringify(['entry-1', 'entry-2', 'entry-3']))

      removeEntryId('entry-2')

      const stored = JSON.parse(localStorageMock.getItem('eversaid_entry_ids')!)
      expect(stored).toEqual(['entry-1', 'entry-3'])
    })

    it('also removes cached entry data', () => {
      localStorageMock.setItem('eversaid_entry_ids', JSON.stringify(['entry-1']))
      localStorageMock.setItem('eversaid_entry_entry-1', JSON.stringify({ id: 'entry-1' }))

      removeEntryId('entry-1')

      expect(localStorageMock.getItem('eversaid_entry_entry-1')).toBeNull()
    })

    it('handles removing non-existent entry gracefully', () => {
      localStorageMock.setItem('eversaid_entry_ids', JSON.stringify(['entry-1']))

      removeEntryId('non-existent')

      const stored = JSON.parse(localStorageMock.getItem('eversaid_entry_ids')!)
      expect(stored).toEqual(['entry-1'])
    })
  })

  describe('clearEntryIds', () => {
    it('clears all entry IDs', () => {
      localStorageMock.setItem('eversaid_entry_ids', JSON.stringify(['entry-1', 'entry-2']))

      clearEntryIds()

      expect(localStorageMock.getItem('eversaid_entry_ids')).toBeNull()
    })

    it('clears all cached entries', () => {
      localStorageMock.setItem('eversaid_entry_ids', JSON.stringify(['entry-1', 'entry-2']))
      localStorageMock.setItem('eversaid_entry_entry-1', JSON.stringify({ id: 'entry-1' }))
      localStorageMock.setItem('eversaid_entry_entry-2', JSON.stringify({ id: 'entry-2' }))

      clearEntryIds()

      expect(localStorageMock.getItem('eversaid_entry_entry-1')).toBeNull()
      expect(localStorageMock.getItem('eversaid_entry_entry-2')).toBeNull()
    })
  })

  // ==========================================================================
  // Entry Cache
  // ==========================================================================

  describe('getCachedEntry', () => {
    it('returns null when entry not found', () => {
      expect(getCachedEntry('non-existent')).toBeNull()
    })

    it('returns cached entry', () => {
      const entry: CachedEntry = {
        id: 'entry-1',
        filename: 'test.mp3',
        duration: 60,
        createdAt: '2024-01-01T00:00:00Z',
        transcriptionStatus: 'completed',
        cleanupStatus: 'completed',
      }
      localStorageMock.setItem('eversaid_entry_entry-1', JSON.stringify(entry))

      expect(getCachedEntry('entry-1')).toEqual(entry)
    })

    it('returns null for invalid JSON', () => {
      localStorageMock.setItem('eversaid_entry_entry-1', 'invalid json')

      expect(getCachedEntry('entry-1')).toBeNull()
    })

    it('returns null for invalid entry structure', () => {
      localStorageMock.setItem('eversaid_entry_entry-1', JSON.stringify({ invalid: 'structure' }))

      expect(getCachedEntry('entry-1')).toBeNull()
    })
  })

  describe('cacheEntry', () => {
    it('caches entry data', () => {
      const entry: CachedEntry = {
        id: 'entry-1',
        filename: 'test.mp3',
        duration: 60,
        createdAt: '2024-01-01T00:00:00Z',
        transcriptionStatus: 'completed',
        cleanupStatus: 'completed',
      }

      cacheEntry(entry)

      const stored = JSON.parse(localStorageMock.getItem('eversaid_entry_entry-1')!)
      expect(stored).toEqual(entry)
    })

    it('adds entry ID to the list', () => {
      const entry: CachedEntry = {
        id: 'entry-1',
        filename: 'test.mp3',
        duration: 60,
        createdAt: '2024-01-01T00:00:00Z',
        transcriptionStatus: 'processing',
        cleanupStatus: 'pending',
      }

      cacheEntry(entry)

      const ids = JSON.parse(localStorageMock.getItem('eversaid_entry_ids')!)
      expect(ids).toContain('entry-1')
    })
  })

  describe('getAllCachedEntries', () => {
    it('returns empty array when no entries', () => {
      expect(getAllCachedEntries()).toEqual([])
    })

    it('returns all cached entries in order', () => {
      const entry1: CachedEntry = {
        id: 'entry-1',
        filename: 'test1.mp3',
        duration: 60,
        createdAt: '2024-01-01T00:00:00Z',
        transcriptionStatus: 'completed',
        cleanupStatus: 'completed',
      }
      const entry2: CachedEntry = {
        id: 'entry-2',
        filename: 'test2.mp3',
        duration: 120,
        createdAt: '2024-01-02T00:00:00Z',
        transcriptionStatus: 'completed',
        cleanupStatus: 'completed',
      }

      localStorageMock.setItem('eversaid_entry_ids', JSON.stringify(['entry-1', 'entry-2']))
      localStorageMock.setItem('eversaid_entry_entry-1', JSON.stringify(entry1))
      localStorageMock.setItem('eversaid_entry_entry-2', JSON.stringify(entry2))

      const entries = getAllCachedEntries()
      expect(entries).toHaveLength(2)
      expect(entries[0].id).toBe('entry-1')
      expect(entries[1].id).toBe('entry-2')
    })

    it('skips entries that are not cached', () => {
      localStorageMock.setItem('eversaid_entry_ids', JSON.stringify(['entry-1', 'entry-2']))
      // Only cache entry-1
      localStorageMock.setItem(
        'eversaid_entry_entry-1',
        JSON.stringify({
          id: 'entry-1',
          filename: 'test.mp3',
          duration: 60,
          createdAt: '2024-01-01T00:00:00Z',
          transcriptionStatus: 'completed',
          cleanupStatus: 'completed',
        })
      )

      const entries = getAllCachedEntries()
      expect(entries).toHaveLength(1)
      expect(entries[0].id).toBe('entry-1')
    })
  })

  describe('updateCachedEntryStatus', () => {
    it('updates transcription status', () => {
      const entry: CachedEntry = {
        id: 'entry-1',
        filename: 'test.mp3',
        duration: 60,
        createdAt: '2024-01-01T00:00:00Z',
        transcriptionStatus: 'processing',
        cleanupStatus: 'pending',
      }
      localStorageMock.setItem('eversaid_entry_entry-1', JSON.stringify(entry))
      localStorageMock.setItem('eversaid_entry_ids', JSON.stringify(['entry-1']))

      updateCachedEntryStatus('entry-1', { transcriptionStatus: 'completed' })

      const updated = getCachedEntry('entry-1')
      expect(updated?.transcriptionStatus).toBe('completed')
      expect(updated?.cleanupStatus).toBe('pending') // Unchanged
    })

    it('does nothing for non-existent entry', () => {
      updateCachedEntryStatus('non-existent', { transcriptionStatus: 'completed' })

      expect(getCachedEntry('non-existent')).toBeNull()
    })
  })

  // ==========================================================================
  // Utility Functions
  // ==========================================================================

  describe('isStorageAvailable', () => {
    it('returns true when localStorage is available', () => {
      expect(isStorageAvailable()).toBe(true)
    })
  })

  describe('getStorageUsage', () => {
    it('returns correct counts', () => {
      localStorageMock.setItem('eversaid_entry_ids', JSON.stringify(['entry-1', 'entry-2']))
      localStorageMock.setItem('eversaid_entry_entry-1', JSON.stringify({ id: 'entry-1' }))
      localStorageMock.setItem('eversaid_entry_entry-2', JSON.stringify({ id: 'entry-2' }))
      localStorageMock.setItem('other_key', 'value')

      const usage = getStorageUsage()

      expect(usage.entryCount).toBe(2)
      expect(usage.totalKeys).toBe(3) // entry_ids + 2 entries
    })

    it('returns zeros when empty', () => {
      const usage = getStorageUsage()

      expect(usage.entryCount).toBe(0)
      expect(usage.totalKeys).toBe(0)
    })
  })
})
