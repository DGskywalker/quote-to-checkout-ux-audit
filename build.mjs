// Inlines data/audit.json and the Lighthouse summary into template/page.html → dist/index.html.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (p) => fs.readFile(path.join(here, p), 'utf8');

const audit = JSON.parse(await read('data/audit.json'));
const lighthouse = JSON.parse(await read('results/lighthouse.json')).map(
  ({ id, page, formFactor, scores, lcp, fcp, tbt, cls, bytes, finalUrl, error }) => ({ id, page, formFactor, scores, lcp, fcp, tbt, cls, bytes, finalUrl, error })
);
// Keep "</script>" out of the inlined JSON.
const safe = (v) => JSON.stringify(v).replace(/</g, '\\u003c');

const html = (await read('template/page.html'))
  .replace('__AUDIT__', () => safe(audit))
  .replace('__LIGHTHOUSE__', () => safe(lighthouse));

await fs.mkdir(path.join(here, 'dist'), { recursive: true });
await fs.writeFile(path.join(here, 'dist/index.html'), html);
console.log(`dist/index.html (${(html.length / 1024).toFixed(0)} KB, ${audit.issues.length} issues, ${lighthouse.length} Lighthouse runs)`);

// Standalone document for GitHub Pages (Settings → Pages → Deploy from branch → /docs).
const standalone = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="UX case study benchmarking the shipment quote-to-checkout journey on EMX, Aramex, DHL and FedEx.">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
${html}
</body>
</html>
`;
await fs.mkdir(path.join(here, 'docs'), { recursive: true });
await fs.writeFile(path.join(here, 'docs/index.html'), standalone);
console.log('docs/index.html (GitHub Pages)');
