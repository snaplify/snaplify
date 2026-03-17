# Session 043 — Block Content Rendering Pipeline + API Enrichment

Date: 2026-03-17

## What Was Done

### BlockContentRenderer — Pure Vue Rendering Pipeline (19 New Components)

**Problem:** All 4 view components rendered content via `<CpubEditor :editable="false">`, a TipTap editor wrapper. TipTap `renderHTML` methods produced minimal placeholder HTML — partsList rendered as empty divs, buildSteps as plain text, quizzes without options, sliders without interactivity.

**Solution:** Created `apps/reference/components/blocks/` with a `BlockContentRenderer.vue` orchestrator and 18 dedicated view components. The renderer maps `BlockTuple[]` to Vue components via a type→component lookup, supports `startIndex`/`endIndex` for section slicing, and tracks sequential build step numbers.

**Basic blocks (9):**
- `BlockTextView` — renders `content.html` with prose styling
- `BlockHeadingView` — dynamic h1-h6 with anchor `id` for TOC linking
- `BlockCodeView` — dark `<pre><code>` with language/filename header bar
- `BlockImageView` — `<figure>` with lazy loading and optional caption
- `BlockQuoteView` — blockquote with optional attribution footer
- `BlockCalloutView` — info/tip/warning/danger variants with icon + colored border
- `BlockDividerView` — styled `<hr>`
- `BlockVideoView` — YouTube/Vimeo URL detection → iframe embed
- `BlockEmbedView` — generic iframe embed

**Structured blocks (4 — previously invisible):**
- `BlockPartsListView` — full table with name/qty/notes columns, price totals, linked URLs
- `BlockBuildStepView` — numbered step card with dark header, time estimate, optional image
- `BlockToolListView` — styled tool list with optional notes and required/optional badges
- `BlockDownloadsView` — file rows with download icons and action buttons

**Interactive blocks (3 — previously placeholders):**
- `BlockQuizView` — clickable options with correct/wrong feedback, `answered` event
- `BlockSliderView` — range input with value display, state-based feedback messages from content data
- `BlockCheckpointView` — animated completion marker, `reached` event

**Other (2):**
- `BlockMathView` — monospace code display of expressions
- `BlockGalleryView` — responsive image grid with captions

### ExplainerView Section Rendering Fix

- Removed hardcoded dummy sections (neurons, gradient descent, etc.)
- Sections now derived from heading blocks (level ≤ 2) in the content
- Falls back to content `sections` array if provided, or single section if no headings
- Block ranges computed per section for `startIndex`/`endIndex` slicing
- Quiz `answered` and checkpoint `reached` events wire to section completion state

### CpubEditor Swap in All Views

Replaced `<ClientOnly><CpubEditor :model-value="..." :editable="false" /></ClientOnly>` with `<BlockContentRenderer :blocks="..." />` in:
- `ArticleView.vue` — prose body
- `BlogView.vue` — prose body
- `ProjectView.vue` — overview tab
- `pages/[type]/[slug]/index.vue` — fallback view

Removed `<ClientOnly>` wrappers since BlockContentRenderer is pure Vue with no browser-only TipTap dependency. This also means content renders during SSR.

### Content API Author Enrichment

**`packages/server/src/content.ts` — `getContentBySlug()`:**
- Author select now includes `bio` and `headline` from users table
- Added parallel subqueries for `followerCount` (from follows table), `articleCount` (published content by author), `totalViews` (sum of viewCount)
- Added related content query: 3 most recent published items of same type
- All queries run in parallel via `Promise.all` for no latency increase

**`packages/server/src/types.ts`:**
- New `ContentDetailAuthor` interface extending `UserRef` with `bio`, `headline`, `followerCount`, `articleCount`, `totalViews`
- New `ContentRelatedItem` interface for related content results
- `ContentDetail.author` narrowed to `ContentDetailAuthor`
- `ContentDetail.related` optional array of `ContentRelatedItem`

### Test Results

- **All server tests pass** — 19 files, 175 passed, 5 skipped (PGlite)
- **Full build succeeds** — all 13 packages including reference app
- Only pre-existing failure: `protocol:keypairs.test.ts` timeout (unrelated)

## Decisions Made

1. **Pure Vue over TipTap read-mode** — TipTap `renderHTML` can't mount interactive Vue components (sliders, quizzes). BlockTuples are the canonical format; no ProseMirror round-trip needed.
2. **Component-per-block-type** — each block type gets its own `.vue` file with scoped styles. The orchestrator maps types to components via a simple object lookup.
3. **SSR-safe** — no more `<ClientOnly>` wrappers for content rendering. BlockContentRenderer is pure Vue, renders on the server.
4. **Parallel author enrichment** — follower count, article count, total views, and related content all fetched in a single `Promise.all` alongside tags. No N+1 queries.
5. **Section derivation from headings** — ExplainerView sections are computed from the content itself rather than stored separately. Falls back to stored sections or single-section mode.

## Files Changed

**New (19 files):**
- `apps/reference/components/blocks/BlockContentRenderer.vue`
- `apps/reference/components/blocks/Block{Text,Heading,Code,Image,Quote,Callout,Divider,Video,Embed,PartsList,BuildStep,ToolList,Downloads,Quiz,Slider,Checkpoint,Math,Gallery}View.vue`

**Modified (7 files):**
- `apps/reference/components/views/ExplainerView.vue` — section derivation + renderer swap
- `apps/reference/components/views/ArticleView.vue` — renderer swap
- `apps/reference/components/views/BlogView.vue` — renderer swap
- `apps/reference/components/views/ProjectView.vue` — renderer swap
- `apps/reference/pages/[type]/[slug]/index.vue` — renderer swap
- `packages/server/src/content.ts` — enriched `getContentBySlug` with author stats + related content
- `packages/server/src/types.ts` — `ContentDetailAuthor`, `ContentRelatedItem`, expanded `ContentDetail`

## Open Questions

- Should we add a `BlockListView` for `bulletList`/`orderedList` block types, or are those always rendered as HTML within `text` blocks?
- ExplainerView sections assume heading level ≤ 2. Should this be configurable?
- Related content is same-type only. Cross-type related content (e.g. articles related to projects) could be valuable.

## Next Steps

- Editor consolidation: config-driven EditorShell to remove ~400 lines of duplication
- Cover image upload in canvas for article editor
- Migrations SQL (needs running Postgres)
- Further page decomposition (hub, profile)
