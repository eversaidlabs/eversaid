"use client"

import Link from "next/link"
import { Shield, Play } from "lucide-react"
import { useState, useCallback } from "react"
import { WaitlistFlow } from "@/components/waitlist/waitlist-flow"

export default function HomePage() {
  const [waitlistState, setWaitlistState] = useState<"hidden" | "toast" | "form" | "success">("hidden")
  const [waitlistType, setWaitlistType] = useState<"extended_usage" | "api_access">("extended_usage")
  const [waitlistEmail, setWaitlistEmail] = useState("")
  const [waitlistReferralCode, setWaitlistReferralCode] = useState("")

  const handleWaitlistClick = useCallback((type: "extended_usage" | "api_access") => {
    setWaitlistType(type)
    setWaitlistState("form")
  }, [])

  const handleWaitlistEmailChange = useCallback((email: string) => {
    setWaitlistEmail(email)
  }, [])

  const handleWaitlistSubmit = useCallback(() => {
    console.log("Waitlist submission:", { email: waitlistEmail, type: waitlistType })
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

  return (
    <main>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 md:px-16 py-5 bg-transparent">
        <Link href="/" className="flex items-center gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 44" className="h-[39px] w-auto">
            <g transform="translate(0, 0)">
              {/* Messy lines (left) */}
              <line
                x1="0"
                y1="10"
                x2="20"
                y2="12"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                x1="0"
                y1="22"
                x2="18"
                y2="20"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                x1="0"
                y1="32"
                x2="22"
                y2="34"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Arrow */}
              <path d="M25 22 L38 22" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
              <path
                d="M34 16 L40 22 L34 28"
                stroke="#38BDF8"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Clean lines (right) */}
              <line x1="45" y1="10" x2="65" y2="10" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <line x1="45" y1="22" x2="65" y2="22" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <line x1="45" y1="34" x2="65" y2="34" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </g>
          </svg>
          <span className="font-[family-name:var(--font-comfortaa)] font-bold text-[27px] text-white tracking-[0.01em]">
            eversaid
          </span>
        </Link>
        <div className="hidden md:flex gap-10 items-center">
          <Link href="#features" className="text-white/80 hover:text-white text-[15px] font-medium transition-colors">
            Features
          </Link>
          <Link href="#use-cases" className="text-white/80 hover:text-white text-[15px] font-medium transition-colors">
            Use Cases
          </Link>
          <Link
            href="#how-it-works"
            className="text-white/80 hover:text-white text-[15px] font-medium transition-colors"
          >
            How It Works
          </Link>
          <Link href="/api-docs" className="text-white/80 hover:text-white text-[15px] font-medium transition-colors">
            API Docs
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-8 md:px-16 pt-40 pb-[120px] overflow-hidden bg-[linear-gradient(135deg,#0F172A_0%,#1E3A5F_50%,#0F172A_100%)]">
        {/* Background gradients */}
        <div className="absolute top-[-50%] right-[-20%] w-[80%] h-[200%] bg-[radial-gradient(ellipse,rgba(56,189,248,0.15)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-[-50%] left-[-20%] w-[60%] h-[150%] bg-[radial-gradient(ellipse,rgba(168,85,247,0.1)_0%,transparent_60%)] pointer-events-none" />

        <div className="relative z-10 max-w-[900px] mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-[64px] font-extrabold text-white mb-6 leading-[1.05] tracking-[-0.03em]">
            Smart transcription.
            <br />
            <span className="bg-[linear-gradient(135deg,#38BDF8_0%,#A855F7_100%)] bg-clip-text text-transparent">
              AI listens. You decide.
            </span>
          </h1>
          <p className="text-lg md:text-[22px] text-white/75 mb-12 max-w-[650px] mx-auto leading-relaxed font-normal">
            AI-powered cleanup you can review, refine, and trust. See every edit. Verify against the original audio.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/demo"
              className="bg-[linear-gradient(135deg,#38BDF8_0%,#A855F7_100%)] text-white px-10 py-[18px] rounded-xl font-bold text-[17px] transition-all hover:-translate-y-0.5 shadow-[0_8px_32px_rgba(56,189,248,0.3)] hover:shadow-[0_12px_40px_rgba(56,189,248,0.4)]"
            >
              Try Free Demo
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-white/60">
            <Shield className="w-4 h-4 opacity-70" />
            No sign-up required · Free demo available
          </div>
        </div>
      </section>

      {/* Proof Visual Section */}
      <section className="px-8 md:px-16 py-20 bg-[#F8FAFC]">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center text-[13px] font-semibold text-[#38BDF8] uppercase tracking-[2px] mb-4">
            See the Difference
          </div>
          <h2 className="text-center text-[32px] md:text-[40px] font-extrabold text-[#0F172A] mb-10 tracking-[-0.02em]">
            Every edit visible. Every word verifiable.
          </h2>

          <div className="bg-white rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.08)] border border-[#E2E8F0]">
            {/* Mockup Header */}
            <div className="bg-[linear-gradient(135deg,#0F172A_0%,#1E3A5F_100%)] text-white px-6 py-4 flex justify-between items-center text-sm">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
              </div>
              <span className="flex items-center gap-2">
                <Play className="w-4 h-4" /> 0:00 / 2:34
              </span>
            </div>

            {/* Mockup Content */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Raw Transcript */}
              <div className="p-8 border-r border-[#E2E8F0]">
                <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-6">Raw Transcript</div>
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-[#F8FAFC] border-l-4 border-[#38BDF8]">
                    <div className="text-xs font-bold text-[#0284C7] mb-2.5 flex items-center gap-2">
                      Speaker 1 · 0:00
                    </div>
                    <div className="text-[15px] leading-[1.7]">
                      Uh so basically what we're trying to do here is um figure out the best approach for the the
                      project timeline.
                    </div>
                  </div>
                  <div className="p-5 rounded-xl bg-[#F8FAFC] border-l-4 border-[#A855F7]">
                    <div className="text-xs font-bold text-[#7C3AED] mb-2.5 flex items-center gap-2">
                      Speaker 2 · 0:08
                    </div>
                    <div className="text-[15px] leading-[1.7]">
                      Yeah I think we should we should probably start with the the research phase first you know.
                    </div>
                  </div>
                </div>
              </div>

              {/* Cleaned Transcript */}
              <div className="p-8 bg-[linear-gradient(180deg,rgba(56,189,248,0.03)_0%,transparent_100%)]">
                <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-6">
                  Cleaned Transcript
                </div>
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-[#F8FAFC] border-l-4 border-[#38BDF8]">
                    <div className="text-xs font-bold text-[#0284C7] mb-2.5 flex items-center gap-2">
                      Speaker 1 · 0:00
                    </div>
                    <div className="text-[15px] leading-[1.7]">
                      <span className="bg-[#FEE2E2] text-[#991B1B] line-through px-1.5 py-0.5 rounded opacity-70">
                        Uh so
                      </span>{" "}
                      <span className="bg-[linear-gradient(135deg,#DCFCE7_0%,#BBF7D0_100%)] text-[#166534] px-1.5 py-0.5 rounded font-medium">
                        So
                      </span>{" "}
                      basically what we're trying to do here is{" "}
                      <span className="bg-[#FEE2E2] text-[#991B1B] line-through px-1.5 py-0.5 rounded opacity-70">
                        um
                      </span>{" "}
                      figure out the best approach for{" "}
                      <span className="bg-[#FEE2E2] text-[#991B1B] line-through px-1.5 py-0.5 rounded opacity-70">
                        the the
                      </span>{" "}
                      <span className="bg-[linear-gradient(135deg,#DCFCE7_0%,#BBF7D0_100%)] text-[#166534] px-1.5 py-0.5 rounded font-medium">
                        the
                      </span>{" "}
                      project timeline.
                    </div>
                  </div>
                  <div className="p-5 rounded-xl bg-[#F8FAFC] border-l-4 border-[#A855F7]">
                    <div className="text-xs font-bold text-[#7C3AED] mb-2.5 flex items-center gap-2">
                      Speaker 2 · 0:08
                    </div>
                    <div className="text-[15px] leading-[1.7]">
                      <span className="bg-[linear-gradient(135deg,#DCFCE7_0%,#BBF7D0_100%)] text-[#166534] px-1.5 py-0.5 rounded font-medium">
                        Yes,
                      </span>{" "}
                      <span className="bg-[#FEE2E2] text-[#991B1B] line-through px-1.5 py-0.5 rounded opacity-70">
                        Yeah
                      </span>{" "}
                      I think we should{" "}
                      <span className="bg-[#FEE2E2] text-[#991B1B] line-through px-1.5 py-0.5 rounded opacity-70">
                        we should
                      </span>{" "}
                      probably start with{" "}
                      <span className="bg-[#FEE2E2] text-[#991B1B] line-through px-1.5 py-0.5 rounded opacity-70">
                        the the
                      </span>{" "}
                      <span className="bg-[linear-gradient(135deg,#DCFCE7_0%,#BBF7D0_100%)] text-[#166534] px-1.5 py-0.5 rounded font-medium">
                        the
                      </span>{" "}
                      research phase first
                      <span className="bg-[#FEE2E2] text-[#991B1B] line-through px-1.5 py-0.5 rounded opacity-70">
                        {" "}
                        you know
                      </span>
                      .
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Insights Section */}
      <section className="px-8 md:px-16 py-20 max-w-[1200px] mx-auto" id="insights">
        <div className="text-center text-[13px] font-semibold text-[#38BDF8] uppercase tracking-[2px] mb-4">
          Analysis
        </div>
        <h2 className="text-center text-[32px] md:text-[40px] font-extrabold text-[#0F172A] mb-4 tracking-[-0.02em]">
          AI-Powered Insights
        </h2>
        <p className="text-center text-lg text-[#64748B] mb-12 max-w-[600px] mx-auto">
          Get more than just text. Choose the analysis that fits your workflow.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-[linear-gradient(135deg,rgba(56,189,248,0.1)_0%,rgba(168,85,247,0.1)_100%)] border border-[rgba(56,189,248,0.3)] rounded-[20px] p-8 text-center transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <div className="w-[84px] h-[84px] bg-white rounded-[20px] flex items-center justify-center text-[40px] mx-auto mb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
              📋
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-3">Conversation Summary</h3>
            <p className="text-[15px] text-[#64748B] leading-relaxed">
              Topics, key points, and a concise overview of the entire conversation.
            </p>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[20px] p-8 text-center transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <div className="w-[84px] h-[84px] bg-white rounded-[20px] flex items-center justify-center text-[40px] mx-auto mb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
              ✅
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-3">Action Items & Decisions</h3>
            <p className="text-[15px] text-[#64748B] leading-relaxed">
              Tasks to complete, decisions made, and follow-ups extracted automatically.
            </p>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[20px] p-8 text-center transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <div className="w-[84px] h-[84px] bg-white rounded-[20px] flex items-center justify-center text-[40px] mx-auto mb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
              💭
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-3">Reflection & Insights</h3>
            <p className="text-[15px] text-[#64748B] leading-relaxed">
              Themes, underlying questions, and prompts for deeper self-reflection.
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-[#94A3B8] mt-8">
          Coming soon: Custom analysis profiles tailored to your specific needs
        </p>
      </section>

      {/* Features Section */}
      <section className="px-8 md:px-16 py-20 max-w-[1200px] mx-auto" id="features">
        <div className="text-center text-[13px] font-semibold text-[#38BDF8] uppercase tracking-[2px] mb-4">
          Features
        </div>
        <h2 className="text-center text-[32px] md:text-[40px] font-extrabold text-[#0F172A] mb-4 tracking-[-0.02em]">
          Why Choose eversaid?
        </h2>
        <p className="text-center text-lg text-[#64748B] mb-12 max-w-[600px] mx-auto">
          Built for professionals who need accuracy and accountability
        </p>

        {/* Verify Every Word */}
        <div className="mb-12">
          <div className="text-sm font-bold text-[#38BDF8] uppercase tracking-wider mb-6 text-center">
            Verify Every Word
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[20px] p-7 text-center transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
              <div className="w-[72px] h-[72px] bg-white rounded-[20px] flex items-center justify-center text-[32px] mx-auto mb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                🔍
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-3">Side-by-Side</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">See exactly what AI changed.</p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[20px] p-7 text-center transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
              <div className="w-[72px] h-[72px] bg-white rounded-[20px] flex items-center justify-center text-[32px] mx-auto mb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                👥
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-3">Speaker Labels</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">Color-coded speaker attribution.</p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[20px] p-7 text-center transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
              <div className="w-[72px] h-[72px] bg-white rounded-[20px] flex items-center justify-center text-[32px] mx-auto mb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                🎧
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-3">Audio-Linked</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">Click to jump to audio.</p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[20px] p-7 text-center transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
              <div className="w-[72px] h-[72px] bg-white rounded-[20px] flex items-center justify-center text-[32px] mx-auto mb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                ✏️
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-3">Edit & Revert</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">Edit text with spellcheck.</p>
            </div>
          </div>
        </div>

        {/* Your Data, Protected */}
        <div className="mb-6">
          <div className="text-sm font-bold text-[#38BDF8] uppercase tracking-wider mb-6 text-center">
            Your Data, Protected
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[20px] p-7 text-center transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
              <div className="w-[72px] h-[72px] bg-white rounded-[20px] flex items-center justify-center text-[32px] mx-auto mb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                🇪🇺
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-3">GDPR</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">European privacy standards.</p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[20px] p-7 text-center transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
              <div className="w-[72px] h-[72px] bg-white rounded-[20px] flex items-center justify-center text-[32px] mx-auto mb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                🔒
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-3">Encrypted</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">In transit and at rest.</p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[20px] p-7 text-center transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
              <div className="w-[72px] h-[72px] bg-white rounded-[20px] flex items-center justify-center text-[32px] mx-auto mb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                🛡️
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-3">Isolated</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">Your data stays private.</p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[20px] p-7 text-center transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
              <div className="w-[72px] h-[72px] bg-white rounded-[20px] flex items-center justify-center text-[32px] mx-auto mb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                🚫
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-3">No Training</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">Never used for AI training.</p>
            </div>
          </div>
          <p className="text-center text-[13px] text-[#94A3B8] mt-5 italic">
            Free demo uses secure connection. Full encryption & GDPR compliance included with accounts.
          </p>
        </div>

        <p className="text-center text-sm text-[#10B981] font-medium mt-6">
          ✓ Slovenian spellcheck included. More languages coming soon.
        </p>
      </section>

      {/* Use Cases Section */}
      <section className="px-8 md:px-16 py-20 max-w-[1200px] mx-auto" id="use-cases">
        <div className="text-center text-[13px] font-semibold text-[#38BDF8] uppercase tracking-[2px] mb-4">
          Use Cases
        </div>
        <h2 className="text-center text-[32px] md:text-[40px] font-extrabold text-[#0F172A] mb-4 tracking-[-0.02em]">
          Who It's For
        </h2>
        <p className="text-center text-lg text-[#64748B] mb-12 max-w-[600px] mx-auto">
          Professionals who need accurate, verifiable transcripts
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-8 text-center transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <div className="w-[100px] h-[100px] bg-[linear-gradient(135deg,rgba(56,189,248,0.1)_0%,rgba(168,85,247,0.1)_100%)] rounded-[24px] flex items-center justify-center text-[44px] mx-auto mb-5">
              🧠
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-3">Therapists & Coaches</h3>
            <p className="text-sm text-[#64748B] leading-relaxed">Document sessions with speaker attribution.</p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-8 text-center transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <div className="w-[100px] h-[100px] bg-[linear-gradient(135deg,rgba(56,189,248,0.1)_0%,rgba(168,85,247,0.1)_100%)] rounded-[24px] flex items-center justify-center text-[44px] mx-auto mb-5">
              🎤
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-3">Journalists</h3>
            <p className="text-sm text-[#64748B] leading-relaxed">Transcribe interviews with verifiable quotes.</p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-8 text-center transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <div className="w-[100px] h-[100px] bg-[linear-gradient(135deg,rgba(56,189,248,0.1)_0%,rgba(168,85,247,0.1)_100%)] rounded-[24px] flex items-center justify-center text-[44px] mx-auto mb-5">
              💼
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-3">Meeting Notes</h3>
            <p className="text-sm text-[#64748B] leading-relaxed">Turn recordings into actionable notes.</p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-8 text-center transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <div className="w-[100px] h-[100px] bg-[linear-gradient(135deg,rgba(56,189,248,0.1)_0%,rgba(168,85,247,0.1)_100%)] rounded-[24px] flex items-center justify-center text-[44px] mx-auto mb-5">
              👂
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-3">Accessibility</h3>
            <p className="text-sm text-[#64748B] leading-relaxed">Make audio content accessible as text.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-8 md:px-16 py-20 bg-[#F8FAFC]" id="how-it-works">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center text-[13px] font-semibold text-[#38BDF8] uppercase tracking-[2px] mb-4">
            Process
          </div>
          <h2 className="text-center text-[32px] md:text-[40px] font-extrabold text-[#0F172A] mb-4 tracking-[-0.02em]">
            How It Works
          </h2>
          <p className="text-center text-lg text-[#64748B] mb-12 max-w-[600px] mx-auto">
            From audio to verified transcript in minutes
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="text-center relative">
              <div className="hidden lg:block absolute top-8 right-[-16px] w-8 h-0.5 bg-[linear-gradient(90deg,#38BDF8,#A855F7)] opacity-30" />
              <div className="w-16 h-16 bg-[linear-gradient(135deg,#38BDF8_0%,#A855F7_100%)] text-white rounded-full flex items-center justify-center text-2xl font-extrabold mx-auto mb-5">
                1
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-3">Upload or Record</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Drag-drop an audio file or record directly in browser.
              </p>
            </div>

            <div className="text-center relative">
              <div className="hidden lg:block absolute top-8 right-[-16px] w-8 h-0.5 bg-[linear-gradient(90deg,#38BDF8,#A855F7)] opacity-30" />
              <div className="w-16 h-16 bg-[linear-gradient(135deg,#38BDF8_0%,#A855F7_100%)] text-white rounded-full flex items-center justify-center text-2xl font-extrabold mx-auto mb-5">
                2
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-3">Choose Speakers</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">Select speaker count for accurate diarization.</p>
            </div>

            <div className="text-center relative">
              <div className="hidden lg:block absolute top-8 right-[-16px] w-8 h-0.5 bg-[linear-gradient(90deg,#38BDF8,#A855F7)] opacity-30" />
              <div className="w-16 h-16 bg-[linear-gradient(135deg,#38BDF8_0%,#A855F7_100%)] text-white rounded-full flex items-center justify-center text-2xl font-extrabold mx-auto mb-5">
                3
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-3">Compare & Edit</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Review side-by-side. Edit, revert, verify against audio.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[linear-gradient(135deg,#38BDF8_0%,#A855F7_100%)] text-white rounded-full flex items-center justify-center text-2xl font-extrabold mx-auto mb-5">
                4
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-3">Analyze</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Try different insight profiles on your transcript.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative px-8 md:px-16 py-16 text-center overflow-hidden bg-[linear-gradient(135deg,#0F172A_0%,#1E3A5F_100%)]">
        <div className="absolute top-[-50%] right-[-20%] w-[60%] h-[200%] bg-[radial-gradient(ellipse,rgba(56,189,248,0.1)_0%,transparent_60%)] pointer-events-none" />

        <div className="relative z-10 max-w-[600px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-[-0.02em]">
            Ready to try smarter transcription?
          </h2>
          <p className="text-lg text-white/70 mb-8">No sign-up required. See the difference for yourself.</p>
          <Link
            href="/demo"
            className="inline-block bg-[linear-gradient(135deg,#38BDF8_0%,#A855F7_100%)] text-white px-12 py-5 rounded-xl font-bold text-lg transition-all hover:-translate-y-0.5 shadow-[0_8px_32px_rgba(56,189,248,0.3)] hover:shadow-[0_12px_40px_rgba(56,189,248,0.4)]"
          >
            Try Free Demo
          </Link>
          <div className="mt-6 text-[15px] text-white/60">
            Want full encryption and higher limits?{" "}
            <button
              onClick={() => handleWaitlistClick("extended_usage")}
              className="text-[#38BDF8] hover:text-white font-medium transition-colors"
            >
              Join the waitlist →
            </button>
            <span className="block mt-2 text-[13px] text-white/40">
              Refer friends, earn free credits when they sign up.
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 md:px-16 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-[#E2E8F0]">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <span className="text-sm text-[#64748B]">© 2025 eversaid</span>
          <span className="flex items-center gap-1.5 text-[13px] text-[#94A3B8] px-3 py-1.5 bg-[#F8FAFC] rounded-lg">
            🇸🇮 Built in Slovenia · Independent & bootstrapped
          </span>
        </div>
        <div className="flex gap-8">
          <Link href="#" className="text-sm text-[#64748B] hover:text-[#0F172A] font-medium transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm text-[#64748B] hover:text-[#0F172A] font-medium transition-colors">
            Terms
          </Link>
          <Link href="#" className="text-sm text-[#64748B] hover:text-[#0F172A] font-medium transition-colors">
            Contact
          </Link>
        </div>
      </footer>

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
    </main>
  )
}
