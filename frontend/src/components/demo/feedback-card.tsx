"use client"

import { forwardRef, useState, useImperativeHandle, useRef } from "react"
import { Sparkles } from "lucide-react"
import { useTranslations } from 'next-intl'

export interface FeedbackCardProps {
  rating: number
  feedback: string
  onRatingChange: (rating: number) => void
  onFeedbackChange: (text: string) => void
  onSubmit: () => void
  isLoading?: boolean
  isSubmitting?: boolean
  isSubmitted?: boolean
  hasExisting?: boolean
  disabled?: boolean
}

export interface FeedbackCardRef {
  focusAndHighlight: () => void
}

export const FeedbackCard = forwardRef<FeedbackCardRef, FeedbackCardProps>(function FeedbackCard(
  { rating, feedback, onRatingChange, onFeedbackChange, onSubmit, isLoading, isSubmitting, isSubmitted, hasExisting, disabled },
  ref
) {
  const t = useTranslations('demo.feedback')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isTextareaHighlighted, setIsTextareaHighlighted] = useState(false)
  const [isTextareaForced, setIsTextareaForced] = useState(false)

  useImperativeHandle(ref, () => ({
    focusAndHighlight: () => {
      if (rating === 0) {
        // No rating selected - show textarea and focus it
        setIsTextareaForced(true)
        setTimeout(() => {
          textareaRef.current?.focus()
          setIsTextareaHighlighted(true)
          setTimeout(() => setIsTextareaHighlighted(false), 1500)
        }, 50)
      } else {
        // Rating selected - focus and highlight textarea
        textareaRef.current?.focus()
        setIsTextareaHighlighted(true)
        setTimeout(() => setIsTextareaHighlighted(false), 1500)
      }
    }
  }))
  const isDisabled = disabled || isSubmitted

  // Show textarea when rating selected OR when forced open via "Share feedback"
  const showTextArea = !isSubmitted && (rating > 0 || isTextareaForced)
  // Different placeholder based on rating sentiment
  const placeholder = rating >= 4 ? t('placeholderPositive') : t('placeholder')

  if (isLoading) {
    return (
      <div className="bg-background rounded-2xl border border-border p-5">
        <div className="h-5 w-32 bg-secondary rounded animate-pulse mb-3" />
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="w-8 h-8 bg-secondary rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background rounded-2xl border border-border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3">{t('title')}</h3>
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRatingChange(star)}
            disabled={isDisabled}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              rating >= star ? "bg-amber-100" : "bg-secondary hover:bg-amber-100"
            } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Sparkles className={`w-[18px] h-[18px] ${rating >= star ? "fill-amber-500" : "fill-muted"}`} />
          </button>
        ))}
      </div>
      {isSubmitted && (
        <p className="text-sm text-green-600 font-medium">{t('thanks')}</p>
      )}
      {showTextArea && (
        <>
          <textarea
            ref={textareaRef}
            placeholder={placeholder}
            value={feedback}
            onChange={(e) => onFeedbackChange(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !isSubmitting) {
                e.preventDefault()
                onSubmit()
              }
            }}
            disabled={isDisabled}
            className={`w-full px-3 py-2.5 bg-secondary border focus:border-primary focus:outline-none rounded-[10px] text-[13px] resize-none mb-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isTextareaHighlighted
                ? "border-amber-400 ring-2 ring-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.4)]"
                : "border-border"
            }`}
            rows={3}
          />
          <button
            onClick={onSubmit}
            disabled={isSubmitting || isDisabled || rating === 0}
            className="w-full py-2.5 bg-primary hover:bg-primary text-primary-foreground text-[13px] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('submitting') : hasExisting ? t('update') : t('submit')}
          </button>
        </>
      )}
    </div>
  )
})
