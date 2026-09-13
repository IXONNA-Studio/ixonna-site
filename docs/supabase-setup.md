# Supabase Setup

This project is a static React app hosted on GitHub Pages. GitHub Pages cannot run a backend, so the browser connects directly to Supabase through the official JavaScript client. The public anon key identifies the project; Row Level Security (RLS) is what protects the data.

## 1. Create the Supabase project

1. Open the Supabase dashboard and create a new project.
2. Choose a project name and a strong database password.
3. Wait for the project to finish provisioning.
4. Open **Project Settings > API** and copy the **Project URL** and **anon/publishable key**.

Never copy the secret/service-role key into this application. It bypasses RLS and must stay server-side; this project intentionally has no custom server.

## 2. Create the table and RLS policies

1. Open **SQL Editor** in the Supabase dashboard.
2. Run [`supabase/schema.sql`](../supabase/schema.sql).
3. In **Table Editor**, confirm that `public.messages` exists and that RLS is enabled.

The table stores `name`, `email`, `message`, and `created_at`. Database checks enforce the basic length limits even if a client bypasses the React form.

The policies have these effects:

- Anonymous and authenticated visitors can insert a message.
- Anonymous visitors cannot read, update, or delete messages.
- Only a signed-in user whose email is `admin@codeboxx.com` can read, update, or delete messages.

RLS is enforced in PostgreSQL. Hiding an admin button in React is not security by itself.

## 3. Enable email/password authentication

1. Open **Authentication > Providers**.
2. Enable the **Email** provider.
3. Keep email/password sign-in enabled.
4. For this course workflow, create the admin account manually in **Authentication > Users > Add user > Create new user**.
5. Use the required course credentials supplied through the private course setup process. Do not place the password in source code, SQL files, screenshots, or GitHub Actions variables.

The frontend should sign in with the account, but it must never create that account or contain its password.

The sign-in page is at `/login` and is not linked anywhere in the public site. See [`admin-access.md`](admin-access.md) for how to reach it (direct URL or the secret keyboard shortcut) and the `/backoffice` route it protects.

## 4. Configure local development

From `vite-project/`:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and add values from **Project Settings > API**:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

Restart `npm run dev` after changing environment variables. Vite only exposes variables prefixed with `VITE_` to browser code. `.env` is ignored by Git; `.env.example` is the committed template and contains no credentials.

When these variables are missing, the client exports `supabase = null`. The application can use `isSupabaseConfigured` to show a setup message or disable database-dependent actions instead of crashing during local UI work.

## 5. Configure GitHub Actions deployment

In the GitHub repository, open **Settings > Secrets and variables > Actions** and create repository secrets:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The workflow at [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) passes both secrets to the build job through `env:`. Vite embeds the public project configuration into the static bundle during the build. This is expected for the anon key; RLS must remain enabled because the key is browser-visible.

Do not add the database password, admin password, service-role key, or any other private secret to these frontend build variables.

## 6. Verify the connection

1. Run `npm run lint` and `npm run build` from `vite-project/`.
2. Start the app with `npm run dev`.
3. Submit a valid contact message after the contact feature is connected to `createContactMessage`.
4. Confirm the row appears in Supabase only when signed into the admin dashboard.
5. Confirm a signed-out or anonymous client cannot select rows.
6. Push through the required `feature/*` -> `dev` -> `main` branch flow and confirm the Pages build receives the two `VITE_*` secrets.

Do not test security by exposing or copying the admin password into logs or documentation.
