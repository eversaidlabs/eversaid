"use client"

import { useMemo, useState, useEffect, useCallback } from "react"
import type { SegmentWithTime, TranscriptionWord } from "./types"

/** Offset in seconds to highlight word slightly before it's spoken (better UX) */
const HIGHLIGHT_LOOKAHEAD_SECONDS = 0.2

export interface UseWordHighlightOptions {
  segments: SegmentWithTime[]
  currentTime: number
  isPlaying: boolean
  activeSegmentId: string | null
}

export interface UseWordHighlightReturn {
  /** Index of active word within the active segment (-1 if none) */
  activeWordIndex: number
  /** Whether any segment has word-level timing data */
  hasWordData: boolean
  /** Get words for a specific segment (filtered to 'word' type only) */
  getWordsForSegment: (segmentId: string) => TranscriptionWord[]
}

/**
 * Binary search to find the word at a given time
 * Returns the index of the word that contains the current time, or -1 if not found
 */
function findWordAtTime(words: TranscriptionWord[], time: number): number {
  // Filter to only 'word' type entries for highlighting
  const wordOnlyList = words.filter((w) => w.type === "word")

  for (let i = 0; i < wordOnlyList.length; i++) {
    const word = wordOnlyList[i]
    if (time >= word.start && time < word.end) {
      return i
    }
  }

  // Check if we're slightly past the last word (within 50ms tolerance)
  if (wordOnlyList.length > 0) {
    const lastWord = wordOnlyList[wordOnlyList.length - 1]
    if (time >= lastWord.start && time < lastWord.end + 0.05) {
      return wordOnlyList.length - 1
    }
  }

  return -1
}

/**
 * Hook for tracking the currently spoken word during audio playback
 *
 * @param options - Configuration options
 * @returns Object with active word index and utility functions
 *
 * @example
 * ```tsx
 * const { activeWordIndex, hasWordData } = useWordHighlight({
 *   segments,
 *   currentTime: audioPlayer.currentTime,
 *   isPlaying: audioPlayer.isPlaying,
 *   activeSegmentId: audioPlayer.activeSegmentId,
 * })
 * ```
 */
export function useWordHighlight(
  options: UseWordHighlightOptions
): UseWordHighlightReturn {
  const { segments, currentTime, isPlaying, activeSegmentId } = options

  const [activeWordIndex, setActiveWordIndex] = useState(-1)

  // Check if any segment has word-level timing data
  const hasWordData = useMemo(() => {
    return segments.some((seg) => seg.words && seg.words.length > 0)
  }, [segments])

  // Create a map for quick segment lookup
  const segmentMap = useMemo(() => {
    const map = new Map<string, SegmentWithTime>()
    for (const seg of segments) {
      map.set(seg.id, seg)
    }
    return map
  }, [segments])

  // Find active word based on currentTime
  useEffect(() => {
    if (!isPlaying || !activeSegmentId || !hasWordData) {
      setActiveWordIndex(-1)
      return
    }

    const segment = segmentMap.get(activeSegmentId)
    if (!segment?.words?.length) {
      setActiveWordIndex(-1)
      return
    }

    // Add lookahead to highlight word slightly before it's spoken
    const lookaheadTime = currentTime + HIGHLIGHT_LOOKAHEAD_SECONDS
    const wordIndex = findWordAtTime(segment.words, lookaheadTime)
    setActiveWordIndex(wordIndex)
  }, [currentTime, isPlaying, activeSegmentId, segmentMap, hasWordData])

  // Reset word index when segment changes
  useEffect(() => {
    setActiveWordIndex(-1)
  }, [activeSegmentId])

  // Get words for a segment (filtered to only 'word' type)
  const getWordsForSegment = useCallback(
    (segmentId: string): TranscriptionWord[] => {
      const segment = segmentMap.get(segmentId)
      if (!segment?.words) return []
      return segment.words.filter((w) => w.type === "word")
    },
    [segmentMap]
  )

  return {
    activeWordIndex,
    hasWordData,
    getWordsForSegment,
  }
}
