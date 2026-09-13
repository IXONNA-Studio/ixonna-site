# Feature Specification: Multilingual Support (English / French)

**Feature ID:** F-10  
**Status:** Implemented baseline  
**Governing specification:** [../ai-spec.md](../ai-spec.md)

This feature must be implemented and reviewed under the Global AI Specification. The global specification is authoritative for architecture, accessibility, static hosting, coding conventions, and the Definition of Done. This document adds only the detail specific to language support. Like F-09 (Light/Dark Mode), it touches every existing feature's copy (F-02 through F-08) rather than adding a new page or route.

## 1. Feature Goal and Scope

### 1.1 Goal

Let a visitor read the entire site — the public portfolio and the admin screens — in either English or French, switch between them from a single, always-reachable control, and have that choice remembered on their next visit. No user-facing text may be left untranslated once the visitor switches languages.

### 1.2 Scope in

- Two supported languages: English (`en`, default) and French (`fr`).
- One language switcher control, mounted once at the application root so it renders on every route — `/`, `/login`, and `/backoffice` — without being wired into each page individually, mirroring how the theme toggle (F-09) is mounted.
- Translation files organized as structured JSON, one per locale (`src/i18n/en.json`, `src/i18n/fr.json`), sharing one nested key shape so a dictionary can be type-checked against the English source of truth.
- Translating every piece of user-facing text: navigation labels, headings, body paragraphs, buttons, form labels, validation and status messages, the footer, and both admin screens (login form and back office, including its modal).
- Persisting the chosen locale in `localStorage`.
- Falling back to the browser's language (`navigator.language`/`navigator.languages`) when there is no stored choice, defaulting to English when the browser's language isn't one of the two supported locales.
- Keeping the document's `<html lang>` attribute and `<title>` in sync with the active locale.
- Locale-aware date formatting in the back office (message timestamps render via the active locale's date/time conventions).

### 1.3 Scope out

- Any language beyond English and French.
- Automatic/machine translation at runtime; both dictionaries are authored text, reviewed for correctness.
- Translating proper nouns and non-prose data: brand name, company/school names, project names, and technology tags (e.g. "React", "MongoDB") stay as-is in both languages, matching how a résumé or portfolio is conventionally localized.
- Per-visitor locale detection via IP/geolocation.
- Syncing the preference to the Supabase admin account or across devices; it is a per-browser `localStorage` value, unrelated to the auth session (same posture as the theme preference in F-09).
- Right-to-left layout support (neither supported language needs it).
- Translating the printed/PDF résumé itself — the résumé link's surrounding UI is translated, but the linked PDF file is unchanged.

## 2. Requirements Breakdown

### REQ-I18N-001: Single, root-mounted switcher

A language switcher control is mounted once, at the top of the component tree (`App.tsx`, alongside the router and the theme toggle), so it appears on every route without per-page wiring. It sits beside the theme toggle using the same fixed-position, circular visual treatment so the two controls read as one pair of settings.

### REQ-I18N-002: Structured JSON dictionaries

All user-facing strings live in `src/i18n/en.json` and `src/i18n/fr.json`, organized as nested objects mirroring the site's sections (`header`, `nav`, `hero`, `about`, `skills`, `strengths`, `experience`, `education`, `projects`, `links`, `contact`, `footer`, `admin.login`, `admin.backoffice`). `en.json` is the source of truth; a `Dictionary` type is derived from it (`typeof en`) so `fr.json` — and any future locale file — can be checked against the same shape at build time via TypeScript's `resolveJsonModule`.

### REQ-I18N-003: Full-text coverage

No component may hardcode a user-facing English string once this feature ships. Every page and component (`Header`, `Footer`, `Home`, `ContactForm`, `AdminLogin`, `Backoffice`) reads its copy from the active dictionary via a shared `useLocale()` hook. Non-text data — image paths, outbound URLs, technology tags — is intentionally kept out of the dictionaries and stays in component code, since it does not change between languages.

### REQ-I18N-004: Persisted, explicit choice

Activating the switcher writes `'en'` or `'fr'` to `localStorage` under a single documented key (`locale`) and immediately re-renders the whole page in that language. On every later page load in the same browser, the stored value — if present and valid — is applied before the browser's language is consulted at all. A small blocking script in `index.html`'s `<head>` stamps `<html lang>` from the stored value before first paint, the same pre-paint pattern used for the theme (F-09, REQ-THEME-006), so the language attribute is never wrong for even one frame.

### REQ-I18N-005: Browser language as the default

When there is no stored choice (first visit, or the stored value was cleared), the resolved locale is derived from `navigator.languages`/`navigator.language`, matching the first supported language found; if none of the visitor's browser languages are English or French, the site defaults to English.

### REQ-I18N-006: `<html lang>` and `<title>` stay in sync

Whenever the active locale changes, `document.documentElement.lang` and `document.title` are updated to match (the title via each route's own effect, following the existing pattern already used by `/login` and `/backoffice` to restore `document.title` on mount).

### REQ-I18N-007: Accessible control

The switcher has a visible label (the target language's code, e.g. "FR" while in English) plus an accessible name describing the action ("Change language / Changer de langue"), is reachable and operable by keyboard with a visible focus ring, and has a minimum touch target of 44×44px — matching the theme toggle's accessibility bar (F-09, REQ-THEME-009).

## 3. User Flow

### 3.1 First visit, no stored preference

1. A visitor whose browser is set to French opens the site for the first time.
2. The page renders in French from the first meaningful paint (resolved via `navigator.languages`).
3. The switcher shows "EN" (the language a click would switch *to*).

### 3.2 Switching

1. The visitor activates the switcher.
2. Every section of the current page re-renders in the other language — navigation, headings, paragraphs, buttons, and form labels all change together.
3. The choice is written to `localStorage`.

### 3.3 Return visit

1. The same visitor returns later, regardless of their current browser language setting.
2. The page renders directly in their previously chosen language — no flash of the other language, and no longer tied to the browser setting.

### 3.4 Admin pages

1. An admin opens `/login` or `/backoffice` directly.
2. The same switcher is present and behaves identically, independent of the Supabase session; the sign-in form, its validation errors, and the back office table/modal all render in the active language.

## 4. Interfaces Involved

### 4.1 Components and files

| File | Responsibility |
| --- | --- |
| `vite-project/index.html` | Inline, blocking `<script>` in `<head>` that stamps `<html lang>` from the stored locale before first paint (REQ-I18N-004), alongside the existing theme bootstrap script |
| `vite-project/src/i18n/en.json` | English dictionary — source of truth for the `Dictionary` type |
| `vite-project/src/i18n/fr.json` | French dictionary — authored to mirror `en.json`'s exact key shape |
| `vite-project/src/i18n/index.ts` | Exports the `Dictionary` type and the `dictionaries` lookup (`Record<Locale, Dictionary>`) |
| `vite-project/src/lib/i18n.ts` | `getStoredLocale()`, `getBrowserLocale()`, `resolveLocale()`, `setStoredLocale()` — the only place that touches `localStorage` and `navigator.language(s)` |
| `vite-project/src/context/locale-context.ts` | `LocaleContext` and the `useLocale()` hook (`{ locale, t, setLocale }`) |
| `vite-project/src/context/LocaleProvider.tsx` | Resolves the initial locale, keeps `<html lang>` in sync, and provides `{ locale, t, setLocale }` to the tree |
| `vite-project/src/components/LanguageSwitcher.tsx` | The switcher UI; calls into `useLocale()`; exposes the accessible name |
| `vite-project/src/App.tsx` | Mounts `<LocaleProvider>` around the router tree and `<LanguageSwitcher />` once, outside `<Routes>`, beside `<ThemeToggle />` |
| `vite-project/src/components/layout/Header.tsx`, `Footer.tsx`, `src/components/ContactForm.tsx`, `src/pages/Home.tsx`, `src/pages/AdminLogin.tsx`, `src/pages/Backoffice.tsx` | Read all copy from `useLocale().t` instead of hardcoded strings |
| `vite-project/tsconfig.app.json` | `resolveJsonModule: true`, enabling typed JSON imports for both dictionaries |

### 4.2 Pages and routes

No new routes. The switcher must render correctly on all three existing ones:

| Route | Interface |
| --- | --- |
| `/` | Public portfolio single page |
| `/login` | Admin sign-in (F-07) |
| `/backoffice` | Admin message manager (F-08), including its modal |

### 4.3 Endpoints and external interfaces

None. This feature is entirely client-side: `localStorage` and `navigator.language`/`navigator.languages`. It makes no Supabase call and adds no HTTP endpoint.

## 5. Data, Validations, and Expected Behavior

### 5.1 Data model

A single `localStorage` entry (key `locale`) whose value is `'en'` or `'fr'`, or absent. Absent means "resolve from the browser's language on next load." No other client or server state is introduced. Non-text section data (image paths, outbound URLs, technology tags) stays in component-local arrays, indexed to line up positionally with each dictionary's arrays.

### 5.2 Validation rules

- Only `'en'` and `'fr'` are treated as valid stored values; anything else (missing key, corrupted/hand-edited value) is treated the same as absent and falls back to the browser-language resolution.
- `fr.json` must satisfy the `Dictionary` type derived from `en.json` — enforced by `tsc` during `npm run build` via `resolveJsonModule`, so a missing or misshapen key in the French file fails the build rather than silently rendering `undefined`.
- The inline bootstrap script (for `<html lang>`) and the React locale module must resolve the same way, so the pre-paint guess and the post-hydration state never disagree.

### 5.3 Expected behavior

- Activating the switcher changes every visible string on the current page simultaneously; nothing is left in the previous language.
- The stored choice persists across a full browser restart and across new tabs to the same site.
- Clearing site data (or a first visit in a different browser) returns to resolving from the browser's language.
- Back-office message timestamps render using the active locale's date/time formatting conventions (e.g. `Sep 6, 2026, 3:45 PM` in English vs. `6 sept. 2026, 15:45` in French).
- `npm run lint` and `npm run build` complete without errors, the latter including a successful type-check of `fr.json` against the English-derived `Dictionary` type.

## 6. Acceptance Criteria

### AC-I18N-01: Switcher present everywhere

**Given** the visitor opens `/`, `/login`, or `/backoffice`  
**When** the page renders  
**Then** the same language switcher is visible, in the same relative position (beside the theme toggle), and operable on all three.

### AC-I18N-02: Full-text translation

**Given** the site is switched from English to French  
**When** any section, form, or admin screen is inspected  
**Then** its navigation, headings, paragraphs, buttons, labels, and messages all change to French, with no element left showing English text (proper nouns and technology tags excepted).

### AC-I18N-03: Choice persists

**Given** the visitor activates the switcher  
**When** they refresh the page, open a new tab to the site, or close and reopen the browser  
**Then** the same language they chose is shown.

### AC-I18N-04: Browser language is the default

**Given** a visitor who has never switched  
**When** their browser's language is English, French, or something else entirely  
**Then** the site resolves to French only when French is among the browser's languages, and to English otherwise.

### AC-I18N-05: `<html lang>` and title stay accurate

**Given** either language is active  
**When** the page's `lang` attribute and browser tab title are inspected  
**Then** both match the active locale.

### AC-I18N-06: Accessible control

**Given** a keyboard or assistive-technology user  
**When** they reach the switcher  
**Then** it has a visible focus indicator and an accessible name describing the action.

### AC-I18N-07: Global specification compliance

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

- Switcher appears and works identically on `/`, `/login`, and `/backoffice`.
- Switch to French, refresh: stays French. Switch to English, refresh: stays English.
- Clear `localStorage` for the site and reload with the browser's language set to French: the site opens in French. Set it to something unsupported (e.g. German) and reload: the site opens in English.
- Walk every section of the home page, the contact form's success and error states, the login form's error state, and the back office (empty, populated, and modal-open) in both languages — confirm nothing is left untranslated.
- Keyboard-tab to the switcher: visible focus ring, meaningful accessible name.
- `localStorage.getItem('locale')` reflects the last explicit choice.

## 8. Dependencies and Handoffs

- **Touches every prior feature's copy** (F-02 Header/Footer, F-03 Home Page, F-04 Portfolio Profile Content, F-05 Links, F-06 Contact Form, F-07 Admin Login, F-08 Admin Back Office) because it moves their hardcoded strings into dictionaries. No behavior in those features changes — only where their text is declared.
- **Mirrors F-09's architecture** (root-mounted control, `localStorage`-backed preference, pre-paint bootstrap script) so the two settings — theme and language — behave consistently and sit side by side in the UI.
- **Depends on nothing new** architecturally; it adds a client-side module, a React context/provider pair, and a root-level component, with no Supabase or routing changes.
- Update `README.md`'s tech stack / features list once shipped, and note the `locale` `localStorage` key it introduces alongside the existing `theme` key.
