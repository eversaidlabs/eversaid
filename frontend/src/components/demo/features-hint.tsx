import { Check } from "lucide-react"
import { useTranslations } from "next-intl"

export function FeaturesHint() {
  const t = useTranslations("demo.featuresHint")

  const featureKeys = [
    "sideBySide",
    "speakerLabels",
    "aiCleanup",
    "audioLinked",
    "analysis",
  ] as const

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
      <h4 className="text-[13px] font-bold text-[#38BDF8] uppercase tracking-[1px] mb-4">{t("title")}</h4>
      <div className="space-y-3">
        {featureKeys.map((key) => (
          <div key={key} className="flex items-center gap-3 text-[13px] text-[#64748B]">
            <Check className="w-4 h-4 stroke-[#10B981] flex-shrink-0" />
            {t(key)}
          </div>
        ))}
      </div>
    </div>
  )
}
