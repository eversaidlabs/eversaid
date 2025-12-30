"use client"

import type React from "react"
import { forwardRef } from "react"
import { Check } from "lucide-react"
import { EditableSegmentRow } from "./editable-segment-row"
import type { SpellcheckError } from "./types"

export interface EditableSegmentListProps {
  segments: Array<{
    id: string
    speaker: number
    time: string
    rawText: string
    cleanedText: string
  }>
  activeSegmentId: string | null
  editingSegmentId: string | null
  editedTexts: Map<string, string>
  revertedSegments: Map<string, string>
  spellcheckErrors: Map<string, SpellcheckError[]>
  showDiff: boolean
  activeSuggestion: {
    segmentId: string
    word: string
    position: { x: number; y: number }
    suggestions: string[]
  } | null
  onRevert: (id: string) => void
  onUndoRevert: (id: string) => void
  onSave: (id: string) => void
  onEditStart: (id: string) => void
  onEditCancel: (id: string) => void
  onTextChange: (id: string, text: string) => void
  onWordClick: (segmentId: string, e: React.MouseEvent, error: SpellcheckError) => void
  onSuggestionSelect: (suggestion: string) => void
  onCloseSuggestions: () => void
  onUpdateAll: () => void
  onToggleDiff: () => void
  editingCount: number
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void
}

export const EditableSegmentList = forwardRef<HTMLDivElement, EditableSegmentListProps>(
  (
    {
      segments,
      activeSegmentId,
      editingSegmentId,
      editedTexts,
      revertedSegments,
      spellcheckErrors,
      showDiff,
      activeSuggestion,
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
      editingCount,
      onScroll,
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className="p-5 overflow-y-auto bg-[linear-gradient(180deg,rgba(56,189,248,0.02)_0%,transparent_100%)]"
        onScroll={onScroll}
      >
        {editingCount > 0 && (
          <div className="flex items-center justify-end mb-4">
            <button
              onClick={onUpdateAll}
              className="flex items-center gap-2 px-4 py-2 bg-[linear-gradient(135deg,#38BDF8_0%,#A855F7_100%)] hover:opacity-90 text-white text-sm font-semibold rounded-lg transition-all shadow-sm"
            >
              <Check className="w-4 h-4" />
              Update all segments ({editingCount})
            </button>
          </div>
        )}
        <div className="space-y-0">
          {segments.map((seg) => {
            const hasUnsavedEdits = editedTexts.has(seg.id) && editedTexts.get(seg.id) !== seg.cleanedText

            return (
              <EditableSegmentRow
                key={seg.id}
                id={seg.id}
                speaker={seg.speaker}
                time={seg.time}
                text={seg.cleanedText}
                rawText={seg.rawText}
                isActive={seg.id === activeSegmentId}
                isReverted={revertedSegments.has(seg.id)}
                isEditing={editingSegmentId === seg.id}
                editedText={editedTexts.get(seg.id) || seg.cleanedText}
                hasUnsavedEdits={hasUnsavedEdits}
                showDiff={showDiff}
                spellcheckErrors={spellcheckErrors.get(seg.id) || []}
                activeSuggestion={
                  activeSuggestion?.segmentId === seg.id
                    ? {
                        word: activeSuggestion.word,
                        position: activeSuggestion.position,
                        suggestions: activeSuggestion.suggestions,
                      }
                    : null
                }
                onRevert={() => onRevert(seg.id)}
                onUndoRevert={() => onUndoRevert(seg.id)}
                onSave={() => onSave(seg.id)}
                onEditStart={() => onEditStart(seg.id)}
                onEditCancel={() => onEditCancel(seg.id)}
                onTextChange={(text) => onTextChange(seg.id, text)}
                onWordClick={(e, error) => onWordClick(seg.id, e, error)}
                onSuggestionSelect={onSuggestionSelect}
                onCloseSuggestions={onCloseSuggestions}
              />
            )
          })}
        </div>
      </div>
    )
  },
)

EditableSegmentList.displayName = "EditableSegmentList"
