import { test, expect } from "@playwright/test"
import { setupDemoMocks, expandFeedbackWidget } from "./mocks/setup-mocks"

test.describe("Feedback Rating on Demo Page", () => {
  test.beforeEach(async ({ page }) => {
    // Setup all API mocks with feedback support before navigation
    await setupDemoMocks(page, { withFeedback: true })
    // Use ?entry=demo-en to trigger demo loading via useTranscription.loadEntry
    await page.goto("/en/demo?entry=demo-en")

    // Expand the floating feedback widget (it starts collapsed)
    await expandFeedbackWidget(page)
  })

  test("feedback card is visible with star rating", async ({ page }) => {
    // Find the feedback section (floating widget)
    await expect(page.getByText("How was the quality?")).toBeVisible()

    // Should have 5 star buttons in the rating container (flex gap-1 mb-4)
    const feedbackWidget = page.locator(".fixed.bottom-6.right-6")
    const starContainer = feedbackWidget.locator(".flex.gap-1.mb-4")
    const starButtons = starContainer.locator("button")

    // Exactly 5 star buttons should exist
    const count = await starButtons.count()
    expect(count).toBe(5)
  })

  test("clicking a star updates the rating", async ({ page }) => {
    // Find star buttons within the floating widget's rating container
    const feedbackWidget = page.locator(".fixed.bottom-6.right-6")
    const starContainer = feedbackWidget.locator(".flex.gap-1.mb-4")
    const starButtons = starContainer.locator("button")

    // Click the 4th star (good rating) - index 3
    await starButtons.nth(3).click()

    // The star should be highlighted (background color changes)
    // For rating >= 4, no "Share your thoughts" textarea appears (high ratings use different placeholder)
    await expect(page.getByPlaceholder(/Share your thoughts/)).not.toBeVisible()
  })

  test("low rating (1-3 stars) shows feedback textarea", async ({ page }) => {
    // Find star buttons within the floating widget's rating container
    const feedbackWidget = page.locator(".fixed.bottom-6.right-6")
    const starContainer = feedbackWidget.locator(".flex.gap-1.mb-4")
    const starButtons = starContainer.locator("button")

    // Click the 2nd star (low rating) - index 1
    await starButtons.nth(1).click()

    // Textarea should appear for feedback (low ratings use "Share your thoughts" placeholder)
    await expect(page.getByPlaceholder(/Share your thoughts/)).toBeVisible()

    // Submit button should appear
    await expect(
      page.getByRole("button", { name: "Submit Feedback" })
    ).toBeVisible()
  })

  test("can type feedback and submit when rating is low", async ({ page }) => {
    // Find star buttons within the floating widget's rating container
    const feedbackWidget = page.locator(".fixed.bottom-6.right-6")
    const starContainer = feedbackWidget.locator(".flex.gap-1.mb-4")
    const starButtons = starContainer.locator("button")

    // Give a 2-star rating (index 1)
    await starButtons.nth(1).click()

    // Fill in feedback
    const feedbackInput = page.getByPlaceholder(/Share your thoughts/)
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
    // Find star buttons within the floating widget's rating container
    const feedbackWidget = page.locator(".fixed.bottom-6.right-6")
    const starContainer = feedbackWidget.locator(".flex.gap-1.mb-4")
    const starButtons = starContainer.locator("button")

    // Click the 5th star (highest rating) - index 4
    await starButtons.nth(4).click()

    // "Share your thoughts" textarea (for low ratings) should NOT appear
    await expect(page.getByPlaceholder(/Share your thoughts/)).not.toBeVisible()

    // "What did you find most useful?" textarea SHOULD appear for high ratings
    await expect(page.getByPlaceholder(/What did you find most useful/)).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Submit Feedback" })
    ).toBeVisible()
  })

  test("changing rating from low to high changes textarea placeholder", async ({ page }) => {
    // Find star buttons within the floating widget's rating container
    const feedbackWidget = page.locator(".fixed.bottom-6.right-6")
    const starContainer = feedbackWidget.locator(".flex.gap-1.mb-4")
    const starButtons = starContainer.locator("button")

    // First give low rating (1 star - index 0)
    await starButtons.nth(0).click()
    await expect(page.getByPlaceholder(/Share your thoughts/)).toBeVisible()

    // Now give high rating (5 stars - index 4)
    await starButtons.nth(4).click()

    // Low-rating placeholder should disappear, high-rating placeholder should appear
    await expect(page.getByPlaceholder(/Share your thoughts/)).not.toBeVisible()
    await expect(page.getByPlaceholder(/What did you find most useful/)).toBeVisible()
  })
})
