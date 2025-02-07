import { auth } from './lib/auth';
import { configureOpenAPI } from './lib/configure-openapi';
import { createApp } from './lib/create-app';
import { indexRouter, tasksRouter } from './routes';

const app = createApp();

configureOpenAPI(app);

app.on(['POST', 'GET'], '/auth/**', (c) => {
  return auth.handler(c.req.raw);
});

export const routes = app.route('/', indexRouter).route('/', tasksRouter);

export default app;
export type AppType = typeof routes;
