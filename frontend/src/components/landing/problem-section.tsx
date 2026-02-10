"use client"

import { useTranslations } from "next-intl"
import { MotionDiv } from "@/components/motion"
import {
  fadeUp,
  sectionHeader,
  sectionSubtitle,
  staggerContainer,
  staggerItem,
} from "@/lib/animation-variants"

// ─── Workflow Step Component ─────────────────────────────────────────────────

interface WorkflowStepProps {
  number: number
  icon: string
  title: string
  description: string
  painStat?: string
  variant?: "default" | "warning" | "danger"
}

function WorkflowStep({
  number,
  icon,
  title,
  description,
  painStat,
  variant = "default",
}: WorkflowStepProps) {
  const bgColors = {
    default: "bg-white border-[#E2E8F0]",
    warning: "bg-[#FEF3C7] border-[#FCD34D]",
    danger: "bg-[#FEE2E2] border-[#FECACA]",
  }

  const numberBg = {
    default: "bg-gradient-to-br from-[#38BDF8] to-[#A855F7]",
    warning: "bg-gradient-to-br from-[#F59E0B] to-[#D97706]",
    danger: "bg-gradient-to-br from-[#F87171] to-[#DC2626]",
  }

  const titleColors = {
    default: "text-[#0F172A]",
    warning: "text-[#B45309]",
    danger: "text-[#DC2626]",
  }

  return (
    <MotionDiv variants={staggerItem} className="text-center relative z-[1]">
      {/* Icon */}
      <div
        className={`w-[72px] h-[72px] ${bgColors[variant]} border rounded-[18px] flex items-center justify-center text-[32px] mx-auto mb-4 shadow-sm relative`}
      >
        <span
          className={`absolute -top-1.5 -right-1.5 w-6 h-6 ${numberBg[variant]} rounded-full flex items-center justify-center text-white text-xs font-bold`}
        >
          {number}
        </span>
        <span>{icon}</span>
      </div>

      {/* Title */}
      <h4 className={`text-[17px] font-bold ${titleColors[variant]} mb-2`}>{title}</h4>

      {/* Description */}
      <p className="text-sm text-[#64748B] leading-relaxed">{description}</p>

      {/* Pain Stat Badge */}
      {painStat && (
        <div className="inline-flex items-center gap-1.5 bg-[#FEF2F2] text-[#DC2626] text-xs font-semibold px-3 py-1.5 rounded-full mt-3">
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M8 4V8L11 10" />
            <circle cx="8" cy="8" r="6" />
          </svg>
          {painStat}
        </div>
      )}
    </MotionDiv>
  )
}

// ─── Check Icon Component ────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <span className="w-6 h-6 bg-gradient-to-br from-[#38BDF8]/15 to-[#A855F7]/15 rounded-full flex items-center justify-center text-[#38BDF8] shrink-0">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M11.5 4L5.5 10L2.5 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function ProblemSection() {
  const t = useTranslations("landing.problem")

  return (
    <section className="snap-start snap-always min-h-screen flex items-center px-8 md:px-16 py-16 bg-[#F8FAFC]">
      <div className="max-w-[1200px] mx-auto w-full">
        {/* Header */}
        <MotionDiv
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <MotionDiv variants={sectionHeader}>
            <div className="text-[13px] font-semibold text-[#38BDF8] uppercase tracking-[2px] mb-4">
              {t("sectionLabel")}
            </div>
            <h2 className="text-[32px] md:text-[40px] font-extrabold text-[#0F172A] mb-4 tracking-[-0.02em]">
              {t("title")}
            </h2>
          </MotionDiv>
          <MotionDiv variants={sectionSubtitle}>
            <p className="text-lg text-[#64748B] mb-12 max-w-[650px] mx-auto">
              {t("subtitle")}
            </p>
          </MotionDiv>
        </MotionDiv>

        {/* Workflow Steps */}
        <MotionDiv
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {/* Connecting Line (desktop only) */}
          <div className="hidden lg:block absolute top-9 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#38BDF8] via-[#A855F7] to-[#DC2626] opacity-30 z-0" />

          <WorkflowStep
            number={1}
            icon="📝"
            title={t("step1.title")}
            description={t("step1.description")}
          />

          {/* ChatGPT Loop Container */}
          <div className="sm:col-span-2 relative bg-gradient-to-br from-[#F59E0B]/[0.06] to-[#D97706]/[0.06] border border-dashed border-[#F59E0B]/30 rounded-[20px] p-5 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Loop Label */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-xl flex items-center gap-1.5 whitespace-nowrap">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 18c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9" />
              </svg>
              {t("chatgptLoop")}
            </div>

            {/* Arrow between steps (desktop only) */}
            <div className="hidden sm:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#D97706]/40">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                  d="M12 16H20M20 16L17 13M20 16L17 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <WorkflowStep
              number={2}
              icon="📋"
              title={t("step2.title")}
              description={t("step2.description")}
              painStat={t("step2.painStat")}
              variant="warning"
            />
            <WorkflowStep
              number={3}
              icon="💬"
              title={t("step3.title")}
              description={t("step3.description")}
              painStat={t("step3.painStat")}
              variant="warning"
            />
          </div>

          <WorkflowStep
            number={4}
            icon="❓"
            title={t("step4.title")}
            description={t("step4.description")}
            painStat={t("step4.painStat")}
            variant="danger"
          />
        </MotionDiv>

        {/* Value Proposition - Alternative A */}
        <MotionDiv
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="max-w-[900px] mx-auto"
        >
          {/* Stat Highlight */}
          <div className="text-center mb-5">
            <div className="text-[56px] font-extrabold bg-gradient-to-br from-[#F87171] to-[#DC2626] bg-clip-text text-transparent leading-none">
              76%
            </div>
            <p className="text-base text-[#64748B] mt-1.5">{t("stat.text")}</p>
            <p className="text-[11px] text-[#94A3B8] mt-1">{t("stat.source")}</p>
          </div>

          {/* Solution Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-8 text-center">
            <h4 className="text-xl font-bold text-[#0F172A] mb-4">{t("solution.title")}</h4>

            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-4">
              <div className="flex items-center gap-2.5 text-[15px] text-[#64748B]">
                <CheckIcon />
                <span>
                  <strong className="text-[#0F172A]">{t("solution.requirement1.label")}</strong>{" "}
                  {t("solution.requirement1.text")}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-[15px] text-[#64748B]">
                <CheckIcon />
                <span>
                  <strong className="text-[#0F172A]">{t("solution.requirement2.label")}</strong>{" "}
                  {t("solution.requirement2.text")}
                </span>
              </div>
            </div>

            <p className="text-[15px] text-[#64748B]">
              <span className="bg-gradient-to-r from-[#38BDF8] to-[#A855F7] bg-clip-text text-transparent font-bold">
                EverSaid
              </span>{" "}
              {t("solution.tagline")}
            </p>
          </div>
        </MotionDiv>
      </div>
    </section>
  )
}
