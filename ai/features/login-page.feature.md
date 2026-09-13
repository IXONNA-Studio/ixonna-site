# Feature Specification: Admin Login Page

**Feature ID:** F-07  
**Status:** Implemented baseline  
**Governing specification:** [../ai-spec.md](../ai-spec.md)

This feature must be implemented and reviewed under the Global AI Specification. The global specification is authoritative for architecture, security, accessibility, static hosting, coding conventions, and the Definition of Done. This document adds only the detail specific to the admin login page. It consumes the Supabase configuration from Setup and Deploy (F-01) and hands the authenticated session to the Admin Back Office feature (planned, F-08).

## 1. Feature Goal and Scope

### 1.1 Goal

Give the single course administrator (`admin@codeboxx.com`) a way to sign in to Supabase Auth from a page that is reachable only by typing its URL or a secret keyboard shortcut, so that the protected contact-message back office (`/backoffice`) can require a valid session. A visitor who is not signed in must never see contact data; a signed-in admin must reach the back office, stay signed in across refreshes, and be able to sign back out.

### 1.2 Scope in

- A concealed login route (`/login`) reachable only by typing the URL or a secret keyboard shortcut, never linked from the header, footer, mobile bottom navigation, CTAs, or any public content.
- A global secret `keydown` shortcut that navigates to the login route and does nothing else.
- A login form with an email field and a password field, each with a visible label, mirroring the validation and feedback conventions of the Contact Form (F-06).
- Submitting credentials to Supabase Auth (`signInWithPassword`) and establishing a browser session on success.
- Redirecting to the admin back office (`/backoffice`) on success, and redirecting an already-authenticated visitor away from the login page.
- Client-side routing (React Router) and a GitHub Pages SPA fallback so `/login` resolves on first load and on refresh.
- A shared route guard that sends an unauthenticated visitor from a protected route to `/login`, optionally preserving the intended path.
- Explicit handling of loading, invalid-credentials, backend/network failure, already-authenticated, expired-session, and Supabase-not-configured states.
- A sign-out action available to an authenticated admin (the control may render in the back office; the helper belongs here).
- Keeping all secrets out of the repository; the admin password is supplied only through Supabase.

### 1.3 Scope out

- The admin back office itself: listing, reading, updating, or deleting contact messages, and their UI. That is F-08.
- The Supabase `messages` table schema and row-level security policies, owned by Setup and Deploy (F-01) and the database setup.
- User registration, password reset, "remember me", multi-user roles, social login, or any second account.
- Email verification or magic-link flows.
- Server-side session handling; there is no server. Supabase issues and stores the session in the browser.
- Any change to the public portfolio, its navigation, or the contact form beyond not linking to the admin area.

## 2. Requirements Breakdown

### REQ-LOGIN-001: Concealed login route

The login page must live at `/login`. It must be reachable **only** by (a) manually typing the URL into the address bar, or (b) the secret keyboard shortcut defined in REQ-LOGIN-015. It must **not** appear in, or be linkable from, the header navigation, the footer, the mobile bottom navigation bar, any call to action, any sitemap-like public content, or any public copy. No `<a>`, `<button>`, or route link anywhere in the public site may reference `/backoffice` or `/login`. The admin navigation items array used by the header/mobile nav must contain no admin entry.

### REQ-LOGIN-002: Client-side routing and GitHub Pages fallback

The application must adopt a client-side router (`react-router-dom`, `BrowserRouter`) with a `basename` of `import.meta.env.BASE_URL` (the Vite `base` value). Because GitHub Pages has no server-side rewrite, the build must emit a `dist/404.html` that boots the same single-page app, so that a direct load of `/login` (and a refresh on it) resolves to the login page instead of a hosting 404. This is produced by a small Vite plugin in `vite.config.ts` that copies `dist/index.html` to `dist/404.html` on `closeBundle`, keeping it in sync with hashed asset names. The existing public single-page content must continue to render at `/` with its hash anchors unchanged; unknown paths redirect to `/`.

### REQ-LOGIN-003: Login form fields and labels

The form must contain an email input (`type="email"`, `autoComplete="username"`), a password input (`type="password"`, `autoComplete="current-password"`), and a submit button labelled for the action (for example "Sign in"). Each field must have a visible `<label>` associated by `htmlFor`/`id`. Both fields are required. The form carries `noValidate` and owns its own messages, following the Contact Form pattern.

### REQ-LOGIN-004: Pre-submission validation

On submit, before any network call, the handler must validate and must not call Supabase when a check fails, in order:

- Completeness: if email or password is empty or whitespace only, show "Please enter your email and password." and stop.
- Email: must match a basic email shape (`something@something.tld`, no spaces).
- Password: must be non-empty (no maximum, no composition rules enforced client-side).

Only the first failing check is reported. The failing control is marked `aria-invalid`, references the message via `aria-describedby`, and receives keyboard focus. The submit button is disabled while a field is empty, while a request is in flight, and while Supabase is not configured.

### REQ-LOGIN-005: Credential submission

On a valid submit, the handler must call `supabase.auth.signInWithPassword({ email, password })` with the values entered in the form, through a focused helper in `src/lib/auth.ts` that uses the shared client exported from `src/lib/supabaseClient` (the project's TypeScript module; the assignment's `supabaseClient.js` refers to the same file — imports are extensionless). The email is trimmed; the password is sent exactly as typed. Exactly one sign-in attempt is made per submit. No new client is created.

The `admin@codeboxx.com` user must already exist in Supabase Auth, created through the Supabase dashboard. The application never signs users up, invites them, or creates the account; it only signs in an existing one.

### REQ-LOGIN-006: Success behavior

On a successful sign-in, the page must navigate to the Back Office route (`/backoffice`) — or to the `redirect` path captured by the guard when present and same-origin. The visitor must land on the Back Office, not back on the login form, and the form must not display credentials after navigation. Session persistence is covered by REQ-LOGIN-016.

### REQ-LOGIN-007: Failure feedback

On a failed sign-in, the form must show a single, uniform message — "Invalid login credentials" — in a `role="alert"` region, styled visually distinct from ordinary text by reusing the Contact Form `.form-error` treatment (red text on a red-tinted box with an X icon). It must not reveal whether the email exists, must keep the entered email, must clear the password, and must re-enable the form for another attempt. A network or unexpected error shows "Could not sign in right now. Please try again." in the same styling. A Supabase rate-limit response is treated as a failure with the retry wording.

### REQ-LOGIN-008: Loading state

While the sign-in request is in flight, the submit button must show a busy label (for example "Signing in...") and be disabled, and the inputs should be non-interactive or visibly pending, so a second submission cannot be triggered.

### REQ-LOGIN-009: Already-authenticated redirect

If a visitor with a valid session navigates to `/login`, the page must not show the form; it must redirect to `/backoffice`. This applies equally on a fresh load or refresh of `/login` when a persisted session exists. The check must run after the initial session load (REQ-LOGIN-016) resolves, not during render, so the form never flashes first.

### REQ-LOGIN-010: Route guard and expired session

A shared guard component must wrap protected routes. When there is no session, or the session has expired or been signed out, the guard must redirect to `/login` and may pass the attempted path as a `redirect` parameter. The guard must show a loading state while the initial session check is pending and must never briefly flash protected content.

### REQ-LOGIN-011: Sign-out

A `signOut` helper in `src/lib/auth.ts` must call `supabase.auth.signOut()`, and after it resolves the app must land on `/login` with no session. Auth state changes (including sign-out in another tab) must be observed via `supabase.auth.onAuthStateChange` so the UI updates without a manual refresh.

### REQ-LOGIN-012: Supabase-not-configured fallback

When `isSupabaseConfigured` is false, the login page must still render, must show a notice that authentication is unavailable in this environment, and must disable the submit button. No runtime error may occur, and no other route may crash.

### REQ-LOGIN-013: Secrets and authorization boundary

No credential, password, service-role key, or admin token may appear in source, committed files, or browser-visible content. The client guard is a convenience only; actual protection of contact data is enforced by Supabase row-level security keyed to `admin@codeboxx.com`, which this feature depends on but does not own.

### REQ-LOGIN-014: Accessibility and responsiveness

The page must use a single `h1`, a labelled form, visible focus indicators, `role="alert"` for the failure message, focus movement to the first invalid field, and a layout that fits a 390px-wide viewport with no horizontal overflow.

### REQ-LOGIN-015: Secret keyboard shortcut

A global `keydown` listener, mounted once for the app lifetime, must let a user reach `/login` without a visible link. The trigger must be a deliberate combination that will not fire by accident: either a modifier chord (for example `Ctrl`/`Cmd` + `Shift` + a letter) or an ordered multi-key sequence entered within a short timeout. It must not be a single common key. The listener must:

- ignore the shortcut while focus is in an `input`, `textarea`, `select`, or any `contenteditable` element, so it never disturbs the contact form;
- only navigate to `/login` (client-side, via the router) — it must never authenticate, reveal credentials, or bypass the login form or the route guard;
- be removed when its host unmounts (no leaked listeners);
- have no visible affordance, tooltip, or console hint, and appear in no public copy.

The shortcut is obfuscation, not a security control; REQ-LOGIN-013 still applies. The exact key combination is an implementation detail but must be recorded in `docs/` (not in user-facing content) so the administrator knows it.

### REQ-LOGIN-016: Session establishment and persistence

A successful sign-in must establish a Supabase session that persists across page loads. The Supabase client keeps its default persisted-session behaviour: supabase-js writes the session to browser storage and refreshes the token automatically. On every app start, the router must resolve the persisted session via `supabase.auth.getSession()` before deciding what to render, so that:

- refreshing any page while signed in keeps the admin signed in — no re-login is required;
- refreshing `/backoffice` re-renders the Back Office, not the login form;
- loading `/login` (or `/`) while a valid session exists redirects to `/backoffice` once the session check resolves;
- the session ends only on explicit sign-out (REQ-LOGIN-011) or on a token expiry that cannot be refreshed, after which the guard sends the user to `/login`.

No application code writes or reads the session store directly; only supabase-js manages it.

## 3. User Flow

### 3.1 Successful sign-in

1. The admin types `/login` into the address bar.
2. The login form renders after the initial session check confirms no session.
3. The admin enters `admin@codeboxx.com` and the password and activates "Sign in".
4. Validation passes; the button shows "Signing in..." and is disabled.
5. Supabase returns a session; supabase-js stores it in the browser.
6. The app navigates to `/backoffice` (or the captured `redirect` path).

### 3.2 Invalid credentials

1. The admin submits a wrong email or password.
2. The handler makes one `signInWithPassword` call.
3. Supabase returns an error.
4. The form shows "Invalid login credentials" in the alert region, keeps the email, and re-enables.
5. No session is created; navigating to `/backoffice` still redirects back to the login page.

### 3.3 Already signed in

1. A visitor with a valid session opens `/login`.
2. After the session check resolves, the form is not shown.
3. The app redirects to `/backoffice`.

### 3.3b Session persists across a refresh

1. The admin has signed in and is on `/backoffice`.
2. The admin refreshes the browser (or closes and reopens the tab).
3. `404.html` boots the SPA; the router calls `getSession()` and finds the persisted, still-valid session.
4. The Back Office re-renders directly; the admin is not asked to sign in again.
5. Manually visiting `/login` in this state redirects straight to `/backoffice`.

### 3.4 Reaching the login page (URL, secret shortcut, refresh)

1. The admin either types `https://<pages-domain>/login`, or, while on any page of the site, presses the secret key combination.
2. For a direct/refreshed URL, GitHub Pages serves `404.html`, which boots the SPA; for the shortcut, the app is already loaded and the listener calls the router.
3. The router resolves `/login` and renders the login page.
4. Refreshing the page repeats step 2-3 with the same result.
5. The shortcut is ignored if pressed while a text field (such as the contact form) has focus.

### 3.5 Authentication unavailable

1. The site is served without Supabase environment variables.
2. `/login` renders with a notice that authentication is unavailable.
3. The submit button is disabled; no request can be made.

### 3.6 Sign-out

1. A signed-in admin activates "Sign out" in the back office.
2. The `signOut` helper clears the Supabase session.
3. The app lands on `/login`; protected routes now redirect there.

### 3.7 Keyboard and assistive-technology path

1. The visitor tabs into the form: email, password, submit, in order, each with visible focus and an announced label.
2. On a failed submit, focus moves to the first invalid field and the alert text is announced.
3. On success, focus lands in the destination route's main heading region.

## 4. Interfaces Involved

### 4.1 Components and files

| File or area | Responsibility |
| --- | --- |
| `vite-project/src/pages/AdminLogin.tsx` | Renders the `/login` route: the form, validation, submit, feedback, and redirects |
| `vite-project/src/pages/Backoffice.tsx` | Placeholder protected page: shows the signed-in email and a working "Sign out" (real UI is F-08) |
| `vite-project/src/pages/Home.tsx` | The public portfolio single page, moved out of `App.tsx` |
| `vite-project/src/lib/auth.ts` | Focused helpers: `signIn(email, password)`, `signOut()`, `getSession()`, and `onAuthChange` (an `onAuthStateChange` subscription wrapper) |
| `vite-project/src/context/AuthProvider.tsx` + `auth-context.ts` | Loads the persisted session once, keeps it in sync, exposes `useAuth()` → `{ status, session }` |
| `vite-project/src/components/RequireAuth.tsx` | Shared guard: renders children when a session exists, otherwise redirects to `/login` with a `redirect` param; shows a loading state during the initial check |
| `vite-project/src/components/AdminShortcut.tsx` | Mounts the global `keydown` listener that navigates to `/login` when the sequence `admin` is typed; ignores key events originating in form fields; renders nothing |
| `vite-project/src/lib/supabaseClient.ts` | Existing client; `supabase.auth` is used by `auth.ts` |
| `vite-project/src/App.tsx` | Router shell: `BrowserRouter` + `AuthProvider` + `AdminShortcut` + `Routes` for `/`, `/login`, guarded `/backoffice`, and a `*` redirect to `/` |
| `vite-project/vite.config.ts` | `base` value the router `basename` matches; the Vite plugin that writes `dist/404.html` |
| `vite-project/package.json` | Adds `react-router-dom` |
| `docs/admin-access.md` | Records the `/login` route, the secret sequence, and the `admin@codeboxx.com` setup |

### 4.2 Pages and routes

| Route | Interface | Access |
| --- | --- | --- |
| `/` | Public portfolio single page | Public; unchanged, keeps hash anchors |
| `/login` | Admin login page | Reached only by typing the URL or the secret shortcut; absent from header, footer, and mobile bottom navigation |
| `/backoffice` | Admin back office (F-08) | Requires a valid Supabase session via `RequireAuth` |
| Unknown `/backoffice/*` | Handled in-app | Redirects to `/login` or an in-app not-found |

### 4.3 Endpoints and external interfaces

- No custom HTTP endpoint and no server.
- Supabase Auth via `@supabase/supabase-js`:
  - `supabase.auth.signInWithPassword({ email, password })` — sign-in.
  - `supabase.auth.getSession()` — initial session load.
  - `supabase.auth.onAuthStateChange(callback)` — react to sign-in/out and expiry.
  - `supabase.auth.signOut()` — sign-out.
- The session (access and refresh tokens) is stored by supabase-js in browser storage; it is not sent anywhere else by this app.

## 5. Data, Validations, and Expected Behavior

### 5.1 Data model

Login form state is `{ email: string; password: string }`, initialised empty. Auxiliary UI state: a nullable `error` string, a nullable `invalidField` (`'email' | 'password'`), an `isSubmitting` boolean, and a `sessionStatus` (`'loading' | 'signed-in' | 'signed-out'`) derived from Supabase. The password is never persisted to component state beyond what is needed to submit and is cleared on unmount. No credentials are written to `localStorage` by application code; only supabase-js manages the session store.

### 5.2 Validation rules

- Completeness: `email.trim()` and `password` both non-empty, otherwise "Please enter your email and password."
- `email.trim()` matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, otherwise "Please enter a valid email address."
- `password` length >= 1 (no upper bound, no character-class rules on the client).
- Checks run completeness, email, password; the first failure sets `error` and `invalidField`, moves focus, and returns.
- The form carries `noValidate`.
- The submit button is disabled when `isSubmitting`, when `!isSupabaseConfigured`, or when either field is empty.
- Email is trimmed before submission; password is sent unchanged.

### 5.3 Expected behavior

- While either field is empty, submit is disabled and the form cannot be sent by pointer or Enter.
- A validation failure shows the message in `role="alert"`, marks the field `aria-invalid`, moves focus to it, and makes no network call.
- A valid submit makes exactly one `signInWithPassword` call; the button reads "Signing in..." and is disabled during it.
- Success establishes a persisted session and navigates to `/backoffice` (or the `redirect` path); the form unmounts. The visitor lands on the Back Office, not the login form.
- After a successful sign-in, refreshing the page (or reopening the tab) keeps the admin signed in: `getSession()` returns the persisted session and `/backoffice` re-renders without a re-login.
- Failure shows "Invalid login credentials" (or the retry message for network/unexpected errors) in the red `.form-error` style with an X icon, keeps the email, clears the password, creates no session, and re-enables the form.
- Visiting `/login` with a valid session redirects to `/backoffice` after the session check resolves, with no form flash — on a first load or a refresh.
- Visiting `/backoffice` without a session redirects to `/login`; the guard shows a loading state, never protected content, during the initial check.
- After `signOut`, protected routes redirect to `/login` and `getSession()` returns null.
- With Supabase unconfigured, `/login` renders its notice with a disabled button and no exception; `/` is unaffected.
- A direct load or refresh of `/login` on GitHub Pages resolves to the login page via `404.html`.
- The secret shortcut, pressed anywhere except inside a text field, navigates to `/login`; pressed inside a text field it does nothing. It never signs anyone in.
- The header, footer, and mobile bottom navigation render no admin entry, and a full read of the public DOM exposes no `/backoffice` link.
- `npm run lint` and `npm run build` complete without errors; the build emits `404.html` alongside `index.html`.

## 6. Acceptance Criteria

### AC-LOGIN-01: Route is concealed

**Given** the deployed site  
**When** the header, footer, mobile bottom navigation, CTAs, and full public DOM are inspected and the site is crawled from `/`  
**Then** nothing links to `/backoffice` or `/login`, and the route is reachable only by typing `/login` in the address bar or by the secret shortcut.

### AC-LOGIN-02: Secret keyboard shortcut

**Given** the app is loaded on any public page  
**When** the user presses the secret key combination while no text field is focused  
**Then** the app navigates to `/login` and shows the login form; **and** when the same combination is pressed with a contact-form field focused, nothing happens and no navigation occurs; **and** the shortcut never establishes a session.

### AC-LOGIN-03: Refresh on GitHub Pages

**Given** the login page is open at `/login` on the deployed Pages URL  
**When** the visitor refreshes  
**Then** the login page loads again without a hosting 404, served through `404.html`.

### AC-LOGIN-04: Fields and labels

**Given** the login page renders  
**When** the form is inspected  
**Then** an `type="email"` email input and a `type="password"` password input are present, each with a visible associated label, and both are required.

### AC-LOGIN-05: Client validation blocks submission

**Given** email is empty or malformed, or password is empty  
**When** the visitor submits  
**Then** no `signInWithPassword` call is made, a message is shown in `role="alert"`, the offending field is `aria-invalid` and focused, and (for an empty field) the submit button was already disabled.

### AC-LOGIN-06: Successful sign-in navigates to the Back Office

**Given** valid credentials for `admin@codeboxx.com` and a configured Supabase project  
**When** the visitor submits  
**Then** exactly one `signInWithPassword` call is made, a session is stored in browser storage, and the app navigates to `/backoffice` (the visitor does not stay on the login form).

### AC-LOGIN-07: Invalid credentials show a distinct error

**Given** a wrong email or password  
**When** the visitor submits  
**Then** the form shows exactly "Invalid login credentials" in the red `.form-error` style (visually distinct from normal text) inside a `role="alert"` element, no session is created, the email is preserved, and the form is usable again.

### AC-LOGIN-08: Session persists across refresh

**Given** the admin has signed in and is on `/backoffice`  
**When** they refresh the page or reopen the tab  
**Then** `getSession()` returns the persisted session, `/backoffice` re-renders without a re-login, and visiting `/login` in this state redirects straight to `/backoffice`.

### AC-LOGIN-09: Loading state

**Given** a submitted valid form  
**When** the request is in flight  
**Then** the submit button shows a busy label and is disabled, and a second submission cannot be triggered.

### AC-LOGIN-10: Already authenticated

**Given** a visitor with a valid session  
**When** they open `/login`  
**Then** the form is not shown and the app redirects to `/backoffice`.

### AC-LOGIN-11: Guard and expired session

**Given** no session, or a session that has been signed out or has expired  
**When** the visitor opens `/backoffice`  
**Then** the guard shows a loading state during the check and then redirects to `/login` without rendering protected content.

### AC-LOGIN-12: Sign-out

**Given** a signed-in admin  
**When** they activate sign-out  
**Then** `supabase.auth.signOut()` runs, the app lands on `/login`, and `/backoffice` redirects to login thereafter.

### AC-LOGIN-13: Authentication unavailable

**Given** the site is served without `VITE_SUPABASE_*` variables  
**When** `/login` renders  
**Then** a notice is shown, the submit button is disabled, no request can be made, and no route throws.

### AC-LOGIN-14: No secrets, RLS still required

**Given** the repository and the built bundle  
**When** they are searched  
**Then** no admin password, service-role key, or session token is present, and the design relies on Supabase row-level security for actual data protection.

### AC-LOGIN-15: Accessibility

**Given** a keyboard or assistive-technology user  
**When** they move through the login page  
**Then** there is one `h1`, the fields announce their labels, focus is visible and ordered, the failure message is announced, and focus moves to the first invalid field on a failed submit.

### AC-LOGIN-16: Global specification compliance

**Given** the feature is reviewed against [../ai-spec.md](../ai-spec.md)  
**When** static hosting, security, accessibility, routing, and documentation rules are checked  
**Then** the feature adds no custom backend, keeps the admin area out of public navigation, commits no secret, handles refresh/logout/loading/expired-session explicitly, and contradicts nothing in the global specification.

## 7. Verification Checklist

From `vite-project/`:

```bash
npm run lint
npm run build
```

Then verify:

- `dist/404.html` exists and is a copy of the SPA entry; `dist/index.html` still renders the public portfolio.
- Loading `/login` directly, and refreshing it, both show the login form (locally via preview and on the deployed Pages URL).
- No element on the public site links to `/backoffice` or `/login`, and the header, footer, and mobile bottom nav (checked at a 390px width) contain no admin entry.
- Pressing the secret key combination on the public site navigates to `/login`; pressing it with a contact-form field focused does nothing.
- `grep` of `src/` for the strings that build the header/footer nav shows no `/backoffice` href.
- Submitting with an empty or malformed email, or empty password, shows the matching message and makes no auth request (Network panel).
- With a configured Supabase project: wrong credentials show "Invalid login credentials" in red (an X-icon `.form-error` box) and create no session; correct credentials navigate to `/backoffice`.
- While signing in, the button reads "Signing in..." and is disabled.
- After a successful sign-in, refresh `/backoffice` (and reopen the tab): the Back Office still loads, no re-login is asked, and `/login` now redirects to `/backoffice`.
- Visiting `/login` while signed in redirects to `/backoffice`; visiting `/backoffice` while signed out redirects to `/login` with no content flash.
- Signing out returns to `/login` and `/backoffice` no longer loads.
- Running without `VITE_SUPABASE_*` renders `/login` with its notice and a disabled button, and `/` still works.
- `grep` of the repo and `dist/` for the admin password, `service_role`, and `access_token` returns nothing.
- Keyboard-tab through the form: focus is visible and ordered, labels are announced, the alert is announced on failure.
- At a 390px width the login page has no horizontal overflow.

## 8. Dependencies and Handoffs

- **Depends on** Setup and Deploy (F-01) for Supabase environment variables and the Vite `base` value, and on the database setup for the `messages` table and its row-level security policies keyed to `admin@codeboxx.com`.
- **Provides** to the Admin Back Office (F-08): the `RequireAuth` guard, the `auth.ts` helpers (`signIn`, `signOut`, `getSession`, auth-state subscription), the `/login` route, the secret-shortcut listener, and the routing plus `404.html` fallback.
- **Requires** that F-08 render the "Sign out" control using this feature's `signOut` helper and sit behind `RequireAuth`.
- The README and `docs/supabase-setup.md` must be updated to describe creating the `admin@codeboxx.com` user in Supabase Auth and that `/login` is reachable only by URL or the secret shortcut. The exact key combination must be recorded in `docs/` for the administrator, never in user-facing content.
