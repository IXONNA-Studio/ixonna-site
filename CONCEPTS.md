# Module 16 — Full-Stack Capstone

## 🎯 Purpose

Three challenging concepts applied in this project.

## 📝 How to Use the CONCEPTS.md Log

---

## ✏️ Concept - 01

**🏷️ Name:**

CSS custom properties driving a light/dark theme

**🎯 Purpose:**

Every themed color on the site (backgrounds, text, borders, accents, success/error
states) is expressed as a CSS custom property instead of a hardcoded hex value.
The active theme resolves through three layers, in order of precedence: an
explicit visitor choice pinned via `data-theme` on `<html>`, then the OS-level
`prefers-color-scheme` media query, then a light default. This lets the entire
site — public page and admin screens alike — repaint in a different theme with
no JavaScript touching individual components.

**❓ Why it was challenging:**

The site already had roughly 50 hardcoded hex colors scattered across
`App.css` before this feature existed, so the bulk of the work was migrating
every one of them into a token without changing how anything looked in light
mode — verified afterward with side-by-side screenshots. The trickier part was
the precedence itself: CSS specificity rules mean the dark `@media` block and
the explicit `[data-theme="dark"]` override both have to exist, be guarded
against each other (`:not([data-theme='light'])`), and agree with a
synchronous bootstrap script that runs *before* React or the stylesheet has
painted anything — otherwise a returning visitor with dark mode saved sees a
flash of light mode for one frame before it corrects itself.

**📍 Where (file & line):**

- `vite-project/src/index.css` (lines 15, 68–69, 106) — light tokens on `:root`,
  the OS-preference media query, and the explicit `data-theme="dark"` override
- `vite-project/index.html` (lines 13–22) — the pre-paint bootstrap script
- `vite-project/src/lib/theme.ts` — resolution/persistence logic
- `vite-project/src/components/ThemeToggle.tsx` — the control itself

---

## ✏️ Concept - 02

**🏷️ Name:**

Row Level Security (RLS) policies in Supabase/PostgreSQL

**🎯 Purpose:**

This project has no custom backend server — the browser talks to Supabase's
auto-generated REST API directly using a public "anon" key. RLS policies on
the `messages` table are what make that safe: anyone can `insert` a contact
message, but only the signed-in admin account can `select`, `update`, or
`delete` rows, so a visitor can never read someone else's message.

**❓ Why it was challenging:**

The mental model is different from a typical Express/REST backend, where
"can this request do X" is a line of code in a route handler. In Supabase,
that check runs *inside Postgres* on every single query, regardless of which
client sent it, and it is enforced through two separate mechanisms that both
have to agree: a `grant`/`revoke` statement (table-level permission) and a
`policy` with a `using`/`with check` clause (row-level permission). Getting
this wrong is easy to miss during development, since the Supabase dashboard's
own SQL editor runs as a privileged role that bypasses RLS — the only way to
be sure anonymous users truly cannot read back their own submitted message was
to test with the public anon key from the deployed site itself, not from the
dashboard.

**📍 Where (file & line):**

`supabase/schema.sql` (lines 12–41) — `enable row level security`, the four
policies (insert/select/update/delete), and the matching `grant`/`revoke`
statements.

---

## ✏️ Concept - 03

**🏷️ Name:**

React Context with type-checked JSON dictionaries for internationalization

**🎯 Purpose:**

The site supports English and French. Every component reads its text through
one `useLocale()` hook (`{ locale, t, setLocale }`) backed by a React Context,
instead of each page managing its own translation lookup or receiving
translated strings as props. The two dictionaries (`en.json`, `fr.json`) are
plain structured JSON so a non-developer translator could edit them directly.

**❓ Why it was challenging:**

The hard part wasn't the Context itself — it was making the *shape* of the
French file provably match the English one. TypeScript can infer a type from
a JSON import (`type Dictionary = typeof en`) once `resolveJsonModule` is
enabled, which means a missing or misnamed key in `fr.json` fails the build
instead of silently rendering `undefined` in the browser. Wiring that up also
meant splitting the Context object from the Provider component into separate
files (an ESLint rule, `react-hooks/set-state-in-effect`'s sibling
`react-refresh/only-export-components`, otherwise flags a file that exports
both a component and a non-component value), and making sure the synchronous
`<html lang>` bootstrap script in `index.html` and the React provider resolve
the *same* stored/browser locale, so the language never visibly flips after
the page has already rendered.

**📍 Where (file & line):**

- `vite-project/tsconfig.app.json` (line 13) — `resolveJsonModule: true`
- `vite-project/src/i18n/index.ts` — the `Dictionary` type and dictionary lookup
- `vite-project/src/lib/i18n.ts` — stored/browser locale resolution
- `vite-project/src/context/locale-context.ts` + `LocaleProvider.tsx` — the
  Context/Provider split
- `vite-project/index.html` (lines 24–37) — the matching pre-paint bootstrap

---
