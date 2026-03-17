# Session 029 — Phase 2 & 3: Server Layer + API Endpoints

Date: 2026-03-15

## What Was Done

### Phase 2: Server Layer

**2.1 — Product server functions** (`packages/server/src/product.ts` — NEW, ~450 LOC):
- CRUD: `createProduct`, `updateProduct`, `deleteProduct`, `getProductBySlug`
- Listing: `listHubProducts`, `searchProducts` (with category/status/search filters)
- BOM linking: `addContentProduct`, `removeContentProduct`, `listContentProducts`, `syncContentProducts`
- Gallery queries: `listProductContent` (projects using a product), `listHubGallery` (unified gallery per hub type — community via shares, product via contentProducts, company via all child products)

**2.2 — Follow system + profile update:**
- Added to `social.ts`: `followUser`, `unfollowUser`, `isFollowing`, `listFollowers`, `listFollowing`
- Added to `social.ts`: `createReport` (user-facing content/user reporting)
- Added to `profile.ts`: `updateUserProfile` (bio, headline, skills, social links, avatar, banner, pronouns, timezone, email notification prefs)
- New types: `FollowUserItem`

**2.3 — Contest fixes + content versioning:**
- Fixed `judgeContestEntry`: now checks judge is in contest.judges array, contest must be in 'judging' phase
- Fixed `submitContestEntry`: validates contest is active, content is published, user owns content
- Added `deleteContest` with ownership check
- Added `transitionContestStatus` with state machine (upcoming→active→judging→completed)
- Added `calculateContestRanks` — sorts entries by score, assigns rank
- Added content versioning to `content.ts`: `createContentVersion`, `listContentVersions`
- `publishContent` now auto-creates a version snapshot before publishing

### Phase 3: API Endpoints

**Product endpoints (7 new routes):**
- `GET /api/products` — search/browse product catalog
- `GET /api/products/:slug` — product detail
- `GET /api/products/:slug/content` — project gallery for product
- `PUT /api/products/:id` — update product (validated)
- `DELETE /api/products/:id` — delete product
- `POST /api/hubs/:slug/products` — add product to hub (validated)
- `GET /api/hubs/:slug/gallery` — unified hub gallery

**Content BOM endpoints (4 new routes):**
- `GET /api/content/:id/products` — list products in BOM
- `POST /api/content/:id/products` — add product to BOM (validated)
- `PUT /api/content/:id/products` — bulk sync BOM
- `DELETE /api/content/:id/products/:productId` — remove from BOM

**Profile + social endpoints (7 new routes):**
- `GET /api/profile` — authenticated user's profile
- `PUT /api/profile` — update own profile (validated)
- `POST /api/users/:username/follow` — follow user
- `DELETE /api/users/:username/follow` — unfollow user
- `GET /api/users/:username/followers` — list followers
- `GET /api/users/:username/following` — list following
- `POST /api/content/:id/report` — report content (validated)

**Content versioning endpoint (1 new route):**
- `GET /api/content/:id/versions` — version history

## Test Results

- All 13 packages build successfully
- All 27 test tasks pass (zero regressions)
- Total new API endpoints: 19
- Total new server functions: ~25

## CLAUDE.md Updated

- Rule #6 changed: "Hub is the umbrella concept" with three types, products normalized, no guide type

## Next Steps

- Phase 4: Frontend — match mockups, hub page variants, editor consolidation
- Phase 5: Seed script + testing
- Phase 6: Production hardening
