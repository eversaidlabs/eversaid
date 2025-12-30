"use client"

import type React from "react"

import { forwardRef } from "react"

export interface RawSegmentListProps {
  segments: Array<{
    id: string
    speaker: number
    time: string
    rawText: string
  }>
  activeSegmentId: string | null
  onSegmentClick: (id: string) => void
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void
}

export const RawSegmentList = forwardRef<HTMLDivElement, RawSegmentListProps>(
  ({ segments, activeSegmentId, onSegmentClick, onScroll }, ref) => {
    return (
      <div ref={ref} className="p-5 overflow-y-auto border-r border-[#E2E8F0]" onScroll={onScroll}>
        {segments.map((seg) => (
          <div
            key={seg.id}
            data-segment-id={seg.id}
            className={`p-4 mb-3 rounded-xl bg-[#F8FAFC] border-l-4 transition-all cursor-pointer ${
              seg.id === activeSegmentId
                ? "shadow-[0_0_0_2px_rgba(56,189,248,0.3),0_4px_12px_rgba(0,0,0,0.05)] bg-white"
                : ""
            } ${seg.speaker === 1 ? "border-[#38BDF8]" : "border-[#A855F7]"}`}
            onClick={() => onSegmentClick(seg.id)}
          >
            <div className="flex justify-between items-center mb-2.5">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${seg.speaker === 1 ? "text-[#0284C7]" : "text-[#7C3AED]"}`}>
                  Speaker {seg.speaker}
                </span>
                <span className="text-[11px] text-[#94A3B8] font-medium">{seg.time}</span>
              </div>
            </div>
            <div className="text-[15px] leading-[1.7] text-[#334155]">{seg.rawText}</div>
          </div>
        ))}
      </div>
    )
  },
)

RawSegmentList.displayName = "RawSegmentList"
