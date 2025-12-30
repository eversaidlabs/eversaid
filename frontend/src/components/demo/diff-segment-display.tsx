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
            <span key={idx} className="bg-[#FEE2E2] text-[#991B1B] line-through rounded px-0.5 mx-0.5">
              {token.text}
            </span>
          )
        }
        if (token.type === "inserted") {
          return (
            <span key={idx} className="bg-[#DCFCE7] text-[#166534] rounded px-0.5 mx-0.5">
              {token.text}
            </span>
          )
        }
        return null
      })}
    </span>
  )
}
