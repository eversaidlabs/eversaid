"use client"

import type React from "react"
import { useTranslations } from 'next-intl'

export interface UploadZoneProps {
  selectedSpeakerCount: number
  isUploading: boolean
  uploadProgress: number
  hasFile: boolean
  onFileSelect: (file: File) => void
  onSpeakerCountChange: (count: number) => void
  onTranscribeClick: () => void
}

export function UploadZone({
  selectedSpeakerCount,
  isUploading,
  uploadProgress,
  hasFile,
  onFileSelect,
  onSpeakerCountChange,
  onTranscribeClick,
}: UploadZoneProps) {
  const t = useTranslations('demo.upload')
  const tCommon = useTranslations('common')

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) onFileSelect(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }

  return (
    <div className="bg-white rounded-[20px] border border-[#E2E8F0] overflow-hidden">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="p-6 m-6 border-2 border-dashed border-[#E2E8F0] rounded-2xl text-center hover:border-[#38BDF8] hover:bg-[rgba(56,189,248,0.02)] transition-all cursor-pointer"
      >
        <div className="w-20 h-20 bg-[linear-gradient(135deg,rgba(56,189,248,0.1)_0%,rgba(168,85,247,0.1)_100%)] rounded-[24px] flex items-center justify-center mx-auto mb-6">
          <svg className="w-9 h-9 stroke-[#38BDF8]" viewBox="0 0 24 24" fill="none" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <h3 className="text-[20px] font-bold text-[#0F172A] mb-2">{t('dropTitle')}</h3>
        <p className="text-[15px] text-[#64748B] mb-5">{t('formats')}</p>
        <label className="px-6 py-3 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-sm font-semibold rounded-[10px] transition-colors cursor-pointer inline-block">
          {t('browse')}
          <input type="file" accept="audio/*" onChange={handleFileInput} className="hidden" />
        </label>
      </div>

      <div className="flex items-center gap-4 px-6 text-[13px] font-medium text-[#94A3B8]">
        <div className="flex-1 h-px bg-[#E2E8F0]" />
        {tCommon('or')}
        <div className="flex-1 h-px bg-[#E2E8F0]" />
      </div>

      <div className="p-6 flex items-center justify-center">
        <button className="flex items-center gap-2.5 px-7 py-3.5 bg-white hover:bg-[#FEF2F2] border-2 border-[#E2E8F0] hover:border-[#EF4444] rounded-xl text-[15px] font-semibold text-[#0F172A] transition-all">
          <div className="w-3 h-3 bg-[#EF4444] rounded-full" />
          {t('record')}
        </button>
      </div>

      <div className="px-6 pb-6">
        <div className="text-[13px] font-semibold text-[#64748B] mb-3">{t('speakerCount')}</div>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => onSpeakerCountChange(num)}
              className={`px-5 py-2.5 rounded-[10px] text-sm font-semibold transition-all ${
                selectedSpeakerCount === num
                  ? "bg-[linear-gradient(135deg,#38BDF8_0%,#A855F7_100%)] text-white"
                  : "bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              {num === 5 ? t('fivePlus') : num}
            </button>
          ))}
        </div>

        {isUploading ? (
          <div className="w-full py-4 bg-[#F1F5F9] rounded-xl">
            <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden mx-4">
              <div
                className="h-full bg-[linear-gradient(135deg,#38BDF8_0%,#A855F7_100%)] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-[13px] text-[#64748B] text-center mt-2">
              {t('uploading', { progress: uploadProgress })}
            </p>
          </div>
        ) : (
          <button
            disabled={!hasFile}
            onClick={onTranscribeClick}
            className={`w-full py-4 bg-[linear-gradient(135deg,#38BDF8_0%,#A855F7_100%)] text-white text-base font-bold rounded-xl transition-all ${
              !hasFile ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {hasFile ? t('transcribeNow') : t('selectFile')}
          </button>
        )}
      </div>
    </div>
  )
}
