# Feature Specification: Links and Résumé Download

**Feature ID:** F-05  
**Status:** Implemented baseline  
**Governing specification:** [../ai-spec.md](../ai-spec.md)

This feature must be implemented and reviewed under the Global AI Specification. The global specification is authoritative for architecture, accessibility, responsive behavior, static hosting, security, coding conventions, and the Definition of Done. This document adds only the detail specific to outbound links and the downloadable résumé, and it consumes the layout shell defined by the Home Page (F-03) and Shared Header and Footer (F-02) features.

## 1. Feature Goal and Scope

### 1.1 Goal

Give a visitor reliable ways to take the relationship off the page: download E'Onna Nixon's résumé as a file, reach her by email, and view her professional profiles. The page presents these as a set of link cards, and also surfaces the résumé and contact jump in the hero and footer. Every such link must be correct, safe to open, clearly labeled, keyboard accessible, and work from a fresh load of the static site with no server.

### 1.2 Scope in

- A downloadable résumé/CV control that either downloads the PDF or opens it so the visitor can save it.
- The résumé PDF as a static asset in `vite-project/public/`, referenced by a root-absolute path that resolves under the configured GitHub Pages base.
- A dedicated Links section (`#links`) that presents each professional link as a card containing a thumbnail image, a title, a one-to-three-sentence description, and a URL that opens in a new tab.
- At least three link cards; the current set is GitHub, LinkedIn, Résumé (PDF), and Email.
- AI-generated thumbnails for the link cards, documented in `Research.md`, served from `vite-project/public/images/`.
- The professional links also surfaced outside the Links section: an email `mailto:` link and the source-code profile in the footer, an in-page jump to the contact section, and the résumé control in the hero actions.
- Consistent link destinations, labels, `target`, and `rel` behavior wherever a link appears (Links section, hero actions, footer).
- Accessibility of the link cards, the plain links, and the download control: descriptive names, visible focus, correct download semantics.
- Absence of placeholder, dead, or unsafe link destinations.

### 1.3 Scope out

- The contact form fields, validation, and Supabase submission, which belong to the Contact feature.
- Footer structure, branding, and layout, which belong to the Shared Header and Footer feature; this feature governs only the link set and its behavior.
- Authoring or editing the résumé content itself; this feature covers the download mechanism and file placement, not the document's copy.
- Click analytics, tracking pixels, URL shorteners, social share widgets, embedded feeds, or third-party badge scripts.
- A router-based `/links` or `/resume` route; the application stays a single root page with hash targets.
- Any server, serverless function, or redirect service to deliver the file.

## 2. Requirements Breakdown

### REQ-LINKS-001: Downloadable résumé control

The page must present a clearly labeled résumé control (for example "Download résumé") in a primary, above-the-fold location within the hero actions. Activating it must download the PDF or open it in a new browsing context where the viewer's PDF tools can save it. The control must be an anchor with `href` pointing at the résumé file, the `download` attribute, `target="_blank"`, and `rel="noopener"`.

### REQ-LINKS-002: Résumé asset placement and path

The résumé file must live in `vite-project/public/` and be referenced by a root-absolute path (`/EOnna-Nixon-Resume.pdf`). The path must resolve in local development and on the deployed GitHub Pages URL, consistent with the Vite `base` value. The committed file must be a valid PDF of the real résumé before release; a placeholder file may exist during development but must not ship as the released résumé.

### REQ-LINKS-003: Professional links set

The site must expose, at minimum: an email link using the `mailto:` scheme, a link to a public source-code profile that opens in a new tab, and an in-page link to the `#contact` section. Each link must have descriptive, self-explanatory text; generic text such as "click here" is not allowed. A professional profile link (LinkedIn) is included using its canonical URL with tracking query parameters removed.

### REQ-LINKS-004: External link safety

Every link that targets another origin must use `target="_blank"` together with a `rel` value that includes `noopener`; `noreferrer` should be added where referrer suppression is preferred. No new-tab link may omit `rel`.

### REQ-LINKS-005: No placeholder or dead destinations

No link may point at a placeholder domain or address (for example `example.com`, `nixon@example.com`), an empty `#`, or a `javascript:` stub. Every external URL must resolve to a real, correct destination. The email address used must match the address on the résumé.

### REQ-LINKS-006: Consistency across surfaces

Wherever the résumé or a professional identity appears more than once (hero actions, footer, and any future dedicated section), the same file, the same URLs, and consistent labels must be used. Updating a destination must update every occurrence.

### REQ-LINKS-007: Accessibility and focus

All links and the download control must be reachable and operable by keyboard, must show a visible focus indicator, and must expose a meaningful accessible name. The download control must communicate that it downloads or opens a file rather than navigating within the site.

### REQ-LINKS-008: In-page target integrity

The `#contact` target referenced by the footer link must exist exactly once in the rendered DOM, and activating the link must move the view to the contact section with its heading clear of the sticky header.

### REQ-LINKS-009: Static-hosting compatibility

The résumé download and all links must work from a fresh load of the deployed static site with no server process. The PDF must be served as a plain static file and must appear in the production build output.

### REQ-LINKS-010: Links section and card structure

The page must contain a Links section with the `#links` anchor, a heading, and one card per professional link. Each card must be a structured item (visually a bordered card consistent with the Projects cards) and must contain all four of:

- a thumbnail image with meaningful `alt` text;
- a title or name;
- a short description of one to three sentences;
- a clickable URL that opens in a new browsing context (`target="_blank"`) with `rel="noopener noreferrer"`.

The entire card is the clickable link. At least three cards must be present. The section must reuse the shared section spacing and divider so it is visually separated from the sections around it, and its grid must collapse to a single column on narrow screens without horizontal overflow.

### REQ-LINKS-011: Link card thumbnails

Each link card thumbnail is AI-generated and documented in `Research.md` (tool, prompt, `alt` text, file path). Thumbnails are served from `vite-project/public/images/` by root-absolute path, are shown inside a fixed-ratio panel with `object-fit: contain` so any export size fits without stretching, and must appear in the production build output. Placeholder thumbnails may exist during development but the released set must be the real images.

## 3. User Flow

### 3.1 Download the résumé

1. A visitor opens the root portfolio URL.
2. In the hero, next to the primary work call to action, the visitor sees a "Download résumé" control.
3. The visitor activates it.
4. The browser downloads the PDF, or opens it in a new tab where the visitor uses the built-in viewer to save it.
5. The portfolio tab remains open and unchanged.

### 3.2 Reach out through a professional link

1. The visitor scrolls to the footer.
2. The visitor chooses Email, the source-code profile, or "Start a conversation".
3. Email opens the visitor's mail client addressed to the correct address.
4. The source-code profile opens in a new tab, with no script access back to the portfolio window.
5. "Start a conversation" scrolls to the contact form on the same page.

### 3.3 Browse the Links section

1. The visitor scrolls to the Links section between Projects and Contact.
2. Each professional link is shown as a card with a thumbnail, a title, and a one-to-three-sentence description.
3. The visitor activates a card.
4. The destination opens in a new tab; the portfolio tab stays open and unchanged.

### 3.4 Keyboard and assistive-technology path

1. The visitor tabs through the hero actions, the Links section cards, and the footer links.
2. Each link, card, and the download control receives visible focus in a logical order.
3. Each control announces a meaningful name; the download control indicates it is a file download.
4. The visitor activates a control with Enter and gets the same result as a pointer click.

## 4. Interfaces Involved

### 4.1 Components and files

| File or area | Responsibility |
| --- | --- |
| `vite-project/src/App.tsx` | Holds the `links` data array and renders the hero `.hero-actions` block and the `#links` section that maps the array to cards |
| `vite-project/src/App.css` | `.hero-actions`, `.hero-cta`, `.hero-cta--ghost` for the download control; `.link-card` plus the reused `.project-card` family for the link cards |
| `vite-project/src/components/layout/Footer.tsx` | Renders the professional links: email, source-code profile, and the `#contact` jump |
| `vite-project/public/EOnna-Nixon-Resume.pdf` | The downloadable résumé asset |
| `vite-project/public/images/link-*.png` | AI-generated link card thumbnails (`link-github`, `link-linkedin`, `link-resume`, `link-email`) |
| `Research.md` | Documents the AI tool, prompts, and file paths for the link thumbnails |
| `vite-project/vite.config.ts` | The `base` value that the `/EOnna-Nixon-Resume.pdf` and `/images/*` paths resolve against |

### 4.2 Pages and section interfaces

| Target | Interface | Purpose |
| --- | --- | --- |
| `/` | Root single page | Hosts the hero actions, the Links section, and the footer |
| `#home` | Hero section | Location of the primary résumé download control |
| `#links` | Links section | Card grid of professional links, between Projects and Contact |
| `#contact` | Contact section | In-page target for the footer "Start a conversation" link |
| Site footer | Footer links region | Location of the plain professional links set |

### 4.3 Endpoints and external interfaces

- This feature owns no HTTP endpoints.
- `GET /EOnna-Nixon-Resume.pdf` — a static file served by the Vite dev server and by GitHub Pages from the build output.
- `GET /images/link-*.png` — static thumbnail files served the same way.
- `mailto:eonnait25@gmail.com` — hands off to the visitor's mail client; no network request from the app.
- `https://github.com/FS2505NixonE` — external source-code profile, opened in a new tab.
- `https://www.linkedin.com/in/eonna-nixon-266323170` — external professional profile, opened in a new tab.

## 5. Data, Validations, and Expected Behavior

### 5.1 Content data

A small, static, version-controlled set. The `links` array in `src/App.tsx` holds one object per card with `title`, `url`, `image`, `alt`, and `description` (one to three sentences). Separately: the résumé file path, the email address, the source-code and LinkedIn profile URLs, and the in-page contact anchor. There is no dynamic or user-provided data in this feature.

### 5.2 Validation rules

- The résumé link `href` resolves to a file that exists in `vite-project/public/` and is a valid PDF.
- The résumé control carries the `download` attribute, `target="_blank"`, and `rel="noopener"`.
- The Links section renders at least three cards, and every card has a thumbnail `img` with non-empty `alt`, a title, a description of one to three sentences, and is itself an anchor.
- Every anchor that targets another origin — including each link card — has `target="_blank"` and a `rel` value that includes `noopener` (`noreferrer` on the cards).
- The email link uses the `mailto:` scheme and the address matches the address on the résumé.
- LinkedIn and GitHub URLs are canonical, with no `utm_*` or other tracking query parameters.
- No link resolves to a placeholder domain or address, an empty `#`, or a script pseudo-URL.
- The `#contact` and `#links` anchors each exist exactly once in the DOM.
- Link and card text is descriptive and understandable out of context; no "click here".
- The résumé path and every thumbnail path are root-absolute and consistent with the configured Vite `base`.
- The production build emits the résumé file and every `link-*.png` thumbnail into `dist/`.

### 5.3 Expected behavior

- Activating the résumé control downloads the PDF, or opens it in a new tab where it can be saved; the current tab is preserved.
- If the résumé file is absent, the link returns a 404 without breaking the page; the rest of the site continues to work. Validation treats a missing or placeholder released file as a release blocker.
- Activating a link card opens its destination in a new tab; the portfolio tab is preserved. A missing thumbnail leaves the card usable and shows its `alt` text.
- The email link opens the default mail client addressed to the correct address.
- The source-code profile link opens the correct profile in a new tab, and the opened page has no script access to the portfolio window.
- "Start a conversation" moves the view to the contact form with its heading not hidden by the sticky header.
- All behavior works from a fresh load of the deployed static site with no server process.
- `npm run lint` and `npm run build` complete without errors.

## 6. Acceptance Criteria

### AC-LINKS-01: Résumé control present and labeled

**Given** a visitor opens the root URL  
**When** the hero renders  
**Then** a clearly labeled résumé download control is visible in the hero actions without scrolling on a typical desktop viewport.

### AC-LINKS-02: Résumé download behavior

**Given** the résumé control is visible  
**When** the visitor activates it  
**Then** the browser downloads the PDF or opens it in a new tab where it can be saved, and the portfolio tab is not navigated away.

### AC-LINKS-03: Résumé asset ships and resolves

**Given** the application is built  
**When** a reviewer inspects `dist/` and opens the deployed site  
**Then** `EOnna-Nixon-Resume.pdf` is present in the build output and the résumé link resolves from the deployed GitHub Pages URL.

### AC-LINKS-04: Professional links present

**Given** the visitor views the footer  
**When** the links region renders  
**Then** an email link, a public source-code profile link, and an in-page link to `#contact` are all present with descriptive text.

### AC-LINKS-05: External link safety

**Given** any link that points to another origin  
**When** its markup is inspected  
**Then** it has `target="_blank"` and a `rel` value that includes `noopener`.

### AC-LINKS-06: No placeholder or dead links

**Given** every link and download on the page  
**When** the destinations are checked  
**Then** none points at a placeholder domain or address, an empty `#`, or a script pseudo-URL, and the email address matches the résumé.

### AC-LINKS-07: In-page contact target valid

**Given** the footer "Start a conversation" link  
**When** the visitor activates it  
**Then** the view moves to the single `#contact` section and its heading is not hidden under the sticky header.

### AC-LINKS-08: Accessibility and focus

**Given** the visitor uses a keyboard or assistive technology  
**When** they move through the hero actions and footer links  
**Then** each control receives visible focus in a logical order, exposes a meaningful accessible name, and the download control indicates it downloads or opens a file.

### AC-LINKS-09: Static-hosting compatibility

**Given** the deployed static site with no server process  
**When** a visitor loads it fresh and uses the résumé download and every link  
**Then** all of them work, and the résumé is delivered as a plain static file.

### AC-LINKS-10: Link cards are complete and structured

**Given** the visitor scrolls to the `#links` section  
**When** the card grid renders  
**Then** at least three cards are shown, each as a bordered card containing a thumbnail image with `alt` text, a title, and a one-to-three-sentence description.

### AC-LINKS-11: Link cards open in a new tab safely

**Given** any card in the `#links` section  
**When** the visitor activates it  
**Then** its URL opens in a new browser tab, the portfolio tab is not navigated away, and the card's markup includes `target="_blank"` and `rel="noopener noreferrer"`.

### AC-LINKS-12: Link thumbnails ship and are documented

**Given** the application is built and `Research.md` is reviewed  
**When** `dist/images/` and the document are checked  
**Then** every `link-*.png` thumbnail is present in the build output and each is listed in `Research.md` with its tool, prompt, and `alt` text.

### AC-LINKS-13: Global specification compliance

**Given** the feature is reviewed against [../ai-spec.md](../ai-spec.md)  
**When** static hosting, security, accessibility, and documentation rules are checked  
**Then** the feature adds no backend, no public admin link, no committed secret, and no behavior that contradicts the global specification.

## 7. Verification Checklist

From `vite-project/`:

```bash
npm run lint
npm run build
```

Then verify:

- `dist/EOnna-Nixon-Resume.pdf` exists and opens as a valid PDF, and `dist/images/` contains every `link-*.png` thumbnail.
- "Download résumé" in the hero, on desktop and at a 390px width, downloads the file or opens it in a new tab; the portfolio tab stays open.
- The `#links` section renders at least three cards; each shows a thumbnail, a title, and a one-to-three-sentence description, and the whole card is a link.
- Activating each link card opens its destination in a new tab and leaves the portfolio tab open.
- The footer Email link opens the mail client addressed to the same address shown on the résumé.
- The footer source-code profile link opens the correct profile in a new tab and its markup includes `rel` with `noopener`.
- The footer "Start a conversation" link scrolls to `#contact` with the heading clear of the sticky header.
- A search of the source for `example.com`, `href="#"`, `utm_`, and `target="_blank"` without `rel` returns nothing.
- At a 390px width the Links grid is a single column with no horizontal overflow.
- Keyboard-tab through the hero actions, the link cards, and the footer links: focus is visible, order is logical, names are meaningful.
- `Research.md` lists every link thumbnail with its tool, prompt, and `alt` text.
- Load the deployed GitHub Pages URL in a fresh session and repeat the résumé and link checks.
