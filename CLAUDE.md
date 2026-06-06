This file is automatically read by Claude Code or Open AI codex or any other AI agent at the start of every session. It contains the rules, conventions, and constraints for this project. Read it before making changes.

---

## Project at a glance

A personal authority blog focused on **tech / software / AI / Startups** topics, built to:

1. Compound SEO authority on an owned domain (not on a third-party platform).
2. Be cited by LLMs (ChatGPT, Perplexity, Google AI Overviews) via clean semantic HTML and structured data.
3. Be the canonical source for content cross-posted to LinkedIn, X, Substack, and Hacker News.

Owner: `Vedang` — fill this in once and reference it everywhere.
---

## Tech stack — do not deviate without explicit approval

| Layer            | Choice                                           | Why                                                             |
| ---------------- | ------------------------------------------------ | --------------------------------------------------------------- |
| Framework        | **Astro** (latest stable)                        | Zero-JS by default; ideal for content sites and Core Web Vitals |
| Content          | **Markdown / MDX** via Astro Content Collections | Type-safe frontmatter, fast builds                              |
| Styling          | **Tailwind CSS** via `@astrojs/tailwind`         | Utility-first; no runtime cost                                  |
| Hosting          | **Cloudflare Pages**                             | Free, edge network, fast TTFB                                   |
| Domain registrar | **Cloudflare Registrar**                         | At-cost pricing, DNS in same place                              |
| Analytics        | **Cloudflare Web Analytics** or **Plausible**    | Privacy-friendly, no cookie banner needed                       |
| Search Console   | Google Search Console + Bing Webmaster Tools     | Submit sitemap on day one                                       |

**Do NOT add:** React (unless explicitly needed for an interactive island), heavy client-side libraries, jQuery, Bootstrap, custom fonts loaded from external CDNs, tracking scripts beyond the analytics tool above.

---

## Commands

```bash
npm install                # install deps
npm run dev                # local dev server at http://localhost:4321
npm run build              # build to ./dist
npm run preview            # preview the production build locally
npm run astro -- check     # type-check content collections + Astro files
```

Deploy is automatic: push to `main` → Cloudflare Pages builds and deploys.
## 2. Repository layout

```
.
├── CLAUDE.md                  ← this file
├── index.html                 ← STATIC DESIGN MOCKS (do not edit unless asked)
├── archive.html               ← static mock
├── about.html                 ← static mock
├── posts/code-review-skill.html  ← static mock
├── assets/                    ← style.css + tweaks.js for the mocks
└── astro/                     ← THE REAL PROJECT (everything ships from here)
    ├── README.md
    ├── package.json
    ├── astro.config.mjs
    ├── tailwind.config.mjs
    ├── tsconfig.json
    ├── public/
    │   ├── tweaks.js
    │   ├── favicon.svg
    │   └── robots.txt
    └── src/
        ├── styles/global.css
        ├── layouts/Base.astro
        ├── components/
        │   ├── TopBar.astro
        │   ├── Footer.astro
        │   ├── PostRow.astro
        │   └── BarChart.astro
        ├── content/
        │   ├── config.ts
        │   └── posts/*.mdx
        └── pages/
            ├── index.astro
            ├── archive.astro
            ├── about.astro
            ├── posts/[...slug].astro
            └── rss.xml.ts
```

---
### Two-tree model

- The **root `*.html` files + `assets/`** are static, hand-built design
  mocks. They exist as a visual reference. Touch them **only** if Vedang
  explicitly asks for a design tweak that should be visible without
  running the dev server.
- The **`astro/` directory is the real project.** Everything that ships
  to `vedangkarwa.com` is built from here. Default to changing `astro/`.

If a change is design-only (new color, new layout idea), it likely
belongs in `astro/src/styles/global.css` so the mock and the live site
stay in sync — but updating the mock too is a nice-to-have, not a
requirement.

---

## 3. Tech stack — do not deviate without explicit approval

| Layer            | Choice                                      | Why                                |
|------------------|---------------------------------------------|------------------------------------|
| Framework        | **Astro** (latest stable)                   | Zero-JS by default                 |
| Content          | **Markdown / MDX** via Content Collections  | Type-safe frontmatter              |
| Styling          | **Tailwind** via `@astrojs/tailwind` + a CSS-vars design system in `global.css` | Utility-first; tokens are the source of truth |
| Code highlight   | Built-in **Shiki** (light + dark themes)    | Compile-time, no runtime cost      |
| RSS              | `@astrojs/rss`                              | Standard                           |
| Sitemap          | `@astrojs/sitemap`                          | Generated at build                 |
| Hosting          | **Cloudflare Pages**                        | Free edge network                  |
| Registrar        | **Cloudflare Registrar**                    | At-cost, DNS in same place         |
| Analytics        | **Cloudflare Web Analytics** *or* **Plausible** | Privacy-friendly, no cookie banner |
| Webmaster tools  | Google Search Console + Bing Webmaster      | Submit sitemap on day one          |

### Do NOT add without explicit approval

- **React** (or Vue, Svelte, Solid). If you genuinely need interactivity,
  use a tiny `<script>` block in the relevant `.astro` file. Reach for a
  framework only if Vedang asks for it explicitly.
- **jQuery, Bootstrap, MUI, Chakra, shadcn, daisyUI**, or any UI kit.
- **Heavy client-side libraries** (Framer Motion, lodash, moment, axios,
  three.js, GSAP, anime.js, etc.).
- **External font CDNs** (Google Fonts, Adobe Fonts, Bunny Fonts). Type
  is the system Helvetica + system mono stacks. Period.
- **Tracking scripts** beyond the chosen analytics tool. No GTM, no
  Segment, no Hotjar, no Meta Pixel.
- **Image-CDN SaaS** (Cloudinary, imgix). Use Astro's `<Image>` and let
  Cloudflare cache.
- **Comments systems** (Disqus, Giscus). Out of scope.

If a task seems to require any of the above, **stop and ask** before
installing it. Suggest an alternative inside the existing stack first.

---

## 4. Local development

```bash
cd astro
npm install
npm run dev        # http://localhost:4321
npm run build      # static output → dist/
npm run preview    # serve dist/ locally
```

Node 20+ recommended.

There is no test suite yet. Don't introduce one without asking — for a
static content site, type-checking + a build that succeeds is the bar.

---

## 5. Content model

Posts live in `astro/src/content/posts/*.mdx`. The schema is enforced
by Zod in `astro/src/content/config.ts`:

```ts
{
  title: string,
  description: string,
  pubDate: Date,
  updatedDate?: Date,
  tag: "Practice" | "Workflow" | "Engineering" | "Postmortem"
     | "Startups" | "LLMs" | "Fitness" | "Meta",
  draft: boolean (default false),
  canonical?: string (URL),
}
```

### Rules for new posts

1. **One MDX file per essay.** Filename = slug. Use kebab-case.
2. **Frontmatter validates at build.** A bad `tag` fails the build —
   that's intentional.
3. **`draft: true` hides the post** from the index, archive, and RSS.
4. **Headings use the `## /NN Title` convention.** The `/NN` is a
   visual section number, **not** part of the heading text. A rehype
   plugin (`src/plugins/rehype-section-numbers.mjs`) strips the `/NN `
   prefix at build, moves it onto a `data-n` attribute, and the CSS
   `.prose h2::before { content: attr(data-n) }` renders it as the small
   mono accent badge. **Do not** style or rely on `/NN` being inline —
   if you remove the plugin, the empty `::before` plus the heading's
   `display:flex; gap:14px` will silently indent every heading ~14px to
   the right of the body text. Heading IDs are auto-generated by Astro's
   slugger from the **cleaned** text — the plugin runs first, so the
   number is excluded (e.g. `## /01 Why most teams give up` →
   `id="why-most-teams-give-up"`). The TOC reads Astro's collected
   headings, so its links stay in sync automatically. **Do NOT use the
   `{#custom-slug}` syntax** — MDX parses `{...}` as a JSX expression
   before any remark plugin can rewrite it, so the build fails with
   `[@mdx-js/rollup] Could not parse expression with acorn`. If you
   genuinely need a guaranteed-stable anchor (e.g. a heading you plan
   to rename while preserving inbound links), drop down to inline HTML
   for that one heading: `<h2 id="why">/01 Why most teams give up</h2>`
   (set `data-n` yourself there too if you want the badge).
5. **`<p class="lead">…</p>` for the opening paragraph.** It renders
   larger and in full-strength foreground color.
6. **Code blocks** use triple-fence with a language. Shiki handles
   highlighting at build.
7. **Charts and diagrams** should be `BarChart.astro` or an inline SVG.
   Do not import a charting library.
8. **Images** belong in `astro/src/assets/posts/<slug>/` and are imported
   into the MDX via `import { Image } from "astro:assets"`. Never link
   to remote image hosts.

### Adding a new `tag`

Edit the `z.enum([...])` in `content/config.ts`. Also consider whether
the archive page filter chips need a reordering — they're auto-generated
from tag counts, sorted descending.

---

## 6. Pages and components — what lives where

| File | Responsibility |
|------|----------------|
| `layouts/Base.astro` | `<head>`, meta tags, OG, Twitter, JSON-LD slot, anti-FOUC theme script, top bar, footer, tweaks-panel script. Every page uses this. |
| `components/TopBar.astro` | Brand + nav + meta line. Accepts `active` prop to mark the current nav item. |
| `components/Footer.astro` | Mega wordmark + socials + copyright. |
| `components/PostRow.astro` | Single row in the post list. Used by both `index.astro` and `archive.astro`. **If you change post-row markup, change it here, not in the pages.** |
| `components/BarChart.astro` | Two-series inline SVG chart. Reusable from MDX. Add new chart components alongside it — keep them pure SVG, zero deps. |
| `pages/index.astro` | Hero + recent 5 posts + about strip. |
| `pages/archive.astro` | All posts grouped by year + tag-filter chips (filtering is plain DOM). |
| `pages/about.astro` | Bio, timeline, contact, colophon. |
| `pages/posts/[...slug].astro` | Single-post template. TOC, reading progress, cite block, share buttons, `BlogPosting` JSON-LD. |
| `pages/rss.xml.ts` | RSS feed. Honors `draft`. |

When adding a new page:

1. Wrap it in `<Base title=… description=… nav=… screenLabel=…>`.
2. Use existing CSS classes from `global.css` before inventing new ones.
3. Add a `nav` value to `Base.Props` if it should highlight in the top
   bar (currently `"index" | "archive" | "about" | "none"`).

---

## 7. Design system (`astro/src/styles/global.css`)

The design system is **CSS-variable based**, with Tailwind layered on
top for utility classes. Tokens are the source of truth — Tailwind reads
them via `tailwind.config.mjs`.

### Token model

- **Theme** — `[data-theme="light" | "dark"]` on `<html>`.
- **Accent** — `[data-accent="violet" | "orange" | "blue" | "green"]`.
- **Density** — `[data-density="comfortable" | "compact"]`.

All three are persisted in `localStorage` under `vedang_tweaks_v1` and
applied before first paint by an inline script in `Base.astro`. Do
**not** move that inline script into an external file — it has to be
synchronous before paint to prevent FOUC in dark mode.

### Key variables

```
--bg / --bg-soft / --fg / --fg-soft / --muted
--rule / --rule-soft
--accent / --accent-ink
--hl
--f-sans / --f-mono
--gap / --pad / --maxw
--row-pad-y / --hero-size / --section-mt
```

When introducing a new color or spacing token, **add it as a CSS
variable** (with a dark-mode override if relevant). Never hardcode hex
values in components or pages.

### Typography

- Sans: Helvetica Neue stack. Never load a webfont.
- Mono: system mono stack. Used for meta, eyebrows, code, the
  topbar/footer chrome.
- Headings use `letter-spacing: -0.025em` to `-0.045em` (tighter for
  bigger). `font-weight: 900` for the heroic stuff.
- Body prose is `19px / 1.65` inside `.prose`. Don't shrink it.

### Class vocabulary

Use these instead of inventing new ones:

- Layout: `.wrap`, `.rule`, `.section`, `.sec-head`, `.sec-num`,
  `.sec-title`, `.sec-aside`
- Hero: `.hero`, `.hero-eyebrow`, `.hero-sub`, `.hero-foot`
- Buttons: `.btn`, `.btn.primary`
- Lists: `.post-list`, `.post-row`, `.post-row .num/.title/.dek/.meta/.tag`
- About: `.about-strip`, `.about-grid`, `.about-side`, `.about-prose`, `.kv`
- Archive: `.arc-head`, `.arc-filters`, `.chip`, `.arc-year`
- Single post: `.post-hero`, `.crumbs`, `.post-meta`, `.post-body`,
  `.toc`, `.prose`, `.cite-block`, `.post-end`
- Tweaks panel: `.tw-panel`, `.tw-head`, `.tw-body`, `.tw-row`,
  `.tw-swatches`, `.tw-sw`, `.tw-seg`

### When to add Tailwind utilities vs. CSS

- **Page-level layout + design-system primitives** → `global.css`.
- **One-off positioning, spacing, alignment** inside an `.astro` file →
  Tailwind utilities are fine.
- **Component-level reusable styles** → new class in `global.css`.

Heuristic: if the same pattern shows up twice, name it in CSS.

---

## 8. Performance budget (treat as load-bearing)

- **JS shipped on a content page**: < 5 KB gzipped (currently ~3 KB
  from `tweaks.js` and the post-page progress script).
- **CSS**: one file, < 25 KB gzipped.
- **First paint**: should not depend on any network request beyond the
  HTML itself for non-post pages.
- **Lighthouse**: 100 / 100 / 100 / 100 is the baseline. Any change that
  drops a category below 95 is a regression and must be justified.

If you add a feature that ships JS, justify the cost in the PR
description and consider whether it can be an Astro island
(`client:visible`) instead of a global script.

---

## 9. SEO / LLM-citation conventions

The site is built to be cited. Don't break these:

1. **Every page sets `<link rel="canonical">`** via `Base.astro`.
2. **Every post emits a `BlogPosting` JSON-LD** with `headline`,
   `description`, `author`, `datePublished`, `dateModified`, `wordCount`,
   `mainEntityOfPage`, `keywords`.
3. **`og:` + `twitter:` tags** on every page.
4. **Semantic HTML.** `<article>`, `<aside>`, `<nav aria-label>`,
   `<section>`, `<header>`, `<footer>`. No `<div>`-soup for structure.
5. **Headings monotonic.** One `<h1>` per page. `<h2>` for sections,
   `<h3>` for sub-sections. Never skip.
6. **Cite block** on every post (`/// Cite this post`) — gives LLMs a
   pre-formatted citation. Do not remove.
7. **`<time datetime="...">`** wherever a date is rendered for users.
   (TODO if missing — fine to add.)
8. **`rel="me"`** on outbound socials in the top bar — supports identity
   verification.
9. **`/sitemap-index.xml`** is auto-generated. **`/rss.xml`** is
   hand-authored. Both must remain reachable from `robots.txt`.

### Cross-posting policy

Posts are written here first and may be syndicated to LinkedIn, X,
Substack, or Hacker News. **The post's `canonical` always points back
to `vedangkarwa.com`.** If a post was originally published elsewhere, set the
`canonical` frontmatter field — but the default (auto-canonical to
vedangkarwa.com) is the right answer in 95% of cases.

---

## 10. Accessibility

- Color contrast: minimum WCAG AA. The violet/orange accents on
  `--bg-soft` are borderline — test if you change them.
- All interactive elements reachable by keyboard. Focus ring is
  `outline: 2px solid var(--accent); outline-offset: 3px;` — defined
  globally in `global.css`. Don't override it per-component.
- Images: every `<img>` needs `alt`. Decorative SVGs get
  `role="presentation"` or `aria-hidden="true"`.
- `prefers-reduced-motion`: respect it. The only animation currently is
  the `.live` pulse — wrap any new motion in
  `@media (prefers-reduced-motion: no-preference) { … }`.

---

## 11. Tweaks panel (`public/tweaks.js`)

The little floating panel that controls accent / density / theme. It is
a **vanilla web component-ish script**, no framework. It speaks a
`postMessage` protocol so an external host (the design tool) can toggle
it; in production it's harmless because no host ever sends those
messages.

### Don't

- Convert it to React.
- Add new tweaks without asking — Vedang signed off on three.
- Remove the inline `localStorage`-application script from
  `Base.astro` — it prevents FOUC.

### Do

- If you change the schema (key names, valid values), bump the
  storage-key suffix: `vedang_tweaks_v1` → `v2`. Add a tiny migration
  inline or just accept that old values reset.

---

## 12. Deploying

- **Cloudflare Pages**: build command `npm run build`, output dir
  `dist`, root directory `astro/` (if the repo root contains the design
  mocks).
- **Custom domain**: `vedangkarwa.com`. Cloudflare handles TLS + DNS.
- **Analytics**: enable Cloudflare Web Analytics from the Pages
  dashboard. The beacon snippet is **not** in `Base.astro` by default —
  add it as a `<script is:inline>` in `<head>` once Vedang chooses
  CF vs. Plausible.
- **Preview deploys**: every PR gets one automatically.

---


## 13. Conventions for AI coding agents

### Workflow

1. **Read this file fully before editing.**
2. Default to changing files in this folder, not the root mock files.
3. For non-trivial changes, write a one-paragraph plan first.
4. Make the smallest change that achieves the goal.
5. After editing, mentally run `npm run build` and `tsc --noEmit`. If a
   change touches `content/config.ts` or any `.astro` props, verify
   types still line up.

### Style

- Astro components: frontmatter (`---`) for logic, props typed via
  `interface Props`, then markup. Keep components under 200 lines —
  split if longer.
- Prefer **CSS Grid and Flexbox with `gap`** over margin hacks.
- Prefer **CSS variables and existing classes** over new Tailwind
  utilities for design-system concerns.
- Prefer **server-rendered HTML** over a client island. If a feature
  *requires* JS, scope it to the smallest page possible.
- Quotes: double for HTML attributes, single for TS strings, backticks
  for template literals.
- Naming: camelCase for variables/functions, PascalCase for components,
  kebab-case for filenames and CSS classes, SCREAMING_SNAKE_CASE for
  storage keys.

### Things to never do silently

- Install a new dependency without naming it in the response.
- Pin to a specific minor of Astro (use the `^x.y` range from
  `package.json`).
- Change `astro.config.mjs`'s `site` value — it's used by RSS, sitemap,
  canonical URLs, and OG tags.
- Touch `posts/*.mdx` published dates. Use `updatedDate` for revisions.
- Delete the `cite-block`, the `BlogPosting` JSON-LD, or the canonical
  link — they're the LLM-citation surface.
- Add a cookie banner. There are no cookies that require one.

### When you're unsure

Ask Vedang. A 30-second clarification is cheaper than reverting an
opinionated change. Especially for: new pages, new dependencies, new
content models, new design tokens.

---

## 14. Common tasks — quick reference

### Add a new post
1. Create `src/content/posts/<slug>.mdx`.
2. Fill frontmatter (`title`, `description`, `pubDate`, `tag`).
3. Use the `## /NN Title` heading convention.
4. `npm run dev` — verify TOC, reading time, archive entry, RSS item.

### Add a new tag
1. Add the string to the `z.enum([...])` in `content/config.ts`.
2. Use it on at least one post.
3. The archive filter chip appears automatically.

### Add a new chart
1. Either reuse `BarChart.astro` from MDX, or
2. Create a new SVG component next to it. **No charting libraries.**

### Change the accent palette
1. Edit the `[data-accent="..."]` blocks in `global.css`.
2. Mirror the change in `public/tweaks.js` (the swatch list).
3. Test in both light and dark mode.

### Add an interactive feature
1. First ask: can this be a CSS-only solution? (`:has`, `:target`,
   `<details>`.)
2. If not, write a small inline `<script>` in the relevant `.astro`
   file.
3. Only consider a framework island if the feature has real state.

### Audit before shipping
- `npm run build` succeeds.
- `dist/` size hasn't ballooned.
- `dist/sitemap-index.xml` and `dist/rss.xml` exist and list new posts.
- View source on a post: canonical, JSON-LD, OG tags all present.
- Toggle dark mode — no FOUC, all contrast still readable.

---

## 15. Out-of-scope (don't proactively build these)

- Search. A 50-post site doesn't need it. If asked, use a static index
  + a tiny script, not Algolia.
- Comments.
- Newsletter signup. Vedang said no newsletter.
- A CMS. The MDX-in-Git flow *is* the CMS.
- Multi-language / i18n.
- A separate `/notes` short-form section. May come later — wait.

---

*Last meaningful update: 17 May 2026. Keep this file accurate. If you
change a stack choice, update this file in the same PR.*