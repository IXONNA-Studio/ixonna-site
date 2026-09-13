# Feature Specification: Admin Back Office

**Feature ID:** F-08  
**Status:** Implemented baseline (list, table, full-message modal, delete, logout, empty/error/guard states). The `status` column, read/unread/archived triage, the unread indicator, and pagination remain planned.  
**Governing specification:** [../ai-spec.md](../ai-spec.md)

This feature must be implemented and reviewed under the Global AI Specification. The global specification is authoritative for architecture, security, accessibility, static hosting, coding conventions, and the Definition of Done. This document adds only the detail specific to the admin back office. It consumes the authenticated session and route guard from Admin Login (F-07) and the `messages` table and its row-level security from the Contact Form (F-06) and the database setup. Today `/backoffice` renders a placeholder that only proves the session and sign-out.

## 1. Feature Goal and Scope

### 1.1 Goal

Let the single administrator, once signed in, read and triage the contact messages that visitors submit: see them newest first, open one to read it in full, mark it read / unread / archived, and delete ones that are handled — all from `/backoffice`, with every data operation enforced by Supabase row-level security keyed to `admin@codeboxx.com`, and every non-happy path (loading, empty, error, expired session) handled explicitly.

### 1.2 Scope in

- The `/backoffice` page content, rendered only inside the existing `RequireAuth` guard (F-07).
- Fetching `messages` rows for the signed-in admin, newest first, in bounded pages (page size plus a "Load more" or numbered paging).
- Reading a single message in full: name, email, message text, timestamp.
- A per-message `status` (`unread` / `read` / `archived`) persisted to a new column on `messages`.
- Deleting a message with an explicit confirmation step.
- An unread count / indicator.
- The signed-in identity and the "Sign out" control (the `signOut` helper is owned by F-07).
- Distinct loading, empty, fetch-error, and unauthorized / expired-session states.
- A focused data module in `src/lib/contactMessages.ts` exposing list / set-status / delete, mirroring `createContactMessage`.
- Accessible, responsive layout for the list and the detail view.

### 1.3 Scope out

- The public contact form and its submission path (F-06); this feature only reads what that writes.
- Authentication, the login page, the route guard, routing, and the `404.html` fallback (F-07).
- The `messages` table's base columns and its insert / select / update / delete RLS policies (F-06 and the database setup); this feature adds only the additive `status` column and a column-level anon insert grant.
- Replying from inside the app, email sending, notifications, labels or folders beyond `unread`/`read`/`archived`, full-text search, CSV export, bulk actions, and audit logging.
- Any second admin account, roles, or a permissions model.
- Editing the content of a submitted message.

## 2. Requirements Breakdown

### REQ-BACKOFFICE-001: Guarded page

The back office renders only at `/backoffice` and only inside `RequireAuth` (F-07). An unauthenticated visitor is redirected to `/login`. The page must not request message data before `useAuth().status` resolves to `authed`, and must never flash message content during the session check.

### REQ-BACKOFFICE-002: Message table

On load, the page fetches `messages` ordered by `created_at` descending through the data module. **As built**, every row is fetched in one `select` (no pagination yet — acceptable at portfolio volume; the bounded page-of-25 with "Load more" is deferred). Rows render in a `<table>` with columns **Name**, **Email**, **Date**, and **Actions**. One row per message, in the fetched (newest-first) order. The Email is a `mailto:` link; the Date uses `<time datetime>` with a locale-formatted label; the Actions cell holds a "View" and a "Delete" button.

### REQ-BACKOFFICE-003: Read a message in a modal

Clicking a message row, or its "View" button, opens a **modal** (`<dialog>` via `showModal()`) containing: the sender name, the email as a `mailto:` link, the full date and time, and the complete message text (wrapped, line breaks preserved). The modal has a close control (an "×" button, plus a "Close" button), and also closes on **Escape** and on a **click outside** the modal body (the `::backdrop`). `showModal()` provides focus containment; on close, state is synced back via the dialog's native `close` event. Clicks on the Delete/email controls inside a row do not open the modal (`stopPropagation`).

### REQ-BACKOFFICE-004: Read / unread / archived state

`messages` gains a `status` column: `text not null default 'unread'` constrained to `'unread' | 'read' | 'archived'`. Opening a message sets it to `read`; the admin can toggle it back to `unread` and can `archive` a handled one. Changes are written through the data module (`update({ status }).eq('id', id)`) and persist across refresh. On write failure the UI reverts the optimistic change and shows an error.

### REQ-BACKOFFICE-005: Delete a message

Deleting requires an explicit confirmation ("Delete this message? This cannot be undone."). On confirm, the data module issues `delete().eq('id', id)`; on success the row leaves the list; on failure the row stays and an error is shown. There is no undo and no bulk delete.

### REQ-BACKOFFICE-006: Unread indicator

The page shows how many messages are unread — a count near the heading and per-row markers — and it updates as statuses change.

### REQ-BACKOFFICE-007: Identity and log out

The page shows the signed-in email and a visible "Log out" button. Activating it calls F-07's `signOut` helper (which calls `supabase.auth.signOut()`, clearing the session from storage and revoking it server-side), then navigates to `/login` (an acceptable "Home or Login" destination). After logout, `/backoffice` redirects to `/login` because the guard now sees no session.

### REQ-BACKOFFICE-008: State handling

The page provides distinct, explicit UI for: initial loading ("Loading messages…" or a skeleton); empty ("No messages yet."); fetch error ("Couldn't load messages." with a working "Try again"); an expired or revoked session mid-use (the guard redirects to `/login`; an in-flight write that returns 401 surfaces "Your session ended. Please sign in again." and routes to `/login`); and Supabase not configured (a defensive notice, no query, no crash).

### REQ-BACKOFFICE-009: Authorization boundary

All reads and writes go through the anon Supabase client carrying the admin's session. Supabase RLS keyed to `admin@codeboxx.com` is the enforcement; the UI guard is convenience only. No `service_role` key, secret, or admin credential appears in source or the built bundle. A session that is not the admin returns nothing from every query.

### REQ-BACKOFFICE-010: Data module

`src/lib/contactMessages.ts` gains `listMessages({ limit, offset })`, `setMessageStatus(id, status)`, and `deleteMessage(id)`, each returning a typed `{ ok: true; data? } | { ok: false; reason: 'not-configured' | 'unauthorized' | 'failed' }`. Components call the module; no `supabase.*` call is made from JSX.

### REQ-BACKOFFICE-011: Accessibility and responsiveness

One `h1`; the list uses real list or table semantics with per-row headings/labels; the detail view manages focus and is escapable; status and delete controls have clear accessible names; timestamps use `<time datetime>`; the layout is usable at a 390px-wide viewport with no horizontal overflow.

## 3. User Flow

### 3.1 Open the back office

1. The admin reaches `/backoffice` (already signed in, or just after signing in).
2. `RequireAuth` confirms the session; the page shows a loading state.
3. The data module returns the newest 25 messages.
4. The list renders newest first, unread rows marked, with an unread count by the heading.

### 3.2 Read a message

1. The admin selects a row.
2. The full message opens with the email as a `mailto:` link.
3. The message is set to `read`; the unread count drops by one.
4. The admin closes the detail and returns to the list.

### 3.3 Triage

1. The admin toggles a message back to `unread`, or archives a handled one.
2. The change persists; a refresh shows the same state.

### 3.4 Delete

1. The admin activates "Delete" on a message.
2. A confirmation asks to confirm; "Cancel" aborts with no change.
3. On confirm, the row is removed after the delete succeeds.

### 3.5 Empty / error

1. With no rows, the page shows "No messages yet."
2. If the fetch fails, it shows an error and a "Try again" control that re-runs the fetch.

### 3.6 Session ends

1. The session expires, or is signed out in another tab.
2. `onAuthStateChange` (F-07) updates auth state; the guard redirects to `/login`.
3. Any write already in flight that returns 401 shows the re-login message and routes to `/login`.

### 3.7 Sign out

1. The admin clicks "Sign out".
2. `signOut` clears the session; the app lands on `/login`.
3. `/backoffice` now redirects to `/login`.

## 4. Interfaces Involved

### 4.1 Components and files

| File | Responsibility |
| --- | --- |
| `vite-project/src/pages/Backoffice.tsx` | **Built.** Replaces the placeholder: identity + log out, the message `<table>`, the full-message `<dialog>` modal, delete with confirm, and the loading/empty/error states |
| `vite-project/src/lib/contactMessages.ts` | **Built.** Adds `listMessages()` and `deleteMessage(id)` (typed `{ ok }` results, mirroring `createContactMessage`). `setMessageStatus` deferred with the `status` column |
| `vite-project/src/lib/supabaseClient.ts` | Existing client used by the data module |
| `vite-project/src/components/RequireAuth.tsx`, `vite-project/src/lib/auth.ts` | From F-07: route guard and `signOut` |
| `vite-project/src/App.css` | Styles for the list and detail, reusing `.admin-shell` / `.admin-card` and the feedback classes |
| `supabase/schema.sql` (plus a CLI migration) | Adds the `status` column, its check, and the column-level anon insert grant |

### 4.2 Pages and routes

| Route | Interface | Access |
| --- | --- | --- |
| `/backoffice` | Admin back office | Valid admin session via `RequireAuth`; otherwise redirected to `/login` |
| `/backoffice?id=<uuid>` (optional) | Deep link opening one message's detail | Same guard |

No new client routes beyond the existing `/backoffice`.

### 4.3 Endpoints and external interfaces

- No custom HTTP endpoint and no server.
- Supabase PostgREST via `@supabase/supabase-js`, always as the admin session:
  - `from('messages').select('id,name,email,message,status,created_at').order('created_at', { ascending: false }).range(offset, offset + 24)` — list page.
  - `from('messages').update({ status }).eq('id', id)` — status change.
  - `from('messages').delete().eq('id', id)` — delete.
  - `from('messages').select('*', { count: 'exact', head: true }).eq('status', 'unread')` — unread count (optional).
- Supabase RLS (F-06) restricts every one of these to the `admin@codeboxx.com` JWT.

## 5. Data, Validations, and Expected Behavior

### 5.1 Data model

Reads the `messages` row shape: `id uuid`, `name text`, `email text`, `message text`, `created_at timestamptz`, plus the new `status text` (`'unread' | 'read' | 'archived'`, default `'unread'`). Client UI state: a `messages` array, `selectedId`, `loadState` (`'loading' | 'ready' | 'error'`), a `pending` set of ids currently being written, and an `error` string. Nothing is cached beyond the session; the database is the source of truth.

### 5.2 Validation rules

- No query runs before `useAuth().status === 'authed'`.
- `status` writes accept only `'unread' | 'read' | 'archived'`.
- Delete always requires a confirmation interaction; a single click never deletes.
- Every list query passes an explicit `range` / `limit`; page size is 25.
- `id` values used in `.eq('id', …)` come only from fetched rows, never free text.
- The email is rendered as `mailto:` only; the address is not otherwise trusted or executed.
- Every data-module result is checked for `{ ok: false }`; there is no unguarded `await`.
- A 401 / permission error maps to `reason: 'unauthorized'` and triggers the re-login path.

### 5.3 Expected behavior

- On mount with a valid session: a loading state, then the newest 25 messages and the unread count.
- "Load more" appends the next 25 and disappears when a short page returns.
- Opening a message shows it in full and sets `status = 'read'` optimistically, reverting on failure.
- Toggling status or archiving persists and survives a refresh.
- Delete removes the row only after the server confirms; a failure keeps the row and shows an error.
- Empty result → "No messages yet."; fetch failure → an error plus a working "Try again".
- Session lost → the guard redirects to `/login`; an in-flight write that 401s shows the re-login message.
- Supabase not configured → a notice, no crash, no query.
- A direct `curl` of `messages` with only the anon key (no admin JWT) still returns nothing / 401; the UI adds nothing an attacker could use.
- `npm run lint` and `npm run build` pass.

## 6. Acceptance Criteria

### AC-BACKOFFICE-01: Guard

**Given** no session **When** `/backoffice` is opened **Then** it redirects to `/login` and no message data is requested.

### AC-BACKOFFICE-02: List loads newest first

**Given** a signed-in admin and existing messages **When** the page loads **Then** a bounded list (at most 25) renders ordered by `created_at` descending, each row showing name, email, preview, date, and read state.

### AC-BACKOFFICE-03: A new submission appears

**Given** the public contact form is submitted **When** the admin reloads the back office **Then** the new message is at the top, marked unread, and the unread count is higher.

### AC-BACKOFFICE-04: Read a message in a modal

**Given** the table **When** the admin clicks a row or its "View" button **Then** a modal opens showing the full name, email as a `mailto:` link, full date and time, and the complete message text; and the modal closes on the "×" button, the "Close" button, the Escape key, and a click on the backdrop outside it. *(Marking the message `read` and decrementing an unread count is deferred with the `status` column.)*

### AC-BACKOFFICE-05: Status persists

**Given** a message marked read or archived **When** the admin refreshes **Then** the same status is shown.

### AC-BACKOFFICE-06: Delete needs confirmation

**Given** a message **When** the admin activates delete **Then** a confirmation appears; cancelling keeps the row; confirming removes it only after the server confirms, and a refresh does not bring it back.

### AC-BACKOFFICE-07: Empty and error states

**Given** zero messages **Then** "No messages yet." is shown. **Given** a failing fetch **Then** an error and a working "Try again" are shown, and retrying succeeds once the backend recovers.

### AC-BACKOFFICE-08: Log out

**Given** a signed-in admin **When** they activate the visible "Log out" button **Then** `supabase.auth.signOut()` runs, the session is cleared from storage, the app lands on `/login`, and revisiting `/backoffice` redirects to `/login`.

### AC-BACKOFFICE-09: Expired session

**Given** the session expires or is revoked **When** the admin acts **Then** the app routes to `/login` (via the guard or the 401 handler) without exposing message data.

### AC-BACKOFFICE-10: Authorization is server-side

**Given** the built bundle and a network capture **When** reviewed **Then** all message access uses the anon client plus the admin session, RLS is the enforcement, and no `service_role` key or secret is present.

### AC-BACKOFFICE-11: Accessibility and responsive

**Given** keyboard / assistive-technology use at 390px and desktop **Then** there is one `h1`, the list has row semantics, the detail manages focus and is dismissible, controls have clear names, and there is no horizontal overflow.

### AC-BACKOFFICE-12: Global specification compliance

**Given** review against [../ai-spec.md](../ai-spec.md) **Then** there is no custom backend, the admin area is absent from public navigation, no secret is committed, loading / empty / error / unauthorized / refresh paths are explicit, and nothing contradicts the global specification.

## 7. Verification Checklist

From `vite-project/`:

```bash
npm run lint
npm run build
```

Then, with a configured Supabase project and the `status` migration applied:

- Sign in → `/backoffice` shows the list newest first (or "No messages yet.").
- Submit the public contact form → reload → the message is on top, unread; the unread count rose.
- Open it → full text, `mailto:` email, timestamp; it flips to read; the count dropped.
- Mark it unread / archive it → reload → the state persists.
- Delete → confirm → gone; reload → still gone; Cancel on another → still present.
- Drop the network briefly → the list shows the error and "Try again"; restore → retry works.
- Sign out → `/login`; revisit `/backoffice` → redirected to `/login`.
- `curl "$URL/rest/v1/messages?select=*" -H "apikey: $ANON" -H "Authorization: Bearer $ANON"` → `[]` or 401 (no admin JWT).
- `grep -ri "service_role" vite-project/src dist` → nothing.
- At 390px width the list and detail fit with no horizontal scroll.

## 8. Dependencies and Handoffs

- **Depends on** Admin Login (F-07) for `RequireAuth`, `src/lib/auth.ts` (`signOut`, the session context), the `/backoffice` route, and the GitHub Pages `404.html` fallback; and on the Contact Form (F-06) plus the database setup for the `messages` table and its RLS policies.
- **Additive migration owned here** (add to `supabase/schema.sql` and apply as a CLI migration or in the SQL Editor):

  ```sql
  alter table public.messages
    add column if not exists status text not null default 'unread'
    check (status in ('unread', 'read', 'archived'));

  -- keep anonymous inserts from setting status: grant only the three form columns
  revoke insert on table public.messages from anon;
  grant insert (name, email, message) on table public.messages to anon;
  ```

  The existing admin `select` / `update` / `delete` policies and grants already cover the new column.
- **Provides** nothing downstream; this is the last planned feature that touches `messages`.
- The README and `docs/` must document the back office: how it is reached (through F-07), what it can do, and that the `status` migration must be applied before this feature is deployed.
