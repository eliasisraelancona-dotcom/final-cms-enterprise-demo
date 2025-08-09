import { test, expect } from '@playwright/test'

test('bottom-left signout button signs user out and revokes access', async ({ page }) => {
  // Sign in
  await page.goto('http://localhost:3000/signin')
  await page.getByPlaceholder('email').fill('alice.admin@example.com')
  await page.getByPlaceholder('password').fill('password')
  await Promise.all([
    page.waitForURL('**/'),
    page.getByRole('button', { name: /sign in/i }).click(),
  ])

  // Button visible
  const signout = page.getByRole('button', { name: /sign out/i })
  await expect(signout).toBeVisible()

  // Position check: bottom-left-ish
  const box = await signout.boundingBox()
  const viewport = page.viewportSize()
  if (!box || !viewport) throw new Error('no bounding box or viewport')
  expect(box.x).toBeLessThan(64)
  expect(box.y + box.height).toBeGreaterThan(viewport.height - 120)

  // Sign out
  await Promise.all([
    page.waitForURL('**/signin'),
    signout.click(),
  ])

  // Access revoked
  await page.goto('http://localhost:3000/')
  await expect(page).toHaveURL(/\/signin$/)
})

