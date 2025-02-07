import { defineConfig } from 'drizzle-kit';

import { env } from './src/configs/env';

export default defineConfig({
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: 'postgresql',
  schema: '../db/src/schema',
});
