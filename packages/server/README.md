# @commonpub/server

Framework-agnostic business logic for CommonPub.

## Overview

Consolidates all server-side business logic (content CRUD, social interactions, communities, learning, docs, federation, admin, audit) into a single package with no framework dependency. Server routes in `apps/reference` are thin wrappers that call into this package.

## Installation

```bash
pnpm add @commonpub/server
```

## Architecture

All functions accept explicit dependencies (database connection, config) rather than importing globals. This makes the logic testable and portable across frameworks.

```ts
import { createContent, getContentBySlug } from '@commonpub/server';

// Functions take (db, config, ...args) — no framework coupling
const content = await createContent(db, config, { title, type, authorId });
const published = await getContentBySlug(db, 'project', 'my-project');
```

## Modules

| Module | Purpose |
|--------|---------|
| `content` | Content CRUD, publishing, view counts, federation hooks |
| `social` | Likes, comments, bookmarks |
| `hub` | Hub CRUD (community/product/company), membership, posts, moderation, bans |
| `learning` | Paths, modules, lessons, enrollment, progress, certificates |
| `docs` | Sites, versions, pages, navigation, search |
| `federation` | Keypairs, actor resolution, follow management, content federation |
| `admin` | Platform stats, user management, reports, instance settings |
| `audit` | Audit log creation and listing |
| `security` | CSP builder, security headers |
| `rateLimit` | Sliding-window rate limiter with 5 tiers |
| `oauthCodes` | Authorization code store with TTL |

## Dependencies

- `@commonpub/schema` — Table definitions and validators
- `@commonpub/config` — Feature flags and instance config
- `@commonpub/auth` — Auth types and guards
- `@commonpub/protocol` — AP protocol types
- `@commonpub/docs` — Docs rendering pipeline
- `@commonpub/learning` — Learning path engine
- `drizzle-orm` — Database queries

## Development

```bash
pnpm build        # Compile TypeScript
pnpm test         # Run tests
pnpm typecheck    # Type-check without emitting
```
