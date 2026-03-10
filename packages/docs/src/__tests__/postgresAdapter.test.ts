import { describe, it, expect, vi } from 'vitest';
import { PostgresSearchAdapter } from '../search/postgresAdapter';
import type { SearchDocument } from '../types';

function createMockDb(rows: Array<Record<string, unknown>> = []) {
  return {
    execute: vi.fn().mockResolvedValue({ rows }),
  };
}

function createMockSqlTag() {
  return vi.fn(
    (strings: TemplateStringsArray, ...values: unknown[]) => ({
      strings,
      values,
    }),
  );
}

describe('PostgresSearchAdapter', () => {
  it('should return empty array for empty query', async () => {
    const db = createMockDb();
    const sqlTag = createMockSqlTag();
    const adapter = new PostgresSearchAdapter(db, sqlTag);

    const results = await adapter.search('', 'site-1', 'v1');

    expect(results).toEqual([]);
    expect(db.execute).not.toHaveBeenCalled();
  });

  it('should return empty array for whitespace-only query', async () => {
    const db = createMockDb();
    const sqlTag = createMockSqlTag();
    const adapter = new PostgresSearchAdapter(db, sqlTag);

    const results = await adapter.search('   ', 'site-1', 'v1');

    expect(results).toEqual([]);
    expect(db.execute).not.toHaveBeenCalled();
  });

  it('should return empty when buildSearchQuery produces empty string', async () => {
    const db = createMockDb();
    const sqlTag = createMockSqlTag();
    const adapter = new PostgresSearchAdapter(db, sqlTag);

    // Only special characters — buildSearchQuery strips them all
    const results = await adapter.search('@@@', 'site-1', 'v1');

    expect(results).toEqual([]);
    expect(db.execute).not.toHaveBeenCalled();
  });

  it('should call db.execute with sql tag for valid query', async () => {
    const db = createMockDb([
      {
        pageId: 'p1',
        title: 'Getting Started',
        slug: 'getting-started',
        snippet: 'Welcome to the <b>guide</b>',
      },
    ]);
    const sqlTag = createMockSqlTag();
    const adapter = new PostgresSearchAdapter(db, sqlTag);

    const results = await adapter.search('getting started', 'site-1', 'v1');

    expect(db.execute).toHaveBeenCalledOnce();
    expect(sqlTag).toHaveBeenCalledOnce();
    expect(results).toEqual([
      {
        pageId: 'p1',
        title: 'Getting Started',
        slug: 'getting-started',
        snippet: 'Welcome to the <b>guide</b>',
      },
    ]);
  });

  it('should map result rows to SearchResult shape', async () => {
    const db = createMockDb([
      { pageId: 'a', title: 'Title A', slug: 'slug-a', snippet: 'Snippet A' },
      { pageId: 'b', title: 'Title B', slug: 'slug-b', snippet: 'Snippet B' },
    ]);
    const sqlTag = createMockSqlTag();
    const adapter = new PostgresSearchAdapter(db, sqlTag);

    const results = await adapter.search('test', 'site-1', 'v1');

    expect(results).toHaveLength(2);
    expect(results[0]).toStrictEqual({
      pageId: 'a',
      title: 'Title A',
      slug: 'slug-a',
      snippet: 'Snippet A',
    });
    expect(results[1]).toStrictEqual({
      pageId: 'b',
      title: 'Title B',
      slug: 'slug-b',
      snippet: 'Snippet B',
    });
  });

  it('should be a no-op for index()', async () => {
    const db = createMockDb();
    const sqlTag = createMockSqlTag();
    const adapter = new PostgresSearchAdapter(db, sqlTag);

    const doc: SearchDocument = {
      pageId: 'p1',
      siteId: 's1',
      versionId: 'v1',
      title: 'Test',
      path: 'test',
      headings: [],
      content: 'content',
    };

    await expect(adapter.index([doc])).resolves.toBeUndefined();
    expect(db.execute).not.toHaveBeenCalled();
  });

  it('should be a no-op for delete()', async () => {
    const db = createMockDb();
    const sqlTag = createMockSqlTag();
    const adapter = new PostgresSearchAdapter(db, sqlTag);

    await expect(adapter.delete(['p1', 'p2'])).resolves.toBeUndefined();
    expect(db.execute).not.toHaveBeenCalled();
  });
});
