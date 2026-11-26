# DataNusa — Statistik Indonesia

[![best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/adelbudi88-crypto/best-national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/adelbudi88-crypto/best-national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

**DataNusa** is a national statistics site for Indonesia, built for the
make.fun competition *best-national-statistics-site-20261126-0539*. It is a
static site (vanilla HTML/CSS/JS + Canvas charts, no library, no build step,
no network request) that runs on desktop and on a phone.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## What is inside

- **Beranda** — KPI dashboard (population, GDP, inflation, unemployment,
  poverty, HDI) with a working year selector that re-renders the highlight
  panel, a GDP-growth chart, an explore index, and a list of the latest
  official releases.
- **Penduduk** — census-point population chart with a total/growth tab
  switch, a horizontal bar chart of the 5 most populous provinces, and a
  working province search.
- **Ekonomi** — GDP nominal / growth tab switch, GDP-per-capita table,
  CSV download.
- **Harga & Inflasi** — yearly inflation chart, December-2025 component
  breakdown (core / volatile food / administered prices).
- **Ketenagakerjaan** — unemployment and poverty tab switch, February-2025
  labour figures, provincial TPT, CSV download.
- **Pendidikan** — HDI chart 2022–2025 with a year selector for its
  components (life expectancy, expected / mean years of schooling).
- **Kesehatan** — stunting trend 2019–2024 and a 2013-vs-2024 child
  nutrition comparison, CSV download.
- **Perdagangan** — exports vs imports grouped bars 2021–2024, trade
  balance table, top export destinations, CSV download.
- **Semua Data** — master table 2021–2025: sortable columns, year filter,
  indicator-column search, CSV download.
- **Tentang** — sources, glossary, and method note.

Every page is reached by a link in the top navigation. The header search
finds any of 26 indicators and jumps to its page. All charts are drawn on
Canvas by the site's own code, with hover tooltips, and re-render on resize.

## Data

Every figure was checked against a live public release before it was written
into `app/data.js`: BPS (population, GDP, inflation, Sakernas, Susenas, HDI),
Kemenkes RI (SSGI 2024), Bank Indonesia (inflation analysis), Kemendag PDSI
(trade), and Ditjen Dukcapil Kemendagri (provincial populations). Each page
names its source and reference year. DataNusa is an independent visualisation
and is not affiliated with BPS or any government agency.

## Structure

- `app/index.html` — shell, navigation, header search
- `app/main.js` — hash router, search wiring
- `app/views.js` — one render function per page, all controls
- `app/charts.js` — Canvas line / bar / grouped / horizontal-bar charts
- `app/data.js` — all datasets with sources
- `app/style.css` — system fonts only
- `main.ts` — hands the entry in (copies `app/` + `screenshots/`, writes
  `dossier.json` with the vendored make.fun library)
- `verify.mjs` — Playwright check: console errors, failed/external requests,
  click-through of every route and control, desktop + phone screenshots

## Verify

```sh
node verify.mjs
```

---
<sub>Entered on [make.fun](https://make.fun/bounty/best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
