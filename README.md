<div align="center">

# Quote to Checkout

**A UX audit and competitor benchmark of the shipment booking journey**

EMX &nbsp;·&nbsp; Aramex &nbsp;·&nbsp; DHL Express &nbsp;·&nbsp; FedEx &nbsp;&nbsp;|&nbsp;&nbsp; United Arab Emirates &nbsp;&nbsp;|&nbsp;&nbsp; October 2026

[Read the case study](https://quote-to-checkout-ux-audit.vercel.app) &nbsp;&nbsp;/&nbsp;&nbsp; [Download the PDF](https://quote-to-checkout-ux-audit.vercel.app/quote-to-checkout.pdf)

</div>

<br>

---

<br>

## Overview

Four courier websites, one parcel, the same questions.

I walked each carrier's quote-to-checkout flow with an identical shipment and stopped before payment. I measured every page with Lighthouse on mobile and desktop, then rated each usability problem against Nielsen's ten heuristics. The study ends with eleven recommendations for EMX, ranked by impact against effort, and three A/B tests ready to run.

<br>

<table>
<tr>
<td width="25%" align="center"><h3>34</h3>usability issues</td>
<td width="25%" align="center"><h3>16</h3>Lighthouse runs</td>
<td width="25%" align="center"><h3>11</h3>ranked fixes</td>
<td width="25%" align="center"><h3>3</h3>A/B tests</td>
</tr>
</table>

<br>

## The benchmark

| Measure | EMX | Aramex | DHL Express | FedEx |
| :--- | :---: | :---: | :---: | :---: |
| Inputs filled to see a price | **4** | 9 | 10 | 3 |
| Price, 2 kg, Dubai to Abu Dhabi | AED 25.00 | AED 48.00 | No quote | AED 100.72 |
| Delivery date shown with price | Yes | No | n/a | No |
| Book without an account | **Yes** | No | Yes | No |
| Booking page, mobile performance | **98** | 71 | 56 | 11 |

<br>

## Key findings

**EMX** &nbsp; The only site where you can book without an account and see a delivery date next to the price. Its homepage works against it: the "Send a Shipment" button opens the Card Services page, and on mobile the main content takes 13.8 seconds to appear.

**Aramex** &nbsp; A SHIELD protection add-on is ticked by default, raising the total from AED 48 to AED 73. Length, width and height look optional, are required, and report their errors off-screen.

**DHL Express** &nbsp; Get Quote returned no rates and no message on two attempts. On phones, the UAE quote link detours through a country and language picker first.

**FedEx** &nbsp; The fewest fields to a price, but the rate shows "--" where the delivery date should be, and choosing it leads to a sign-in wall. The quote page scores 11 for mobile performance.

<br>

## Method

<table>
<tr>
<td width="50%" valign="top">

**Scenario**

Dubai to Abu Dhabi, one box, 2 kg,
30 by 20 by 15 cm, declared value AED 100.

**Rules**

Dummy shipment data only. No personal data entered, no accounts created, non-essential cookies rejected. Each walk stopped at the first screen asking for personal details, a login, or payment.

</td>
<td width="50%" valign="top">

**Scoring**

Nielsen severity, from 1 cosmetic to 4 catastrophe. Recommendations ranked by impact divided by effort, each scored 1 to 5.

**Tools**

Lighthouse 12 run locally on Playwright's Chromium, Chrome DevTools device mode, and a small form-audit script. All free, with no API keys.

</td>
</tr>
</table>

<br>

## Repository

```
data/audit.json          the audit: journeys, issues, recommendations, A/B tests
sites.json               pages measured by Lighthouse
run-lighthouse.mjs       mobile and desktop Lighthouse runner
results/lighthouse.json  score summary
form-audit.js            console snippet that inspects form inputs
template/page.html       case-study page, rendered from the data
build.mjs                builds docs/index.html
export-pdf.mjs           prints the page to an A4 PDF
docs/                    the published site
```

<br>

## Run it yourself

Requires Node 18 or later.

```bash
npm install
npx playwright install chromium
npm run lighthouse
npm run build
npm run pdf
```

Before running Lighthouse, point `CHROME_PATH` at Playwright's Chromium. On macOS:

```
~/Library/Caches/ms-playwright/chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium
```

To refresh a single site, run `node run-lighthouse.mjs aramex`. Results merge into the existing summary. Edit `data/audit.json`, rebuild, and every table, chart and ranking on the page updates.

<br>

## Deploy

The site is hosted on Vercel. `vercel.json` serves the `docs/` folder as-is, with no build step.

```bash
npm run build && npm run pdf && cp dist/quote-to-checkout.pdf docs/
npx vercel deploy --prod
```

GitHub Pages also works: Settings, then Pages, then deploy from `main` with the `/docs` folder.

<br>

## Limits

One evaluator, one route, one session on 29 October 2026. Lighthouse lab scores move by a few points between runs. A heuristic review finds likely problems; it does not replace testing with real customers.

<br>

---

<div align="center">

<sub>Divyansh Gupta &nbsp;·&nbsp; 2026 &nbsp;·&nbsp; MIT License</sub>

<sub>EMX, Aramex, DHL and FedEx are trademarks of their respective owners. This is an independent study and is not affiliated with any carrier.</sub>

</div>
