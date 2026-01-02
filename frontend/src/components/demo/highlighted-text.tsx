"use client"

import { useMemo } from "react"
import type { TranscriptionWord } from "@/features/transcription/types"

export interface HighlightedTextProps {
  /** Original text (fallback if no words) */
  text: string
  /** Word-level timing data */
  words: TranscriptionWord[]
  /** Index of the currently active word (-1 if none) */
  activeWordIndex: number
  /** Whether audio is currently playing */
  isPlaying: boolean
}

/**
 * Renders text with word-level highlighting during audio playback.
 * Falls back to plain text if no word data is available.
 */
export function HighlightedText({
  text,
  words,
  activeWordIndex,
  isPlaying,
}: HighlightedTextProps) {
  // Filter to only 'word' type entries
  const wordList = useMemo(
    () => words.filter((w) => w.type === "word"),
    [words]
  )

  // If no words data, render plain text
  if (!wordList.length) {
    return <span>{text}</span>
  }

  return (
    <span>
      {wordList.map((word, index) => {
        const isActive = isPlaying && index === activeWordIndex

        return (
          <span key={index}>
            <span
              className={`transition-colors duration-100 ${
                isActive ? "bg-blue-200/70 rounded px-0.5" : ""
              }`}
            >
              {word.text}
            </span>
            {/* Add space after word (except last) */}
            {index < wordList.length - 1 && " "}
          </span>
        )
      })}
    </span>
  )
}
