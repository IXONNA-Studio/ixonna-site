# Feature Specification: Shared Header and Footer Layout

**Feature ID:** F-02  
**Status:** Planned  
**Governing specification:** [../ai-spec.md](../ai-spec.md)

This feature must be implemented under the Global AI Specification. The global specification remains authoritative for accessibility, responsive behavior, static hosting, security, coding conventions, and the Definition of Done.

## 1. Feature Goal and Scope

### 1.1 Goal

Create a reusable page shell for the portfolio so every public view has the same professional header, navigation, main-content region, and footer. The header must remain available while the user scrolls, and the navigation must move visitors to every currently available main portfolio section without introducing route paths that are not supported by the static GitHub Pages deployment.

### 1.2 Scope in

- A `MainLayout` component that wraps page content between a shared header and footer.
- A `Header` or `Navbar` component rendered at the top of the layout.
- A `Footer` component rendered at the bottom of the layout.
- A sticky header with consistent branding, background, spacing, focus, and active/hover states.
- Navigation links for the public portfolio sections: Home, About, Projects, and Contact.
- A logo image in the header that links to Home and has meaningful alternative text.
- Anchor-based navigation compatible with the current single-page Vite application and root GitHub Pages URL.
- Responsive navigation with horizontal text links above 768px and icon navigation fixed at the bottom at 768px and below.
- Semantic landmarks and accessible labels for the header, navigation, main content, and footer.
- A footer with identity/context and external professional links using safe link behavior.

### 1.3 Scope out

- Creating separate route pages or adding a routing library.
- The visual/content implementation of the About, Projects, or Contact sections beyond the anchors required for navigation.
- Admin login or back-office navigation; the global specification requires the admin route to remain absent from public navigation.
- Supabase data access, authentication, contact persistence, or database policies.
- Portfolio branding decisions that belong to the broader portfolio/content feature.

## 2. Requirements Breakdown

### REQ-HF-001: Shared layout ownership

`MainLayout` must accept page content as children and render it in this order:

1. `Header`/`Navbar`.
2. A semantic `<main>` region containing the page content.
3. `Footer`.

The application root must use `MainLayout`; page content must not duplicate header or footer markup.

### REQ-HF-002: Header visibility and positioning

The header must be visible at the top of the viewport and use `position: sticky` or `position: fixed` so it remains visible while scrolling. It must have a stable background, border/shadow treatment, and a stacking order that keeps navigation readable above page content. The layout must reserve enough top space when fixed positioning is used so content is not hidden underneath it.

### REQ-HF-003: Public navigation

The header must contain links to all current public main sections:

- `#home`
- `#about`
- `#projects`
- `#contact`

Links must use real targets, have visible labels, preserve keyboard focus, and not point to the private admin route. Anchor navigation must keep the browser at the root site URL with a hash section identifier rather than creating `/home`, `/portfolio`, or other unsupported paths.

### REQ-HF-003A: Logo identity

The header must display a scalable logo image. The image must have meaningful alternative text, and its clickable link must target `#home`. The logo must remain inside the header bounds at every supported viewport width.

### REQ-HF-004: Footer presence

The footer must render after the main content on every layout-wrapped view. It must include the portfolio identity or copyright context and at least one meaningful professional link when a valid destination is available. External links opened in a new tab must use `rel="noreferrer"` and an accessible label.

### REQ-HF-005: Responsive and accessible structure

The layout must work on desktop and mobile widths. It must use semantic landmarks (`header`, `nav`, `main`, `footer`), a single meaningful page heading per view where applicable, visible `:focus-visible` states, sufficient contrast, and touch-friendly link spacing. Navigation text must not overlap or overflow its container.

### REQ-HF-006: Cross-feature consistency

Header, navigation, and footer styles must use shared design tokens and remain independent of Supabase configuration. The contact feature must be reachable at `#contact`, while the admin authentication feature must not add a public navigation item.

## 3. User Flow

### 3.1 Visitor navigation flow

1. A visitor opens the root GitHub Pages URL.
2. The header is immediately visible at the top of the viewport.
3. The visitor selects Home, About, Projects, or Contact.
4. The browser scrolls to the matching section while remaining on the root portfolio URL.
5. The sticky header remains available while the visitor reads the section.
6. The visitor can use the footer links or return to a header link without losing the shared layout.

### 3.2 Keyboard flow

1. The visitor presses `Tab` to reach the skip link or first navigation link.
2. Focus moves through navigation links in a logical order.
3. Pressing `Enter` activates the focused section link.
4. Focus indicators remain visible against the header background.
5. The visitor can continue into main content and footer links without focus becoming trapped.

### 3.3 Responsive flow

1. On a wide viewport above 768px, the brand and text navigation appear in one readable row.
2. On a viewport 768px or narrower, the navigation becomes icon-led and is fixed to the bottom of the viewport.
3. The header remains usable while scrolling and never covers the section heading after anchor navigation.

## 4. Interfaces Involved

### 4.1 Components

| Component | Responsibility |
| --- | --- |
| `MainLayout` | Shared structural shell; renders header, main children, and footer |
| `Header` or `Navbar` | Brand identity, skip link, and public section navigation |
| `Footer` | Identity/context and external professional links |
| `App` | Supplies the current portfolio sections to `MainLayout` |

Recommended location: `vite-project/src/components/layout/`. Components may be organized differently if the final structure follows the global repository conventions.

### 4.2 Pages and anchors

| Target | Purpose | Visibility |
| --- | --- | --- |
| `#home` | Portfolio introduction/hero | Public |
| `#about` | Skills and professional background | Public |
| `#projects` | Selected project showcase | Public |
| `#contact` | Contact form and contact options | Public |

The current application is a single-page app, so these anchors are the page interface. A later feature may introduce route-level pages only if it remains compatible with the global GitHub Pages rules.

### 4.3 Browser/platform interfaces

- Native anchor navigation and URL fragments.
- CSS sticky positioning and responsive media queries.
- No HTTP endpoints or Supabase calls are owned by this feature.

## 5. Data, Validations, and Expected Behavior

### 5.1 Navigation configuration

Navigation items should be represented as a typed or clearly structured list rather than duplicated markup. Each item must contain a visible label and a valid hash target. Private routes and placeholder targets must not be included.

### 5.2 Validation rules

- Every navigation target must exist exactly once in the rendered public content.
- Header and footer must render exactly once per `MainLayout` instance.
- The header must have a non-transparent or sufficiently opaque background so content remains legible while scrolling.
- Sticky/fixed positioning must not obscure the target heading after anchor navigation; use scroll offset or equivalent layout behavior.
- All interactive elements must be reachable by keyboard and have visible focus styles.
- External footer links must have valid URLs and safe new-tab attributes where applicable.
- Navigation must remain readable at mobile widths without horizontal page scrolling.
- The logo image must scale down without distortion or overflow.
- The layout must not depend on Supabase variables and must render when Supabase is unavailable.

### 5.3 Expected behavior

- The root URL loads the React application with the header visible.
- Clicking a navigation item moves to the matching public section while preserving the root-site experience.
- Scrolling keeps the header visible and consistently styled.
- The main content is not hidden behind the header.
- The footer follows the page content even when the page has little content.
- Missing or unconfigured Supabase values do not prevent header, navigation, or footer rendering.
- The admin login remains accessible only by direct URL when that feature is implemented and is absent from this navigation.

## 6. Acceptance Criteria

### AC-HF-01: Shared layout structure

**Given** the public application is rendered  
**When** the DOM is inspected  
**Then** a `MainLayout`-owned header appears before one semantic `<main>` region and a footer appears after it, with no duplicated shell markup in page content.

### AC-HF-02: Header remains visible

**Given** a page contains enough content to scroll  
**When** the visitor scrolls down  
**Then** the header remains visible, readable, and visually consistent with its initial state.

### AC-HF-03: Main navigation targets

**Given** the visitor is at the root portfolio URL  
**When** they activate Home, About, Projects, or Contact  
**Then** the browser moves to the matching section target, and no `/home`, `/portfolio`, or other route path is introduced.

### AC-HF-04: Mobile layout

**Given** a viewport at a typical mobile width  
**When** the visitor views and uses the header  
**Then** all navigation labels remain visible and usable without clipping, overlap, or horizontal scrolling.

### AC-HF-04A: Mobile icon navigation

**Given** a viewport at 768px wide or narrower  
**When** the visitor views the application  
**Then** navigation is presented in a bottom-fixed icon bar with accessible labels, and the footer/content has enough bottom spacing to remain unobscured.

### AC-HF-05: Keyboard accessibility

**Given** the visitor uses only a keyboard  
**When** they tab through the page and activate navigation  
**Then** focus order is logical, focus indicators are visible, and every navigation/footer action can be activated without a mouse.

### AC-HF-06: Footer presence

**Given** any public view uses `MainLayout`  
**When** the view renders  
**Then** the footer appears after the main content and includes accurate identity/context and valid professional links.

### AC-HF-07: Supabase-independent shell

**Given** Supabase environment variables are missing  
**When** the application loads  
**Then** the header, navigation, main layout, and footer still render without a runtime crash.

### AC-HF-08: Global specification compliance

**Given** this feature is reviewed against [../ai-spec.md](../ai-spec.md)  
**When** the reviewer checks static hosting, accessibility, responsive behavior, and navigation privacy  
**Then** the feature satisfies the global rules and does not expose or link to the admin route.

## 7. Verification Checklist

From `vite-project/`:

```bash
npm run lint
npm run build
```

Then manually verify:

- The root URL shows the header before the main content and footer after it.
- The header remains visible during scroll.
- Home, About, Projects, and Contact links reach existing targets.
- The URL does not gain `/home`, `/portfolio`, or another path segment.
- The header and footer work at desktop and mobile viewport widths.
- Keyboard focus is visible and all links are usable without a mouse.
- No admin/login item appears in public navigation.
- The shell still renders when Supabase is not configured.
