# Session 007: Community System (Phase 7)

## What Was Done

### Pre-Implementation

- Created `docs/research/community-system.md` — prior art from Reddit, Discord, Discourse
- Created `docs/adr/018-community-architecture.md` — permission hierarchy, join flow, feed sorting, content sharing, moderation scoping

### Types (Step 1)

- Added 9 community type interfaces to `apps/reference/src/lib/types.ts`:
  - CommunityListItem, CommunityDetail, CommunityMemberItem, CommunityPostItem
  - CommunityReplyItem, CommunityFilters, CommunityPostFilters
  - CommunityInviteItem, CommunityBanItem

### Permission Helpers (Step 2)

- Created `apps/reference/src/lib/utils/community-permissions.ts` — pure functions:
  - `getRoleWeight`, `canManageRole`, `hasPermission`, `canJoin`
- Weight hierarchy: owner(4) > admin(3) > moderator(2) > member(1)
- Moderator gets: pinPost, lockPost, banUser (temp only enforced at server)
- 16 tests in `community-permissions.test.ts`

### Community Slug (Step 3)

- Added `ensureUniqueCommunitySlug` to `slug.ts`
- 3 new tests in `slug.test.ts` (collision, fallback, clean pass)

### Server Layer — Community CRUD (Step 4)

- Created `apps/reference/src/lib/server/community.ts` with 28 exported functions:
  - CRUD: listCommunities, getCommunityBySlug, createCommunity, updateCommunity, deleteCommunity
  - Membership: joinCommunity, leaveCommunity, getMember, listMembers, changeRole, kickMember
  - Posts: createPost, listPosts, deletePost, togglePinPost, toggleLockPost
  - Replies: createReply, listReplies, deleteReply
  - Bans: banUser, unbanUser, checkBan, listBans
  - Invites: createInvite, validateAndUseInvite, revokeInvite, listInvites
  - Sharing: shareContent, unshareContent, listShares

### Social Layer Fix (Step 8)

- Modified `toggleLike` in `social.ts` to branch denormalized count update:
  - `targetType === 'post'` → update `communityPosts.likeCount`
  - else → update `contentItems.likeCount`

### Routes (Steps 10-11)

- `/communities` — browse with filters, pagination
- `/communities/create` — form action, auth required
- `/communities/[slug]` — feed with join/leave/createPost/deletePost/pin/lock actions
- `/communities/[slug]/members` — member list
- `/communities/[slug]/settings` — admin panel with update/delete/changeRole/kick/ban/unban/invite
- `/api/communities/[slug]/posts/[postId]/replies` — GET/POST JSON API
- `/dashboard/communities` — user's community memberships

### Components (Step 12)

- Created 12 Svelte 5 components in `apps/reference/src/lib/components/community/`:
  - CommunityCard, CommunityHeader, PostCard, PostComposer
  - ReplyThread (recursive), MemberCard, RoleBadge, RoleSelector
  - BanForm, InviteLinkGenerator, CommunityNav, ShareDialog

### Nav Integration (Step 13)

- Added "Communities" link to `Nav.svelte`

## Tests

- 31 community service tests (CRUD, membership, posts, bans, invites, sharing)
- 16 permission helper tests
- 3 community slug tests
- **Total new: 50 tests** (reference app: 85, was 35)
- **Running total: 700 across all packages** (was ~586)

## Decisions Made

- Moderator gets `banUser` permission bit (temp-only restriction enforced in server function, not permission layer)
- Hard delete for communities (CASCADE), no status column
- Feed sorting: `ORDER BY is_pinned DESC, created_at DESC`
- Share creates both `communityShares` row and `communityPosts` row with type `share`
- Reply threading uses `communityPostReplies` table (not general `comments`)
- All community routes gated by `config.features.communities`
- All CSS uses `var(--*)` tokens, zero hardcoded colors

## Open Questions

- Should the invite token URL format be standardized? Currently `?invite={token}`
- Should we add pagination to member lists?
- Should community deletion require a confirmation token/phrase?

## Next Steps

- Phase 8: AP Group federation (deferred until local communities have real usage)
- Phase 5b: GSAP scroll animations (deferred)
