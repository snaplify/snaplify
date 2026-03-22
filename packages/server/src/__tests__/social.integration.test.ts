import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { DB } from '../types.js';
import { createTestDB, createTestUser, closeTestDB } from './helpers/testdb.js';
import { createContent } from '../content/content.js';
import {
  toggleLike,
  isLiked,
  createComment,
  listComments,
  deleteComment,
  toggleBookmark,
  followUser,
  unfollowUser,
  isFollowing,
  listFollowers,
  listFollowing,
  listUserBookmarks,
} from '../social/social.js';

describe('social integration', () => {
  let db: DB;
  let userA: string;
  let userB: string;
  let contentId: string;

  beforeAll(async () => {
    db = await createTestDB();
    const a = await createTestUser(db, { username: 'alice' });
    const b = await createTestUser(db, { username: 'bob' });
    userA = a.id;
    userB = b.id;

    const content = await createContent(db, userA, {
      type: 'article',
      title: 'Social Test Article',
    });
    contentId = content.id;
  });

  afterAll(async () => {
    await closeTestDB(db);
  });

  describe('likes', () => {
    it('toggles like on', async () => {
      const result = await toggleLike(db, userB, 'article', contentId);
      expect(result.liked).toBe(true);
    });

    it('checks if liked', async () => {
      const liked = await isLiked(db, userB, 'article', contentId);
      expect(liked).toBe(true);
    });

    it('toggles like off', async () => {
      const result = await toggleLike(db, userB, 'article', contentId);
      expect(result.liked).toBe(false);
    });
  });

  describe('comments', () => {
    it('creates a comment', async () => {
      const comment = await createComment(db, userB, {
        targetType: 'article',
        targetId: contentId,
        content: 'Great article!',
      });

      expect(comment).toBeDefined();
      expect(comment.content).toBe('Great article!');
    });

    it('lists comments with threading', async () => {
      const comments = await listComments(db, 'article', contentId);
      expect(comments.length).toBeGreaterThanOrEqual(1);
    });

    it('creates threaded reply', async () => {
      const parent = await createComment(db, userA, {
        targetType: 'article',
        targetId: contentId,
        content: 'Parent comment',
      });

      const reply = await createComment(db, userB, {
        targetType: 'article',
        targetId: contentId,
        parentId: parent.id,
        content: 'Reply to parent',
      });

      expect(reply.parentId).toBe(parent.id);
    });

    it('deletes own comment', async () => {
      const comment = await createComment(db, userA, {
        targetType: 'article',
        targetId: contentId,
        content: 'To be deleted',
      });

      await deleteComment(db, comment.id, userA);
      const comments = await listComments(db, 'article', contentId);
      const found = comments.find((c) => c.id === comment.id);
      expect(found).toBeUndefined();
    });
  });

  describe('bookmarks', () => {
    it('toggles bookmark on', async () => {
      const result = await toggleBookmark(db, userA, 'article', contentId);
      expect(result.bookmarked).toBe(true);
    });

    it('lists user bookmarks', async () => {
      const result = await listUserBookmarks(db, userA);
      const bookmarks = Array.isArray(result) ? result : (result as { items: unknown[] }).items ?? [];
      expect(bookmarks.length).toBeGreaterThanOrEqual(1);
    });

    it('toggles bookmark off', async () => {
      const result = await toggleBookmark(db, userA, 'article', contentId);
      expect(result.bookmarked).toBe(false);
    });
  });

  describe('follows', () => {
    it('follows a user', async () => {
      await followUser(db, userA, userB);
      const following = await isFollowing(db, userA, userB);
      expect(following).toBe(true);
    });

    it('lists followers', async () => {
      const result = await listFollowers(db, userB);
      const followers = Array.isArray(result) ? result : (result as { items: { id: string }[] }).items ?? [];
      expect(followers.some((f: { id: string }) => f.id === userA)).toBe(true);
    });

    it('lists following', async () => {
      const result = await listFollowing(db, userA);
      const following = Array.isArray(result) ? result : (result as { items: { id: string }[] }).items ?? [];
      expect(following.some((f: { id: string }) => f.id === userB)).toBe(true);
    });

    it('unfollows a user', async () => {
      await unfollowUser(db, userA, userB);
      const following = await isFollowing(db, userA, userB);
      expect(following).toBe(false);
    });
  });
});
