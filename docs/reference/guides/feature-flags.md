# Feature Flags

> All feature flags, what each controls, default values, and dependencies.

CommonPub uses feature flags (defined in `@commonpub/config`) to gate entire subsystems. Server middleware and API endpoints check flags via `useCommonPubConfig().features.*` before executing.

---

## Flag Reference

### `content` (default: `true`)

**Controls**: The entire content management system.

**Enables**:
- Content CRUD (create, update, delete, publish)
- Content routes: `/create`, `/[type]/[slug]`, `/[type]/[slug]/edit`
- Content listing and discovery
- Dashboard content management: `/dashboard`
- View count tracking, tag management, SEO metadata

**Dependencies**: Required by `social` (likes/comments target content), `hubs` (content sharing), `federation` (content federation).

---

### `social` (default: `true`)

**Controls**: Social interaction features.

**Enables**:
- Like/unlike: `POST /api/social/like`
- Comment CRUD: `GET/POST/DELETE /api/social/comments`
- Bookmark toggle: `POST /api/social/bookmark`
- Follow system: `follows` table
- Notification system: `notifications` table
- Report system: `reports` table

**Dependencies**: Requires `content` for content-targeted interactions.

---

### `hubs` (default: `true`)

**Controls**: Hub system — community, product, and company hubs (local-only in v1).

**Enables**:
- Hub CRUD and listing: `/hubs`, `/hubs/create`
- Hub detail: `/hubs/[slug]`
- Hub types: community, product, company
- Membership management: join, leave, roles
- Hub posts and replies
- Member moderation: kick, ban, unban
- Invite system (token-based)
- Content sharing to hubs
- Hub settings: `/hubs/[slug]/settings`
- Product catalog (company/product hubs)
- Hub gallery (projects using products)

**v1 Limitation**: Hubs are local-only. No AP Group support, no cross-instance hub interaction.

---

### `docs` (default: `true`)

**Controls**: Documentation site module.

**Enables**:
- Docs site CRUD
- Version management (create, set default, delete)
- Page management (create, edit, reorder, delete)
- Navigation tree editor
- Markdown rendering with CodeMirror editor
- Full-text search

---

### `video` (default: `true`)

**Controls**: Video content type.

**Enables**:
- `videos` and `videoCategories` tables
- Video embed support (YouTube, Vimeo, other)
- Video metadata (duration, thumbnail, view counts)
- Video hub page: `/videos`

---

### `contests` (default: `false`)

**Controls**: Contest/competition system.

**Enables**:
- `contests` and `contestEntries` tables
- Contest lifecycle: upcoming → active → judging → completed
- Entry submission (links content items to contests)
- Judge scoring and ranking
- Prize management

**Default off**: Contests are opt-in as most instances won't need them.

---

### `learning` (default: `true`)

**Controls**: Learning path engine.

**Enables**:
- Learning path CRUD: `/learn/create`, `/learn/[slug]/edit`
- Module and lesson management (with reordering)
- Enrollment and progress tracking
- Lesson completion tracking
- Certificate generation
- Learning path listing: `/learn`
- Lesson viewer: `/learn/[slug]/[lessonSlug]`

**Dependencies**: Works best with `explainers` enabled (explainers are a first-class lesson type).

---

### `explainers` (default: `true`)

**Controls**: Interactive explainer module system.

**Enables**:
- Explainer content type in `contentItems`
- Interactive section types: text, interactive, quiz, checkpoint
- Quiz engine with scoring
- Progress tracking

**Dependencies**: `learning` can use explainers as lesson types.

---

### `federation` (default: `false`)

**Controls**: ActivityPub federation protocol.

**Enables**:
- WebFinger discovery: `/.well-known/webfinger`
- NodeInfo: `/.well-known/nodeinfo`, `/nodeinfo/2.1`
- Actor profiles: `/users/[username]` (content-negotiated)
- Inbox/outbox: `/users/[username]/inbox`, `/users/[username]/outbox`
- Shared inbox: `/inbox`
- Follow lifecycle (Follow/Accept/Reject/Undo)
- OAuth2 SSO (Model B)
- Keypair generation per user
- Remote actor resolution and caching
- `remoteActors`, `activities`, `followRelationships`, `actorKeypairs` tables

**Default off**: Federation requires trusted instances and is not needed for single-instance deployments.

**v1 Limitation**: Inbound Create/Update/Delete/Like/Announce are logged but not processed (stubs). No remote content persistence.

---

### `admin` (default: `false`)

**Controls**: Admin panel and platform management.

**Enables**:
- Admin dashboard (platform stats)
- User management (list, role changes, status changes)
- Report moderation (review, resolve, dismiss)
- Audit logs
- Instance settings and theme customization

**Access**: Requires `user.role === 'admin'`.

---

## Flag Defaults Summary

| Flag | Default | Rationale |
|------|---------|-----------|
| `content` | `true` | Core feature, required by most other systems |
| `social` | `true` | Expected baseline for community sites |
| `hubs` | `true` | Primary use case for CommonPub |
| `docs` | `true` | Documentation is a core maker need |
| `video` | `true` | Low overhead, commonly needed |
| `contests` | `false` | Niche feature, opt-in |
| `learning` | `true` | Key differentiator for maker communities |
| `explainers` | `true` | Key differentiator, works with learning |
| `federation` | `false` | Requires infrastructure setup |
| `admin` | `false` | Only needed for multi-user instances |

## Flag Checking Pattern

Feature flags are checked in Nitro server routes via the config:

```typescript
// In a Nitro API route
export default defineEventHandler(async (event) => {
  const config = useCommonPubConfig();
  if (!config.features.hubs) {
    throw createError({ statusCode: 404, statusMessage: 'Hubs are disabled' });
  }
  // ... proceed with hub data loading
});
```

Server modules also check flags internally before federation hooks:

```typescript
// In packages/server/src/content.ts
export async function publishContent(db, contentId, config) {
  // ... publish logic ...
  if (config.features.federation) {
    await federateContent(db, contentId, config);
  }
}
```
