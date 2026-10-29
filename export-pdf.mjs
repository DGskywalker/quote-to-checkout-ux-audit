// Renders dist/index.html to an A4 PDF with Playwright's Chromium.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const body = await fs.readFile(path.join(here, 'dist/index.html'), 'utf8');
// The published page is a fragment; give it a standards-mode document for printing.
const doc = `<!doctype html><html lang="en" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>${body}</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });
await page.setContent(doc, { waitUntil: 'networkidle' });
await page.emulateMedia({ media: 'print', colorScheme: 'light' });
const out = path.join(here, 'dist/quote-to-checkout.pdf');
await page.pdf({ path: out, format: 'A4', printBackground: true, margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' } });
await browser.close();
console.log(out);
