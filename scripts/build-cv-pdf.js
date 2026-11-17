/**
 * Build the downloadable CV PDF from portfolio/index.html.
 *
 *   npm i -D playwright && npx playwright install chromium   (first time only)
 *   node scripts/build-cv-pdf.js
 *
 * Output: portfolio/Thong-Nguyen-Lam-Chi-CV.pdf (A4, vector text, selectable).
 * Re-run this whenever the CV content in portfolio/index.html changes.
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const SRC = path.resolve(__dirname, '../portfolio/index.html');
const OUT = path.resolve(__dirname, '../portfolio/Thong-Nguyen-Lam-Chi-CV.pdf');

(async () => {
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const browser = await chromium.launch(proxy ? { proxy: { server: proxy } } : {});
  const page = await browser.newPage();
  await page.goto('file://' + SRC, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });

  const pdf = await page.pdf({
    preferCSSPageSize: true, // uses @page { size: A4; margin: ... } from the HTML
    printBackground: true,
  });
  fs.writeFileSync(OUT, pdf);

  const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log(`Wrote ${path.relative(process.cwd(), OUT)} (${pages} page${pages > 1 ? 's' : ''})`);
  await browser.close();
})();
