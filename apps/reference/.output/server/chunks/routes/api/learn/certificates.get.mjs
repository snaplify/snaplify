import { d as defineEventHandler, u as useDB, b4 as getUserCertificates } from '../../../nitro/nitro.mjs';
import { a as requireAuth } from '../../../_/auth.mjs';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import 'zod';
import 'jose';
import 'node:fs';
import 'node:fs/promises';
import 'node:path';
import 'node:stream/promises';
import 'node:crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:url';
import 'drizzle-orm/node-postgres';
import 'pg';
import 'better-auth';
import 'better-auth/adapters/drizzle';
import 'better-auth/plugins';

const certificates_get = defineEventHandler(async (event) => {
  const user = requireAuth(event);
  const db = useDB();
  return getUserCertificates(db, user.id);
});

export { certificates_get as default };
//# sourceMappingURL=certificates.get.mjs.map
