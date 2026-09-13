# E'Onna Nixon — Developer Portfolio

A personal portfolio website with a working contact form and a private admin area
for managing the messages it receives.

**Live site:** https://fs2505nixone.github.io/Nixone.github.io/
**Repository:** https://github.com/FS2505NixonE/Nixone.github.io

Built as the Module 16 capstone project at Codeboxx.

---

## Project description

This project is the public professional website of E'Onna Nixon, a full-stack
web developer. Visitors can read about her background, technical and soft skills,
work experience, education, and selected projects, download her résumé, and send
her a message through a contact form. The site supports a light and a dark theme
and reads in either English or French — both preferences are remembered in the
visitor's browser via `localStorage` and default to the visitor's OS/browser
settings on first visit.

Behind a hidden, password-protected route there is an **admin area**. When E'Onna
signs in, she can see every message that has been submitted through the site and
delete the ones she has handled. Regular visitors can never see those messages.

**Who it's for:** recruiters, hiring managers, and anyone who wants to evaluate
E'Onna's work — plus E'Onna herself, who uses the admin area to keep track of
incoming messages.

**What problem it solves:** it gives her one credible, always-online professional
presence, and a way to collect and manage contact messages in her own database
instead of relying on a third-party form service or email alone.

---

## Tech stack

| Area | Technology |
| --- | --- |
| Language | TypeScript |
| Frontend framework | React 19 |
| Build tool / dev server | Vite 8 |
| Routing | React Router 7 (`BrowserRouter`) |
| Styling | Plain CSS (no framework), with CSS custom properties driving a light/dark theme |
| Localization | Custom React context + JSON dictionaries (English/French), persisted in `localStorage` |
| Backend & database | Supabase — hosted PostgreSQL + auto-generated REST API (PostgREST). There is **no custom server**. |
| Authentication | Supabase Auth (email + password, one admin account) |
| Security | PostgreSQL Row Level Security (RLS) |
| Hosting | GitHub Pages (static) |
| CI / CD | GitHub Actions (lint → build → deploy on push to `main`) |
| Linting | ESLint 10 with `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` |
| Database tooling | Supabase CLI |
| Browser checks | Playwright (used for manual smoke tests during development; there is no automated test suite yet) |

---

## Project structure

```
Nixone.github.io/
├── README.md                     ← you are here
├── Research.md                    ← notes on the AI-generated images (tool + prompts)
├── .github/workflows/deploy.yml   ← GitHub Actions: build + deploy to GitHub Pages
├── ai/
│   ├── ai-spec.md                ← project-wide specification
│   └── features/*.feature.md     ← one specification per feature (F-01 … F-08)
├── docs/
│   ├── supabase-setup.md         ← full Supabase setup walkthrough
│   └── admin-access.md           ← how to reach the hidden admin routes
├── supabase/
│   ├── schema.sql                ← creates the `messages` table + RLS policies
│   └── config.toml               ← Supabase CLI project config
└── vite-project/                 ← the application
    ├── index.html
    ├── vite.config.ts            ← Vite config + GitHub Pages 404.html fallback
    ├── .env.example              ← template for the required environment variables
    ├── public/
    │   ├── EOnna-Nixon-Resume.pdf
    │   └── images/               ← portrait, project screenshots, link thumbnails
    └── src/
        ├── main.tsx              ← React entry point
        ├── App.tsx               ← router shell (routes + auth provider + shortcut)
        ├── App.css / index.css   ← styles
        ├── pages/
        │   ├── Home.tsx          ← the public single-page portfolio
        │   ├── AdminLogin.tsx    ← /login  (hidden)
        │   └── Backoffice.tsx    ← /backoffice  (protected message manager)
        ├── components/
        │   ├── ContactForm.tsx
        │   ├── RequireAuth.tsx   ← route guard
        │   ├── AdminShortcut.tsx ← global keyboard shortcut to the login page
        │   └── layout/           ← Header, Footer, MainLayout
        ├── context/
        │   ├── AuthProvider.tsx  ← loads + tracks the Supabase session
        │   └── auth-context.ts   ← useAuth() hook
        └── lib/
            ├── supabaseClient.ts ← creates the Supabase client from env vars
            ├── contactMessages.ts← create / list / delete message helpers
            └── auth.ts           ← signIn / signOut / getSession / onAuthChange
```

---

## Installation / setup

### Prerequisites

- **Node.js 22+** and npm
- A free **Supabase** project (https://supabase.com)

### 1. Clone the repository

```bash
git clone https://github.com/FS2505NixonE/Nixone.github.io.git
cd Nixone.github.io/vite-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the two values from your Supabase project
(**Project Settings → API**). See [Environment variables](#environment-variables)
below for details.

### 4. Set up the database

In the Supabase dashboard:

1. Open **SQL Editor** and run the contents of [`supabase/schema.sql`](supabase/schema.sql).
   This creates the `messages` table and its Row Level Security policies.
2. Open **Authentication → Sign In / Providers** and make sure **Email** is enabled.
3. Open **Authentication → Users → Add user** and create the admin account
   (`admin@codeboxx.com`) with a password. The app never creates this account.

Full walkthrough: [`docs/supabase-setup.md`](docs/supabase-setup.md).

### 5. Run the app

```bash
npm run dev
```

Open the URL it prints (default **http://localhost:5173**).

If your `.env` is empty the site still runs — the contact form and admin login
show a "not configured" message instead of crashing.

### Available scripts (run from `vite-project/`)

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Type-check and produce the production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint over the project |

### Using the admin area locally

The admin routes are not linked anywhere on the site. Reach the login page by
going to **`/login`** directly, or by typing the word **`admin`** anywhere on the
page (with no text field focused). Sign in with the account you created in step 4;
you land on **`/backoffice`**. See [`docs/admin-access.md`](docs/admin-access.md).

---

## Environment variables

Both are read by Vite at build time and must use the `VITE_` prefix.
Locally they live in `vite-project/.env` (git-ignored). For deployment they are
set as **GitHub Actions repository secrets** (Settings → Secrets and variables →
Actions).

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Yes | Your Supabase project's base URL, e.g. `https://abcdefgh.supabase.co`. Copy it from **Project Settings → API → Project URL**. Do **not** include a path such as `/rest/v1/`. |
| `VITE_SUPABASE_ANON_KEY` | Yes | The **publishable / anon** API key from **Project Settings → API**. It is safe to expose in the browser; Row Level Security is what protects the data. **Never** use the `service_role` (secret) key here. |

`vite-project/.env.example` is the committed template and contains no real values.

---

## API documentation

This project has **no custom backend or HTTP API**. The browser talks directly to
Supabase using the anon key, and **RLS** decides what each caller is allowed to do.

### Client-side data helpers (`vite-project/src/lib/`)

| Function | File | Supabase operation |
| --- | --- | --- |
| `createContactMessage({ name, email, message })` | `contactMessages.ts` | `INSERT` into `messages` (any visitor) |
| `listMessages()` | `contactMessages.ts` | `SELECT` from `messages`, newest first (admin session only) |
| `deleteMessage(id)` | `contactMessages.ts` | `DELETE` from `messages` by id (admin session only) |
| `signIn(email, password)` | `auth.ts` | `supabase.auth.signInWithPassword()` |
| `signOut()` | `auth.ts` | `supabase.auth.signOut()` |
| `getSession()` / `onAuthChange(cb)` | `auth.ts` | `supabase.auth.getSession()` / `onAuthStateChange()` |

### Supabase endpoints used (auto-generated)

| Endpoint | Who can call it |
| --- | --- |
| `POST /rest/v1/messages` | Anyone (anonymous) — insert only |
| `GET /rest/v1/messages` | Admin session only (RLS) |
| `DELETE /rest/v1/messages?id=eq.<uuid>` | Admin session only (RLS) |
| `POST /auth/v1/token?grant_type=password` | Anyone — sign in |
| `POST /auth/v1/logout` | Signed-in user — sign out |

### Row Level Security (defined in `supabase/schema.sql`)

- Anonymous and authenticated users **can insert** a message.
- Only the authenticated user whose email is `admin@codeboxx.com` **can read,
  update, or delete** messages.
- RLS is enforced by PostgreSQL, so hiding the admin link in the UI is a
  convenience, not the security boundary.

### Client routes (React Router)

| Route | Page | Access |
| --- | --- | --- |
| `/` | Portfolio (single page with `#home`, `#about`, `#skills`, `#strengths`, `#experience`, `#education`, `#projects`, `#links`, `#contact`) | Public |
| `/login` | Admin sign-in | Direct URL or the `admin` keyboard shortcut only |
| `/backoffice` | Message manager | Requires a valid Supabase session (`RequireAuth`), otherwise redirects to `/login` |

---

## Deployment

Pushing to the **`main`** branch triggers
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which lints,
builds, and publishes `vite-project/dist/` to **GitHub Pages**. A `404.html`
copy of `index.html` is emitted so client-side routes (like `/login`) work on a
direct load or refresh.

Branch flow: `feature/*` → `dev` → `main`.

> The `base` value in `vite-project/vite.config.ts` must match the path the site
> is served from on GitHub Pages. Update it if the Pages URL changes.

---

## Author

**E'Onna Nixon** — Full-Stack Web Developer (Codeboxx, 2025–2026)

- GitHub: https://github.com/FS2505NixonE
- LinkedIn: https://www.linkedin.com/in/eonna-nixon-266323170
- Email: eonnait25@gmail.com
