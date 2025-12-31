"use client"

import { computeDiff, groupDiffTokens } from "@/lib/diff-utils"
import { useMemo } from "react"

export interface DiffSegmentDisplayProps {
  rawText: string
  cleanedText: string
  showDiff: boolean
}

export function DiffSegmentDisplay({ rawText, cleanedText, showDiff }: DiffSegmentDisplayProps) {
  const diffTokens = useMemo(() => {
    if (!showDiff) return null
    const tokens = computeDiff(rawText, cleanedText)
    return groupDiffTokens(tokens)
  }, [rawText, cleanedText, showDiff])

  if (!showDiff || !diffTokens) {
    return <span>{cleanedText}</span>
  }

  return (
    <span>
      {diffTokens.map((token, idx) => {
        if (token.type === "unchanged") {
          return <span key={idx}>{token.text}</span>
        }
        if (token.type === "deleted") {
          return (
            <span key={idx} className="bg-red-100 text-red-900 line-through rounded">
              {token.text}
            </span>
          )
        }
        if (token.type === "inserted") {
          return (
            <span key={idx} className="bg-emerald-100 text-emerald-900 rounded">
              {token.text}
            </span>
          )
        }
        return null
      })}
    </span>
  )
}
