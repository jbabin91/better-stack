import type { AppType } from '@repo/api/hc';
import { env } from '@web/configs/env';
import { hc } from 'hono/client';

export const apiClient = hc<AppType>(env.VITE_API_URL);
