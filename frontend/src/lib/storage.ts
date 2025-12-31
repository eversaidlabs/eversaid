// localStorage helpers for entry caching

const ENTRY_IDS_KEY = 'eversaid_entry_ids'
const ENTRY_CACHE_PREFIX = 'eversaid_entry_'

/**
 * Cached entry data stored in localStorage
 */
export interface CachedEntry {
  id: string
  filename: string
  duration: number
  createdAt: string
  transcriptionStatus: 'pending' | 'processing' | 'completed' | 'failed'
  cleanupStatus: 'pending' | 'processing' | 'completed' | 'failed'
}

// =============================================================================
// Entry IDs Storage
// =============================================================================

/**
 * Get all stored entry IDs
 */
export function getStoredEntryIds(): string[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(ENTRY_IDS_KEY)
    if (!stored) return []

    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []

    return parsed.filter((id): id is string => typeof id === 'string')
  } catch {
    return []
  }
}

/**
 * Add an entry ID to storage (at the beginning for most recent first)
 */
export function addEntryId(id: string): void {
  if (typeof window === 'undefined') return

  try {
    const existing = getStoredEntryIds()

    // Don't add duplicates
    if (existing.includes(id)) return

    // Add to beginning (most recent first)
    const updated = [id, ...existing]

    localStorage.setItem(ENTRY_IDS_KEY, JSON.stringify(updated))
  } catch {
    // Silently fail on localStorage errors (e.g., quota exceeded)
  }
}

/**
 * Remove an entry ID from storage
 */
export function removeEntryId(id: string): void {
  if (typeof window === 'undefined') return

  try {
    const existing = getStoredEntryIds()
    const updated = existing.filter((existingId) => existingId !== id)

    localStorage.setItem(ENTRY_IDS_KEY, JSON.stringify(updated))

    // Also remove the cached entry data
    removeCachedEntry(id)
  } catch {
    // Silently fail on localStorage errors
  }
}

/**
 * Clear all entry IDs from storage
 */
export function clearEntryIds(): void {
  if (typeof window === 'undefined') return

  try {
    // Get all IDs first to clear their caches
    const ids = getStoredEntryIds()

    // Clear the ID list
    localStorage.removeItem(ENTRY_IDS_KEY)

    // Clear all cached entries
    ids.forEach((id) => {
      removeCachedEntry(id)
    })
  } catch {
    // Silently fail on localStorage errors
  }
}

// =============================================================================
// Entry Cache (Optional, for offline display)
// =============================================================================

/**
 * Get a cached entry by ID
 */
export function getCachedEntry(id: string): CachedEntry | null {
  if (typeof window === 'undefined') return null

  try {
    const key = `${ENTRY_CACHE_PREFIX}${id}`
    const stored = localStorage.getItem(key)

    if (!stored) return null

    const parsed = JSON.parse(stored)

    // Basic validation
    if (
      typeof parsed.id !== 'string' ||
      typeof parsed.filename !== 'string' ||
      typeof parsed.duration !== 'number'
    ) {
      return null
    }

    return parsed as CachedEntry
  } catch {
    return null
  }
}

/**
 * Cache an entry for offline display
 */
export function cacheEntry(entry: CachedEntry): void {
  if (typeof window === 'undefined') return

  try {
    const key = `${ENTRY_CACHE_PREFIX}${entry.id}`
    localStorage.setItem(key, JSON.stringify(entry))

    // Ensure the ID is in the list
    addEntryId(entry.id)
  } catch {
    // Silently fail on localStorage errors (e.g., quota exceeded)
  }
}

/**
 * Remove a cached entry
 */
function removeCachedEntry(id: string): void {
  if (typeof window === 'undefined') return

  try {
    const key = `${ENTRY_CACHE_PREFIX}${id}`
    localStorage.removeItem(key)
  } catch {
    // Silently fail on localStorage errors
  }
}

/**
 * Get all cached entries (in order of stored IDs)
 */
export function getAllCachedEntries(): CachedEntry[] {
  const ids = getStoredEntryIds()
  const entries: CachedEntry[] = []

  for (const id of ids) {
    const entry = getCachedEntry(id)
    if (entry) {
      entries.push(entry)
    }
  }

  return entries
}

/**
 * Update the status of a cached entry
 */
export function updateCachedEntryStatus(
  id: string,
  updates: Partial<Pick<CachedEntry, 'transcriptionStatus' | 'cleanupStatus'>>
): void {
  if (typeof window === 'undefined') return

  const existing = getCachedEntry(id)
  if (!existing) return

  cacheEntry({
    ...existing,
    ...updates,
  })
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Get storage usage info (for debugging/monitoring)
 */
export function getStorageUsage(): { entryCount: number; totalKeys: number } {
  if (typeof window === 'undefined') {
    return { entryCount: 0, totalKeys: 0 }
  }

  try {
    const entryIds = getStoredEntryIds()
    let totalKeys = 0

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('eversaid_')) {
        totalKeys++
      }
    }

    return {
      entryCount: entryIds.length,
      totalKeys,
    }
  } catch {
    return { entryCount: 0, totalKeys: 0 }
  }
}
