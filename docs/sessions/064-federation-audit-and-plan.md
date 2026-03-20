# Session 064 — Federation Audit & Full Plan (2026-03-20)

## What Was Done

### Full Audit
- Read all 63 prior session logs, all ADRs, all reference docs, all research docs
- Read all archived sessions (001–020 from SvelteKit era)
- Read all archived restructure files (24 route handlers, extracted server modules)
- Read current schema, protocol, server, and reference app federation code
- Confirmed: nothing valuable was lost in the SvelteKit → Nuxt migration. All federation work preserved.

### Web Research (Extensive)
- W3C ActivityPub specification (S2S protocol)
- Fedify 2.0 documentation (dispatchers, inbox listeners, sendActivity, collections, h3 integration)
- Mastodon federation (Article support, toot: namespace, visibility, HTML sanitization)
- Lemmy federation (Group actor pattern, Announce wrapping, moderation activities — **direct model for hub federation**)
- PeerTube (CacheFile mirroring with strategies, origin-controlled access)
- BookWyrm (custom types with Article/Note fallback — **validates our graceful degradation approach**)
- Funkwhale (custom Artist/Album/Track types, access-controlled libraries)
- Misskey, Akkoma, GoToSocial (extension patterns, blocklist/allowlist)
- Manyfold (f3di namespace for 3D content, dual-activity strategy)
- Hollo (Fedify + Drizzle + PG reference app)
- FEPs: 1b12 (Groups, FINAL), 400e (appendable collections), 8b32 (integrity proofs), 044f (quotes), 5624 (reply control)
- HTTP Signatures (draft-cavage-12 vs RFC 9421, double-knocking)
- Content mirroring patterns, relay protocols, nomadic identity

### Files Created
1. **`docs/federation-plan.md`** (main deliverable) — 10-phase comprehensive federation plan with:
   - Vision statement and design principles
   - Current state assessment (what exists, what's missing)
   - 10 phases with full schema SQL, implementation details, API endpoints, tests
   - CommonPub namespace specification (`cpub:` with JSON-LD context)
   - Content type mappings (project, article, product, hub, learning path, docs)
   - Dependency graph and critical path
   - Risks and mitigations

2. **`docs/federation-notes.md`** — Research notes and decisions log:
   - 7 key decisions with rationale (Fedify 2.0, separate federated_content table, FEP-1b12 for hubs, namespace approach, per-hub keypairs, instance actor, PostgresMessageQueue)
   - 6 open questions with leanings
   - Archive findings (confirmed nothing lost)
   - Comparable projects and differentiation analysis
   - Implementation sequencing notes

3. **`docs/reference/fedify-research.md`** — Fedify 2.0 deep technical reference
4. **`docs/research/federation-content-mirroring.md`** — Content mirroring research
5. **`docs/research/federation-system.md`** — Updated AP federation research

### Files Updated
- **`docs/reference/guides/federation.md`** — Replaced F1–F8 roadmap section with pointer to new 10-phase plan. Kept v1 capabilities/limitations and FAQ.

## Key Decisions

1. **Fedify 2.0 for delivery** — Use `ctx.sendActivity()` instead of hand-rolling HTTP signing + delivery. Fedify handles double-knocking, fan-out, retry, shared inbox dedup.

2. **Separate `federated_content` table** — Remote content in its own table, not in `contentItems`. Different access patterns, no local author FK, cleaner separation.

3. **FEP-1b12 Announce pattern for hubs** — Follow Lemmy's battle-tested approach. Hub Group actor wraps all content in Announce and delivers to all followers. Hub is the authority.

4. **CommonPub namespace (`cpub:`)** — JSON-LD context extension for BOM, product specs, learning data, etc. Always include standard AS2 type for graceful degradation (BookWyrm pattern).

5. **PostgresMessageQueue** — Use Fedify's `@fedify/postgres` queue instead of Redis for delivery. One less dependency. Sufficient for CommonPub scale.

6. **Per-hub keypairs** — Hubs sign their own Announce activities. Independent of user keypairs. Survives ownership changes.

## What Makes This Unique

No fediverse software federates:
- Bills of materials (product ↔ project linking across instances)
- Products with specs, categories, purchase URLs
- Learning paths with enrollment
- Documentation sites with versioning
- Three types of communities (community, product, company) with type-aware behavior

CommonPub's BOM federation creates a **network effect** — when Instance A's project uses Instance B's product, both product galleries grow. This incentivizes federation in a way that status-update federation doesn't.

## Open Questions

1. Product hub actor type — Group vs Service vs Document collection?
2. Learning path progress across instances — local only vs federated?
3. Hub moderation default — auto-Announce vs queue for approval?
4. Undo(Announce) vs Announce(Delete) for post removal — send both?
5. Media proxying — proxy by default with cache eviction?
6. Should we support `audience` field (FEP-1b12) or only addressing (`to`/`cc`)?

## Next Steps

1. Phase 1 (Outbound Delivery) — integrate Fedify 2.0 `@fedify/h3` middleware, replace hand-rolled signing
2. Phase 2 (Inbound Persistence) — implement `federated_content` table and inbox handlers
3. Phase 5 (Namespace) — define `cpub:` JSON-LD context, update content mapper
4. Standing rule #5 remains — hubs local-only until Phase 6, gated behind `federation.hubs` flag
5. Standing rule #10 remains — no federation until two instances exist with real content
