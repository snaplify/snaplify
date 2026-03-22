import { describe, it, expect, afterEach } from 'vitest';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  generateStorageKey,
  validateUpload,
  isProcessableImage,
  LocalStorageAdapter,
  createStorageFromEnv,
  ALLOWED_MIME_TYPES,
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_SIZES,
} from '../storage.js';

describe('generateStorageKey', () => {
  it('generates a key with purpose prefix and extension', () => {
    const key = generateStorageKey('photo.jpg', 'avatar');
    expect(key).toMatch(/^avatar\/[a-f0-9-]+\.jpg$/);
  });

  it('handles files without extension', () => {
    const key = generateStorageKey('README', 'content');
    expect(key).toMatch(/^content\/[a-f0-9-]+$/);
    expect(key).not.toContain('.');
  });

  it('generates unique keys for same filename', () => {
    const k1 = generateStorageKey('photo.png', 'avatar');
    const k2 = generateStorageKey('photo.png', 'avatar');
    expect(k1).not.toBe(k2);
  });

  it('sanitizes extension to prevent path traversal', () => {
    const key = generateStorageKey('file.../../etc/passwd', 'content');
    expect(key).not.toContain('..');
    expect(key).not.toContain('/etc');
    // Extension should be sanitized to alphanumeric only
    expect(key).toMatch(/^content\/[a-f0-9-]+(\.etcpasswd)?$/);
  });

  it('strips special characters from extension', () => {
    const key = generateStorageKey('file.t<x>t', 'content');
    expect(key).not.toContain('<');
    expect(key).not.toContain('>');
  });
});

describe('validateUpload', () => {
  it('accepts valid image upload', () => {
    const result = validateUpload('image/jpeg', 1024, 'avatar');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('rejects disallowed MIME type', () => {
    const result = validateUpload('application/x-executable', 1024, 'content');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('not allowed');
  });

  it('rejects file exceeding size limit for purpose', () => {
    const result = validateUpload('image/png', 3 * 1024 * 1024, 'avatar'); // 3MB > 2MB limit
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds maximum');
  });

  it('accepts file within size limit', () => {
    const result = validateUpload('image/png', 1 * 1024 * 1024, 'avatar'); // 1MB < 2MB
    expect(result.valid).toBe(true);
  });

  it('falls back to attachment limit for unknown purpose', () => {
    const result = validateUpload('application/pdf', 50 * 1024 * 1024, 'unknown-purpose');
    expect(result.valid).toBe(true);
  });

  it('accepts all allowed MIME types', () => {
    for (const mime of ALLOWED_MIME_TYPES) {
      const result = validateUpload(mime, 100, 'content');
      expect(result.valid).toBe(true);
    }
  });
});

describe('isProcessableImage', () => {
  it('returns true for processable image types', () => {
    expect(isProcessableImage('image/jpeg')).toBe(true);
    expect(isProcessableImage('image/png')).toBe(true);
    expect(isProcessableImage('image/gif')).toBe(true);
    expect(isProcessableImage('image/webp')).toBe(true);
  });

  it('returns false for non-image types', () => {
    expect(isProcessableImage('application/pdf')).toBe(false);
    expect(isProcessableImage('text/plain')).toBe(false);
    expect(isProcessableImage('image/svg+xml')).toBe(false);
  });
});

describe('ALLOWED_MIME_TYPES', () => {
  it('includes all image types', () => {
    for (const type of ALLOWED_IMAGE_TYPES) {
      expect(ALLOWED_MIME_TYPES.has(type)).toBe(true);
    }
  });

  it('includes document types', () => {
    expect(ALLOWED_MIME_TYPES.has('application/pdf')).toBe(true);
    expect(ALLOWED_MIME_TYPES.has('text/plain')).toBe(true);
    expect(ALLOWED_MIME_TYPES.has('text/markdown')).toBe(true);
  });
});

describe('MAX_UPLOAD_SIZES', () => {
  it('avatar is smallest', () => {
    expect(MAX_UPLOAD_SIZES['avatar']).toBeLessThan(MAX_UPLOAD_SIZES['content']!);
  });

  it('attachment is largest', () => {
    expect(MAX_UPLOAD_SIZES['attachment']).toBeGreaterThan(MAX_UPLOAD_SIZES['content']!);
  });
});

describe('LocalStorageAdapter', () => {
  let tempDir: string;

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it('uploads a buffer and returns URL', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'cpub-test-'));
    const adapter = new LocalStorageAdapter(tempDir, 'http://localhost:3000');

    const url = await adapter.upload('test/file.txt', Buffer.from('hello'), 'text/plain');
    expect(url).toBe('http://localhost:3000/uploads/test/file.txt');

    const content = await readFile(join(tempDir, 'test/file.txt'), 'utf-8');
    expect(content).toBe('hello');
  });

  it('deletes a file', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'cpub-test-'));
    const adapter = new LocalStorageAdapter(tempDir, 'http://localhost:3000');

    await adapter.upload('test/del.txt', Buffer.from('data'), 'text/plain');
    await adapter.delete('test/del.txt');

    await expect(readFile(join(tempDir, 'test/del.txt'))).rejects.toThrow();
  });

  it('ignores delete of non-existent file', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'cpub-test-'));
    const adapter = new LocalStorageAdapter(tempDir, 'http://localhost:3000');

    // Should not throw
    await adapter.delete('nonexistent/file.txt');
  });

  it('strips trailing slash from baseUrl', () => {
    const adapter = new LocalStorageAdapter('/tmp', 'http://localhost:3000/');
    expect(adapter.getUrl('test.txt')).toBe('http://localhost:3000/uploads/test.txt');
  });

  it('prevents path traversal on upload', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'cpub-test-'));
    const adapter = new LocalStorageAdapter(tempDir, 'http://localhost:3000');

    await expect(
      adapter.upload('../../../etc/passwd', Buffer.from('evil'), 'text/plain'),
    ).rejects.toThrow('path traversal');
  });

  it('prevents path traversal on delete', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'cpub-test-'));
    const adapter = new LocalStorageAdapter(tempDir, 'http://localhost:3000');

    await expect(adapter.delete('../../../etc/passwd')).rejects.toThrow('path traversal');
  });
});

describe('createStorageFromEnv', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('returns LocalStorageAdapter when S3_BUCKET is not set', () => {
    delete process.env.S3_BUCKET;
    const adapter = createStorageFromEnv();
    expect(adapter).toBeInstanceOf(LocalStorageAdapter);
  });

  it('returns S3StorageAdapter when S3_BUCKET is set', () => {
    process.env.S3_BUCKET = 'test-bucket';
    process.env.S3_REGION = 'us-west-2';
    process.env.S3_ACCESS_KEY = 'key';
    process.env.S3_SECRET_KEY = 'secret';
    const adapter = createStorageFromEnv();
    // S3StorageAdapter - verify it has the right getUrl
    expect(adapter.getUrl('test.jpg')).toContain('test-bucket');
  });
});
