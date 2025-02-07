import { drizzle } from 'drizzle-orm/node-postgres';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { env } from './configs/env';
import * as schema from './schema';

export const db: PostgresJsDatabase<typeof schema> = drizzle({
  casing: 'snake_case',
  connection: env.DATABASE_URL,
  schema,
});

export * from './schema';
