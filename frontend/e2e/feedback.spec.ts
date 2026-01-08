import { test, expect } from "@playwright/test"
import { setupDemoMocks } from "./mocks/setup-mocks"

test.describe("Feedback Rating on Demo Page", () => {
  test.beforeEach(async ({ page }) => {
    // Setup all API mocks with feedback support before navigation
    await setupDemoMocks(page, { withFeedback: true })
    // Use ?entry=demo-en to trigger demo loading via useTranscription.loadEntry
    await page.goto("/en/demo?entry=demo-en")
  })

  test("feedback card is visible with star rating", async ({ page }) => {
    // Find the feedback section
    await expect(page.getByText("How was the quality?")).toBeVisible()

    // Should have 5 star buttons
    const feedbackSection = page
      .locator("div")
      .filter({ hasText: "How was the quality?" })
      .first()
    const starButtons = feedbackSection
      .locator("button")
      .filter({ has: page.locator("svg") })

    // At least 5 buttons should exist (the stars)
    const count = await starButtons.count()
    expect(count).toBeGreaterThanOrEqual(5)
  })

  test("clicking a star updates the rating", async ({ page }) => {
    // Find the feedback card
    const feedbackCard = page
      .locator("div")
      .filter({ hasText: /^How was the quality/ })
      .first()

    // Find star buttons within the feedback card (they contain Sparkles SVG)
    const starButtons = feedbackCard.locator("button")

    // Click the 4th star (good rating)
    await starButtons.nth(3).click()

    // The star should be highlighted (background color changes)
    // For rating >= 4, no textarea should appear
    await expect(page.getByPlaceholder(/What went wrong/)).not.toBeVisible()
  })

  test("low rating (1-3 stars) shows feedback textarea", async ({ page }) => {
    // Find the feedback card
    const feedbackCard = page
      .locator("div")
      .filter({ hasText: /^How was the quality/ })
      .first()
    const starButtons = feedbackCard.locator("button")

    // Click the 2nd star (low rating)
    await starButtons.nth(1).click()

    // Textarea should appear for feedback
    await expect(page.getByPlaceholder(/What went wrong/)).toBeVisible()

    // Submit button should appear
    await expect(
      page.getByRole("button", { name: "Submit Feedback" })
    ).toBeVisible()
  })

  test("can type feedback and submit when rating is low", async ({ page }) => {
    // Find the feedback card and click low star
    const feedbackCard = page
      .locator("div")
      .filter({ hasText: /^How was the quality/ })
      .first()
    const starButtons = feedbackCard.locator("button")

    // Give a 2-star rating
    await starButtons.nth(1).click()

    // Fill in feedback
    const feedbackInput = page.getByPlaceholder(/What went wrong/)
    await expect(feedbackInput).toBeVisible()
    await feedbackInput.fill(
      "The speaker attribution was incorrect in several places"
    )

    // Submit feedback
    const submitButton = page.getByRole("button", { name: "Submit Feedback" })
    await submitButton.click()

    // Button click should work (mocked API returns success)
  })

  test("high rating (4-5 stars) shows positive feedback prompt", async ({ page }) => {
    // Find the feedback card
    const feedbackCard = page
      .locator("div")
      .filter({ hasText: /^How was the quality/ })
      .first()
    const starButtons = feedbackCard.locator("button")

    // Click the 5th star (highest rating)
    await starButtons.nth(4).click()

    // "What went wrong" textarea should NOT appear
    await expect(page.getByPlaceholder(/What went wrong/)).not.toBeVisible()

    // "What did you find most useful?" textarea SHOULD appear for high ratings
    await expect(page.getByPlaceholder(/What did you find most useful/)).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Submit Feedback" })
    ).toBeVisible()
  })

  test("changing rating from low to high hides textarea", async ({ page }) => {
    const feedbackCard = page
      .locator("div")
      .filter({ hasText: /^How was the quality/ })
      .first()
    const starButtons = feedbackCard.locator("button")

    // First give low rating
    await starButtons.nth(0).click()
    await expect(page.getByPlaceholder(/What went wrong/)).toBeVisible()

    // Now give high rating
    await starButtons.nth(4).click()

    // Textarea should disappear
    await expect(page.getByPlaceholder(/What went wrong/)).not.toBeVisible()
  })
})
