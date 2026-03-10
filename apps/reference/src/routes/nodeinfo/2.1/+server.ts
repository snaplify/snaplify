import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { buildNodeInfoResponse } from '@snaplify/snaplify';
import { sql } from 'drizzle-orm';
import { users, contentItems } from '@snaplify/schema';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.config.features.federation) {
    error(404, 'Federation is not enabled');
  }

  const [userCountResult, postCountResult] = await Promise.all([
    locals.db.select({ count: sql<number>`count(*)::int` }).from(users),
    locals.db.select({ count: sql<number>`count(*)::int` }).from(contentItems),
  ]);

  const response = buildNodeInfoResponse({
    config: locals.config,
    version: '0.1.0',
    userCount: userCountResult[0]?.count ?? 0,
    activeMonthCount: 0,
    localPostCount: postCountResult[0]?.count ?? 0,
  });

  return json(response);
};
