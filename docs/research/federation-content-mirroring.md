# Federation Content Mirroring Research

> Researched 2026-03-20. Covers 14 areas of ActivityPub federation relevant to CommonPub's content types (articles, products, hubs, learning paths, explainers, docs, profiles, comments).

---

## 1. How Lemmy Federates Communities

### Architecture

Lemmy maps its entities to AP types:
- Communities = `Group` actors (automated bots)
- Users = `Person` actors
- Posts = `Page` objects
- Comments = `Note` objects

### Content Sync Flow

1. **Discovery**: A user on Instance B searches for a community on Instance A. Instance B fetches the community's `Group` actor via WebFinger + HTTP GET.
2. **Subscribe**: Instance B sends a `Follow` activity to the community's inbox. The community auto-responds with `Accept/Follow` and adds Instance B to its followers collection.
3. **Content delivery**: When a user creates a post, they send `Create/Page` to the community inbox. The community wraps it in `Announce` and sends to ALL followers' inboxes.
4. **Lazy fetch**: When fetching a community, the 20 most recent posts are fetched (no comments or votes). Comments are fetched on-demand when a post is opened — all parent comments, the post, authors, and the community are resolved recursively.
5. **Local storage**: Each instance stores a full local copy of received content in its own database. Posts contain both rendered HTML (`content`) and markdown source (`source`).

### Moderation Across Instances

- Moderators are listed in the community's `attributedTo` collection (an `OrderedCollection` of actor URIs).
- Mod changes use `Add`/`Remove` activities targeting the moderators collection.
- Mod actions (`Remove`, `Block`, `Update/Group`, lock, pin) are wrapped in `Announce` by the community and sent to all followers.
- Followers MUST verify that mod activities come from actors listed in `attributedTo`.
- Instance admins can also send mod actions (accepted if from the community's home server).
- **Key limitation**: Instance admin removals on REMOTE communities only apply locally. They cannot propagate to other instances.

### Activity Types

```
User -> Community:
  Follow, Undo/Follow
  Create/Page, Update/Page       (posts)
  Create/Note, Update/Note       (comments)
  Like, Dislike, Undo/Like, Undo/Dislike
  Delete (own content), Undo/Delete
  Flag (report)

Community -> Followers:
  Accept/Follow
  Announce/{any of above}        (redistribution)
  Remove (mod action)
  Block/Undo/Block (user ban)
  Add/Remove (moderator changes)
  Update/Group (metadata change)
```

### Concrete Takeaway for CommonPub

CommonPub Hubs should be `Group` actors. The Announce-wrapping pattern is the standard. Content is stored locally on every subscribing instance. The `audience` property (from FEP-1b12) should be set on all objects to indicate which Hub they belong to:

```json
{
  "type": "Page",
  "id": "https://instance-b.example/p/1",
  "attributedTo": "https://instance-b.example/users/alice",
  "audience": "https://instance-a.example/hubs/edge-ai-builders"
}
```

---

## 2. Representing Complex Structured Content in ActivityPub

### The Extension Strategy

ActivityPub uses JSON-LD, which allows mixing vocabularies. The proven approach:

1. **Use multiple `@context` entries** with AS2 last (so it wins on conflicts):
```json
{
  "@context": [
    "https://schema.org",
    {"cpub": "https://commonpub.org/ns#"},
    "https://www.w3.org/ns/activitystreams"
  ]
}
```

2. **Use multiple types** for backward compatibility:
```json
{
  "type": ["cpub:Product", "Document"],
  "name": "Arduino Nano 33 BLE",
  "cpub:specs": {...},
  "cpub:version": "3.0"
}
```

The `Document` fallback type ensures other AP servers at least recognize it as an object, even if they can't render product-specific fields.

3. **Use `attachment` for structured sub-data** that other servers can display:
```json
{
  "type": ["cpub:Product", "Document"],
  "name": "Arduino Nano 33 BLE",
  "content": "<p>A compact board with BLE...</p>",
  "attachment": [
    {"type": "Image", "url": "https://...", "name": "Product photo"},
    {"type": "Document", "url": "https://.../datasheet.pdf", "name": "Datasheet", "mediaType": "application/pdf"}
  ]
}
```

### Mapping CommonPub Content Types to AP

| CommonPub Type | AP Type(s) | Fallback | Notes |
|---|---|---|---|
| Article | `Article` | Native AP | Direct mapping, well-supported |
| Product | `["cpub:Product", "Document"]` | `Document` | Custom namespace for specs, version, BOM |
| Hub (community) | `Group` | Native AP | FEP-1b12 compliant |
| Hub (product) | `["cpub:ProductHub", "Group"]` | `Group` | Product-focused group |
| Hub (company) | `["cpub:Organization", "Group"]` | `Group` | Organization group |
| Learning Path | `["cpub:LearningPath", "OrderedCollection"]` | `OrderedCollection` | Steps as ordered items |
| Explainer | `["cpub:Explainer", "Document"]` | `Document` | Interactive content, static fallback |
| Docs | `Article` | Native AP | Standard long-form |
| Comment | `Note` | Native AP | Standard, uses `inReplyTo` |
| User Profile | `Person` | Native AP | Standard actor |

### Product Representation

```json
{
  "@context": [
    {"cpub": "https://commonpub.org/ns#"},
    "https://www.w3.org/ns/activitystreams"
  ],
  "type": ["cpub:Product", "Document"],
  "id": "https://maker.example/products/arduino-nano-33-ble",
  "name": "Arduino Nano 33 BLE",
  "content": "<p>Compact board for IoT projects with Bluetooth Low Energy...</p>",
  "attributedTo": "https://maker.example/hubs/arduino",
  "audience": "https://maker.example/hubs/arduino",
  "cpub:category": "microcontroller",
  "cpub:specs": {
    "processor": "nRF52840",
    "flash": "1MB",
    "ram": "256KB",
    "connectivity": ["BLE 5.0"]
  },
  "cpub:purchaseLinks": [
    {"name": "Arduino Store", "url": "https://store.arduino.cc/..."}
  ],
  "cpub:version": "3.0",
  "attachment": [
    {"type": "Image", "url": "https://maker.example/img/nano33.jpg", "name": "Product photo"},
    {"type": "Document", "url": "https://maker.example/docs/nano33-datasheet.pdf", "mediaType": "application/pdf", "name": "Datasheet"}
  ]
}
```

### Learning Path Representation

```json
{
  "@context": [
    {"cpub": "https://commonpub.org/ns#"},
    "https://www.w3.org/ns/activitystreams"
  ],
  "type": ["cpub:LearningPath", "OrderedCollection"],
  "id": "https://maker.example/learning/intro-to-fpga",
  "name": "Introduction to FPGA Design",
  "summary": "Learn FPGA development from scratch",
  "attributedTo": "https://maker.example/users/alice",
  "totalItems": 5,
  "orderedItems": [
    {
      "type": "cpub:LearningStep",
      "name": "What is an FPGA?",
      "cpub:contentRef": "https://maker.example/articles/what-is-fpga",
      "cpub:stepNumber": 1,
      "cpub:estimatedMinutes": 15
    },
    {
      "type": "cpub:LearningStep",
      "name": "Your First Verilog Module",
      "cpub:contentRef": "https://maker.example/explainers/first-verilog",
      "cpub:stepNumber": 2,
      "cpub:estimatedMinutes": 30
    }
  ]
}
```

**Progress tracking is NOT federated.** Progress is user-specific local state. Each instance tracks its own users' progress. This is analogous to how Lemmy does not federate read/unread state.

### FEP-0837: Federated Marketplace

Worth noting: FEP-0837 defines a federated marketplace using ActivityPub + Valueflows vocabulary. It uses:
- `Proposal` objects with `purpose: "offer" | "request"`
- `Agreement` objects with `stipulates` / `stipulatesReciprocal` commitments
- `Create`, `Update`, `Delete` activities for managing proposals
- `Offer(Agreement)` for negotiation

This is more relevant if CommonPub ever adds buying/selling. For now, products are informational, not transactional.

---

## 3. FEP-1b12 (Group Federation) and Related FEPs

### FEP-1b12: Group Federation (FINAL status)

Core specification for how Lemmy, Friendica, Hubzilla, Lotide, and PeerTube implement federated groups. Key points already covered in section 1. Critical additions:

- **`audience` property**: The standard way to indicate group membership. MUST be set on all objects and activities belonging to a group. Avoids the inefficient loop-and-resolve approach of checking `to`/`attributedTo`.
- **Announce wrapping**: Groups MUST preserve the original activity exactly as received (no modification), enabling verification with Object Integrity Proofs (FEP-8b32).
- **Validation**: Groups MAY reject content (respond with `Reject`), require follower-only posting, or require manual mod approval.

### FEP-8b32: Object Integrity Proofs (FINAL status)

Decouples authentication from transport. Adds `DataIntegrityProof` to activities/objects:
- Algorithm: EdDSA with JCS (JSON Canonicalization Scheme) via `jcs-eddsa-2022` cryptosuite
- Enables: activity relaying without re-signing, embedded signed objects in Announce, client-side signing, nomadic identity
- Fedify (CommonPub's chosen framework) implements this

### FEP-1d80: Feed Actor

Proposed by PieFed. A `Feed` actor type for grouping multiple `Group` actors (e.g., a "curated feed" of communities). Relevant if CommonPub wants to expose a company hub that aggregates its child product hubs as a single federated entity.

### FEP-400e: Publicly-Appendable Collections

Alternative to Group-based forums. Not compatible with FEP-1b12 approach. Skip for CommonPub.

### Other Relevant FEPs

- **FEP-7888/f228**: `as:context` as a grouping mechanism for threads/conversations
- **FEP-8c13**: Context-Authority Routing with Object Integrity Proofs for restricted threads
- **FEP-eb22**: Advertising supported AP types via NodeInfo (so instances know what content types a server supports)

### Recommendation for CommonPub

Implement FEP-1b12 as the foundation for Hub federation. Add FEP-8b32 Object Integrity Proofs via Fedify. Use FEP-eb22 to advertise CommonPub-specific types in NodeInfo so other instances can know what they support.

---

## 4. PeerTube Content Mirroring (Redundancy System)

### How It Works

PeerTube implements a "video redundancy" system that is the closest existing model to full content mirroring:

1. **Strategy selection**: Admin configures which videos to cache: `most-views`, `trending`, or `recently-added`. Each strategy has independent `size` limits and `min_lifetime` settings.
2. **Video import**: When a video is selected for redundancy, PeerTube imports ALL resolution files using magnet URI / HLS playlist URL into `storage.redundancy/` directory.
3. **Federation notification**: Sends a `Create -> CacheFile` AP activity to federated instances. The `CacheFile` is a PeerTube-specific AP extension.
4. **WebSeed injection**: Instances that receive the `CacheFile` message add the redundancy server as a WebSeed in the torrent/HLS manifest, so clients can download segments from multiple sources.
5. **Cache eviction**: Videos stay cached for at least `min_lifetime`, then evicted when storage is full.

### Consent Controls

The origin server controls who can mirror via `remote_redundancy.videos.accept_from`:
- `nobody`: No mirroring allowed
- `followings`: Only instances the origin follows
- `anybody`: Open mirroring

### What CommonPub Should Adopt

PeerTube's model maps well to CommonPub's needs:

```
PeerTube                    CommonPub Equivalent
─────────                   ──────────────────
Video files                 Article HTML, product images/datasheets, explainer assets
CacheFile activity          cpub:CacheFile or cpub:Mirror activity
Redundancy strategies       "mirror popular", "mirror followed hubs", "mirror all from trusted"
Storage.redundancy dir      Separate storage bucket for mirrored content
accept_from config          Hub-level and instance-level mirror policies
```

### Proposed CommonPub Mirror Activity

```json
{
  "@context": [
    {"cpub": "https://commonpub.org/ns#"},
    "https://www.w3.org/ns/activitystreams"
  ],
  "type": "Create",
  "actor": "https://mirror.example/actor",
  "object": {
    "type": "cpub:Mirror",
    "cpub:originalObject": "https://origin.example/articles/fpga-guide",
    "cpub:cachedResources": [
      {"url": "https://mirror.example/cache/fpga-guide.html", "mediaType": "text/html"},
      {"url": "https://mirror.example/cache/fpga-guide-cover.jpg", "mediaType": "image/jpeg"}
    ],
    "cpub:mirroredAt": "2026-03-20T12:00:00Z",
    "cpub:expiresAt": "2026-04-20T12:00:00Z"
  }
}
```

---

## 5. Full Mirroring vs. Reference Federation

### Three Levels of Federation

| Level | Description | Data on remote instance | Use case |
|---|---|---|---|
| **Reference** | Store AP ID + minimal metadata | ID, name, author URI, timestamps | Mastodon-style microblogging |
| **Metadata sync** | Store structured metadata locally | All fields except media files | Lemmy communities, search/browse |
| **Full mirror** | Store everything including media | All fields + cached media files | PeerTube redundancy, offline access |

### What CommonPub Should Use Per Content Type

| Content Type | Federation Level | Rationale |
|---|---|---|
| Articles | **Metadata sync** (HTML content stored locally, images hotlinked or optionally cached) | Articles are the primary content; full text needed for search and rendering |
| Products | **Metadata sync** (specs stored locally, images hotlinked) | Products need local search; images can be fetched on demand |
| Hubs | **Metadata sync** (hub metadata, member count, moderator list) | Need local rendering of hub pages |
| Learning Paths | **Reference** initially, **metadata sync** for subscribed paths | Only sync paths that local users are enrolled in |
| Explainers | **Reference** (link to origin for interactive content) | Interactive content is too complex to mirror; provide static fallback |
| Docs | **Metadata sync** for subscribed doc sets | Version-controlled; sync specific versions |
| Comments | **Metadata sync** (full text stored locally) | Same as Lemmy; need local display |
| Profiles | **Reference** with avatar cache | Fetch full profile on demand |
| Media files | **Optional full mirror** (configurable per instance) | Admin chooses based on storage budget |

### Implementation Architecture

```
┌─────────────────────────────────────────────────┐
│                 Instance A (Origin)              │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Articles │  │ Products │  │ Hubs (Group) │   │
│  └─────┬────┘  └─────┬────┘  └──────┬───────┘   │
│        │             │               │           │
│        └─────────────┴───────────────┘           │
│                      │                           │
│              Outbox / Announce                   │
└──────────────────────┬───────────────────────────┘
                       │ ActivityPub S2S
                       ▼
┌──────────────────────────────────────────────────┐
│              Instance B (Subscriber)             │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │           Inbox Processor                │    │
│  │  1. Verify HTTP signature                │    │
│  │  2. Verify Object Integrity Proof        │    │
│  │  3. Check federation policy              │    │
│  │  4. Route to content handler             │    │
│  └─────────────────┬────────────────────────┘    │
│                    │                             │
│  ┌─────────────────▼────────────────────────┐    │
│  │         Content Storage Layer            │    │
│  │                                          │    │
│  │  remote_content table:                   │    │
│  │  - ap_id (canonical URI)                 │    │
│  │  - ap_type                               │    │
│  │  - content_json (full AP object)         │    │
│  │  - local_cache (processed/rendered)      │    │
│  │  - origin_instance                       │    │
│  │  - fetched_at                            │    │
│  │  - last_refreshed_at                     │    │
│  │  - mirror_level (ref/meta/full)          │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │        Media Cache (optional)            │    │
│  │  - Proxied/cached images                 │    │
│  │  - LRU eviction                          │    │
│  │  - Size budget per instance              │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

---

## 6. Media/Attachment Handling in Federation

### Standard Approach

Media is referenced via URL in `attachment` arrays. The AP spec does not define how to handle media uploads or caching — it is out of scope.

### How Mastodon Handles It

1. **On receive**: Downloads remote media attachments, validates size (1MB default limit for response bodies) and type, stores locally.
2. **Proxying**: `MediaProxyController` serves cached remote media through the local instance, preventing direct hotlinking to origin.
3. **Blurhash**: Generates `blurhash` strings for image previews before full download.
4. **Focal points**: `focalPoint` property `[x, y]` (range -1.0 to 1.0) for smart cropping.
5. **Cleanup**: Remote media cache is periodically pruned.

### Recommended Approach for CommonPub

```typescript
// Media handling pipeline for federated content
interface MediaCacheConfig {
  enabled: boolean;
  maxSizePerFile: number;       // e.g., 10MB
  maxTotalCache: number;        // e.g., 5GB
  allowedMediaTypes: string[];  // ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  evictionStrategy: 'lru' | 'fifo' | 'size-weighted-lru';
  proxyRemoteMedia: boolean;    // serve through local proxy vs hotlink
}

// On receiving a Create activity with attachments:
async function processRemoteAttachments(
  attachments: APAttachment[],
  config: MediaCacheConfig
): Promise<LocalAttachment[]> {
  return Promise.all(attachments.map(async (att) => {
    if (!config.allowedMediaTypes.includes(att.mediaType ?? '')) {
      return { ...att, cached: false, localUrl: att.url };
    }

    if (config.proxyRemoteMedia) {
      // Download, validate, store locally
      const localPath = await downloadAndCache(att.url, config.maxSizePerFile);
      return { ...att, cached: true, localUrl: localPath };
    }

    return { ...att, cached: false, localUrl: att.url };
  }));
}
```

### Product-Specific Media

Products have structured media (photos, datasheets, 3D models). Federate as typed attachments:

```json
"attachment": [
  {"type": "Image", "url": "...", "name": "Front view", "cpub:role": "product-photo"},
  {"type": "Image", "url": "...", "name": "Pinout diagram", "cpub:role": "pinout"},
  {"type": "Document", "url": "...", "mediaType": "application/pdf", "name": "Datasheet", "cpub:role": "datasheet"},
  {"type": "Document", "url": "...", "mediaType": "model/step", "name": "3D Model", "cpub:role": "3d-model"}
]
```

---

## 7. Content Updates and Deletions Across Instances

### The Protocol

- **Update**: Send `Update` activity with the full updated object. Recipients replace their cached copy.
- **Delete**: Send `Delete` activity with a `Tombstone` object or the object's ID. Recipients remove the local copy.
- **Undo**: Reverses a previous activity (Like, Follow, etc.).

### Real-World Problems

1. **No guaranteed delivery**: If a server is down when `Delete` is sent, the content persists there forever. There is no retry-until-confirmed mechanism in the spec.
2. **Mastodon silent rejection**: Mastodon ignores `Update` activities unless the `updated` timestamp has changed. Always set `updated` on modified objects.
3. **Tombstones**: After deletion, serve a `Tombstone` at the object's URI so late-fetching instances know it was deleted:
```json
{
  "type": "Tombstone",
  "id": "https://maker.example/articles/old-post",
  "formerType": "Article",
  "deleted": "2026-03-20T12:00:00Z"
}
```
4. **Delete is advisory**: Remote instances MAY ignore delete requests. There is no enforcement mechanism. This is a fundamental property of federation.

### Recommended Implementation for CommonPub

```typescript
// Track delivery status per remote instance
interface DeliveryRecord {
  activityId: string;
  targetInbox: string;
  status: 'pending' | 'delivered' | 'failed' | 'retrying';
  attempts: number;
  lastAttempt: Date;
  nextRetry: Date | null;
}

// Retry strategy: exponential backoff, max 7 days
const RETRY_SCHEDULE = [
  30_000,      // 30 seconds
  300_000,     // 5 minutes
  3_600_000,   // 1 hour
  21_600_000,  // 6 hours
  86_400_000,  // 1 day
  604_800_000, // 7 days (give up after this)
];

// For updates, always include both content and source
function buildUpdateActivity(article: Article): APUpdate {
  return {
    '@context': AP_CONTEXT,
    type: 'Update',
    id: `https://${domain}/activities/update/${uuid()}`,
    actor: article.authorUri,
    object: {
      ...contentToArticle(article),
      updated: new Date().toISOString(), // CRITICAL: Mastodon requires this
      'cpub:source': {
        mediaType: 'text/markdown',
        content: article.markdownSource
      }
    },
    to: [AP_PUBLIC],
    cc: [article.audienceUri + '/followers']
  };
}
```

### Version History for Products/Docs

Products and docs have versioned content. Federation should include version metadata:

```json
{
  "type": "Update",
  "object": {
    "type": ["cpub:Product", "Document"],
    "id": "https://maker.example/products/nano-33",
    "updated": "2026-03-20T12:00:00Z",
    "cpub:version": "3.1",
    "cpub:changelog": "Added BLE 5.1 support specs",
    "cpub:previousVersion": "https://maker.example/products/nano-33/v/3.0"
  }
}
```

---

## 8. Selective Federation

### Existing Implementations

**GoToSocial** (most mature implementation):
- **Blocklist mode** (default): Federate with everyone except explicitly blocked domains.
- **Allowlist mode** (experimental): Federate ONLY with explicitly allowed domains.
- Domain allows override domain blocks in blocklist mode.
- Domain blocks override allows in allowlist mode.

**Lemmy**:
- `allowed_instances`: Allowlist (if non-empty, only these instances can federate)
- `blocked_instances`: Blocklist (these instances are rejected)
- Mutually exclusive: only one can be active.

### CommonPub Selective Federation Design

```typescript
// commonpub.config.ts
export interface FederationPolicy {
  // Instance-level controls
  mode: 'open' | 'blocklist' | 'allowlist';
  blockedDomains: string[];
  allowedDomains: string[];

  // Content-type-level controls (CommonPub-specific)
  contentPolicies: {
    articles: 'federate' | 'local-only';
    products: 'federate' | 'local-only';
    hubs: 'federate' | 'local-only';
    learningPaths: 'federate' | 'local-only';
    explainers: 'federate' | 'local-only';
    docs: 'federate' | 'local-only';
  };

  // Hub-level controls (per-hub override)
  hubOverrides: Record<string, {
    federationEnabled: boolean;
    allowedInstances?: string[];  // null = follow instance policy
    mirrorPolicy: 'nobody' | 'followers' | 'anybody';
  }>;

  // Inbound controls
  inbound: {
    requireHTTPSignatures: boolean;      // Mastodon's AUTHORIZED_FETCH
    requireIntegrityProofs: boolean;     // FEP-8b32
    maxInboxRequestsPerMinute: number;
    maxMediaDownloadSize: number;
  };
}
```

### Per-Hub Federation Control

This is unique to CommonPub. Hub admins should control federation independently:

```sql
-- Hub federation settings
ALTER TABLE hubs ADD COLUMN federation_enabled BOOLEAN DEFAULT true;
ALTER TABLE hubs ADD COLUMN federation_mode TEXT DEFAULT 'open'; -- open, followers, approved
ALTER TABLE hubs ADD COLUMN mirror_policy TEXT DEFAULT 'followers'; -- nobody, followers, anybody
```

When a remote instance tries to follow a Hub:
- `open`: Auto-accept, immediate content delivery
- `followers`: Auto-accept, content delivery starts
- `approved`: Hold follow request, moderator must approve

---

## 9. The Relay Pattern

### How It Works

A relay is an ActivityPub actor (usually type `Application` or `Service`) that:
1. Accepts `Follow` activities from instances
2. Receives all public activities from subscribing instances
3. Re-broadcasts (`Announce`) those activities to all other subscribers

### Architecture

```
Instance A ──┐
Instance B ──┤── Follow ──▶ Relay Actor ──── Announce ──▶ All subscribers
Instance C ──┘
```

### Existing Implementations

- **Activity-Relay** (Go): Customizable, supports domain filtering
- **pub-relay** (Crystal): Simple re-broadcast of everything received

### CommonPub Relay Design

For CommonPub, a relay could serve a specific purpose: **content-type-aware relay**.

```json
{
  "type": "Service",
  "id": "https://relay.commonpub.org/actor",
  "name": "CommonPub Maker Content Relay",
  "preferredUsername": "relay",
  "inbox": "https://relay.commonpub.org/inbox",
  "outbox": "https://relay.commonpub.org/outbox",
  "cpub:supportedTypes": ["Article", "cpub:Product", "cpub:LearningPath"],
  "cpub:relayPolicy": {
    "contentTypes": ["Article", "cpub:Product"],
    "minQuality": 0,
    "requireModeration": false
  }
}
```

### Topic-Based Relays

Rather than relaying everything, CommonPub could implement topic/tag-based relays:

```typescript
// Relay only forwards content matching subscribed topics
interface RelaySubscription {
  instanceDomain: string;
  subscribedTopics: string[];     // e.g., ['fpga', 'embedded', 'iot']
  subscribedHubTypes: string[];   // e.g., ['community', 'product']
  maxItemsPerDay: number;
}

// On receiving content at relay:
async function handleRelayInbox(activity: APActivity): Promise<void> {
  const tags = extractTags(activity);
  const contentType = extractContentType(activity);

  // Find subscribers interested in this content
  const interestedSubscribers = subscribers.filter(sub => {
    const topicMatch = sub.subscribedTopics.some(t => tags.includes(t));
    const typeMatch = sub.subscribedHubTypes.includes(contentType);
    return topicMatch || typeMatch;
  });

  // Announce to interested parties only
  for (const sub of interestedSubscribers) {
    await deliverAnnounce(activity, sub.instanceDomain);
  }
}
```

---

## 10. Schema Evolution in Federated Protocols

### The JSON-LD Approach

ActivityPub's JSON-LD foundation provides built-in extensibility:

1. **Namespaced properties**: Unknown properties in a known namespace are ignored by consumers that don't understand them. This is forward-compatible by default.
2. **Context versioning**: CommonPub should version its context:
```json
{
  "@context": [
    {"cpub": "https://commonpub.org/ns/v1#"},
    "https://www.w3.org/ns/activitystreams"
  ]
}
```

3. **NodeInfo advertisement** (FEP-eb22): Advertise supported types so peers know what you handle:
```json
{
  "version": "2.1",
  "software": {"name": "commonpub", "version": "1.2.0"},
  "metadata": {
    "cpub:supportedTypes": ["Article", "cpub:Product", "cpub:LearningPath"],
    "cpub:schemaVersion": "1",
    "cpub:features": ["products", "learningPaths", "hubs"]
  }
}
```

### Evolution Strategy

```
v1: Article, Note, Group (basics)
v2: Add cpub:Product, cpub:LearningPath (new types, old instances see Document/OrderedCollection)
v3: Add cpub:Explainer with new fields (old instances see Document)
```

Rules:
- **Never remove properties** from existing types — only add
- **Always include a fallback AS2 type** so old consumers have something to work with
- **Use `cpub:schemaVersion` in NodeInfo** so peers can negotiate
- **Fetch remote context on first contact** with a new instance to discover its capabilities

### Practical Concern

Most AP implementations do NOT fully process JSON-LD. They treat it as "JSON with a context blob." This means:
- Keep your custom properties simple (flat strings, numbers, arrays)
- Don't rely on JSON-LD expansion/compaction working correctly on remote servers
- Test against Mastodon, Lemmy, and PeerTube — if they don't choke on your objects, you're fine

---

## 11. Privacy and Consent in Federation

### Fundamental Problem

Once content is federated, the origin instance loses control. Remote instances can:
- Store content indefinitely (ignoring Delete)
- Index and search content
- Apply different privacy policies
- Expose content to different jurisdictions

### Existing Approaches

- **Mastodon Authorized Fetch**: Requires HTTP signatures on GET requests. Blocked instances can't even read public profiles. Enable via `AUTHORIZED_FETCH=true`.
- **Post visibility levels**: `public`, `unlisted`, `followers-only`, `direct` (encoded via `to`/`cc` fields).
- **No E2E encryption**: Private messages are readable by instance admins on both ends.

### CommonPub Privacy Design

```typescript
// Content-level federation consent
interface ContentFederationPolicy {
  // Set by content author
  visibility: 'public' | 'hub-only' | 'followers-only' | 'local-only';

  // Set by hub moderator
  hubFederationPolicy: 'open' | 'approved-instances' | 'local-only';

  // Computed federation behavior
  // public: full federation via to: [AP_PUBLIC]
  // hub-only: federate only to hub followers via to: [hubFollowersUri]
  // followers-only: federate only to author's followers
  // local-only: never leaves this instance (no AP activity created)
}

// Map to AP addressing
function resolveAddressing(policy: ContentFederationPolicy): { to: string[], cc: string[] } {
  switch (policy.visibility) {
    case 'public':
      return { to: [AP_PUBLIC], cc: [followersUri] };
    case 'hub-only':
      return { to: [hubUri], cc: [hubFollowersUri] };
    case 'followers-only':
      return { to: [followersUri], cc: [] };
    case 'local-only':
      throw new Error('local-only content should not be federated');
  }
}
```

### GDPR Considerations

- **Right to deletion**: Send `Delete` to all known recipients. Log delivery status. If a remote instance is unreachable, retry for 30 days, then log the failure.
- **Data export**: Users can export all their content (local + metadata of federated copies).
- **Instance privacy policy in actor metadata**: Include link to privacy policy in the instance actor.

---

## 12. Nomadic Identity (Hubzilla/Zot Protocol)

### How Zot Works

1. **Channels**: A user identity is called a "channel." Channels have a globally unique identifier not tied to DNS.
2. **Clones**: A channel can be cloned to multiple hubs. All clones are kept synchronized.
3. **Magic Auth**: Single sign-on across hubs using a cookie-based token. When visiting a remote hub, the remote server queries the user's home server in the background to verify identity.
4. **Failover**: If the primary hub goes down, clones continue operating. The identity persists.
5. **Data sync**: Content, permissions, connections, and settings are synchronized across all clones.

### ActivityPub Nomadic Identity Efforts

FEP-8b32 (Object Integrity Proofs) is a prerequisite for nomadic identity in ActivityPub, because it lets signed objects be verified independent of which server delivers them.

The core challenge: In standard AP, identity = server. `https://instance.example/users/alice` is inseparable from `instance.example`. Nomadic identity requires decoupling identity from hostname.

### Approaches Being Explored

1. **DID-based identity**: Use Decentralized Identifiers as the canonical identity, with AP actor URIs as aliases.
2. **`alsoKnownAs`**: Already used by Mastodon for account migration. Could be extended for multi-homing.
3. **FEP-8b32 + portable keys**: If the user's signing key is the identity anchor (not the hostname), content signed by that key is valid regardless of which instance delivers it.

### Relevance to CommonPub

CommonPub's CLAUDE.md says "AP actor SSO = Model B" (shared actor URIs) and "shared auth DB = Model C (operator opt-in only)." For v1, skip nomadic identity. Plan for it by:

1. **Generate per-user Ed25519 keypairs** (not per-instance RSA keys).
2. **Store keypairs in a portable format** that could be exported.
3. **Support `alsoKnownAs`** on actor profiles for future migration.
4. **Sign objects with FEP-8b32 proofs** using the user's key, not the instance key.

---

## 13. Federated Search

### Current State

There is no standard for federated search in ActivityPub. Current approaches:

1. **Local-only search**: Each instance searches its own database. Lemmy uses `ILIKE %query%` on Postgres. CommonPub will use Meilisearch (primary) or Postgres FTS (fallback).

2. **URI-based discovery**: Searching `@user@instance.example` or a full URI triggers a WebFinger/HTTP fetch to pull in the remote object.

3. **Hashtag federation**: Tags are opt-in discovery mechanisms. Instances that follow a relay or specific tags receive content matching those tags.

### Proposed Approaches (No Standard Yet)

- **Standardized `/search` GET endpoint**: Accept free text or structured queries, return matching local objects.
- **Distributed hash table (DHT)**: Hash2Pub project explored DHT-based hashtag search. Never reached production.
- **Crawling search engines**: A dedicated search service crawls AP instances (with consent) and indexes content. SearXNG has some fediverse integration.
- **NGI Search grant**: Mastodon received EU funding to build discovery mechanisms for AP, but results are still nascent.

### CommonPub Search Architecture

```
┌──────────────────────────────────────────────┐
│            CommonPub Instance                │
│                                              │
│  ┌────────────┐     ┌─────────────────────┐  │
│  │ Meilisearch│◄────│ Local content        │  │
│  │            │     │ + Federated content  │  │
│  │ Indexes:   │     │   (metadata sync'd) │  │
│  │ - articles │     └─────────────────────┘  │
│  │ - products │                              │
│  │ - hubs     │     ┌─────────────────────┐  │
│  │ - users    │     │ Search API          │  │
│  │ - remote_* │◄────│ /api/search?q=...   │  │
│  └────────────┘     │ /api/search?q=...   │  │
│                     │   &scope=local       │  │
│                     │   &scope=federated   │  │
│                     │   &scope=remote      │  │
│                     └──────────┬──────────┘  │
│                                │              │
│  scope=remote triggers:        │              │
│  WebFinger/HTTP fetch ─────────┘              │
└──────────────────────────────────────────────┘
```

Three search scopes:
- **local**: Only content created on this instance (Meilisearch query)
- **federated**: Local + all synced remote content (Meilisearch query on combined index)
- **remote**: Direct fetch of a specific URI or WebFinger lookup

### Indexing Federated Content

When content arrives via federation (inbox), add it to Meilisearch:

```typescript
async function indexFederatedContent(object: APObject): Promise<void> {
  const doc = {
    id: object.id,          // AP URI as the document ID
    type: object.type,
    title: 'name' in object ? object.name : undefined,
    content: stripHtml(object.content),
    author: object.attributedTo,
    origin: new URL(object.id).hostname,
    indexed_at: Date.now(),
    tags: extractTags(object),
    hub: 'audience' in object ? object.audience : undefined,
  };

  await meilisearch.index('federated_content').addDocuments([doc]);
}
```

---

## 14. Rate Limiting and Abuse Prevention

### AP Spec Guidance

The spec recommends (but does not mandate):
- Ratelimit client API submissions (prevent DoS)
- Ratelimit federated inbox delivery (prevent relay attacks)
- Filter incoming content through spam filters
- Use exponential backoff for outbound delivery

### Mastodon's Implementation

1. **HTTP Signature verification**: All incoming activities must be signed. Unsigned requests rejected.
2. **Authorized Fetch mode**: Require signatures even on GET requests.
3. **Circuit breakers** (Stoplight pattern): Stop trying to reach unresponsive servers. Prevent wasting resources on dead instances.
4. **Domain blocks**: Admin-level blocking of entire instances.
5. **Private network blocking**: Reject requests to local/private IP addresses (SSRF prevention).
6. **Response size limits**: 1MB default limit on HTTP response bodies.
7. **Recursion limits**: Cap depth when resolving reply chains or remote references.
8. **Delivery queues**: Sidekiq + Redis with exponential backoff retries.

### CommonPub Rate Limiting Design

```typescript
// Rate limiting configuration
interface FederationRateLimits {
  // Inbound
  inboxRequestsPerMinutePerInstance: number;   // e.g., 300
  inboxRequestsPerMinuteGlobal: number;        // e.g., 3000
  maxObjectSizeBytes: number;                   // e.g., 1_000_000 (1MB)
  maxAttachmentsPerObject: number;              // e.g., 20
  maxRecursionDepth: number;                    // e.g., 40 (for reply chains)

  // Outbound
  deliveryWorkersCount: number;                 // e.g., 10
  maxRetriesPerDelivery: number;                // e.g., 6
  deliveryTimeoutMs: number;                    // e.g., 30_000

  // Circuit breaker
  circuitBreakerThreshold: number;              // failures before opening, e.g., 5
  circuitBreakerResetMs: number;                // time before retrying, e.g., 3_600_000
}

// Circuit breaker per remote instance
class InstanceCircuitBreaker {
  private failures: Map<string, { count: number; lastFailure: Date }> = new Map();

  isOpen(domain: string): boolean {
    const record = this.failures.get(domain);
    if (!record) return false;
    if (record.count < this.threshold) return false;

    const elapsed = Date.now() - record.lastFailure.getTime();
    if (elapsed > this.resetMs) {
      this.failures.delete(domain);
      return false; // half-open: allow one attempt
    }
    return true; // circuit open: reject
  }

  recordFailure(domain: string): void {
    const record = this.failures.get(domain) ?? { count: 0, lastFailure: new Date() };
    record.count++;
    record.lastFailure = new Date();
    this.failures.set(domain, record);
  }

  recordSuccess(domain: string): void {
    this.failures.delete(domain);
  }
}
```

### Spam Prevention

```typescript
// Content validation pipeline for inbound federated content
async function validateInboundContent(
  activity: APActivity,
  senderDomain: string
): Promise<{ allowed: boolean; reason?: string }> {
  // 1. Domain check
  if (blockedDomains.has(senderDomain)) {
    return { allowed: false, reason: 'domain_blocked' };
  }

  // 2. Actor check (user-level blocks)
  if (blockedActors.has(activity.actor)) {
    return { allowed: false, reason: 'actor_blocked' };
  }

  // 3. Rate limit check
  if (rateLimiter.isExceeded(senderDomain)) {
    return { allowed: false, reason: 'rate_limited' };
  }

  // 4. Content size check
  const size = JSON.stringify(activity).length;
  if (size > config.maxObjectSizeBytes) {
    return { allowed: false, reason: 'too_large' };
  }

  // 5. Recursion depth check (for reply chains)
  if ('inReplyTo' in activity.object) {
    const depth = await measureReplyDepth(activity.object.inReplyTo);
    if (depth > config.maxRecursionDepth) {
      return { allowed: false, reason: 'recursion_too_deep' };
    }
  }

  // 6. Content-type specific validation
  if (!isSupportedContentType(activity)) {
    return { allowed: false, reason: 'unsupported_type' };
  }

  return { allowed: true };
}
```

### SSRF Prevention

```typescript
// Validate that outbound/fetch URLs don't target private networks
function isPublicUrl(url: string): boolean {
  const parsed = new URL(url);
  const hostname = parsed.hostname;

  // Block private/reserved ranges
  const blocked = [
    /^127\./,            // loopback
    /^10\./,             // private
    /^172\.(1[6-9]|2\d|3[01])\./,  // private
    /^192\.168\./,       // private
    /^0\./,              // current network
    /^169\.254\./,       // link-local
    /^fc00:/i,           // IPv6 ULA
    /^fe80:/i,           // IPv6 link-local
    /^::1$/,             // IPv6 loopback
    /^localhost$/i,
  ];

  return !blocked.some(pattern => pattern.test(hostname));
}
```

---

## Summary: Implementation Priority for CommonPub

### Phase 1 (Pre-federation, current)
- [x] WebFinger, NodeInfo (done)
- [x] Basic AP types: Article, Note (done)
- [x] Inbox router (done)
- [ ] HTTP Signature signing/verification (keypairs.ts exists but needs integration)
- [ ] Actor resolver with caching
- [ ] Delivery queue with Redis/Valkey

### Phase 2 (Basic federation)
- [ ] Hub as Group actor (FEP-1b12)
- [ ] Announce wrapping for hub content
- [ ] Follow/Accept/Reject flow for hubs
- [ ] Federated articles and comments
- [ ] `audience` property on all hub-scoped objects
- [ ] Selective federation (blocklist/allowlist)
- [ ] Rate limiting and circuit breakers
- [ ] Media proxy/cache

### Phase 3 (Rich content federation)
- [ ] Product type with `cpub:` namespace
- [ ] Learning Path as OrderedCollection
- [ ] Docs federation with version tracking
- [ ] FEP-8b32 Object Integrity Proofs (via Fedify)
- [ ] Authorized Fetch mode
- [ ] Hub-level federation controls

### Phase 4 (Advanced)
- [ ] Content mirroring (PeerTube-style `cpub:Mirror`)
- [ ] Relay support (topic-aware)
- [ ] Federated search indexing
- [ ] Explainer static fallback for federation
- [ ] Schema version negotiation via NodeInfo
- [ ] `alsoKnownAs` for future account portability

---

## Key Technical Decisions

1. **Fedify is the right choice** — it implements HTTP Signatures, Object Integrity Proofs (FEP-8b32), and the core AP primitives. Use it as the transport layer.

2. **Hub = Group actor** — follow FEP-1b12 exactly. The `Announce` wrapping pattern is battle-tested across Lemmy, Friendica, Hubzilla.

3. **Custom types via JSON-LD extension** — define `https://commonpub.org/ns/v1#` namespace. Always include AS2 fallback types.

4. **Metadata sync by default, full mirror opt-in** — store AP object JSON locally for all synced content. Media caching is configurable.

5. **No federated progress tracking** — learning path progress, read state, and bookmarks are local-only.

6. **No federated search protocol** — index federated content in local Meilisearch. Remote search = WebFinger/URI fetch.

7. **Circuit breakers are mandatory** — use the Stoplight pattern to avoid resource exhaustion from dead instances.

8. **Per-hub federation policy** — hub moderators control whether their hub federates, who can mirror, and who can join remotely.

---

## Sources

- [FEP-1b12: Group Federation](https://codeberg.org/fediverse/fep/raw/branch/main/fep/1b12/fep-1b12.md)
- [Lemmy Federation Documentation](https://join-lemmy.org/docs/contributors/05-federation.html)
- [Lemmy Protocol Specification](https://bbs.institute/docs/en/federation/lemmy_protocol.html)
- [PeerTube Redundancy Documentation](https://docs.joinpeertube.org/admin/following-instances)
- [PeerTube Redundancy Implementation](https://github.com/vanhonit/PeerTube/blob/develop/support/doc/redundancy.md)
- [GoToSocial Federation Modes](https://docs.gotosocial.org/en/latest/admin/federation_modes/)
- [Mastodon Security / HTTP Signatures](https://docs.joinmastodon.org/spec/security/)
- [Mastodon ActivityPub Implementation](https://docs.joinmastodon.org/spec/activitypub/)
- [Mastodon HTTP Protocol & Federation Architecture](https://deepwiki.com/mastodon/mastodon/2.3-http-protocol-and-federation)
- [Extending ActivityPub: A Recipe](https://www.stevebate.net/extending-activitypub-a-recipe/)
- [FEP-0837: Federated Marketplace](https://socialhub.activitypub.rocks/t/fep-0837-federated-marketplace/3501)
- [FEP-8b32: Object Integrity Proofs](https://socialhub.activitypub.rocks/t/fep-8b32-object-integrity-proofs/2725)
- [FEP-1d80: Feed Actor](https://socialhub.activitypub.rocks/t/fep-1d80-feed-actor-a-way-to-federate-a-collection-of-group-actors/5118)
- [Hubzilla Zot Protocol](https://hubzilla.org/help/developer/zot_protocol)
- [Nomadic Identity Coming to ActivityPub](https://wedistribute.org/2024/03/activitypub-nomadic-identity/)
- [Cross-Server Federation Search Discussion](https://socialhub.activitypub.rocks/t/cross-server-federation-search-implementation/355)
- [Searching the Fediverse Discussion](https://socialhub.activitypub.rocks/t/searching-the-fediverse/2649)
- [Activity-Relay (Go)](https://github.com/yukimochi/Activity-Relay)
- [pub-relay](https://github.com/noellabo/pub-relay)
- [Mastodon Spam Attack Discussion](https://github.com/mastodon/mastodon/issues/21977)
- [Ghost AP Domain Blocking](https://activitypub.ghost.org/blocking-domains/)
- [Privacy Preserving Interoperability Report](https://socialwebfoundation.org/2025/07/09/report-privacy-preserving-interoperability-and-the-fediverse/)
- [ActivityPub W3C Specification](https://www.w3.org/TR/activitypub/)
- [Fedify: Building AP Servers (FOSDEM 2026)](https://fosdem.org/2026/schedule/event/KSEUZT-fedify/)
