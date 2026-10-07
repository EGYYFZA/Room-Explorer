import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

for (const offline of [false, true]) {
  test(`${offline ? 'HTML' : 'Next.js'}: hero waits for splash, staggers lines and replays on return`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(offline ? pathToFileURL(path.resolve('index.html')).href : '/');
    await expect(page.locator('html')).toHaveAttribute('data-intro', 'active');
    const lines = page.locator('#hero-heading .title-line');
    expect(await lines.evaluateAll(els => els.every(el => el.dataset.motionState !== 'playing'))).toBe(true);
    await expect(page.locator('html')).not.toHaveAttribute('data-intro', 'active');
    await expect(lines.first()).toHaveAttribute('data-motion-state', 'playing');
    const timing = await lines.evaluateAll(els => els.map(el => el.firstElementChild.getAnimations().find(a => a.effect.getTiming().duration === 1500)?.effect.getTiming()));
    expect(timing.map(t => t?.delay)).toEqual([100, 260, 420]);
    await expect(lines.last()).toHaveAttribute('data-motion-state', 'settled');
    expect(await page.locator('.journey-shell').evaluate(el => el.scrollLeft)).toBe(0);
    await move(page, 'story');
    await expect(lines.first()).toHaveAttribute('data-motion-state', 'waiting');
    await expect(page.locator('#story h2')).toHaveAttribute('data-motion-state', 'playing');
    await move(page, 'arrival');
    await expect(lines.first()).toHaveAttribute('data-motion-state', 'playing');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(lines.first()).toHaveAttribute('data-motion-state', 'static');
    expect(await lines.evaluateAll(els => els.every(el => el.firstElementChild.getAnimations().length === 0))).toBe(true);
    await expect(page.locator('.title-line em')).toHaveCSS('opacity', '1');
    expect(errors).toEqual([]);
  });
}

test('every section has entrances, dynamic room cards animate, focused controls stay readable', async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  for (const route of ['/#arrival', '/rooms/garden/', '/rooms/canopy/', '/rooms/pool/']) {
    await page.goto(route);
    const panels = await page.locator('.journey-panel').evaluateAll(els => els.map(el => el.id));
    await expect(page.locator('.journey-shell')).toHaveAttribute('data-section-motion', 'enabled');
    await move(page, panels.at(-1));
    const firstOwner = route.startsWith('/#') ? page.locator('#hero-heading .title-line').first() : page.locator('#room-arrival h1');
    await expect(firstOwner).toHaveAttribute('data-motion-state', 'waiting');
    for (const id of panels) {
      await move(page, id);
      const heading = page.locator(`#${id} h1, #${id} h2`).first();
      const owner = id === 'arrival' ? page.locator('#hero-heading .title-line').first() : heading;
      await expect(owner).toHaveAttribute('data-motion-kind', /line|heading/);
      await expect(owner).toHaveAttribute('data-motion-state', 'playing');
      await expect(owner).toHaveAttribute('data-motion-state', 'settled');
      await expect(heading).toBeInViewport();
    }
    if (route.startsWith('/#')) {
      await move(page, 'rooms');
      await page.locator('[data-filter="Saved"]').click();
      await expect(page.locator('.room-card')).toHaveCount(0);
      await page.locator('[data-filter="Suite"]').click();
      await expect(page.locator('.room-card')).toHaveCount(1);
      await expect(page.locator('.room-card')).toHaveAttribute('data-motion-kind', 'card');
      await expect(page.locator('.room-card')).toHaveAttribute('data-motion-state', 'playing');
    } else {
      await move(page, 'room-planning');
      await page.getByLabel('Arrival', { exact: true }).focus();
      await expect(page.locator('.space-booking')).toHaveAttribute('data-motion-state', 'settled');
      await expect(page.locator('.space-booking')).toHaveCSS('opacity', '1');
      expect(await page.locator('.space-booking').evaluate(el => el.getAnimations().length)).toBe(0);
    }
  }
  expect(errors).toEqual([]);
});

async function move(page, id) {
  await page.evaluate(id => {
    document.activeElement?.blur();
    const shell = document.querySelector('.journey-shell');
    shell.scrollTo({ left: document.getElementById(id).offsetLeft, top: 0, behavior: 'instant' });
  }, id);
  await expect.poll(() => page.locator(`#${id}`).evaluate(el => Math.abs(el.getBoundingClientRect().left))).toBeLessThan(2);
}
