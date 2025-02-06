import { hc } from 'hono/client';

import type { AppType } from './app';

// assign the client to a variable to calculate the type when compiling
export const client = hc<AppType>('');
export type Client = typeof client;

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<AppType>(...args);

export type { AppType } from './app';
