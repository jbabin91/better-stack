import { pinoLogger } from '@backend/middleware/pino-logger';
import { type AppBindings, type AppOpenAPI } from '@backend/types';
import { OpenAPIHono } from '@hono/zod-openapi';
import { requestId } from 'hono/request-id';
import { notFound, onError } from 'stoker/middlewares';
import { defaultHook } from 'stoker/openapi';

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    defaultHook,
    strict: false,
  });
}

export function createApp() {
  const app = createRouter();
  app.use(requestId());
  app.use(pinoLogger());

  app.notFound(notFound);
  app.onError(onError);

  return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
  return createApp().route('/', router);
}
