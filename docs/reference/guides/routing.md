# Routing Reference

> All 68 routes organized by type: page loads, form actions, API endpoints, and federation endpoints.

---

## Page Loads (Read-Only)

| Route | Returns | Auth |
|-------|---------|------|
| `/` | Paginated published content | No |
| `/projects` | Published projects list | No |
| `/articles` | Published articles list | No |
| `/blog` | Published blog posts list | No |
| `/explainers` | Published explainers list | No |
| `/guides` | Published guides list | No |
| `/[type]/[slug]` | Content detail (increments viewCount) | No |
| `/learn` | Paginated learning paths | No |
| `/learn/[slug]` | Path with modules/lessons/enrollment | No |
| `/learn/[slug]/[lessonSlug]` | Lesson content + navigation | No |
| `/certificates/[code]` | Certificate verification (public) | No |
| `/communities` | Community list | No |
| `/communities/[slug]` | Community detail + posts | No |
| `/communities/[slug]/members` | Member list | No |
| `/docs/[siteSlug]/[...pagePath]` | Rendered docs page + nav + TOC | No |
| `/dashboard` | User's content (filterable) | Yes |
| `/dashboard/communities` | User's communities | Yes |
| `/dashboard/learning` | User's enrollments | Yes |
| `/dashboard/docs` | User's doc sites | Yes |
| `/dashboard/federation` | Federation activity log | Yes |
| `/dashboard/settings` | User settings | Yes |
| `/admin` | Platform stats | Admin |
| `/admin/users` | User management | Admin |
| `/admin/audit` | Audit logs | Admin |
| `/admin/reports` | Moderation reports | Admin |
| `/admin/settings/theme` | Instance theme settings | Admin |
| `/auth/sign-up` | Sign up form | No |
| `/auth/sign-in` | Sign in form | No |
| `/sitemap.xml` | XML sitemap | No |

---

## Form Actions

### Content

| Route | Action | Input | Auth | Side Effects |
|-------|--------|-------|------|-------------|
| `/create` | default | `createContentSchema` | Yes | Creates draft content |
| `/[type]/[slug]/edit` | default | `updateContentSchema` + optional `publish=true` | Yes (author) | Updates content, optionally publishes + federation |

### Explainers

| Route | Action | Input | Auth | Side Effects |
|-------|--------|-------|------|-------------|
| `/explainers/create` | default | `createContentSchema` (type: explainer) | Yes | Creates draft explainer |
| `/explainers/[slug]/edit` | default | `updateContentSchema` + sections | Yes (author) | Updates explainer |

### Learning Paths

| Route | Action | Input | Auth | Side Effects |
|-------|--------|-------|------|-------------|
| `/learn/create` | default | `createLearningPathSchema` | Yes | Creates draft path |
| `/learn/[slug]/edit` | `updatePath` | `updateLearningPathSchema` | Yes (author) | Updates path metadata |
| | `publish` | — | Yes (author) | Sets status to published |
| | `addModule` | `{title, description?}` | Yes (author) | Creates module |
| | `updateModule` | `{moduleId, title, description?}` | Yes (author) | Updates module |
| | `deleteModule` | `{moduleId}` | Yes (author) | Deletes module + lessons |
| | `reorderModules` | `{orderedIds: string[]}` | Yes (author) | Updates sortOrder |
| | `addLesson` | `createLessonSchema` | Yes (author) | Creates lesson |
| | `updateLesson` | `{lessonId, ...updateLessonSchema}` | Yes (author) | Updates lesson |
| | `deleteLesson` | `{lessonId}` | Yes (author) | Deletes lesson |
| | `reorderLessons` | `{moduleId, orderedIds: string[]}` | Yes (author) | Updates sortOrder |

### Documentation

| Route | Action | Input | Auth | Side Effects |
|-------|--------|-------|------|-------------|
| `/docs/create` | default | `createDocsSiteSchema` | Yes | Creates site + v1.0.0 version |
| `/docs/[siteSlug]/edit` | `update` | `updateDocsSiteSchema` | Yes (owner) | Updates site |
| | `delete` | — | Yes (owner) | Deletes site |
| | `createPage` | `createDocsPageSchema` | Yes (owner) | Creates page |
| `/docs/[siteSlug]/edit/[pageId]` | `save` | `{title, slug, content}` | Yes (owner) | Updates page |
| | `delete` | — | Yes (owner) | Deletes page |
| `/docs/[siteSlug]/edit/nav` | default | `{structure: NavItem[]}` | Yes (owner) | Updates nav tree |
| `/docs/[siteSlug]/edit/versions` | `create` | `{version, copyFrom?}` | Yes (owner) | Creates version, optionally copies pages |
| | `setDefault` | `{versionId}` | Yes (owner) | Sets default version |
| | `delete` | `{versionId}` | Yes (owner) | Deletes version + pages |

### Communities

| Route | Action | Input | Auth | Side Effects |
|-------|--------|-------|------|-------------|
| `/communities/create` | default | `createCommunitySchema` | Yes | Creates community, user becomes owner |
| `/communities/[slug]/settings` | `update` | `{name?, description?, rules?, joinPolicy?}` | Yes (admin+) | Updates community |
| | `delete` | — | Yes (owner) | Deletes community |
| | `changeRole` | `{userId, role}` | Yes (admin+) | Changes member role |
| | `kick` | `{userId}` | Yes (mod+) | Removes member |
| | `ban` | `{userId, reason?, expiresAt?}` | Yes (mod+) | Bans user |
| | `unban` | `{banId}` | Yes (mod+) | Removes ban |
| | `createInvite` | `{maxUses?, expiresAt?}` | Yes (admin+) | Creates invite token |
| | `revokeInvite` | `{inviteId}` | Yes (admin+) | Revokes invite |

### Admin

| Route | Action | Input | Auth | Side Effects |
|-------|--------|-------|------|-------------|
| `/admin/settings/theme` | `setTheme` | `{themeId}` | Admin | Sets instance theme |
| | `setTokenOverrides` | `{overrides: Record}` | Admin | Sets CSS token overrides |
| `/dashboard/settings` | `setTheme` | `{themeId}` | Yes | Sets user theme preference |
| `/dashboard` | `delete` | `{contentId}` | Yes (author) | Soft-deletes content |

---

## API Endpoints

### Auth & OAuth2

| Route | Method | Body / Params | Response | Auth |
|-------|--------|---------------|----------|------|
| `/api/auth/oauth2/authorize` | GET | `?client_id&redirect_uri&response_type&scope&state` | Redirect | Yes |
| `/api/auth/oauth2/token` | POST | `{grant_type, code, client_id, client_secret, redirect_uri}` | `{access_token, token_type, user}` | No |
| `/api/auth/oauth2/callback` | GET | `?code&state` | Redirect | No |
| `/auth/federated` | POST | `{instanceDomain}` | Redirect | No |

### Social

| Route | Method | Body / Params | Response | Auth |
|-------|--------|---------------|----------|------|
| `/api/social/like` | POST | `{targetType, targetId}` | `{liked: boolean, likeCount: number}` | Yes |
| `/api/social/bookmark` | POST | `{targetType, targetId}` | `{bookmarked: boolean}` | Yes |
| `/api/social/comments` | GET | `?targetType&targetId` | `{comments: CommentItem[]}` | No |
| `/api/social/comments` | POST | `{targetType, targetId, content, parentId?}` | `CommentItem` | Yes |
| `/api/social/comments` | DELETE | `?id` | `{success: boolean}` | Yes |

### Communities

| Route | Method | Body / Params | Response | Auth |
|-------|--------|---------------|----------|------|
| `/api/communities/[slug]/posts/[postId]/replies` | GET | — | `{replies: CommunityReplyItem[]}` | No |
| `/api/communities/[slug]/posts/[postId]/replies` | POST | `{content, parentId?}` | `CommunityReplyItem` | Yes |

### Federation

| Route | Method | Body / Params | Response | Auth |
|-------|--------|---------------|----------|------|
| `/api/federation/follow` | POST | `{remoteActorUri}` | `{id: string}` | Yes |
| `/api/federation/follow/[id]` | DELETE | — | `{success: boolean}` | Yes |
| `/api/federation/follow/[id]/accept` | POST | — | `{success: boolean}` | Yes |
| `/api/federation/follow/[id]/reject` | POST | — | `{success: boolean}` | Yes |

### Docs

| Route | Method | Body / Params | Response | Auth |
|-------|--------|---------------|----------|------|
| `/api/docs/pages` | POST | `createDocsPageSchema` | `DocsPage` | Yes |
| `/api/docs/pages` | PUT | `{pageId, ...updateDocsPageSchema}` | `DocsPage` | Yes |
| `/api/docs/pages` | DELETE | `{pageId}` | `{success: boolean}` | Yes |
| `/api/docs/nav` | PUT | `{versionId, structure}` | `{success: boolean}` | Yes |
| `/api/docs/versions` | POST | `{siteId, version, copyFrom?}` | `DocsVersion` | Yes |
| `/api/docs/versions` | PUT | `{versionId, isDefault}` | `DocsVersion` | Yes |
| `/api/docs/versions` | DELETE | `{versionId}` | `{success: boolean}` | Yes |
| `/api/docs/search` | GET | `?q&siteSlug` | `{results: SearchResult[]}` | No |

### Explainers

| Route | Method | Body / Params | Response | Auth |
|-------|--------|---------------|----------|------|
| `/api/explainers/[slug]/export` | GET | — | HTML file download | Yes (author) |

---

## Federation Endpoints

| Endpoint | Method | Content-Type | Purpose |
|----------|--------|-------------|---------|
| `/.well-known/webfinger` | GET | `application/jrd+json` | WebFinger discovery |
| `/.well-known/nodeinfo` | GET | `application/json` | NodeInfo discovery |
| `/nodeinfo/2.1` | GET | `application/json` | NodeInfo 2.1 document |
| `/users/[username]` | GET | `application/activity+json` | Actor profile |
| `/users/[username]/followers` | GET | `application/activity+json` | Followers collection |
| `/users/[username]/following` | GET | `application/activity+json` | Following collection |
| `/users/[username]/outbox` | GET | `application/activity+json` | Outbox (paginated) |
| `/users/[username]/inbox` | POST | `application/activity+json` | Per-user inbox |
| `/inbox` | POST | `application/activity+json` | Shared inbox |
