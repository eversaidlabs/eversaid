"use client"

import { Upload, Check } from "lucide-react"
import type { HistoryEntry } from "./types"

export interface EntryHistoryCardProps {
  entries: HistoryEntry[]
  activeId: string | null
  isEmpty: boolean
  onSelect: (id: string) => void
}

export function EntryHistoryCard({ entries, activeId, isEmpty, onSelect }: EntryHistoryCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E2E8F0] flex justify-between items-center">
        <span className="text-sm font-bold text-[#0F172A]">Your Transcriptions</span>
      </div>

      {isEmpty ? (
        <div className="p-10 text-center">
          <div className="w-16 h-16 bg-[#F1F5F9] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-7 h-7 stroke-[#94A3B8]" />
          </div>
          <h4 className="text-sm font-semibold text-[#64748B] mb-1.5">No transcriptions yet</h4>
          <p className="text-[13px] text-[#94A3B8]">Upload audio to get started</p>
        </div>
      ) : (
        <div className="p-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => onSelect(entry.id)}
              className={`flex items-center gap-3 p-3 rounded-[10px] cursor-pointer transition-all ${
                activeId === entry.id
                  ? "bg-[linear-gradient(135deg,rgba(56,189,248,0.1)_0%,rgba(168,85,247,0.1)_100%)]"
                  : "hover:bg-[#F8FAFC]"
              }`}
            >
              <div className="w-9 h-9 bg-[linear-gradient(135deg,#38BDF8_0%,#A855F7_100%)] rounded-lg flex items-center justify-center">
                <Upload className="w-[18px] h-[18px] stroke-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[#0F172A] truncate">{entry.filename}</div>
                <div className="text-[11px] text-[#94A3B8] flex gap-2">
                  <span>{entry.duration}</span>
                  <span>·</span>
                  <span className="capitalize">{entry.status}</span>
                </div>
              </div>
              {entry.status === "complete" && (
                <div className="w-5 h-5 bg-[#DCFCE7] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[#16A34A]" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="px-4 py-3 border-t border-[#E2E8F0] text-[11px] text-[#94A3B8] text-center">
        Transcriptions kept for 7 days
      </div>
    </div>
  )
}
