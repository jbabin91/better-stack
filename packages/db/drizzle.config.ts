import { defineConfig } from 'drizzle-kit';

import { env } from './src/configs/env';

export default defineConfig({
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: 'postgresql',
  out: './src/migrations',
  schema: './src/schema',
});
