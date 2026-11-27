// The deal finder itself: reads the address, filters and sorts the deals,
// and renders the list or one deal. No network request is ever made — the
// deals live in data.js. window.__shotReady tells a screenshot script the
// page has finished rendering.
//
//   #/                                  the list
//   #/?cat=Audio&store=Amazon&min=40    the list, filtered
//   #/deal/<id>                         one deal, with a store comparison

import { deals } from "./data.js";
import { percentOff, saved } from "./verdicts.js";
import { listPage, dealPage, missingPage, dealCard } from "./views.js";

const app = document.getElementById("app");

function parseState() {
  const hash = location.hash || "#/";
  const [path, query] = hash.slice(2).split("?");
  const params = new URLSearchParams(query || "");
  return {
    path: path || "",
    q: params.get("q") || "",
    cat: params.get("cat") || "All",
    store: params.get("store") || "",
    minoff: Number(params.get("min") || 0),
    sort: params.get("sort") || "off",
  };
}

export function filterDeals(state) {
  const q = state.q.trim().toLowerCase();
  let list = deals.filter((d) => {
    if (state.cat !== "All" && d.category !== state.cat) return false;
    if (state.store && d.store !== state.store) return false;
    if (percentOff(d) < state.minoff) return false;
    if (q && !`${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q)) return false;
    return true;
  });
  const by = {
    off: (a, b) => percentOff(b) - percentOff(a) || saved(b) - saved(a),
    saved: (a, b) => saved(b) - saved(a),
    low: (a, b) => a.price - b.price,
    high: (a, b) => b.price - a.price,
  };
  return list.sort(by[state.sort] || by.off);
}

function renderGridOnly(state) {
  const list = filterDeals(state);
  const grid = document.getElementById("grid");
  const count = document.getElementById("count");
  if (grid) grid.innerHTML = list.map(dealCard).join("\n") || '<p class="empty">No deal matches those filters.</p>';
  if (count) count.innerHTML = `Showing <strong>${list.length}</strong> of ${deals.length} deals`;
}

function render() {
  window.__shotReady = false;
  const state = parseState();
  const dealMatch = state.path.match(/^deal\/([^/?]+)/);
  if (dealMatch) {
    const found = deals.find((d) => d.id === decodeURIComponent(dealMatch[1]));
    document.title = `${found ? found.title : "Not found"} · Black Friday Deal Finder`;
    app.innerHTML = found ? dealPage(found) : missingPage();
  } else {
    document.title = "Black Friday Deal Finder — real deals, checked 27 Nov 2026";
    app.innerHTML = listPage(filterDeals(state), state);
    const search = document.getElementById("q");
    const store = document.getElementById("store");
    const minoff = document.getElementById("minoff");
    const sort = document.getElementById("sort");
    if (search) {
      search.addEventListener("input", () => {
        state.q = search.value;
        renderGridOnly(state);
      });
    }
    const pushHash = () => {
      const params = new URLSearchParams();
      if (state.cat !== "All") params.set("cat", state.cat);
      if (search.value.trim()) params.set("q", search.value.trim());
      if (store.value) params.set("store", store.value);
      if (Number(minoff.value)) params.set("min", minoff.value);
      if (sort.value !== "off") params.set("sort", sort.value);
      const qs = params.toString();
      location.hash = "#/" + (qs ? `?${qs}` : "");
    };
    if (store) store.addEventListener("change", pushHash);
    if (minoff) minoff.addEventListener("change", pushHash);
    if (sort) sort.addEventListener("change", pushHash);
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
