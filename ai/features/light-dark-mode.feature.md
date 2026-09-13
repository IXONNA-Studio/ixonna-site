# Feature Specification: Light / Dark Mode Toggle

**Feature ID:** F-09  
**Status:** Planned  
**Governing specification:** [../ai-spec.md](../ai-spec.md)

This feature must be implemented and reviewed under the Global AI Specification. The global specification is authoritative for architecture, accessibility, static hosting, coding conventions, and the Definition of Done. This document adds only the detail specific to theming. It touches every existing feature's CSS (F-02 through F-08) rather than adding a new page or route.

## 1. Feature Goal and Scope

### 1.1 Goal

Let a visitor — on the public portfolio or the admin screens — switch between a light and a dark presentation of the whole site from a single, always-reachable control. The choice must survive a reload and a new visit, default sensibly to what their operating system already prefers, switch without a jarring flash, and leave every screen fully legible in both themes.

### 1.2 Scope in

- One toggle control (button/switch), mounted once at the application root so it renders on every route — `/`, `/login`, and `/backoffice` — without being wired into each page individually.
- CSS custom properties for every themed color, extending the token set already started in `src/index.css` (`--text`, `--bg`, `--border`, `--accent`, etc.).
- **Migrating the roughly 50 hardcoded hex colors currently written directly into `src/App.css`** (hero, header/footer, value strip, skill and timeline cards, project and link cards, contact form, admin login, and back office) into that token system. This is the bulk of the implementation work, not the toggle itself.
- A complete dark palette: a value for every token defined for light.
- Persisting an explicit choice in `localStorage`.
- Following the browser's `prefers-color-scheme` live whenever there is no explicit stored choice, including reacting if the visitor changes their OS setting while the tab is open.
- A smooth, short color transition on switch, skipped or shortened for visitors who have asked for reduced motion.
- Preventing a flash of the wrong theme on first paint.
- Coverage of every rendered surface: public sections, the contact form's success/error states, the admin login form, and the back office table and modal — including focus outlines, disabled states, and placeholder/AI-image mats.

### 1.3 Scope out

- A visual redesign; dark mode reuses the same layout, spacing, and brand palette, only inverted/adjusted for contrast.
- A three-way switch with a persisted "system" option as a distinct third state; the behavior specified here already tracks the system live until the visitor makes an explicit choice, which covers the requirement without extra UI.
- Per-component theme overrides or a component that is deliberately always light/dark.
- Syncing the preference to the Supabase admin account or across devices; it is a per-browser `localStorage` value, unrelated to the auth session.
- Theming the printed page.
- Any change to content, copy, or information architecture — this feature only changes color tokens and how they resolve.

## 2. Requirements Breakdown

### REQ-THEME-001: Single, root-mounted toggle

A theme toggle control is mounted once, at the top of the component tree (`App.tsx`, alongside the router), so it appears on every route without per-page wiring. It must remain reachable and usable regardless of scroll position and must not overlap or be hidden behind the sticky header, the mobile bottom navigation, or the admin cards.

### REQ-THEME-002: CSS custom properties for every themed color

Every color that differs between the two themes must be expressed as a CSS custom property, resolved on `:root` (light) and overridden under a dark selector (REQ-THEME-005). No component may hardcode a hex/rgb value for a themed color once this feature ships. This requires migrating the existing hardcoded colors in `src/App.css` into new or existing tokens (backgrounds, text colors, borders, shadows, the purple/violet accent family, the success/error greens and reds used by the contact form and back office, and the neutral mats behind AI images).

### REQ-THEME-003: Complete dark palette

A dark value is defined for every token used in light mode — no token may be defined for only one theme. Contrast between text and its background must remain readable (informal target: WCAG AA, ~4.5:1 for body text) in both themes, including on card surfaces, buttons, form fields, tags, and the timeline/project/link cards.

### REQ-THEME-004: Persisted, explicit choice

Activating the toggle writes `'light'` or `'dark'` to `localStorage` under a single documented key and immediately re-renders in that theme. On every later page load in the same browser, the stored value — if present and valid — is applied before the OS preference is consulted at all.

### REQ-THEME-005: OS preference as the live default

When there is no stored choice (first visit, or the stored value was cleared), the page follows `prefers-color-scheme` and updates live if the OS-level setting changes while the tab is open. Once the visitor activates the toggle, their explicit choice is pinned (REQ-THEME-004) and no longer reacts to OS changes. Mechanism: an unset root `data-theme` attribute means "follow the media query"; an explicit `data-theme="light"` or `data-theme="dark"` means "pinned," and CSS rules under a `[data-theme=...]` selector must take precedence over the plain media query for the same tokens.

### REQ-THEME-006: No flash of the wrong theme

The resolved theme (from `localStorage`, else `prefers-color-scheme`) must be applied before the first paint. This requires a small blocking script in `index.html`'s `<head>`, run before the stylesheet paints content, that sets the `data-theme` attribute (or leaves it unset for "follow system") based on the same resolution rule as REQ-THEME-005.

### REQ-THEME-007: Smooth, motion-respecting transition

Switching themes animates color-related properties (background, text, border colors) with a short transition (target ~150–200ms, ease). The transition must not apply to layout-affecting properties (so it never causes visible reflow/jank), and it must be removed or reduced to near-zero for visitors whose OS has `prefers-reduced-motion: reduce` set.

### REQ-THEME-008: Full-site coverage

Every existing page and state renders correctly in both themes: the public single page (all its sections), `/login` in its default, loading, and error states, and `/backoffice` in its loading, empty, error, populated, and modal-open states. No section may be left unstyled (i.e., stuck with a hardcoded color that clashes with the active theme).

### REQ-THEME-009: Accessible control

The toggle has a visible label or icon plus an accessible name (e.g., "Switch to dark theme" / "Switch to light theme", updated with the current action), communicates its current state (for example `aria-pressed`), is reachable and operable by keyboard with a visible focus ring in both themes, and has a minimum touch target of 44×44px.

## 3. User Flow

### 3.1 First visit, no stored preference

1. A visitor with a dark OS theme opens the site for the first time.
2. The page paints directly in dark — no light flash first.
3. The toggle shows the control in its "currently dark" state.

### 3.2 Toggling

1. The visitor activates the toggle.
2. The theme flips with a brief, smooth color transition; layout does not shift.
3. The choice is written to `localStorage`.

### 3.3 Return visit

1. The same visitor returns later, regardless of their current OS theme.
2. The page paints directly in their previously chosen theme — no flash, and no longer tied to the OS setting.

### 3.4 OS theme changes live (no explicit choice yet)

1. A visitor who has never toggled changes their OS from light to dark while the tab is open.
2. The site updates to dark immediately, because it is still following `prefers-color-scheme`.

### 3.5 Admin pages

1. An admin opens `/login` or `/backoffice` directly.
2. The same toggle is present and behaves identically, independent of the Supabase session.

## 4. Interfaces Involved

### 4.1 Components and files

| File | Responsibility |
| --- | --- |
| `vite-project/index.html` | New inline, blocking `<script>` in `<head>` that resolves and applies `data-theme` before first paint (REQ-THEME-006) |
| `vite-project/src/lib/theme.ts` | New: `getStoredTheme()`, `setTheme(theme)`, `getSystemTheme()`, `subscribeToSystemTheme(cb)` — the only place that touches `localStorage` and `matchMedia` |
| `vite-project/src/components/ThemeToggle.tsx` | New: the button/switch UI; calls into `theme.ts`; exposes the accessible name and pressed state |
| `vite-project/src/App.tsx` | Mounts `<ThemeToggle />` once, outside `<Routes>`, so it covers every route |
| `vite-project/src/index.css` | Extends `:root` with the full light token set, adds the dark overrides and the guarded `prefers-color-scheme` block, adds the transition rule and its `prefers-reduced-motion` override |
| `vite-project/src/App.css` | Every hardcoded color replaced with `var(--token)`; new tokens added here or in `index.css` for colors not yet tokenized (success/error states, card mats, gradients) |

### 4.2 Pages and routes

No new routes. The toggle must render correctly on all three existing ones:

| Route | Interface |
| --- | --- |
| `/` | Public portfolio single page |
| `/login` | Admin sign-in (F-07) |
| `/backoffice` | Admin message manager (F-08), including its modal |

### 4.3 Endpoints and external interfaces

None. This feature is entirely client-side: `localStorage` and `window.matchMedia('(prefers-color-scheme: dark)')`. It makes no Supabase call and adds no HTTP endpoint.

## 5. Data, Validations, and Expected Behavior

### 5.1 Data model

A single `localStorage` entry (documented key, e.g. `theme`) whose value is `'light'` or `'dark'`, or absent. Absent means "follow the OS live." No other client or server state is introduced.

### 5.2 Validation rules

- Only `'light'` and `'dark'` are treated as valid stored values; anything else (missing key, corrupted/hand-edited value) is treated the same as absent and falls back to `prefers-color-scheme`.
- The inline bootstrap script and the React theme module must resolve the theme identically, so the pre-paint guess and the post-hydration state never disagree and cause a visible swap.
- Every token defined under `:root` must have a corresponding override under the dark selector; a token present in only one theme is a defect.
- The transition rule must be excluded when `prefers-reduced-motion: reduce` is set.

### 5.3 Expected behavior

- A full page load or refresh on any of the three routes never shows a flash of the non-applicable theme, even on a slow connection (the bootstrap script has no external dependency and runs before the stylesheet or bundle needs to load).
- Activating the toggle changes every themed surface on the current page simultaneously; nothing is left in the previous theme's colors.
- The stored choice persists across a full browser restart and across new tabs to the same site.
- Clearing site data (or a first visit in a different browser) returns to following the OS setting live.
- Reduced-motion visitors see an instant (or near-instant) switch with no animated transition.
- `npm run lint` and `npm run build` complete without errors.

## 6. Acceptance Criteria

### AC-THEME-01: Toggle present everywhere

**Given** the visitor opens `/`, `/login`, or `/backoffice`  
**When** the page renders  
**Then** the same toggle control is visible, in the same relative position, and operable on all three.

### AC-THEME-02: All themed colors are token-driven

**Given** the site is switched from light to dark  
**When** any section, card, form, or admin screen is inspected  
**Then** its colors change to the dark values with no element left showing a hardcoded light-mode color.

### AC-THEME-03: Choice persists

**Given** the visitor activates the toggle  
**When** they refresh the page, open a new tab to the site, or close and reopen the browser  
**Then** the same theme they chose is shown, with no flash of the other theme first.

### AC-THEME-04: OS preference is the live default

**Given** a visitor who has never toggled  
**When** their OS-level color scheme is light or dark, or changes while the tab is open  
**Then** the site matches it immediately, in both directions.

### AC-THEME-05: Smooth, motion-aware transition

**Given** the toggle is activated  
**When** motion is not reduced  
**Then** color properties transition smoothly over a short duration with no layout shift; **given** `prefers-reduced-motion: reduce` is set, **then** the switch is effectively instant.

### AC-THEME-06: Full coverage, no illegible regions

**Given** dark mode is active  
**When** every section of `/`, the `/login` form (including its error state), and `/backoffice` (including its modal, empty state, and error state) are reviewed  
**Then** all text meets a readable contrast against its background and no element is invisible or clashing.

### AC-THEME-07: No flash of unstyled/incorrect theme

**Given** a fresh load with a stored dark preference (or a dark OS preference with none stored)  
**When** the page is loaded, including on a throttled connection  
**Then** the first paint is already dark — no visible light flash beforehand.

### AC-THEME-08: Accessible control

**Given** a keyboard or assistive-technology user  
**When** they reach the toggle  
**Then** it has a visible focus indicator, an accessible name describing the action, and an exposed pressed/current state.

### AC-THEME-09: Global specification compliance

**Given** the feature is reviewed against [../ai-spec.md](../ai-spec.md)  
**When** accessibility, coding-convention, and Definition of Done rules are checked  
**Then** it introduces no backend, no new secret, and nothing that contradicts the global specification.

## 7. Verification Checklist

From `vite-project/`:

```bash
npm run lint
npm run build
```

Then verify in a browser:

- Toggle appears and works identically on `/`, `/login`, and `/backoffice`.
- Toggle to dark, refresh: stays dark, no flash. Toggle to light, refresh: stays light, no flash.
- DevTools → Rendering → "Emulate CSS media feature `prefers-color-scheme`": with no stored value, switching the emulated OS setting flips the site live in both directions.
- Clear `localStorage` for the site and reload: the site follows the emulated OS setting again.
- DevTools → Rendering → "Emulate CSS media feature `prefers-reduced-motion`: reduce": toggling shows no animated transition.
- Walk every section of the home page, the contact form's success and error states, the login form's error state, and the back office (empty, populated, and modal-open) in both themes — confirm nothing is unreadable or unstyled.
- `grep` `src/App.css` for hex/`rgb(` colors outside the token definitions in `index.css` — none should remain for themed surfaces.
- Keyboard-tab to the toggle: visible focus ring, meaningful accessible name, `aria-pressed` (or equivalent) reflects state.
- Throttle the network (Slow 3G) and hard-reload: still no flash of the wrong theme.

## 8. Dependencies and Handoffs

- **Touches every prior feature's CSS** (F-02 Header/Footer, F-03 Home Page, F-04 Portfolio Profile Content, F-05 Links, F-06 Contact Form, F-07 Admin Login, F-08 Admin Back Office) because it migrates their hardcoded colors into tokens. No behavior in those features changes — only how their colors are declared.
- **Depends on nothing new** architecturally; it adds a client-side module and a root-level component, with no Supabase or routing changes.
- Update `README.md`'s tech stack / features list once shipped, and note the `localStorage` key it introduces alongside the existing environment-variable documentation for consistency.
