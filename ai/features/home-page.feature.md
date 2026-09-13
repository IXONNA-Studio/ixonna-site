# Feature Specification: Home Page

**Feature ID:** F-03  
**Status:** Implemented baseline  
**Governing specification:** [../ai-spec.md](../ai-spec.md)

This feature must be implemented and reviewed under the Global AI Specification. The global specification is authoritative for architecture, accessibility, responsive behavior, static hosting, security, coding conventions, and the Definition of Done.

## 1. Feature Goal and Scope

### 1.1 Goal

Create the public landing experience for Nixon E.'s professional portfolio. The Home page must communicate identity, capabilities, working values, selected work, and a clear next action within the first visit. It should feel like a confident developer portfolio inspired by the Nixon logo system: bright white space, deep indigo typography, violet gradients, cyan accents, geometric details, and structured editorial spacing.

### 1.2 Scope in

- The public single-page Home experience at the root GitHub Pages URL.
- A branded hero section with the Nixon logo artwork, professional title, introduction, and work CTA.
- A core-values strip covering Code, Technology, Growth, Balance, and Leadership.
- An About section describing the developer's professional approach and core traits.
- A Selected Work section with project cards for Rocket Elevators, Rocket Food Delivery, and CodeBloggs.
- A Contact section entry point and the existing Supabase-backed contact form.
- Anchor targets for `#home`, `#about`, `#projects`, and `#contact`.
- Responsive layout behavior for desktop, tablet, and mobile viewports.
- Accessible headings, landmarks, image handling, focus states, and meaningful link labels.
- Visual consistency with the shared Header, MainLayout, Footer, and global design tokens.

### 1.3 Scope out

- Shared header/footer structure, which belongs to the Header/Footer feature.
- Detailed project case-study pages or project-specific routes.
- Admin authentication, protected contact-message management, and dashboard behavior.
- Supabase schema, RLS policy setup, and client configuration; the Home page only consumes the contact form interface.
- Resume/LinkedIn editing, LeetCode solution pages, CONCEPTS.md, videos, or submission-summary content.
- A custom backend, server-side rendering, or route paths such as `/home` and `/portfolio`.

## 2. Requirements Breakdown

### REQ-HOME-001: Root landing experience

The Home page must be the default landing page at the root URL `/`. The root URL must render the Home page inside `MainLayout` without a redirect or additional route segment. The page must provide a clear first-viewport identity signal: logo, full-stack developer label, headline, supporting description, and a visible CTA to selected work.

The application must remain a single-page root experience: section navigation may use hash targets such as `/#about` and `/#projects`, but no `/home`, `/portfolio`, or other path is required for the Home page.

### REQ-HOME-002: Branded hero

The hero must use the approved Nixon logo asset and the established visual language. Decorative artwork may use geometric orbit lines and soft color fields, but it must not interfere with readable content or interactive controls. The hero CTA must point to the real `#projects` target.

### REQ-HOME-003: Values strip

The Home page must present the five core values as a compact visual band:

- Code
- Technology
- Growth
- Balance
- Leadership

Each value must have a visible title and concise supporting description. The strip must remain readable when it stacks on narrow screens.

### REQ-HOME-004: About introduction

The About section must communicate how the developer works: translating complicated requirements into approachable interfaces, dependable data flows, and accessible interactions. The section must include the `#about` anchor and remain understandable without relying on visual decoration.

### REQ-HOME-005: Selected work

The Projects section must include three clearly differentiated project cards:

- Rocket Elevators: full-stack platform.
- Rocket Food Delivery: product experience.
- CodeBloggs: content system.

Each card must include a project name, short truthful description, category/context, and technology or capability tags. Cards are showcase summaries; detailed case-study behavior belongs to a later feature.

### REQ-HOME-006: Contact handoff

The Home page must expose the Contact section at `#contact` and render the existing ContactForm. The page must remain usable when Supabase is unavailable; the form owns its own validation and fallback messaging.

### REQ-HOME-007: Responsive layout

The Home page must avoid horizontal overflow and adapt its structure:

- Desktop: two-column hero and About composition, five-column values strip, three-column project grid.
- Tablet: reduced spacing and flexible content widths.
- Mobile: vertically stacked hero, values, About, projects, and Contact content with readable type and no clipped controls.

### REQ-HOME-008: Accessibility and content quality

The page must use semantic sections and heading hierarchy, preserve visible keyboard focus, keep text readable against backgrounds, provide meaningful alt text for meaningful images, hide decorative art from assistive technology, and contain no Vite starter copy or placeholder social destinations.

## 3. User Flow

### 3.1 First visit

1. A visitor opens the root portfolio URL.
2. The shared header and Nixon identity are visible immediately.
3. The visitor reads the hero headline and supporting statement.
4. The visitor selects “Explore my work” or uses navigation to move to Projects.
5. The visitor scans the values strip and About introduction to understand the developer's approach.
6. The visitor reviews project cards and their technology tags.
7. The visitor moves to Contact through navigation or the page content.

### 3.2 Section navigation

1. The visitor activates Home, About, Projects, or Contact in the shared navigation.
2. The browser moves to the matching hash section on the same root page.
3. Sticky-header spacing prevents the section heading from being hidden.
4. The visitor can return to Home through the logo or Home navigation item.

### 3.3 Contact handoff

1. The visitor reaches the Contact section.
2. If Supabase is configured, they complete the form and receive validation/submission feedback from ContactForm.
3. If Supabase is not configured, the page remains stable and the form communicates that storage is unavailable.
4. The visitor can use the footer email or social link as an alternate contact path.

## 4. Interfaces Involved

### 4.1 Components

| Component | Responsibility |
| --- | --- |
| `App` | Composes Home sections and supplies them to `MainLayout` |
| `MainLayout` | Provides shared Header, main landmark, and Footer |
| `Header` | Provides public section navigation and Home logo link |
| `ContactForm` | Provides Contact fields, validation, Supabase submission, and fallback state |
| `Footer` | Provides alternate contact links and copyright context |

### 4.2 Pages and section interfaces

| Target | Interface | Purpose |
| --- | --- | --- |
| `/` | Home page | Public portfolio landing experience |
| `#home` | Hero section | Identity, positioning, and CTA |
| `#about` | About section | Professional approach and traits |
| `#projects` | Selected Work section | Project summary cards |
| `#contact` | Contact section | Contact form and contact handoff |

No new HTTP endpoints are owned by this feature. Contact persistence is delegated to the existing Supabase data helper through ContactForm.

### 4.3 External interfaces

- GitHub Pages serves the static root application.
- Supabase is used only indirectly through ContactForm when configured.
- Footer external links must use verified destinations and safe new-tab behavior where applicable.

## 5. Data, Validations, and Expected Behavior

### 5.1 Content data

Home page content is static, version-controlled portfolio content. Repeated project/value content should remain structured and easy to update without changing layout behavior. Project claims and technology tags must accurately reflect the developer's work.

### 5.2 Validation rules

- The root page must render without Supabase environment variables.
- Every navigation/CTA target must exist in the DOM exactly once.
- The page must contain one primary Home heading and a logical heading hierarchy.
- The hero logo must load from the approved asset and decorative duplicate art must not create redundant screen-reader content.
- Project cards must not contain placeholder links, fake metrics, or starter Vite references.
- Text, cards, form controls, and value items must fit their containers at mobile widths.
- The Home page must not expose the admin route or admin credentials.
- Contact validation and Supabase error handling remain owned by ContactForm and must not be duplicated in Home.

### 5.3 Expected behavior

- A fresh visit displays a complete professional Home page, not a framework starter screen.
- The CTA and shared navigation scroll to valid same-page targets.
- The logo art and decorative shapes enhance the page without blocking content.
- Values and project cards retain their meaning when stacked on mobile.
- Missing Supabase configuration does not prevent the Home page, header, footer, hero, values, About, or Projects sections from rendering.
- Contact submission success, validation errors, and unavailable-storage feedback are visible and recoverable.
- The page remains static-hosting compatible and does not require a backend server to render.

## 6. Acceptance Criteria

### AC-HOME-01: Root page identity

**Given** a visitor opens `/` or the root GitHub Pages URL  
**When** the page loads  
**Then** the URL remains at the root path, the Home page is the default landing page, and the Nixon logo, full-stack developer label, headline, supporting copy, and work CTA are visible without starter Vite content.

### AC-HOME-02: Hero CTA

**Given** the Home hero is visible  
**When** the visitor activates “Explore my work”  
**Then** the browser moves to the existing `#projects` section without creating a `/projects` route.

### AC-HOME-03: Values strip

**Given** the visitor scans the Home page  
**When** the values band renders  
**Then** Code, Technology, Growth, Balance, and Leadership each have visible descriptions and remain readable on desktop and mobile.

### AC-HOME-04: About section

**Given** the visitor navigates to `#about`  
**When** the section enters the viewport  
**Then** the professional approach copy and core traits are visible, readable, and not hidden under the sticky header.

### AC-HOME-05: Project showcase

**Given** the visitor navigates to `#projects`  
**When** the project grid renders  
**Then** Rocket Elevators, Rocket Food Delivery, and CodeBloggs appear as distinct cards with categories, descriptions, and tags.

### AC-HOME-06: Contact integration

**Given** the visitor navigates to `#contact`  
**When** Supabase is configured  
**Then** the ContactForm is usable and delegates valid submissions to the Supabase contact-message helper.

### AC-HOME-07: Contact fallback

**Given** Supabase variables are missing  
**When** the Home page loads  
**Then** all Home content renders without a runtime crash and ContactForm communicates that storage is not configured.

### AC-HOME-08: Responsive desktop layout

**Given** a viewport wider than 768px  
**When** the visitor views the Home page  
**Then** the hero, values strip, About section, project cards, and Contact form use the desktop composition without horizontal overflow.

### AC-HOME-09: Responsive mobile layout

**Given** a viewport 768px wide or narrower  
**When** the visitor views and scrolls through the Home page  
**Then** sections stack vertically, text remains readable, images scale within their containers, bottom navigation does not obscure content, and document width does not exceed the viewport.

### AC-HOME-10: Accessibility

**Given** the visitor uses keyboard navigation or assistive technology  
**When** they move through the Home page  
**Then** landmarks, headings, CTA, navigation targets, project content, and ContactForm controls have meaningful semantics and visible focus behavior.

### AC-HOME-11: Global specification compliance

**Given** the Home page is reviewed against [../ai-spec.md](../ai-spec.md)  
**When** static hosting, privacy, responsive design, Supabase fallback, and documentation rules are checked  
**Then** the feature introduces no custom backend, no public admin link, no committed secret, and no behavior that contradicts the global specification.

## 7. Verification Checklist

From `vite-project/`:

```bash
npm run lint
npm run build
```

Run a browser smoke check at desktop and mobile viewports and verify:

- Root page returns successfully and renders Header, Home, Projects, Contact, and Footer.
- Opening `/` does not redirect to `/home`, `/portfolio`, or another path.
- Hero CTA reaches `#projects`.
- Navigation reaches `#home`, `#about`, `#projects`, and `#contact`.
- Values strip contains all five values.
- All three project cards are visible and readable.
- No horizontal overflow exists at a 390px-wide viewport.
- Mobile bottom navigation remains fixed without covering the last Contact content.
- Missing Supabase variables do not crash the page.
- No Vite starter copy, admin navigation item, credentials, or placeholder external link appears.
