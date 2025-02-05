import { env } from '@backend/lib/env';
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './schema';

export const db = drizzle({
  casing: 'snake_case',
  connection: env.DATABASE_URL,
  schema,
});
