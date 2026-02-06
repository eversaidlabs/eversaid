import { DemoPage } from "./demo-page-client"
import type { AppConfig } from "@/lib/app-config"

// Force dynamic rendering so runtime env vars are read at request time
// This allows a single Docker image to work across environments
export const dynamic = 'force-dynamic'

/**
 * Demo page Server Component.
 *
 * Reads environment variables at request time (not build time) and passes
 * them to the Client Component as props. This allows a single Docker image
 * to be used across environments with different configurations.
 *
 * Environment variables (no NEXT_PUBLIC_ prefix needed):
 * - DEMO_SL_DISPLAY_NAME: Display name for Slovenian demo
 * - DEMO_SL_SOURCE_URL: Source URL for Slovenian demo
 * - DEMO_EN_DISPLAY_NAME: Display name for English demo
 * - DEMO_EN_SOURCE_URL: Source URL for English demo
 * - ENABLE_MODEL_SELECTION: Enable model selection UI (true/false)
 * - ENABLE_TEMPERATURE_SELECTION: Enable temperature selection UI (true/false)
 */
export default function Page() {
  const config: AppConfig = {
    demo: {
      sl: {
        displayName: process.env.DEMO_SL_DISPLAY_NAME || "",
        sourceUrl: process.env.DEMO_SL_SOURCE_URL || "",
      },
      en: {
        displayName: process.env.DEMO_EN_DISPLAY_NAME || "",
        sourceUrl: process.env.DEMO_EN_SOURCE_URL || "",
      },
    },
    features: {
      modelSelection: process.env.ENABLE_MODEL_SELECTION === "true",
      temperatureSelection: process.env.ENABLE_TEMPERATURE_SELECTION === "true",
    },
  }

  return <DemoPage config={config} />
}
