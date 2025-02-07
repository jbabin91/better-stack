import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  emptyStringAsUndefined: true,
  runtimeEnv: process.env,
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },
});
