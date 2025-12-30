"use client"

import type React from "react"
import { RotateCcw, Check, X, Undo2 } from "lucide-react"
import type { SpellcheckError } from "./types"
import { DiffSegmentDisplay } from "./diff-segment-display"

export interface EditableSegmentRowProps {
  id: string
  speaker: number
  time: string
  text: string
  rawText: string // Added rawText prop for diff computation
  isActive: boolean
  isReverted: boolean
  isEditing: boolean
  editedText: string
  hasUnsavedEdits: boolean
  showDiff: boolean // Added showDiff prop for toggle
  spellcheckErrors: SpellcheckError[]
  activeSuggestion: {
    word: string
    position: { x: number; y: number }
    suggestions: string[]
  } | null
  onRevert: () => void
  onUndoRevert: () => void
  onSave: () => void
  onEditStart: () => void
  onEditCancel: () => void
  onTextChange: (text: string) => void
  onWordClick: (e: React.MouseEvent, error: SpellcheckError) => void
  onSuggestionSelect: (suggestion: string) => void
  onCloseSuggestions: () => void
}

export function EditableSegmentRow({
  id,
  speaker,
  time,
  text,
  rawText,
  isActive,
  isReverted,
  isEditing,
  editedText,
  hasUnsavedEdits,
  showDiff,
  spellcheckErrors,
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
}: EditableSegmentRowProps) {
  const renderTextWithSpellcheck = () => {
    if (!isEditing || spellcheckErrors.length === 0) {
      return editedText
    }

    const parts: React.ReactNode[] = []
    let lastIndex = 0

    spellcheckErrors.forEach((error, idx) => {
      if (error.start > lastIndex) {
        parts.push(editedText.substring(lastIndex, error.start))
      }

      parts.push(
        <span
          key={`error-${idx}`}
          className="border-b-2 border-[#FB923C] border-dashed cursor-pointer hover:bg-[#FED7AA]/20"
          onClick={(e) => onWordClick(e, error)}
        >
          {error.word}
        </span>,
      )

      lastIndex = error.end
    })

    if (lastIndex < editedText.length) {
      parts.push(editedText.substring(lastIndex))
    }

    return parts
  }

  const renderContent = () => {
    if (isEditing) {
      return renderTextWithSpellcheck()
    }
    if (showDiff && !isReverted) {
      return <DiffSegmentDisplay rawText={rawText} cleanedText={text} showDiff={showDiff} />
    }
    return text
  }

  return (
    <>
      <div
        data-segment-id={id}
        className={`p-4 mb-3 rounded-xl bg-[#F8FAFC] border-l-4 transition-all cursor-pointer relative ${
          isActive ? "shadow-[0_0_0_2px_rgba(56,189,248,0.3),0_4px_12px_rgba(0,0,0,0.05)] bg-white" : ""
        } ${speaker === 1 ? "border-[#38BDF8]" : "border-[#A855F7]"}`}
      >
        {hasUnsavedEdits && !isEditing && (
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#FB923C] rounded-full border-2 border-white shadow-sm" />
        )}

        <div className="flex justify-between items-center mb-2.5">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${speaker === 1 ? "text-[#0284C7]" : "text-[#7C3AED]"}`}>
              Speaker {speaker}
            </span>
            <span className="text-[11px] text-[#94A3B8] font-medium">{time}</span>
            {hasUnsavedEdits && !isEditing && (
              <span className="text-[10px] font-semibold text-[#FB923C] bg-[#FED7AA]/20 px-1.5 py-0.5 rounded">
                Edited
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={onSave}
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#DCFCE7] hover:bg-[#BBF7D0] border border-[#86EFAC] rounded-md text-[11px] font-semibold text-[#166534] transition-all"
                >
                  <Check className="w-3 h-3" />
                  Save
                </button>
                <button
                  onClick={onEditCancel}
                  className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-md text-[11px] font-semibold text-[#64748B] transition-all"
                >
                  <X className="w-3 h-3" />
                  Cancel
                </button>
              </>
            ) : (
              <>
                {isReverted ? (
                  <button
                    onClick={onUndoRevert}
                    className="flex items-center gap-1 px-2.5 py-1 bg-[#DBEAFE] hover:bg-[#BFDBFE] border border-[#93C5FD] rounded-md text-[11px] font-semibold text-[#1E40AF] transition-all"
                  >
                    <Undo2 className="w-3 h-3" />
                    Undo
                  </button>
                ) : (
                  <button
                    onClick={onRevert}
                    className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#FEF2F2] border border-[#E2E8F0] hover:border-[#FECACA] rounded-md text-[11px] font-semibold text-[#64748B] hover:text-[#DC2626] transition-all"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Revert
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        <div
          className={`text-[15px] leading-[1.7] text-[#334155] ${
            isEditing ? "outline-none p-2 -m-2 rounded border-2 border-[#38BDF8] bg-white" : ""
          }`}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onDoubleClick={onEditStart}
          onInput={(e) => onTextChange(e.currentTarget.textContent || "")}
        >
          {renderContent()}
        </div>
        {!isEditing && (
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
            <div className="absolute top-2 right-2 bg-[#0F172A] text-white text-[10px] px-2 py-1 rounded font-medium">
              Double-click to edit
            </div>
          </div>
        )}
      </div>

      {/* Spellcheck Suggestions Dropdown */}
      {activeSuggestion && (
        <>
          <div className="fixed inset-0 z-40" onClick={onCloseSuggestions} />
          <div
            className="fixed z-50 bg-white rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-[#E2E8F0] py-1 min-w-[180px]"
            style={{
              left: `${activeSuggestion.position.x}px`,
              top: `${activeSuggestion.position.y}px`,
            }}
          >
            <div className="px-3 py-1.5 text-[10px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#F1F5F9]">
              Suggestions
            </div>
            {activeSuggestion.suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onSuggestionSelect(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-[#334155] hover:bg-[#F1F5F9] transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  )
}
