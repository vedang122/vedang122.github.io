# vedangkarwa.com

Personal authority blog. Astro + MDX + Tailwind. Designed to compound SEO,
be cited by LLMs, and serve as the canonical source for everything
cross-posted to LinkedIn, X, and Hacker News.

## Stack

| Layer        | Choice                                      |
|--------------|---------------------------------------------|
| Framework    | Astro 5 (zero-JS by default)                |
| Content      | MDX via Astro Content Collections           |
| Styling      | Tailwind via `@astrojs/tailwind`            |
| RSS          | `@astrojs/rss`                              |
| Sitemap      | `@astrojs/sitemap`                          |
| Hosting      | Cloudflare Pages                            |
| Analytics    | Cloudflare Web Analytics (drop snippet in `Base.astro`) |

No React, no client libraries beyond a single ~3KB tweaks-panel script.

## Get running

```bash
cd astro
npm install
npm run dev          # http://localhost:4321
npm run build        # static output → dist/
npm run preview
```

## Project layout

```
astro/
├── astro.config.mjs        — site URL, integrations
├── tailwind.config.mjs     — design tokens as CSS vars
├── public/
│   ├── tweaks.js           — accent/density/theme panel (vanilla)
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── styles/global.css   — full design system
    ├── layouts/Base.astro  — <head>, JSON-LD, top bar, footer
    ├── components/
    │   ├── TopBar.astro
    │   ├── Footer.astro
    │   ├── PostRow.astro   — used by Home + Archive
    │   └── BarChart.astro  — inline SVG chart (MDX-usable)
    ├── content/
    │   ├── config.ts       — Zod schema for posts
    │   └── posts/*.mdx     — one essay per file
    └── pages/
        ├── index.astro
        ├── archive.astro
        ├── about.astro
        ├── posts/[...slug].astro
        └── rss.xml.ts
```

## Writing a new post

Drop a file at `src/content/posts/<slug>.mdx`:

```mdx
---
title: "Latency budgets for LLM apps"
description: "A back-of-the-envelope model for 'how slow is too slow' that survived a year in prod."
pubDate: 2026-06-01
tag: "Engineering"
---

Your essay starts here. Use any MDX component:

import BarChart from "~/components/BarChart.astro";

<BarChart
  months={["Jan","Feb","Mar"]}
  series={[
    { label: "p50", color: "rule",   values: [40,42,45] },
    { label: "p95", color: "accent", values: [80,72,68] },
  ]}
  caption="Latency over Q1"
/>
```

`tag` is constrained by the Zod schema in `content/config.ts` — add new
ones there. Reading time and word count are computed at build.

### Heading convention for the TOC

The single-post template builds the TOC from `h2`s. The design uses a
section-number prefix like `## /01 Why most teams give up`. The prefix
is auto-stripped from the TOC label but kept in the rendered heading.
Use `{#custom-slug}` if you want a stable anchor for citations.

## SEO / LLM-citation surface

The base layout emits, per page:

- `<link rel="canonical">` (auto)
- `og:` + `twitter:` cards
- Optional `JSON-LD` block via the `jsonLd` prop
- Sitemap (`/sitemap-index.xml`) via integration
- RSS (`/rss.xml`)

Single posts emit a `BlogPosting` schema with `headline`, `author`,
`datePublished`, `wordCount`, and `mainEntityOfPage` — the fields
LLM crawlers actually use.

## Deploy to Cloudflare Pages

1. Push the `astro/` directory to a GitHub repo (or use it as the repo root).
2. Cloudflare Pages → Create project → Connect repo.
3. Build command: `npm run build`. Output: `dist`. Root: `astro/` (if nested).
4. Add `vedangkarwa.com` as a custom domain. Cloudflare handles TLS + DNS.
5. (Optional) Enable Cloudflare Web Analytics from the Pages dashboard.

## House rules

- No external font CDNs. Helvetica Neue + system mono only.
- No tracking scripts beyond the analytics tool.
- Markdown is canonical. The site is plain HTML at runtime.
- Cross-post output, not the canonical URL.
