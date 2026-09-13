# Feature Specification: Setup and Deploy

**Feature ID:** F-01  
**Status:** Planned  
**Governing specification:** [../ai-spec.md](../ai-spec.md)

This feature must be implemented and reviewed under the rules in the Global AI Specification. The global specification is authoritative for architecture, technology, security, coding standards, accessibility, Definition of Done, and cross-feature behavior. This document adds only the Setup and Deploy-specific details.

## 1. Feature Goal and Scope

### 1.1 Goal

Establish the blank Vite project as a reproducible React + TypeScript portfolio application and publish it automatically to GitHub Pages through GitHub Actions. A new contributor must be able to install dependencies, run the site locally, configure Supabase through documented environment variables, create a production build, and understand how a push to `main` reaches the public site.

### 1.2 Scope in

- Initialize and maintain the React + TypeScript Vite application under `vite-project/`.
- Define the npm scripts needed for development, linting, building, and previewing.
- Configure the Vite base path so assets and client-side navigation work on the configured GitHub Pages URL.
- Add a committed `.env.example` containing variable names and safe placeholder values only.
- Add an appropriate `.gitignore` that excludes local environment files, dependencies, build output, and editor artifacts.
- Create a GitHub Actions workflow under `.github/workflows/` that builds and deploys the static `dist/` output to GitHub Pages when `main` changes.
- Pass the required `VITE_*` values to the production build through GitHub Actions repository or environment secrets.
- Document local setup, Supabase variable configuration, build, preview, deployment, and troubleshooting in the repository README.
- Verify the deployed site loads correctly from a fresh browser session on desktop and mobile viewport sizes.

### 1.3 Scope out

- Portfolio content, visual branding, project case studies, and personal profile copy; these belong to the portfolio/content feature.
- Contact form fields, Supabase tables, RLS policies, submission behavior, and admin data management; these belong to the contact and admin features.
- Creating or storing Supabase credentials through the application UI.
- Any custom backend, server-side rendering, API route, serverless function, or non-static hosting runtime.
- Manual deployment as the normal release process.
- Changing the required branch model: `feature/*` from `dev`, merge to `dev`, then merge `dev` to `main`.
- Committing the platform submission summary.

## 2. Requirements Breakdown

### REQ-SETUP-001: Vite application baseline

The repository must contain a runnable Vite application in `vite-project/` using React and TypeScript. The project must use the existing npm module configuration and remain compatible with the scripts documented in the README.

### REQ-SETUP-002: Local developer workflow

From `vite-project/`, a developer must be able to:

1. Install dependencies with `npm install`.
2. Start local development with `npm run dev`.
3. Check code quality with `npm run lint`.
4. Produce a production build with `npm run build`.
5. Serve the compiled output with `npm run preview`.

The README must state prerequisites and the expected purpose of each command.

### REQ-SETUP-003: Environment configuration

The application must read only the public frontend Supabase configuration from Vite variables:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

The exact key name may follow the installed Supabase client convention, but it must use the `VITE_` prefix consistently in source, `.env.example`, README, and CI configuration. `.env.example` must not contain working credentials. Local `.env` and `.env.*.local` files must be ignored by Git.

The public key is not a secret substitute for authorization. Supabase RLS remains responsible for protecting privileged data, as required by the global specification.

### REQ-SETUP-004: GitHub Pages path handling

The Vite configuration must define a predictable base path for the repository's GitHub Pages deployment. The chosen value must match the repository configuration and must not break local development. All static assets and internal navigation must resolve under the deployed base path after a fresh page load.

If the repository is configured as a user or organization site at `https://username.github.io`, the base path is `/`. If it is configured as a project site, the base path is `/<repository-name>/`. The final choice must be documented rather than inferred differently by local code and CI.

### REQ-SETUP-005: Automated deployment

The repository must contain a GitHub Actions workflow that:

- Runs on pushes to `main` and supports an explicit manual dispatch.
- Uses the repository's supported Node.js version and a lockfile-aware npm install.
- Runs the lint and production build checks before publishing.
- Makes required `VITE_*` values available only to the build step through GitHub Actions secrets or environment variables.
- Uploads the generated `vite-project/dist/` directory as a Pages artifact.
- Deploys through the official GitHub Pages deployment mechanism.
- Requests only the permissions required for Pages deployment and reports build failures clearly.

The workflow must not print environment values or embed a service-role key.

### REQ-SETUP-006: Documentation and repository hygiene

The repository README must explain the project purpose, folder layout, prerequisites, local setup, environment variables, available commands, Supabase setup handoff, Git branching flow, and GitHub Pages deployment. The repository must not track `node_modules/`, `dist/`, local environment files, or editor state.

### REQ-SETUP-007: Static hosting compatibility

The production output must be static and deployable without a server process. Any route or navigation approach introduced by this feature must remain compatible with direct GitHub Pages hosting and the global rule that the admin route is accessed by direct URL only.

## 3. User Flow

### 3.1 Local setup flow

1. A contributor clones the repository and checks out the required development branch.
2. The contributor reads the root README and enters `vite-project/`.
3. The contributor runs `npm install`.
4. The contributor copies `.env.example` to a local ignored environment file and supplies the Supabase project URL and public key.
5. The contributor runs `npm run dev` and opens the displayed local URL.
6. The contributor verifies the public portfolio shell renders without missing assets or configuration errors.
7. The contributor runs `npm run lint` and `npm run build` before opening a pull request.

### 3.2 Release flow

1. Work is developed on `feature/*` from `dev`.
2. The feature branch is merged into `dev` after review and validation.
3. `dev` is merged into `main`.
4. A push to `main` starts the deployment workflow.
5. The workflow installs dependencies, runs lint, builds with CI-provided `VITE_*` values, uploads `dist/`, and deploys to GitHub Pages.
6. A reviewer opens the deployed URL in a fresh session and verifies the page, assets, links, and responsive layout.

### 3.3 Failure and recovery flow

- If dependency installation fails, the workflow stops before deployment and reports the failing command.
- If lint or build fails, no artifact is deployed; the contributor fixes the branch and repeats validation.
- If required CI variables are absent, the build fails with a non-sensitive configuration message and no secret value is printed.
- If the deployed page has missing assets, the contributor checks the Vite base path and repository Pages configuration before changing application components.
- If a direct route returns a GitHub Pages 404, the implementation must follow the routing strategy documented by the app and remain consistent with the global static-hosting constraint.

## 4. Interfaces Involved

### 4.1 Pages and routes

| Interface | Responsibility | Access |
| --- | --- | --- |
| Public portfolio route | Loads the static portfolio application and its public sections | Public |
| Direct admin route | Reserved for the authentication/admin feature; setup must not add it to navigation | Direct URL only |
| GitHub Pages URL | Hosts the built static output | Public |

This feature owns hosting and route compatibility, not the content or behavior of the pages themselves.

### 4.2 Files and components

| File or area | Responsibility |
| --- | --- |
| `vite-project/package.json` | Dependencies and developer/build scripts |
| `vite-project/vite.config.ts` | Vite plugins and deployment base path |
| `vite-project/src/main.tsx` | React application entry point |
| `vite-project/src/App.tsx` | Application shell and route composition handoff |
| `vite-project/src/index.css` | Global styles and shared design tokens handoff |
| `vite-project/.env.example` | Safe list of required variable names |
| `.gitignore` | Repository hygiene and secret/build exclusions |
| `.github/workflows/deploy.yml` | CI validation and GitHub Pages deployment |
| `README.md` and `vite-project/README.md` | Setup and operational documentation |

No HTTP endpoints are created by this feature. Supabase endpoints are consumed by later features through the shared client and are not proxied by this application.

### 4.3 CI/CD interface

The workflow depends on:

- GitHub repository Actions being enabled.
- GitHub Pages being configured to use GitHub Actions as the source.
- A compatible Node.js runtime.
- Repository or environment secrets for the public `VITE_*` build variables.
- Pages deployment permissions granted to the workflow.

## 5. Data, Configuration, and Validations

### 5.1 Configuration data

| Name | Source | Required | Exposure |
| --- | --- | --- | --- |
| `VITE_SUPABASE_URL` | Local ignored env file or GitHub Actions secret | Yes for Supabase-enabled builds | Browser-visible public configuration |
| `VITE_SUPABASE_ANON_KEY` | Local ignored env file or GitHub Actions secret | Yes for Supabase-enabled builds | Browser-visible public configuration |
| Vite base path | Versioned Vite configuration | Yes | Public build behavior |
| Node.js version | Workflow and project documentation | Yes | CI configuration |

No password, Supabase service-role key, or private credential is configuration data for the browser build.

### 5.2 Validation rules

- Required variables must be present and non-empty when the application initializes its Supabase client.
- Configuration errors must identify the missing variable name without displaying its value.
- The base path must begin and end according to Vite's documented path behavior and must match the Pages URL configuration.
- The workflow must fail before deployment if lint or build fails.
- The lockfile, when present, must be honored by CI; dependency drift must not be silently introduced by deployment.
- Build output must be generated in `vite-project/dist/` and must not be committed.
- CI logs must not contain environment values, authentication tokens, or full Supabase URLs when those are treated as sensitive operational configuration.

### 5.3 Expected behavior

- A clean checkout can be installed and built using the documented commands.
- Development works without requiring production-only GitHub configuration.
- Production builds use CI-provided configuration and contain no `.env` file.
- The deployed site loads its CSS, JavaScript, images, and fonts from the correct Pages base path.
- A deployment failure leaves the previously successful Pages deployment available rather than publishing a partial build.
- Changes to the deployment configuration are reviewed like application code and do not bypass the required branch flow.

## 6. Acceptance Criteria

### AC-SETUP-01: Clean local installation

**Given** a clean checkout with a supported Node.js and npm version  
**When** the contributor runs `npm install` from `vite-project/`  
**Then** dependencies install successfully without requiring a committed environment file.

### AC-SETUP-02: Development server

**Given** the documented local environment variables are configured  
**When** the contributor runs `npm run dev`  
**Then** the application opens at the local Vite URL, renders the public portfolio shell, and has no missing static assets in the browser console.

### AC-SETUP-03: Quality scripts

**Given** the implementation is checked out locally  
**When** the contributor runs `npm run lint` and `npm run build` from `vite-project/`  
**Then** both commands exit successfully and the build creates `vite-project/dist/`.

### AC-SETUP-04: Environment safety

**Given** local configuration has been created from `.env.example`  
**When** the contributor checks tracked files and the production build inputs  
**Then** no `.env` value, password, service-role key, or private credential is tracked or embedded in source documentation.

### AC-SETUP-05: Base path and asset loading

**Given** the application is built using the configured GitHub Pages base path  
**When** a reviewer opens the deployed URL in a fresh browser session  
**Then** JavaScript, CSS, images, fonts, public navigation, and direct refresh behavior work from the actual Pages URL.

### AC-SETUP-06: Automated deployment success

**Given** a validated change has reached `main` and GitHub Pages is configured for Actions  
**When** the deployment workflow runs  
**Then** it installs dependencies, runs lint, builds with the required CI variables, uploads the correct `dist/` artifact, and publishes the site successfully.

### AC-SETUP-07: Automated deployment failure safety

**Given** lint, build, or required configuration is intentionally invalid  
**When** the workflow runs  
**Then** the workflow fails before deployment, reports an actionable non-sensitive error, and does not publish a partial artifact.

### AC-SETUP-08: Documentation and hygiene

**Given** a developer unfamiliar with the repository reads the README  
**When** they follow the setup and deployment instructions  
**Then** they can identify the project structure, commands, environment variable names, branch flow, Pages configuration, and Supabase handoffs without needing undocumented steps.

### AC-SETUP-09: Global-spec compliance

**Given** this feature is reviewed against `ai/ai-spec.md`  
**When** the reviewer checks architecture, security, accessibility, static hosting, and branch rules  
**Then** the feature introduces no custom backend, keeps the admin route out of public navigation, uses RLS-compatible public configuration, and satisfies the global Definition of Done.

## 7. Verification Checklist

Run from `vite-project/`:

```bash
npm install
npm run lint
npm run build
npm run preview
```

Additionally verify:

- `.env.example` contains names only and local env files are ignored.
- `git status --ignored` shows local env files, `node_modules/`, and `dist/` excluded as intended.
- The workflow file is valid YAML and targets `main` plus manual dispatch.
- GitHub Actions receives the required `VITE_*` values without logging them.
- A successful workflow publishes the expected GitHub Pages URL.
- The deployed site is checked at desktop and mobile widths in a fresh browser session.
- No public navigation item points to the admin route.

## 8. Dependencies and Handoffs

- The global AI specification must remain authoritative and is a prerequisite for implementation.
- The portfolio/content feature consumes the initialized app shell and shared styles.
- The Supabase contact feature consumes the documented environment variables and shared client boundary.
- The admin authentication/back-office feature consumes the direct-route and static-hosting constraints.
- The README must be updated whenever this feature changes setup, configuration, or deployment behavior.
