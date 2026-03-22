import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { DB } from '../types.js';
import { createTestDB, createTestUser, closeTestDB } from './helpers/testdb.js';
import {
  listNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  createNotification,
} from '../notification/notification.js';

describe('notification', () => {
  let db: DB;
  let userId: string;
  let actorId: string;

  beforeAll(async () => {
    db = await createTestDB();
    const user = await createTestUser(db, { username: 'recipient' });
    userId = user.id;
    const actor = await createTestUser(db, { username: 'actor', displayName: 'Actor Name' });
    actorId = actor.id;
  });

  afterAll(async () => {
    await closeTestDB(db);
  });

  it('creates a notification', async () => {
    const notif = await createNotification(db, {
      userId,
      type: 'like',
      title: 'New like',
      message: 'Someone liked your post',
      actorId,
    });
    expect(notif.id).toBeDefined();
    expect(notif.userId).toBe(userId);
    expect(notif.type).toBe('like');
    expect(notif.read).toBe(false);
    expect(notif.createdAt).toBeInstanceOf(Date);
  });

  it('creates a notification with link', async () => {
    const notif = await createNotification(db, {
      userId,
      type: 'comment',
      title: 'New comment',
      message: 'Someone commented on your post',
      link: '/posts/123',
      actorId,
    });
    expect(notif.link).toBe('/posts/123');
  });

  it('creates a notification without actorId', async () => {
    const notif = await createNotification(db, {
      userId,
      type: 'system',
      title: 'System update',
      message: 'Platform updated',
    });
    expect(notif.actorId).toBeNull();
    expect(notif.actorName).toBeNull();
  });

  it('lists notifications for a user', async () => {
    const { items, total } = await listNotifications(db, { userId });
    expect(items.length).toBeGreaterThan(0);
    expect(total).toBeGreaterThan(0);
    // Most recent first
    for (let i = 1; i < items.length; i++) {
      expect(items[i - 1]!.createdAt.getTime()).toBeGreaterThanOrEqual(items[i]!.createdAt.getTime());
    }
  });

  it('resolves actor name in listing', async () => {
    const { items } = await listNotifications(db, { userId });
    const withActor = items.find((n) => n.actorId === actorId);
    expect(withActor?.actorName).toBe('Actor Name');
  });

  it('filters notifications by type', async () => {
    const { items } = await listNotifications(db, { userId, type: 'like' });
    expect(items.every((n) => n.type === 'like')).toBe(true);
  });

  it('filters notifications by read status', async () => {
    const { items } = await listNotifications(db, { userId, read: false });
    expect(items.every((n) => n.read === false)).toBe(true);
  });

  it('gets unread count', async () => {
    const count = await getUnreadCount(db, userId);
    expect(count).toBeGreaterThan(0);
  });

  it('marks a single notification as read', async () => {
    const notif = await createNotification(db, {
      userId,
      type: 'follow',
      title: 'New follower',
      message: 'You have a new follower',
      actorId,
    });
    await markNotificationRead(db, notif.id, userId);
    const { items } = await listNotifications(db, { userId });
    const updated = items.find((n) => n.id === notif.id);
    expect(updated?.read).toBe(true);
  });

  it('marks all notifications as read', async () => {
    await createNotification(db, {
      userId,
      type: 'mention',
      title: 'Mention',
      message: 'You were mentioned',
    });
    await markAllNotificationsRead(db, userId);
    const count = await getUnreadCount(db, userId);
    expect(count).toBe(0);
  });

  it('deletes a notification', async () => {
    const notif = await createNotification(db, {
      userId,
      type: 'system',
      title: 'Temp',
      message: 'Will be deleted',
    });
    const beforeCount = (await listNotifications(db, { userId })).total;
    await deleteNotification(db, notif.id, userId);
    const afterCount = (await listNotifications(db, { userId })).total;
    expect(afterCount).toBe(beforeCount - 1);
  });

  it('respects pagination', async () => {
    const { items } = await listNotifications(db, { userId, limit: 2, offset: 0 });
    expect(items.length).toBeLessThanOrEqual(2);
  });

  it('returns zero unread count for user with no notifications', async () => {
    const other = await createTestUser(db, { username: 'notifsless' });
    const count = await getUnreadCount(db, other.id);
    expect(count).toBe(0);
  });
});
