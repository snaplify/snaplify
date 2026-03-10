import { describe, it, expect, vi } from 'vitest';
import { generateSlug, ensureUniqueCommunitySlug } from '../lib/utils/slug';

describe('generateSlug', () => {
  it('should convert a simple title to a slug', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('should handle multiple spaces and special characters', () => {
    expect(generateSlug('My   Amazing -- Project!')).toBe('my-amazing-project');
  });

  it('should strip diacritics from unicode characters', () => {
    expect(generateSlug('Résumé über Naïve')).toBe('resume-uber-naive');
  });

  it('should handle numbers in the title', () => {
    expect(generateSlug('ESP32 LED Matrix v2')).toBe('esp32-led-matrix-v2');
  });

  it('should return empty string for empty input', () => {
    expect(generateSlug('')).toBe('');
  });

  it('should handle strings with only special characters', () => {
    expect(generateSlug('!!!@@@###')).toBe('');
  });

  it('should trim leading and trailing hyphens', () => {
    expect(generateSlug('  --Hello--  ')).toBe('hello');
  });

  it('should handle CJK and emoji by removing them', () => {
    expect(generateSlug('Hello 世界 🌍')).toBe('hello');
  });
});

describe('ensureUniqueCommunitySlug', () => {
  it('should return slug when no collision', async () => {
    const mockChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation((resolve) => resolve([])),
    };
    const db = { select: vi.fn().mockReturnValue(mockChain) };

    const result = await ensureUniqueCommunitySlug(
      db as unknown as Parameters<typeof ensureUniqueCommunitySlug>[0],
      'my-community',
    );
    expect(result).toBe('my-community');
  });

  it('should append timestamp on collision', async () => {
    const mockChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation((resolve) => resolve([{ id: 'existing' }])),
    };
    const db = { select: vi.fn().mockReturnValue(mockChain) };

    const result = await ensureUniqueCommunitySlug(
      db as unknown as Parameters<typeof ensureUniqueCommunitySlug>[0],
      'my-community',
    );
    expect(result).toMatch(/^my-community-\d+$/);
  });

  it('should generate fallback for empty slug', async () => {
    const mockChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation((resolve) => resolve([])),
    };
    const db = { select: vi.fn().mockReturnValue(mockChain) };

    const result = await ensureUniqueCommunitySlug(
      db as unknown as Parameters<typeof ensureUniqueCommunitySlug>[0],
      '',
    );
    expect(result).toMatch(/^community-\d+$/);
  });
});
