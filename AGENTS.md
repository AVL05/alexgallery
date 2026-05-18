# AGENTS.md

## Project

Alexgallery is a Next.js photography gallery and portfolio with static export/deploy support.

## Stack

- Package manager: pnpm.
- Next.js app uses `app/`, `components/`, `hooks/`, `lib/`, `types/`, and `public/`.
- Image tooling includes `sharp`, `plaiceholder`, and `scripts/optimize-images.ts`.
- Deployment uses Wrangler assets from `out/`.

## Commands

- Dev: `pnpm dev`
- Build/export: `pnpm build`
- Optimize images: `pnpm optimize-images`
- Deploy with Wrangler: `pnpm deploy:wrangler`

## Rules

- Keep changes minimal and focused.
- Preserve image quality, metadata behavior, lazy loading, and layout stability.
- Do not modify original images unless the task explicitly requires it.
- Avoid loading or printing large binary/assets content.
- Use existing components and design patterns before creating new ones.
- Do not add dependencies without approval.

## Validation

- For UI/config changes, run `pnpm build` when practical.
- For image pipeline changes, run `pnpm optimize-images` only when the change affects that path.
- If a command is not run, state why and mention remaining risk.
