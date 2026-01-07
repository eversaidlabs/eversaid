import { useTranslations } from "next-intl"

export function DemoFooter() {
  const t = useTranslations("landing.footer")
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0F172A] px-8 md:px-12 py-6 mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <span className="text-[13px] text-white/60">{t("copyright", { year: currentYear })}</span>
        <span className="text-xs text-white/40">{t("builtIn")}</span>
      </div>
      <div className="flex gap-6">
        <a href="#" className="text-[13px] text-white/60 hover:text-white transition-colors">
          {t("privacy")}
        </a>
        <a href="#" className="text-[13px] text-white/60 hover:text-white transition-colors">
          {t("terms")}
        </a>
        <a href="#" className="text-[13px] text-white/60 hover:text-white transition-colors">
          {t("contact")}
        </a>
      </div>
    </footer>
  )
}
