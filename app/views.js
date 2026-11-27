// HTML for the deal finder: the deal cards, the list page and the detail
// page. Every value is escaped before it goes into the page, and every price
// shown is computed from the deal's own sale and usual prices.

import { deals, CHECKED_LABEL } from "./data.js";
import { money, percentOff, saved, verdictOf, checkLabel, escape } from "./verdicts.js";

function verdictChip(d) {
  const v = verdictOf(d);
  return `<span class="verdict verdict-${escape(d.verdict)}" title="${escape(v.hint)}">${escape(v.label)}</span>`;
}

export function dealCard(d) {
  return `<article class="card">
  <div class="card-top"><span class="store">${escape(d.store)}</span><span class="cat">${escape(d.category)}</span></div>
  <h3><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h3>
  <p class="prices"><span class="sale">${money(d.price)}</span> <s class="was">${money(d.was)}</s> <span class="off">${percentOff(d)}% off</span></p>
  <p class="save">You save ${money(saved(d))}</p>
  <p class="verdict-row">${verdictChip(d)}</p>
  <p class="note">${escape(d.note)}</p>
  <p class="checked">Checked ${checkLabel(d.checked)} · ${escape(d.source)}</p>
  <p class="cta"><a class="btn" href="${escape(d.url)}" target="_blank" rel="noopener">View at ${escape(d.store)} ↗</a></p>
</article>`;
}

export function statsBar(list) {
  const stores = new Set(list.map((d) => d.store)).size;
  const best = list.reduce((m, d) => Math.max(m, percentOff(d)), 0);
  const totalSaved = list.reduce((s, d) => s + saved(d), 0);
  const avg = list.length ? Math.round(list.reduce((s, d) => s + percentOff(d), 0) / list.length) : 0;
  return `<section class="stats" aria-label="Sale summary">
  <div><strong>${list.length}</strong><span>deals checked</span></div>
  <div><strong>${stores}</strong><span>stores</span></div>
  <div><strong>${best}%</strong><span>biggest cut</span></div>
  <div><strong>${avg}%</strong><span>average cut</span></div>
  <div><strong>${money(totalSaved)}</strong><span>total savings here</span></div>
</section>`;
}

export function listPage(list, state) {
  const cards = list.map(dealCard).join("\n");
  const empty =
    list.length === 0
      ? `<p class="empty">No deal matches those filters. <a href="#/">Clear the filters</a> to see all ${deals.length} deals.</p>`
      : "";
  return `<h1>Black Friday <span class="gold">deal finder</span></h1>
<p class="lede">Real Black Friday &amp; Cyber Monday deals, checked one by one at the store — sale price, usual price, discount and an honest verdict on whether each one is really a deal. Prices checked ${escape(CHECKED_LABEL)}.</p>
${statsBar(list)}
<section class="controls" aria-label="Search and filters">
  <label class="search">Search <input id="q" type="search" placeholder="Try “airpods”, “lego”, “tv”…" value="${escape(state.q)}"></label>
  <label>Store
    <select id="store">
      <option value="">All stores</option>
      ${[...new Set(deals.map((d) => d.store))].map((s) => `<option${s === state.store ? " selected" : ""}>${escape(s)}</option>`).join("")}
    </select>
  </label>
  <label>Min. discount
    <select id="minoff">
      <option value="0"${state.minoff === 0 ? " selected" : ""}>Any discount</option>
      <option value="20"${state.minoff === 20 ? " selected" : ""}>20% off or more</option>
      <option value="40"${state.minoff === 40 ? " selected" : ""}>40% off or more</option>
      <option value="50"${state.minoff === 50 ? " selected" : ""}>50% off or more</option>
    </select>
  </label>
  <label>Sort by
    <select id="sort">
      <option value="off"${state.sort === "off" ? " selected" : ""}>Biggest discount</option>
      <option value="saved"${state.sort === "saved" ? " selected" : ""}>Biggest saving ($)</option>
      <option value="low"${state.sort === "low" ? " selected" : ""}>Lowest price</option>
      <option value="high"${state.sort === "high" ? " selected" : ""}>Highest price</option>
    </select>
  </label>
</section>
<nav class="cats" aria-label="Categories">${["All", ...new Set(deals.map((d) => d.category))]
    .map(
      (c) =>
        `<a href="#/?cat=${encodeURIComponent(c)}${state.q ? `&q=${encodeURIComponent(state.q)}` : ""}${state.store ? `&store=${encodeURIComponent(state.store)}` : ""}${state.minoff ? `&min=${state.minoff}` : ""}${state.sort !== "off" ? `&sort=${state.sort}` : ""}" class="${c === state.cat ? "active" : ""}">${escape(c)}</a>`,
    )
    .join("")}</nav>
<p class="count" id="count">Showing <strong>${list.length}</strong> of ${deals.length} deals</p>
<div class="grid" id="grid">${cards}</div>
${empty}`;
}

export function dealPage(d) {
  const v = verdictOf(d);
  const same = d.group ? deals.filter((x) => x.group === d.group && x.id !== d.id) : [];
  const compare =
    same.length === 0
      ? ""
      : `<section class="compare"><h2>Same product at another store</h2>
<table>
<tr><th>Store</th><th>Sale price</th><th>Usual price</th><th>Discount</th><th></th></tr>
${[d, ...same]
  .sort((a, b) => a.price - b.price)
  .map(
    (x) =>
      `<tr${x.id === d.id ? ' class="here"' : ""}><td>${escape(x.store)}</td><td><strong>${money(x.price)}</strong></td><td><s>${money(x.was)}</s></td><td>${percentOff(x)}% off</td><td>${x.id === d.id ? "← this page" : `<a href="#/deal/${encodeURIComponent(x.id)}">View</a>`}</td></tr>`,
  )
  .join("")}
</table>
<p class="compare-note">Cheapest first. Prices were all checked ${escape(CHECKED_LABEL)}.</p></section>`;
  return `<p><a class="back" href="#/">&larr; All deals</a></p>
<article class="detail">
  <div class="card-top"><span class="store">${escape(d.store)}</span><span class="cat">${escape(d.category)}</span></div>
  <h1>${escape(d.title)}</h1>
  <p class="prices big"><span class="sale">${money(d.price)}</span> <s class="was">${money(d.was)}</s> <span class="off">${percentOff(d)}% off</span></p>
  <p class="save">You save ${money(saved(d))} off the usual price.</p>
  <p class="verdict-row">${verdictChip(d)}</p>
  <p class="verdict-why"><strong>Is it really a deal?</strong> ${escape(d.note)} ${escape(v.hint)}</p>
  <dl>
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Category</dt><dd>${escape(d.category)}</dd>
    <dt>Sale price</dt><dd>${money(d.price)}</dd>
    <dt>Usual price</dt><dd>${money(d.was)}</dd>
    <dt>Discount</dt><dd>${percentOff(d)}% off — save ${money(saved(d))}</dd>
    <dt>Price checked</dt><dd>${checkLabel(d.checked)}</dd>
    <dt>Read in</dt><dd>${escape(d.source)}</dd>
  </dl>
  <p class="cta"><a class="btn big" href="${escape(d.url)}" target="_blank" rel="noopener">Buy it at ${escape(d.store)} ↗</a></p>
  <p class="fine">The link opens the store's own search for this exact product, so you can confirm the live price before you buy. Prices change — this page shows the price as checked above.</p>
</article>
${compare}`;
}

export function missingPage() {
  return `<h1>Not found</h1><p>There is no deal at this address. <a href="#/">See all ${deals.length} deals</a>.</p>`;
}
