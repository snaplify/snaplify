import { describe, it, expect } from 'vitest';
import {
  validateVersionString,
  compareVersions,
  selectDefaultVersion,
  prepareVersionCopy,
} from '../versioning/manager';
import type { VersionInfo, DocsPage } from '../types';

describe('validateVersionString', () => {
  it('should accept semver strings', () => {
    expect(validateVersionString('1.0.0')).toBe(true);
    expect(validateVersionString('v2.1.3')).toBe(true);
    expect(validateVersionString('1.0')).toBe(true);
  });

  it('should accept named versions', () => {
    expect(validateVersionString('latest')).toBe(true);
    expect(validateVersionString('main')).toBe(true);
    expect(validateVersionString('next')).toBe(true);
    expect(validateVersionString('stable')).toBe(true);
  });

  it('should reject empty string', () => {
    expect(validateVersionString('')).toBe(false);
  });

  it('should reject strings over 32 chars', () => {
    expect(validateVersionString('a'.repeat(33))).toBe(false);
  });
});

describe('compareVersions', () => {
  it('should compare major versions', () => {
    expect(compareVersions('2.0.0', '1.0.0')).toBeGreaterThan(0);
    expect(compareVersions('1.0.0', '2.0.0')).toBeLessThan(0);
  });

  it('should compare minor versions', () => {
    expect(compareVersions('1.2.0', '1.1.0')).toBeGreaterThan(0);
  });

  it('should compare patch versions', () => {
    expect(compareVersions('1.0.2', '1.0.1')).toBeGreaterThan(0);
  });

  it('should return 0 for equal versions', () => {
    expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
  });

  it('should sort named versions after semver', () => {
    expect(compareVersions('latest', '1.0.0')).toBeGreaterThan(0);
    expect(compareVersions('1.0.0', 'latest')).toBeLessThan(0);
  });
});

describe('selectDefaultVersion', () => {
  const versions: VersionInfo[] = [
    { id: 'v1', version: '1.0.0', isDefault: false, createdAt: new Date(), pageCount: 5 },
    { id: 'v2', version: '2.0.0', isDefault: true, createdAt: new Date(), pageCount: 8 },
    { id: 'v3', version: '3.0.0', isDefault: false, createdAt: new Date(), pageCount: 3 },
  ];

  it('should return the version marked as default', () => {
    const result = selectDefaultVersion(versions);
    expect(result!.id).toBe('v2');
  });

  it('should fall back to latest version when none marked default', () => {
    const noDefault = versions.map((v) => ({ ...v, isDefault: false }));
    const result = selectDefaultVersion(noDefault);
    expect(result!.version).toBe('3.0.0');
  });

  it('should return null for empty array', () => {
    expect(selectDefaultVersion([])).toBeNull();
  });
});

describe('prepareVersionCopy', () => {
  const now = new Date();
  const sourcePages: DocsPage[] = [
    {
      id: 'p1',
      versionId: 'old',
      title: 'Intro',
      slug: 'intro',
      content: '# Intro',
      sortOrder: 0,
      parentId: null,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'p2',
      versionId: 'old',
      title: 'Setup',
      slug: 'setup',
      content: '# Setup',
      sortOrder: 1,
      parentId: 'p1',
      createdAt: now,
      updatedAt: now,
    },
  ];

  it('should create page copies with new versionId', () => {
    const copies = prepareVersionCopy(sourcePages, 'new-version-id');
    expect(copies).toHaveLength(2);
    expect(copies[0]!.versionId).toBe('new-version-id');
    expect(copies[0]!.title).toBe('Intro');
    expect(copies[0]!.content).toBe('# Intro');
  });

  it('should preserve sort order', () => {
    const copies = prepareVersionCopy(sourcePages, 'new');
    expect(copies[0]!.sortOrder).toBe(0);
    expect(copies[1]!.sortOrder).toBe(1);
  });

  it('should handle empty source pages', () => {
    expect(prepareVersionCopy([], 'new')).toEqual([]);
  });
});
