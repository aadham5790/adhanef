# Plan: Add logo-main banner to About page

## Goal
Insert the `assets/images/logo-main.jpg` image at the top of `about.html`, directly below the fixed top nav, capped at 900px and centered (user-confirmed).

## Context / decisions
- Asset exists: `D:\Projects\Code\Adyhanef\assets\images\logo-main.jpg`.
- Header is `position: fixed`, height 72px (`css/components.css:1`, `--header-h: 72px` in `css/variables.css:27`).
- `.about-hero` currently carries the header offset itself via `padding: calc(var(--header-h) + 3rem) 0 3rem` (`css/pages/about.css:1`). Once the banner sits between the fixed header and the hero, that offset must move to the banner to avoid a ~72px dead gap above the hero heading.
- User-confirmed: About page only (~900px centered, not full 1200px container, and not other pages).

## Tasks
1. **`about.html`** — insert a banner section between `</header>` and `<section class="about-hero">`:

   ```html
   <section class="about-banner">
     <div class="container">
       <img src="assets/images/logo-main.jpg" alt="Ady Hanef" class="about-banner-img">
     </div>
   </section>
   ```

   - No `loading="lazy"` (above the fold).
   - `src` relative path matches sibling pages at repo root (`assets/images/logo.jpg` is referenced the same way).

2. **`css/pages/about.css`** — add banner rules before `.about-hero`:

   ```css
   .about-banner {
     padding: calc(var(--header-h) + 1.5rem) 0 0;
   }

   .about-banner-img {
     display: block;
     width: 100%;
     max-width: 900px;
     margin: 0 auto;
     border-radius: var(--radius-lg);
   }
   ```

   - The banner takes over the fixed-header offset; `.container` provides the 1.5rem side gutters.
   - `--radius-lg` matches existing card/project styling (used in `projects.css`/`about.css`).

3. **`css/pages/about.css`** — change `.about-hero` padding from `calc(var(--header-h) + 3rem) 0 3rem` to `2rem 0 3rem` so the hero does not double the header offset.

## Out of scope
- No changes to other pages (index, projects, blog, etc.).
- No alt-text/i18n or meta changes; no aspect-ratio cropping (keep `height: auto` fluid from reset.css:24).

## Validation
1. Open `about.html` locally (static site, no server needed) in a browser.
2. Desktop ≥1024px: banner renders below the fixed nav, centered, ≤900px wide with rounded corners; "About Ady Hanef" heading follows with a normal gap (~2rem), no ~72px dead space.
3. Mobile 375px: banner is fluid within container gutters, no horizontal overflow; nav still fixed above it.
4. Commit + push (repo convention: imperative messages, single file-scoped commits).

## Risks
- None significant: additive section + two CSS tweaks; no JS involved.
