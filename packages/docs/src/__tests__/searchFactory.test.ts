import { describe, it, expect, vi } from 'vitest';
import { createSearchAdapter } from '../search/factory';
import { PostgresSearchAdapter } from '../search/postgresAdapter';
import { MeilisearchSearchAdapter } from '../search/meilisearchAdapter';

describe('createSearchAdapter', () => {
  it('should create PostgresSearchAdapter when db and sqlTag provided', () => {
    const db = { execute: vi.fn() };
    const sqlTag = vi.fn();

    const adapter = createSearchAdapter({ db, sqlTag });

    expect(adapter).toBeInstanceOf(PostgresSearchAdapter);
  });

  it('should create MeilisearchSearchAdapter when meiliClient provided', () => {
    const meiliClient = { index: vi.fn() };

    const adapter = createSearchAdapter({ meiliClient });

    expect(adapter).toBeInstanceOf(MeilisearchSearchAdapter);
  });

  it('should prefer meiliClient over db when both provided', () => {
    const db = { execute: vi.fn() };
    const sqlTag = vi.fn();
    const meiliClient = { index: vi.fn() };

    const adapter = createSearchAdapter({ db, sqlTag, meiliClient });

    expect(adapter).toBeInstanceOf(MeilisearchSearchAdapter);
  });

  it('should throw when neither db nor meiliClient provided', () => {
    expect(() => createSearchAdapter({})).toThrow(
      'createSearchAdapter requires either meiliClient or db in config',
    );
  });

  it('should throw when db provided without sqlTag', () => {
    const db = { execute: vi.fn() };

    expect(() => createSearchAdapter({ db })).toThrow(
      'PostgresSearchAdapter requires a sqlTag function',
    );
  });
});
