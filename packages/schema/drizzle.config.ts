import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/*.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://commonpub:commonpub_dev@localhost:5433/commonpub',
  },
});
