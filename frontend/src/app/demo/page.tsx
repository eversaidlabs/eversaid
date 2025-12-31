"use client"

import type React from "react"
import { useRef } from "react"
import { useState, useCallback, useEffect } from "react"
import { DemoNavigation } from "@/components/demo/demo-navigation"
import { AudioPlayer } from "@/components/demo/audio-player"
import { TranscriptHeader } from "@/components/demo/transcript-header"
import { RawSegmentList } from "@/components/demo/raw-segment-list"
import { EditableSegmentList } from "@/components/demo/editable-segment-list"
import { AnalysisSection } from "@/components/demo/analysis-section"
import { EntryHistoryCard } from "@/components/demo/entry-history-card"
import { FeedbackCard } from "@/components/demo/feedback-card"
import { WaitlistCTA } from "@/components/demo/waitlist-cta"
import { UploadZone } from "@/components/demo/upload-zone"
import { FeaturesHint } from "@/components/demo/features-hint"
import { DemoFooter } from "@/components/demo/demo-footer"
import { WaitlistFlow } from "@/components/waitlist/waitlist-flow"
import type { Segment, SpellcheckError, HistoryEntry } from "@/components/demo/types"

// Mock spellcheck - in production, call a Slovenian spellcheck API
const checkSpelling = (text: string): SpellcheckError[] => {
  const mockErrors: SpellcheckError[] = []
  const words = text.split(/\b/)
  let position = 0

  const misspellings: Record<string, string[]> = {
    implementaton: ["implementation", "implementacija"],
    teh: ["the", "ta"],
    recieve: ["receive", "prejeti"],
  }

  words.forEach((word) => {
    const cleanWord = word.toLowerCase().replace(/[.,!?]/g, "")
    if (misspellings[cleanWord]) {
      mockErrors.push({
        word: word,
        start: position,
        end: position + word.length,
        suggestions: misspellings[cleanWord],
      })
    }
    position += word.length
  })

  return mockErrors
}

export default function DemoPage() {
  // UI State
  const [uiState, setUiState] = useState<"empty" | "complete">("complete")
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null)

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(34)
  const [duration] = useState(285) // Updated duration for more segments (4:45)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)

  // Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedSpeakerCount, setSelectedSpeakerCount] = useState(2)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Editing State
  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null)
  const [editedTexts, setEditedTexts] = useState<Map<string, string>>(new Map())
  const [revertedSegments, setRevertedSegments] = useState<Map<string, string>>(new Map())
  const [spellcheckErrors, setSpellcheckErrors] = useState<Map<string, SpellcheckError[]>>(new Map())
  const [activeSuggestion, setActiveSuggestion] = useState<{
    segmentId: string
    word: string
    position: { x: number; y: number }
    suggestions: string[]
  } | null>(null)

  const [showDiff, setShowDiff] = useState(true)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [showAnalysisMenu, setShowAnalysisMenu] = useState(false)

  // Analysis State
  const [analysisType, setAnalysisType] = useState<"summary" | "action-items" | "sentiment">("summary")

  // Feedback State
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")

  const [segments, setSegments] = useState<Segment[]>([
    {
      id: "seg-1",
      speaker: 1,
      time: "0:00 – 0:18",
      rawText:
        "Uh so basically what we're trying to do here is um figure out the best approach for the the project timeline and um you know make sure everyone's on the same page.",
      cleanedText:
        "So basically what we're trying to do here is figure out the best approach for the project timeline, ensuring everyone's on the same page.",
    },
    {
      id: "seg-2",
      speaker: 2,
      time: "0:19 – 0:42",
      rawText:
        "Yeah I think we should we should probably start with the the research phase first you know and then move on to to the design work after we have all the the data we need.",
      cleanedText:
        "Yes, I think we should probably start with the research phase first and then move on to the design work after we have all the data we need.",
    },
    {
      id: "seg-3",
      speaker: 1,
      time: "0:43 – 1:05",
      rawText:
        "That makes sense um and I was thinking maybe we could also like bring in some external consultants to help with the the technical aspects of the project.",
      cleanedText:
        "That makes sense, and I was thinking maybe we could bring in some external consultants to help with the technical aspects of the project.",
    },
    {
      id: "seg-4",
      speaker: 2,
      time: "1:06 – 1:28",
      rawText:
        "Sure that's a good idea I mean we we definitely need some expertise in in the machine learning side of things especially for the the data processing pipeline.",
      cleanedText:
        "Sure, that's a good idea. We definitely need some expertise in the machine learning side of things, especially for the data processing pipeline.",
    },
    {
      id: "seg-5",
      speaker: 1,
      time: "1:29 – 1:55",
      rawText:
        "Right right and um what about the the budget like do we have enough um resources allocated for for bringing in outside help or should we should we look at maybe reallocating from other areas?",
      cleanedText:
        "Right, and what about the budget? Do we have enough resources allocated for bringing in outside help, or should we look at reallocating from other areas?",
    },
    {
      id: "seg-6",
      speaker: 2,
      time: "1:56 – 2:24",
      rawText:
        "Well I I think we have some some flexibility there um the Q3 budget had a a contingency fund set aside so so we could tap into that if if needed you know what I mean.",
      cleanedText:
        "Well, I think we have some flexibility there. The Q3 budget had a contingency fund set aside, so we could tap into that if needed.",
    },
    {
      id: "seg-7",
      speaker: 1,
      time: "2:25 – 2:58",
      rawText:
        "Perfect that's that's great to hear um so let's let's plan to to have like a follow-up meeting next week to to finalize the the consultant requirements and um get the ball rolling on that.",
      cleanedText:
        "Perfect, that's great to hear. Let's plan to have a follow-up meeting next week to finalize the consultant requirements and get the ball rolling on that.",
    },
    {
      id: "seg-8",
      speaker: 2,
      time: "2:59 – 3:28",
      rawText:
        "Sounds good I'll I'll send out a a calendar invite for for Thursday afternoon if if that works for everyone and uh we can we can also invite Sarah from from procurement to to help with the the vendor selection process.",
      cleanedText:
        "Sounds good. I'll send out a calendar invite for Thursday afternoon if that works for everyone. We can also invite Sarah from procurement to help with the vendor selection process.",
    },
  ])

  // History entries
  const [historyEntries] = useState<HistoryEntry[]>([
    {
      id: "entry-1",
      filename: "team-meeting.mp3",
      duration: "03:28",
      status: "complete",
      timestamp: "2025-01-15T10:30:00Z",
    },
  ])

  // Analysis data
  const analysisData = {
    summary:
      "A discussion about project planning and resource allocation, focusing on establishing a timeline and bringing in external expertise for technical aspects.",
    topics: [
      "Project timeline",
      "Research phase",
      "External consultants",
      "Machine learning expertise",
      "Budget allocation",
      "Vendor selection",
    ],
    keyPoints: [
      "Proposed starting with research phase before design work",
      "Need to ensure team alignment on project approach",
      "Considering bringing in external consultants for technical expertise",
      "Identified need for machine learning expertise in data processing",
      "Q3 contingency fund available for consultant costs",
      "Follow-up meeting scheduled for Thursday to finalize requirements",
    ],
  }

  // Waitlist modal state
  const [waitlistState, setWaitlistState] = useState<"hidden" | "toast" | "form" | "success">("hidden")
  const [waitlistType, setWaitlistType] = useState<"extended_usage" | "api_access">("extended_usage")
  const [waitlistEmail, setWaitlistEmail] = useState("")
  const [waitlistReferralCode, setWaitlistReferralCode] = useState("")

  const rawScrollRef = useRef<HTMLDivElement>(null)
  const cleanedScrollRef = useRef<HTMLDivElement>(null)
  const isSyncingScrollRef = useRef(false)

  const handleRawScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isSyncingScrollRef.current) return

    const rawEl = e.currentTarget
    const cleanedEl = cleanedScrollRef.current
    if (!cleanedEl) return

    isSyncingScrollRef.current = true

    // Calculate scroll percentage
    const scrollPercentage = rawEl.scrollTop / (rawEl.scrollHeight - rawEl.clientHeight)
    // Apply to cleaned side
    cleanedEl.scrollTop = scrollPercentage * (cleanedEl.scrollHeight - cleanedEl.clientHeight)

    requestAnimationFrame(() => {
      isSyncingScrollRef.current = false
    })
  }

  const handleCleanedScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isSyncingScrollRef.current) return

    const cleanedEl = e.currentTarget
    const rawEl = rawScrollRef.current
    if (!rawEl) return

    isSyncingScrollRef.current = true

    // Calculate scroll percentage
    const scrollPercentage = cleanedEl.scrollTop / (cleanedEl.scrollHeight - cleanedEl.clientHeight)
    // Apply to raw side
    rawEl.scrollTop = scrollPercentage * (rawEl.scrollHeight - rawEl.clientHeight)

    requestAnimationFrame(() => {
      isSyncingScrollRef.current = false
    })
  }

  // Run spellcheck when editing starts or text changes
  useEffect(() => {
    if (editingSegmentId) {
      const text =
        editedTexts.get(editingSegmentId) || segments.find((s) => s.id === editingSegmentId)?.cleanedText || ""
      const errors = checkSpelling(text)
      setSpellcheckErrors((prev) => new Map(prev).set(editingSegmentId, errors))
    }
  }, [editingSegmentId, editedTexts, segments])

  // Audio Player Handlers
  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time)
  }, [])

  const handleSpeedChange = useCallback((speed: number) => {
    setPlaybackSpeed(speed)
  }, [])

  const handleDownload = useCallback(() => {
    console.log("Downloading audio...")
  }, [])

  // Transcript Handlers
  const handleCopyRaw = useCallback(() => {
    const rawText = segments.map((s) => `[${s.time}] Speaker ${s.speaker}: ${s.rawText}`).join("\n\n")
    navigator.clipboard.writeText(rawText)
  }, [segments])

  const handleCopyClean = useCallback(() => {
    const cleanText = segments.map((s) => `[${s.time}] Speaker ${s.speaker}: ${s.cleanedText}`).join("\n\n")
    navigator.clipboard.writeText(cleanText)
  }, [segments])

  const handleDownloadRaw = useCallback(() => {
    console.log("Downloading raw transcript...")
  }, [])

  const handleDownloadClean = useCallback(() => {
    console.log("Downloading clean transcript...")
  }, [])

  // Segment Handlers
  const handleRevertSegment = useCallback(
    (segmentId: string) => {
      const segment = segments.find((s) => s.id === segmentId)
      if (segment) {
        setRevertedSegments((prev) => new Map(prev).set(segmentId, segment.cleanedText))
        setSegments((prev) => prev.map((seg) => (seg.id === segmentId ? { ...seg, cleanedText: seg.rawText } : seg)))
      }
    },
    [segments],
  )

  const handleUndoRevert = useCallback((segmentId: string) => {
    setRevertedSegments((prev) => {
      const originalCleanedText = prev.get(segmentId)
      if (originalCleanedText) {
        setSegments((prevSegs) =>
          prevSegs.map((seg) => (seg.id === segmentId ? { ...seg, cleanedText: originalCleanedText } : seg)),
        )
      }
      const newMap = new Map(prev)
      newMap.delete(segmentId)
      return newMap
    })
  }, [])

  const handleSaveSegment = useCallback(
    (segmentId: string) => {
      const newText = editedTexts.get(segmentId)
      if (newText !== undefined) {
        setSegments((prev) => prev.map((seg) => (seg.id === segmentId ? { ...seg, cleanedText: newText } : seg)))
      }
      setEditingSegmentId(null)
      setEditedTexts((prev) => {
        const newMap = new Map(prev)
        newMap.delete(segmentId)
        return newMap
      })
      setRevertedSegments((prev) => {
        const newMap = new Map(prev)
        newMap.delete(segmentId)
        return newMap
      })
    },
    [editedTexts],
  )

  const handleSegmentEditStart = useCallback(
    (segmentId: string) => {
      const segment = segments.find((s) => s.id === segmentId)
      if (segment) {
        setEditingSegmentId(segmentId)
        if (!editedTexts.has(segmentId)) {
          setEditedTexts((prev) => new Map(prev).set(segmentId, segment.cleanedText))
        }
      }
    },
    [segments, editedTexts],
  )

  const handleSegmentEditCancel = useCallback((segmentId: string) => {
    setEditingSegmentId(null)
    setEditedTexts((prev) => {
      const newMap = new Map(prev)
      newMap.delete(segmentId)
      return newMap
    })
    setActiveSuggestion(null)
  }, [])

  const handleTextChange = useCallback((segmentId: string, text: string) => {
    setEditedTexts((prev) => new Map(prev).set(segmentId, text))
  }, [])

  const handleWordClick = useCallback((segmentId: string, e: React.MouseEvent, error: SpellcheckError) => {
    e.stopPropagation()
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setActiveSuggestion({
      segmentId,
      word: error.word,
      position: { x: rect.left, y: rect.bottom + 5 },
      suggestions: error.suggestions,
    })
  }, [])

  const handleSuggestionSelect = useCallback(
    (suggestion: string) => {
      if (!activeSuggestion) return

      const segmentId = activeSuggestion.segmentId
      const currentText = editedTexts.get(segmentId) || ""
      const errors = spellcheckErrors.get(segmentId) || []
      const error = errors.find((e) => e.word === activeSuggestion.word)

      if (error) {
        const newText = currentText.substring(0, error.start) + suggestion + currentText.substring(error.end)
        setEditedTexts((prev) => new Map(prev).set(segmentId, newText))
      }
      setActiveSuggestion(null)
    },
    [activeSuggestion, editedTexts, spellcheckErrors],
  )

  const handleCloseSuggestions = useCallback(() => {
    setActiveSuggestion(null)
  }, [])

  const handleUpdateAllSegments = useCallback(() => {
    editedTexts.forEach((text, segmentId) => {
      setSegments((prev) => prev.map((seg) => (seg.id === segmentId ? { ...seg, cleanedText: text } : seg)))
    })
    setEditingSegmentId(null)
    setEditedTexts(new Map())
  }, [editedTexts])

  const handleToggleDiff = useCallback(() => {
    setShowDiff((prev) => !prev)
  }, [])

  const handleToggleSpeedMenu = useCallback(() => {
    setShowSpeedMenu((prev) => !prev)
  }, [])

  const handleToggleAnalysisMenu = useCallback(() => {
    setShowAnalysisMenu((prev) => !prev)
  }, [])

  // Upload Handlers
  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file)
  }, [])

  const handleSpeakerCountChange = useCallback((count: number) => {
    setSelectedSpeakerCount(count)
  }, [])

  const handleTranscribeClick = useCallback(() => {
    if (!selectedFile) return
    setIsUploading(true)
    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setIsUploading(false)
        setUiState("complete")
      }
    }, 200)
  }, [selectedFile])

  // Feedback Handlers
  const handleRatingChange = useCallback((newRating: number) => {
    setRating(newRating)
  }, [])

  const handleFeedbackChange = useCallback((text: string) => {
    setFeedback(text)
  }, [])

  const handleFeedbackSubmit = useCallback(() => {
    console.log("Feedback submitted:", { rating, feedback })
    setRating(0)
    setFeedback("")
  }, [rating, feedback])

  // Waitlist Handlers
  const handleWaitlistClick = useCallback(() => {
    setWaitlistType("extended_usage")
    setWaitlistState("form")
  }, [])

  const handleWaitlistEmailChange = useCallback((email: string) => {
    setWaitlistEmail(email)
  }, [])

  const handleWaitlistSubmit = useCallback(() => {
    // Simulate API call
    console.log("Waitlist submission:", { email: waitlistEmail, type: waitlistType })
    // Generate mock referral code
    const mockReferralCode = `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    setWaitlistReferralCode(mockReferralCode)
    setWaitlistState("success")
  }, [waitlistEmail, waitlistType])

  const handleWaitlistClose = useCallback(() => {
    setWaitlistState("hidden")
    setWaitlistEmail("")
    setWaitlistReferralCode("")
  }, [])

  const handleWaitlistCopyCode = useCallback(() => {
    navigator.clipboard.writeText(waitlistReferralCode)
  }, [waitlistReferralCode])

  const handleWaitlistCopyLink = useCallback(() => {
    const referralLink = `https://eversaid.com?ref=${waitlistReferralCode}`
    navigator.clipboard.writeText(referralLink)
  }, [waitlistReferralCode])

  const handleHistorySelect = useCallback((id: string) => {
    console.log("Selected history entry:", id)
  }, [])

  useEffect(() => {
    const syncSegmentHeights = () => {
      if (!rawScrollRef.current || !cleanedScrollRef.current) return

      const rawSegments = rawScrollRef.current.querySelectorAll("[data-segment-id]")
      const cleanedSegments = cleanedScrollRef.current.querySelectorAll("[data-segment-id]")

      rawSegments.forEach((rawEl) => {
        const segmentId = rawEl.getAttribute("data-segment-id")
        const cleanedEl = Array.from(cleanedSegments).find((el) => el.getAttribute("data-segment-id") === segmentId)

        if (cleanedEl && rawEl instanceof HTMLElement && cleanedEl instanceof HTMLElement) {
          // Reset heights first
          rawEl.style.minHeight = ""
          cleanedEl.style.minHeight = ""

          // Get natural heights
          const rawHeight = rawEl.offsetHeight
          const cleanedHeight = cleanedEl.offsetHeight

          // Set both to the max height
          const maxHeight = Math.max(rawHeight, cleanedHeight)
          rawEl.style.minHeight = `${maxHeight}px`
          cleanedEl.style.minHeight = `${maxHeight}px`
        }
      })
    }

    // Sync on mount and whenever showDiff changes (affects cleaned segment heights)
    syncSegmentHeights()

    // Re-sync after a short delay to account for dynamic content loading
    const timer = setTimeout(syncSegmentHeights, 100)

    return () => clearTimeout(timer)
  }, [showDiff, segments])

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FEFEFF_0%,#F8FAFC_100%)]">
      <DemoNavigation currentPage="demo" />

      {/* Page Header */}
      <div className="bg-[linear-gradient(180deg,white_0%,#F8FAFC_100%)] border-b border-[#E2E8F0] px-8 md:px-12 py-8">
        <div className="max-w-[1400px] mx-auto flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-[28px] font-extrabold text-[#0F172A] tracking-[-0.02em] mb-1.5">Try eversaid</h1>
            <p className="text-[15px] text-[#64748B]">
              Upload audio or record directly. See the AI cleanup difference in seconds.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B]">
              <span className="font-bold text-[#0F172A]">3/5</span> hourly
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] text-[#64748B]">
              <span className="font-bold text-[#0F172A]">15/20</span> daily
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {uiState === "empty" && (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
            <UploadZone
              selectedSpeakerCount={selectedSpeakerCount}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              hasFile={!!selectedFile}
              onFileSelect={handleFileSelect}
              onSpeakerCountChange={handleSpeakerCountChange}
              onTranscribeClick={handleTranscribeClick}
            />
            <div className="flex flex-col gap-5">
              <EntryHistoryCard
                entries={historyEntries}
                activeId={null}
                isEmpty={true}
                onSelect={handleHistorySelect}
              />
              <FeaturesHint />
            </div>
          </div>
        )}

        {uiState === "complete" && (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
            <div className="flex flex-col gap-6">
              <AudioPlayer
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                playbackSpeed={playbackSpeed}
                showSpeedMenu={showSpeedMenu}
                onPlayPause={handlePlayPause}
                onSeek={handleSeek}
                onSpeedChange={handleSpeedChange}
                onToggleSpeedMenu={handleToggleSpeedMenu}
                onDownload={handleDownload}
              />

              {/* Transcript Section */}
              <div className="max-w-[1400px] mx-auto bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden mt-8">
                <TranscriptHeader
                  onCopyRaw={handleCopyRaw}
                  onCopyClean={handleCopyClean}
                  onDownloadRaw={handleDownloadRaw}
                  onDownloadClean={handleDownloadClean}
                  showDiff={showDiff}
                  onToggleDiff={handleToggleDiff}
                />

                {/* Transcript Content */}
                <div className="grid grid-cols-2 h-[600px] bg-white">
                  <RawSegmentList ref={rawScrollRef} segments={segments} onScroll={handleRawScroll} />
                  <EditableSegmentList
                    ref={cleanedScrollRef}
                    segments={segments}
                    activeSegmentId={activeSegmentId}
                    editingSegmentId={editingSegmentId}
                    editedTexts={editedTexts}
                    revertedSegments={revertedSegments}
                    spellcheckErrors={spellcheckErrors}
                    showDiff={showDiff}
                    activeSuggestion={activeSuggestion}
                    onRevert={handleRevertSegment}
                    onUndoRevert={handleUndoRevert}
                    onSave={handleSaveSegment}
                    onEditStart={handleSegmentEditStart}
                    onEditCancel={handleSegmentEditCancel}
                    onTextChange={handleTextChange}
                    onWordClick={handleWordClick}
                    onSuggestionSelect={handleSuggestionSelect}
                    onCloseSuggestions={handleCloseSuggestions}
                    onUpdateAll={handleUpdateAllSegments}
                    onToggleDiff={handleToggleDiff}
                    editingCount={editedTexts.size}
                    onScroll={handleCleanedScroll}
                  />
                </div>
              </div>

              <AnalysisSection
                analysisType={analysisType}
                summary={analysisData.summary}
                topics={analysisData.topics}
                keyPoints={analysisData.keyPoints}
                showAnalysisMenu={showAnalysisMenu}
                onChangeAnalysisType={setAnalysisType}
                onToggleAnalysisMenu={handleToggleAnalysisMenu}
              />
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-5">
              <EntryHistoryCard
                entries={historyEntries}
                activeId="entry-1"
                isEmpty={false}
                onSelect={handleHistorySelect}
              />

              <FeedbackCard
                rating={rating}
                feedback={feedback}
                onRatingChange={handleRatingChange}
                onFeedbackChange={handleFeedbackChange}
                onSubmit={handleFeedbackSubmit}
              />

              <WaitlistCTA onCtaClick={handleWaitlistClick} />
            </div>
          </div>
        )}
      </main>

      <DemoFooter />

      {/* Waitlist Modal */}
      <WaitlistFlow
        state={waitlistState}
        type={waitlistType}
        email={waitlistEmail}
        referralCode={waitlistReferralCode}
        onEmailChange={handleWaitlistEmailChange}
        onSubmit={handleWaitlistSubmit}
        onClose={handleWaitlistClose}
        onCopyCode={handleWaitlistCopyCode}
        onCopyLink={handleWaitlistCopyLink}
      />
    </div>
  )
}
