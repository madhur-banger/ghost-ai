# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Design system foundation (`context/feature-specs/01-design-system.md`)

## Current Goal

- Design system and UI primitives are in place; next unit should build the first real layout/feature on top of them.

## Completed

- `01-design-system.md`: Installed and configured shadcn/ui (`style: base-nova`, `baseColor: neutral`, RSC, CSS variables).
- Added shadcn components: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea (`components/ui/*`).
- Installed `lucide-react`.
- `lib/utils.ts` created by the shadcn CLI with the `cn()` helper (clsx + tailwind-merge).
- `app/globals.css`: collapsed shadcn's generated light `:root` / dark `.dark` variable pair into a single dark-only `:root` block so no light styling ships (theme is dark-only per `ui-context.md`).
- Verified: `tsc --noEmit` clean, `next build` succeeds, dev server serves compiled CSS with `--background: #0a0a0a` (confirmed dark, not the light default).

## In Progress

- None.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- `ui-context.md` specifies a full custom token system (`--bg-base`, `--accent-primary`, `--accent-ai`, node color palette, etc.) mapped via `@theme inline` with Tailwind utility names like `bg-base`, `text-copy-primary`, `border-surface-border`. This was intentionally deferred — shadcn's own generated variable names (`--background`, `--card`, `--primary`, etc., base color `neutral`) are in place instead, overridden with dark values. The two systems are not yet reconciled: no `--accent-primary`/cyan, `--accent-ai`/indigo, or canvas node color tokens exist yet, and app code must not use raw Tailwind color classes per `code-standards.md`. Needs a follow-up unit to define the mapping (either add ui-context tokens alongside shadcn's, or theme shadcn's base color slots directly to the ui-context palette) before building canvas/AI-accent-dependent UI.

## Architecture Decisions

- shadcn `components/ui/*` are protected foundation files (per `ai-workflow-rules.md`) — do not modify directly; wrap/extend in app-level components instead.
- Dark theme is applied by overriding shadcn's default `:root` block directly with its `.dark` values, rather than toggling a `.dark` class — there is no light mode to switch away from.

## Session Notes

- Ready to resume with either: (a) reconciling shadcn tokens with the `ui-context.md` palette, or (b) starting the next feature-spec unit if the palette gap doesn't block it.
