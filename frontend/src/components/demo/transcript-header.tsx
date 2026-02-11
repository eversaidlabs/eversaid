"use client"
import { useState, useRef } from "react"
import type { Segment } from "@/components/demo/types"
import type { ModelInfo, CleanupType, CleanupSummary } from "@/features/transcription/types"
import { Eye, EyeOff, Copy, ChevronDown, Loader2, Check, Medal, Info } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { capture } from "@/lib/analytics"
import { CLEANUP_LEVELS, CLEANUP_TEMPERATURES, getDefaultModelForLevel, temperaturesMatch, DEFAULT_CLEANUP_LEVEL } from "@/lib/level-config"
import { CleanupCompareModal } from "./cleanup-compare-modal"

export interface CleanupOptionsProps {
  /** Available LLM models */
  models: ModelInfo[]
  /** Currently selected model ID */
  selectedModel: string
  /** Currently selected cleanup level */
  selectedLevel: CleanupType
  /** Whether cleanup is currently processing */
  isProcessing?: boolean
  /** Callback when model changes */
  onModelChange: (modelId: string) => void
  /** Callback when level changes */
  onLevelChange: (level: CleanupType) => void
  /** Array of existing cleanups for cache indicator */
  cachedCleanups?: CleanupSummary[]
  /** Whether user has manually selected a model (vs using defaults) */
  hasManualSelection?: boolean
  /** Currently selected temperature (optional - only when temperature selection is enabled) */
  selectedTemperature?: number | null
  /** Callback when temperature changes (optional - only when temperature selection is enabled) */
  onTemperatureChange?: (temp: number | null, forceRerun?: boolean) => void
  /** Prompt name of the currently displayed cleanup (for copy metadata) */
  currentPromptName?: string | null
  /** Temperature of the currently displayed cleanup (for copy metadata) */
  currentTemperature?: number | null
  /** Callback when user clicks "Share feedback" link (exits fullscreen and focuses feedback textarea) */
  onShareFeedback?: () => void
}

export interface TranscriptHeaderProps {
  title: string
  segments: Segment[]
  textKey: "rawText" | "cleanedText"
  showDiffToggle?: boolean
  showDiff?: boolean
  onToggleDiff?: () => void
  showCopyButton?: boolean
  /** Cleanup options (only for AI CLEANED header) */
  cleanupOptions?: CleanupOptionsProps
}

export function TranscriptHeader({
  title,
  segments,
  textKey,
  showDiffToggle = false,
  showDiff = false,
  onToggleDiff,
  showCopyButton = true,
  cleanupOptions,
}: TranscriptHeaderProps) {
  const t = useTranslations("demo.cleanup")
  const [showModelMenu, setShowModelMenu] = useState(false)
  const [showLevelMenu, setShowLevelMenu] = useState(false)
  const [showCompareModal, setShowCompareModal] = useState(false)
  // Long-press state for temperature chips
  const [holdingTemp, setHoldingTemp] = useState<number | null | 'none'>('none')
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null)
  const didFireRef = useRef(false)

  const handleCopy = () => {
    capture('copy_clicked', { side: textKey === 'rawText' ? 'raw' : 'cleaned' })
    const text = segments.map((s) => s[textKey]).join("\n\n")

    // Feature flag: add metadata header when copying cleaned text
    const isCopyMetadataEnabled = process.env.NEXT_PUBLIC_ENABLE_COPY_METADATA === 'true'

    if (isCopyMetadataEnabled && textKey === 'cleanedText' && cleanupOptions?.currentPromptName) {
      // Get model display name
      const modelName = cleanupOptions.models.find(m => m.id === cleanupOptions.selectedModel)?.name
        || cleanupOptions.selectedModel

      // Format temperature from the actual cleanup
      const tempStr = cleanupOptions.currentTemperature === null || cleanupOptions.currentTemperature === undefined
        ? 'default'
        : cleanupOptions.currentTemperature.toString()

      const header = `[${modelName} | ${cleanupOptions.currentPromptName} | temp=${tempStr}]`
      navigator.clipboard.writeText(`${header}\n\n${text}`)
      toast.success(t("copySuccess"))
      return
    }

    navigator.clipboard.writeText(text)
    toast.success(t("copySuccess"))
  }

  const selectedModelName = cleanupOptions?.models.find(m => m.id === cleanupOptions.selectedModel)?.name
    || cleanupOptions?.selectedModel
    || "Default"

  return (
    <div className={`px-6 py-4 border-r border-border last:border-r-0 ${cleanupOptions ? 'flex flex-col gap-2' : 'flex justify-between items-center'}`}>
      {/* Beta notice banner - shown when cleanup options are available */}
      {cleanupOptions && (
        <div className="text-[11px] pl-3 py-1.5 border-l-2 border-l-violet-400 bg-gradient-to-r from-violet-50/50 to-transparent rounded-r">
          <span className="text-muted-foreground">
            <span className="font-medium text-violet-600">{t("betaLabel")}</span>
            <span className="mx-1.5">·</span>
            {t("betaNotice")}
            <button
              onClick={cleanupOptions.onShareFeedback}
              className="text-violet-600 hover:text-violet-700 font-medium ml-1.5 hover:underline"
            >
              {t("shareFeedback")}
            </button>
          </span>
        </div>
      )}

      {/* Main row: Title, Model, Style, and action buttons */}
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-[1px]">{title}</span>

          {/* Cleanup options dropdowns */}
          {cleanupOptions && (
            <>
            {/* Vertical divider */}
            <div className="h-4 w-px bg-border mx-2" />
            <div className="flex items-center gap-3">
            {/* Processing spinner */}
            {cleanupOptions.isProcessing && (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            )}

            {/* Model dropdown - only shown when models are available */}
            {cleanupOptions.models.length > 0 && (
              <div className="flex items-center">
                <span className="text-xs font-semibold text-foreground/70 mr-1.5">{t("openSourceModel")}</span>
                <div className="relative">
                  <button
                    onClick={() => !cleanupOptions.isProcessing && setShowModelMenu(!showModelMenu)}
                    disabled={cleanupOptions.isProcessing}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all ${
                      cleanupOptions.isProcessing
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="max-w-[80px] truncate">{selectedModelName}</span>
                    <ChevronDown className="w-3 h-3 flex-shrink-0" />
                  </button>
                  {showModelMenu && (
                    <div className="absolute left-0 top-full mt-1 bg-background border border-border rounded-md overflow-hidden z-20 shadow-lg min-w-[160px]">
                      {cleanupOptions.models.map((model) => {
                        // Check if this is the recommended model for current level
                        const isRecommendedForLevel = model.id === getDefaultModelForLevel(cleanupOptions.selectedLevel)
                        // Check if cached (exact match on cleanup_type, and temperature if enabled)
                        const isCached = cleanupOptions.cachedCleanups?.some(c =>
                          c.llm_model === model.id &&
                          c.cleanup_type === cleanupOptions.selectedLevel &&
                          // Only match temperature when temperature selection is enabled
                          (cleanupOptions.onTemperatureChange === undefined || temperaturesMatch(c.temperature, cleanupOptions.selectedTemperature)) &&
                          c.status === 'completed'
                        )
                        return (
                          <button
                            key={model.id}
                            onClick={() => {
                              cleanupOptions.onModelChange(model.id)
                              setShowModelMenu(false)
                            }}
                            className={`flex items-center justify-between w-full px-3 py-2 text-left text-[11px] transition-colors hover:bg-muted ${
                              cleanupOptions.selectedModel === model.id ? "bg-secondary font-medium" : ""
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              {model.name}
                              {isRecommendedForLevel && <Medal className="w-3 h-3 text-amber-500" />}
                            </span>
                            {isCached && <Check className="w-3 h-3 text-green-500 flex-shrink-0" />}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Level dropdown with subtitles */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground/70">{t("style")}</span>
              <div className="relative">
                <button
                  onClick={() => !cleanupOptions.isProcessing && setShowLevelMenu(!showLevelMenu)}
                  disabled={cleanupOptions.isProcessing}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-left transition-all min-w-[120px] ${
                    cleanupOptions.isProcessing
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-secondary hover:bg-muted"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-medium text-foreground">
                        {t(`levels.${cleanupOptions.selectedLevel}`)}
                      </span>
                      {cleanupOptions.selectedLevel === DEFAULT_CLEANUP_LEVEL && (
                        <span className="text-[8px] bg-primary text-primary-foreground px-1 rounded">
                          {t("temperatureDefault")}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-muted-foreground block">
                      {t(`hints.${cleanupOptions.selectedLevel}`)}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                </button>
                {showLevelMenu && (
                  <div className="absolute left-0 top-full mt-1 bg-background border border-border rounded-md overflow-hidden z-20 shadow-lg min-w-[160px]">
                    {CLEANUP_LEVELS.map((levelId) => {
                      const modelToCheck = cleanupOptions.hasManualSelection
                        ? cleanupOptions.selectedModel
                        : getDefaultModelForLevel(levelId)
                      const isCached = cleanupOptions.cachedCleanups?.some(c =>
                        c.llm_model === modelToCheck &&
                        c.cleanup_type === levelId &&
                        (cleanupOptions.onTemperatureChange === undefined || temperaturesMatch(c.temperature, cleanupOptions.selectedTemperature)) &&
                        c.status === 'completed'
                      )
                      const isSelected = cleanupOptions.selectedLevel === levelId
                      const isDefault = levelId === DEFAULT_CLEANUP_LEVEL
                      return (
                        <button
                          key={levelId}
                          onClick={() => {
                            cleanupOptions.onLevelChange(levelId)
                            setShowLevelMenu(false)
                          }}
                          className={`flex items-start justify-between w-full px-3 py-2 text-left transition-colors hover:bg-muted ${
                            isSelected ? "bg-secondary" : ""
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1">
                              <span className={`text-[11px] font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                                {t(`levels.${levelId}`)}
                              </span>
                              {isDefault && (
                                <span className="text-[8px] bg-primary/10 text-primary px-1 rounded">
                                  {t("temperatureDefault")}
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] text-muted-foreground block">
                              {t(`hints.${levelId}`)}
                            </span>
                          </div>
                          {isCached && <Check className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />}
                        </button>
                      )
                    })}
                    {/* Compare all link in dropdown */}
                    <div className="border-t border-border">
                      <button
                        onClick={() => {
                          setShowLevelMenu(false)
                          setShowCompareModal(true)
                        }}
                        className="w-full px-3 py-2 text-left text-[10px] text-primary hover:bg-muted flex items-center gap-1"
                      >
                        <Info className="w-3 h-3" />
                        {t("compareAll")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
          </>
        )}
        </div>

        <div className="flex gap-2 items-center">
        {showDiffToggle && onToggleDiff && (
          <button
            onClick={onToggleDiff}
            aria-label={showDiff ? "Hide changes" : "Show changes"}
            aria-pressed={showDiff}
            className={`flex items-center justify-center p-1.5 rounded-md transition-all ${
              showDiff
                ? "bg-blue-100 text-blue-700 border border-blue-300"
                : "bg-background text-muted-foreground border border-border hover:bg-secondary hover:text-foreground"
            }`}
          >
            {showDiff ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        )}
        {showCopyButton && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-secondary hover:bg-muted rounded-md text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            {t("copy")}
          </button>
        )}
        </div>
      </div>

      {/* Second row: Creativity/Temperature selector - only shown when temperature selection is enabled */}
      {cleanupOptions?.onTemperatureChange && (
        <div className="flex items-center gap-2 pl-0">
          <span className="text-xs font-semibold text-foreground/70">{t("creativity")}</span>
          <span className="text-[10px] text-muted-foreground">{t("creativityFocused")}</span>
          <div className="flex gap-1 flex-wrap">
            {CLEANUP_TEMPERATURES.map((temp) => {
              const isCached = cleanupOptions.cachedCleanups?.some(c =>
                c.llm_model === cleanupOptions.selectedModel &&
                c.cleanup_type === cleanupOptions.selectedLevel &&
                temperaturesMatch(c.temperature, temp) &&
                c.status === 'completed'
              )
              const isSelected = cleanupOptions.selectedTemperature === temp
              const isHolding = holdingTemp === temp
              return (
                <button
                  key={temp ?? 'null'}
                  onPointerDown={() => {
                    if (cleanupOptions.isProcessing) return
                    didFireRef.current = false
                    setHoldingTemp(temp)
                    holdTimerRef.current = setTimeout(() => {
                      didFireRef.current = true
                      cleanupOptions.onTemperatureChange!(temp, true)
                      setHoldingTemp('none')
                    }, 2000)
                  }}
                  onPointerUp={() => {
                    if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
                    holdTimerRef.current = null
                    if (!didFireRef.current && !cleanupOptions.isProcessing) {
                      cleanupOptions.onTemperatureChange!(temp)
                    }
                    setHoldingTemp('none')
                  }}
                  onPointerLeave={() => {
                    if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
                    holdTimerRef.current = null
                    setHoldingTemp('none')
                  }}
                  disabled={cleanupOptions.isProcessing}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 whitespace-nowrap transition-all ${
                    cleanupOptions.isProcessing ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    isHolding
                      ? "ring-2 ring-primary bg-primary/20"
                      : isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {temp === null ? t("temperatureDefault") : temp}
                  {isCached && !isHolding && <Check className="w-2.5 h-2.5 text-green-500 flex-shrink-0" />}
                </button>
              )
            })}
          </div>
          <span className="text-[10px] text-muted-foreground">{t("creativityCreative")}</span>
        </div>
      )}

      {/* Cleanup comparison modal */}
      {cleanupOptions && (
        <CleanupCompareModal
          isOpen={showCompareModal}
          onClose={() => setShowCompareModal(false)}
        />
      )}
    </div>
  )
}
