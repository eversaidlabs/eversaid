/**
 * Application configuration types.
 *
 * These are read server-side at runtime (not baked in at build time)
 * and passed to Client Components as props.
 */

export interface DemoConfig {
  sl: { displayName: string; sourceUrl: string }
  en: { displayName: string; sourceUrl: string }
}

export interface FeatureFlags {
  modelSelection: boolean
  temperatureSelection: boolean
}

export interface PostHogConfig {
  key: string
  host: string
}

export interface AppConfig {
  demo: DemoConfig
  features: FeatureFlags
}

/**
 * Get display name for a demo filename from config.
 * Falls back to original filename if not configured.
 */
export function getDemoDisplayName(
  filename: string,
  demoConfig: DemoConfig
): string {
  const displayNames: Record<string, string | undefined> = {
    "demo-sl.mp3": demoConfig.sl.displayName || undefined,
    "demo-en.mp3": demoConfig.en.displayName || undefined,
  }
  return displayNames[filename] || filename
}
