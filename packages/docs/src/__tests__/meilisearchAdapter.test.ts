import { describe, it, expect, vi } from 'vitest';
import { MeilisearchSearchAdapter } from '../search/meilisearchAdapter';
import type { MeiliSearchClient, MeiliIndex } from '../search/types';
import type { SearchDocument } from '../types';

function createMockIndex(
  hits: Array<Record<string, unknown>> = [],
): MeiliIndex {
  return {
    addDocuments: vi.fn().mockResolvedValue({ taskUid: 1 }),
    search: vi.fn().mockResolvedValue({ hits }),
    deleteDocuments: vi.fn().mockResolvedValue({ taskUid: 2 }),
    updateFilterableAttributes: vi.fn().mockResolvedValue({ taskUid: 3 }),
    updateSearchableAttributes: vi.fn().mockResolvedValue({ taskUid: 4 }),
  };
}

function createMockClient(
  mockIndex?: MeiliIndex,
): MeiliSearchClient {
  const idx = mockIndex ?? createMockIndex();
  return {
    index: vi.fn().mockReturnValue(idx),
  };
}

function makeDoc(overrides: Partial<SearchDocument> = {}): SearchDocument {
  return {
    pageId: 'p1',
    siteId: 'site-1',
    versionId: 'v1',
    title: 'Test Page',
    path: 'docs/test',
    headings: ['Heading 1', 'Heading 2'],
    content: 'Some content here',
    ...overrides,
  };
}

describe('MeilisearchSearchAdapter', () => {
  it('should return empty array for empty query', async () => {
    const client = createMockClient();
    const adapter = new MeilisearchSearchAdapter(client);

    const results = await adapter.search('', 'site-1', 'v1');

    expect(results).toEqual([]);
    expect(client.index).not.toHaveBeenCalled();
  });

  it('should call index.search with correct params', async () => {
    const mockIdx = createMockIndex([
      {
        pageId: 'p1',
        title: 'Getting Started',
        slug: 'getting-started',
        _formatted: { content: 'Welcome to the <mark>guide</mark>' },
      },
    ]);
    const client = createMockClient(mockIdx);
    const adapter = new MeilisearchSearchAdapter(client);

    await adapter.search('guide', 'site-1', 'v1');

    expect(client.index).toHaveBeenCalledWith('docs_site-1');
    expect(mockIdx.search).toHaveBeenCalledWith('guide', {
      filter: 'versionId = "v1"',
      limit: 20,
      attributesToHighlight: ['content'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    });
  });

  it('should map hits to SearchResult shape', async () => {
    const mockIdx = createMockIndex([
      {
        pageId: 'p1',
        title: 'Title A',
        slug: 'slug-a',
        _formatted: { content: 'Highlighted snippet' },
      },
      {
        pageId: 'p2',
        title: 'Title B',
        slug: 'slug-b',
        _formatted: { content: 'Another snippet' },
      },
    ]);
    const client = createMockClient(mockIdx);
    const adapter = new MeilisearchSearchAdapter(client);

    const results = await adapter.search('test', 'site-1', 'v1');

    expect(results).toEqual([
      {
        pageId: 'p1',
        title: 'Title A',
        slug: 'slug-a',
        snippet: 'Highlighted snippet',
      },
      {
        pageId: 'p2',
        title: 'Title B',
        slug: 'slug-b',
        snippet: 'Another snippet',
      },
    ]);
  });

  it('should group documents by siteId on index', async () => {
    const mockIdx = createMockIndex();
    const client = createMockClient(mockIdx);
    const adapter = new MeilisearchSearchAdapter(client);

    const docs = [
      makeDoc({ pageId: 'p1', siteId: 'site-a' }),
      makeDoc({ pageId: 'p2', siteId: 'site-b' }),
      makeDoc({ pageId: 'p3', siteId: 'site-a' }),
    ];

    await adapter.index(docs);

    // Should create two indexes: docs_site-a and docs_site-b
    expect(client.index).toHaveBeenCalledWith('docs_site-a');
    expect(client.index).toHaveBeenCalledWith('docs_site-b');
    // addDocuments called twice (once per site)
    expect(mockIdx.addDocuments).toHaveBeenCalledTimes(2);
  });

  it('should set filterable and searchable attributes on index', async () => {
    const mockIdx = createMockIndex();
    const client = createMockClient(mockIdx);
    const adapter = new MeilisearchSearchAdapter(client);

    await adapter.index([makeDoc()]);

    expect(mockIdx.updateFilterableAttributes).toHaveBeenCalledWith([
      'versionId',
      'siteId',
    ]);
    expect(mockIdx.updateSearchableAttributes).toHaveBeenCalledWith([
      'title',
      'headings',
      'content',
    ]);
  });

  it('should be a no-op for index with empty array', async () => {
    const client = createMockClient();
    const adapter = new MeilisearchSearchAdapter(client);

    await adapter.index([]);

    expect(client.index).not.toHaveBeenCalled();
  });

  it('should call deleteDocuments via deleteFromSite', async () => {
    const mockIdx = createMockIndex();
    const client = createMockClient(mockIdx);
    const adapter = new MeilisearchSearchAdapter(client);

    await adapter.deleteFromSite('site-1', ['p1', 'p2']);

    expect(client.index).toHaveBeenCalledWith('docs_site-1');
    expect(mockIdx.deleteDocuments).toHaveBeenCalledWith(['p1', 'p2']);
  });

  it('should be a no-op for deleteFromSite with empty array', async () => {
    const client = createMockClient();
    const adapter = new MeilisearchSearchAdapter(client);

    await adapter.deleteFromSite('site-1', []);

    expect(client.index).not.toHaveBeenCalled();
  });

  it('should handle missing _formatted in search hits', async () => {
    const mockIdx = createMockIndex([
      {
        pageId: 'p1',
        title: 'No Format',
        slug: 'no-format',
      },
    ]);
    const client = createMockClient(mockIdx);
    const adapter = new MeilisearchSearchAdapter(client);

    const results = await adapter.search('test', 'site-1', 'v1');

    expect(results[0]?.snippet).toBe('');
  });
});
