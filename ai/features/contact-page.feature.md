# Feature Specification: Contact Form

**Feature ID:** F-06  
**Status:** Implemented baseline  
**Governing specification:** [../ai-spec.md](../ai-spec.md)

This feature must be implemented and reviewed under the Global AI Specification. The global specification is authoritative for architecture, accessibility, responsive behavior, static hosting, security, coding conventions, and the Definition of Done. This document adds only the detail specific to the public contact form and consumes the layout shell defined by the Home Page (F-03) and Shared Header and Footer (F-02) features, and the Supabase configuration defined by Setup and Deploy (F-01).

## 1. Feature Goal and Scope

### 1.1 Goal

Let a visitor send E'Onna Nixon a message from the portfolio without leaving the page. The form must collect a name, an email address, and a message; validate all three before it will submit; give the visitor clear feedback for validation errors, success, and failure; persist a valid submission to Supabase; and stay usable and honest when Supabase is not configured.

### 1.2 Scope in

- The public `#contact` section and the form it contains: a name text input, an email input, and a message textarea, each with a visible label.
- Client-side validation of all three fields before submission, including email-format checking.
- Visible, assistive-technology-announced feedback for validation errors, submission success, and submission failure, with success and failure styled as visually distinct (positive/green with a check, negative/red with an X).
- A submit control whose state reflects whether the form can be submitted (submitting in progress, or storage unavailable) and a submit handler that refuses to send invalid input.
- Persisting a valid submission with a single `INSERT` into the Supabase `messages` table, through the `createContactMessage` helper, using the shared client from `src/lib/supabaseClient`.
- Clearing the fields and auto-dismissing the success message after a successful submission.
- A stable, non-crashing fallback state when Supabase environment variables are absent.
- Trimming field values before validation and before persistence.
- Responsive and accessible layout of the form controls.

### 1.3 Scope out

- The Supabase `messages` table schema, row-level security policies, and project configuration, which belong to Setup and Deploy (F-01) and the database setup.
- Admin authentication and any interface for reading, replying to, or managing submitted messages.
- Server-side email notification on new submissions; if present it is a Supabase-side trigger or function, not part of this component.
- Spam protection such as CAPTCHA, honeypots, or rate limiting.
- File attachments, rich text, or multi-step forms.
- The footer email link and résumé download, which belong to Links and Résumé Download (F-05).

## 2. Requirements Breakdown

### REQ-CONTACT-001: Required fields and labels

The form must contain a text input for the sender's name, an input for the sender's email, and a textarea for the message. Each control must have a visible, programmatically associated `<label>` (a placeholder alone is not sufficient). Each control must have a stable `id` and a `name` matching its form-state key. Because all three fields are required, each label must carry a visual required marker (a decorative `*` hidden from assistive technology, which already learns "required" from the control's `required` attribute), and the form must show a short "All fields are required." hint.

### REQ-CONTACT-002: Email input type

The email control must use `type="email"` so mobile keyboards and assistive technology treat it as an email field, in addition to the JavaScript format check.

### REQ-CONTACT-003: Pre-submission validation

On submit, the handler must validate before any network call and must not send when any check fails, in this order:

- Completeness: if any of name, email, or message is empty or only whitespace, report "Please fill in all fields." and stop.
- Name: at least 2 non-space characters.
- Email: must match a basic email shape (`something@something.tld`, no spaces).
- Message: at least 10 non-space characters.

Only the first failing check is reported per attempt. The native browser validation bubble is intentionally disabled (`noValidate`) so the feature owns the messages; the `required` attributes remain on the controls as semantic hints.

### REQ-CONTACT-004: Validation error feedback

When a check fails, the form must display a human-readable message describing what to fix, and must keep the visitor's entered values. The message must be rendered in an assertive live region (`role="alert"`) so assistive technology announces it immediately. The failing control must be marked `aria-invalid="true"`, must reference the message via `aria-describedby`, must receive a visible invalid style, and keyboard focus must move to it. Success feedback is separate: it uses a polite region (`role="status"`) and no `alert`.

### REQ-CONTACT-005: Submission is blocked while invalid

The form must not reach the persistence helper while any field is invalid; the submit handler returns early. In addition, the submit button must be disabled while a submission is in flight, while Supabase is not configured, and while any of the three fields is still empty or whitespace-only.

### REQ-CONTACT-006: Successful submission feedback

On a successful write, the form must clear all three fields and show a success message in the polite (`role="status"`) region. The success message must be visually distinct as positive — green colouring plus a check icon (the icon decorative and hidden from assistive technology). It must clear itself after a few seconds and also on the next field edit.

### REQ-CONTACT-007: Failure feedback

If the persistence helper reports failure, the form must show a recoverable error message in the `role="alert"` region and must not clear the fields. The message must be visually distinct as negative — red colouring plus an X icon — and must distinguish "storage not configured" (direct the visitor to the email link) from a general send failure (invite a retry).

### REQ-CONTACT-008: Storage-unavailable fallback

When `isSupabaseConfigured` is false, the section must still render, must show a notice that the form is unavailable in this environment, and must disable the submit button. No runtime error may occur.

### REQ-CONTACT-009: Data hygiene

Name, email, and message must be trimmed before validation and before being passed to `createContactMessage`. No other fields are sent from the client; timestamps and identifiers are the database's responsibility.

### REQ-CONTACT-010: Accessibility and responsiveness

The section must expose an accessible name (`aria-labelledby` to its `<h2>`), controls must be keyboard operable with a visible focus indicator, error feedback must use `role="alert"` and success feedback `role="status"`, focus must move to the first invalid control on a failed submit, and the form must remain within the viewport width with usable control sizes on mobile.

### REQ-CONTACT-011: Supabase persistence

On a valid submission, the `createContactMessage` helper must perform exactly one `INSERT` against the Supabase `messages` table via the shared client imported from `src/lib/supabaseClient` (`supabase.from('messages').insert(payload)`). The payload must contain exactly the trimmed `name`, `email`, and `message` strings; `id` and `created_at` are assigned by the database. The presence of an `error` on the insert result yields the `failed` outcome; its absence yields success. No other table is read or written.

## 3. User Flow

### 3.1 Successful submission

1. A visitor scrolls or navigates to the `#contact` section.
2. The visitor fills in name, email, and message.
3. The visitor activates "Send message".
4. Validation passes; the button shows "Sending..." and is disabled.
5. The helper writes the row to Supabase and reports success.
6. The fields clear and a success message appears in the status region.

### 3.2 Validation failure

1. The visitor enters a too-short name or a malformed email and activates "Send message" (the button is disabled outright while any field is still empty).
2. The handler stops before any network call.
3. An alert message naming the problem appears, the offending control is marked invalid and styled as such, and keyboard focus moves to it; entered values are preserved.
4. The visitor corrects the field; editing clears the message and the invalid state, and they submit again.

### 3.3 Storage unavailable

1. The site is served without Supabase environment variables.
2. The `#contact` section renders with a notice that the form is unavailable in this environment.
3. The submit button is disabled.
4. The visitor uses the footer email link instead (F-05).

### 3.4 Keyboard and assistive-technology path

1. The visitor tabs into the form.
2. Each control receives visible focus in order and announces its label.
3. On submit, the status region announces the validation error, success, or failure text.
4. The visitor completes the flow without a pointer.

## 4. Interfaces Involved

### 4.1 Components and files

| File or area | Responsibility |
| --- | --- |
| `vite-project/src/components/ContactForm.tsx` | Renders the `#contact` section, holds form state, validates, submits, and renders status feedback |
| `vite-project/src/lib/contactMessages.ts` | `createContactMessage(input)` — inserts a row into the `messages` table and returns a typed result |
| `vite-project/src/lib/supabaseClient.ts` | Creates the Supabase client from `VITE_` env vars and exposes `isSupabaseConfigured` |
| `vite-project/src/App.tsx` | Places `<ContactForm />` as the last section before the footer |
| `vite-project/src/App.css` | `.contact-section` and `.contact-section form` control layout, focus styles, and responsive stacking |

### 4.2 Pages and section interfaces

| Target | Interface | Purpose |
| --- | --- | --- |
| `/` | Root single page | Hosts the contact section |
| `#contact` | Contact section | Anchor target for header nav and the footer "Start a conversation" link; contains the form |
| `#contact-name`, `#contact-email`, `#contact-message` | Form controls | Labelled inputs bound to form state; refs used to move focus on a failed submit |
| `#contact-feedback` | Error region | `role="alert"` element that invalid controls reference via `aria-describedby` |

### 4.3 Endpoints and external interfaces

- This feature owns no custom HTTP endpoint and runs no server.
- Supabase (PostgREST via `@supabase/supabase-js`): `supabase.from('messages').insert({ name, email, message })`. Anonymous insert is permitted by the table's row-level security policy, which is owned by the database setup, not this feature.
- No read, update, or delete of contact data is performed by this feature.

## 5. Data, Validations, and Expected Behavior

### 5.1 Content and data model

Client form state is a single object `{ name: string; email: string; message: string }`, initialised empty. The submission payload sent to Supabase is the same three trimmed strings. Auxiliary UI state: nullable `error` and `success` strings, a nullable `invalidField` (`'name' | 'email' | 'message'`), and an `isSubmitting` boolean. There is no persisted client state and nothing is read back.

### 5.2 Validation rules

- Completeness: if `name`, `email`, or `message` is empty after trim, set "Please fill in all fields." on the first empty field and return.
- `name.trim().length >= 2` — otherwise "Please enter your name (at least 2 characters)."
- `email` matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` — otherwise "Please enter a valid email address."
- `message.trim().length >= 10` — otherwise "Your message must be at least 10 characters."
- Checks run completeness, name, email, message; the first failure sets `error` and `invalidField`, moves focus to that control, and returns.
- The form element carries `noValidate`; validation is entirely the handler's responsibility.
- The submit button is disabled when `isSubmitting` is true, `isSupabaseConfigured` is false, or any field is empty/whitespace-only.
- Values are trimmed before validation comparisons and before persistence.

### 5.3 Expected behavior

- While any field is empty, the submit button is disabled, so an incomplete form cannot be submitted by pointer or by Enter.
- Submitting a filled-in form that fails a check (short name, malformed email, short message) shows the matching message in the `role="alert"` region, marks that control `aria-invalid` with an invalid style, moves focus to it, and performs no network request.
- Submitting with all three fields valid triggers exactly one `INSERT` into the Supabase `messages` table; the button reads "Sending..." and is disabled during the attempt.
- A successful insert clears the fields and shows "Thanks. Your message has been sent." in the `role="status"` region, styled green with a check icon; the message clears itself after roughly five seconds and immediately on the next field edit.
- A failed insert keeps the fields and shows "Your message could not be sent. Please try again later." in the `role="alert"` region, styled red with an X icon.
- Editing any field clears the current error, success, and invalid state.
- The page renders and the section is usable with no horizontal overflow at a 390px width.
- `npm run lint` and `npm run build` complete without errors.

## 6. Acceptance Criteria

### AC-CONTACT-01: Fields and labels present

**Given** a visitor opens the `#contact` section  
**When** the form renders  
**Then** a name text input, an `type="email"` email input, and a message textarea are shown, each with a visible label associated by `htmlFor`/`id`, each label shows a required marker, and an "All fields are required." hint is visible.

### AC-CONTACT-02: Empty fields are rejected

**Given** one or more of name, email, or message is empty or whitespace only  
**When** the visitor activates "Send message"  
**Then** no network request is made, a message describing the problem appears, and the entered values remain.

### AC-CONTACT-03: Email format is validated

**Given** the email field contains a value without a valid `local@domain.tld` shape  
**When** the visitor submits  
**Then** the form shows "Please enter a valid email address." and does not submit.

### AC-CONTACT-04: Validation errors are announced and tied to the field

**Given** a validation failure on a filled-in form  
**When** the message is shown  
**Then** it appears in a `role="alert"` element, the failing control is `aria-invalid="true"` and references the message via `aria-describedby`, the control shows an invalid style, and keyboard focus moves to it.

### AC-CONTACT-05: Incomplete or busy form cannot submit

**Given** any field is empty, or a submission is in progress, or Supabase is not configured  
**When** the visitor looks at the submit button and tries to submit  
**Then** the button is disabled in each of those states, and for any invalid input that does reach the handler the persistence helper is not called.

### AC-CONTACT-06: Successful submission

**Given** all three fields are valid and Supabase is configured  
**When** the insert succeeds  
**Then** all three fields clear, a success message shows in green with a check icon, and it disappears on its own after a few seconds or on the next field edit.

### AC-CONTACT-07: Failed submission

**Given** all three fields are valid  
**When** the insert fails  
**Then** an error message shows in red with an X icon, the fields are preserved, and the visitor can retry.

### AC-CONTACT-13: Supabase persistence

**Given** a valid submission with Supabase configured  
**When** the handler runs  
**Then** exactly one `INSERT` is made to the `messages` table via the shared `src/lib/supabaseClient` client, and the row contains the trimmed `name`, `email`, and `message`.

### AC-CONTACT-08: Storage-unavailable fallback

**Given** the site is served without Supabase environment variables  
**When** the `#contact` section renders  
**Then** a notice is shown, the submit button is disabled, and no runtime error occurs.

### AC-CONTACT-09: Data hygiene

**Given** a valid submission with surrounding whitespace in fields  
**When** it is sent  
**Then** the payload contains only trimmed `name`, `email`, and `message`.

### AC-CONTACT-10: Combined "fill in all fields" check

**Given** the handler runs with at least one field empty after trim (for example via keyboard before the button enables, or a future programmatic submit)  
**When** validation runs  
**Then** the first empty field is flagged and the message is exactly "Please fill in all fields." and nothing is sent.

### AC-CONTACT-11: Editing clears feedback

**Given** an error or success message is showing  
**When** the visitor edits any field  
**Then** the message and any `aria-invalid` state are cleared.

### AC-CONTACT-12: Global specification compliance

**Given** the feature is reviewed against [../ai-spec.md](../ai-spec.md)  
**When** static hosting, security, accessibility, and documentation rules are checked  
**Then** the feature adds no custom backend, exposes no admin capability, commits no secret, relies on Supabase row-level security for protection, and contradicts nothing in the global specification.

## 7. Verification Checklist

From `vite-project/`:

```bash
npm run lint
npm run build
```

Then verify in a browser:

- The `#contact` section shows a labelled name input, a labelled `type="email"` email input, and a labelled message textarea, each label with a `*` marker, plus an "All fields are required." hint.
- With any field empty, "Send message" is visibly disabled and cannot be triggered by click or by Enter.
- With all fields filled but the name one character long, submitting shows the name error in an alert, outlines the name field in red, and moves focus to it; no network request is made (check the Network panel).
- Entering `not-an-email` and submitting shows the email-format error on the email field.
- Editing a field after an error clears the message and the red invalid outline.
- A valid submission with Supabase configured clears all three fields and shows the success message in green with a check icon; exactly one row appears in the `messages` table (Supabase Table Editor) with the trimmed name, email, and message.
- The success message disappears on its own after ~5 seconds, and also immediately if a field is edited before then.
- Simulating an insert failure keeps the field values and shows the retry error in red with an X icon.
- Running without `VITE_SUPABASE_*` variables renders the section with its notice and a disabled submit button, and does not crash the page.
- Keyboard-tab through the controls: focus is visible, labels and the `*` requirement are conveyed, and the error is announced immediately on a failed submit.
- At a 390px width the form fits with no horizontal overflow.
