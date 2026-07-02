# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Authentication (`context/feature-specs/03-auth.md`)

## Current Goal

- Clerk is fully wired: provider, auth pages, route protection, and user menu are in place. Next unit should build real editor screen content (canvas, AI sidebar) inside `EditorShell`.

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
- `03-auth.md`: Installed `@clerk/ui`. Added `lib/clerk-appearance.ts` — a shared `Appearance` object (`theme: dark` from `@clerk/ui/themes`, `variables` mapped to the app's CSS custom properties via `var(--accent-primary)` etc., no hardcoded colors) used by both `ClerkProvider` and `UserButton`.
- `app/layout.tsx`: wrapped root layout with `ClerkProvider appearance={clerkAppearance}`.
- `proxy.ts` created at project root (Next.js 16 convention — not `middleware.ts`). Uses `clerkMiddleware` + `createRouteMatcher` from `@clerk/nextjs/server`; public routes are read from `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` env vars (added to `.env` as `/sign-in` and `/sign-up`, no vars renamed/invented — these are Clerk's own standard var names, previously just absent from `.env`). Everything else calls `auth.protect()`.
- `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx`: render Clerk's `SignIn`/`SignUp` components inside a shared `components/auth/auth-layout.tsx` two-panel layout (logo/tagline/feature list on the left on large screens, centered form on the right; form-only on small screens; no gradients, hero sections, or feature cards, per spec).
- `app/page.tsx`: converted to a server component using `auth()` — redirects to `/editor` if signed in, `/sign-in` otherwise.
- `components/editor/editor-navbar.tsx`: added Clerk's `UserButton` (with `clerkAppearance`) to the right section, replacing the empty placeholder.
- `components/editor/editor-shell.tsx` (new): minimal client component wiring `EditorNavbar` + `ProjectSidebar` together with real `isSidebarOpen` state — created only so `/editor` is a valid, protected redirect target. Does not include canvas or AI sidebar content; that remains out of scope for this unit per `ai-workflow-rules.md` (auth and canvas are different system boundaries).
- `app/editor/page.tsx` (new): renders `EditorShell`.
- Verified end-to-end: `tsc --noEmit` clean, `eslint` clean, `next build` succeeds (`Proxy (Middleware)` correctly listed in build output). Ran a real dev server and curled `/sign-in` (200, renders "Ghost AI" + tagline), `/editor` and `/` (both 307 redirect to `/sign-in` while signed out).

## In Progress

- None.

## Next Up

- Build real editor screen content (canvas, AI slide-over sidebar) inside `EditorShell`, replacing the currently-empty canvas area.
- First real usage of `EditorDialog` (e.g. "New Project" dialog triggered from `ProjectSidebar`'s button).
- Project creation/listing (currently `ProjectSidebar` only shows empty-state placeholders) — needs Prisma schema and API routes per `architecture-context.md`.

## Open Questions

- None currently blocking.

## Architecture Decisions

- shadcn `components/ui/*` are protected foundation files (per `ai-workflow-rules.md`) — do not modify directly; wrap/extend in app-level components instead.
- Dark theme is applied by overriding shadcn's default `:root` block directly with its `.dark` values, rather than toggling a `.dark` class — there is no light mode to switch away from.
- ui-context tokens (`--bg-base`, `--text-primary`, `--accent-primary`, etc.) live alongside shadcn's own tokens in the same `:root` block rather than replacing them, so shadcn primitives and app-level components can evolve independently — `components/ui/*` never needs to know about the ui-context palette.
- Floating sidebars (`project-sidebar.tsx`) use `absolute` positioning with a `translate-x` transition rather than a layout-shifting flex sibling, per the "floating overlay, does not push content" requirement in `ui-context.md` and `02-editor.md`.
- Next.js 16 renamed `middleware.ts` to `proxy.ts` (exported function renamed `middleware` → `proxy`); `@clerk/nextjs` (7.5.12) still names its guard helper `clerkMiddleware`, which is called from within `proxy.ts` — the file/export rename is a Next.js routing convention, not a Clerk API change. Do not confuse this with `@clerk/nextjs`'s separate `./server` `proxy` export, which is an unrelated Frontend-API-proxying feature.
- Clerk appearance customization is centralized in `lib/clerk-appearance.ts` rather than inlined per-component, so `ClerkProvider` and any standalone Clerk component (e.g. `UserButton`) stay visually consistent and only need one place updated if the token palette changes.

## Session Notes

- Auth unit complete and verified end-to-end. Ready to resume on canvas/AI sidebar content or project CRUD next.
