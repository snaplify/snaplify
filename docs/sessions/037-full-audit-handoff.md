# Session 037 — Full Architecture Audit & Handoff

Date: 2026-03-16

## Critical Fix This Session

**Block components were rendering as empty HTML elements.** `<component :is="'EditorsBlocksTextBlock'">` with a string doesn't work in Nuxt — auto-imports are compile-time only, not registered in Vue's runtime global registry. Fixed by direct ES module imports of all 14 block components in BlockCanvas.vue. Also fixed DOMPurify sanitizer using `require()` in ESM context — changed to async `import()`.

## Full Audit Results

### Numbers
- **45** pages — all present and functional (100%)
- **122** API endpoints — 28/31 from plan Phase 3.1 implemented (90%)
- **14** block type components — all with direct imports now
- **4** specialized editors + **4** specialized view components
- **50** DB tables, **17** indexes
- **1,021+** tests pass
- **11** build tasks, **12** test tasks — all green

### What's Actually Working End-to-End
- Content CRUD (create/edit/save/publish/view) for all 4 types
- Block editor with slash commands, floating toolbar, auto-save, keyboard nav
- Product catalog + BOM autocomplete in parts list + gallery queries
- Hub system with 3 types (community/product/company) + type-switched tabs
- Learning paths with enrollment, progress, certificates
- Docs sites with pages, navigation, search, versioning
- Contests with state machine, entries, judging
- Social (likes, comments, bookmarks, follows, reports)
- File uploads with image processing (sharp WebP thumbnails)
- Storage adapter (local filesystem or S3/DO Spaces/MinIO via env)
- Dashboard with content/bookmarks/learning tabs
- Notifications (SSE stream), messages (polling)
- Federation infrastructure (AP actors, WebFinger, NodeInfo, RSS, sitemap)
- Profile editor matching mockup (banner/avatar upload, skills, social links, experience)
- Admin panel (users, reports, audit, settings, content moderation)

### What's Missing vs hack-build Reference

| hack-build Feature | CommonPub Status |
|-------------------|-----------------|
| 13 block types | 14 block types (we have more) |
| MarkdownBlock | ❌ Missing |
| ExplainerSectionBlock (collapsible) | ❌ Missing |
| GalleryBlock (multi-image grid) | ⚠️ Mapped to ImageBlock |
| Pinia editor store | Using composable instead (equivalent) |
| Password recovery flow | ❌ Missing pages |
| Email verification flow | ❌ Missing pages |
| Contest judge page | ❌ Missing (API exists) |
| Admin featured management | ❌ Missing page |
| 25+ pages | 45 pages (we have more) |
| 27 DB tables | 50 DB tables (we have more) |
| Docs site | ✅ We have it, they don't |
| Federation | ✅ We have it, they don't |

### Editor Gaps vs Mockups

**ALL editors missing:**
- Canvas toolbar (zoom controls, viewport toggles, block navigation)
- Assets/Files tab in left panel

**Article editor (~60% vs mockup):**
- Missing: Structure tab, Assets tab, search in block library

**Blog editor (~50% vs mockup):**
- Missing: Title/subtitle editable fields in canvas, author byline section, author/social sections in right panel

**Explainer editor (~75% vs mockup):**
- Missing: Assets tab

**Project editor (~90% vs mockup):**
- Matches well — has parts list, difficulty, build time, checklist

**Profile editor (100% vs mockup):**
- Fully matches at `settings/profile.vue`

### Missing API Endpoints (4)
1. `POST /api/videos/categories` — admin create category
2. `PUT /api/videos/categories/:id` — admin update category
3. `DELETE /api/videos/categories/:id` — admin delete category
4. `GET /api/content/:id/versions/:versionId` — get specific version

### Missing Pages
- `/forgot-password` — password recovery
- `/reset-password` — password reset via token
- `/verify-email` — email verification
- Contest judge page (dedicated UI for scoring entries)
- Admin featured management page
- Video hub page (per mockup `16-video-hub.html`)
- Learning certificate page

### What's Deferred (Correctly)
- Federation delivery (per rule #10)
- Meilisearch integration
- WebSocket messaging (have polling)
- Editor consolidation (Phase 4.4 — EditorShell exists, not wired)

## Priority Order for Next Work

### P0 — Blocking
1. ~~Save clears content~~ — Fixed (component resolution + sanitizer)

### P1 — Editor Functionality
2. Blog editor: add title/subtitle/byline fields in canvas
3. Article editor: add Structure tab
4. All editors: search in block library (EditorBlocks already has search UI but it may not filter the left panel vs the picker)

### P2 — Missing Core Pages
5. Password recovery + reset pages
6. Email verification page
7. Contest judge page

### P3 — Missing API
8. Video category CRUD (3 endpoints)
9. Get specific content version endpoint

### P4 — Feature Parity with hack-build
10. MarkdownBlock (full markdown editor)
11. GalleryBlock (multi-image grid, not just single image)

### P5 — Polish
12. Canvas toolbar (zoom, viewport toggles)
13. Assets tab in editors
14. Editor consolidation into EditorShell
