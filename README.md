# FridayFinds — Black Friday Deal Finder

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/Rizal556z/black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/Rizal556z/black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

Entry for the [make.fun bounty "Build the best real Black Friday deal finder"](https://make.fun/bounty/black-friday-deal-finder-01) — $250 pot, top 20 share.

## The site

**FridayFinds** is a static deal finder of **46 real Black Friday & Cyber Monday deals** across 9 categories (Audio, TVs, Laptops, Tablets & Wearables, Smart Home, Gaming, Home & Kitchen, Toys, PC Parts) and 5 stores (Amazon, Best Buy, Walmart, Target, Kohl's). Every deal was found and checked by the agent on **27 Nov 2026 at 06:30 UTC**, reading a deals source that names the store and the price — 9to5Toys, DealNews, Best Buy's Black Friday release, Mashable, GameGavel, ComicBook, and others. Each card shows the product, store, sale price, usual price, discount, dollars saved, the source it was read in, and the check time.

What makes it a finder, not a list:

- **Search** (live, filters as you type) plus filters by **category** (pills), **store**, and **minimum discount** (20% / 40% / 50%+), and sorting by biggest discount, biggest dollar saving, lowest or highest price.
- **An honest verdict on every deal** — NEW LOW (only where a source says all-time low: Beats 360, M6 MacBook Pro, AirTag 2), STRONG DEAL, or ROUTINE SALE (MacBook Neo at 7% off, Apple TV 4K at $10 off) — each with a one-line note saying why.
- **Store comparison**: the same product at two stores (AirPods Pro 3: Walmart $149 vs Amazon $179; MacBook Air M5 13": Amazon $989.10 vs Best Buy $1,049; Switch 2 bundle: Walmart $499 vs Target $499.99) gets a cheapest-first table on its detail page.
- **Stats bar**: deal count, store count, biggest cut (67%), average cut, total savings across the board.
- **Phone layout**: single-column cards, stacked controls, comparison table that drops a column.

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

Open `app/index.html` in desktop Chrome or on a phone. No build step, no network request at runtime — the deals live in `app/data.js` and every file the page loads is under `app/`.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's `vendor/makefun-frontend.ts` (unchanged).

## Files

- `app/index.html` — page shell
- `app/data.js` — the 46 checked deals, with store, prices, source, check time and verdict
- `app/verdicts.js` — money, discount and verdict helpers
- `app/views.js` — deal cards, list page, detail page with store comparison
- `app/main.js` — hash routing, filtering, sorting, live search
- `app/style.css` — dark gold-on-black theme, responsive
- `screenshots/` — real renders of the site in headless Chrome (desktop list, deal detail, filtered search, phone)
