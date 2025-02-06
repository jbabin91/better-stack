import { exit } from 'node:process';

import { z, type ZodError } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
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
