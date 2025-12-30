"use client"

import { Sparkles } from "lucide-react"

export interface FeedbackCardProps {
  rating: number
  feedback: string
  onRatingChange: (rating: number) => void
  onFeedbackChange: (text: string) => void
  onSubmit: () => void
}

export function FeedbackCard({ rating, feedback, onRatingChange, onFeedbackChange, onSubmit }: FeedbackCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
      <h3 className="text-sm font-semibold text-[#0F172A] mb-3">How was the quality?</h3>
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRatingChange(star)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              rating >= star ? "bg-[#FEF3C7]" : "bg-[#F1F5F9] hover:bg-[#FEF3C7]"
            }`}
          >
            <Sparkles className={`w-[18px] h-[18px] ${rating >= star ? "fill-[#F59E0B]" : "fill-[#CBD5E1]"}`} />
          </button>
        ))}
      </div>
      {rating > 0 && rating <= 3 && (
        <>
          <textarea
            placeholder="What went wrong? Your feedback helps us improve."
            value={feedback}
            onChange={(e) => onFeedbackChange(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#38BDF8] focus:outline-none rounded-[10px] text-[13px] resize-none mb-3 transition-colors"
            rows={3}
          />
          <button
            onClick={onSubmit}
            className="w-full py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-[13px] font-semibold rounded-lg transition-colors"
          >
            Submit Feedback
          </button>
        </>
      )}
    </div>
  )
}
