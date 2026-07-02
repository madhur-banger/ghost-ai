# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Editor route (`app/editor/page.tsx`) — chrome + project dialogs/sidebar actions wired up (mock data only), canvas/AI sidebar not yet built.

## Current Goal

- `04-project-dialogs.md` is done: editor home empty state, Create/Rename/Delete project dialogs, and sidebar row actions are all wired against mock data. Next unit should build the actual canvas surface and AI slide-over sidebar inside this page.

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
- `04-project-dialogs.md`: Added shadcn `dropdown-menu` and `label` components (`components/ui/dropdown-menu.tsx`, `components/ui/label.tsx`) via CLI — untouched foundation files.
- `lib/mock-projects.ts`: `Project` interface, `MOCK_OWNED_PROJECTS`/`MOCK_SHARED_PROJECTS` mock data, and a `slugify()` helper (lowercase, non-alphanumeric → `-`, trimmed) used for the live slug preview. No API calls or persistence, per spec.
- `hooks/use-project-dialogs.ts`: `useProjectDialogs` hook centralizing dialog state (discriminated union: `create` / `rename` / `delete`, each carrying the relevant `Project` where applicable), form state (`name`, derived `slug`), and `isSubmitting` loading state, plus `openCreate`/`openRename`/`openDelete`/`close` actions.
- `components/editor/project-dialogs.tsx`: `ProjectDialogs` component rendering all three dialogs (Create/Rename/Delete) via `EditorDialog`, driven entirely by `useProjectDialogs` state. Create shows a live slug preview that updates on keystroke. Rename prefills the name, auto-focuses and selects the input on mount, and submits on Enter. Delete shows only a destructive confirmation (no input), with the confirm button using `variant="destructive"`.
- `components/editor/project-sidebar.tsx`: now accepts `ownedProjects`/`sharedProjects` props and renders them (falls back to existing empty states when a list is empty). Owned rows show a `DropdownMenu` (rename/delete, destructive styling on delete) revealed on hover; shared/collaborator rows render with no action menu at all (ownership check via `project.isOwner`). Added a mobile-only (`lg:hidden`) backdrop scrim `absolute inset-0` behind the sidebar that closes it on click, satisfying the "tap outside closes sidebar" mobile requirement.
- `app/editor/page.tsx`: added the required center empty-state content (heading, description, `New Project` button with `Plus` icon, no card wrapper) without touching `EditorNavbar` or `ProjectSidebar`'s existing toggle behavior. Holds mock project state (`useState` seeded from `lib/mock-projects.ts`) and wires create/rename/delete handlers (in-memory array mutation only) into both the sidebar's `New Project` button and its row actions, and the editor home's own `New Project` button.
- Verified: `tsc --noEmit` clean, `eslint` clean on all new/changed files, `next build` succeeds. Dev server + `curl -i` reconfirmed `/editor` still 307s to `/sign-in` when unauthenticated (route protection unaffected). Full authenticated interaction with the dialogs not exercised (same Clerk credential limitation as the previous unit).

## In Progress

- None.

## Next Up

- Build the canvas surface inside `app/editor/page.tsx` (currently the empty-state content lives where the canvas will eventually render).
- Build the AI slide-over sidebar on the right side of the editor layout (mentioned in `ui-context.md` layout patterns, not yet started).
- Wire project dialogs and sidebar actions to real API routes + Prisma once persistence lands (currently mock data only, per `04-project-dialogs.md` scope).

## Open Questions

- None currently blocking.

## Resolved

- `proxy.ts` vs `middleware.ts`: confirmed via `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` — Next.js 16 renamed `middleware.ts` → `proxy.ts` (exported function renamed `middleware` → `proxy`), so the spec's instruction is correct, not a typo. Use `export function proxy(request: NextRequest)` with an optional exported `config.matcher`.
- `@clerk/ui` dependency and sign-in/sign-up env vars: resolved by installing `@clerk/ui` and adding `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` (`/sign-in`, `/sign-up`) to `.env`.

## Architecture Decisions

- shadcn `components/ui/*` are protected foundation files (per `ai-workflow-rules.md`) — do not modify directly; wrap/extend in app-level components instead.
- Dark theme is applied by overriding shadcn's default `:root` block directly with its `.dark` values, rather than toggling a `.dark` class — there is no light mode to switch away from.
- ui-context tokens (`--bg-base`, `--text-primary`, `--accent-primary`, etc.) live alongside shadcn's own tokens in the same `:root` block. **Superseded 2026-07-02**: shadcn's semantic tokens (`--primary`, `--ring`, `--accent`, `--popover`, `--input`, `--destructive`, etc.) are now mapped via `var()` onto the brand tokens instead of keeping shadcn's generic grayscale defaults — see the "shadcn Token Mapping" entry below.
- Floating sidebars (`project-sidebar.tsx`) use `absolute` positioning with a `translate-x` transition rather than a layout-shifting flex sibling, per the "floating overlay, does not push content" requirement in `ui-context.md` and `02-editor.md`.
- Clerk appearance is themed entirely through `variables` mapped to existing `app/globals.css` custom properties (`--accent-primary`, `--bg-elevated`, etc.) rather than hardcoded hex values — keeps Clerk's UI in sync with any future token changes without touching `layout.tsx` again.
- Route protection default-denies: `proxy.ts` protects every route except the sign-in/sign-up paths (read from env), rather than an allowlist of protected routes — matches the spec's "protect everything else by default."
- Project dialog/form/loading state lives in one hook (`useProjectDialogs`) rather than three separate `useState`s per dialog — the three dialogs are mutually exclusive (only one open at a time) and share the same name/slug form field, so a single discriminated-union state is simpler than coordinating three.
- Mock project data lives in `lib/mock-projects.ts` as a stand-in for the future Prisma-backed project list — `Project` interface intentionally mirrors the eventual DB shape (`id`, `name`, `slug`, ownership) so swapping in real API calls later is a data-source change, not a component rewrite.
- shadcn Token Mapping (2026-07-02): `app/globals.css` `:root` now maps shadcn's semantic tokens onto the brand palette via `var()` — `--primary`/`--ring`/`--sidebar-ring` → `--accent-primary` (cyan), `--accent`/`--sidebar-accent` → `--accent-primary-dim`, `--input` → `--border-subtle`, `--destructive` → `--state-error`, `--card`/`--popover` → `--bg-elevated`. `--primary-foreground` is a near-black (`#04211f`) rather than white, for contrast on cyan. `--accent-ai` (indigo) is deliberately left out of this mapping — reserved for AI-specific surfaces only, per the updated "shadcn Token Mapping" section in `ui-context.md`. No `components/ui/*` files were touched; the fix is entirely token-level, so every primitive (Button, Dialog, Input, DropdownMenu, Tabs) inherits the brand color automatically. Root cause was that shadcn's tokens still held their auto-generated grayscale `oklch` defaults, unrelated to the ui-context tokens defined alongside them — this is what made the editor/dialogs read as generic/dated "AI slop" rather than the intended dark-cyan workspace.

## Session Notes

- `03-auth.md` is done and `/editor` now exists with working chrome (navbar + sidebar toggle), resolving the 404 from `context/current-issue.md`.
- `04-project-dialogs.md` is done: editor home empty state, Create/Rename/Delete dialogs, and sidebar row actions (rename/delete, owner-only) are wired end-to-end against mock data, including the mobile backdrop scrim.
- shadcn token-to-brand-palette mapping is done (`app/globals.css`, `ui-context.md`). Not visually verified in-browser this session — the user's own dev server (port 3000) was already running and left untouched per their choice; verification relied on `tsc`/`eslint`/`next build` passing plus code-level confirmation that no `components/ui/*` file references an unmapped token. **Open follow-up**: user should visually confirm `/editor` and the project dialogs in their running dev server before considering this closed.
- Ready to resume by building the canvas surface and AI sidebar inside `app/editor/page.tsx` next.
