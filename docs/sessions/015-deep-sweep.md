# Session 015 — Deep Sweep Post-Hardening Audit

## Date: 2026-03-10

## What was done

Three parallel agents scanned the entire codebase for security gaps, missing test coverage, dead code, logic errors, and operational issues. Fixes implemented:

### P0 — CRITICAL

| ID | Issue | Fix | Files |
|----|-------|-----|-------|
| P0-1 | Rate limit tiers too coarse | Added `social` (30/min) and `federation` (60/min) tiers, lowered auth to 5/min | `rateLimit.ts` |
| P0-2 | 6 server modules untested | Added test files for admin, docs, learning, federation, search, oauthCodes | 6 new test files |
| P0-3 | Hardcoded auth secret fallback | Throws in production, allows dev fallback only in non-production | `hooks.server.ts` |
| P0-4 | Federation inbox accepts unsigned requests | Added HTTP Signature verification via `verifyHttpSignature()` to both inbox routes | `inbox/+server.ts` (×2), `keypairs.ts` |
| P0-5 | No admin user delete route | Added `deleteUser` form action with admin-only guard and confirmation | `admin/users/+page.server.ts` |

### P1 — HIGH

| ID | Issue | Fix | Files |
|----|-------|-----|-------|
| P1-1 | CSP allows `unsafe-inline` | Nonce-based CSP per request using `crypto.randomUUID()` | `security.ts` |
| P1-2 | Landing page missing security headers | Added `_headers` file with CSP, HSTS, X-Frame-Options | `apps/landing/static/_headers` |
| P1-3 | Docs edit missing authorization | Already handled by `edit/+layout.server.ts` `isOwner` check — **no fix needed** |
| P1-4 | Silent error suppression in federation | Shared inbox now returns proper 4xx/5xx on failure | `routes/inbox/+server.ts` |
| P1-5 | Missing pagination max limits | All list functions clamped to `Math.min(limit, 100)` | 7 server files |
| P1-6 | OAuth code validation not implemented | Added in-memory auth code store with single-use, TTL, client/redirect validation | `oauthCodes.ts`, authorize + token routes |

### P2 — MEDIUM

| ID | Issue | Fix | Files |
|----|-------|-----|-------|
| P2-1 | Orphaned contest tables | Added `@v2` JSDoc comments | `contest.ts` |
| P2-2 | SQL function case inconsistency | Changed lowercase `greatest()` to `GREATEST()` | `learning.ts` |
| P2-3 | Comment vs Reply terminology | Deferred — documentation-only, no code change needed |
| P2-4 | Feature flag gaps in routes | Already handled — all dashboard routes check feature flags — **no fix needed** |
| P2-5 | better-auth/zod v4 incompatibility | Pre-existing blocker — not addressed in this session |

## Test Results

- **Before**: 944 unit tests
- **After**: 1,006 unit tests (+62)
- **Typecheck**: 0 errors, 71 warnings (unchanged Svelte state refs)
- **All test files**: 15 passed in reference app (was 9)
- **Protocol tests**: 14 passed (was 13, +1 httpSignature)

### New test files:
- `apps/reference/src/lib/server/__tests__/admin.test.ts` (19 tests)
- `apps/reference/src/lib/server/__tests__/docs.test.ts` (9 tests)
- `apps/reference/src/lib/server/__tests__/learning.test.ts` (13 tests)
- `apps/reference/src/lib/server/__tests__/federation.test.ts` (5 tests)
- `apps/reference/src/lib/server/__tests__/search.test.ts` (2 tests)
- `apps/reference/src/lib/server/__tests__/oauthCodes.test.ts` (6 tests)
- `packages/protocol/src/__tests__/httpSignature.test.ts` (3 tests)

## Decisions

1. HTTP Signature verification passes through unsigned requests (for compatibility with servers that don't sign), but validates signatures when present
2. OAuth authorization codes stored in-memory with 10-minute TTL — production should use Redis/DB
3. Nonce-based CSP replaces `unsafe-inline` for scripts; styles still allow `unsafe-inline` when no nonce (dev mode)
4. Rate limit auth tier lowered from 10 to 5 req/min for stronger brute-force protection
5. All pagination limits clamped to max 100 uniformly

## Open Questions

1. Should HTTP Signature verification be mandatory (reject unsigned)? Currently permissive.
2. Should OAuth code store be moved to Redis before v1.0.0?
3. P2-5 (better-auth/zod v4) still blocks reference app build — needs resolution before v1.0.0 tag

## Next Steps

1. Fix P2-5 (better-auth/zod v4 compatibility)
2. Docker run verification
3. Lighthouse audit
4. Tag v1.0.0
