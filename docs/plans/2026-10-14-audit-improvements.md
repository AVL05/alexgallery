# RAW.VIVES audit improvements — implementation plan

**Goal:** Resolve the 17 audited issues while preserving static export, catalogue IDs, series membership, and ES/EN parity.

**Architecture:** Reuse existing components and selectors. Normalize Windows-exported Next segment filenames after build; do not replace routing or patch installed dependencies. Keep contact drafts in component memory only.

**Stack:** Next.js 16, React 19, TypeScript, GSAP, Three.js, Cloudflare Pages, pnpm.

## Execution

1. Regressions: add static segment fixture tests, independent Spanish alt checks, and browser coverage for navigation, tablet filters, skip links, drafts and licensing.
2. Static delivery: fix segment filenames in `scripts/normalize-static-export.ts`, wire `package.json`, and validate actual client navigation with Wrangler.
3. Navigation/accessibility: align archive destinations, repair main targets, use one filter breakpoint, and correct the hero scroll cue.
4. Contact: preserve drafts, prefill a valid catalogue photograph from the detail link, focus invalid fields, preserve input on errors, and offer localized retry/email recovery.
5. SEO/content: fix social images and duplicate titles, localize home social metadata, correct copyright wording, add concise Spanish alt text, and refine existing series descriptions without invented facts.
6. Visual/motion: reduce frame prominence and mobile complexity, repair embedded GLB textures and GSAP scale warnings, compact archive/series headers, and clarify the selected-work page.
7. Verification: typecheck, unit tests, static build, export checks, E2E against Wrangler at mobile/tablet/desktop widths, reduced motion, forced colors, and browser inspection. No commits, pushes or deployment.

## Acceptance

- Client navigation and all metadata assets work from `out/`.
- Every audit item has an implemented change and relevant evidence.
- No image source, generated image JSON, photo ordering, or series membership changes.
- Drafts never leave the browser except on an explicit form submission.
- Report actual checks and remaining limitations.

## Verification — 2026-10-14

- Implemented all 17 audit items across routing, navigation, contact, metadata,
  editorial content, accessibility and visual hierarchy.
- `pnpm check`: PASS (typecheck/lint, 152 unit/contract tests, static build).
- `pnpm e2e`: PASS, 26 tests against a fresh Wrangler instance. Covers client
  navigation, 390/820 px filters, ES/EN keyboard skip links, separate drafts,
  licensing prefill, fullscreen focus restoration, real social image MIME,
  reduced motion at 320/390/820/1440/2560 px and forced colors.
- Provider rejection: exercised with an intercepted response and a fictitious
  build-time identifier. No real submission; final build restores original env.
- Static inspection: 194 localized HTML documents, one h1 and canonical each,
  no repeated brand in titles, no published raw sources, social PNG present.
- Browser review: GLB textures load without the prior console errors; the main
  eclipse remains visible beside the smaller brand and secondary frames.
- No image source/generated JSON/order/membership changes, dependency additions,
  commits, pushes or deployments.

Local contact delivery requires `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`, which is not
configured in this workspace. Physical devices, screen readers and the public
deployment were not tested.
