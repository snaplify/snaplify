/** In-memory authorization code store for OAuth2 flows.
 *  Production deployments should replace this with Redis or a DB table.
 */

interface StoredCode {
  userId: string;
  clientId: string;
  redirectUri: string;
  expiresAt: number;
}

const codes = new Map<string, StoredCode>();

const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/** Store an authorization code */
export function storeAuthCode(
  code: string,
  userId: string,
  clientId: string,
  redirectUri: string,
): void {
  codes.set(code, {
    userId,
    clientId,
    redirectUri,
    expiresAt: Date.now() + CODE_TTL_MS,
  });
}

/** Consume an authorization code (single-use). Returns the stored data or null. */
export function consumeAuthCode(
  code: string,
  clientId: string,
  redirectUri: string,
): { userId: string } | null {
  const stored = codes.get(code);
  if (!stored) return null;

  // Always delete — codes are single-use
  codes.delete(code);

  if (Date.now() > stored.expiresAt) return null;
  if (stored.clientId !== clientId) return null;
  if (stored.redirectUri !== redirectUri) return null;

  return { userId: stored.userId };
}

/** Clean up expired codes (called periodically) */
export function cleanupExpiredCodes(): void {
  const now = Date.now();
  for (const [code, stored] of codes) {
    if (now > stored.expiresAt) {
      codes.delete(code);
    }
  }
}

// Periodic cleanup
setInterval(cleanupExpiredCodes, 60_000);
