# OAuth Codes

> In-memory authorization code store for OAuth flows with single-use consumption and automatic expiry cleanup.

**Source**: `apps/reference/src/lib/server/oauthCodes.ts`

---

## Exports

| Export | Kind | Description |
|--------|------|-------------|
| `storeAuthCode` | Function | Stores an authorization code with TTL |
| `consumeAuthCode` | Function | Single-use code consumption with validation |
| `cleanupExpiredCodes` | Function | Removes expired entries from the store |

---

## API Reference

### `storeAuthCode(code, userId, clientId, redirectUri): void`

Stores an OAuth authorization code with a 10-minute time-to-live.

| Parameter | Type | Description |
|-----------|------|-------------|
| `code` | `string` | The authorization code |
| `userId` | `string` | User who authorized the code |
| `clientId` | `string` | OAuth client that requested authorization |
| `redirectUri` | `string` | Redirect URI bound to this code |

**Notes**: The code expires 10 minutes after storage.

---

### `consumeAuthCode(code, clientId, redirectUri): { userId: string } | null`

Consumes an authorization code, returning the associated user ID if valid.

| Parameter | Type | Description |
|-----------|------|-------------|
| `code` | `string` | The authorization code to consume |
| `clientId` | `string` | Must match the client ID the code was issued to |
| `redirectUri` | `string` | Must match the redirect URI the code was bound to |

**Returns**: `{ userId }` on success, or `null` if the code is invalid, expired, or parameters do not match.

**Behavior**:

1. The code is **always deleted** from the store, regardless of whether validation succeeds. This ensures single-use semantics.
2. Validates that the code has not expired (10-minute TTL).
3. Validates that `clientId` matches the stored client ID.
4. Validates that `redirectUri` matches the stored redirect URI.
5. Returns `{ userId }` only if all checks pass.

---

### `cleanupExpiredCodes(): void`

Removes all expired authorization codes from the in-memory store.

**Notes**: This function is automatically invoked every 60 seconds via `setInterval` to prevent unbounded memory growth.

---

## Implementation Notes

The store is backed by an in-memory `Map`. This is suitable for single-instance development and testing but **should be replaced with Redis or a database table for production** deployments where multiple server instances may handle token exchange requests.
