import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

for (const version of ['Next.js', 'Direct HTML']) {
  test(`${version}: rooms, saved filter, detail, gallery and stay estimate`, async ({ page }) => {
    test.setTimeout(60000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(version === 'Next.js' ? '/' : pathToFileURL(path.resolve('index.html')).href);
    await expect(page.locator('html')).not.toHaveAttribute('data-intro', 'active');
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator('h1')).toContainText('A little closer');
    await navigate(page, 'rooms');
    await expect(page.locator('.room-card:visible')).toHaveCount(3);
    for (const img of await page.locator('#rooms img').all()) {
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
    await navigate(page, 'arrival');
    await page.getByRole('button', { name: 'Explore the house' }).click();
    await page.getByRole('button', { name: 'Next image', exact: true }).click();
    await expect(page.locator('#modal-title')).toHaveText('Garden Studio');
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('#modal-title')).toHaveText('A softer pace, by the pool');
    await page.getByRole('button', { name: 'Close dialog' }).click();
    await navigate(page, 'rituals');
    await page.locator('[data-ritual="2"]').click();
    await expect(page.locator('.ritual-image img')).toHaveAttribute('src', /ubud\.jpg/);
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.getByRole('button', { name: 'Plan your stay', exact: true }).click();
    await page.getByLabel('Your space').selectOption('garden');
    const future = new Date(); future.setDate(future.getDate() + 10);
    const arrival = future.toISOString().slice(0,10);
    future.setDate(future.getDate() + 2);
    const departure = future.toISOString().slice(0,10);
    await page.getByRole('dialog').getByLabel('Arrival').fill(arrival);
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
  await expect(page.locator('html')).not.toHaveAttribute('data-intro', 'active');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('dialog').getByRole('link', { name: /The rooms/ }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('#rooms-title')).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await prepareScreenshot(page);
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
});

test('desktop horizontal journey, wheel, chapter links, keyboard and progress', async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveAttribute('data-intro', 'active');
  await expect(page.locator('.journey-shell')).toHaveAttribute('data-scroll-mode', 'horizontal');
  await expect(page.locator('.journey-shell')).toHaveAttribute('data-progress', '0');
  await expect(page.locator('.journey-rail, .rail-nav, .journey-progress')).toHaveCount(0);
  await page.mouse.move(700, 500);
  await page.mouse.wheel(0, 800);
  await expect.poll(() => page.locator('#arrival').evaluate(el => el.getBoundingClientRect().left)).toBeLessThan(-700);
  await expect.poll(() => page.locator('.journey-shell').evaluate(el => Number(el.dataset.progress))).toBeGreaterThan(10);
  await page.mouse.wheel(450, 0);
  await expect.poll(() => page.locator('#arrival').evaluate(el => el.getBoundingClientRect().left)).toBeLessThan(-1100);
  await navigate(page, 'story');
  await expect(page.locator('.journey-shell')).toHaveAttribute('data-chapter', 'The Sela way');
  await page.locator('body').click({ position: { x: 720, y: 90 } });
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => page.locator('#rooms').evaluate(el => Math.abs(el.getBoundingClientRect().left))).toBeLessThan(2);
  await navigate(page, 'stay');
  await expect(page.locator('.journey-shell')).toHaveAttribute('data-progress', '100');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const id of ['arrival', 'story', 'rooms', 'rituals', 'stay']) {
    await navigate(page, id);
    for (const img of await page.locator(`#${id} img`).all()) {
      await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
    }
    await page.screenshot({ path: `test-results/desktop-${id}.png` });
  }
});

test('horizontal layout respects reduced motion and direct chapter URLs', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#rooms');
  await expect(page.locator('html')).not.toHaveAttribute('data-intro', 'active');
  await expect.poll(() => page.locator('#rooms').evaluate(el => Math.abs(el.getBoundingClientRect().left))).toBeLessThan(2);
  await navigate(page, 'arrival');
  await expect(page.locator('.title-line em')).toBeInViewport();
  const transition = await page.locator('.title-line em').evaluate(el => getComputedStyle(el).transitionDuration);
  expect(transition).toBe('0s');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.journey-shell')).toHaveAttribute('data-scroll-mode', 'horizontal');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('dialog').getByRole('link', { name: /The rooms/ }).click();
  await expect(page.locator('#rooms-title')).toBeInViewport();
});

test('laptop-height rooms fit the screen without navbar or footer', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveAttribute('data-intro', 'active');
  await navigate(page, 'rooms');
  await expect(page.locator('header, footer')).toHaveCount(0);
  await expect(page.locator('.floating-menu')).toBeVisible();
  for (const element of await page.locator('#rooms .room-price, #rooms .round-arrow, #rooms .demo-note').all()) {
    const box = await element.boundingBox();
    expect(box.y).toBeGreaterThan(0);
    expect(box.y + box.height).toBeLessThan(720);
  }
  await page.screenshot({ path: 'test-results/laptop-rooms.png' });
});

async function navigate(page, id) {
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('dialog').locator(`a[href="#${id}"]`).click();
  await expect.poll(() => page.locator(`#${id}`).evaluate(el => Math.abs(el.getBoundingClientRect().left))).toBeLessThan(2);
}

async function prepareScreenshot(page) {
  for (const img of await page.locator('main img:visible').all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
  }
  await page.evaluate(() => { document.activeElement?.blur(); document.querySelector('.journey-shell').scrollTo({ left: 0, top: 0, behavior: 'instant' }); });
}
