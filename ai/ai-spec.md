# AI Project Specification: Personal Portfolio

## 1. Project Identity

### 1.1 Purpose

This project is a professional portfolio for a Full-Stack Development Program graduate. It is the developer's own public professional presence, not a fictional client application. The site must present a credible, accessible, and responsive view of the developer's skills, experience, selected projects, technical interview preparation, and contact information.

### 1.2 Primary audience

- Recruiters and hiring managers evaluating the developer's skills.
- Technical interviewers reviewing projects and problem-solving ability.
- Coaches and graders verifying the Module 16 requirements.

### 1.3 Product goals

- Showcase a clear professional identity, skills, experience, and portfolio projects.
- Provide a usable contact form whose submissions persist in Supabase.
- Provide a private admin route for authenticated viewing and management of contact submissions.
- Deploy the static React application automatically to GitHub Pages.
- Demonstrate interview readiness through documented LeetCode solutions and explanations.
- Keep the repository understandable to a new developer through accurate documentation and AI-native specifications.

### 1.4 Scope in

- A public, client-side portfolio website built with React and Vite.
- Responsive navigation and portfolio sections for identity, about/experience, skills, projects, interview preparation, and contact.
- Contact form validation, submission feedback, and Supabase persistence.
- Direct-access admin login and authenticated admin back office for contact submissions.
- Supabase Auth for admin authentication and Supabase database tables/RLS for contact data.
- GitHub Pages deployment through GitHub Actions.
- Environment-variable configuration using Vite's `VITE_` convention.
- README, this project-wide specification, eight feature specifications, CONCEPTS.md, LeetCode solution artifacts, and required demonstration materials.
- Accessible interactions, keyboard navigation, responsive layouts, and useful loading, empty, success, and error states.

### 1.5 Scope out

- A custom backend server, API server, serverless function, or separate application server.
- Server-side rendering, dynamic server components, or a non-static hosting runtime.
- Public registration, password reset workflows, user roles beyond the single admin use case, or social login unless explicitly specified by a feature document.
- A CMS, payment system, blog publishing system, analytics platform, or chat system.
- Real-time messaging or notifications.
- Storing secrets, service-role keys, or administrator passwords in source code, committed files, or browser-visible content.
- Adding a login link to the public navigation.
- Treating the submission summary as a repository deliverable; it is submitted separately through the platform.

## 2. Architecture and Repository Structure

### 2.1 Runtime architecture

The application is a static single-page React application compiled by Vite and served from GitHub Pages. The browser communicates directly with Supabase using the public project URL and publishable/anonymous key exposed through Vite environment variables. Supabase provides authentication and persistence; it is the only backend infrastructure.

```text
Browser
	|-- React UI and client-side routing
	|-- Supabase Auth (admin session)
	`-- Supabase database (contact submissions, protected by RLS)

GitHub Actions
	|-- install dependencies
	|-- inject VITE_* secrets
	|-- build the Vite app
	`-- publish dist/ to GitHub Pages
```

### 2.2 Repository layout

```text
/
├── ai/
│   ├── ai-spec.md
│   └── features/
│       ├── *.feature.md
│       └── eight feature specifications
├── docs/
│   └── supporting technical/interview documentation
├── vite-project/
│   ├── public/                 # Static files copied without bundling
│   ├── src/
│   │   ├── assets/             # Imported images and visual assets
│   │   ├── components/         # Reusable presentational/UI components
│   │   ├── lib/                # Supabase client and small infrastructure helpers
│   │   ├── pages/               # Route-level page components
│   │   ├── App.tsx              # Application shell and route composition
│   │   ├── App.css              # App/component styling
│   │   ├── index.css            # Global styles and design tokens
│   │   └── main.tsx              # React entry point
│   ├── .env.example             # Variable names only; no values or secrets
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
├── CONCEPTS.md
├── LeetCode-Challenges/
└── README.md
```

The exact component and page split may evolve, but new code must remain inside the owning layer. Shared UI belongs in `components`, route composition belongs in `pages` or the app shell, and Supabase access belongs in `lib` or a focused data module rather than being duplicated throughout JSX.

### 2.3 Data and security model

- Contact submissions contain only the fields required by the contact feature and timestamps generated by the persistence layer where possible.
- The browser may use only the public Supabase client key intended for frontend use.
- Row Level Security must be enabled for contact data. Anonymous users may create valid submissions; only the authenticated admin may read, update, or delete them as specified by the feature.
- UI authentication is not a substitute for database authorization. Every privileged table operation must also be enforced by Supabase policies.
- Auth state must be handled explicitly on refresh, logout, loading, and expired-session paths.

## 3. Allowed Technology and Constraints

### 3.1 Required technology

- React with TypeScript.
- Vite for development and production builds.
- Supabase for authentication and contact-form persistence.
- GitHub Pages for static hosting.
- GitHub Actions for automated deployment.
- npm for dependency management and scripts.

### 3.2 Allowed supporting technology

Use browser APIs, React libraries, and small focused npm packages when they solve a real requirement and are documented in `vite-project/package.json`. Prefer existing project conventions and platform capabilities before adding a dependency. CSS may be plain CSS or the repository's chosen styling approach; styles must remain maintainable and responsive.

### 3.3 Hard constraints

- The site is client-side only and must produce a static build.
- No custom backend server may be introduced.
- Vite-exposed variables must use the `VITE_` prefix.
- `.env` files containing values must never be committed. GitHub Actions secrets must provide production values at build time.
- The admin route must not appear in public navigation and must be reachable by direct URL only.
- The fixed course admin account is `admin@codeboxx.com`; its password must be supplied only through the authentication setup or secure local/host configuration and must never be hardcoded in the application.
- Feature branches use `feature/*`, are created from `dev`, merge back into `dev`, and then `dev` merges into `main`. Deployment is triggered by pushes to `main`.
- Only `main` is evaluated for grading.
- The submission summary is not committed to GitHub.

## 4. Coding Standards and Conventions

### 4.1 General

- Use strict TypeScript and define explicit types for shared data, component props, Supabase rows, and form state.
- Prefer small, focused components and pure transformations over large components with mixed responsibilities.
- Use descriptive names; avoid one-letter variables except in conventional callbacks or tightly scoped iteration.
- Keep public content and labels professional, specific, and truthful. Do not leave starter copy, placeholder links, or unexplained lorem ipsum in the production build.
- Keep changes focused and avoid unrelated refactors.

### 4.2 React

- Use functional components and hooks.
- Keep side effects in `useEffect` or dedicated data/auth helpers; do not perform network calls during render.
- Use stable `key` values based on domain identity, never array indexes for reorderable or persistent data.
- Render explicit loading, error, empty, and success states for asynchronous workflows.
- Keep route protection client-side and declarative, while relying on Supabase RLS for actual authorization.
- Use semantic HTML before adding ARIA. Every meaningful image needs useful alternative text; decorative images must be hidden from assistive technology.

### 4.3 TypeScript and data access

- Centralize the Supabase client configuration.
- Do not duplicate environment-variable reads or raw table names throughout UI components.
- Validate user-controlled form data at the client boundary before submission and handle server/database errors without exposing implementation details.
- Never use `any` to bypass a type problem; model the data or narrow the unknown value.
- Keep secrets and privileged credentials out of logs, error messages, screenshots, and committed documentation.

### 4.4 Styling and UX

- Use a consistent design system with named color, spacing, typography, and focus-state tokens.
- Design mobile-first and verify the layout at narrow and wide viewport sizes.
- Preserve visible keyboard focus, adequate color contrast, readable text, and usable touch targets.
- Use buttons for actions and links for navigation. Every icon-only control needs an accessible name and a tooltip when its meaning is not obvious.
- Avoid layout shifts during loading and ensure text does not overlap, clip, or overflow its container.
- Keep motion purposeful and respect `prefers-reduced-motion`.

### 4.5 Git and documentation

- Keep commits and pull requests scoped to one feature or maintenance purpose.
- Update the relevant feature specification when behavior or acceptance criteria change.
- Keep README setup, environment variables, database configuration, and deployment instructions synchronized with the implementation.
- Do not commit build output, local secrets, editor state, or the platform submission summary.

## 5. Global Definition of Done

A feature or change is done only when all applicable criteria are true:

- Its behavior and acceptance criteria are documented in the owning feature specification.
- The implementation is complete, typed, linted, and integrated with the existing app shell.
- The normal path, loading state, empty state, validation failure, backend failure, and unauthorized path are handled where applicable.
- The UI is responsive, accessible by keyboard, semantically structured, and visually consistent with the portfolio.
- Supabase operations use the intended client configuration and are protected by matching RLS policies for privileged data.
- No secret, credential, `.env` value, or service-role key is present in tracked files or browser logs.
- The relevant tests or manual verification steps have been run and recorded when the feature specification requires them.
- `npm run lint` and `npm run build` pass from `vite-project/`.
- README and related documentation remain accurate.
- The feature is merged through the required branch flow before it is considered part of the evaluated `main` branch.

## 6. Cross-Feature Rules

- All features must preserve the public portfolio identity; do not introduce fictional client branding or unrelated navigation concepts.
- Navigation links must target real sections/routes and must work after a page refresh on GitHub Pages.
- The admin login and back office must remain absent from public navigation, sitemap-like public content, and public calls to action.
- Contact form behavior must remain safe for anonymous visitors, while all admin data access requires both a valid Supabase session and database authorization.
- Shared states, notifications, buttons, forms, typography, and focus styles should use common components or tokens rather than feature-specific copies.
- Feature documents must identify affected routes/components, data changes, validation rules, expected behavior, and acceptance checks.
- Changes to shared contracts, environment variables, database schema, deployment workflow, or routing require updating every affected feature document and the README.
- Every external link must use a valid destination, an appropriate accessible label, and safe new-tab behavior when a new tab is necessary.
- Portfolio content must be maintainable without changing application logic wherever practical; repeated project or skill content should use typed data structures.
- Error messages must help the user recover and must not reveal database schema, credentials, stack traces, or internal secrets.
- All eight feature specifications must trace back to this document, and implementation work must not contradict these global constraints without an explicit updated decision recorded in the relevant specification.

## 7. Required Verification

Before release, verify the following from `vite-project/`:

```bash
npm install
npm run lint
npm run build
```

Also verify manually in a production-like preview that:

- Public navigation and every portfolio section render correctly on desktop and mobile.
- A valid anonymous contact submission is persisted and receives clear feedback.
- Invalid and failed submissions are handled without losing user-entered data unnecessarily.
- Direct navigation to the admin URL works, while the URL is absent from public navigation.
- An unauthenticated visitor cannot access protected contact data.
- The admin can sign in, view the intended submissions, sign out, and loses access after logout.
- The GitHub Actions build receives the required `VITE_*` values without committing an `.env` file.
- The deployed GitHub Pages URL loads assets and routes correctly from a fresh browser session.
