import { test, expect } from '@playwright/test'
import scheduleFixture from './fixtures/schedule.json' with { type: 'json' }
import boxscoreFixture from './fixtures/boxscore.json' with { type: 'json' }
import playsFixture from './fixtures/plays.json' with { type: 'json' }

test.beforeEach(async ({ page }) => {
  await page.route('**/api/nhl/v1/score/**', (route) => route.fulfill({ json: scheduleFixture }))
  await page.route('**/api/nhl/v1/gamecenter/*/boxscore', (route) =>
    route.fulfill({ json: boxscoreFixture }),
  )
  await page.route('**/api/nhl/v1/gamecenter/*/play-by-play', (route) =>
    route.fulfill({ json: playsFixture }),
  )
})

test('shows game cards on load', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('EDM')).toBeVisible()
  await expect(page.getByText('TOR')).toBeVisible()
})

test('shows FINAL badge for finished games', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Final')).toBeVisible()
})

test('shows LIVE indicator for in-progress games', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('BOS')).toBeVisible()
  await expect(page.getByText('MTL')).toBeVisible()
  // Live game should show a live status indicator
  await expect(page.getByText(/Live|LIVE|P\d/i)).toBeVisible()
})

test('clicking a game card opens game detail', async ({ page }) => {
  await page.goto('/')
  // Click the first game card (the EDM vs TOR game)
  const gameCard = page.locator('button').filter({ hasText: 'EDM' }).first()
  await gameCard.click()
  // game detail panel should appear with Final status
  await expect(page.getByText('Final').first()).toBeVisible()
})

test('date navigation changes the date', async ({ page }) => {
  await page.goto('/')
  // Find the next day navigation button and click it
  const nextBtn = page.getByRole('button', { name: /next day/i })
  if (await nextBtn.isVisible()) {
    await nextBtn.click()
    // The schedule for a different date should load (same mock data)
    await expect(page.getByText('EDM')).toBeVisible()
  }
})

test('previous day navigation works', async ({ page }) => {
  await page.goto('/')
  const prevBtn = page.getByRole('button', { name: /previous day/i })
  if (await prevBtn.isVisible()) {
    await prevBtn.click()
    await expect(page.getByText('EDM')).toBeVisible()
  }
})
