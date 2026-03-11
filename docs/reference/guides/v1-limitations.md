# v1 Limitations

> Known blockers, deferred features, federation stubs, and honest status as of Session 015.

---

## Active Blocker

### better-auth/zod v4 Compatibility

`better-auth@1.5.4` uses Zod v4's `.meta()` method, which is not available in Zod v3. This causes the reference app build to fail.

**Impact**: Reference app cannot be built for production.
**Fix needed**: Upgrade to Zod v4 across the monorepo, or pin `better-auth` to a compatible version.
**Workaround**: None — this blocks Docker builds and deployment.

---

## Federation Limitations

### Outbound Activity Delivery (Not Implemented)

Activities are logged to the `activities` table with status `'pending'` but are **never actually delivered** to remote inboxes. The HTTP POST to remote inbox endpoints with signed requests is not implemented.

### Inbound Content Processing (Stubs Only)

Inbound Create, Update, Delete, Like, and Announce activities are handled by stub callbacks that **log only** — they do not persist remote content locally. This means:

- You cannot see content from people you follow in your feed
- Remote likes are not counted on local content
- Remote shares/boosts have no effect

### HTTP Signature Signing (Not Implemented)

`verifyHttpSignature()` exists for inbound verification, but outbound requests are **not signed**. Most AP implementations will reject unsigned requests.

### Communities Are Local-Only

No AP Group support. Communities exist only on the instance that creates them. Users on other instances cannot discover, join, or interact with remote communities.

### No Remote Content Persistence

The `remoteActors` table caches actor profiles (24h TTL), but there is no equivalent for remote content. Received articles, notes, and likes are logged as activities but not stored as first-class content.

### OAuth2 Authorization Codes Are In-Memory

The `oauthCodes.ts` module uses an in-memory `Map` for authorization codes. In a multi-process deployment, codes stored in one process cannot be consumed by another. Production should use Redis or a database table.

---

## Deferred Features

### Phase 5b — GSAP Animations

Interactive explainer sections were designed to support GSAP-powered animations tied to interactive controls (sliders, toggles). The animation system is deferred:

- Section types and registry are complete
- Interactive controls work
- Visual feedback via GSAP is not implemented
- Explainers work without animations (static rendering only)

### Phase 9b — mermaid-isomorphic

Documentation sites were planned to support Mermaid diagram rendering during the markdown pipeline:

- Markdown rendering pipeline is complete
- Code blocks with `language: 'mermaid'` are rendered as plain code
- Server-side Mermaid SVG rendering is not implemented
- Client-side Mermaid.js could be added as a progressive enhancement

---

## TypeScript Warnings

**0 type errors, 71 warnings** (all benign).

The 71 warnings are Svelte state reactivity warnings (`$state` rune references in component files). These do not affect functionality or type safety. They are an artifact of Svelte 5's strict reactivity analysis and can be suppressed with `// @ts-expect-error` if needed, but this is not recommended.

---

## Lint Status

**0 lint errors** as of Session 015.

---

## Test Coverage

| Category | Count | Status |
|----------|-------|--------|
| Unit tests | 1,006 | Passing |
| Rust CLI tests | 17 | Passing |
| E2E tests | 18 | Passing |
| **Total** | **1,041** | **All passing** |

---

## Performance (Not Yet Measured)

Lighthouse scores require a running instance, which is blocked by the better-auth/zod issue. Target scores:

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

---

## Infrastructure Dependencies

| Service | Required | Purpose |
|---------|----------|---------|
| PostgreSQL 16 | Yes | Primary data store |
| Node.js 22+ | Yes | Runtime |
| Redis / Valkey | Optional | Rate limiting store, session cache (falls back to in-memory) |
| Meilisearch | Optional | Full-text search (falls back to Postgres FTS) |

---

## What's Needed Before v1.0.0 Tag

1. Fix better-auth/zod v4 compatibility blocker
2. Run Docker compose successfully
3. Run Lighthouse audit on deployed instance
4. Verify all launch checklist items at `docs/launch-checklist.md`
5. Tag v1.0.0
