import type { AppType } from '@repo/api/hc';
import { hc } from 'hono/client';

export const apiClient = hc<AppType>(import.meta.env.VITE_API_URL);
