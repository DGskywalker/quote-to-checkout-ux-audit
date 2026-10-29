// Paste into the DevTools console on any booking screen (or run as a bookmarklet).
// Prints every visible input with its label, type and mobile hints, plus page-level mobile checks.
(() => {
  const visible = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
  const inputs = [...document.querySelectorAll('input, select, textarea')].filter((e) => e.type !== 'hidden' && visible(e));
  const rows = inputs.map((e) => ({
    tag: e.tagName.toLowerCase(),
    type: e.type,
    label: (e.labels?.[0]?.innerText || e.getAttribute('aria-label') || e.placeholder || '').trim().slice(0, 50) || '⚠ no label',
    required: e.required || /\*/.test(e.labels?.[0]?.innerText || ''),
    inputmode: e.inputMode || '',
    autocomplete: e.autocomplete || '',
    fontPx: parseFloat(getComputedStyle(e).fontSize),
  }));
  const taps = [...document.querySelectorAll('a, button, [role=button]')].filter(visible);
  console.table(rows);
  const summary = {
    url: location.href,
    visibleInputs: rows.length,
    unlabeled: rows.filter((r) => r.label === '⚠ no label').length,
    under16px: rows.filter((r) => r.fontPx < 16).length,
    numericWithoutKeypad: rows.filter((r) => r.type === 'text' && /weight|length|width|height|value|kg|cm/i.test(r.label) && !r.inputmode).length,
    tapTargetsUnder24px: taps.filter((b) => { const r = b.getBoundingClientRect(); return r.height < 24 || r.width < 24; }).length,
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
  };
  console.log(summary);
  return summary;
})();
