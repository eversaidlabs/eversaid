"use client"

import { Upload, Check } from "lucide-react"
import { useTranslations } from 'next-intl'
import type { HistoryEntry } from "./types"

export interface EntryHistoryCardProps {
  entries: HistoryEntry[]
  activeId?: string | null
  isEmpty?: boolean
  onSelect?: (id: string) => void
}

export function EntryHistoryCard({
  entries,
  activeId = null,
  isEmpty = entries.length === 0,
  onSelect,
}: EntryHistoryCardProps) {
  const t = useTranslations('demo.history')

  return (
    <div className="bg-background rounded-2xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex justify-between items-center">
        <span className="text-sm font-bold text-foreground">{t('title')}</span>
      </div>

      {isEmpty ? (
        <div className="p-10 text-center">
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-7 h-7 stroke-muted-foreground" />
          </div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-1.5">{t('empty')}</h4>
          <p className="text-[13px] text-muted-foreground">{t('emptySubtitle')}</p>
        </div>
      ) : (
        <div className="p-2 max-h-[300px] overflow-y-auto">
          {entries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => onSelect?.(entry.id)}
              className={`flex items-center gap-3 p-3 rounded-[10px] cursor-pointer transition-all ${
                activeId === entry.id
                  ? "bg-[linear-gradient(135deg,rgba(var(--color-primary),0.1)_0%,rgba(168,85,247,0.1)_100%)]"
                  : "hover:bg-secondary"
              }`}
            >
              <div className="w-9 h-9 bg-[linear-gradient(135deg,var(--color-primary)_0%,#A855F7_100%)] rounded-lg flex items-center justify-center">
                <Upload className="w-[18px] h-[18px] stroke-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-foreground truncate">{entry.filename}</div>
                <div className="text-[11px] text-muted-foreground flex gap-2">
                  <span>{entry.duration}</span>
                  <span>·</span>
                  <span className="capitalize">{entry.status}</span>
                </div>
              </div>
              {entry.status === "complete" && (
                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-emerald-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="px-4 py-3 border-t border-border text-[11px] text-muted-foreground text-center">
        {t('retention')}
      </div>
    </div>
  )
}
