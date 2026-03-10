# Research: HTML Export — Single-File Generation

## Goal

Generate self-contained HTML files from explainers that:

- Open in any browser with no network requests
- Include working quiz interactivity
- Include progress tracking (localStorage)
- Include TOC navigation
- Optionally include GSAP animations (Phase 5b)
- Are responsive and accessible

## Approaches Evaluated

### Template Literal Generation

- Pros: Simple, no build step, full control, tree-shakeable
- Cons: String concatenation can be error-prone, no component reuse
- Verdict: Best fit — explainer HTML is structured and predictable

### Puppeteer/Playwright Render-to-HTML

- Pros: Renders actual app, captures real output
- Cons: Requires headless browser, slow, heavy dependency, hard to inline assets
- Verdict: Overkill for structured content

### RevealJS Export

- Pros: Mature slide deck format, PDF export
- Cons: Slide-oriented (not section-oriented), heavy runtime (~300KB), opinionated styles
- Verdict: Wrong abstraction — explainers are scrollable documents, not slide decks

### SingleFile (browser extension approach)

- Pros: Captures any page as single HTML
- Cons: Requires browser context, not programmatic, captures rendered DOM not source
- Verdict: Not applicable for server-side generation

## JS/CSS Inlining Strategy

### CSS Inlining

1. Define all styles using CSS custom properties with **fallback values**: `var(--color-text, #1a1a2e)`
2. Inline a `<style>` block with all theme tokens resolved to fallbacks
3. Include component-specific styles (quiz forms, TOC, progress bar)
4. Total CSS: ~5-8KB minified

### JS Inlining

1. Vanilla JS only — no framework runtime
2. Quiz logic: option selection, scoring, gate enforcement (~3KB)
3. Progress tracking: localStorage read/write (~1KB)
4. TOC navigation: scroll-to-anchor, active section highlighting (~1KB)
5. Keyboard navigation: arrow keys, Tab, Enter (~0.5KB)
6. Total JS: ~6KB minified (without GSAP)

### GSAP Inlining (Phase 5b)

- GSAP core + ScrollTrigger: ~50KB gzipped, ~150KB uncompressed
- Only inline when `includeAnimations: true`
- Include animation timeline definitions per section
- Graceful degradation: quiz/progress work without GSAP

### Image Handling

- Phase 5: Images referenced by URL (not inlined)
- Future: Option to convert to data URIs for fully offline export
- Data URI warning: Large images significantly increase file size

## HTML Template Structure

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <style>
      /* Inlined CSS with custom property fallbacks */
    </style>
  </head>
  <body>
    <nav class="explainer-toc"><!-- TOC sidebar --></nav>
    <main class="explainer-content">
      <header><!-- Title, meta --></header>
      <section id="{anchor}" class="explainer-section">
        <!-- Section content (HTML from BlockTuples) -->
        <!-- Quiz form (if quiz section) -->
        <!-- Checkpoint gate (if checkpoint section) -->
      </section>
      <!-- ... more sections -->
    </main>
    <div class="explainer-progress"><!-- Progress bar --></div>
    <script>
      /* Inlined JS for interactivity */
    </script>
  </body>
</html>
```

## Size Budget

| Component                  | Unminified   | Minified      |
| -------------------------- | ------------ | ------------- |
| HTML structure             | ~2KB         | ~1.5KB        |
| CSS (with fallbacks)       | ~8KB         | ~5KB          |
| JS (quiz + progress + nav) | ~8KB         | ~6KB          |
| Content (varies)           | ~10-50KB     | ~8-40KB       |
| **Total (no GSAP)**        | **~28-68KB** | **~20-52KB**  |
| GSAP (optional)            | ~150KB       | ~50KB gzipped |

## Decision

- Use template literal generation (no build step, no browser dependency)
- Inline CSS with custom property fallbacks for theming
- Inline vanilla JS for quiz, progress, and navigation
- GSAP inlined only when `includeAnimations: true` (Phase 5b)
- Images remain URL references (data URI option deferred)
