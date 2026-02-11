"use client"

import { useTranslations } from "next-intl"
import type { AnalysisFieldValue } from "@/features/transcription/useAnalysis"

const MAX_TAG_LENGTH = 20

/**
 * Humanize a snake_case field name into a readable label
 * e.g., "key_points" -> "Key Points"
 */
function humanizeFieldName(fieldName: string): string {
  return fieldName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export interface AnalysisFieldProps {
  /** Field name (e.g., "summary", "topics", "key_points") */
  fieldName: string
  /** Field value - string or array of strings */
  value: AnalysisFieldValue
}

export function AnalysisField({ fieldName, value }: AnalysisFieldProps) {
  const t = useTranslations('demo.analysis')

  // Get label from translations, fallback to humanized field name
  let label: string
  try {
    label = t(`fields.${fieldName}`)
  } catch {
    label = humanizeFieldName(fieldName)
  }

  // Handle string values - render as paragraph
  if (typeof value === 'string') {
    return (
      <div className="mb-4">
        <h4 className="text-[13px] font-bold text-muted-foreground uppercase tracking-[0.5px] mb-2 mt-4">
          {label}
        </h4>
        <p className="text-[15px] text-foreground leading-[1.7]">{value}</p>
      </div>
    )
  }

  // Handle array values
  const items = value

  // Determine if items should render as tags (short) or bullets (long)
  const allShort = items.every(item => item.length < MAX_TAG_LENGTH)

  if (allShort) {
    // Render as tags
    return (
      <div className="mb-4">
        <h4 className="text-[13px] font-bold text-muted-foreground uppercase tracking-[0.5px] mb-2 mt-4">
          {label}
        </h4>
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-background border border-border rounded-full text-[13px] text-muted-foreground"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    )
  }

  // Render as bullet list
  return (
    <div className="mb-4">
      <h4 className="text-[13px] font-bold text-muted-foreground uppercase tracking-[0.5px] mb-2 mt-4">
        {label}
      </h4>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="relative pl-5 text-sm text-foreground leading-[1.6]">
            <div className="absolute left-0 top-2 w-1.5 h-1.5 bg-[linear-gradient(135deg,var(--color-primary)_0%,#A855F7_100%)] rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
