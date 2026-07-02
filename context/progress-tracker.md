# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Editor chrome shell (`context/feature-specs/02-editor.md`)

## Current Goal

- Base editor navbar and project sidebar shell are in place; next unit should build real editor screen content (canvas, AI sidebar) on top of this chrome.

## Completed

- `01-design-system.md`: Installed and configured shadcn/ui (`style: base-nova`, `baseColor: neutral`, RSC, CSS variables).
- Added shadcn components: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea (`components/ui/*`).
- Installed `lucide-react`.
- `lib/utils.ts` created by the shadcn CLI with the `cn()` helper (clsx + tailwind-merge).
- `app/globals.css`: collapsed shadcn's generated light `:root` / dark `.dark` variable pair into a single dark-only `:root` block so no light styling ships (theme is dark-only per `ui-context.md`).
- Verified: `tsc --noEmit` clean, `next build` succeeds, dev server serves compiled CSS with `--background: #0a0a0a` (confirmed dark, not the light default).
- `02-editor.md`: Added the full `ui-context.md` token palette (`--bg-base`, `--bg-surface`, `--text-primary`, `--accent-primary`/cyan, `--accent-ai`/indigo, state colors, etc.) to `app/globals.css` alongside shadcn's own generated tokens, mapped via `@theme inline` to Tailwind utilities (`bg-base`, `bg-surface`, `text-copy-primary`, `border-surface-border`, `text-brand`, etc.). This resolves the token-gap open question from the previous session — shadcn primitives (`components/ui/*`) keep using their own `--background`/`--card`/etc. variables untouched; new app-level editor components use the ui-context tokens directly.
- `components/editor/editor-navbar.tsx`: fixed-height (`h-14`) top navbar with left/center/right sections. Left section holds the sidebar toggle button (`PanelLeftOpen`/`PanelLeftClose` from lucide-react based on `isSidebarOpen` prop). Center and right sections are empty placeholders. Dark `bg-surface` background with `border-b border-surface-border`.
- `components/editor/project-sidebar.tsx`: floating overlay sidebar (`absolute`, not part of document flow) that slides in/out via a `translate-x` transition — opening it does not push canvas content. Accepts `isOpen`/`onClose` props. Header with "Projects" title + close button. Uses shadcn `Tabs` (My Projects / Shared), both showing an empty placeholder state. Full-width `New Project` button with `Plus` icon pinned to the bottom.
- `components/editor/editor-dialog.tsx`: thin wrapper around the existing shadcn `Dialog` primitives (`components/ui/dialog.tsx`) exposing `title`, `description`, and `footer` props plus a `children` slot for body content, styled with the new `border-surface-border`/`bg-elevated`/`text-copy-primary` tokens. Not wired to any real dialog flow yet — establishes the pattern for future use per the spec.
- Verified: `tsc --noEmit` clean, `eslint` clean on `components/editor/*`, `next build` succeeds.

## In Progress

- None.

## Next Up

- Wire `EditorNavbar` + `ProjectSidebar` into an actual editor route/page with real sidebar-open state and a canvas area (no editor route exists yet — this unit only built the reusable chrome components, per spec scope).
- Build the AI slide-over sidebar on the right side of the editor layout (mentioned in `ui-context.md` layout patterns, not yet started).
- First real usage of `EditorDialog` (e.g. "New Project" dialog triggered from `ProjectSidebar`'s button).

## Open Questions

- None currently blocking. The shadcn-vs-ui-context token reconciliation (previously open) is resolved: both token sets now coexist in `app/globals.css`, shadcn tokens for `components/ui/*` primitives, ui-context tokens for app-level components.

## Architecture Decisions

- shadcn `components/ui/*` are protected foundation files (per `ai-workflow-rules.md`) — do not modify directly; wrap/extend in app-level components instead.
- Dark theme is applied by overriding shadcn's default `:root` block directly with its `.dark` values, rather than toggling a `.dark` class — there is no light mode to switch away from.
- ui-context tokens (`--bg-base`, `--text-primary`, `--accent-primary`, etc.) live alongside shadcn's own tokens in the same `:root` block rather than replacing them, so shadcn primitives and app-level components can evolve independently — `components/ui/*` never needs to know about the ui-context palette.
- Floating sidebars (`project-sidebar.tsx`) use `absolute` positioning with a `translate-x` transition rather than a layout-shifting flex sibling, per the "floating overlay, does not push content" requirement in `ui-context.md` and `02-editor.md`.

## Session Notes

- Ready to resume by wiring the navbar/sidebar into an actual editor page and route, or by starting the AI sidebar / canvas units next.
