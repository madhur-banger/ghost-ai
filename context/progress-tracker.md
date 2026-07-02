# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Editor route (`app/editor/page.tsx`) — chrome wired up, canvas/AI sidebar not yet built.

## Current Goal

- `/editor` now exists and renders `EditorNavbar` + `ProjectSidebar` with working toggle state, protected by `proxy.ts`. Next unit should build the actual canvas surface and AI slide-over sidebar inside this page.

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
- `03-auth.md`: Installed `@clerk/ui` (`@clerk/nextjs` was already installed). Added `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up` to `.env`.
- `proxy.ts` (project root): `clerkMiddleware` from `@clerk/nextjs/server` wrapping `auth.protect()`, gated by a `createRouteMatcher` built from the sign-in/sign-up env vars (public), protecting everything else by default. `config.matcher` excludes `_next/static`, `_next/image`, `favicon.ico`, and explicitly includes `/api` and `/trpc`.
- `app/layout.tsx`: wrapped in `ClerkProvider` with `appearance={{ theme: dark, variables: {...} }}` — `dark` imported from `@clerk/ui/themes`; all `variables` entries reference `app/globals.css` CSS custom properties (`var(--accent-primary)`, `var(--bg-elevated)`, etc.), no hardcoded colors, per spec and `code-standards.md`.
- `components/auth/auth-layout.tsx`: shared two-panel shell for auth pages — left panel (logo, tagline, text-only feature list, `hidden lg:flex`) hidden below `lg`, right panel centers the Clerk form. No gradients, hero sections, feature cards, or scroll-heavy layout, per spec.
- `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx`: Clerk catch-all routes rendering `<SignIn />` / `<SignUp />` inside `AuthLayout`. Clerk's default components/flows are used as-is, not rebuilt.
- `app/page.tsx`: converted to an async Server Component; calls `auth()` from `@clerk/nextjs/server` and redirects to `/editor` (authenticated) or `/sign-in` (unauthenticated).
- `components/editor/editor-navbar.tsx`: added Clerk's `<UserButton />` to the navbar's right section (previously an empty placeholder).
- Verified: `tsc --noEmit` clean, `eslint` clean, `next build` succeeds (routes compiled: `/`, `/sign-in/[[...sign-in]]`, `/sign-up/[[...sign-up]]`, proxy registered). Manually confirmed via dev server: `/` returns 307 → `/sign-in` when unauthenticated, `/sign-in` returns 200 and renders the Clerk form with no console errors, `/editor` correctly 404s (route protection passes the request through since it doesn't exist yet — expected, `/editor` page isn't built).
- `app/editor/page.tsx`: fixes the `/editor` 404 reported in `context/current-issue.md` (post-auth redirect target had no page). Client component (`"use client"`) holding `isSidebarOpen` state via `useState`; renders `EditorNavbar` (toggle wired to state) above a `relative flex-1 overflow-hidden` container that hosts `ProjectSidebar` — the `relative` wrapper is required since `ProjectSidebar` positions itself `absolute inset-y-0 left-0`. No canvas content yet, just the container that will hold it.
- Verified: `tsc --noEmit` clean, `eslint` clean, `next build` succeeds (`/editor` compiles as a static route). Confirmed via dev server + `curl -i`: unauthenticated request to `/editor` returns `307` to `/sign-in?redirect_url=...` (Clerk `x-clerk-auth-status: signed-out` header present) — proxy protection is active on the new route as expected. Full authenticated render not exercised (requires real Clerk sign-in credentials, not available headlessly).

## In Progress

- None.

## Next Up

- Build the canvas surface inside `app/editor/page.tsx` (currently an empty `relative` container).
- Build the AI slide-over sidebar on the right side of the editor layout (mentioned in `ui-context.md` layout patterns, not yet started).
- First real usage of `EditorDialog` (e.g. "New Project" dialog triggered from `ProjectSidebar`'s button).

## Open Questions

- None currently blocking.

## Resolved

- `proxy.ts` vs `middleware.ts`: confirmed via `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` — Next.js 16 renamed `middleware.ts` → `proxy.ts` (exported function renamed `middleware` → `proxy`), so the spec's instruction is correct, not a typo. Use `export function proxy(request: NextRequest)` with an optional exported `config.matcher`.
- `@clerk/ui` dependency and sign-in/sign-up env vars: resolved by installing `@clerk/ui` and adding `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` (`/sign-in`, `/sign-up`) to `.env`.

## Architecture Decisions

- shadcn `components/ui/*` are protected foundation files (per `ai-workflow-rules.md`) — do not modify directly; wrap/extend in app-level components instead.
- Dark theme is applied by overriding shadcn's default `:root` block directly with its `.dark` values, rather than toggling a `.dark` class — there is no light mode to switch away from.
- ui-context tokens (`--bg-base`, `--text-primary`, `--accent-primary`, etc.) live alongside shadcn's own tokens in the same `:root` block rather than replacing them, so shadcn primitives and app-level components can evolve independently — `components/ui/*` never needs to know about the ui-context palette.
- Floating sidebars (`project-sidebar.tsx`) use `absolute` positioning with a `translate-x` transition rather than a layout-shifting flex sibling, per the "floating overlay, does not push content" requirement in `ui-context.md` and `02-editor.md`.
- Clerk appearance is themed entirely through `variables` mapped to existing `app/globals.css` custom properties (`--accent-primary`, `--bg-elevated`, etc.) rather than hardcoded hex values — keeps Clerk's UI in sync with any future token changes without touching `layout.tsx` again.
- Route protection default-denies: `proxy.ts` protects every route except the sign-in/sign-up paths (read from env), rather than an allowlist of protected routes — matches the spec's "protect everything else by default."

## Session Notes

- `03-auth.md` is done and `/editor` now exists with working chrome (navbar + sidebar toggle), resolving the 404 from `context/current-issue.md`. Ready to resume by building the canvas surface and AI sidebar inside `app/editor/page.tsx` next.
