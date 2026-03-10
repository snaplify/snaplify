# ADR 018: Community Architecture

## Status
Accepted

## Context
Phase 7 adds the community system to the reference app. The DB schema (7 tables) and Zod validators are locked. This ADR documents the architectural decisions for the server layer, permission model, join flows, feed sorting, and content sharing.

## Decisions

### Permission Hierarchy
Weight-based: `owner (4) > admin (3) > moderator (2) > member (1)`.

An actor must have **strictly higher** weight to manage a target. This prevents moderators from de-modding each other and admins from removing other admins.

| Role | Edit Community | Manage Members | Pin/Lock Posts | Ban Users | Delete Community |
|------|---------------|----------------|----------------|-----------|-----------------|
| owner | Yes | All below | Yes | Yes | Yes |
| admin | Yes | mod + member | Yes | Yes | No |
| moderator | No | No | Yes | Temp only | No |
| member | No | No | No | No | No |

Implemented as pure functions in `community-permissions.ts` — no DB dependency.

### Join Flow
- **open**: Instant insert into `communityMembers` with role `member`
- **approval/invite**: Requires a valid invite token. Admin creates tokens with optional expiry and max uses. No pending membership table — token gating is sufficient.

### Feed Sorting
`ORDER BY is_pinned DESC, created_at DESC`. No hot-sort algorithm in v1 — newest-first avoids cold-start problems.

### Content Sharing
"Share to Community" creates:
1. A `communityShares` row linking content to community
2. A `communityPosts` row with `type: 'share'` and content JSON `{ contentId, title, slug, type }`

This allows share posts to appear in the feed alongside regular posts.

### Post Replies
Uses `communityPostReplies` table (NOT the general `comments` table). Threaded via `parentId` self-reference. Reply count is denormalized on the post.

### Community Deletion
Hard delete — schema has no `status` column on communities. CASCADE removes all members, posts, bans, invites, shares. Owner only.

### Post Likes
The existing `toggleLike` in `social.ts` is modified to branch the denormalized count update: `targetType === 'post'` updates `communityPosts.likeCount`, everything else updates `contentItems.likeCount`.

### Slug Generation
Same `generateSlug` utility, with a new `ensureUniqueCommunitySlug` that checks the `communities` table (following the `ensureUniquePathSlug` pattern).

### Feature Flag
All community routes check `locals.config.features.communities`. When disabled, routes return 404.

### Notifications
Hook points exported (e.g., after join, after post, after ban) but no notification rows created. Deferred to Phase 8+.

## Consequences
- Pure permission functions enable thorough unit testing without DB mocks
- Weight-based hierarchy is simple and predictable
- Token-gated joins avoid a "pending members" table
- Newest-first feed is trivially indexed (`created_at DESC`)
- Content sharing creates two rows but keeps the feed model uniform
