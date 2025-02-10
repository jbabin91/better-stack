import { OpenAPIHono } from '@hono/zod-openapi';
import { bodyLimit } from 'hono/body-limit';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { notFound, onError } from 'stoker/middlewares';
import { defaultHook } from 'stoker/openapi';

import { env } from '../configs/env';
import { pinoLogger } from '../middleware/pino-logger';
import { type AppOpenAPI } from '../types';
import { type Env } from './context';

export function createRouter() {
  return new OpenAPIHono<Env>({
    defaultHook,
  });
}

export function createApp() {
  const app = createRouter();

  // Secure headers
  app.use('*', secureHeaders());

  // Health check for render.com
  app.get('/ping', (c) => c.text('pong'));

  app.use(requestId());
  // Logger
  app.use(pinoLogger());

  // CORS
  app.use(
    '*',
    cors({
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: [
        'GET',
        'HEAD',
        'PUT',
        'POST',
        'DELETE',
        'PATCH',
        'OPTIONS',
      ],
      credentials: true,
      origin: [env.FRONTEND_URL, env.BASE_URL],
    }),
  );

  // CSRF protection
  app.use('*', csrf({ origin: [env.FRONTEND_URL, env.BASE_URL] }));

  app.notFound(notFound);
  app.onError(onError);

  // Body limit
  app.use(
    '*',
    bodyLimit({
      maxSize: 1 * 1024 * 1024, // 1mb
      onError: (c) => {
        return c.json(
          {
            message: HttpStatusPhrases.REQUEST_TOO_LONG,
            success: false,
          },
          HttpStatusCodes.REQUEST_TOO_LONG,
        );
      },
    }),
  );

  // TODO: Not currently supported by BUN
  // Compress with gzip
  // Apply gzip compression only to GET requests
  // app.use('*', (c, next) => {
  //   if (c.req.method === 'GET') {
  //     return compress()(c, next);
  //   }
  //   return next();
  // });

  return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
  return createApp().route('/', router);
}
