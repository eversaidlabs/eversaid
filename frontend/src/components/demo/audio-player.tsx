"use client"

import type React from "react"
import { Play, Pause, Download } from "lucide-react"

export interface AudioPlayerProps {
  isPlaying: boolean
  currentTime: number
  duration: number
  playbackSpeed: number
  showSpeedMenu: boolean
  onPlayPause: () => void
  onSeek: (time: number) => void
  onSpeedChange: (speed: number) => void
  onToggleSpeedMenu: () => void
  onDownload: () => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function AudioPlayer({
  isPlaying,
  currentTime,
  duration,
  playbackSpeed,
  showSpeedMenu,
  onPlayPause,
  onSeek,
  onSpeedChange,
  onToggleSpeedMenu,
  onDownload,
}: AudioPlayerProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration
    onSeek(newTime)
  }

  return (
    <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] px-8 py-5 flex items-center gap-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border-b border-white/5 rounded-2xl">
      <button
        onClick={onPlayPause}
        className="w-12 h-12 bg-gradient-to-br from-white/15 to-white/5 hover:from-white/25 hover:to-white/10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm border border-white/10"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 fill-white stroke-white ml-0" />
        ) : (
          <Play className="w-5 h-5 fill-white stroke-white ml-0.5" />
        )}
      </button>

      <div className="flex-1 flex items-center gap-4">
        <span className="text-sm text-white/80 font-semibold tabular-nums tracking-wide drop-shadow-sm min-w-[48px]">
          {formatTime(currentTime)}
        </span>

        <div
          className="flex-1 h-2 bg-white/10 rounded-full relative cursor-pointer group backdrop-blur-sm shadow-inner"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-gradient-to-r from-[#38BDF8] via-[#818CF8] to-[#A855F7] rounded-full relative transition-all duration-200 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.3)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 ring-2 ring-white/20" />
          </div>
        </div>

        <span className="text-sm text-white/80 font-semibold tabular-nums tracking-wide drop-shadow-sm min-w-[48px] text-right">
          {formatTime(duration)}
        </span>
      </div>

      <div className="flex gap-3">
        <div className="relative">
          <button
            onClick={onToggleSpeedMenu}
            className="w-11 h-11 bg-gradient-to-br from-white/12 to-white/5 hover:from-white/20 hover:to-white/10 rounded-xl flex items-center justify-center transition-all duration-300 text-sm font-bold text-white/90 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm border border-white/10"
          >
            {playbackSpeed}x
          </button>

          {showSpeedMenu && (
            <div className="absolute right-0 top-full mt-3 min-w-[80px] bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.5)] overflow-hidden z-10 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
              {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => {
                    onSpeedChange(speed)
                    onToggleSpeedMenu()
                  }}
                  className={`block w-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 whitespace-nowrap text-left ${
                    playbackSpeed === speed
                      ? "bg-gradient-to-r from-[#38BDF8] to-[#818CF8] text-white shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onDownload}
          className="w-11 h-11 bg-gradient-to-br from-white/12 to-white/5 hover:from-white/20 hover:to-white/10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm border border-white/10"
        >
          <Download className="w-5 h-5 stroke-white/90" />
        </button>
      </div>
    </div>
  )
}
