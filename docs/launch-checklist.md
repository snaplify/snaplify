# Launch Checklist — Snaplify v1

## Build & Tests

- [ ] `pnpm build` — all packages + apps compile
- [ ] `pnpm test` — ~924 unit tests green
- [ ] `cargo test` in `tools/create-snaplify/` — 17 tests green
- [ ] `pnpm exec playwright test` — E2E tests pass
- [ ] `pnpm audit --audit-level=high` — no high/critical vulnerabilities

## Search

- [ ] Meilisearch adapter works with mocked HTTP (unit tests pass)
- [ ] Postgres FTS fallback works when `MEILI_URL` is not set
- [ ] Search API endpoint returns results for valid queries

## Landing Page

- [ ] `apps/landing/` builds to static HTML with adapter-static
- [ ] All 3 routes render: `/`, `/features`, `/getting-started`
- [ ] OG meta tags present on all pages
- [ ] No hardcoded colors — all `var(--*)` with fallbacks
- [ ] axe-core a11y tests pass on all components

## Security

- [ ] Security headers present: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- [ ] Rate limiting triggers 429 on rapid auth requests
- [ ] Rate limit headers present: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
- [ ] CSP not applied in dev mode (HMR compatibility)

## Accessibility

- [ ] E2E a11y tests pass (axe-core on key pages)
- [ ] Color contrast verified across all 4 themes
- [ ] Keyboard navigation works on all interactive elements
- [ ] ARIA labels present on all interactive elements

## Performance

- [ ] Static assets get `Cache-Control: immutable` headers
- [ ] Lighthouse scores: Performance ≥90, Accessibility ≥95, SEO ≥95
- [ ] CodeMirror and TipTap lazy-loaded via dynamic imports

## CI/CD

- [ ] Matrix CI: Node 22/23, ubuntu/macos
- [ ] Rust CI: `cargo test` + `cargo clippy`
- [ ] E2E tests wired into CI (separate job)
- [ ] Dependency audit step in CI
- [ ] Docker build succeeds
- [ ] Deploy workflow triggers on release

## Documentation

- [ ] README.md — project overview, quick start, architecture
- [ ] CHANGELOG.md — all 12 phase summaries
- [ ] ADR 023 — Polish & Launch Architecture
- [ ] A11y audit document
- [ ] Session log at `docs/sessions/012-polish-launch.md`
- [ ] `docs/plan.md` updated with Phase 12 completion

## Feature Flags

- [ ] All features behind flags: content, social, communities, federation, docs, admin
- [ ] No new flags added in Phase 12 (infrastructure changes only)
- [ ] Landing page is separate app, not feature-flagged

## Infrastructure

- [ ] Docker multi-stage build works (node:22-alpine)
- [ ] Production compose starts all services
- [ ] Health checks on Postgres, Redis, Meilisearch
- [ ] `.env.example` includes all required variables
