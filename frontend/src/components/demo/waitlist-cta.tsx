"use client"

export interface WaitlistCTAProps {
  title?: string
  description?: string
  ctaText?: string
  onCtaClick?: () => void
}

export function WaitlistCTA({
  title = "Need more?",
  description = "Get higher limits and full encryption with an account.",
  ctaText = "Join Waitlist",
  onCtaClick,
}: WaitlistCTAProps) {
  return (
    <div className="bg-[linear-gradient(135deg,#0F172A_0%,#1E3A5F_100%)] rounded-2xl p-6 text-center">
      <h3 className="text-base font-bold text-white mb-2">{title}</h3>
      <p className="text-[13px] text-white/70 mb-4 leading-[1.5]">{description}</p>
      <button
        onClick={onCtaClick}
        className="inline-block px-6 py-3 bg-[linear-gradient(135deg,#38BDF8_0%,#A855F7_100%)] text-white text-sm font-bold rounded-[10px] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(56,189,248,0.4)] transition-all"
      >
        {ctaText}
      </button>
    </div>
  )
}
