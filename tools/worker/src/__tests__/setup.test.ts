import { describe, it, expect } from 'vitest';
import { calculateDeliveryStats, shouldRetry, getRetryDelay, formatActivityLog } from '../index';

describe('calculateDeliveryStats', () => {
  it('should count activities by status', () => {
    const activities = [
      { status: 'pending' as const, attempts: 1 },
      { status: 'delivered' as const, attempts: 1 },
      { status: 'delivered' as const, attempts: 1 },
      { status: 'failed' as const, attempts: 3 },
    ];
    const stats = calculateDeliveryStats(activities);
    expect(stats.pending).toBe(1);
    expect(stats.delivered).toBe(2);
    expect(stats.failed).toBe(1);
    expect(stats.totalAttempts).toBe(6);
  });

  it('should return zeros for empty list', () => {
    const stats = calculateDeliveryStats([]);
    expect(stats.pending).toBe(0);
    expect(stats.delivered).toBe(0);
    expect(stats.failed).toBe(0);
    expect(stats.totalAttempts).toBe(0);
  });
});

describe('shouldRetry', () => {
  it('should return true for failed activity under max attempts', () => {
    expect(shouldRetry('failed', 1, 3)).toBe(true);
    expect(shouldRetry('failed', 2, 3)).toBe(true);
  });

  it('should return false for failed activity at max attempts', () => {
    expect(shouldRetry('failed', 3, 3)).toBe(false);
  });

  it('should return false for delivered activities', () => {
    expect(shouldRetry('delivered', 1, 3)).toBe(false);
  });

  it('should return false for pending activities', () => {
    expect(shouldRetry('pending', 0, 3)).toBe(false);
  });
});

describe('getRetryDelay', () => {
  it('should return exponential backoff delays', () => {
    expect(getRetryDelay(0)).toBe(60_000);
    expect(getRetryDelay(1)).toBe(300_000);
    expect(getRetryDelay(2)).toBe(1_800_000);
  });

  it('should cap at max delay for high attempt counts', () => {
    expect(getRetryDelay(5)).toBe(1_800_000);
    expect(getRetryDelay(100)).toBe(1_800_000);
  });
});

describe('formatActivityLog', () => {
  it('should format inbound activity', () => {
    const entry = {
      id: '1',
      type: 'Follow',
      actorUri: 'https://remote.com/users/bob',
      direction: 'inbound' as const,
      status: 'processed',
      createdAt: new Date('2024-01-15T10:00:00Z'),
    };
    const log = formatActivityLog(entry);
    expect(log).toContain('←');
    expect(log).toContain('Follow');
    expect(log).toContain('remote.com');
    expect(log).toContain('processed');
  });

  it('should format outbound activity with objectUri', () => {
    const entry = {
      id: '2',
      type: 'Create',
      actorUri: 'https://local.com/users/alice',
      objectUri: 'https://local.com/content/my-post',
      direction: 'outbound' as const,
      status: 'delivered',
      createdAt: new Date('2024-01-15T12:00:00Z'),
    };
    const log = formatActivityLog(entry);
    expect(log).toContain('→');
    expect(log).toContain('Create');
    expect(log).toContain('my-post');
  });
});
