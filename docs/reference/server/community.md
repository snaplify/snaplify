# Community Server Module

> 30+ functions for community CRUD, membership, posts, replies, moderation, invites, and content sharing. Communities are local-only in v1.

**Source**: `apps/reference/src/lib/server/community.ts`

---

## Exports

| Category | Functions |
|----------|-----------|
| CRUD | `listCommunities`, `getCommunityBySlug`, `createCommunity`, `updateCommunity`, `deleteCommunity` |
| Membership | `joinCommunity`, `leaveCommunity`, `getMember`, `listMembers`, `changeRole`, `kickMember` |
| Posts | `createPost`, `listPosts`, `deletePost`, `togglePinPost`, `toggleLockPost` |
| Replies | `createReply`, `listReplies`, `deleteReply` |
| Moderation | `banUser`, `unbanUser`, `checkBan`, `listBans` |
| Invites | `createInvite`, `validateAndUseInvite`, `revokeInvite`, `listInvites` |
| Content Sharing | `shareContent`, `unshareContent`, `listShares` |

All functions are async and accept `db: DB` as their first parameter.

---

## API Reference

### CRUD

#### `listCommunities(db, filters?)`

List communities with optional filtering.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `filters` | `object?` | Optional filters |
| `filters.name` | `string?` | Search by name (ILIKE) |
| `filters.joinPolicy` | `string?` | Filter by join policy |

**Returns**: `{ items: CommunityListItem[], total: number }`

---

#### `getCommunityBySlug(db, slug)`

Fetch a single community by its URL slug.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `slug` | `string` | Community URL slug |

**Returns**: `CommunityDetail | null`

---

#### `createCommunity(db, createdById, input)`

Create a new community. A URL slug is auto-generated from the community name. The creating user automatically becomes the community owner.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `createdById` | `string` | User ID of the creator |
| `input` | `object` | Community creation payload (name, description, joinPolicy, etc.) |

**Returns**: `CommunityDetail`

---

#### `updateCommunity(db, communityId, userId, input)`

Update community details. Performs a permission check to ensure the requesting user has sufficient privileges.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `communityId` | `string` | Community ID |
| `userId` | `string` | Requesting user ID |
| `input` | `object` | Fields to update |

**Returns**: `CommunityDetail | null`

---

#### `deleteCommunity(db, communityId, userId)`

Delete a community. Restricted to the community owner.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `communityId` | `string` | Community ID |
| `userId` | `string` | Requesting user ID (must be owner) |

**Returns**: `boolean`

---

### Membership

#### `joinCommunity(db, communityId, userId)`

Join a community. Behavior depends on the community's `joinPolicy`:

- **open** -- User is added immediately.
- **approval** -- A pending membership request is created.
- **invite** -- Rejected unless the user holds a valid invite.

Throws if the user is banned.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `communityId` | `string` | Community ID |
| `userId` | `string` | User ID |

**Returns**: `void`

---

#### `leaveCommunity(db, communityId, userId)`

Leave a community. Decrements the community's `memberCount`.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `communityId` | `string` | Community ID |
| `userId` | `string` | User ID |

**Returns**: `void`

---

#### `getMember(db, communityId, userId)`

Look up a single membership record.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `communityId` | `string` | Community ID |
| `userId` | `string` | User ID |

**Returns**: `member | null`

---

#### `listMembers(db, communityId)`

List all members of a community.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `communityId` | `string` | Community ID |

**Returns**: `CommunityMemberItem[]`

---

#### `changeRole(db, communityId, userId, targetUserId, newRole)`

Change a member's role. Enforces the role hierarchy: owner > admin > moderator > member. A user can only assign roles below their own.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `communityId` | `string` | Community ID |
| `userId` | `string` | Requesting user ID |
| `targetUserId` | `string` | User whose role is being changed |
| `newRole` | `string` | New role to assign |

**Returns**: `void`

---

#### `kickMember(db, communityId, userId, targetUserId)`

Remove a member from the community. Enforces the same role hierarchy as `changeRole`.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `communityId` | `string` | Community ID |
| `userId` | `string` | Requesting user ID |
| `targetUserId` | `string` | User to remove |

**Returns**: `void`

---

### Posts

#### `createPost(db, communityId, authorId, input)`

Create a new post in a community. Increments the community's `postCount`.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `communityId` | `string` | Community ID |
| `authorId` | `string` | Author user ID |
| `input` | `object` | Post payload (title, body, etc.) |

**Returns**: `CommunityPostItem`

---

#### `listPosts(db, communityId, filters?)`

List posts in a community with optional filtering.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `communityId` | `string` | Community ID |
| `filters` | `object?` | Optional filters |

**Returns**: `{ items: CommunityPostItem[], total: number }`

---

#### `deletePost(db, postId, userId)`

Delete a post. Permitted for the post author or any user with moderator role or above.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `postId` | `string` | Post ID |
| `userId` | `string` | Requesting user ID |

**Returns**: `boolean`

---

#### `togglePinPost(db, postId, userId)`

Toggle the pinned state of a post. Restricted to moderator role or above.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `postId` | `string` | Post ID |
| `userId` | `string` | Requesting user ID |

**Returns**: `boolean`

---

#### `toggleLockPost(db, postId, userId)`

Toggle the locked state of a post (prevents new replies). Restricted to moderator role or above.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `postId` | `string` | Post ID |
| `userId` | `string` | Requesting user ID |

**Returns**: `boolean`

---

### Replies

#### `createReply(db, postId, authorId, input)`

Create a reply on a post. Increments the post's `replyCount`.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `postId` | `string` | Post ID |
| `authorId` | `string` | Author user ID |
| `input` | `object` | Reply payload (body, parentId for threading) |

**Returns**: `CommunityReplyItem`

---

#### `listReplies(db, postId)`

List all replies on a post. Replies are threaded via `parentId`.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `postId` | `string` | Post ID |

**Returns**: `CommunityReplyItem[]`

---

#### `deleteReply(db, replyId, userId)`

Delete a reply. Permitted for the reply author or moderator+.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `replyId` | `string` | Reply ID |
| `userId` | `string` | Requesting user ID |

**Returns**: `boolean`

---

### Moderation

#### `banUser(db, communityId, userId, targetUserId, reason?, expiresAt?)`

Ban a user from a community. Removes their membership and creates a ban record.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `communityId` | `string` | Community ID |
| `userId` | `string` | Requesting user ID (moderator+) |
| `targetUserId` | `string` | User to ban |
| `reason` | `string?` | Optional ban reason |
| `expiresAt` | `Date?` | Optional expiry (permanent if omitted) |

**Returns**: `void`

---

#### `unbanUser(db, communityId, banId)`

Remove a ban record, allowing the user to rejoin.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `communityId` | `string` | Community ID |
| `banId` | `string` | Ban record ID |

**Returns**: `void`

---

#### `checkBan(db, communityId, userId)`

Check whether a user is currently banned from a community.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `communityId` | `string` | Community ID |
| `userId` | `string` | User ID to check |

**Returns**: `ban | null`

---

#### `listBans(db, communityId)`

List all active bans for a community.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `communityId` | `string` | Community ID |

**Returns**: `CommunityBanItem[]`

---

### Invites

#### `createInvite(db, communityId, createdById, maxUses?, expiresAt?)`

Create an invite link for a community.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `communityId` | `string` | Community ID |
| `createdById` | `string` | User creating the invite |
| `maxUses` | `number?` | Maximum number of uses (unlimited if omitted) |
| `expiresAt` | `Date?` | Optional expiry |

**Returns**: `CommunityInviteItem`

---

#### `validateAndUseInvite(db, token)`

Validate an invite token and increment its use count. Returns `null` if the invite is expired or has reached its maximum uses.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `token` | `string` | Invite token |

**Returns**: `invite | null`

---

#### `revokeInvite(db, inviteId)`

Revoke an invite, making it permanently unusable.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `inviteId` | `string` | Invite ID |

**Returns**: `void`

---

#### `listInvites(db, communityId)`

List all invites for a community.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `communityId` | `string` | Community ID |

**Returns**: `CommunityInviteItem[]`

---

### Content Sharing

#### `shareContent(db, communityId, contentId, sharedById)`

Share an existing content item into a community.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `communityId` | `string` | Community ID |
| `contentId` | `string` | Content item ID to share |
| `sharedById` | `string` | User sharing the content |

**Returns**: `void`

---

#### `unshareContent(db, communityId, contentId)`

Remove a shared content item from a community.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `communityId` | `string` | Community ID |
| `contentId` | `string` | Content item ID to unshare |

**Returns**: `void`

---

#### `listShares(db, communityId)`

List all content items shared into a community.

| Param | Type | Description |
|-------|------|-------------|
| `db` | `DB` | Database connection |
| `communityId` | `string` | Community ID |

**Returns**: Shared content items
