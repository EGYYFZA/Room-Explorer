import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

for (const version of ['Next.js', 'Direct HTML']) {
  test(`${version}: rooms, saved filter, detail, gallery and stay estimate`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(version === 'Next.js' ? '/' : pathToFileURL(path.resolve('index.html')).href);
    await expect(page.locator('h1')).toContainText('A little closer');
    await expect(page.locator('.room-card:visible')).toHaveCount(3);
    for (const img of await page.locator('main img').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
    }
    await page.locator('[data-filter="Saved"]').click();
    await expect(page.locator('.room-card:visible')).toHaveCount(0);
    await expect(page.locator('.empty-state')).toBeVisible();
    await page.getByRole('button', { name: 'Explore all rooms' }).click();
    await page.getByRole('button', { name: 'Save Garden Studio', exact: true }).click();
    await page.locator('[data-filter="Saved"]').click();
    await expect(page.locator('.room-card:visible')).toHaveCount(1);
    await page.locator('[data-filter="Suite"]').click();
    await expect(page.locator('.room-card:visible h3')).toHaveText('Canopy Suite');
    await page.getByRole('button', { name: 'View Canopy Suite', exact: true }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog')).toContainText('Deep soaking tub');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await page.getByRole('button', { name: 'Explore the house' }).click();
    await page.getByRole('button', { name: 'Next image', exact: true }).click();
    await expect(page.locator('#modal-title')).toHaveText('Garden Studio');
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('#modal-title')).toHaveText('A softer pace, by the pool');
    await page.getByRole('button', { name: 'Close dialog' }).click();
    await page.locator('[data-ritual="2"]').click();
    await expect(page.locator('.ritual-image img')).toHaveAttribute('src', /ubud\.jpg/);
    await page.getByRole('button', { name: 'Plan your stay', exact: true }).click();
    await page.getByLabel('Your space').selectOption('garden');
    const future = new Date(); future.setDate(future.getDate() + 10);
    const arrival = future.toISOString().slice(0,10);
    future.setDate(future.getDate() + 2);
    const departure = future.toISOString().slice(0,10);
    await page.getByLabel('Arrival').fill(arrival);
    await page.getByLabel('Departure').fill(arrival);
    await page.getByRole('button', { name: 'Preview my stay' }).click();
    await expect(page.locator('.form-error')).toContainText('at least one night');
    await page.getByLabel('Departure').fill(departure);
    await page.getByLabel('Guests').selectOption('4');
    await page.getByRole('button', { name: 'Preview my stay' }).click();
    await expect(page.locator('.form-error')).toContainText('up to 2 guests');
    await page.getByLabel('Your space').selectOption('pool');
    await expect(page.locator('.stay-estimate strong')).toContainText('8.400.000');
    await page.getByRole('button', { name: 'Preview my stay' }).click();
    await expect(page.locator('.confirmation')).toContainText('Pool House');
    await expect(page.locator('.confirmation')).toContainText('8.400.000');
    await expect(page.locator('.stay-intro')).toContainText('no reservation');
    expect(errors).toEqual([]);
  });
}

test('mobile navigation and layout at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('dialog').getByRole('link', { name: /The rooms/ }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('#rooms-title')).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await prepareScreenshot(page);
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
});

test('desktop layout has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.locator('.hero-photo img').waitFor({ state: 'visible' });
  await expect.poll(() => page.locator('.hero-photo img').evaluate(el => el.complete)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await prepareScreenshot(page);
  await page.screenshot({ path: 'test-results/desktop.png', fullPage: true });
});

async function prepareScreenshot(page) {
  for (const img of await page.locator('main img').all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
  }
  await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({ top: 0, behavior: 'instant' }); });
}
