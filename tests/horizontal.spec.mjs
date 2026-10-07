import { test, expect } from '@playwright/test';

test('every route is horizontal at phone, tablet, desktop and short-window sizes', async ({ page }) => {
  test.setTimeout(60000);
  for (const size of [{ width: 320, height: 700 }, { width: 390, height: 844 }, { width: 768, height: 900 }, { width: 1280, height: 600 }]) {
    await page.setViewportSize(size);
    for (const route of ['/', '/rooms/garden/', '/rooms/canopy/', '/rooms/pool/']) {
      await page.goto(route);
      await expect(page.locator('html')).not.toHaveAttribute('data-intro', 'active');
      const shell = page.locator('.journey-shell');
      await expect(shell).toHaveAttribute('data-scroll-mode', 'horizontal');
      await expect(page.locator('.journey-rail, .rail-nav, .chapter-indicator')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight && document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.mouse.move(size.width * .55, size.height * .45);
      await page.mouse.wheel(0, 250);
      await expect.poll(() => shell.evaluate(el => el.scrollLeft)).toBeGreaterThan(150);
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
    }
  }
});

test('native touch swipes advance the home and room slides', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const session = await context.newCDPSession(page);
  for (const route of ['/', '/rooms/pool/']) {
    await page.goto('http://127.0.0.1:3000' + route);
    await expect(page.locator('html')).not.toHaveAttribute('data-intro', 'active');
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 340, y: 350 }] });
    for (const x of [285, 230, 175, 120, 65]) await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: 350 }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(() => page.locator('.journey-shell').evaluate(el => el.scrollLeft)).toBeGreaterThan(200);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  }
  await context.close();
});
