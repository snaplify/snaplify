import { describe, it, expect, beforeEach } from 'vitest';
import { storeAuthCode, consumeAuthCode, cleanupExpiredCodes } from '../oauthCodes';

describe('OAuth Authorization Code Store', () => {
  const clientId = 'client-1';
  const redirectUri = 'https://example.com/callback';
  const userId = 'user-1';

  it('stores and consumes a valid code', () => {
    const code = 'test-code-1';
    storeAuthCode(code, userId, clientId, redirectUri);
    const result = consumeAuthCode(code, clientId, redirectUri);
    expect(result).toEqual({ userId });
  });

  it('returns null for unknown code', () => {
    const result = consumeAuthCode('nonexistent', clientId, redirectUri);
    expect(result).toBeNull();
  });

  it('codes are single-use', () => {
    const code = 'test-code-2';
    storeAuthCode(code, userId, clientId, redirectUri);
    consumeAuthCode(code, clientId, redirectUri);
    const second = consumeAuthCode(code, clientId, redirectUri);
    expect(second).toBeNull();
  });

  it('rejects code with wrong clientId', () => {
    const code = 'test-code-3';
    storeAuthCode(code, userId, clientId, redirectUri);
    const result = consumeAuthCode(code, 'wrong-client', redirectUri);
    expect(result).toBeNull();
  });

  it('rejects code with wrong redirectUri', () => {
    const code = 'test-code-4';
    storeAuthCode(code, userId, clientId, redirectUri);
    const result = consumeAuthCode(code, clientId, 'https://evil.com/callback');
    expect(result).toBeNull();
  });

  it('cleanupExpiredCodes removes expired entries without affecting valid ones', () => {
    const validCode = 'test-code-valid';
    storeAuthCode(validCode, userId, clientId, redirectUri);
    cleanupExpiredCodes();
    // Valid code should still work
    const result = consumeAuthCode(validCode, clientId, redirectUri);
    expect(result).toEqual({ userId });
  });
});
