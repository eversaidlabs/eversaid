"use client"

import { Check, ChevronDown } from "lucide-react"

export interface AnalysisSectionProps {
  analysisType: "summary" | "action-items" | "sentiment"
  summary: string
  topics: string[]
  keyPoints: string[]
  showAnalysisMenu: boolean // Added controlled visibility prop
  onChangeAnalysisType: (type: "summary" | "action-items" | "sentiment") => void
  onToggleAnalysisMenu: () => void // Added toggle handler prop
}

export function AnalysisSection({
  analysisType,
  summary,
  topics,
  keyPoints,
  showAnalysisMenu, // Receive from parent
  onChangeAnalysisType,
  onToggleAnalysisMenu, // Receive from parent
}: AnalysisSectionProps) {
  const analysisLabels = {
    summary: "Conversation Summary",
    "action-items": "Action Items",
    sentiment: "Sentiment Analysis",
  }

  return (
    <div className="bg-[linear-gradient(135deg,rgba(56,189,248,0.05)_0%,rgba(168,85,247,0.05)_100%)] border border-[rgba(56,189,248,0.2)] rounded-[20px] p-7">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <div className="text-[11px] font-bold text-[#38BDF8] uppercase tracking-[1px]">AI Analysis</div>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-[#0F172A]">
            <Check className="w-4 h-4 text-[#10B981]" />
            {analysisLabels[analysisType]}
          </div>
        </div>
        <div className="relative">
          <button
            onClick={onToggleAnalysisMenu}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg text-[13px] font-semibold text-[#64748B] hover:text-[#0F172A] transition-all"
          >
            Change
            <ChevronDown className="w-4 h-4" />
          </button>
          {showAnalysisMenu && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-[#E2E8F0] rounded-lg overflow-hidden z-10 shadow-lg min-w-[180px]">
              {(["summary", "action-items", "sentiment"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    onChangeAnalysisType(type)
                    onToggleAnalysisMenu() // Close menu after selection
                  }}
                  className={`block w-full px-4 py-2.5 text-[13px] font-medium text-left transition-colors ${
                    analysisType === type
                      ? "bg-[#F1F5F9] text-[#0F172A]"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  {analysisLabels[type]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <h4 className="text-[13px] font-bold text-[#64748B] uppercase tracking-[0.5px] mb-2 mt-4">Summary</h4>
      <p className="text-[15px] text-[#334155] leading-[1.7] mb-4">{summary}</p>

      <h4 className="text-[13px] font-bold text-[#64748B] uppercase tracking-[0.5px] mb-2 mt-4">Topics Discussed</h4>
      <div className="flex flex-wrap gap-2 mb-4">
        {topics.map((topic) => (
          <span
            key={topic}
            className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-full text-[13px] text-[#64748B]"
          >
            {topic}
          </span>
        ))}
      </div>

      <h4 className="text-[13px] font-bold text-[#64748B] uppercase tracking-[0.5px] mb-2 mt-4">Key Points</h4>
      <ul className="space-y-2">
        {keyPoints.map((point, i) => (
          <li key={i} className="relative pl-5 text-sm text-[#334155] leading-[1.6]">
            <div className="absolute left-0 top-2 w-1.5 h-1.5 bg-[linear-gradient(135deg,#38BDF8_0%,#A855F7_100%)] rounded-full" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  )
}
