// Usage: node tools/shoot.mjs <baseUrl> <outDir>
// Screenshots the hero at several viewports with the locally installed Chrome.
// Env: ONLY=<name part> · WAIT=<ms> · SUFFIX=<text> · REDUCED=1 · SCROLL=1 · QUERY=<?query>
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const [base = 'http://localhost:5173', out = 'shots'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const logs = [];

const views = [
  ['desktop-1440', 1440, 900, {}],
  ['desktop-1920', 1920, 1080, {}],
  ['laptop-1280', 1280, 720, {}],
  ['tablet-834', 834, 1112, { hasTouch: true, isMobile: true }],
  ['mobile-390', 390, 844, { hasTouch: true, isMobile: true }],
  ['mobile-360', 360, 740, { hasTouch: true, isMobile: true }],
];
const only = process.env.ONLY;
for (const [name, width, height, extra] of views) {
  if (only && !name.includes(only)) continue;
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, ...extra, reducedMotion: process.env.REDUCED ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  page.on('console', (m) => logs.push(`[${name}] ${m.type()}: ${m.text()}`));
  page.on('pageerror', (e) => logs.push(`[${name}] PAGEERROR ${e.message}`));
  await page.goto(base + (process.env.QUERY ?? ''), { waitUntil: 'load' });
  // the first frame of the sequence is painted, then give the entrance time to settle
  await page.waitForFunction(() => document.querySelector('.hero__frames-canvas')?.hasAttribute('data-ready'), null, { timeout: 30000 });
  await page.waitForTimeout(Number(process.env.WAIT ?? 3500));
  const suffix = process.env.SUFFIX ?? '';
  await page.screenshot({ path: `${out}/${name}${suffix}.png` });
  const metrics = await page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth }));
  console.log(name, JSON.stringify(metrics));
  if (process.env.SCROLL) {
    await page.mouse.wheel(0, height * 0.6);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}/${name}${suffix}-scrolled.png` });
  }
  await ctx.close();
}
await browser.close();
const interesting = logs.filter((l) => !/Download the React DevTools|\[vite\]/.test(l));
if (interesting.length) console.log('console:\n' + interesting.join('\n'));
