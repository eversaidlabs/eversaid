"use client"

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

export function FeedbackCard({ rating, feedback, onRatingChange, onFeedbackChange, onSubmit, isLoading, isSubmitting, isSubmitted, hasExisting, disabled }: FeedbackCardProps) {
  const t = useTranslations('demo.feedback')
  const isDisabled = disabled || isSubmitted

  // Show textarea for all ratings once selected
  const showTextArea = !isSubmitted && rating > 0
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
            className="w-full px-3 py-2.5 bg-secondary border border-border focus:border-primary focus:outline-none rounded-[10px] text-[13px] resize-none mb-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            rows={3}
          />
          <button
            onClick={onSubmit}
            disabled={isSubmitting || isDisabled}
            className="w-full py-2.5 bg-primary hover:bg-primary text-primary-foreground text-[13px] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('submitting') : hasExisting ? t('update') : t('submit')}
          </button>
        </>
      )}
    </div>
  )
}
