import { describe, it, expect } from 'vitest';
import { generateOutboxCollection, generateOutboxPage } from '../outbox';
import { AP_CONTEXT } from '../activityTypes';

const domain = 'test.example.com';
const username = 'alice';

describe('generateOutboxCollection', () => {
  it('should generate an OrderedCollection', () => {
    const collection = generateOutboxCollection(42, domain, username);

    expect(collection['@context']).toBe(AP_CONTEXT);
    expect(collection.type).toBe('OrderedCollection');
    expect(collection.id).toBe('https://test.example.com/users/alice/outbox');
    expect(collection.totalItems).toBe(42);
    expect(collection.first).toBe('https://test.example.com/users/alice/outbox?page=1');
    expect(collection.last).toBe('https://test.example.com/users/alice/outbox?page=last');
  });

  it('should handle zero items', () => {
    const collection = generateOutboxCollection(0, domain, username);
    expect(collection.totalItems).toBe(0);
  });
});

describe('generateOutboxPage', () => {
  it('should generate a page with next/prev links', () => {
    const page = generateOutboxPage([], domain, username, 2, 20, 60);

    expect(page['@context']).toBe(AP_CONTEXT);
    expect(page.type).toBe('OrderedCollectionPage');
    expect(page.id).toBe('https://test.example.com/users/alice/outbox?page=2');
    expect(page.partOf).toBe('https://test.example.com/users/alice/outbox');
    expect(page.next).toBe('https://test.example.com/users/alice/outbox?page=3');
    expect(page.prev).toBe('https://test.example.com/users/alice/outbox?page=1');
  });

  it('should omit prev on first page', () => {
    const page = generateOutboxPage([], domain, username, 1, 20, 40);

    expect(page.prev).toBeUndefined();
    expect(page.next).toBe('https://test.example.com/users/alice/outbox?page=2');
  });

  it('should omit next on last page', () => {
    const page = generateOutboxPage([], domain, username, 3, 20, 60);

    expect(page.next).toBeUndefined();
    expect(page.prev).toBe('https://test.example.com/users/alice/outbox?page=2');
  });

  it('should include activities in orderedItems', () => {
    const activities = [
      {
        '@context': AP_CONTEXT as string,
        type: 'Create' as const,
        id: 'https://test.example.com/activities/1',
        actor: 'https://test.example.com/users/alice',
        object: {
          '@context': AP_CONTEXT as string,
          type: 'Article' as const,
          id: 'https://test.example.com/content/test',
          attributedTo: 'https://test.example.com/users/alice',
          name: 'Test',
          content: 'Hello',
          to: ['https://www.w3.org/ns/activitystreams#Public'],
        },
        to: ['https://www.w3.org/ns/activitystreams#Public'],
      },
    ];

    const page = generateOutboxPage(activities, domain, username, 1, 20, 1);
    expect(page.orderedItems).toHaveLength(1);
    expect(page.orderedItems[0].type).toBe('Create');
  });
});
