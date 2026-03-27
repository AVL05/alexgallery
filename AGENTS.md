# AGENTS.md

## Purpose

Provide a concise and actionable guide for AI agents working in this photography portfolio project.

Scope includes development, fixes, optimization, and maintenance.

---

## Core Principles

- Prioritize simplicity, stability, and readability.
- Keep changes minimal and focused.
- Reuse existing patterns and structure.
- Do not break existing functionality.
- Prefer direct fixes over refactoring.

---

## Token Efficiency

- Be concise. Avoid long explanations.
- Do not restate the task.
- Use short plans (max 3–5 steps).
- Only read necessary files.
- Avoid large outputs unless required.
- Do not explain obvious code.

---

## Workflow

1. Identify the task and affected area.
2. Locate relevant files (glob/grep).
3. Propose minimal change.
4. Apply patch.
5. Run build/tests if needed.
6. Summarize briefly.

---

## Scope Control

- Do not scan the entire repo unless necessary.
- Only open relevant files.
- Avoid loading large assets (images/videos).

---

## Architecture Awareness

Typical structure:

- `src/` → React UI (gallery, components)
- `public/` → static assets (images)
- `package.json` → scripts & dependencies

Rules:

- UI logic stays in React.
- No unnecessary business logic in components.
- Keep components simple and reusable.

---

## Implementation Rules

- Use `async/await`
- Use clear English names
- Use `camelCase`
- Keep functions small
- Avoid unnecessary abstractions
- Do not rewrite working code

---

## Image & Performance Rules

- Do not modify original images unless required.
- Prefer optimization over replacement.
- Avoid heavy assets in runtime.
- Respect lazy loading and existing optimizations.

---

## Change Control

- One objective per change.
- Do not refactor unrelated code.
- Split large tasks when needed.

---

## Dependency Rules

- Do not add dependencies without approval.
- Prefer native or existing utilities.

---

## Safety Rules

- Do not modify unrelated files.
- Do not expose secrets.
- Do not perform destructive actions.
- Preserve backward compatibility.

---

## Debugging

- Identify root cause first.
- Avoid quick fixes without understanding.
- Check console, logs, and rendering issues.

---

## Testing & Build

- Run relevant checks when needed:
  - `npm run build`
  - `npm test` (if exists)

- If not executed, state it clearly.
- Ensure no build errors.

---

## Communication

- Be direct and concise.
- Provide:
  - short plan (if needed)
  - changes made
  - validation steps

- Avoid redundant explanations.

---

## Default Behavior

- Assume standard best practices.
- Do not ask for confirmation on trivial decisions.

---

## Task Template

- Task: [short description]
- Objective: [1–2 lines]
- Files: [paths]
- Expected output: [changes]
- Success criteria: [build/tests OK]
- Notes: [optional]

---

## Commands Reference

- Find files → glob
- Search code → grep (regex)
- Read files → Read <path>
- Apply changes → apply_patch
- Run checks → npm run build / test

---

## Git & PR

- Do not commit unless requested.
- Keep commit messages concise and meaningful.
- Do not force push or rebase without approval.

---

## Final Notes

- Focus on solving the task with minimal impact.
- Avoid overengineering.
- If unsure, state assumptions briefly and proceed.
