import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
const out = process.argv[2];
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await p.goto('https://motionsites.ai/?prompt=modern-dental-clinic', { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(8000);
for (let i = 0; i < 40; i++) { if (await p.getByText('Modern Dental Clinic').count()) break; await p.mouse.wheel(0, 2500); await p.waitForTimeout(700); }
const loc = p.getByText('Modern Dental Clinic').first();
await loc.scrollIntoViewIfNeeded(); await loc.click(); await p.waitForTimeout(5000);
const info = await p.evaluate(() => {
  const els = [...document.elementsFromPoint(400, 380)];
  return els.slice(0, 8).map(e => e.tagName + ' ' + (e.currentSrc || e.src || e.style?.backgroundImage || '') + ' ' + e.className);
});
writeFileSync(out + '/info.txt', info.join('\n'));
for (let i = 0; i < 3; i++) { await p.screenshot({ path: `${out}/hero${i}.png`, clip: { x: 24, y: 84, width: 802, height: 601 } }); await p.waitForTimeout(1500); }
await b.close();
