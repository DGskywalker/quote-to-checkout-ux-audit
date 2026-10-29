// Free, keyless Lighthouse runner: mobile + desktop for every URL in sites.json.
// Usage: CHROME_PATH=/path/to/chromium node run-lighthouse.mjs [site-id | site-id-page]
// Writes results/lighthouse.json (summary) and results/raw/*.json (full reports).
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
// Optional filter, e.g. `node run-lighthouse.mjs aramex` re-runs only matching sites and merges.
const only = process.argv[2];
const sites = JSON.parse(await fs.readFile(path.join(here, 'sites.json'), 'utf8'))
  .filter((s) => !only || s.id === only || `${s.id}-${s.page}` === only);
const outDir = path.join(here, 'results');
await fs.mkdir(path.join(outDir, 'raw'), { recursive: true });

const pick = (lhr) => {
  const a = lhr.audits;
  const n = (id) => a[id]?.numericValue ?? null;
  return {
    finalUrl: lhr.finalDisplayedUrl,
    error: lhr.runtimeError?.message ?? null,
    scores: Object.fromEntries(
      Object.entries(lhr.categories).map(([k, c]) => [k, c.score == null ? null : Math.round(c.score * 100)])
    ),
    lcp: n('largest-contentful-paint'),
    fcp: n('first-contentful-paint'),
    tbt: n('total-blocking-time'),
    cls: n('cumulative-layout-shift'),
    si: n('speed-index'),
    bytes: n('total-byte-weight'),
    requests: a['network-requests']?.details?.items?.length ?? null,
    tapTargets: a['target-size']?.score ?? null,
    labels: a['label']?.score ?? null,
    contrast: a['color-contrast']?.score ?? null,
    viewport: a['viewport']?.score ?? null,
  };
};

const results = [];
for (const site of sites) {
  for (const formFactor of ['mobile', 'desktop']) {
    const chrome = await chromeLauncher.launch({
      chromePath: process.env.CHROME_PATH,
      chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
    });
    const flags = { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] };
    const config = formFactor === 'desktop'
      ? { extends: 'lighthouse:default', settings: { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } } }
      : undefined;
    try {
      const run = await lighthouse(site.url, flags, config);
      const slug = `${site.id}-${site.page}-${formFactor}`;
      await fs.writeFile(path.join(outDir, 'raw', `${slug}.json`), run.report);
      results.push({ ...site, formFactor, ...pick(run.lhr) });
      console.log('ok', slug, results.at(-1).scores);
    } catch (e) {
      results.push({ ...site, formFactor, error: String(e.message || e) });
      console.log('fail', site.id, formFactor, e.message);
    } finally {
      await chrome.kill();
    }
  }
}
results.forEach((r) => (r.runAt = new Date().toISOString()));
const summaryPath = path.join(outDir, 'lighthouse.json');
const previous = only ? JSON.parse(await fs.readFile(summaryPath, 'utf8').catch(() => '[]')) : [];
const key = (r) => `${r.id}-${r.page}-${r.formFactor}`;
const merged = [...previous.filter((p) => !results.some((r) => key(r) === key(p))), ...results];
await fs.writeFile(summaryPath, JSON.stringify(merged, null, 2));
