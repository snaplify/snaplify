import { describe, it, expect, beforeAll } from 'vitest';
import type { DB } from '../types.js';
import { createTestDB, createTestUser } from './helpers/testdb.js';
import {
  createContent,
  listContent,
  getContentBySlug,
  updateContent,
  publishContent,
  deleteContent,
  incrementViewCount,
  createContentVersion,
  listContentVersions,
} from '../content/content.js';

describe('content integration', () => {
  let db: DB;
  let userId: string;

  beforeAll(async () => {
    db = await createTestDB();
    const user = await createTestUser(db);
    userId = user.id;
  });

  it('creates a draft content item', async () => {
    const result = await createContent(db, userId, {
      type: 'article',
      title: 'Test Article',
      description: 'A test article',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.title).toBe('Test Article');
    expect(result.slug).toMatch(/^test-article/);
    expect(result.status).toBe('draft');
    expect(result.type).toBe('article');
  });

  it('lists content with filters', async () => {
    const result = await listContent(db, { status: 'draft' });

    expect(result.items.length).toBeGreaterThanOrEqual(1);
    expect(result.total).toBeGreaterThanOrEqual(1);
    expect(result.items[0]!.status).toBe('draft');
  });

  it('gets content by slug', async () => {
    const created = await createContent(db, userId, {
      type: 'project',
      title: 'My Test Project',
    });

    const found = await getContentBySlug(db, created.slug, userId);
    expect(found).toBeDefined();
    expect(found!.title).toBe('My Test Project');
    expect(found!.type).toBe('project');
  });

  it('updates content', async () => {
    const created = await createContent(db, userId, {
      type: 'blog',
      title: 'Draft Blog Post',
    });

    const updated = await updateContent(db, created.id, userId, {
      title: 'Updated Blog Post',
      description: 'Now with a description',
    });

    expect(updated).toBeDefined();
    expect(updated!.title).toBe('Updated Blog Post');
  });

  it('publishes content and sets publishedAt', async () => {
    const created = await createContent(db, userId, {
      type: 'article',
      title: 'To Be Published',
    });

    const published = await publishContent(db, created.id, userId);
    expect(published).toBeDefined();
    expect(published!.status).toBe('published');
    expect(published!.publishedAt).toBeDefined();
  });

  it('increments view count', async () => {
    const created = await createContent(db, userId, {
      type: 'article',
      title: 'Viewable Article',
    });

    await incrementViewCount(db, created.id);
    await incrementViewCount(db, created.id);

    const found = await getContentBySlug(db, created.slug, userId);
    expect(found!.viewCount).toBe(2);
  });

  it('generates unique slugs for duplicate titles', async () => {
    const first = await createContent(db, userId, {
      type: 'article',
      title: 'Duplicate Title',
    });
    const second = await createContent(db, userId, {
      type: 'article',
      title: 'Duplicate Title',
    });

    expect(first.slug).not.toBe(second.slug);
  });

  it('soft deletes content', async () => {
    const created = await createContent(db, userId, {
      type: 'article',
      title: 'To Be Deleted',
    });

    await deleteContent(db, created.id, userId);

    // Should not appear in listings
    const list = await listContent(db, { status: 'draft' });
    const found = list.items.find((i) => i.id === created.id);
    expect(found).toBeUndefined();
  });

  it('creates a content version on publish', async () => {
    const created = await createContent(db, userId, {
      type: 'article',
      title: 'Versioned Article',
    });

    await publishContent(db, created.id, userId);
    await createContentVersion(db, created.id, userId);

    const versions = await listContentVersions(db, created.id);
    expect(versions.length).toBeGreaterThanOrEqual(1);
  });

  it('filters by type', async () => {
    const result = await listContent(db, { type: 'project', status: 'draft' });
    for (const item of result.items) {
      expect(item.type).toBe('project');
    }
  });

  it('supports pagination', async () => {
    const all = await listContent(db, { limit: 100 });
    const page1 = await listContent(db, { limit: 2, offset: 0 });
    const page2 = await listContent(db, { limit: 2, offset: 2 });

    expect(page1.items.length).toBeLessThanOrEqual(2);
    expect(page1.total).toBe(all.total);
    if (all.total > 2) {
      expect(page2.items[0]!.id).not.toBe(page1.items[0]!.id);
    }
  });
});
