# Session 028 — Phase 1: Hub Rename + Product Catalog + Schema Hardening

Date: 2026-03-15

## What Was Done

### Phase 1.1 — Rename communities → hubs (Step A: code only)

**Schema (`packages/schema/src/`):**
- Created `hub.ts` replacing `community.ts` — all symbols renamed (hubs, hubMembers, hubPosts, hubPostReplies, hubBans, hubInvites, hubShares)
- Added new columns: `hubType` (community/product/company), `privacy` (public/unlisted/private), `parentHubId`, `website`, `categories`, `apActorId`, `deletedAt`
- Added `status` column to hubMembers (pending/active)
- Added `lastEditedAt` to hubPosts
- Hub hierarchy relation added (parentHub/childHubs via relationName)
- DB table names unchanged (Step A of two-step migration)

**Enums (`enums.ts`):**
- Added: `hubTypeEnum`, `hubPrivacyEnum`, `hubMemberStatusEnum`, `productStatusEnum`, `productCategoryEnum`
- Renamed: `communityRoleEnum` → `hubRoleEnum`, `communityJoinPolicyEnum` → `hubJoinPolicyEnum`
- Removed 'guide' from `contentTypeEnum` and `likeTargetTypeEnum`
- Changed 'community' → 'hub' in `notificationTypeEnum`

**Server (`packages/server/src/`):**
- Created `hub.ts` replacing `community.ts` — all function names renamed (listHubs, getHubBySlug, createHub, etc.)
- Updated `types.ts` — all Community types renamed to Hub types, removed `guides` from UserProfile
- Updated `utils.ts` — `editCommunity` → `editHub` permission
- Updated `admin.ts` and `social.ts` — all table references updated
- Updated `content.ts` and `profile.ts` — removed 'guide' type references
- Updated `notification.ts` — 'community' → 'hub' notification type
- Updated `index.ts` — all exports renamed

**API routes (`apps/reference/server/api/`):**
- Renamed `communities/` → `hubs/` directory (19 files)
- All server function imports updated

**Frontend (`apps/reference/pages/`):**
- Renamed `communities/` → `hubs/` directory
- Updated all `/api/communities` → `/api/hubs` references across pages
- Updated layout navigation links

### Phase 1.2 — Product catalog schema

Created `packages/schema/src/product.ts`:
- `products` table: name, slug, description, hubId (FK), category, specs (jsonb), imageUrl, purchaseUrl, datasheetUrl, alternatives, pricing, status, createdById
- `contentProducts` join table: contentId, productId, quantity, role, notes, required, sortOrder (with unique index on contentId+productId)
- Relations: products → hub, createdBy, contentProducts; contentProducts → content, product

### Phase 1.3 — Schema hardening

- `users` table: added `pronouns`, `timezone`, `emailNotifications` (jsonb), `deletedAt`
- `contentItems` table: added `licenseType`, `series`, `estimatedMinutes`, `canonicalUrl`, `apObjectId`, `deletedAt`
- `files` table: added `originalName`, `contentId` (FK), `hubId` (FK), `width`, `height`
- Created `contentVersions` table: id, contentId, version, title, content, metadata, createdById, createdAt
- Added `contentVersionsRelations` and updated `contentItemsRelations`

### Phase 1.4 — Validators

Rewrote `validators.ts` with complete coverage:
- Hub: `createHubSchema`, `updateHubSchema`, `createReplySchema`, `createInviteSchema`, `banUserSchema`, `changeRoleSchema`
- Product: `createProductSchema`, `updateProductSchema`, `addContentProductSchema`
- Contest: `createContestSchema`, `updateContestSchema`, `judgeEntrySchema`, `contestTransitionSchema`
- Video: `createVideoSchema`, `createVideoCategorySchema`
- Learning: `createLearningPathSchema`, `updateLearningPathSchema`, `createModuleSchema`, `updateModuleSchema`, `createLessonSchema`, `updateLessonSchema`
- Messaging: `createConversationSchema`, `sendMessageSchema`
- Docs: `createDocsSiteSchema`, `updateDocsSiteSchema`, `createDocsPageSchema`, `updateDocsPageSchema`, `createDocsVersionSchema`
- Admin: `adminSettingSchema`, `adminUpdateRoleSchema`, `adminUpdateStatusSchema`, `resolveReportSchema`
- Removed 'guide' from all content type schemas

## Test Results

- All 27 Turborepo tasks pass
- Schema: 74 tests pass
- Server: 117 tests pass
- All other packages: unchanged, all pass
- Full build: 13 packages build successfully

## Decisions Made

- **Two-step migration**: Code renamed (Step A done), DB tables unchanged. Step B (ALTER TABLE) deferred.
- **DB column names preserved**: `communityId` stays as the Drizzle property name to match `community_id` DB column. Function parameters use `hubId`.
- **'guide' content type removed**: From enum, validators, server types, and tests. No mockup, no editor, no view existed for it.
- **Hub hierarchy**: `parentHubId` enables company → product hub relationships.

## Open Questions

- When to run Step B (DB rename migration)? After Phase 2-3 are stable.
- Should old `community.test.ts` be renamed to `hub.test.ts`? Yes, but low priority.

## Next Steps

- Phase 2: Server layer — product functions, follow system, file uploads, missing features
- Phase 3: API layer — new endpoints, validation sweep
- Phase 4: Frontend — match mockups, hub page variants
