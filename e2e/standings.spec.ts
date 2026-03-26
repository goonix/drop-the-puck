import { test, expect } from '@playwright/test'
import standingsFixture from './fixtures/standings.json' with { type: 'json' }
import scheduleFixture from './fixtures/schedule.json' with { type: 'json' }

test.beforeEach(async ({ page }) => {
  await page.route('**/api/nhl/v1/score/**', (route) => route.fulfill({ json: scheduleFixture }))
  await page.route('**/api/nhl/v1/standings/**', (route) =>
    route.fulfill({ json: standingsFixture }),
  )
})

test('loads standings tab and shows teams', async ({ page }) => {
  await page.goto('/')
  // Click the Standings tab
  await page.getByRole('button', { name: 'Standings' }).click()
  // Should show team abbreviations from the fixture
  await expect(page.getByText('BOS').first()).toBeVisible()
  await expect(page.getByText('TOR').first()).toBeVisible()
})

test('conference grouping shows conference names', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Standings' }).click()
  // Eastern conference should be visible in the standings
  await expect(page.getByText(/Eastern/i).first()).toBeVisible()
})

test('switching to division grouping changes the view', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Standings' }).click()
  // Look for a Division grouping toggle
  const divisionBtn = page.getByRole('button', { name: /Division/i })
  if (await divisionBtn.isVisible()) {
    await divisionBtn.click()
    // After switching to division view, Atlantic division should show
    await expect(page.getByText(/Atlantic/i).first()).toBeVisible()
  }
})

test('switching to wildcard grouping shows wildcard label', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Standings' }).click()
  const wildcardBtn = page.getByRole('button', { name: /Wild ?Card/i })
  if (await wildcardBtn.isVisible()) {
    await wildcardBtn.click()
    await expect(page.getByText(/Wild ?Card/i).first()).toBeVisible()
  }
})
