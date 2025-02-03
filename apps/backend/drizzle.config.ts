import 'dotenv/config';

import { execSync } from 'node:child_process';

import { defineConfig } from 'drizzle-kit';

declare global {
  type Process = {
    env: {
      DATABASE_ID: string;
      ACCOUNT_ID: string;
      TOKEN: string;
      NODE_ENV: string;
    };
  };
}

const getSqlitePath = () => {
  try {
    return execSync(
      'find .wrangler/state/v3/d1/miniflare-D1DatabaseObject -type f -name "*.sqlite" -print -quit',
      { encoding: 'utf8' },
    ).trim();
  } catch {
    console.error('Failed to find SQLite database file');
    return '';
  }
};

const cloudflareConfig = defineConfig({
  dbCredentials: {
    accountId: process.env.ACCOUNT_ID ?? '',
    databaseId: process.env.DATABASE_ID ?? '',
    token: process.env.TOKEN ?? '',
  },
  dialect: 'sqlite',
  driver: 'd1-http',
  out: './drizzle',
  schema: './src/db/schema.ts',
});

const localConfig = defineConfig({
  dbCredentials: {
    url: `file:${getSqlitePath()}`,
  },
  dialect: 'sqlite',
  out: './drizzle',
  schema: './src/db/schema.ts',
});

const config =
  process.env.NODE_ENV === 'production' ? cloudflareConfig : localConfig;
console.log(
  `Using ${process.env.NODE_ENV === 'production' ? 'cloudflare' : 'local'} config`,
);
export default config;
