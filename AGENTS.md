# RAW.VIVES — Repository Instructions

## 1. Product Purpose

This repository powers **raw.vives**, the personal photographic archive of Alex Vicente.

The product is a bilingual editorial photography experience, not a generic portfolio template, SaaS interface, dashboard, or commercial gallery.

The primary goal is to let visitors:

- explore the photographic archive;
- discover curated photographic series;
- open stable, shareable photograph routes;
- move through the archive without losing editorial context;
- understand the authorial point of view;
- contact Alex for collaboration or licensing.

Photography is always the primary content. The interface supports the photographs and must never compete with them.

For product decisions, `PRODUCT.md` is authoritative.

For visual decisions, `DESIGN.md` is authoritative.

---

## 2. Decision Priority

When instructions conflict, use this order:

1. explicit user request;
2. existing production contracts and data integrity;
3. `PRODUCT.md`;
4. `DESIGN.md`;
5. this `AGENTS.md`;
6. existing implementation patterns in nearby code.

Do not introduce new architecture, motion systems, image pipelines, routing strategies, or dependencies simply because another approach is preferable in isolation.

---

## 3. Core Architecture

RAW.VIVES is a **Next.js 16 App Router static-export application**.

```js
output: "export"
```

This is a fundamental architectural constraint.

Production does not run a Next.js application server.

The build produces static assets in:

```text
out/
```

Cloudflare Pages serves the static export.

A Cloudflare Pages Function is used only for root-locale resolution at `/`.

Do not introduce features that require:

- server actions at runtime;
- dynamic Next.js server rendering;
- API routes requiring a running Next server;
- runtime-only server state;
- database-backed rendering;
- server-only secrets during browser execution.

If a feature cannot work with static export, stop and surface the architectural conflict before implementing it.

---

## 4. Runtime and Toolchain

Preserve the existing stack:

- Next.js 16
- React 19
- TypeScript strict mode
- Tailwind CSS 4
- GSAP
- `@gsap/react`
- ScrollTrigger
- Lenis
- Three.js
- Sharp
- Plaiceholder
- Cloudflare Pages
- Wrangler
- pnpm

Required versions:

```text
Node.js 24.18.x
pnpm 11.20.x
```

Use **pnpm only**.

Respect `pnpm-lock.yaml`.

Do not switch to npm, yarn, or bun.

---

## 5. Repository Map

Use this map before searching broadly.

```text
app/
  routes, layouts, metadata, sitemap, robots, manifest

app/[locale]/
  localized routes for ES and EN

components/
  UI systems, archive, series, motion, intro, photo detail

components/ui/
  reusable interface primitives

hooks/
  reusable React/browser hooks

lib/
  data, SEO, i18n, motion, curation, archive logic and utilities

lib/gallery-data.ts
  canonical photographic catalogue and ordering

lib/images-data.json
  generated image metadata — NEVER edit manually

lib/image-loader.ts
  maps Next image widths to pre-generated local variants

lib/dictionary.ts
  supported locales and dictionary loading

lib/home/
  home curation, selectors and validation

lib/archive/
  archive filtering, URL state and selectors

lib/photo-detail/
  photo detail content, SEO and contextual navigation

lib/series/
  photographic-series configuration and logic

lib/motion/
  shared motion infrastructure

dictionaries/
  localized ES/EN interface copy

public/photos/raw/
  versioned web source photographs used by the image pipeline

public/photos/optimized/
  generated WebP/AVIF variants

public/_headers
  Cloudflare cache policy, CSP and security headers

scripts/
  image pipeline, validation, static preview and release utilities

tests/
  unit, contract and production tests

tests/e2e/
  Playwright smoke/browser tests

docs/
  system documentation and release references

PRODUCT.md
  durable product rules

DESIGN.md
  visual system and design authority
```

Inspect the smallest relevant area first.

Expand to adjacent systems only when the task requires it.

---

## 6. Internationalization

Supported locales are exactly:

```text
es
en
```

They are defined in `lib/dictionary.ts`.

Localized routes live under:

```text
/es/...
/en/...
```

The root route `/` is not a third locale.

Production root resolution uses this priority:

1. valid `raw-vives-locale` cookie;
2. primary `Accept-Language`;
3. English fallback.

Spanish variants resolve to `/es`.

Everything else resolves to `/en`.

The root response is a temporary `307`.

Do not introduce another locale or locale prefix without explicitly updating the localization contract.

### Translation rules

- Keep ES and EN structurally equivalent.
- The Spanish dictionary defines the interface shape.
- Add new dictionary keys in both languages.
- Reuse localized content helpers instead of language conditionals inside components.
- Do not duplicate stable catalogue data merely to translate copy.
- Preserve stable photograph IDs across locales.

---

## 7. Photography Data Model

`lib/gallery-data.ts` is the primary source of truth for the photographic catalogue.

Photograph IDs are stable public identifiers.

Do not:

- reuse retired IDs;
- renumber existing photos casually;
- duplicate photo objects in components;
- derive editorial order from filenames;
- introduce random ordering.

Photograph order can affect:

- archive presentation;
- previous/next navigation;
- contextual navigation;
- home curation;
- related-photo behavior.

Treat changes to catalogue order as product changes, not formatting changes.

---

## 8. Image Pipeline

The image pipeline is a core system.

Sources:

```text
public/photos/raw/
```

Generated outputs:

```text
public/photos/optimized/
lib/images-data.json
```

`lib/images-data.json` is generated.

**Never edit it manually.**

To add or replace photographic sources, use the existing pipeline.

Typical flow:

```bash
pnpm optimize-images
pnpm test
pnpm typecheck
pnpm build
```

The optimizer generates local responsive derivatives including:

- WebP;
- AVIF;
- image dimensions;
- blur placeholders;
- allowed EXIF-derived metadata.

`lib/image-loader.ts` maps requested widths to existing local variants.

Do not replace the custom loader with the default Next.js image loader.

Do not point gallery images at remote image URLs without an explicit architectural decision.

---

## 9. Private and Published Assets

The repository may contain production-safe web sources under:

```text
public/photos/raw/
```

These are not original camera RAW files.

Do not add:

- camera RAW files;
- Lightroom catalogs;
- sidecars;
- private working exports;
- unapproved source materials;
- unused large originals.

The production build intentionally removes private/process assets where required.

Do not weaken `prune-private-assets` or image validation to make a build pass.

---

## 10. Home Curation

Home photography is curated deliberately.

Relevant authority:

```text
lib/home/curation.ts
lib/home/validation.ts
lib/home/selectors.ts
docs/RAW_VIVES_CURATION_SYSTEM.md
```

Do not select home photography directly inside components.

Components consume curated data; they do not create a second curatorial source of truth.

### Rules

- use stable photograph IDs;
- do not silently substitute missing IDs;
- avoid unintended duplicate prominence;
- preserve category validity;
- preserve editorial ordering;
- respect existing series membership constraints;
- let validation fail when curation becomes inconsistent.

Do not reopen curation while solving an unrelated UI task.

---

## 11. Archive

The full archive lives in the localized archive experience.

Archive state may include:

- category;
- year;
- search;
- ordering;
- visible batch.

These states are intentionally reflected in the URL where implemented.

Relevant code lives primarily under:

```text
components/archive/
lib/archive/
```

Do not create a second archive filtering implementation.

Preserve shareable URL state.

Preserve return context when moving from the archive to a photo and back.

Direct entry to a photo must never depend on `sessionStorage`.

---

## 12. Photographic Series

Series are first-class editorial entities.

Relevant areas:

```text
app/[locale]/series/
lib/series/
docs/RAW_VIVES_PHOTO_SERIES_SYSTEM.md
```

Only published and valid series should generate static routes.

Do not:

- assign a photograph to multiple incompatible series;
- create routes without corresponding valid data;
- use series presentation as another generic gallery;
- change series membership casually while working on unrelated UI.

Series routes must remain valid under static export.

---

## 13. Photo Detail Routes

Photograph detail pages are statically generated.

Relevant route:

```text
app/[locale]/photo/[id]/page.tsx
```

Photo detail logic is separated under:

```text
components/photo-detail/
lib/photo-detail/
```

Preserve:

- static generation;
- stable IDs and aliases;
- canonical URLs;
- localized metadata;
- `ImageObject` structured data;
- previous/next context;
- related-photo behavior;
- direct-route independence.

Do not move photo-detail data logic into UI components when an existing selector/helper owns it.

---

## 14. SEO

SEO is part of the product contract.

Preserve:

- localized canonicals;
- `hreflang`;
- `x-default`;
- sitemap;
- robots;
- Open Graph;
- JSON-LD;
- photograph `ImageObject` data.

Production site origin comes from:

```text
NEXT_PUBLIC_BASE_URL
```

Expected production value:

```text
https://rawvives.aleviclop.dev
```

The root locale resolver is intentionally excluded from the sitemap.

Do not hardcode production URLs when existing site configuration helpers exist.

Any routing, locale, photograph-slug, or series-route change requires SEO review.

---

## 15. Contact and Web3Forms

The project uses Web3Forms.

The current integration uses:

```text
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
```

This is intentionally a **public build-time identifier**, not a server secret.

Do not incorrectly migrate it into server-only logic unless the architecture changes.

Do not hardcode the real identifier in source code.

Domain restrictions must remain configured at the provider.

When modifying contact/licensing flows, preserve:

- accessible labels;
- validation;
- localized states;
- error handling;
- privacy information.

---

## 16. Design System

`DESIGN.md` is the visual authority.

Creative North Star:

**The Projected Archive**

The experience should feel:

- nocturnal;
- tactile;
- exact;
- editorial;
- photographic;
- restrained.

Photography carries the visual expression.

The interface behaves like precise museum labeling around it.

Avoid:

- SaaS cards;
- dashboard aesthetics;
- generic gallery templates;
- gamer neon;
- decorative glow;
- permanent glassmorphism;
- arbitrary gradients;
- excessive luxury-fashion imitation;
- unnecessary rounded pills;
- effects competing with photographs.

Do not create a new visual language while solving a localized design task.

---

## 17. Motion

Motion is progressive enhancement.

GSAP, ScrollTrigger and Lenis are already coordinated through shared infrastructure.

Do not create independent global instances or duplicate registrations.

Relevant areas include:

```text
lib/motion/
components/motion/
hooks/
MotionProvider
```

### Rules

- respect `prefers-reduced-motion`;
- respect forced-colors behavior;
- keep touch experiences functional without smooth-scroll assumptions;
- use scoped GSAP contexts;
- clean up ScrollTriggers;
- clean up observers/listeners;
- clean up RAF loops;
- avoid layout-animation properties when transforms/opacity suffice;
- do not add scrubbed motion to archive/control-heavy surfaces without a real reason;
- do not animate every photograph merely for consistency.

Motion must improve hierarchy, continuity, navigation, or feedback.

---

## 18. WebGL and Progressive Enhancement

Three.js/WebGL must remain optional.

The site must remain fully usable if:

- WebGL is unavailable;
- reduced motion is enabled;
- forced colors are enabled;
- the device is constrained;
- JavaScript enhancement fails.

Never make core photographic content depend on WebGL.

Do not increase initial JavaScript materially for a decorative effect without evidence that the effect justifies the cost.

---

## 19. Accessibility

Target WCAG 2.2 AA.

Preserve:

- semantic landmarks;
- logical heading hierarchy;
- keyboard navigation;
- visible focus;
- focus restoration;
- minimum 44 × 44 px touch targets;
- 200% zoom usability;
- reduced-motion support;
- forced-colors support;
- appropriate image alt text;
- accessible forms and error messages.

Photo alt text is content, not an SEO keyword container.

For meaningful interface changes, verify at:

```text
320 px mobile baseline
representative tablet width
desktop
ultrawide where layout behavior changes
```

Do not treat a desktop screenshot as sufficient responsive validation.

---

## 20. Cloudflare and Security Headers

Production security policy lives in:

```text
public/_headers
```

This includes:

- CSP;
- caching;
- HSTS;
- Permissions Policy;
- frame restrictions;
- referrer policy.

Do not weaken the global CSP merely to make a new feature work.

Any new external origin requires explicit review.

Preserve the existing narrow allowlist for Web3Forms and local media.

Cloudflare deployment configuration and release behavior are documented in:

```text
docs/RAW_VIVES_DEPLOYMENT.md
docs/RAW_VIVES_RELEASE_SYSTEM.md
```

---

## 21. Static Export Caveats

With `output: "export"`, development behavior and production static behavior may differ.

A dynamic route parameter not included in `generateStaticParams()` can produce an error during `next dev` even though production static hosting correctly returns a 404.

Therefore:

- do not diagnose every dynamic dev error as a production routing bug;
- verify static-route/404 behavior against `out/` or the Cloudflare preview when relevant.

Do not use `next start` as the authoritative production simulation.

Use:

```bash
pnpm preview
```

for the generated static site.

---

## 22. Coding Conventions

Follow surrounding code.

The project uses strict TypeScript.

Prefer Server Components unless browser state, animation, effects, or browser APIs require a client component.

Keep `"use client"` boundaries narrow.

Reuse existing:

- components;
- hooks;
- selectors;
- data helpers;
- image utilities;
- localization helpers;
- motion infrastructure.

Do not:

- duplicate existing logic;
- introduce a dependency for trivial functionality;
- perform broad refactors while fixing a focused issue;
- restructure unrelated folders;
- create a new framework abstraction for a one-off feature.

---

## 23. Task Routing

Before editing, classify the task.

### Product / photographic positioning

Read:

```text
PRODUCT.md
relevant editorial data
```

### Visual/UI work

Read:

```text
DESIGN.md
target component
nearby shared UI primitives
```

### Home curation

Read:

```text
lib/home/curation.ts
lib/home/validation.ts
docs/RAW_VIVES_CURATION_SYSTEM.md
```

### Images / photographs

Read:

```text
lib/gallery-data.ts
lib/image-loader.ts
scripts/optimize-images.ts
relevant image-pipeline tests
```

### Archive

Read:

```text
lib/archive/
components/archive/
relevant archive tests
```

### Series

Read:

```text
lib/series/
app/[locale]/series/
docs/RAW_VIVES_PHOTO_SERIES_SYSTEM.md
```

### Photo detail

Read:

```text
lib/photo-detail/
components/photo-detail/
app/[locale]/photo/[id]/page.tsx
```

### Motion

Read:

```text
lib/motion/
components/motion/
relevant motion documentation
```

### i18n

Read:

```text
lib/dictionary.ts
dictionaries/es.json
dictionaries/en.json
```

### SEO / routing

Read:

```text
site configuration
affected route
sitemap/robots helpers
relevant SEO tests
```

### Deployment / headers

Read:

```text
public/_headers
wrangler configuration
RAW_VIVES_DEPLOYMENT.md
RAW_VIVES_RELEASE_SYSTEM.md
```

Do not scan the whole repository before every task.

---

## 24. Validation Strategy

Validation must be proportional to the change.

### Small TypeScript/component change

Run:

```bash
pnpm typecheck
```

and the nearest relevant test if one exists.

`pnpm lint` currently aliases typechecking, so do not run both merely to duplicate the same validation unless the workflow explicitly requires it.

### Logic/data change

Run:

```bash
pnpm typecheck
pnpm test
```

plus focused validation for the affected system.

### Image pipeline change

Run:

```bash
pnpm optimize-images
pnpm test
pnpm build
```

when image sources or generated metadata change.

### Routing / static generation / SEO change

Run:

```bash
pnpm test
pnpm build
```

and inspect relevant static output.

### UI / interaction change

Run relevant tests and verify in browser.

For production-like behavior:

```bash
pnpm build
pnpm preview
```

### Substantial release-ready change

Use:

```bash
pnpm check
git diff --check
```

and browser smoke testing when relevant.

Playwright is available through:

```bash
pnpm e2e
```

Do not claim a validation passed unless it actually ran successfully.

Distinguish pre-existing failures from failures introduced by the current work.

---

## 25. Development Commands

Use:

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm preview
pnpm typecheck
pnpm lint
pnpm test
pnpm e2e
pnpm optimize-images
pnpm build
pnpm check
pnpm deploy:pages
```

Notes:

- `pnpm lint` currently aliases `pnpm typecheck`.
- `pnpm build` validates photo-process data, runs the static Next build and removes private assets.
- `pnpm preview` serves the static output with Wrangler.
- `pnpm deploy:pages` performs a production deployment and must never be run without explicit authorization.

---

## 26. Deployment

Do not push or deploy unless explicitly requested.

A deployment is not a validation command.

Do not run:

```bash
pnpm deploy:pages
```

for testing.

Use local preview instead.

When deployment is explicitly authorized, follow the documented release process rather than improvising a Wrangler command.

---

## 27. Git

Work on the current branch.

Do not:

- create a branch;
- switch branches;
- force-push;
- rewrite history;
- commit;
- push;
- create a Pull Request;

unless explicitly requested.

Keep requested commits focused and use the repository's established commit conventions.

---

## 28. Copyright and Asset Integrity

Photography, copy and visual assets are protected work.

Do not:

- replace photographs with stock imagery;
- import third-party imagery without explicit approval;
- upload project photographs to external services unnecessarily;
- redistribute original assets;
- use repository photographs as training material;
- alter authorship/licensing language casually.

Preserve photographic filenames, IDs and metadata relationships unless the task explicitly requires change.

---

## 29. Completion Criteria

A task is complete when:

1. the requested behavior works;
2. static-export compatibility is preserved;
3. photographic/data contracts remain valid;
4. relevant ES/EN implications are handled;
5. accessibility, SEO, performance, security and motion implications are checked when affected;
6. the narrowest relevant validation succeeds;
7. no errors introduced by the change remain.

At completion report only:

- what changed;
- validation actually performed;
- any material limitation, risk or follow-up.
