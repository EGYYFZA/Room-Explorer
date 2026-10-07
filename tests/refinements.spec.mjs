import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

for (const version of ['Next.js', 'Direct HTML']) {
  test(`${version}: slow intro keeps arrival first, reload resets, menu expands and closes`, async ({ page }) => {
    await page.goto(version === 'Next.js' ? '/' : pathToFileURL(path.resolve('index.html')).href);
    const html = page.locator('html');
    const shell = page.locator('.journey-shell');
    await expect(html).toHaveAttribute('data-intro', 'active');
    await expect(shell).toHaveAttribute('inert', '');
    await expect(page.locator('.circle-link')).toHaveCount(0);
    await page.mouse.move(600, 350);
    await page.mouse.wheel(0, 1200);
    await shell.evaluate(el => { el.scrollLeft = innerWidth; });
    await expect.poll(() => shell.evaluate(el => el.scrollLeft)).toBe(0);
    await expect(html).not.toHaveAttribute('data-intro', 'active');
    await expect(shell).not.toHaveAttribute('inert', '');
    expect(await shell.evaluate(el => el.scrollLeft)).toBe(0);
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    const menu = page.getByRole('dialog');
    expect(await menu.evaluate(el => getComputedStyle(el).animationName)).toBe('menu-expand');
    expect(await menu.evaluate(el => parseFloat(getComputedStyle(el).animationDuration))).toBeGreaterThanOrEqual(1);
    await menu.evaluate(async el => { await Promise.all(el.getAnimations({ subtree: true }).map(a => a.finished)); });
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('data-closing', 'true');
    await expect(menu).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeFocused();
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await menu.locator('a[href="#story"]').click();
    await expect(menu).not.toBeVisible();
    await expect.poll(() => page.locator('#story').evaluate(el => Math.abs(el.getBoundingClientRect().left))).toBeLessThan(2);
    await page.reload();
    await expect(html).toHaveAttribute('data-intro', 'active');
    await expect(html).not.toHaveAttribute('data-intro', 'active');
    expect(await shell.evaluate(el => el.scrollLeft)).toBe(0);
    expect(new URL(page.url()).hash).toBe('');
  });
}

test('Next.js and HTML popups fit desktop and mobile, and selected photos update', async ({ page }) => {
  test.setTimeout(60000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  for (const version of ['Next.js', 'Direct HTML']) for (const size of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 320, height: 700 }]) {
    await page.setViewportSize(size);
    await page.goto(version === 'Next.js' ? '/#rooms' : pathToFileURL(path.resolve('index.html')).href + '#rooms');
    await expect.poll(() => page.locator('#rooms').evaluate(el => Math.abs(el.getBoundingClientRect().left))).toBeLessThan(2);
    await page.getByRole('button', { name: 'View Garden Studio', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveClass(/room-modal/);
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    await settle(dialog);
    await page.screenshot({ path: `test-results/popup-room-${size.width}${version === 'Direct HTML' ? '-offline' : ''}.png` });
    await dialog.getByRole('button', { name: 'Choose this space' }).click();
    await expect(dialog).toHaveClass(/stay-modal/);
    await page.getByLabel('Your space').selectOption('pool');
    await expect(page.locator('.stay-cover')).toHaveAttribute('src', /pool\.jpg/);
    await expect.poll(() => page.locator('.stay-cover').evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    await dialog.evaluate(el => { el.scrollTop = 0; });
    await settle(dialog);
    await page.screenshot({ path: `test-results/popup-stay-${size.width}${version === 'Direct HTML' ? '-offline' : ''}.png` });
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveAttribute('data-intro', 'active');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  expect(await page.getByRole('dialog').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  expect(errors).toEqual([]);
});

async function settle(dialog) {
  await dialog.evaluate(async el => { await Promise.all(el.getAnimations({ subtree: true }).map(a => a.finished.catch(() => {}))); });
}
