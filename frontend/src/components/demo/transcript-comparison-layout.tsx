"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { RawSegmentList } from "./raw-segment-list"
import { EditableSegmentList } from "./editable-segment-list"
import { TranscriptHeader } from "./transcript-header"
import type { Segment, TextMoveSelection, ActiveSuggestion, SpellcheckError } from "./types"

interface TranscriptComparisonLayoutProps {
  segments: Segment[]
  activeSegmentId: string | null
  editingSegmentId: string | null
  editedTexts: Map<string, string>
  revertedSegments: Map<string, string>
  spellcheckErrors: Map<string, SpellcheckError[]>
  showDiff: boolean
  showSpeakerLabels: boolean
  textMoveSelection: TextMoveSelection | null
  isSelectingMoveTarget: boolean
  activeSuggestion: ActiveSuggestion | null
  editingCount: number
  onSegmentClick: (segmentId: string) => void
  onRevert: (segmentId: string) => void
  onUndoRevert: (segmentId: string) => void
  onSave: (segmentId: string) => void
  onEditStart: (segmentId: string) => void
  onEditCancel: (segmentId: string) => void
  onTextChange: (segmentId: string, text: string) => void
  onWordClick: (segmentId: string, e: React.MouseEvent, error: SpellcheckError) => void
  onSuggestionSelect: (suggestion: string) => void
  onCloseSuggestions: () => void
  onUpdateAll: () => void
  onToggleDiff: () => void
  onRawTextSelect: (segmentId: string, text: string, startOffset: number, endOffset: number) => void
  onCleanedTextSelect: (segmentId: string, text: string, startOffset: number, endOffset: number) => void
  onRawMoveTargetClick: (segmentId: string) => void
  onCleanedMoveTargetClick: (segmentId: string) => void
  showRevertButton?: boolean
  showCopyButton?: boolean
  variant?: "demo" | "preview"
}

export function TranscriptComparisonLayout({
  segments,
  activeSegmentId,
  editingSegmentId,
  editedTexts,
  revertedSegments,
  spellcheckErrors,
  showDiff,
  showSpeakerLabels,
  textMoveSelection,
  isSelectingMoveTarget,
  activeSuggestion,
  editingCount,
  onSegmentClick,
  onRevert,
  onUndoRevert,
  onSave,
  onEditStart,
  onEditCancel,
  onTextChange,
  onWordClick,
  onSuggestionSelect,
  onCloseSuggestions,
  onUpdateAll,
  onToggleDiff,
  onRawTextSelect,
  onCleanedTextSelect,
  onRawMoveTargetClick,
  onCleanedMoveTargetClick,
  showRevertButton = true,
  showCopyButton = true,
  variant = "demo",
}: TranscriptComparisonLayoutProps) {
  const rawScrollRef = useRef<HTMLDivElement>(null)
  const cleanedScrollRef = useRef<HTMLDivElement>(null)
  const isSyncingScrollRef = useRef(false)

  const handleRawScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isSyncingScrollRef.current) return

    const rawEl = e.currentTarget
    const cleanedEl = cleanedScrollRef.current
    if (!cleanedEl) return

    isSyncingScrollRef.current = true

    // Calculate scroll percentage
    const scrollPercentage = rawEl.scrollTop / (rawEl.scrollHeight - rawEl.clientHeight)
    // Apply to cleaned side
    cleanedEl.scrollTop = scrollPercentage * (cleanedEl.scrollHeight - cleanedEl.clientHeight)

    requestAnimationFrame(() => {
      isSyncingScrollRef.current = false
    })
  }

  const handleCleanedScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isSyncingScrollRef.current) return

    const cleanedEl = e.currentTarget
    const rawEl = rawScrollRef.current
    if (!rawEl) return

    isSyncingScrollRef.current = true

    // Calculate scroll percentage
    const scrollPercentage = cleanedEl.scrollTop / (cleanedEl.scrollHeight - cleanedEl.clientHeight)
    // Apply to raw side
    rawEl.scrollTop = scrollPercentage * (rawEl.scrollHeight - rawEl.clientHeight)

    requestAnimationFrame(() => {
      isSyncingScrollRef.current = false
    })
  }

  // Sync segment heights
  useEffect(() => {
    const syncHeights = () => {
      segments.forEach((seg) => {
        const rawSegment = document.querySelector(`[data-segment-id="${seg.id}"]`) as HTMLElement
        const cleanedSegments = document.querySelectorAll(`[data-segment-id="${seg.id}"]`) as NodeListOf<HTMLElement>

        if (rawSegment && cleanedSegments.length === 2) {
          const cleanedSegment = cleanedSegments[1]
          const rawHeight = rawSegment.offsetHeight
          const cleanedHeight = cleanedSegment.offsetHeight
          const maxHeight = Math.max(rawHeight, cleanedHeight)

          rawSegment.style.minHeight = `${maxHeight}px`
          cleanedSegment.style.minHeight = `${maxHeight}px`
        }
      })
    }

    syncHeights()
    window.addEventListener("resize", syncHeights)
    return () => window.removeEventListener("resize", syncHeights)
  }, [segments, showDiff])

  return (
    <div>
      <div className="grid grid-cols-2 border-b border-border">
        <TranscriptHeader
          title="Raw Transcription"
          segments={segments}
          textKey="rawText"
          showCopyButton={showCopyButton}
        />
        <TranscriptHeader
          title="Cleaned Transcript"
          segments={segments}
          textKey="cleanedText"
          showDiffToggle
          showDiff={showDiff}
          onToggleDiff={onToggleDiff}
          showCopyButton={showCopyButton}
        />
      </div>

      <div className={`grid grid-cols-2 ${variant === "demo" ? "h-[600px]" : ""}`}>
        <RawSegmentList
          ref={rawScrollRef}
          segments={segments}
          activeSegmentId={activeSegmentId}
          showSpeakerLabels={showSpeakerLabels}
          isSelectingMoveTarget={isSelectingMoveTarget && textMoveSelection?.sourceColumn === "raw"}
          moveSourceSegmentId={textMoveSelection?.sourceColumn === "raw" ? textMoveSelection.sourceSegmentId : null}
          onSegmentClick={
            isSelectingMoveTarget && textMoveSelection?.sourceColumn === "raw" ? onRawMoveTargetClick : onSegmentClick
          }
          onTextSelect={onRawTextSelect}
          onScroll={handleRawScroll}
        />
        <EditableSegmentList
          ref={cleanedScrollRef}
          segments={segments}
          activeSegmentId={activeSegmentId}
          editingSegmentId={editingSegmentId}
          editedTexts={editedTexts}
          revertedSegments={revertedSegments}
          spellcheckErrors={spellcheckErrors}
          showDiff={showDiff}
          showSpeakerLabels={showSpeakerLabels}
          textMoveSelection={textMoveSelection}
          isSelectingMoveTarget={isSelectingMoveTarget && textMoveSelection?.sourceColumn === "cleaned"}
          activeSuggestion={activeSuggestion}
          onRevert={onRevert}
          onUndoRevert={onUndoRevert}
          onSave={onSave}
          onEditStart={onEditStart}
          onEditCancel={onEditCancel}
          onTextChange={onTextChange}
          onWordClick={onWordClick}
          onSuggestionSelect={onSuggestionSelect}
          onCloseSuggestions={onCloseSuggestions}
          onUpdateAll={onUpdateAll}
          onToggleDiff={onToggleDiff}
          onTextSelect={onCleanedTextSelect}
          onMoveTargetClick={onCleanedMoveTargetClick}
          editingCount={editingCount}
          onScroll={handleCleanedScroll}
          showRevertButton={showRevertButton}
        />
      </div>
    </div>
  )
}
