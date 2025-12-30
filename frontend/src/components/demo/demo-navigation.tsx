import Link from "next/link"
import { Upload, ChevronDown } from "lucide-react"

export interface DemoNavigationProps {
  currentPage: "demo" | "features" | "api"
}

export function DemoNavigation({ currentPage }: DemoNavigationProps) {
  return (
    <nav className="sticky top-0 z-[100] flex justify-between items-center px-8 md:px-12 py-4 bg-[linear-gradient(135deg,#0F172A_0%,#1E3A5F_50%,#0F172A_100%)]">
      <Link href="/" className="flex items-center gap-2.5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 44" className="h-8 w-auto">
          <g>
            <line x1="0" y1="10" x2="20" y2="12" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
            <line x1="0" y1="22" x2="18" y2="20" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
            <line x1="0" y1="32" x2="22" y2="34" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
            <path d="M25 22 L38 22" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
            <path
              d="M34 16 L40 22 L34 28"
              stroke="#38BDF8"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="45" y1="10" x2="65" y2="10" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <line x1="45" y1="22" x2="65" y2="22" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <line x1="45" y1="34" x2="65" y2="34" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
        <span className="font-[family-name:var(--font-comfortaa)] font-bold text-[22px] text-white tracking-[0.01em]">
          eversaid
        </span>
      </Link>

      <div className="hidden md:flex gap-8 items-center">
        <Link
          href="/demo"
          className={`text-sm font-medium transition-colors ${
            currentPage === "demo"
              ? "text-white relative pb-2 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[linear-gradient(135deg,#38BDF8_0%,#A855F7_100%)] after:rounded-[1px]"
              : "text-white/70 hover:text-white"
          }`}
        >
          Demo
        </Link>
        <Link
          href="#features"
          className={`text-sm font-medium transition-colors ${
            currentPage === "features" ? "text-white" : "text-white/70 hover:text-white"
          }`}
        >
          Features
        </Link>
        <Link
          href="/api-docs"
          className={`text-sm font-medium transition-colors ${
            currentPage === "api" ? "text-white" : "text-white/70 hover:text-white"
          }`}
        >
          API Docs
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1.5 text-white/70 hover:text-white hover:bg-white/10 text-[13px] font-medium px-3 py-1.5 rounded-lg transition-all">
          <Upload className="w-4 h-4" />
          EN
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    </nav>
  )
}
