# Community System — Prior Art Research

## Platforms Studied

### Reddit

- **Structure**: Subreddits with moderator hierarchy (owner/admin/mod tiers)
- **Join policies**: Public (open), restricted (approval to post), private (invite only)
- **Feed sorting**: Hot (time-decayed engagement), New, Top (time-windowed), Rising
- **Moderation**: Post/comment removal, user bans (temp + permanent), automod rules
- **Content sharing**: Crosspost creates a reference post in the target community

### Discord

- **Structure**: Servers with role-based permissions (cascading hierarchy)
- **Join policies**: Invite link with optional expiry and max uses
- **Moderation**: Kick, ban (with optional reason), timeout (temp mute)
- **Roles**: Custom roles with granular permission bits, position-based hierarchy

### Discourse

- **Structure**: Categories with sub-categories, topic-based discussions
- **Join policies**: Open, approval, invite (admin generates invite links)
- **Trust levels**: Automatic promotion based on engagement (read time, posts, flagging)
- **Moderation**: Flag-based (community flags → moderator review), topic locking/pinning

## Key Patterns Extracted

### Permission Hierarchy

All three platforms use **weight-based role hierarchies** — higher role weight can manage lower roles, but not equal or higher. Reddit's moderator seniority (join order) adds a second dimension we skip for v1.

### Join Flow

- **Open**: No barrier, instant membership
- **Approval/Invite**: Token-gated entry. Discord and Discourse both use invite links with optional expiry + max uses. Reddit's "restricted" model allows viewing but not posting — we simplify to full gating.

### Feed Sorting

- Hot-sort algorithms (Reddit's Wilson score, HN's time-decay) require engagement data over time. For a new community system, **newest-first with pinned posts** is sufficient and avoids cold-start problems.
- Pinned posts always appear first (max 2-5 per community).

### Moderation

- **Bans**: Temporary (expires) vs permanent. Moderators can only issue temporary bans in most systems; permanent bans require admin.
- **Post actions**: Pin (sticky), lock (no new replies), remove (soft delete or hide).
- **Transparency**: Ban reasons stored but only visible to staff.

### Content Sharing

Reddit's crosspost model (reference to original content with community context) maps well to our `communityShares` + share-type post model.

## v1 Scope Decisions

1. **No hot-sort** — newest-first with pinned posts is sufficient
2. **No automod** — manual moderation only
3. **No trust levels** — explicit role assignment
4. **No community search** — Postgres queries sufficient for v1
5. **No polls UI** — schema supports it, UI deferred
6. **No notifications** — hook points only, no notification rows
7. **Communities local-only** — no AP Group federation
