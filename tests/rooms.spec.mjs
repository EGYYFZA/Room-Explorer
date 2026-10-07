import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { rooms } from '../lib/content.mjs';

for (const direct of [false, true]) {
  test(`${direct ? 'Direct HTML' : 'Next.js'}: every room route, photos, pricing and navigation`, async ({ page }) => {
    test.setTimeout(60000);
    const errors = [];
    const failedResources = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400 && /\.(jpg|js|css)(\?|$)/.test(r.url())) failedResources.push(r.url()); });
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const room of rooms) {
      await page.goto(direct ? pathToFileURL(path.resolve(`room-pages/${room.id}.html`)).href : `/rooms/${room.id}/`);
      await expect(page.locator('html')).not.toHaveAttribute('data-intro', 'active');
      await expect(page.locator('h1')).toContainText(room.name);
      await expect(page).toHaveTitle(new RegExp(room.name));
      await expect(page.locator('.space-heading .eyebrow')).toContainText(`0${rooms.indexOf(room) + 1}`);
      await page.locator('[data-open-photos]').click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.locator('[data-photo-count]')).toHaveText(`1 / ${room.photos.length}`);
      await page.keyboard.press('ArrowRight');
      await expect(page.locator('#room-photo-title')).toHaveText(room.photos[1][1]);
      await expect.poll(() => page.locator('[data-large-photo]').evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
      await page.keyboard.press('Escape');
      await expect(page.locator('[data-open-photos]')).toBeFocused();
      for (const img of await page.locator('main img').all()) {
        await img.scrollIntoViewIfNeeded();
        await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
      }
      const future = new Date(); future.setDate(future.getDate() + 10);
      const arrival = future.toISOString().slice(0, 10);
      future.setDate(future.getDate() + 3);
      const departure = future.toISOString().slice(0, 10);
      await page.getByLabel('Arrival', { exact: true }).fill(arrival);
      await page.getByLabel('Departure', { exact: true }).fill(arrival);
      await page.getByRole('button', { name: 'Preview my stay' }).click();
      await expect(page.locator('[data-room-error]')).toContainText('at least one night');
      await page.getByLabel('Departure').fill(departure);
      await page.getByLabel('Guests').selectOption(String(room.guests));
      await expect(page.locator('[data-night-label]')).toContainText('3 nights');
      await expect(page.locator('[data-room-total]')).toContainText(new Intl.NumberFormat('id-ID').format(room.price * 3));
      await page.getByRole('button', { name: 'Preview my stay' }).click();
      await expect(page.locator('[data-room-confirmation]')).toContainText('No reservation');
      await expect(page.locator('[data-confirm-summary]')).toContainText(`${room.guests} guests`);
      await page.locator('[data-adjust-stay]').click();
      await expect(page.getByLabel('Arrival', { exact: true })).toHaveValue(arrival);
      await page.locator('summary').filter({ hasText: 'What is included in the rate?' }).click();
      await expect(page.locator('details[open]')).toContainText('Every rate on this demo is fictional');
      const related = rooms.find(r => r.id !== room.id);
      await page.locator('.related-card').first().click();
      await expect(page.locator('h1')).toContainText(related.name);
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      await page.getByRole('dialog').getByRole('link', { name: /The rooms/ }).click();
      await expect.poll(() => page.locator('#rooms').evaluate(el => Math.abs(el.getBoundingClientRect().left))).toBeLessThan(2);
      await page.getByRole('link', { name: `Explore ${room.name}`, exact: true }).click();
      await expect(page.locator('h1')).toContainText(room.name);
    }
    expect(errors).toEqual([]);
    expect(failedResources).toEqual([]);
  });
}

test('room detail responsive layouts, gallery and stay planner', async ({ page }) => {
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/rooms/pool/');
    await expect(page.locator('html')).not.toHaveAttribute('data-intro', 'active');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight)).toBe(true);
    await expect(page.locator('.journey-shell')).toHaveAttribute('data-scroll-mode', 'horizontal');
    await expect(page.locator('.journey-rail')).toHaveCount(0);
    await page.locator('[data-open-photos]').click();
    await page.getByRole('button', { name: 'Next photo' }).click();
    await expect(page.locator('[data-photo-count]')).toHaveText('2 / 5');
    await page.getByRole('button', { name: 'Close photos' }).click();
    await expect(page.locator('header, footer, .room-stay-bar')).toHaveCount(0);
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.getByRole('dialog').getByRole('link', { name: 'Plan your stay' }).click();
    await expect(page.getByLabel('Arrival', { exact: true })).toBeInViewport();
    const future = new Date(); future.setDate(future.getDate() + 15);
    await page.getByLabel('Arrival', { exact: true }).fill(future.toISOString().slice(0, 10));
    future.setDate(future.getDate() + 2);
    await page.getByLabel('Departure').fill(future.toISOString().slice(0, 10));
    await page.getByRole('button', { name: 'Preview my stay' }).click();
    await expect(page.locator('[data-confirm-total]')).toContainText('8.400.000');
    for (const img of await page.locator('main img').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
    }
    await page.evaluate(() => document.querySelector('.journey-shell').scrollTo({ left: 0, top: 0, behavior: 'instant' }));
    await page.screenshot({ path: `test-results/pool-${width}.png`, fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect((await page.goto('/rooms/unknown/')).status()).toBe(404);
});
