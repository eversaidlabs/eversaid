"use client"

/**
 * TranscriptLoadingSkeleton - Shimmer loading state for transcript view
 *
 * Mimics the TranscriptComparisonLayout structure while entry data is being loaded.
 * Uses Tailwind animate-pulse for a professional shimmer effect.
 *
 * Architecture: Presentation component only (no logic, no useState)
 */

export function TranscriptLoadingSkeleton() {
  return (
    <div className="relative flex flex-col h-full">
      {/* Audio player skeleton */}
      <div className="bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#1E293B] px-8 py-5 flex items-center gap-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border-b border-white/5 rounded-t-2xl">
        {/* Play button skeleton */}
        <div className="w-12 h-12 bg-white/10 rounded-full animate-pulse" />

        {/* Progress bar skeleton */}
        <div className="flex-1 flex items-center gap-4">
          <div className="w-12 h-4 bg-white/10 rounded animate-pulse" />
          <div className="flex-1 h-2 bg-white/15 rounded-full animate-pulse" />
          <div className="w-12 h-4 bg-white/10 rounded animate-pulse" />
        </div>

        {/* Controls skeleton */}
        <div className="flex gap-3">
          <div className="w-11 h-11 bg-white/10 rounded-xl animate-pulse" />
          <div className="w-11 h-11 bg-white/10 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Column headers skeleton */}
      <div className="grid grid-cols-2 border-b border-border">
        <div className="p-4 border-r border-border bg-background">
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="p-4 bg-background">
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        </div>
      </div>

      {/* Segment rows skeleton */}
      <div className="grid grid-cols-2 flex-1 overflow-hidden">
        {/* Raw column */}
        <div className="border-r border-border overflow-y-auto p-4 space-y-3 bg-background">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={`raw-${idx}`}
              className="p-3 rounded-xl border-l-4 border-[#1D3557] bg-secondary animate-pulse"
            >
              {/* Speaker + time */}
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-16 bg-muted rounded" />
                <div className="h-3 w-12 bg-muted rounded" />
              </div>
              {/* Text lines */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-5/6 bg-muted rounded" />
                {idx % 2 === 0 && <div className="h-4 w-4/5 bg-muted rounded" />}
              </div>
            </div>
          ))}
        </div>

        {/* Cleaned column */}
        <div className="overflow-y-auto p-4 space-y-3 bg-background">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={`cleaned-${idx}`}
              className="p-3 rounded-xl border-l-4 border-[#E85D04] bg-secondary animate-pulse"
            >
              {/* Speaker + time + actions */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-16 bg-muted rounded" />
                  <div className="h-3 w-12 bg-muted rounded" />
                </div>
                <div className="h-6 w-16 bg-muted rounded" />
              </div>
              {/* Text lines */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-5/6 bg-muted rounded" />
                {idx % 2 === 0 && <div className="h-4 w-3/4 bg-muted rounded" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
