import { listAuditLogs } from '$lib/server/audit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const action = event.url.searchParams.get('action') ?? undefined;
  const targetType = event.url.searchParams.get('targetType') ?? undefined;
  const page = parseInt(event.url.searchParams.get('page') ?? '1', 10);
  const limit = 50;
  const offset = (page - 1) * limit;

  const { items, total } = await listAuditLogs(event.locals.db, {
    action,
    targetType,
    limit,
    offset,
  });

  return { logs: items, total, page, action, targetType };
};
