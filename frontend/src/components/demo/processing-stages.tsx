"use client"

import { Check, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import type { ProcessingStage, StageId } from "@/features/transcription/types"

/**
 * Props for the ProcessingStages component
 */
export interface ProcessingStagesProps {
  /** Array of processing stages with their current status */
  stages: ProcessingStage[]
  /** ID of the currently active stage */
  currentStageId: StageId | null
  /** Custom status message to display (optional, uses default based on stage) */
  statusMessage?: string
}

/**
 * ProcessingStages - Visual stepper showing pipeline progress
 *
 * Displays a horizontal stepper with 4 stages: Upload → Transcribe → Cleanup → Analysis
 * Each stage shows its status (pending, active, completed, error) with appropriate styling.
 *
 * Architecture: Presentation component only (no logic, no useState)
 */
export function ProcessingStages({
  stages,
  currentStageId,
  statusMessage,
}: ProcessingStagesProps) {
  const t = useTranslations("demo.processing")

  // Get the default status message based on current stage
  const defaultMessage = currentStageId
    ? t(`messages.${currentStageId}`)
    : null

  // Get estimate text for current stage
  const estimateText = currentStageId
    ? t(`estimates.${currentStageId}`)
    : null

  return (
    <div className="w-full py-8 px-4">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex items-center">
            {/* Stage indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${stage.status === "completed"
                    ? "bg-[#1D3557] text-white"
                    : stage.status === "active"
                      ? "bg-white border-2 border-[#E85D04] text-[#E85D04]"
                      : stage.status === "error"
                        ? "bg-red-500 text-white"
                        : "bg-[#F5F5F5] text-[#94A3B8]"
                  }
                `}
              >
                {stage.status === "completed" ? (
                  <Check className="w-5 h-5" />
                ) : stage.status === "active" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : stage.status === "error" ? (
                  <span className="text-sm font-bold">!</span>
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span
                className={`
                  mt-2 text-xs font-medium whitespace-nowrap
                  ${stage.status === "active"
                    ? "text-[#E85D04]"
                    : stage.status === "completed"
                      ? "text-[#1D3557]"
                      : "text-[#94A3B8]"
                  }
                `}
              >
                {t(`stages.${stage.id}`)}
              </span>
            </div>

            {/* Connector line (except after last stage) */}
            {index < stages.length - 1 && (
              <div
                className={`
                  w-12 h-0.5 mx-2 mt-[-20px]
                  transition-colors duration-300
                  ${stage.status === "completed"
                    ? "bg-[#1D3557]"
                    : "bg-[#E2E8F0]"
                  }
                `}
              />
            )}
          </div>
        ))}
      </div>

      {/* Status message */}
      {(statusMessage || defaultMessage) && (
        <div className="text-center">
          <p className="text-[#0F172A] font-medium mb-1">
            {statusMessage || defaultMessage}
          </p>
          {estimateText && (
            <p className="text-[#64748B] text-sm">
              {t("estimated")}: {estimateText}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
