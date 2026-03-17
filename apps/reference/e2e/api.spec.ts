import { test, expect } from '@playwright/test';

/**
 * API tests — verify public endpoints respond correctly.
 * Uses Playwright's request context (no browser needed).
 */

test.describe('Health endpoint', () => {
  test('GET /api/health returns 200', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('status');
  });
});

test.describe('Stats endpoint', () => {
  test('GET /api/stats returns counts', async ({ request }) => {
    const response = await request.get('/api/stats');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('contentCount');
    expect(body).toHaveProperty('userCount');
    expect(typeof body.contentCount).toBe('number');
    expect(typeof body.userCount).toBe('number');
  });
});

test.describe('Content listing', () => {
  test('GET /api/content returns paginated items', async ({ request }) => {
    const response = await request.get('/api/content?limit=5');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('items');
    expect(Array.isArray(body.items)).toBe(true);
  });

  test('GET /api/content filters by type', async ({ request }) => {
    const response = await request.get('/api/content?type=project&limit=5');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('items');
    expect(Array.isArray(body.items)).toBe(true);
    // If items exist, they should all be projects
    for (const item of body.items) {
      expect(item.type).toBe('project');
    }
  });
});

test.describe('Hubs listing', () => {
  test('GET /api/hubs returns paginated items', async ({ request }) => {
    const response = await request.get('/api/hubs?limit=5');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('items');
    expect(Array.isArray(body.items)).toBe(true);
  });
});

test.describe('Search endpoint', () => {
  test('GET /api/search returns results structure', async ({ request }) => {
    const response = await request.get('/api/search?q=test&limit=5');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('items');
    expect(Array.isArray(body.items)).toBe(true);
  });
});

test.describe('Contests listing', () => {
  test('GET /api/contests returns paginated items', async ({ request }) => {
    const response = await request.get('/api/contests?limit=5');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('items');
    expect(Array.isArray(body.items)).toBe(true);
  });
});

test.describe('Learning paths listing', () => {
  test('GET /api/learn returns paginated items', async ({ request }) => {
    const response = await request.get('/api/learn?limit=5');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('items');
    expect(Array.isArray(body.items)).toBe(true);
  });
});

test.describe('Videos listing', () => {
  test('GET /api/videos returns items', async ({ request }) => {
    const response = await request.get('/api/videos?limit=5');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('items');
    expect(Array.isArray(body.items)).toBe(true);
  });

  test('GET /api/videos/categories returns categories', async ({ request }) => {
    const response = await request.get('/api/videos/categories');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });
});

test.describe('Protected endpoints require auth', () => {
  test('GET /api/profile returns 401 without auth', async ({ request }) => {
    const response = await request.get('/api/profile');
    expect(response.status()).toBe(401);
  });

  test('PUT /api/profile returns 401 without auth', async ({ request }) => {
    const response = await request.put('/api/profile', {
      data: { bio: 'test' },
    });
    expect(response.status()).toBe(401);
  });

  test('POST /api/content returns 401 without auth', async ({ request }) => {
    const response = await request.post('/api/content', {
      data: { title: 'Test', type: 'article' },
    });
    expect(response.status()).toBe(401);
  });

  test('GET /api/notifications/count returns 401 without auth', async ({ request }) => {
    const response = await request.get('/api/notifications/count');
    expect(response.status()).toBe(401);
  });
});

test.describe('Federation endpoints', () => {
  test('GET /.well-known/webfinger returns 400 without resource param', async ({ request }) => {
    const response = await request.get('/.well-known/webfinger');
    // Should return 400 (bad request) not 500
    expect([400, 404, 422]).toContain(response.status());
  });

  test('GET /.well-known/nodeinfo returns nodeinfo links', async ({ request }) => {
    const response = await request.get('/.well-known/nodeinfo');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('links');
    expect(Array.isArray(body.links)).toBe(true);
  });
});
