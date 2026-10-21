// Usage: node tools/shoot.mjs <baseUrl> <outDir> [mode]
// mode "still" exports the fallback image; otherwise screenshots several viewports.
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';

const [base = 'http://localhost:5173', out = 'shots', mode = 'shots'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const logs = [];

if (mode === 'still') {
  const page = await browser.newPage({ viewport: { width: 1200, height: 1400 }, deviceScaleFactor: 1 });
  page.on('console', (m) => logs.push(m.text()));
  await page.goto(`${base}/tools/capture.html`);
  await page.waitForFunction(() => window.__sceneReady === true, null, { timeout: 60000 });
  const data = await page.evaluate(() => document.querySelector('canvas').toDataURL('image/webp', 0.86));
  writeFileSync(`${out}/molar-still.webp`, Buffer.from(data.split(',')[1], 'base64'));
  console.log('still written');
} else {
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
    await page.goto(base + (process.env.QUERY ?? ''), { waitUntil: 'networkidle' });
    await page.waitForTimeout(Number(process.env.WAIT ?? 4500));
    const suffix = process.env.SUFFIX ?? '';
    await page.screenshot({ path: `${out}/${name}${suffix}.png` });
    const metrics = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      canvasOpacity: getComputedStyle(document.querySelector('[data-hero="canvas"]') ?? document.body).opacity,
      stillOpacity: getComputedStyle(document.querySelector('[data-hero="fallback"]')).opacity,
    }));
    console.log(name, JSON.stringify(metrics));
    if (process.env.SCROLL) {
      await page.mouse.wheel(0, height * 0.6);
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `${out}/${name}${suffix}-scrolled.png` });
    }
    await ctx.close();
  }
}
await browser.close();
const interesting = logs.filter((l) => !/Download the React DevTools|\[vite\]/.test(l));
if (interesting.length) console.log('console:\n' + interesting.join('\n'));
