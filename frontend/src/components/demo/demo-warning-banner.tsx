"use client"

import { TriangleAlert } from "lucide-react"
import { useTranslations } from "next-intl"

export function DemoWarningBanner() {
  const t = useTranslations("demo")

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4 flex items-start gap-3">
      <TriangleAlert className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-amber-800">{t("warning")}</p>
    </div>
  )
}
