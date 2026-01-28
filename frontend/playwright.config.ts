import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    env: {
      // Runtime config for Server Components during E2E tests
      DEMO_SL_DISPLAY_NAME: "Test Demo SL",
      DEMO_SL_SOURCE_URL: "https://example.com/demo-sl",
      DEMO_EN_DISPLAY_NAME: "Test Demo EN",
      DEMO_EN_SOURCE_URL: "https://example.com/demo-en",
      ENABLE_MODEL_SELECTION: "false",
      ENABLE_TEMPERATURE_SELECTION: "false",
    },
  },
})
