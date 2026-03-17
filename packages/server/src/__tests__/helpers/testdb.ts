/**
 * PGlite test database helper.
 * Creates an in-memory Postgres instance with the full CommonPub schema.
 * Each call returns a fresh database — no test isolation concerns.
 */
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { pushSchema } from 'drizzle-kit/api';
import * as schema from '@commonpub/schema';
import type { DB } from '../../types.js';

export async function createTestDB(): Promise<DB> {
  const client = new PGlite();
  const db = drizzle(client, { schema });

  // Apply full schema to the in-memory PGlite instance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await pushSchema(schema, db as any);
  if (result.apply) {
    await result.apply();
  }

  return db as unknown as DB;
}

/** Create a test user directly in the database */
export async function createTestUser(
  db: DB,
  overrides: Partial<{
    id: string;
    email: string;
    username: string;
    displayName: string;
    role: string;
  }> = {},
) {
  const id = overrides.id ?? crypto.randomUUID();
  const [user] = await db
    .insert(schema.users)
    .values({
      id,
      email: overrides.email ?? `test-${id.slice(0, 8)}@example.com`,
      username: overrides.username ?? `testuser-${id.slice(0, 8)}`,
      displayName: overrides.displayName ?? 'Test User',
      role: (overrides.role ?? 'member') as 'member' | 'pro' | 'verified' | 'staff' | 'admin',
    })
    .returning();
  return user!;
}
