# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 16 static-export portfolio (`output: "export"`) using the App Router. Route code lives in `app/`, including localized pages under `app/[locale]/`. Reusable UI is in `components/`, shared hooks in `hooks/`, types in `types/`, and project utilities/data in `lib/`. Dictionaries for manual i18n are in `dictionaries/`, with supported locales defined in `lib/dictionary.ts`.

Image assets are central to the project. Raw photos belong in `public/photos/raw/`; generated variants live in `public/photos/optimized/`, and generated metadata is written to `lib/images-data.json`. Utility scripts are in `scripts/`. Static build output is generated in `out/`.

## Build, Test, and Development Commands

Use `pnpm`; the repository has a `pnpm-lock.yaml`.

- `pnpm dev`: start the local Next.js development server.
- `pnpm build`: create the static production build in `out/`.
- `pnpm typecheck`: run strict TypeScript validation.
- `pnpm lint`: alias for `pnpm typecheck`.
- `pnpm optimize-images`: generate WebP/AVIF variants, blur placeholders, EXIF data, and `lib/images-data.json` from `public/photos/raw/`.
- `pnpm deploy:wrangler`: build and deploy `out/` to Cloudflare via Wrangler assets.

## Coding Style & Naming Conventions

Write strict TypeScript and follow existing App Router patterns. Prefer server components unless client-side state, effects, animation, or browser APIs are required. Use kebab-case for component filenames such as `photo-keyboard-navigation.tsx`, and keep shared data/utilities in `lib/`.

Do not hardcode production URLs or image paths when existing helpers cover them. For gallery images, use the custom image loader in `lib/image-loader.ts`; do not switch to the default `next/image` loader.

## Testing Guidelines

Automated tests run with `pnpm test` (tsx --test over `tests/`). Validate changes with the closest available command: `pnpm test` and `pnpm typecheck` for code changes and `pnpm build` for routing, static generation, image metadata, or deployment-sensitive changes. After adding or changing raw photos, run `pnpm optimize-images` before building.

## Commit & Pull Request Guidelines

Recent commits use short Spanish summaries and occasional Conventional Commit prefixes, for example `feat(gallery): add photo navigation and security hardening`. Keep commits focused and descriptive.

Pull requests should describe the user-facing change, list validation performed, mention image-pipeline changes, and include screenshots or before/after notes for visual updates.

## Security & Configuration Tips

Production is static; avoid adding server-only runtime assumptions. Keep `NEXT_PUBLIC_BASE_URL` aligned with the production domain for deploys. Photos and visual content are copyrighted; do not add third-party or unlicensed imagery without explicit approval.
