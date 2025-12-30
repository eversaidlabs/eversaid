"use client"

import { Copy, Eye, EyeOff } from "lucide-react"

export interface TranscriptHeaderProps {
  onCopyRaw: () => void
  onCopyClean: () => void
  onDownloadRaw: () => void
  onDownloadClean: () => void
  showDiff: boolean
  onToggleDiff: () => void
}

export function TranscriptHeader({
  onCopyRaw,
  onCopyClean,
  onDownloadRaw,
  onDownloadClean,
  showDiff,
  onToggleDiff,
}: TranscriptHeaderProps) {
  return (
    <div className="grid grid-cols-2 border-b border-[#E2E8F0]">
      <div className="px-6 py-4 border-r border-[#E2E8F0] flex justify-between items-center">
        <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-[1px]">Raw Transcription</span>
        <div className="flex gap-2">
          <button
            onClick={onCopyRaw}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-md text-xs font-medium text-[#64748B] hover:text-[#0F172A] transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy
          </button>
        </div>
      </div>
      <div className="px-6 py-4 flex justify-between items-center">
        <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-[1px]">Cleaned Transcript</span>
        <div className="flex gap-2 items-center">
          <button
            onClick={onToggleDiff}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
              showDiff
                ? "bg-[#DBEAFE] text-[#1E40AF] border border-[#93C5FD]"
                : "bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F1F5F9]"
            }`}
          >
            {showDiff ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {showDiff ? "Diff On" : "Diff Off"}
          </button>
          <button
            onClick={onCopyClean}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-md text-xs font-medium text-[#64748B] hover:text-[#0F172A] transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}
