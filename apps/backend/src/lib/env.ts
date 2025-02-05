import { exit } from 'node:process';

import { z, type ZodError } from 'zod';

const envSchema = z.object({
  BASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  LOG_LEVEL: z.enum([
    'fatal',
    'error',
    'warn',
    'info',
    'debug',
    'trace',
    'silent',
  ]),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
});

export type Env = z.infer<typeof envSchema>;

let env: Env = {} as Env;

try {
  env = envSchema.parse(process.env);
} catch (error_) {
  const error = error_ as ZodError;
  console.error('❌ Error parsing environment variables');
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  exit(1);
}

export { env };
