import type { AppType } from '@repo/api/hc';
import { env } from '@web/configs/env';
import { type ClientResponse, hc } from 'hono/client';

export const handleResponse = async <
  T extends Record<string, any>,
  U extends ClientResponse<T, number, 'json'>,
>(
  response: U,
) => {
  if (response.ok) {
    const json = await response.json();
    return json as Awaited<ReturnType<Extract<U, { status: 200 }>['json']>>;
  }

  const json = await response.json();
  if ('error' in json) throw new Error(json.error);
  throw new Error('Unknown error');
};

const clientConfig = {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: 'include',
    }),
};

export const apiClient = hc<AppType>(env.VITE_API_URL, clientConfig);
