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

  await page.goto('/')
  // Click the EDM vs TOR game to open game detail
  const gameCard = page.locator('button').filter({ hasText: 'EDM' }).first()
  await gameCard.click()
  // Wait for game detail to appear
  await expect(page.getByRole('button', { name: 'Goals' })).toBeVisible()
})

test('shows Goals tab with scoring plays', async ({ page }) => {
  // Goals tab is active by default
  await page.getByRole('button', { name: 'Goals' }).click()
  // Scorer name from fixture: Connor McDavid
  await expect(page.getByText(/McDavid|Connor/i).first()).toBeVisible()
})

test('shows Box Score tab with period scores', async ({ page }) => {
  await page.getByRole('button', { name: 'Box Score' }).click()
  // Should show period scores from the linescore (P1, P2, P3 or similar)
  await expect(page.getByText(/P1|Period 1|1st/i).first()).toBeVisible()
})

test('shows Plays tab with play-by-play entries', async ({ page }) => {
  await page.getByRole('button', { name: 'Plays' }).click()
  // Should show play-by-play entries — goal and shot-on-goal events
  await expect(page.getByText(/goal|shot/i).first()).toBeVisible()
})

test('shows Stats tab with player stats', async ({ page }) => {
  await page.getByRole('button', { name: 'Stats' }).click()
  // Player stats should show from the fixture (Connor McDavid or Auston Matthews)
  await expect(page.getByText(/McDavid|Matthews|Connor|Auston/i).first()).toBeVisible()
})

test('tabs switch correctly when clicked', async ({ page }) => {
  // Start on Goals
  await page.getByRole('button', { name: 'Goals' }).click()
  await expect(page.getByText(/McDavid|Connor/i).first()).toBeVisible()

  // Switch to Box Score
  await page.getByRole('button', { name: 'Box Score' }).click()
  await expect(page.getByText(/P1|Period 1|1st/i).first()).toBeVisible()

  // Switch back to Goals
  await page.getByRole('button', { name: 'Goals' }).click()
  await expect(page.getByText(/McDavid|Connor/i).first()).toBeVisible()
})
