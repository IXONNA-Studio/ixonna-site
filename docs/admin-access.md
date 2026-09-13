# Admin access

The admin area is intentionally not linked anywhere in the public site (no
header, footer, mobile bottom nav, or call to action).

## Reaching the login page

Either:

1. Type the URL directly: `/login` (for example `https://<pages-domain>/login`).
2. **Secret shortcut:** on any page, with no text field focused, type the word
   **`admin`** (five letters, within ~1.5 seconds). The app navigates to
   `/login`. The shortcut only navigates — it never signs anyone in and never
   bypasses the route guard.

The sequence is defined in `vite-project/src/components/AdminShortcut.tsx`
(`SEQUENCE`). Change it there if needed; keep it out of any user-facing text.

## Routes

| Route | Purpose | Access |
| --- | --- | --- |
| `/login` | Admin sign-in form | URL or secret shortcut only |
| `/backoffice` | Protected admin area (placeholder until F-08) | Valid Supabase session; otherwise redirects to `/login` |

## The admin account

Create the `admin@codeboxx.com` user in the **Supabase dashboard**
(Authentication → Users → Add user), with a password set there. The app never
signs users up. The password must never be committed to the repository.

Actual protection of contact data is enforced by Supabase row-level security
(see `supabase/schema.sql`), not by the client-side route guard.
