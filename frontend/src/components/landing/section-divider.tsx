"use client"

import { cn } from "@/lib/utils"

interface SectionDividerProps {
  /** Fill color for the curve (should match the section below) */
  fillColor?: string
  /** Flip vertically (for bottom of section, curve points up) */
  flip?: boolean
  /** Additional CSS classes */
  className?: string
  /** Height of the divider in pixels */
  height?: number
}

export function SectionDivider({
  fillColor = "#F8FAFC",
  flip = false,
  className,
  height = 48,
}: SectionDividerProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden leading-[0]",
        flip && "rotate-180",
        className
      )}
      style={{ height }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gentle curve - subtle arc, not dramatic wave */}
        <path
          d="M0 48L1440 48L1440 0C1440 0 1080 24 720 24C360 24 0 0 0 0L0 48Z"
          fill={fillColor}
        />
      </svg>
    </div>
  )
}

// Preset colors matching the design system
export const DIVIDER_COLORS = {
  light: "#F8FAFC", // Light gray sections
  white: "#FFFFFF", // White sections
  dark: "#1D3557", // Navy dark sections
} as const
