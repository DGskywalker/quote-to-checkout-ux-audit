# Quote to Checkout

**A UX audit and competitor benchmark of the shipment booking journey on EMX, Aramex, DHL Express and FedEx (UAE).**

I walked each carrier's quote-to-checkout flow with the same parcel, measured every page with Lighthouse on mobile and desktop, and rated 34 usability issues against Nielsen's 10 heuristics. The study ends with 11 recommendations for EMX ranked by impact and effort, and 3 A/B tests with a sample-size calculator.

🔗 **[Live case study](https://quote-to-checkout-ux-audit.vercel.app/)** · **[PDF](https://quote-to-checkout-ux-audit.vercel.app/quote-to-checkout.pdf)**

## Key findings

| | EMX | Aramex | DHL Express | FedEx |
|---|---|---|---|---|
| Inputs filled to see a price | 4 | 9 | 10 | 3 |
| Price (2 kg, Dubai → Abu Dhabi) | AED 25.00 | AED 48.00 (+ AED 25 pre-ticked add-on) | No quote returned | AED 100.72 |
| Delivery date shown with price | ✅ | ❌ | — | ❌ (“--”) |
| Book without an account | ✅ | ❌ | ✅ (stated) | ❌ |
| Booking page, mobile Lighthouse perf. | 98 | 71 | 56 | 11 |

- **EMX** is the only site that lets you book without an account and shows a delivery date with the price. But its homepage “Send a Shipment” button links to the Card Services page, and the homepage takes 13.8 s to show its main content on mobile.
- **Aramex** pre-ticks a SHIELD protection add-on that raises the total by 52%.
- **DHL** returned no quote and no error message on two attempts. On phones, its UAE quote link first sends you to a country and language picker.
- **FedEx** shows no delivery date with its rate, and its quote page scores 11 for mobile performance.

## Method

- **Scenario:** Dubai → Abu Dhabi, 1 box, 2 kg, 30 × 20 × 15 cm, declared value AED 100.
- **Rules:** dummy shipment data only. No personal data typed, no accounts created, non-essential cookies rejected. Stopped at the first screen asking for personal data, an account, or payment.
- **Scoring:** Nielsen severity 1 Cosmetic · 2 Minor · 3 Major · 4 Catastrophe. Recommendations are ranked by impact ÷ effort (each scored 1–5).
- **Tools:** all free, with no API keys. Lighthouse 12 runs locally on Playwright's Chromium, so there is no PageSpeed quota.

## Repository layout

| Path | What it is |
| --- | --- |
| `data/audit.json` | The audit: scenario, journeys, issues, recommendations, A/B tests, mobile checks |
| `sites.json` | Pages Lighthouse measures |
| `run-lighthouse.mjs` | Lighthouse mobile + desktop runner → `results/lighthouse.json` |
| `form-audit.js` | DevTools console snippet: counts inputs, flags missing labels, missing number keypads, sub-16 px text |
| `template/page.html` | Case-study page template, rendered from the JSON |
| `build.mjs` | Builds `docs/index.html` (GitHub Pages) and `dist/index.html` |
| `export-pdf.mjs` | Prints the page to an A4 PDF |

## Run it yourself

Requires Node 18+.

```bash
npm install
npx playwright install chromium
npm run lighthouse   # set CHROME_PATH to Playwright's Chromium binary first
npm run build
npm run pdf
```

On macOS, Playwright's Chromium is at:
`~/Library/Caches/ms-playwright/chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium`

Re-run one site with `node run-lighthouse.mjs aramex` (or `aramex-booking`). Results merge into the existing summary.

## Deploy

The live site is hosted on Vercel. `vercel.json` serves the `docs/` folder as-is, with no build step.

```bash
npm run build && npm run pdf && cp dist/quote-to-checkout.pdf docs/
npx vercel deploy --prod
```

GitHub Pages works too: Settings → Pages → Deploy from a branch → `main` / `/docs`.

## Limits

One evaluator, one route, one session (29 Oct 2026). Lighthouse lab scores vary by a few points between runs. A heuristic review finds likely problems; it does not replace testing with real customers.

## License

MIT for the code. EMX, Aramex, DHL and FedEx are trademarks of their owners. This is an independent study, not affiliated with any carrier.
