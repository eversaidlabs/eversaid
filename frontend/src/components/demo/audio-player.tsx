"use client"

import type React from "react"
import { Play, Pause, Download } from "lucide-react"

export interface AudioPlayerProps {
  isPlaying: boolean
  currentTime: number
  duration: number
  playbackSpeed: number
  showSpeedMenu: boolean // Added controlled visibility prop
  onPlayPause: () => void
  onSeek: (time: number) => void
  onSpeedChange: (speed: number) => void
  onToggleSpeedMenu: () => void // Added toggle handler prop
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
  showSpeedMenu, // Receive from parent
  onPlayPause,
  onSeek,
  onSpeedChange,
  onToggleSpeedMenu, // Receive from parent
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
    <div className="bg-[linear-gradient(135deg,#0F172A_0%,#1E3A5F_100%)] px-6 py-4 flex items-center gap-4">
      <button
        onClick={onPlayPause}
        className="w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 fill-white stroke-white" />
        ) : (
          <Play className="w-5 h-5 fill-white stroke-white" />
        )}
      </button>

      <div className="flex-1 flex items-center gap-3">
        <span className="text-[13px] text-white/70 font-medium tabular-nums">{formatTime(currentTime)}</span>
        <div className="flex-1 h-1.5 bg-white/20 rounded-full relative cursor-pointer" onClick={handleProgressClick}>
          <div
            className="h-full bg-[linear-gradient(135deg,#38BDF8_0%,#A855F7_100%)] rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute -right-1.5 -top-[3px] w-3 h-3 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.3)]" />
          </div>
        </div>
        <span className="text-[13px] text-white/70 font-medium tabular-nums">{formatTime(duration)}</span>
      </div>

      <div className="flex gap-2">
        <div className="relative">
          <button
            onClick={onToggleSpeedMenu}
            className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors text-[11px] font-bold text-white/80"
          >
            {playbackSpeed}x
          </button>
          {showSpeedMenu && (
            <div className="absolute right-0 top-full mt-2 min-w-[70px] bg-[#1E293B] border border-white/10 rounded-lg shadow-lg overflow-hidden z-10">
              {[0.5, 1, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => {
                    onSpeedChange(speed)
                    onToggleSpeedMenu() // Close menu after selection
                  }}
                  className={`block w-full px-4 py-2 text-[12px] font-medium transition-colors whitespace-nowrap text-left ${
                    playbackSpeed === speed
                      ? "bg-[#38BDF8] text-white"
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
          className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
        >
          <Download className="w-[18px] h-[18px] stroke-white/80" />
        </button>
      </div>
    </div>
  )
}
