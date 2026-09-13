# Feature Specification: Portfolio Profile Content

**Feature ID:** F-04  
**Status:** Implemented baseline  
**Governing specification:** [../ai-spec.md](../ai-spec.md)

This feature must be implemented and reviewed under the Global AI Specification. The global specification is authoritative for architecture, accessibility, responsive behavior, static hosting, security, coding conventions, and the Definition of Done. This document adds only the profile-content-specific detail and consumes the layout shell defined by the Home Page (F-03) and Shared Header and Footer (F-02) features.

## 1. Feature Goal and Scope

### 1.1 Goal

Present the student's personal professional profile on the single-page portfolio so a visitor can, without scrolling far, learn who E'Onna Nixon is, what she does, the technical skills she works with, and the human strengths she brings to a team. The profile content must be organized into clearly separated visual sections, use accurate first-person copy, and include AI-generated supporting imagery that is documented and accessible.

### 1.2 Scope in

- The Introduction block in the hero section (`#home`): student name, role/title or tagline, and a short introductory paragraph describing who she is.
- A Technical Skills section (`#skills`) with at least three skills, each with a representative icon, a title, and a supporting sentence, arranged in a card grid.
- A Soft Skills and Talents section (`#strengths`) with at least three soft skills or talents, each with a representative icon, a title, and a supporting sentence, arranged in a card grid.
- Profile copy in the About section (`#about`) written in the student's own voice.
- At least two AI-generated images placed in profile content, each with meaningful `alt` text and a source comment.
- A repository `Research.md` file documenting the AI image tool, prompts, dates, and file locations.
- Visual separation between profile sections through spacing, a divider, or a background band.
- Navigation entries for the Skills and Strengths sections in the shared header.
- Responsive behavior of the profile sections for desktop, tablet, and mobile widths.

### 1.3 Scope out

- The hero artwork, values strip mechanics, project cards, and CTA target, which belong to the Home Page feature (F-03).
- The shared header shell, mobile bottom navigation styling, and footer, which belong to the Header and Footer feature (F-02).
- The contact form fields, validation, and Supabase submission, which belong to the Contact feature.
- Generating the final binary image assets; this feature ships documented placeholders and the integration points, and the real exports are dropped in at the same paths.
- Resume, LeetCode, CONCEPTS.md, blog, or case-study content.
- Any backend, serverless function, or route path beyond the existing root single page and hash targets.

## 2. Requirements Breakdown

### REQ-PORTFOLIO-001: Introduction identity

The hero section must display the student's name as the primary heading, a visible role or title or tagline, and a short introductory paragraph that describes who the student is in the first person. The name used in the Introduction must match the name shown in the shared header brand. The Introduction must remain readable without decorative artwork.

### REQ-PORTFOLIO-002: Technical Skills section

The page must include a `#skills` section with a heading and at least three technical skill cards. Each card must contain a representative icon marked as decorative for assistive technology, a short skill title, and at least one full sentence of supporting text. The cards must be presented as a visually organized grid or list, not as a bare comma-separated line.

### REQ-PORTFOLIO-003: Soft Skills and Talents section

The page must include a `#strengths` section with a heading and at least three soft skill or talent cards. Each card must contain a representative decorative icon, a short title, and at least one full sentence of supporting text. The section must use the same organized card layout language as the Technical Skills section for visual consistency.

### REQ-PORTFOLIO-004: Section organization and separation

The page must contain at least three distinct profile sections beyond the header and footer (for example Introduction, Technical Skills, Soft Skills). Each section must be a semantic `section` element with a heading, and adjacent sections must be visually separated by spacing plus a divider or background change so the boundary is obvious without reading the text.

### REQ-PORTFOLIO-005: AI-generated imagery

At least two images used in profile content must be AI generated. Each image must be topically relevant to the section it appears in, must have descriptive `alt` text, and must carry an inline source comment near its markup naming the AI tool. Images are served from `vite-project/public/images/` and referenced by root-absolute path so the production base path resolves them.

### REQ-PORTFOLIO-006: AI tool documentation

The repository must contain a `Research.md` file that records, for each AI-generated image: the tool and access method, the generation date, the operator, the exact prompt, the `alt` text, the section placement, and the file path. If the tool changes, `Research.md` and the inline comments must be updated together.

### REQ-PORTFOLIO-007: Navigation coverage

The shared header navigation must include entries that target `#skills` and `#strengths` in addition to the existing Home, About, Projects, and Contact entries. Every navigation entry must resolve to a section that exists in the DOM exactly once.

### REQ-PORTFOLIO-008: Responsive profile layout

The profile sections must avoid horizontal overflow and must adapt:

- Desktop: multi-column skill and strength card grids.
- Tablet: reduced column count with flexible widths.
- Mobile: single-column stacked cards with readable text and images scaled within their containers.

### REQ-PORTFOLIO-009: Content accuracy and accessibility

Profile copy must be truthful first-person content with no framework starter text. Headings must follow a logical hierarchy under the single page `h1`. Decorative icons must be hidden from assistive technology, and meaningful images must expose descriptive `alt` text.

## 3. User Flow

### 3.1 Reading the profile

1. A visitor opens the root portfolio URL.
2. The Introduction shows the student's name, title or tagline, and a short first-person summary.
3. The visitor scrolls to the Technical Skills section and scans the skill cards, each with an icon, title, and supporting sentence.
4. The visitor continues to the Soft Skills and Talents section and scans the strength cards in the same layout.
5. The visitor reaches the About section, sees the profile portrait image, and reads the approach copy.
6. The visitor continues to Projects and Contact, which are owned by other features.

### 3.2 Section navigation

1. The visitor activates Skills or Strengths in the shared navigation.
2. The browser moves to the matching hash section on the same root page.
3. Sticky-header spacing keeps the section heading visible.
4. The visitor can move between Introduction, Skills, Strengths, About, Projects, and Contact through the navigation without a full page load.

### 3.3 Verifying AI imagery provenance

1. A reviewer opens `Research.md` at the repository root.
2. The reviewer reads the tool name, date, and prompt for each image.
3. The reviewer confirms the documented file paths match the images referenced in the profile sections and the inline source comments.

## 4. Interfaces Involved

### 4.1 Components and files

| File or area | Responsibility |
| --- | --- |
| `vite-project/src/App.tsx` | Renders the Introduction copy, Technical Skills section, Soft Skills section, and the two profile images |
| `vite-project/src/App.css` | Styles the hero tagline, `.skill-grid` and `.skill-card`, `.about-portrait`, `.soft-skill-content`, `.soft-skill-banner`, and section dividers |
| `vite-project/src/components/layout/Header.tsx` | Provides the brand name and the navigation entries, including `#skills` and `#strengths` |
| `vite-project/public/images/ai-portrait.png` | AI-generated About portrait asset |
| `vite-project/public/images/ai-workspace.png` | AI-generated Soft Skills banner asset |
| `Research.md` | Documents the AI image tool, prompts, dates, and file locations |

### 4.2 Pages and section interfaces

| Target | Interface | Purpose |
| --- | --- | --- |
| `/` | Root single page | Hosts all profile content in `MainLayout` |
| `#home` | Hero section | Introduction: name, title or tagline, summary paragraph |
| `#about` | About section | Approach copy and AI-generated profile portrait |
| `#skills` | Technical Skills section | Technical skill cards |
| `#strengths` | Soft Skills and Talents section | Soft skill and talent cards |

### 4.3 Endpoints and external interfaces

- This feature owns no HTTP endpoints and performs no network requests.
- Images are static assets served by GitHub Pages from the built `dist/images/` directory.
- The AI image generation tool is used offline by the author; the running site does not call it.

## 5. Data, Validations, and Expected Behavior

### 5.1 Content data

Profile content is static, version-controlled copy in `App.tsx`. Skill and strength cards are repeated structures with three parts each: icon glyph, title, and supporting sentence. Image references are string paths rooted at `/images/`. There is no dynamic or user-provided data in this feature.

### 5.2 Validation rules

- The Introduction must render exactly one page `h1` containing the student's name.
- The name in the Introduction must equal the name in the header brand.
- The Technical Skills section must contain at least three cards; each card must have an icon element, a title element, and non-empty supporting text of at least one sentence.
- The Soft Skills section must contain at least three cards with the same three-part structure.
- The page must contain at least three distinct profile `section` elements with headings, each visually separated from its neighbour.
- At least two `img` elements in profile content must reference files under `/images/`, each with a non-empty `alt` attribute and an adjacent source comment naming the AI tool.
- `Research.md` must exist and name the tool, a date, and one prompt per image.
- Every header navigation `href` must match the `id` of exactly one rendered section.
- No profile text may contain Vite or React starter placeholder copy.
- Decorative icon elements must carry `aria-hidden="true"` and must not contribute redundant screen-reader text.

### 5.3 Expected behavior

- A fresh visit shows the Introduction, Technical Skills, and Soft Skills sections as complete, distinct, visually separated blocks.
- Skill and strength cards keep their icon, title, and description together when the grid reflows from multi-column to single-column.
- Profile images scale within their containers, never exceed the viewport width, and show their `alt` text when the file is missing.
- Until the final AI exports are added, placeholder image files load without breaking the build, and the styled container background keeps the layout intact.
- Navigating to `#skills` or `#strengths` scrolls to the correct section with the heading clear of the sticky header.
- Missing Supabase configuration does not affect any profile content.
- `npm run lint` and `npm run build` complete without errors.

## 6. Acceptance Criteria

### AC-PORTFOLIO-01: Introduction identity

**Given** a visitor opens the root URL  
**When** the hero section renders  
**Then** the student's name appears as the primary heading, a role or title or tagline is visible, a short first-person introductory paragraph is present, and the name matches the header brand.

### AC-PORTFOLIO-02: Technical Skills section

**Given** the visitor navigates to `#skills`  
**When** the section renders  
**Then** at least three skill cards are shown in an organized grid, and each card has a decorative icon, a title, and at least one full sentence of supporting text.

### AC-PORTFOLIO-03: Soft Skills and Talents section

**Given** the visitor navigates to `#strengths`  
**When** the section renders  
**Then** at least three soft skill or talent cards are shown in the same organized layout, each with a decorative icon, a title, and at least one full sentence of supporting text.

### AC-PORTFOLIO-04: Section organization

**Given** the visitor scrolls the page  
**When** they move between the Introduction, Technical Skills, and Soft Skills sections  
**Then** there are at least three distinct semantic sections with headings, and each boundary is visually separated by spacing plus a divider or background change.

### AC-PORTFOLIO-05: AI imagery on the page

**Given** the profile content is displayed  
**When** the About and Soft Skills sections render  
**Then** at least two AI-generated images are shown, each relevant to its section, each with descriptive `alt` text, and each with an inline comment naming the AI tool.

### AC-PORTFOLIO-06: AI tool documentation

**Given** a reviewer opens `Research.md`  
**When** they read it  
**Then** it names the AI tool and access method, a generation date, and the exact prompt, `alt` text, section, and file path for each AI-generated image, and those paths match the images on the page.

### AC-PORTFOLIO-07: Navigation coverage

**Given** the shared header is visible  
**When** the visitor uses the navigation  
**Then** entries for Skills and Strengths are present, and every navigation entry scrolls to a section that exists exactly once.

### AC-PORTFOLIO-08: Responsive layout

**Given** the visitor views the page at 390px and at desktop width  
**When** they scroll through the profile sections  
**Then** the skill and strength grids reflow without horizontal overflow, cards keep their icon, title, and text together, and images stay within their containers.

### AC-PORTFOLIO-09: Content quality and accessibility

**Given** the page is reviewed with keyboard and assistive technology  
**When** headings, icons, and images are inspected  
**Then** there is one page `h1`, headings nest logically, decorative icons are hidden from assistive technology, meaningful images expose `alt` text, and no starter placeholder copy is present.

### AC-PORTFOLIO-10: Global specification compliance

**Given** the feature is reviewed against [../ai-spec.md](../ai-spec.md)  
**When** static hosting, security, accessibility, and documentation rules are checked  
**Then** the feature adds no backend, no committed secret, no fictional client branding, and no behavior that contradicts the global specification.

## 7. Verification Checklist

From `vite-project/`:

```bash
npm run lint
npm run build
```

Then run a browser smoke check at desktop and 390px widths and verify:

- The Introduction shows the student's name, a title or tagline, and a first-person summary paragraph.
- The Technical Skills section shows at least three cards, each with an icon, title, and supporting sentence.
- The Soft Skills and Talents section shows at least three cards in the same layout.
- At least three profile sections are visible and each boundary is visually separated.
- The About portrait and the Soft Skills banner images load, are relevant, and have `alt` text.
- `Research.md` exists and documents the AI tool, dates, and one prompt per image, with paths matching the page.
- Header navigation includes Skills and Strengths, and every entry scrolls to a real section.
- No horizontal overflow at 390px and no starter Vite or React copy anywhere in the profile content.
