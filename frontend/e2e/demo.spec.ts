import { test, expect } from "@playwright/test"

test.describe("Demo Page", () => {
  test.beforeEach(async ({ page }) => {
    // Use ?mock parameter to load demo with mock transcript data for E2E testing
    await page.goto("/en/demo?mock")
  })

  test("loads with transcript visible", async ({ page }) => {
    // In mock mode, transcript is loaded immediately (no upload mode)
    // Audio player - target by the play icon container (button with Play/Pause icon)
    await expect(page.locator("button").filter({ has: page.locator("svg[class*='fill-white']") }).first()).toBeVisible()

    // Transcript sections visible
    await expect(page.getByText("Raw Transcription")).toBeVisible()
    await expect(page.getByText("AI Cleaned")).toBeVisible()

    // At least one segment visible
    await expect(page.getByText("Speaker 1").first()).toBeVisible()
  })

  test("audio player controls work", async ({ page }) => {
    // Find play button by the gradient background container
    const playButton = page.locator("button").filter({ has: page.locator("svg[class*='fill-white']") }).first()

    await expect(playButton).toBeVisible()
    await playButton.click()

    // After click, button should still be there (now showing pause icon)
    await expect(playButton).toBeVisible()
  })

  test("can toggle diff view", async ({ page }) => {
    // First expand the editor by clicking the overlay (required since fullscreen mode was added)
    const expandOverlay = page.getByRole("button", { name: /expand editor/i })
    await expect(expandOverlay).toBeVisible()
    await expandOverlay.click()

    // Wait for editor to expand
    await page.waitForTimeout(300)

    // Find the diff toggle button by its text
    const diffButton = page.getByRole("button", { name: /diff/i })

    await expect(diffButton).toBeVisible()

    // Check initial state
    await expect(diffButton).toContainText("Diff On")

    // Toggle off
    await diffButton.click()
    await expect(diffButton).toContainText("Diff Off")

    // Toggle back on
    await diffButton.click()
    await expect(diffButton).toContainText("Diff On")
  })

  test("transcript copy buttons work", async ({ page }) => {
    // First expand the editor by clicking the overlay (required since fullscreen mode was added)
    const expandOverlay = page.getByRole("button", { name: /expand editor/i })
    await expect(expandOverlay).toBeVisible()
    await expandOverlay.click()

    // Wait for editor to expand
    await page.waitForTimeout(300)

    // Copy button should be visible (there are multiple, pick first)
    const copyButton = page.getByRole("button", { name: "Copy" }).first()
    await expect(copyButton).toBeVisible()

    // Click should not throw
    await copyButton.click()
  })

  test("analysis section displays content", async ({ page }) => {
    // Analysis section header
    await expect(page.getByText("AI Analysis")).toBeVisible()

    // In mock mode, analysis data is not available (requires API)
    // So we just verify the section renders without error
    // The section should be visible, either showing loading, empty state, or content
  })

  test("sidebar elements are visible in transcript mode", async ({ page }) => {
    // In mock/transcript mode, FeedbackCard is visible (not EntryHistoryCard)
    // EntryHistoryCard only shows in upload mode (when no segments loaded)

    // Feedback card - actual text is "How was the quality?"
    await expect(page.getByText("How was the quality?")).toBeVisible()

    // Waitlist CTA (appears in various places)
    await expect(page.getByText(/waitlist/i).first()).toBeVisible()
  })

  test("sidebar elements are visible in upload mode", async ({ page }) => {
    // Go to demo without mock param to be in upload mode
    await page.goto("/en/demo")

    // History card - visible in upload mode
    await expect(page.getByText("Your Transcriptions")).toBeVisible()
  })
})
